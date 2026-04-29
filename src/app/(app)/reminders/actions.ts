"use server";

import { createClient } from "@/lib/supabase/server";
import { getReminderDate } from "@/lib/reminder-utils";
import type { ReminderWithBuyer } from "@/types/reminders";
import type { ReminderChip } from "@/lib/reminder-utils";

export type ReminderTab = "today" | "upcoming" | "overdue" | "completed";

export async function fetchReminders(tab: ReminderTab): Promise<{
  reminders: ReminderWithBuyer[];
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { reminders: [], error: "Not authenticated" };

  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  let q = supabase
    .from("reminders")
    .select("*, buyer:buyers!buyer_id(id, name, phone, email, buyer_temperature, budget_min, budget_max, preferred_suburbs)")
    .eq("user_id", user.id);

  switch (tab) {
    case "today":
      q = q
        .in("status", ["pending", "sent"])
        .gte("reminder_at", todayStart.toISOString())
        .lte("reminder_at", todayEnd.toISOString())
        .order("reminder_at", { ascending: true });
      break;
    case "upcoming":
      q = q
        .in("status", ["pending", "snoozed"])
        .gt("reminder_at", todayEnd.toISOString())
        .order("reminder_at", { ascending: true });
      break;
    case "overdue":
      q = q
        .eq("status", "pending")
        .lt("reminder_at", todayStart.toISOString())
        .order("reminder_at", { ascending: true });
      break;
    case "completed":
      q = q
        .eq("status", "completed")
        .order("completed_at", { ascending: false })
        .limit(100);
      break;
  }

  const { data, error } = await q;
  if (error) return { reminders: [], error: error.message };
  return { reminders: (data ?? []) as unknown as ReminderWithBuyer[] };
}

export async function fetchReminderCounts(): Promise<{
  today: number;
  upcoming: number;
  overdue: number;
  completed: number;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { today: 0, upcoming: 0, overdue: 0, completed: 0 };

  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  const [todayRes, upcomingRes, overdueRes, completedRes] = await Promise.all([
    supabase
      .from("reminders")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .in("status", ["pending", "sent"])
      .gte("reminder_at", todayStart.toISOString())
      .lte("reminder_at", todayEnd.toISOString()),
    supabase
      .from("reminders")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .in("status", ["pending", "snoozed"])
      .gt("reminder_at", todayEnd.toISOString()),
    supabase
      .from("reminders")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "pending")
      .lt("reminder_at", todayStart.toISOString()),
    supabase
      .from("reminders")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "completed"),
  ]);

  return {
    today: todayRes.count ?? 0,
    upcoming: upcomingRes.count ?? 0,
    overdue: overdueRes.count ?? 0,
    completed: completedRes.count ?? 0,
  };
}

export async function completeReminder(reminderId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: reminder, error: fetchErr } = await supabase
    .from("reminders")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", reminderId)
    .eq("user_id", user.id)
    .select("buyer_id")
    .single();

  if (fetchErr) return { error: fetchErr.message };

  // Update buyer's next_reminder_at to the next pending reminder
  const { data: nextReminder } = await supabase
    .from("reminders")
    .select("reminder_at")
    .eq("buyer_id", reminder.buyer_id)
    .eq("user_id", user.id)
    .eq("status", "pending")
    .order("reminder_at", { ascending: true })
    .limit(1)
    .single();

  await supabase
    .from("buyers")
    .update({ next_reminder_at: nextReminder?.reminder_at ?? null })
    .eq("id", reminder.buyer_id)
    .eq("user_id", user.id);

  return {};
}

export async function snoozeReminder(
  reminderId: string,
  snoozedUntil: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("reminders")
    .update({
      status: "snoozed",
      snoozed_until: snoozedUntil,
      reminder_at: snoozedUntil,
    })
    .eq("id", reminderId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  return {};
}

export async function setReminder(
  buyerId: string,
  reminderAt: string,
  reminderType: string | null,
  reminderNote: string | null
): Promise<{ reminderId?: string; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("reminders")
    .insert({
      user_id: user.id,
      buyer_id: buyerId,
      reminder_at: reminderAt,
      reminder_type: reminderType,
      reminder_note: reminderNote,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  // Keep buyers.next_reminder_at as the soonest pending reminder
  const { data: current } = await supabase
    .from("buyers")
    .select("next_reminder_at")
    .eq("id", buyerId)
    .eq("user_id", user.id)
    .single();

  const shouldUpdate =
    !current?.next_reminder_at ||
    new Date(reminderAt) < new Date(current.next_reminder_at);

  if (shouldUpdate) {
    await supabase
      .from("buyers")
      .update({ next_reminder_at: reminderAt })
      .eq("id", buyerId)
      .eq("user_id", user.id);
  }

  return { reminderId: data.id };
}

export async function savePushToken(
  token: string,
  deviceType: string,
  browser: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("push_tokens").upsert(
    {
      user_id: user.id,
      token,
      device_type: deviceType,
      browser,
      is_active: true,
      last_used_at: new Date().toISOString(),
    },
    { onConflict: "token" }
  );

  return error ? { error: error.message } : {};
}
