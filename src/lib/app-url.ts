const DEFAULT_PRODUCTION_ORIGIN = "https://buyerpocket.com.au";

const DEFAULT_DEVELOPMENT_ORIGIN = "http://localhost:3000";

/**
 * Public site origin for absolute URLs — Stripe redirects, emails, OG metadata, sitemap.
 * Set NEXT_PUBLIC_APP_URL to override (e.g. custom domain or a preview URL).
 */
export function getPublicAppUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }
  return process.env.NODE_ENV === "production"
    ? DEFAULT_PRODUCTION_ORIGIN
    : DEFAULT_DEVELOPMENT_ORIGIN;
}
