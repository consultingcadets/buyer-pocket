import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendPushNotification, isInvalidTokenError } from "@/lib/fcm/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  // Auth: Supabase pg_cron sends Authorization: Bearer <secret>
  // Also accept X-Cron-Secret for local curl testing
  const auth = request.headers.get("authorization");
  const cronHeader = request.headers.get("x-cron-secret");
  const secret = process.env.CRON_SECRET;

  if (auth !== `Bearer ${secret}` && cronHeader !== secret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = supabaseAdmin;
  const now = new Date().toISOString();

  // Reactivate snoozed reminders whose snooze window has passed
  await supabase
    .from("reminders")
    .update({ status: "pending" })
    .eq("status", "snoozed")
    .lte("snoozed_until", now);

  // Claim pending reminders due now (LIMIT 100 per run)
  const { data: reminders, error: fetchErr } = await supabase
    .from("reminders")
    .select(
      "id, user_id, buyer_id, reminder_type, reminder_note, reminder_at, buyer:buyers!buyer_id(id, name, phone, email, buyer_temperature, preferred_suburbs, budget_min, budget_max)"
    )
    .eq("status", "pending")
    .lte("reminder_at", now)
    .limit(100);

  if (fetchErr) {
    console.error("[cron] fetch error:", fetchErr.message);
    return Response.json({ error: fetchErr.message }, { status: 500 });
  }

  if (!reminders?.length) {
    return Response.json({ processed: 0 });
  }

  let processed = 0;

  for (const reminder of reminders) {
    // Atomic claim: only one cron run wins per reminder
    const { data: claimed } = await supabase
      .from("reminders")
      .update({ status: "processing" })
      .eq("id", reminder.id)
      .eq("status", "pending")
      .select("id")
      .single();

    if (!claimed) continue; // Another run already claimed it

    const buyer = reminder.buyer as {
      id: string;
      name: string;
      phone: string | null;
      email: string | null;
      preferred_suburbs: string[] | null;
      budget_min: number | null;
      budget_max: number | null;
    };

    // Get push tokens for this user
    const { data: tokens } = await supabase
      .from("push_tokens")
      .select("token")
      .eq("user_id", reminder.user_id)
      .eq("is_active", true);

    const reminderType = reminder.reminder_type as string | null;
    const title = `Reminder: ${reminderType ? reminderType + " " : ""}${buyer.name}`;
    const suburb = buyer.preferred_suburbs?.[0]?.split(",")?.[0] ?? null;
    const budgetMin = buyer.budget_min;
    const budgetMax = buyer.budget_max;
    const budgetStr = budgetMin
      ? `$${Math.round(budgetMin / 1000)}k${budgetMax ? `–$${Math.round(budgetMax / 1000)}k` : "+"}`
      : null;
    const infoLine = [suburb, budgetStr].filter(Boolean).join(", ");
    const body = reminder.reminder_note ?? (infoLine || `Check in with ${buyer.name}`);

    let pushSent = false;

    // Send FCM push to all active tokens
    if (tokens?.length) {
      for (const { token } of tokens) {
        try {
          await sendPushNotification({
            token,
            title,
            body,
            data: {
              buyerId: buyer.id,
              reminderId: reminder.id,
            },
          });
          pushSent = true;
        } catch (err) {
          if (isInvalidTokenError(err)) {
            await supabase
              .from("push_tokens")
              .update({ is_active: false })
              .eq("token", token);
          }
          console.error("[cron] FCM error for token:", err);
        }
      }
    }

    // In-app notification record
    await supabase.from("notifications").insert({
      user_id: reminder.user_id,
      buyer_id: reminder.buyer_id,
      reminder_id: reminder.id,
      title,
      message: body,
      channel: pushSent ? "push" : "email",
      status: "sent",
      is_read: false,
      sent_at: now,
    });

    // Email fallback when no push tokens or all FCM sends failed
    if (!pushSent && process.env.RESEND_API_KEY) {
      try {
        const { data: authUser } = await supabase.auth.admin.getUserById(reminder.user_id);
        const email = authUser.user?.email;
        if (email) {
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL ?? "noreply@buyerpocket.com",
            to: email,
            subject: `BuyerPocket: ${title}`,
            html: `
              <p>Hi there,</p>
              <p>You have a reminder for <strong>${buyer.name}</strong>.</p>
              <p>${body}</p>
              <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/buyers/${buyer.id}">Open buyer profile →</a></p>
            `,
          });
        }
      } catch (emailErr) {
        console.error("[cron] email fallback error:", emailErr);
      }
    }

    // Mark reminder as sent
    await supabase
      .from("reminders")
      .update({ status: "sent", sent_at: now })
      .eq("id", reminder.id);

    processed++;
  }

  return Response.json({ processed });
}
