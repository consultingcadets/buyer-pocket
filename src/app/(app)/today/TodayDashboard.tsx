"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, User, Flame, CalendarDays, AlertTriangle, Users } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { ReminderCard } from "@/components/ReminderCard";
import { SnoozeModal } from "@/components/SnoozeModal";
import { completeReminder, snoozeReminder } from "@/app/(app)/reminders/actions";
import { formatBudgetLabel } from "@/lib/buyer-filters";
import { cn } from "@/lib/utils";
import type { ReminderWithBuyer } from "@/types/reminders";
import type { Buyer } from "@/types/database";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function greeting(name: string | null | undefined): string {
  const hour = new Date().getHours();
  const time = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
  return `Good ${time}${name ? `, ${name.split(" ")[0]}` : ""}`;
}

function todayDateLabel(): string {
  return new Date().toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function groupByTimePeriod(reminders: ReminderWithBuyer[]) {
  const groups = {
    morning: [] as ReminderWithBuyer[],
    afternoon: [] as ReminderWithBuyer[],
    evening: [] as ReminderWithBuyer[],
  };
  for (const r of reminders) {
    const hour = new Date(r.reminder_at).getHours();
    if (hour < 12) groups.morning.push(r);
    else if (hour < 17) groups.afternoon.push(r);
    else groups.evening.push(r);
  }
  return groups;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// ─── Mobile sub-components ────────────────────────────────────────────────────

function MetricCard({
  value,
  label,
  alert,
  icon,
}: {
  value: number;
  label: string;
  alert?: boolean;
  icon: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex-1 rounded-2xl p-4 flex flex-col gap-2",
        alert
          ? "bg-error/8 border border-error/20"
          : "bg-white shadow-card border border-border/40"
      )}
    >
      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center",
        alert ? "bg-error/15" : "bg-surface-container"
      )}>
        <span className={alert ? "text-error" : "text-text-secondary"}>{icon}</span>
      </div>
      <div>
        <span className={cn("text-[28px] font-bold leading-none block", alert ? "text-error" : "text-text-primary")}>
          {value}
        </span>
        <span className={cn("text-[11px] font-medium leading-tight uppercase tracking-wide", alert ? "text-error/75" : "text-text-secondary")}>
          {label}
        </span>
      </div>
    </div>
  );
}

function BuyerPill({ buyer }: { buyer: Buyer }) {
  const displayName = (buyer.name ?? "").trim() || "Buyer";
  const abbr = initials(displayName);
  const budgetLabel = formatBudgetLabel(buyer.budget_min, buyer.budget_max);
  const temp = buyer.buyer_temperature;
  const tempStyles: Record<string, string> = {
    hot: "bg-secondary text-white",
    warm: "bg-accent text-white",
    cold: "bg-white text-primary border border-primary",
  };
  const tempColor = temp ? (tempStyles[temp] ?? "bg-surface-container text-text-secondary") : null;

  return (
    <Link
      href={`/buyers/${buyer.id}`}
      className="shrink-0 w-40 bg-white rounded-2xl shadow-card p-3 flex flex-col gap-1.5 border border-border/40"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
          <span className="text-white text-[11px] font-bold">{abbr}</span>
        </div>
        {temp && tempColor && (
          <span
            className={cn(
              "text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full",
              tempColor
            )}
          >
            {temp}
          </span>
        )}
      </div>
      <span className="text-[13px] font-semibold text-text-primary leading-tight line-clamp-1">
        {displayName}
      </span>
      {budgetLabel && (
        <span className="text-[11px] text-text-secondary">{budgetLabel}</span>
      )}
    </Link>
  );
}

function RecentBuyerAvatar({ buyer }: { buyer: Buyer }) {
  const raw = (buyer.name ?? "").trim();
  const firstWord = raw.split(/\s+/)[0] || "—";
  const abbr = raw ? initials(raw) : "?";
  return (
    <Link
      href={`/buyers/${buyer.id}`}
      className="shrink-0 flex flex-col items-center gap-1 w-14"
    >
      <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center">
        <span className="text-text-secondary text-[13px] font-bold">{abbr}</span>
      </div>
      <span className="text-[10px] text-text-secondary text-center leading-tight line-clamp-1">
        {firstWord}
      </span>
    </Link>
  );
}

function SectionHeading({
  children,
  href,
}: {
  children: React.ReactNode;
  href?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-[15px] font-semibold text-text-primary">{children}</h2>
      {href && (
        <Link href={href} className="text-[12px] text-teal-action font-bold uppercase tracking-wide">
          View all
        </Link>
      )}
    </div>
  );
}

// ─── Desktop sub-components ───────────────────────────────────────────────────

function DesktopStat({
  value,
  label,
  alert,
}: {
  value: number;
  label: string;
  alert?: boolean;
}) {
  return (
    <div className="text-right">
      <p
        className={cn(
          "text-[30px] font-bold leading-none",
          alert ? "text-error" : "text-white"
        )}
      >
        {value}
      </p>
      <p className="text-[11px] text-white/50 uppercase tracking-widest mt-1">{label}</p>
    </div>
  );
}

function DesktopBuyerRow({ buyer }: { buyer: Buyer }) {
  const abbr = initials(buyer.name);
  const budgetLabel = formatBudgetLabel(buyer.budget_min, buyer.budget_max);
  return (
    <Link
      href={`/buyers/${buyer.id}`}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container-low transition-colors group"
    >
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <span className="text-primary text-[11px] font-bold">{abbr}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-text-primary truncate group-hover:text-primary transition-colors">
          {buyer.name}
        </p>
        {buyer.preferred_suburbs?.[0] && (
          <p className="text-[11px] text-text-secondary truncate">
            {buyer.preferred_suburbs[0].split(",")[0]}
          </p>
        )}
      </div>
      {budgetLabel && (
        <span className="shrink-0 text-[11px] text-text-secondary">{budgetLabel}</span>
      )}
    </Link>
  );
}

function DesktopHotBuyerRow({ buyer }: { buyer: Buyer }) {
  const abbr = initials(buyer.name);
  return (
    <Link
      href={`/buyers/${buyer.id}`}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container-low transition-colors group"
    >
      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
        <span className="text-white text-[11px] font-bold">{abbr}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-text-primary truncate group-hover:text-primary transition-colors">
          {buyer.name}
        </p>
        {buyer.preferred_suburbs?.[0] && (
          <p className="text-[11px] text-text-secondary truncate">
            {buyer.preferred_suburbs[0].split(",")[0]}
          </p>
        )}
      </div>
      <span className="shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">
        Hot
      </span>
    </Link>
  );
}

function DesktopSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-text-secondary mb-2">
      {children}
    </p>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

type Props = {
  profileName: string | null;
  todayReminders: ReminderWithBuyer[];
  overdueReminders: ReminderWithBuyer[];
  hotBuyers: Buyer[];
  recentlyAdded: Buyer[];
  todayCount: number;
  overdueCount: number;
  buyersThisWeek: number;
};

export function TodayDashboard({
  profileName,
  todayReminders: initialToday,
  overdueReminders: initialOverdue,
  hotBuyers,
  recentlyAdded,
  todayCount,
  overdueCount,
  buyersThisWeek,
}: Props) {
  const router = useRouter();
  const [todayReminders, setTodayReminders] = useState(initialToday);
  const [overdueReminders, setOverdueReminders] = useState(initialOverdue);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [snoozeReminderId, setSnoozeReminderId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function removeReminder(id: string) {
    setTodayReminders((prev) => prev.filter((r) => r.id !== id));
    setOverdueReminders((prev) => prev.filter((r) => r.id !== id));
  }

  function handleComplete(id: string) {
    setCompletingId(id);
    startTransition(async () => {
      const { error } = await completeReminder(id);
      setCompletingId(null);
      if (!error) {
        removeReminder(id);
        router.refresh();
      }
    });
  }

  function handleSnooze(id: string) {
    setSnoozeReminderId(id);
  }

  async function handleSnoozeConfirm(id: string, snoozedUntil: string) {
    const { error } = await snoozeReminder(id, snoozedUntil);
    if (!error) {
      removeReminder(id);
      router.refresh();
    }
  }

  const groups = groupByTimePeriod(todayReminders);
  const hasNoReminders =
    todayReminders.length === 0 && overdueReminders.length === 0;

  return (
    <div className="min-h-screen bg-background">

      {/* ══════════ DESKTOP LAYOUT ══════════ */}
      <div className="hidden lg:block">

        {/* Navy hero header */}
        <div className="bg-primary">
          <div className="px-8 py-8 flex items-end justify-between">
            <div>
              <h1 className="text-[28px] font-bold text-white tracking-tight leading-none">
                {greeting(profileName)}
              </h1>
              <p className="text-white/50 text-[13px] mt-2">{todayDateLabel()}</p>
            </div>
            <div className="flex items-end gap-10">
              <DesktopStat value={todayCount} label="Today" />
              {overdueCount > 0 && (
                <DesktopStat value={overdueCount} label="Overdue" alert />
              )}
              <DesktopStat value={buyersThisWeek} label="Added this week" />
            </div>
          </div>
        </div>

        {/* 2-column body */}
        <div className="max-w-6xl mx-auto px-8 py-8 grid grid-cols-[1fr_320px] gap-8 items-start">

          {/* Left: reminders */}
          <div className="space-y-6">
            {hasNoReminders && (
              <div className="bg-white rounded-2xl border border-border p-10 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-teal-action/10 flex items-center justify-center mb-4">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-teal-action"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <p className="text-[16px] font-semibold text-text-primary">All clear</p>
                <p className="text-sm text-text-secondary mt-1">No follow-ups due today.</p>
              </div>
            )}

            {overdueReminders.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-error shrink-0" />
                  <h2 className="text-[11px] font-bold uppercase tracking-[0.1em] text-error">
                    Overdue
                  </h2>
                </div>
                <div className="space-y-3">
                  {overdueReminders.map((r) => (
                    <ReminderCard
                      key={r.id}
                      reminder={r}
                      showDate
                      onComplete={handleComplete}
                      onSnooze={handleSnooze}
                      isCompleting={completingId === r.id}
                    />
                  ))}
                </div>
              </section>
            )}

            {todayReminders.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-[13px] font-semibold text-text-primary">
                    Today&apos;s reminders
                  </h2>
                  <Link href="/reminders" className="text-[12px] text-teal-action font-medium">
                    See all
                  </Link>
                </div>
                <div className="space-y-3">
                  {todayReminders.map((r) => (
                    <ReminderCard
                      key={r.id}
                      reminder={r}
                      onComplete={handleComplete}
                      onSnooze={handleSnooze}
                      isCompleting={completingId === r.id}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right: context panel */}
          <div className="space-y-6">
            {hotBuyers.length > 0 && (
              <section className="bg-white rounded-2xl border border-border p-4">
                <div className="flex items-center justify-between mb-1">
                  <DesktopSectionLabel>Hot buyers</DesktopSectionLabel>
                  <Link
                    href="/buyers?temperatures=hot"
                    className="text-[12px] text-teal-action font-medium"
                  >
                    See all
                  </Link>
                </div>
                <div>
                  {hotBuyers.slice(0, 6).map((b) => (
                    <DesktopHotBuyerRow key={b.id} buyer={b} />
                  ))}
                </div>
              </section>
            )}

            {recentlyAdded.length > 0 && (
              <section className="bg-white rounded-2xl border border-border p-4">
                <div className="flex items-center justify-between mb-1">
                  <DesktopSectionLabel>Recently added</DesktopSectionLabel>
                  <Link href="/buyers" className="text-[12px] text-teal-action font-medium">
                    See all
                  </Link>
                </div>
                <div>
                  {recentlyAdded.slice(0, 6).map((b) => (
                    <DesktopBuyerRow key={b.id} buyer={b} />
                  ))}
                </div>
              </section>
            )}

            {hotBuyers.length === 0 && recentlyAdded.length === 0 && (
              <div className="bg-white rounded-2xl border border-border p-6 text-center">
                <p className="text-sm text-text-secondary">No buyers added yet.</p>
                <Link
                  href="/add"
                  className="inline-flex items-center gap-1.5 mt-3 h-9 px-4 rounded-xl bg-teal-action text-white text-[13px] font-semibold"
                >
                  Add your first buyer
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══════════ MOBILE LAYOUT ══════════ */}
      <div className="lg:hidden pb-24 bg-surface-container-low min-h-screen">

        {/* Mobile header */}
        <div className="bg-white px-5 pt-12 pb-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[22px] font-bold text-text-primary">{greeting(profileName)}</p>
              <p className="text-[13px] text-text-secondary mt-0.5">{todayDateLabel()}</p>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <Link href="/reminders" className="w-9 h-9 flex items-center justify-center text-text-secondary">
                <Bell size={22} />
              </Link>
              <Link href="/settings" className="w-9 h-9 flex items-center justify-center text-text-secondary">
                <User size={22} />
              </Link>
            </div>
          </div>
        </div>

        <div className="px-4 pt-4 flex flex-col gap-5">
          {/* Metric cards */}
          <div className="grid grid-cols-2 gap-3">
            <MetricCard value={hotBuyers.length} label="Hot buyers" icon={<Flame size={16} />} />
            <MetricCard value={todayCount} label="Today" icon={<CalendarDays size={16} />} />
            <MetricCard value={overdueCount} label="Overdue" alert={overdueCount > 0} icon={<AlertTriangle size={16} />} />
            <MetricCard value={buyersThisWeek} label="Added this week" icon={<Users size={16} />} />
          </div>

          {/* Empty state */}
          {hasNoReminders && (
            <div className="bg-white rounded-2xl p-8 flex flex-col items-center text-center shadow-card">
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-3">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-text-secondary"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <p className="text-[16px] font-semibold text-text-primary">Nothing for today.</p>
              <p className="text-[13px] text-text-secondary mt-1">No follow-ups due. Take a breath.</p>
            </div>
          )}

          {/* Overdue */}
          {overdueReminders.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-5 rounded-full bg-error shrink-0" />
                  <h2 className="text-[15px] font-semibold text-error">Overdue reminders</h2>
                  <span className="w-5 h-5 rounded-full bg-error/15 text-error text-[11px] font-bold flex items-center justify-center">
                    {overdueReminders.length}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {overdueReminders.map((r) => (
                  <ReminderCard
                    key={r.id}
                    reminder={r}
                    showDate
                    onComplete={handleComplete}
                    onSnooze={handleSnooze}
                    isCompleting={completingId === r.id}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Today's reminders */}
          {todayReminders.length > 0 && (
            <section>
              <SectionHeading href="/reminders">Today&apos;s reminders</SectionHeading>
              {todayReminders.length > 4 ? (
                <>
                  {groups.morning.length > 0 && (
                    <div className="mb-3">
                      <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide mb-2">
                        Morning
                      </p>
                      <div className="flex flex-col gap-3">
                        {groups.morning.map((r) => (
                          <ReminderCard
                            key={r.id}
                            reminder={r}
                            onComplete={handleComplete}
                            onSnooze={handleSnooze}
                            isCompleting={completingId === r.id}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {groups.afternoon.length > 0 && (
                    <div className="mb-3">
                      <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide mb-2">
                        Afternoon
                      </p>
                      <div className="flex flex-col gap-3">
                        {groups.afternoon.map((r) => (
                          <ReminderCard
                            key={r.id}
                            reminder={r}
                            onComplete={handleComplete}
                            onSnooze={handleSnooze}
                            isCompleting={completingId === r.id}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {groups.evening.length > 0 && (
                    <div>
                      <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide mb-2">
                        Evening
                      </p>
                      <div className="flex flex-col gap-3">
                        {groups.evening.map((r) => (
                          <ReminderCard
                            key={r.id}
                            reminder={r}
                            onComplete={handleComplete}
                            onSnooze={handleSnooze}
                            isCompleting={completingId === r.id}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  {todayReminders.map((r) => (
                    <ReminderCard
                      key={r.id}
                      reminder={r}
                      onComplete={handleComplete}
                      onSnooze={handleSnooze}
                      isCompleting={completingId === r.id}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Hot buyers */}
          {hotBuyers.length > 0 && (
            <section>
              <SectionHeading href="/buyers?temperatures=hot">Hot buyers</SectionHeading>
              <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4">
                {hotBuyers.map((b) => (
                  <BuyerPill key={b.id} buyer={b} />
                ))}
              </div>
            </section>
          )}

          {/* Recently added */}
          {recentlyAdded.length > 0 && (
            <section>
              <SectionHeading href="/buyers">Recently added</SectionHeading>
              <div className="flex gap-4 overflow-x-auto pb-1 -mx-4 px-4">
                {recentlyAdded.map((b) => (
                  <RecentBuyerAvatar key={b.id} buyer={b} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {snoozeReminderId && (
        <SnoozeModal
          reminderId={snoozeReminderId}
          onSnooze={handleSnoozeConfirm}
          onClose={() => setSnoozeReminderId(null)}
          isMobile
        />
      )}

      <BottomNav />
    </div>
  );
}
