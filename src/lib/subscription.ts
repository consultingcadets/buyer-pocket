import { getStripeOrNull } from "./stripe";
import { supabaseAdmin } from "./supabase/admin";
import { isBillingSkipped } from "./billing-flags";
import type { Subscription } from "@/types/database";

export type AccessLevel = "full" | "read_only" | "export_only" | "expired";
export type BannerType = "none" | "trial_warning" | "trial_urgent" | "past_due" | "trial_ended";

export function getAccessLevel(sub: Subscription | null): AccessLevel {
  if (isBillingSkipped()) return "full";

  if (!sub || !sub.status) return "expired";

  if (sub.status === "trialing" || sub.status === "active") return "full";

  if (sub.status === "past_due" || sub.status === "unpaid") return "read_only";

  if (sub.status === "canceled") {
    const now = new Date();
    const periodEnd = sub.current_period_end ? new Date(sub.current_period_end) : null;

    if (!periodEnd) return "expired";
    if (now <= periodEnd) return "read_only";

    const exportCutoff = new Date(periodEnd);
    exportCutoff.setDate(exportCutoff.getDate() + 30);
    return now <= exportCutoff ? "export_only" : "expired";
  }

  return "expired";
}

export function getBannerType(sub: Subscription | null): BannerType {
  if (isBillingSkipped()) return "none";

  if (!sub || !sub.status) return "trial_ended";

  if (sub.status === "trialing" && sub.trial_end) {
    const now = new Date();
    const trialEnd = new Date(sub.trial_end);
    const msLeft = trialEnd.getTime() - now.getTime();

    if (msLeft <= 0) return "trial_ended";

    const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
    if (daysLeft <= 1) return "trial_urgent";  // day 7 (≤1 day left)
    if (daysLeft <= 4) return "trial_warning"; // days 4–6 elapsed (2–4 days left)
    return "none";
  }

  if (sub.status === "past_due" || sub.status === "unpaid") return "past_due";

  return "none";
}

function toIso(unix: number | null): string | null {
  return unix ? new Date(unix * 1000).toISOString() : null;
}

export async function upsertSubscription(
  stripeSubscription: import("stripe").Stripe.Subscription
): Promise<void> {
  const userId =
    stripeSubscription.metadata?.user_id ??
    (await getUserIdByCustomer(stripeSubscription.customer as string));

  if (!userId) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = stripeSubscription as any;
  await supabaseAdmin.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: stripeSubscription.customer as string,
      stripe_subscription_id: stripeSubscription.id,
      status: stripeSubscription.status,
      current_period_start: toIso(s.current_period_start),
      current_period_end: toIso(s.current_period_end),
      trial_start: toIso(s.trial_start ?? null),
      trial_end: toIso(s.trial_end ?? null),
      cancel_at_period_end: stripeSubscription.cancel_at_period_end,
      cancel_at: toIso(s.cancel_at ?? null),
    },
    { onConflict: "user_id" }
  );
}

async function getUserIdByCustomer(customerId: string): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .single();
  return data?.user_id ?? null;
}

export async function startTrialIfNeeded(
  userId: string,
  userEmail: string
): Promise<Subscription | null> {
  if (isBillingSkipped()) return null;

  const { data: existing } = await supabaseAdmin
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) return existing as Subscription;

  const stripe = getStripeOrNull();
  if (!stripe) {
    // Stripe not configured — create a local trial row so the app stays usable.
    // Replace with real Stripe keys (and set STRIPE_PRICE_ID) before accepting payments.
    console.warn("[subscription] STRIPE_SECRET_KEY missing — creating local trial row. Set SKIP_BILLING=1 or add Stripe keys.");
    const now = new Date();
    const trialEnd = new Date(now);
    trialEnd.setDate(trialEnd.getDate() + 7);
    const { data } = await supabaseAdmin
      .from("subscriptions")
      .upsert(
        {
          user_id: userId,
          status: "trialing",
          trial_start: now.toISOString(),
          trial_end: trialEnd.toISOString(),
          current_period_start: now.toISOString(),
          current_period_end: trialEnd.toISOString(),
          cancel_at_period_end: false,
        },
        { onConflict: "user_id" }
      )
      .select("*")
      .single();
    return (data as Subscription) ?? null;
  }

  const customer = await stripe.customers.create({
    email: userEmail,
    metadata: { user_id: userId },
  });

  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: process.env.STRIPE_PRICE_ID! }],
    trial_period_days: 7,
    payment_settings: { save_default_payment_method: "on_subscription" },
    trial_settings: { end_behavior: { missing_payment_method: "cancel" } },
    metadata: { user_id: userId },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s2 = subscription as any;
  const row = {
    user_id: userId,
    stripe_customer_id: customer.id,
    stripe_subscription_id: subscription.id,
    status: subscription.status,
    current_period_start: toIso(s2.current_period_start),
    current_period_end: toIso(s2.current_period_end),
    trial_start: toIso(s2.trial_start ?? null),
    trial_end: toIso(s2.trial_end ?? null),
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: toIso(s2.cancel_at ?? null),
  };

  const { data } = await supabaseAdmin
    .from("subscriptions")
    .upsert(row, { onConflict: "user_id" })
    .select("*")
    .single();

  return (data as Subscription) ?? null;
}
