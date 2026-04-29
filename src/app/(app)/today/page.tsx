import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TodayDashboard } from "./TodayDashboard";
import type { ReminderWithBuyer } from "@/types/reminders";
import type { Buyer } from "@/types/database";

export const metadata = { title: "Today — BuyerPocket" };

const BUYER_FIELDS =
  "id, name, phone, email, buyer_temperature, budget_min, budget_max, preferred_suburbs";
const REMINDER_FIELDS = `id, user_id, buyer_id, reminder_type, reminder_note, reminder_at, timezone, priority, status, sent_at, completed_at, snoozed_until, created_at, updated_at, buyer:buyers!buyer_id(${BUYER_FIELDS})`;

export default async function TodayPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("eligibility_acknowledged_at, state, name")
    .eq("id", user.id)
    .single();

  if (!profile?.eligibility_acknowledged_at) redirect("/signup/eligibility");
  if (!profile?.state) redirect("/signup/profile");

  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [
    todayRes,
    overdueRes,
    hotRes,
    recentRes,
    thisWeekCountRes,
    todayCountRes,
    overdueCountRes,
  ] = await Promise.all([
    supabase
      .from("reminders")
      .select(REMINDER_FIELDS)
      .eq("user_id", user.id)
      .in("status", ["pending", "sent"])
      .gte("reminder_at", todayStart.toISOString())
      .lte("reminder_at", todayEnd.toISOString())
      .order("reminder_at", { ascending: true })
      .limit(20),
    supabase
      .from("reminders")
      .select(REMINDER_FIELDS)
      .eq("user_id", user.id)
      .eq("status", "pending")
      .lt("reminder_at", todayStart.toISOString())
      .order("reminder_at", { ascending: true })
      .limit(10),
    supabase
      .from("buyers")
      .select("*")
      .eq("user_id", user.id)
      .is("archived_at", null)
      .eq("buyer_temperature", "hot")
      .order("updated_at", { ascending: false })
      .limit(10),
    supabase
      .from("buyers")
      .select("*")
      .eq("user_id", user.id)
      .is("archived_at", null)
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("buyers")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .is("archived_at", null)
      .gte("created_at", weekAgo.toISOString()),
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
      .eq("status", "pending")
      .lt("reminder_at", todayStart.toISOString()),
  ]);

  return (
    <TodayDashboard
      profileName={profile.name}
      todayReminders={(todayRes.data ?? []) as unknown as ReminderWithBuyer[]}
      overdueReminders={(overdueRes.data ?? []) as unknown as ReminderWithBuyer[]}
      hotBuyers={(hotRes.data ?? []) as Buyer[]}
      recentlyAdded={(recentRes.data ?? []) as Buyer[]}
      todayCount={todayCountRes.count ?? 0}
      overdueCount={overdueCountRes.count ?? 0}
      buyersThisWeek={thisWeekCountRes.count ?? 0}
    />
  );
}
