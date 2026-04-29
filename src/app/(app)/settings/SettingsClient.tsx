"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatPhone } from "@/lib/format";
import {
  updateProfile,
  updateNotificationPrefs,
  deactivatePushToken,
  getStripePortalUrl,
  signOut,
  requestDeleteAccount,
} from "./actions";
import type { Database } from "@/types/database";
import type { AccessLevel } from "@/lib/subscription";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type PushToken = Database["public"]["Tables"]["push_tokens"]["Row"];
type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];

interface Props {
  profile: Profile;
  email: string;
  pushTokens: PushToken[];
  notifPrefs: {
    push_enabled: boolean;
    email_enabled: boolean;
    reminder_alerts: boolean;
    weekly_summary: boolean;
  };
  subscription: Subscription | null;
  accessLevel: AccessLevel;
}

// ── Shared input style ────────────────────────────────────────────────────────

const inputCls =
  "w-full h-12 px-4 rounded-lg border border-border bg-white text-text-primary placeholder:text-outline focus:outline-none focus:border-2 focus:border-accent transition-colors text-sm";

const selectCls =
  "w-full h-12 px-4 rounded-lg border border-border bg-white text-text-primary focus:outline-none focus:border-2 focus:border-accent transition-colors text-sm";

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="bg-white rounded-xl border border-border p-6 space-y-5">
      <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

// ── Toggle ────────────────────────────────────────────────────────────────────

function Toggle({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 min-h-[48px]">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary">{label}</p>
        {description && (
          <p className="text-xs text-text-secondary mt-0.5">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors focus:outline-none disabled:opacity-40",
          checked ? "bg-secondary" : "bg-surface-container-highest"
        )}
      >
        <span
          className={cn(
            "inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform mt-0.5",
            checked ? "translate-x-5 ml-0.5" : "translate-x-0.5"
          )}
        />
      </button>
    </div>
  );
}

// ── Profile Section ───────────────────────────────────────────────────────────

function ProfileSection({ profile, email }: { profile: Profile; email: string }) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(profile.name ?? "");
  const [mobile, setMobile] = useState(profile.mobile ?? "");
  const [agencyName, setAgencyName] = useState(profile.agency_name ?? "");
  const [state, setState] = useState(profile.state ?? "");
  const [timezone, setTimezone] = useState(profile.timezone ?? "");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const AU_STATES = ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"];
  const TIMEZONES = [
    { label: "Sydney / Melbourne (AEST/AEDT)", value: "Australia/Sydney" },
    { label: "Brisbane (AEST)", value: "Australia/Brisbane" },
    { label: "Adelaide (ACST/ACDT)", value: "Australia/Adelaide" },
    { label: "Perth (AWST)", value: "Australia/Perth" },
    { label: "Darwin (ACST)", value: "Australia/Darwin" },
    { label: "Hobart (AEST/AEDT)", value: "Australia/Hobart" },
    { label: "Canberra (AEST/AEDT)", value: "Australia/Canberra" },
    { label: "Lord Howe Island", value: "Australia/Lord_Howe" },
  ];

  function handleSave() {
    setError("");
    setSuccess(false);
    startTransition(async () => {
      const res = await updateProfile({ name, mobile: mobile || null, agency_name: agencyName || null, state: state || null, timezone: timezone || null });
      if (res.error) { setError(res.error); return; }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    });
  }

  return (
    <Section id="profile" title="Profile">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
          <div className="flex gap-2">
            <input type="email" value={email} readOnly className={cn(inputCls, "bg-surface-container text-text-secondary flex-1")} />
            <a
              href="mailto:support@buyerpocket.com.au?subject=Change email address"
              className="h-12 px-4 rounded-lg border border-border text-accent text-sm font-medium flex items-center flex-shrink-0 hover:bg-surface-container"
            >
              Change
            </a>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Mobile</label>
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            onBlur={(e) => setMobile(formatPhone(e.target.value))}
            placeholder="0412 345 678"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Agency name</label>
          <input type="text" value={agencyName} onChange={(e) => setAgencyName(e.target.value)} placeholder="Independent" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">State</label>
          <select value={state} onChange={(e) => setState(e.target.value)} className={selectCls}>
            <option value="">Select state…</option>
            {AU_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Timezone</label>
          <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className={selectCls}>
            <option value="">Select timezone…</option>
            {TIMEZONES.map((tz) => <option key={tz.value} value={tz.value}>{tz.label}</option>)}
          </select>
        </div>
      </div>
      {error && <p className="text-sm text-error">{error}</p>}
      {success && <p className="text-sm text-secondary">Changes saved.</p>}
      <button
        type="button"
        onClick={handleSave}
        disabled={isPending}
        className="h-12 px-6 rounded-lg bg-secondary text-white font-semibold text-sm disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save changes"}
      </button>
    </Section>
  );
}

// ── Notifications Section ─────────────────────────────────────────────────────

function NotificationsSection({
  initialPrefs,
}: {
  initialPrefs: Props["notifPrefs"];
}) {
  const [isPending, startTransition] = useTransition();
  const [prefs, setPrefs] = useState(initialPrefs);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  function setField(key: keyof typeof prefs, value: boolean) {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    startTransition(async () => {
      await updateNotificationPrefs(next);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    });
  }

  const denied = permission === "denied";

  return (
    <Section id="notifications" title="Notifications">
      {denied && (
        <div className="p-4 rounded-lg bg-warning-bg border border-warning-text/20">
          <p className="text-sm font-semibold text-warning-text mb-1">Push notifications are blocked</p>
          <p className="text-xs text-warning-text mb-3">
            You previously denied permission. To enable them:
          </p>
          <ul className="text-xs text-warning-text space-y-1 mb-3 list-disc list-inside">
            <li><strong>Chrome:</strong> Click the lock icon in the address bar → Site settings → Notifications → Allow</li>
            <li><strong>Safari (Mac):</strong> Safari → Settings → Websites → Notifications → Allow for this site</li>
            <li><strong>Firefox:</strong> Click the shield icon → Permissions → Allow notifications</li>
          </ul>
          <p className="text-xs text-warning-text">
            After changing the setting, reload this page.
          </p>
        </div>
      )}

      <div className="space-y-1 divide-y divide-border">
        <Toggle
          label="Push notifications"
          description="Reminder alerts sent to this device"
          checked={prefs.push_enabled && !denied}
          onChange={(v) => setField("push_enabled", v)}
          disabled={denied || isPending}
        />
        <div className="pt-1">
          <Toggle
            label="Email backup"
            description="Receive reminders by email if push is unavailable"
            checked={prefs.email_enabled}
            onChange={(v) => setField("email_enabled", v)}
            disabled={isPending}
          />
        </div>
        <div className="pt-1">
          <Toggle
            label="Reminder alerts"
            description="Notify me when a reminder is due"
            checked={prefs.reminder_alerts}
            onChange={(v) => setField("reminder_alerts", v)}
            disabled={isPending}
          />
        </div>
        <div className="pt-1">
          <Toggle
            label="Weekly summary"
            description="A summary of your buyers and upcoming reminders each Monday"
            checked={prefs.weekly_summary}
            onChange={(v) => setField("weekly_summary", v)}
            disabled={isPending}
          />
        </div>
      </div>
      {success && <p className="text-xs text-secondary">Preferences saved.</p>}
    </Section>
  );
}

// ── Devices Section ───────────────────────────────────────────────────────────

function DevicesSection({ tokens }: { tokens: PushToken[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deactivating, setDeactivating] = useState<string | null>(null);

  function handleDeactivate(id: string) {
    setDeactivating(id);
    startTransition(async () => {
      await deactivatePushToken(id);
      setDeactivating(null);
      router.refresh();
    });
  }

  function fmtDate(iso: string | null) {
    if (!iso) return "Never";
    return new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
  }

  const active = tokens.filter((t) => t.is_active);

  return (
    <Section id="devices" title="Devices">
      <p className="text-sm text-text-secondary">
        Devices registered to receive push notifications.
      </p>
      {active.length === 0 ? (
        <p className="text-sm text-text-secondary italic">No devices registered.</p>
      ) : (
        <div className="space-y-2">
          {active.map((token) => (
            <div
              key={token.id}
              className="flex items-center justify-between gap-4 p-3 rounded-lg border border-border"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary">
                  {token.device_type ?? "Unknown device"}
                  {token.browser ? ` · ${token.browser}` : ""}
                </p>
                <p className="text-xs text-text-secondary">
                  Last used {fmtDate(token.last_used_at)}
                </p>
              </div>
              <button
                type="button"
                disabled={isPending && deactivating === token.id}
                onClick={() => handleDeactivate(token.id)}
                className="text-xs font-medium text-error disabled:opacity-60 flex-shrink-0"
              >
                {deactivating === token.id ? "Removing…" : "Remove"}
              </button>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

// ── Data Section ──────────────────────────────────────────────────────────────

function DataSection() {
  const [showExportConfirm, setShowExportConfirm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <Section id="data" title="Your data">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-text-primary">Export buyers</p>
              <p className="text-xs text-text-secondary mt-0.5">
                Download all your buyers as a CSV file.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowExportConfirm(true)}
              className="flex-shrink-0 h-10 px-4 rounded-lg border border-border text-sm font-medium text-text-primary hover:bg-surface-container"
            >
              Export CSV
            </button>
          </div>

          <div className="h-px bg-border" />

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-error">Delete account</p>
              <p className="text-xs text-text-secondary mt-0.5">
                Permanently delete your account and all buyer data. This cannot be undone after 30 days.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="flex-shrink-0 h-10 px-4 rounded-lg border border-error/30 text-sm font-medium text-error hover:bg-error/5"
            >
              Delete account
            </button>
          </div>
        </div>
      </Section>

      {showExportConfirm && (
        <ExportConfirmModal onClose={() => setShowExportConfirm(false)} />
      )}
      {showDeleteModal && (
        <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />
      )}
    </>
  );
}

// ── Export confirm modal ──────────────────────────────────────────────────────

function ExportConfirmModal({ onClose }: { onClose: () => void }) {
  function handleDownload() {
    window.location.href = "/api/export/buyers";
    onClose();
  }

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">Export your buyers</h2>
        <div className="p-4 bg-warning-bg border border-warning-text/20 rounded-lg">
          <p className="text-sm text-warning-text font-medium mb-1">Responsible use reminder</p>
          <p className="text-sm text-warning-text">
            Only export contacts you have permission to store and contact. Handle this data in accordance with the Australian Privacy Act and your agency&apos;s privacy policy.
          </p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 h-11 rounded-lg border border-border text-sm font-medium text-text-secondary">
            Cancel
          </button>
          <button type="button" onClick={handleDownload} className="flex-1 h-11 rounded-lg bg-secondary text-white text-sm font-semibold">
            Download CSV
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

// ── Delete account modal ──────────────────────────────────────────────────────

function DeleteAccountModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [confirmText, setConfirmText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleDelete() {
    if (confirmText !== "DELETE") {
      setError("Type DELETE in capitals to confirm");
      return;
    }
    setError("");
    startTransition(async () => {
      const res = await requestDeleteAccount();
      if (res?.error) setError(res.error);
    });
  }

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl space-y-4">
        {step === 1 ? (
          <>
            <h2 className="text-lg font-semibold text-text-primary">Delete your account?</h2>
            <p className="text-sm text-text-secondary">
              This will permanently delete your account and all your buyers, notes, and reminders.
            </p>
            <ul className="text-sm text-text-secondary space-y-1 list-disc list-inside">
              <li>Your data is deleted after 30 days</li>
              <li>You can email <a href="mailto:support@buyerpocket.com.au" className="text-accent">support@buyerpocket.com.au</a> within 30 days to restore your account</li>
              <li>Any active subscription will be cancelled</li>
            </ul>
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose} className="flex-1 h-11 rounded-lg border border-border text-sm font-medium text-text-secondary">
                Cancel
              </button>
              <button type="button" onClick={() => setStep(2)} className="flex-1 h-11 rounded-lg bg-error text-white text-sm font-semibold">
                Continue
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-text-primary">Are you absolutely sure?</h2>
            <p className="text-sm text-text-secondary">
              Type <strong className="font-mono text-error">DELETE</strong> below to confirm.
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className={cn(inputCls, "font-mono tracking-widest")}
              autoFocus
            />
            {error && <p className="text-xs text-error">{error}</p>}
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 h-11 rounded-lg border border-border text-sm font-medium text-text-secondary">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending || confirmText !== "DELETE"}
                className="flex-1 h-11 rounded-lg bg-error text-white text-sm font-semibold disabled:opacity-50"
              >
                {isPending ? "Deleting…" : "Delete my account"}
              </button>
            </div>
          </>
        )}
      </div>
    </ModalBackdrop>
  );
}

// ── Billing Section ───────────────────────────────────────────────────────────

function BillingSection({
  subscription,
  accessLevel,
}: {
  subscription: Subscription | null;
  accessLevel: AccessLevel;
}) {
  const [isPending, startTransition] = useTransition();

  function handlePortal() {
    startTransition(async () => {
      const { url } = await getStripePortalUrl();
      if (url) window.location.href = url;
    });
  }

  function handleAddPayment() {
    startTransition(async () => {
      const res = await fetch("/api/billing/checkout", { method: "POST" });
      const { url } = await res.json();
      if (url) window.location.href = url;
    });
  }

  const statusLabel: Record<string, string> = {
    trialing: "Free trial",
    active: "Active",
    past_due: "Payment overdue",
    unpaid: "Payment failed",
    canceled: "Cancelled",
    paused: "Paused",
  };

  const statusColour: Record<string, string> = {
    trialing: "text-teal-action",
    active: "text-teal-action",
    past_due: "text-[#F97316]",
    unpaid: "text-error",
    canceled: "text-outline",
    paused: "text-outline",
  };

  const status = subscription?.status ?? "none";
  const trialEnd = subscription?.trial_end
    ? new Date(subscription.trial_end).toLocaleDateString("en-AU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;
  const periodEnd = subscription?.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString("en-AU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const needsPayment = accessLevel !== "full" || status === "past_due" || status === "unpaid";

  return (
    <Section id="billing" title="Billing">
      <div className="space-y-4">
        {/* Status row */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-text-primary">BuyerPocket Pro</p>
            <p className="text-xs text-text-secondary">$19 AUD / month (incl. GST)</p>
            {status !== "none" && (
              <p className={cn("text-xs font-medium", statusColour[status] ?? "text-outline")}>
                {statusLabel[status] ?? status}
                {status === "trialing" && trialEnd ? ` · Trial ends ${trialEnd}` : ""}
                {status === "active" && periodEnd ? ` · Renews ${periodEnd}` : ""}
                {status === "canceled" && periodEnd ? ` · Access until ${periodEnd}` : ""}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            {needsPayment ? (
              <button
                type="button"
                onClick={handleAddPayment}
                disabled={isPending}
                className="flex-shrink-0 h-10 px-4 rounded-lg bg-teal-action text-on-teal-action text-sm font-semibold hover:opacity-90 disabled:opacity-60"
              >
                {isPending ? "Loading…" : "Add payment"}
              </button>
            ) : null}
            {subscription?.stripe_customer_id && (
              <button
                type="button"
                onClick={handlePortal}
                disabled={isPending}
                className="flex-shrink-0 h-10 px-4 rounded-lg border border-border text-sm font-medium text-text-primary hover:bg-surface-container disabled:opacity-60"
              >
                {isPending ? "Loading…" : "Manage billing →"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}

// ── Help Section ──────────────────────────────────────────────────────────────

function HelpSection() {
  return (
    <Section id="help" title="Help &amp; support">
      <div className="space-y-3">
        <div className="flex items-center justify-between py-2">
          <p className="text-sm text-text-primary">Support</p>
          <a href="mailto:support@buyerpocket.com.au" className="text-sm text-accent">
            support@buyerpocket.com.au
          </a>
        </div>
        <div className="h-px bg-border" />
        <div className="flex items-center justify-between py-2">
          <p className="text-sm text-text-primary">Privacy Policy</p>
          <Link href="/privacy" target="_blank" className="text-sm text-accent">View →</Link>
        </div>
        <div className="h-px bg-border" />
        <div className="flex items-center justify-between py-2">
          <p className="text-sm text-text-primary">Terms of Service</p>
          <Link href="/terms" target="_blank" className="text-sm text-accent">View →</Link>
        </div>
        <div className="h-px bg-border" />
        <div className="flex items-center justify-between py-2">
          <p className="text-sm text-text-primary">Install on iPhone</p>
          <Link href="/install/ios" className="text-sm text-accent">How to →</Link>
        </div>
        <div className="h-px bg-border" />
        <div className="flex items-center justify-between py-2">
          <p className="text-sm text-text-secondary">Version</p>
          <p className="text-sm text-text-secondary">1.0.0</p>
        </div>
      </div>
    </Section>
  );
}

// ── Modal backdrop ────────────────────────────────────────────────────────────

function ModalBackdrop({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(15,28,44,0.4)", backdropFilter: "blur(4px)" }}
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-sm">{children}</div>
    </div>
  );
}

// ── Mobile landing list ───────────────────────────────────────────────────────

const SECTIONS = [
  { id: "profile", label: "Profile", icon: "👤" },
  { id: "notifications", label: "Notifications", icon: "🔔" },
  { id: "devices", label: "Devices", icon: "📱" },
  { id: "data", label: "Your data", icon: "🗄️" },
  { id: "billing", label: "Billing", icon: "💳" },
  { id: "help", label: "Help & support", icon: "❓" },
] as const;

function MobileLanding({ onSelect, onSignOut }: { onSelect: (id: string) => void; onSignOut: () => void }) {
  return (
    <div className="space-y-2">
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(s.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 h-14 text-left hover:bg-surface-container transition-colors",
              i > 0 && "border-t border-border"
            )}
          >
            <span className="text-xl w-7 flex-shrink-0">{s.icon}</span>
            <span className="flex-1 text-sm font-medium text-text-primary">{s.label}</span>
            <span className="text-text-secondary">›</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <button
          type="button"
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-4 h-14 text-left hover:bg-error/5 transition-colors"
        >
          <span className="text-xl w-7 flex-shrink-0">🚪</span>
          <span className="flex-1 text-sm font-medium text-error">Sign out</span>
        </button>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function SettingsClient({ profile, email, pushTokens, notifPrefs, subscription, accessLevel }: Props) {
  const [isPending, startTransition] = useTransition();
  const [mobileView, setMobileView] = useState<"landing" | string>("landing");

  function handleSignOut() {
    startTransition(async () => {
      await signOut();
    });
  }

  const initials = (profile.name ?? email)
    .split(" ")
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const allSections = (
    <div className="space-y-6">
      <ProfileSection profile={profile} email={email} />
      <NotificationsSection initialPrefs={notifPrefs} />
      <DevicesSection tokens={pushTokens} />
      <DataSection />
      <BillingSection subscription={subscription} accessLevel={accessLevel} />
      <HelpSection />

      {/* Sign out */}
      <div className="bg-white rounded-xl border border-border p-4">
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isPending}
          className="w-full h-12 rounded-lg border border-error/30 text-error text-sm font-semibold hover:bg-error/5 disabled:opacity-60"
        >
          {isPending ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* ── Desktop ── */}
      <div className="hidden md:block">
        <div className="max-w-2xl mx-auto px-6 py-10">
          <h1 className="text-3xl font-bold text-text-primary mb-8">Settings</h1>
          {allSections}
        </div>
      </div>

      {/* ── Mobile ── */}
      <div className="md:hidden">
        {/* Header */}
        <header className="sticky top-0 bg-white border-b border-border z-10">
          <div className="px-4 h-14 flex items-center">
            {mobileView !== "landing" ? (
              <>
                <button
                  type="button"
                  onClick={() => setMobileView("landing")}
                  className="text-accent font-medium text-sm mr-3"
                >
                  ← Settings
                </button>
                <h1 className="text-base font-semibold text-text-primary">
                  {SECTIONS.find((s) => s.id === mobileView)?.label ?? mobileView}
                </h1>
              </>
            ) : (
              <h1 className="text-base font-semibold text-text-primary">Settings</h1>
            )}
          </div>
        </header>

        <div className="px-4 pt-4 pb-8 space-y-4">
          {mobileView === "landing" ? (
            <>
              {/* Profile card */}
              <div className="bg-white rounded-xl border border-border p-4 flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-text-primary">{profile.name ?? "—"}</p>
                  <p className="text-sm text-text-secondary truncate">{email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileView("profile")}
                  className="text-accent"
                  aria-label="Edit profile"
                >
                  ✏️
                </button>
              </div>

              <MobileLanding
                onSelect={(id) => setMobileView(id)}
                onSignOut={handleSignOut}
              />
            </>
          ) : (
            <>
              {mobileView === "profile" && <ProfileSection profile={profile} email={email} />}
              {mobileView === "notifications" && <NotificationsSection initialPrefs={notifPrefs} />}
              {mobileView === "devices" && <DevicesSection tokens={pushTokens} />}
              {mobileView === "data" && <DataSection />}
              {mobileView === "billing" && <BillingSection subscription={subscription} accessLevel={accessLevel} />}
              {mobileView === "help" && <HelpSection />}
            </>
          )}
        </div>

        {/* Mobile bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-10">
          <div className="flex">
            {[
              { href: "/today", label: "Today", icon: "📅" },
              { href: "/buyers", label: "Buyers", icon: "👥" },
              { href: "/reminders", label: "Reminders", icon: "🔔" },
              { href: "/settings", label: "Settings", icon: "⚙️", active: true },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center py-2 gap-1 text-xs",
                  item.active ? "text-secondary" : "text-text-secondary"
                )}
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
        <div className="h-16" />
      </div>
    </div>
  );
}
