import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { startTrialIfNeeded } from "@/lib/subscription";
import { BillingGuard } from "@/components/billing/BillingGuard";
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
    .single();

  let subscription = rawSub as Subscription | null;

  if (!subscription) {
    subscription = await startTrialIfNeeded(user.id, user.email ?? "");
  }

  return <BillingGuard subscription={subscription}>{children}</BillingGuard>;
}
