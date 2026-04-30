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
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!sub?.stripe_customer_id) {
    return NextResponse.json({ error: "No billing account found" }, { status: 400 });
  }

  const origin = getPublicAppUrl();

  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${origin}/settings`,
  });

  return NextResponse.json({ url: session.url });
}
