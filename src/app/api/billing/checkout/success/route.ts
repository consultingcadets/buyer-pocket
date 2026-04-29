import { type NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");
  if (!sessionId) return NextResponse.redirect(new URL("/settings", request.url));

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["setup_intent"],
  });

  const setupIntent = session.setup_intent as import("stripe").Stripe.SetupIntent | null;
  if (!setupIntent || typeof setupIntent === "string") {
    return NextResponse.redirect(new URL("/settings?billing=error", request.url));
  }

  const paymentMethodId =
    typeof setupIntent.payment_method === "string"
      ? setupIntent.payment_method
      : setupIntent.payment_method?.id;

  const customerId = setupIntent.metadata?.customer_id;
  const subscriptionId = setupIntent.metadata?.subscription_id;

  if (!paymentMethodId || !customerId) {
    return NextResponse.redirect(new URL("/settings?billing=error", request.url));
  }

  // Attach payment method to customer and set as default
  await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
  await stripe.customers.update(customerId, {
    invoice_settings: { default_payment_method: paymentMethodId },
  });

  if (subscriptionId) {
    await stripe.subscriptions.update(subscriptionId, {
      default_payment_method: paymentMethodId,
    });

    // Pay latest invoice if past_due
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    if (
      (subscription.status === "past_due" || subscription.status === "unpaid") &&
      typeof subscription.latest_invoice === "string"
    ) {
      await stripe.invoices.pay(subscription.latest_invoice);
    }

    // Sync updated subscription to DB
    const { data: sub } = await supabaseAdmin
      .from("subscriptions")
      .select("user_id")
      .eq("stripe_subscription_id", subscriptionId)
      .single();

    if (sub) {
      const updatedSub = await stripe.subscriptions.retrieve(subscriptionId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const s = updatedSub as any;
      const toIso = (unix: number | null | undefined) =>
        unix ? new Date(unix * 1000).toISOString() : null;
      await supabaseAdmin.from("subscriptions").upsert(
        {
          user_id: sub.user_id,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          status: updatedSub.status,
          current_period_start: toIso(s.current_period_start),
          current_period_end: toIso(s.current_period_end),
          trial_start: toIso(s.trial_start),
          trial_end: toIso(s.trial_end),
          cancel_at_period_end: updatedSub.cancel_at_period_end,
          cancel_at: toIso(s.cancel_at),
        },
        { onConflict: "user_id" }
      );
    }
  }

  return NextResponse.redirect(new URL("/settings?billing=success", request.url));
}
