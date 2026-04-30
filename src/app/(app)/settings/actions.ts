"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getStripeOrNull } from "@/lib/stripe";
import { isBillingSkipped } from "@/lib/billing-flags";
import { getPublicAppUrl } from "@/lib/app-url";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ── Profile ───────────────────────────────────────────────────────────────────

export async function updateProfile(data: {
  name: string;
  mobile: string | null;
  agency_name: string | null;
  state: string | null;
  timezone: string | null;
}): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  if (!data.name?.trim()) return { error: "Name is required" };

  const { error } = await supabase
    .from("profiles")
    .update({
      name: data.name.trim(),
      mobile: data.mobile || null,
      agency_name: data.agency_name || null,
      state: data.state || null,
      timezone: data.timezone || null,
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/settings");
  return {};
}

// ── Notification preferences (stored in auth user metadata) ──────────────────

export async function updateNotificationPrefs(prefs: {
  push_enabled: boolean;
  email_enabled: boolean;
  reminder_alerts: boolean;
  weekly_summary: boolean;
}): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    data: {
      notif_push_enabled: prefs.push_enabled,
      notif_email_enabled: prefs.email_enabled,
      notif_reminder_alerts: prefs.reminder_alerts,
      notif_weekly_summary: prefs.weekly_summary,
    },
  });
  if (error) return { error: error.message };
  return {};
}

// ── Push tokens ───────────────────────────────────────────────────────────────

export async function deactivatePushToken(
  tokenId: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("push_tokens")
    .update({ is_active: false })
    .eq("id", tokenId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/settings");
  return {};
}

// ── Stripe billing portal ─────────────────────────────────────────────────────

export async function getStripePortalUrl(): Promise<{
  url?: string;
  error?: string;
}> {
  if (isBillingSkipped()) {
    return { error: "Billing is disabled while SKIP_BILLING is set." };
  }

  const stripe = getStripeOrNull();
  if (!stripe) {
    return { error: "Stripe is not configured (missing STRIPE_SECRET_KEY)." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: sub } = await supabaseAdmin
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!sub?.stripe_customer_id) return { error: "No billing account found" };

  const origin = getPublicAppUrl();

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: `${origin}/settings`,
    });
    return { url: session.url };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to open billing portal";
    return { error: message };
  }
}

// ── Sign out ──────────────────────────────────────────────────────────────────

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// ── Delete account ────────────────────────────────────────────────────────────

export async function requestDeleteAccount(): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Mark user metadata with deletion request timestamp
  // A separate cron job will hard-delete after 30 days
  const { error: metaError } = await supabase.auth.updateUser({
    data: {
      deletion_requested_at: new Date().toISOString(),
      deletion_scheduled_for: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
  });

  if (metaError) return { error: metaError.message };

  // TODO: cancel active Stripe subscriptions via Stripe API

  // Sign user out immediately
  await supabase.auth.signOut();

  // Note: hard delete + data purge handled by a scheduled job after 30 days
  // User can email hello@consultingcadets.com to cancel within that window

  redirect("/login?deleted=1");
}
