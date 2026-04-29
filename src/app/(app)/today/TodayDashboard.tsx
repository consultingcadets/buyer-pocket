"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { ReminderCard } from "@/components/ReminderCard";
import { SnoozeModal } from "@/components/SnoozeModal";
import { completeReminder, snoozeReminder } from "@/app/(app)/reminders/actions";
import { formatBudgetLabel } from "@/lib/buyer-filters";
import { cn } from "@/lib/utils";
import type { ReminderWithBuyer } from "@/types/reminders";
import type { Buyer } from "@/types/database";

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricCard({
  value,
  label,
  alert,
}: {
  value: number;
  label: string;
  alert?: boolean;
}) {
  return (
    <div className={cn("flex-1 rounded-2xl p-4 flex flex-col items-center gap-1", alert ? "bg-error-bg" : "bg-white shadow-card")}>
      <span className={cn("text-[22px] font-bold", alert ? "text-error" : "text-text-primary")}>{value}</span>
      <span className={cn("text-[10px] font-medium text-center leading-tight", alert ? "text-error" : "text-text-secondary")}>{label}</span>
    </div>
  );
}

function BuyerPill({ buyer }: { buyer: Buyer }) {
  const initials = buyer.name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const budgetLabel = formatBudgetLabel(buyer.budget_min, buyer.budget_max);
  const temp = buyer.buyer_temperature;
  const tempStyles: Record<string, string> = {
    hot: "bg-secondary text-white",
    warm: "bg-accent text-white",
    cold: "bg-white text-primary border border-primary",
  };
  const tempColor = temp ? (tempStyles[temp] ?? "bg-surface-container text-text-secondary") : null;

  return (
    <Link href={`/buyers/${buyer.id}`} className="shrink-0 w-40 bg-white rounded-2xl shadow-card p-3 flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
          <span className="text-white text-[11px] font-bold">{initials}</span>
        </div>
        {temp && tempColor && (
          <span className={cn("text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full", tempColor)}>{temp}</span>
        )}
      </div>
      <span className="text-[13px] font-semibold text-text-primary leading-tight line-clamp-1">{buyer.name}</span>
      {budgetLabel && <span className="text-[11px] text-text-secondary">{budgetLabel}</span>}
    </Link>
  );
}

function RecentBuyerAvatar({ buyer }: { buyer: Buyer }) {
  const initials = buyer.name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <Link href={`/buyers/${buyer.id}`} className="shrink-0 flex flex-col items-center gap-1 w-14">
      <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center">
        <span className="text-text-secondary text-[13px] font-bold">{initials}</span>
      </div>
      <span className="text-[10px] text-text-secondary text-center leading-tight line-clamp-1">{buyer.name.split(" ")[0]}</span>
    </Link>
  );
}

function SectionHeading({ children, href }: { children: React.ReactNode; href?: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-[16px] font-semibold text-text-primary">{children}</h2>
      {href && (
        <Link href={href} className="text-[13px] text-accent font-medium">
          See all
        </Link>
      )}
    </div>
  );
}

function greeting(name: string | null | undefined): string {
  const hour = new Date().getHours();
  const time = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
  return `Good ${time}${name ? `, ${name.split(" ")[0]}` : ""}`;
}

function todayDateLabel(): string {
  return new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" });
}

function groupByTimePeriod(reminders: ReminderWithBuyer[]): {
  morning: ReminderWithBuyer[];
  afternoon: ReminderWithBuyer[];
  evening: ReminderWithBuyer[];
} {
  const groups = { morning: [] as ReminderWithBuyer[], afternoon: [] as ReminderWithBuyer[], evening: [] as ReminderWithBuyer[] };
  for (const r of reminders) {
    const hour = new Date(r.reminder_at).getHours();
    if (hour < 12) groups.morning.push(r);
    else if (hour < 17) groups.afternoon.push(r);
    else groups.evening.push(r);
  }
  return groups;
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
  const hasNoReminders = todayReminders.length === 0 && overdueReminders.length === 0;

  return (
    <div className="min-h-screen bg-surface-container-low pb-24">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-5 shadow-sm">
        <p className="text-[22px] font-bold text-text-primary">{greeting(profileName)}</p>
        <p className="text-[13px] text-text-secondary mt-0.5">{todayDateLabel()}</p>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-5">
        {/* Metric cards */}
        <div className="flex gap-3">
          <MetricCard value={todayCount} label="Reminders today" />
          <MetricCard value={overdueCount} label="Overdue" alert={overdueCount > 0} />
          <MetricCard value={buyersThisWeek} label="Added this week" />
        </div>

        {/* Empty state */}
        {hasNoReminders && (
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center text-center shadow-card">
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-3">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary">
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
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-error" />
              <h2 className="text-[13px] font-semibold text-error uppercase tracking-wide">Overdue</h2>
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

        {/* Today's reminders — grouped by time of day if > 4 */}
        {todayReminders.length > 0 && (
          <section>
            <SectionHeading href="/reminders">Today&apos;s reminders</SectionHeading>
            {todayReminders.length > 4 ? (
              <>
                {groups.morning.length > 0 && (
                  <div className="mb-3">
                    <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide mb-2">Morning</p>
                    <div className="flex flex-col gap-3">
                      {groups.morning.map((r) => (
                        <ReminderCard key={r.id} reminder={r} onComplete={handleComplete} onSnooze={handleSnooze} isCompleting={completingId === r.id} />
                      ))}
                    </div>
                  </div>
                )}
                {groups.afternoon.length > 0 && (
                  <div className="mb-3">
                    <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide mb-2">Afternoon</p>
                    <div className="flex flex-col gap-3">
                      {groups.afternoon.map((r) => (
                        <ReminderCard key={r.id} reminder={r} onComplete={handleComplete} onSnooze={handleSnooze} isCompleting={completingId === r.id} />
                      ))}
                    </div>
                  </div>
                )}
                {groups.evening.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide mb-2">Evening</p>
                    <div className="flex flex-col gap-3">
                      {groups.evening.map((r) => (
                        <ReminderCard key={r.id} reminder={r} onComplete={handleComplete} onSnooze={handleSnooze} isCompleting={completingId === r.id} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col gap-3">
                {todayReminders.map((r) => (
                  <ReminderCard key={r.id} reminder={r} onComplete={handleComplete} onSnooze={handleSnooze} isCompleting={completingId === r.id} />
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
