import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  getAccessLevel,
  getBannerType,
  startTrialIfNeeded,
} from "@/lib/subscription";
import { BillingGuard } from "@/components/billing/BillingGuard";
import { isBillingSkipped } from "@/lib/billing-flags";
import type { Subscription } from "@/types/database";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: rawSub } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  let subscription = rawSub as Subscription | null;

  if (!subscription && !isBillingSkipped()) {
    try {
      subscription = await startTrialIfNeeded(user.id, user.email ?? "");
    } catch (e) {
      console.error("[app layout] startTrialIfNeeded failed:", e);
      subscription = null;
    }
  }

  const accessLevel = getAccessLevel(subscription);
  const bannerType = getBannerType(subscription);

  return (
    <BillingGuard accessLevel={accessLevel} bannerType={bannerType}>
      {children}
    </BillingGuard>
  );
}
