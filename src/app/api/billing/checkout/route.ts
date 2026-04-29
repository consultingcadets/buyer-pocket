import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { data: sub } = await supabaseAdmin
    .from("subscriptions")
    .select("stripe_customer_id, stripe_subscription_id")
    .eq("user_id", user.id)
    .single();

  if (!sub?.stripe_customer_id) {
    return NextResponse.json({ error: "No subscription found" }, { status: 400 });
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.buyerpocket.com.au";

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
