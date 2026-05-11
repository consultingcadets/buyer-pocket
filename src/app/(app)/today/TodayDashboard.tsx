"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReminderCard } from "@/components/ReminderCard";
import { SnoozeModal } from "@/components/SnoozeModal";
import { completeReminder, snoozeReminder } from "@/app/(app)/reminders/actions";
import { formatBudgetLabel } from "@/lib/buyer-filters";
import { cn } from "@/lib/utils";
import type { ReminderWithBuyer } from "@/types/reminders";
import type { Buyer } from "@/types/database";

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

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-white rounded-lg border border-border shadow-card px-4 py-3 min-h-12 flex-1">
      <p className="text-[14px] text-text-secondary">{label}</p>
      <p className="text-[32px] font-bold leading-[1.2] tracking-[-0.01em] text-primary">{value}</p>
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
      className="shrink-0 w-44 bg-white rounded-2xl shadow-card p-3 flex flex-col gap-1.5 border border-border/40"
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
      {budgetLabel && <span className="text-[11px] text-text-secondary">{budgetLabel}</span>}
    </Link>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[24px] font-semibold text-text-primary mb-3">{children}</h2>;
}

function ChecklistRow({
  done,
  label,
  helper,
  actionLabel,
  href,
  disabled,
}: {
  done: boolean;
  label: string;
  helper: string;
  actionLabel?: string;
  href?: string;
  disabled?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-3 rounded-lg border border-border px-4 py-3",
        disabled && "bg-surface-container-low opacity-70"
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "w-6 h-6 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center",
            done ? "bg-teal-action border-teal-action text-white" : "border-border text-transparent"
          )}
          aria-hidden="true"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <div>
          <p className="text-[16px] font-semibold text-text-primary">{label}</p>
          <p className="text-[14px] text-text-secondary">{helper}</p>
        </div>
      </div>
      {actionLabel && href && (
        <Link
          href={href}
          className={cn(
            "shrink-0 h-12 min-w-24 px-4 rounded-lg text-[14px] font-semibold inline-flex items-center justify-center",
            disabled
              ? "pointer-events-none bg-surface-container text-text-secondary border border-border"
              : "bg-teal-action text-white"
          )}
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

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

export function TodayDashboard(props: Props) {
  const {
    profileName,
    todayReminders: initialToday,
    overdueReminders: initialOverdue,
    recentlyAdded,
    todayCount,
    buyersThisWeek,
  } = props;
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

  async function handleSnoozeConfirm(id: string, snoozedUntil: string) {
    const { error } = await snoozeReminder(id, snoozedUntil);
    if (!error) {
      removeReminder(id);
      router.refresh();
    }
  }

  const groups = groupByTimePeriod(todayReminders);
  const hasNoReminders = todayReminders.length === 0 && overdueReminders.length === 0;
  const hasAnyBuyers = recentlyAdded.length > 0;
  const isNewUserWelcome = !hasAnyBuyers && hasNoReminders && buyersThisWeek === 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden lg:block">
        <div className="mx-auto px-8 pt-8 pb-8 space-y-6">
          {!isNewUserWelcome && (
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="text-[32px] font-bold leading-[1.2] tracking-[-0.01em] text-primary">
                  {greeting(profileName)}
                </h2>
                <p className="text-[14px] text-text-secondary mt-1">{todayDateLabel()}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
                <StatCard value={todayCount} label="Reminders today" />
                <StatCard value={buyersThisWeek} label="Buyers this week" />
              </div>
            </div>
          )}

          {isNewUserWelcome ? (
            <section className="max-w-3xl">
              <div className="bg-white rounded-xl border border-border shadow-card p-6 space-y-5">
                <div>
                  <h2 className="text-[32px] font-bold leading-[1.2] tracking-[-0.01em] text-primary">
                    Welcome to BuyerPocket.
                  </h2>
                  <p className="text-[16px] text-text-secondary mt-1">Three things to get you started.</p>
                </div>
                <div className="space-y-3">
                  <ChecklistRow
                    done={hasAnyBuyers}
                    label="Add your first buyer"
                    helper="It takes about 30 seconds."
                    actionLabel="Add buyer"
                    href="/add"
                  />
                  <ChecklistRow
                    done={false}
                    label="Set a follow-up reminder"
                    helper="Pick when to call them next."
                    disabled={!hasAnyBuyers}
                  />
                  <ChecklistRow
                    done={false}
                    label="Enable phone notifications"
                    helper="So your reminders actually reach you."
                    actionLabel="Enable"
                    href="/settings#notifications"
                  />
                </div>
              </div>
            </section>
          ) : (
            <>
              {overdueReminders.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <SectionHeading>Overdue</SectionHeading>
                    <span className="h-6 min-w-6 px-2 rounded-full bg-error text-white text-[12px] font-semibold inline-flex items-center justify-center mb-2">
                      {overdueReminders.length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {overdueReminders.map((r) => (
                      <ReminderCard
                        key={r.id}
                        reminder={r}
                        showDate
                        onComplete={handleComplete}
                        onSnooze={setSnoozeReminderId}
                        isCompleting={completingId === r.id}
                      />
                    ))}
                  </div>
                </section>
              )}

              <section>
                <SectionHeading>Today&apos;s reminders</SectionHeading>
                {todayReminders.length > 0 ? (
                  <div className="space-y-3">
                    {todayReminders.map((r) => (
                      <ReminderCard
                        key={r.id}
                        reminder={r}
                        onComplete={handleComplete}
                        onSnooze={setSnoozeReminderId}
                        isCompleting={completingId === r.id}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 text-[14px] text-text-secondary">
                    <span className="w-5 h-5 rounded-full bg-teal-action/15 inline-flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-teal-action">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </span>
                    <span>Nothing for today. Take a breath.</span>
                  </div>
                )}
              </section>

              {recentlyAdded.length > 0 && (
                <section>
                  <SectionHeading>Recently added</SectionHeading>
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {recentlyAdded.slice(0, 5).map((b) => (
                      <BuyerPill key={b.id} buyer={b} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
        {snoozeReminderId && (
          <SnoozeModal
            reminderId={snoozeReminderId}
            onSnooze={handleSnoozeConfirm}
            onClose={() => setSnoozeReminderId(null)}
          />
        )}
      </div>

      <div className="lg:hidden pb-24 bg-surface-container-low min-h-screen">
        {!isNewUserWelcome && (
          <div className="bg-white px-4 pt-4 pb-4 border-b border-border">
            <h2 className="text-[32px] font-bold leading-[1.2] tracking-[-0.01em] text-primary">
              {greeting(profileName)}
            </h2>
            <p className="text-[14px] text-text-secondary mt-1">{todayDateLabel()}</p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <StatCard value={todayCount} label="Reminders today" />
              <StatCard value={buyersThisWeek} label="Buyers this week" />
            </div>
          </div>
        )}

        <div className="px-4 pt-4 flex flex-col gap-5">
          {isNewUserWelcome ? (
            <section className="bg-white rounded-xl border border-border shadow-card p-5 space-y-4">
              <div>
                <h2 className="text-[24px] font-semibold text-text-primary">Welcome to BuyerPocket.</h2>
                <p className="text-[14px] text-text-secondary mt-1">Three things to get you started.</p>
              </div>
              <div className="space-y-3">
                <ChecklistRow
                  done={hasAnyBuyers}
                  label="Add your first buyer"
                  helper="It takes about 30 seconds."
                  actionLabel="Add buyer"
                  href="/add"
                />
                <ChecklistRow
                  done={false}
                  label="Set a follow-up reminder"
                  helper="Pick when to call them next."
                  disabled={!hasAnyBuyers}
                />
                <ChecklistRow
                  done={false}
                  label="Enable phone notifications"
                  helper="So your reminders actually reach you."
                  actionLabel="Enable"
                  href="/settings#notifications"
                />
              </div>
            </section>
          ) : (
            <>
              {overdueReminders.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <h2 className="text-[20px] font-semibold text-text-primary">Overdue</h2>
                    <span className="h-6 min-w-6 px-2 rounded-full bg-error text-white text-[12px] font-semibold inline-flex items-center justify-center">
                      {overdueReminders.length}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {overdueReminders.map((r) => (
                      <ReminderCard
                        key={r.id}
                        reminder={r}
                        showDate
                        onComplete={handleComplete}
                        onSnooze={setSnoozeReminderId}
                        isCompleting={completingId === r.id}
                      />
                    ))}
                  </div>
                </section>
              )}

              <section>
                <h2 className="text-[20px] font-semibold text-text-primary mb-3">Today&apos;s reminders</h2>
                {todayReminders.length > 0 ? (
                  todayReminders.length > 4 ? (
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
                                onSnooze={setSnoozeReminderId}
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
                                onSnooze={setSnoozeReminderId}
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
                                onSnooze={setSnoozeReminderId}
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
                          onSnooze={setSnoozeReminderId}
                          isCompleting={completingId === r.id}
                        />
                      ))}
                    </div>
                  )
                ) : (
                  <div className="inline-flex items-center gap-2 text-[14px] text-text-secondary">
                    <span className="w-5 h-5 rounded-full bg-teal-action/15 inline-flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-teal-action">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </span>
                    <span>Nothing for today. Take a breath.</span>
                  </div>
                )}
              </section>

              {recentlyAdded.length > 0 && (
                <section>
                  <h2 className="text-[20px] font-semibold text-text-primary mb-3">Recently added</h2>
                  <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4">
                    {recentlyAdded.slice(0, 5).map((b) => (
                      <BuyerPill key={b.id} buyer={b} />
                    ))}
                  </div>
                </section>
              )}
            </>
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
      </div>

    </div>
  );
}
