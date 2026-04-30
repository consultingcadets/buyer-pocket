/**
 * When true, no Stripe calls are made and users get full in-app access (testing / previews).
 * Set SKIP_BILLING=1 (or true) in .env.local or Vercel — remove before accepting real payments.
 */
export function isBillingSkipped(): boolean {
  const v = process.env.SKIP_BILLING?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}
