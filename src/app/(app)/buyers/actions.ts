"use server";

import { createClient } from "@/lib/supabase/server";
import { PAGE_SIZE, type BuyerFilters, type SortOption } from "@/lib/buyer-filters";
import type { Buyer } from "@/types/database";

function buildQuery(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  baseQuery: any,
  filters: BuyerFilters
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  let q = baseQuery;

  if (filters.search?.trim()) {
    q = q.textSearch("searchable_text", filters.search.trim(), {
      type: "websearch",
      config: "english",
    });
  }

  if (filters.suburbs?.length) {
    q = q.overlaps("preferred_suburbs", filters.suburbs);
  }

  // Budget overlap: buyer range overlaps filter range
  if (filters.budgetMin != null) q = q.gte("budget_max", filters.budgetMin);
  if (filters.budgetMax != null) q = q.lte("budget_min", filters.budgetMax);

  if (filters.bedrooms && filters.bedrooms !== "Any") {
    const all = ["Any", "1+", "2+", "3+", "4+", "5+"];
    const idx = all.indexOf(filters.bedrooms);
    q = q.in("bedrooms", all.slice(idx));
  }

  if (filters.landSizeMin && filters.landSizeMin !== "Any") {
    const val = parseInt(filters.landSizeMin); // "300m²" → 300
    if (!isNaN(val)) q = q.gte("land_size_min", val);
  }

  if (filters.propertyTypes?.length) {
    q = q.in("property_type", filters.propertyTypes);
  }

  if (filters.temperatures?.length) {
    q = q.in("buyer_temperature", filters.temperatures);
  }

  if (filters.buyingTimeline) {
    q = q.eq("buying_timeline", filters.buyingTimeline);
  }

  if (filters.leadStatus) {
    q = q.eq("lead_status", filters.leadStatus);
  }

  const now = new Date();

  switch (filters.reminderDue) {
    case "today": {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      q = q.gte("next_reminder_at", start.toISOString()).lte("next_reminder_at", end.toISOString());
      break;
    }
    case "this_week": {
      const end = new Date(now);
      end.setDate(end.getDate() + 7);
      q = q.gte("next_reminder_at", now.toISOString()).lte("next_reminder_at", end.toISOString());
      break;
    }
    case "overdue":
      q = q.lt("next_reminder_at", now.toISOString()).not("next_reminder_at", "is", null);
      break;
    case "none":
      q = q.is("next_reminder_at", null);
      break;
  }

  switch (filters.lastContacted) {
    case "this_week": {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      q = q.gte("last_contacted_at", d.toISOString());
      break;
    }
    case "this_month": {
      const d = new Date(now);
      d.setMonth(d.getMonth() - 1);
      q = q.gte("last_contacted_at", d.toISOString());
      break;
    }
    case "over_month": {
      const d = new Date(now);
      d.setMonth(d.getMonth() - 1);
      q = q.lt("last_contacted_at", d.toISOString());
      break;
    }
    case "never":
      q = q.is("last_contacted_at", null);
      break;
  }

  switch (filters.dateAdded) {
    case "last_week": {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      q = q.gte("created_at", d.toISOString());
      break;
    }
    case "last_fortnight": {
      const d = new Date(now);
      d.setDate(d.getDate() - 14);
      q = q.gte("created_at", d.toISOString());
      break;
    }
    case "last_month": {
      const d = new Date(now);
      d.setMonth(d.getMonth() - 1);
      q = q.gte("created_at", d.toISOString());
      break;
    }
    case "last_3_months": {
      const d = new Date(now);
      d.setMonth(d.getMonth() - 3);
      q = q.gte("created_at", d.toISOString());
      break;
    }
  }

  return q;
}

export async function fetchBuyers(
  filters: BuyerFilters,
  sort: SortOption,
  page: number
): Promise<{ buyers: Buyer[]; count: number; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { buyers: [], count: 0, error: "Not authenticated" };

  let q = supabase
    .from("buyers")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .is("archived_at", null);

  q = buildQuery(q, filters);

  // Sort
  switch (sort) {
    case "last_updated":
      q = q.order("updated_at", { ascending: false });
      break;
    case "last_contacted":
      q = q.order("last_contacted_at", { ascending: false, nullsFirst: false });
      break;
    case "next_reminder":
      q = q.order("next_reminder_at", { ascending: true, nullsFirst: false });
      break;
    case "temperature":
      q = q.order("temperature_sort", { ascending: true, nullsFirst: false });
      break;
    default:
      q = q.order("created_at", { ascending: false });
  }

  q = q.range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

  const { data, count, error } = await q;
  if (error) return { buyers: [], count: 0, error: error.message };
  return { buyers: (data ?? []) as Buyer[], count: count ?? 0 };
}

export async function getFilteredCount(
  filters: BuyerFilters
): Promise<{ count: number; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { count: 0, error: "Not authenticated" };

  let q = supabase
    .from("buyers")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .is("archived_at", null);

  q = buildQuery(q, filters);

  const { count, error } = await q;
  if (error) return { count: 0, error: error.message };
  return { count: count ?? 0 };
}

export async function exportBuyersCSV(
  filters: BuyerFilters,
  sort: SortOption
): Promise<{ csv: string; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { csv: "", error: "Not authenticated" };

  let q = supabase
    .from("buyers")
    .select("name, phone, email, preferred_suburbs, budget_min, budget_max, bedrooms, land_size_min, property_type, buyer_temperature, buying_timeline, lead_status, notes_summary, last_contacted_at, created_at")
    .eq("user_id", user.id)
    .is("archived_at", null);

  q = buildQuery(q, filters);

  switch (sort) {
    case "last_updated": q = q.order("updated_at", { ascending: false }); break;
    case "last_contacted": q = q.order("last_contacted_at", { ascending: false, nullsFirst: false }); break;
    case "next_reminder": q = q.order("next_reminder_at", { ascending: true, nullsFirst: false }); break;
    case "temperature": q = q.order("temperature_sort", { ascending: true, nullsFirst: false }); break;
    default: q = q.order("created_at", { ascending: false });
  }

  const { data, error } = await q;
  if (error) return { csv: "", error: error.message };

  const rows = data ?? [];
  const headers = ["Name", "Phone", "Email", "Suburbs", "Budget Min", "Budget Max", "Bedrooms", "Land Size Min (m²)", "Property Type", "Temperature", "Buying Timeline", "Lead Status", "Notes", "Last Contacted", "Date Added"];

  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const lines = [
    headers.join(","),
    ...rows.map((r) => [
      r.name, r.phone, r.email,
      (r.preferred_suburbs as string[] ?? []).join("; "),
      r.budget_min, r.budget_max,
      r.bedrooms, r.land_size_min,
      r.property_type, r.buyer_temperature,
      r.buying_timeline, r.lead_status,
      r.notes_summary,
      r.last_contacted_at ? new Date(r.last_contacted_at).toLocaleDateString("en-AU") : "",
      new Date(r.created_at).toLocaleDateString("en-AU"),
    ].map(escape).join(",")),
  ];

  return { csv: lines.join("\n") };
}

export async function archiveBuyer(
  buyerId: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("buyers")
    .update({ archived_at: new Date().toISOString() })
    .eq("id", buyerId)
    .eq("user_id", user.id);

  return error ? { error: error.message } : {};
}
