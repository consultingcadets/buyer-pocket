import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { RemindersClient } from "./RemindersClient";
import { fetchReminders, fetchReminderCounts } from "./actions";

export const metadata = { title: "Reminders — BuyerPocket" };

export default async function RemindersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ reminders }, counts] = await Promise.all([
    fetchReminders("today"),
    fetchReminderCounts(),
  ]);

  return (
    <RemindersClient
      initialTab="today"
      initialReminders={reminders}
      counts={counts}
    />
  );
}
