import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function fmtDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = Array.isArray(value) ? value.join("; ") : String(value);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  // Fetch all non-archived buyers
  const { data: buyers, error } = await supabase
    .from("buyers")
    .select("*")
    .eq("user_id", user.id)
    .is("archived_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!buyers || buyers.length === 0) {
    return NextResponse.json({ error: "No buyers to export" }, { status: 404 });
  }

  // Fetch notes counts + latest note date per buyer
  const { data: noteAgg } = await supabase
    .from("notes")
    .select("buyer_id, created_at")
    .eq("user_id", user.id)
    .in(
      "buyer_id",
      buyers.map((b) => b.id)
    )
    .order("created_at", { ascending: false });

  // Fetch reminders counts per buyer
  const { data: reminderAgg } = await supabase
    .from("reminders")
    .select("buyer_id, reminder_at, status")
    .eq("user_id", user.id)
    .in(
      "buyer_id",
      buyers.map((b) => b.id)
    );

  // Build lookup maps
  const notesMap = new Map<string, { count: number; latest: string | null }>();
  for (const note of noteAgg ?? []) {
    const existing = notesMap.get(note.buyer_id);
    if (!existing) {
      notesMap.set(note.buyer_id, { count: 1, latest: note.created_at });
    } else {
      existing.count += 1;
      // Notes are ordered newest-first so first seen is latest
    }
  }

  const remindersMap = new Map<
    string,
    { count: number; next: string | null }
  >();
  for (const r of reminderAgg ?? []) {
    const existing = remindersMap.get(r.buyer_id);
    if (!existing) {
      remindersMap.set(r.buyer_id, {
        count: 1,
        next:
          r.status === "pending" || r.status === "snoozed" ? r.reminder_at : null,
      });
    } else {
      existing.count += 1;
      if (
        (r.status === "pending" || r.status === "snoozed") &&
        (!existing.next || r.reminder_at < existing.next)
      ) {
        existing.next = r.reminder_at;
      }
    }
  }

  // CSV headers
  const headers = [
    "Name",
    "Phone",
    "Email",
    "Preferred Suburbs",
    "Budget Min (AUD)",
    "Budget Max (AUD)",
    "Bedrooms",
    "Bathrooms",
    "Car Spaces",
    "Property Type",
    "House Type",
    "Condition",
    "Land Size Min (m²)",
    "Building Size Min (squares)",
    "Block Preference",
    "Must-Haves",
    "Other Must-Haves",
    "Deal Breakers",
    "Buyer Temperature",
    "Lead Status",
    "Buyer Type",
    "Finance Status",
    "Deposit Ready",
    "Buying Timeline",
    "Lead Source",
    "Preferred Contact Method",
    "Best Time to Contact",
    "Contact Consent",
    "Notes Summary",
    "Notes Count",
    "Latest Note Date",
    "Next Reminder At",
    "Reminders Count",
    "Last Contacted",
    "Added Date",
  ];

  const rows = buyers.map((b) => {
    const notes = notesMap.get(b.id) ?? { count: 0, latest: null };
    const reminders = remindersMap.get(b.id) ?? { count: 0, next: null };

    return [
      escapeCsv(b.name),
      escapeCsv(b.phone),
      escapeCsv(b.email),
      escapeCsv(b.preferred_suburbs),
      escapeCsv(b.budget_min),
      escapeCsv(b.budget_max),
      escapeCsv(b.bedrooms),
      escapeCsv(b.bathrooms),
      escapeCsv(b.car_spaces),
      escapeCsv(b.property_type),
      escapeCsv(b.house_type),
      escapeCsv(b.condition_preference),
      escapeCsv(b.land_size_min),
      escapeCsv(b.building_size_min),
      escapeCsv(b.block_preference),
      escapeCsv(b.must_haves),
      escapeCsv(b.other_must_haves),
      escapeCsv(b.deal_breakers),
      escapeCsv(b.buyer_temperature),
      escapeCsv(b.lead_status),
      escapeCsv(b.buyer_type),
      escapeCsv(b.finance_status),
      escapeCsv(b.deposit_ready),
      escapeCsv(b.buying_timeline),
      escapeCsv(b.lead_source),
      escapeCsv(b.preferred_contact_method),
      escapeCsv(b.best_time_to_contact),
      escapeCsv(b.contact_consent),
      escapeCsv(b.notes_summary),
      escapeCsv(notes.count),
      escapeCsv(fmtDate(notes.latest)),
      escapeCsv(fmtDate(reminders.next)),
      escapeCsv(reminders.count),
      escapeCsv(fmtDate(b.last_contacted_at)),
      escapeCsv(fmtDate(b.created_at)),
    ].join(",");
  });

  const csv = [headers.join(","), ...rows].join("\r\n");

  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
  const filename = `buyerpocket-export-${today}.csv`;

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
