import Stripe from "stripe";

const API_VERSION = "2026-04-22.dahlia" as const;

let cached: Stripe | null = null;

/** Returns null when STRIPE_SECRET_KEY is not set (Stripe optional during testing — use SKIP_BILLING). */
export function getStripeOrNull(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  if (!cached) {
    cached = new Stripe(key, { apiVersion: API_VERSION, typescript: true });
  }
  return cached;
}

/** Use getStripeOrNull at request boundaries when Stripe may be disabled. Legacy access — throws if not configured. */
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop, receiver) {
    const client = getStripeOrNull();
    if (!client) {
      throw new Error(
        "Stripe is not configured (missing STRIPE_SECRET_KEY). Use SKIP_BILLING=1 to test without payments."
      );
    }
    return Reflect.get(client, prop, receiver);
  },
});
