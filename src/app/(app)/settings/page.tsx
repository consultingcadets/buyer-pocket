import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getAccessLevel } from "@/lib/subscription";
import { isBillingSkipped } from "@/lib/billing-flags";
import { SettingsClient } from "./SettingsClient";

export const metadata = { title: "Settings — BuyerPocket" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [profileRes, pushTokensRes, subRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("push_tokens")
      .select("*")
      .eq("user_id", user.id)
      .order("last_used_at", { ascending: false }),
    supabase.from("subscriptions").select("*").eq("user_id", user.id).maybeSingle(),
  ]);

  if (!profileRes.data) redirect("/signup/profile");

  const meta = user.user_metadata ?? {};
  const notifPrefs = {
    push_enabled: meta.notif_push_enabled ?? true,
    email_enabled: meta.notif_email_enabled ?? true,
    reminder_alerts: meta.notif_reminder_alerts ?? true,
    weekly_summary: meta.notif_weekly_summary ?? false,
  };

  const subscription = subRes.data;
  const billingSkipped = isBillingSkipped();
  const accessLevel = getAccessLevel(subscription);

  return (
    <SettingsClient
      profile={profileRes.data}
      email={user.email ?? ""}
      pushTokens={pushTokensRes.data ?? []}
      notifPrefs={notifPrefs}
      subscription={subscription}
      accessLevel={accessLevel}
      billingSkipped={billingSkipped}
    />
  );
}
