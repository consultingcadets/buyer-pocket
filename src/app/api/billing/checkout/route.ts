import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getStripeOrNull } from "@/lib/stripe";
import { isBillingSkipped } from "@/lib/billing-flags";
import { getPublicAppUrl } from "@/lib/app-url";

export async function POST() {
  const stripe = getStripeOrNull();
  if (isBillingSkipped() || !stripe) {
    return NextResponse.json(
      { error: "Stripe billing is not enabled. Remove SKIP_BILLING or configure STRIPE_SECRET_KEY." },
      { status: 503 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { data: sub } = await supabaseAdmin
    .from("subscriptions")
    .select("stripe_customer_id, stripe_subscription_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!sub?.stripe_customer_id) {
    return NextResponse.json({ error: "No subscription found" }, { status: 400 });
  }

  const origin = getPublicAppUrl();

  const session = await stripe.checkout.sessions.create({
    mode: "setup",
    currency: "aud",
    customer: sub.stripe_customer_id,
    setup_intent_data: {
      metadata: {
        customer_id: sub.stripe_customer_id,
        subscription_id: sub.stripe_subscription_id ?? "",
      },
    },
    success_url: `${origin}/api/billing/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/settings`,
  });

  return NextResponse.json({ url: session.url });
}
