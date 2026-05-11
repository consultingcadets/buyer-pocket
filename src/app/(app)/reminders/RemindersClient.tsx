"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { ReminderCard } from "@/components/ReminderCard";
import { SnoozeModal } from "@/components/SnoozeModal";
import { fetchReminders, completeReminder, snoozeReminder } from "./actions";
import { cn } from "@/lib/utils";
import type { ReminderWithBuyer } from "@/types/reminders";
import type { ReminderTab } from "./actions";

type Counts = {
  today: number;
  upcoming: number;
  overdue: number;
  completed: number;
};

function groupByDay(reminders: ReminderWithBuyer[]): { label: string; items: ReminderWithBuyer[] }[] {
  const map = new Map<string, ReminderWithBuyer[]>();
  for (const r of reminders) {
    const d = new Date(r.reminder_at);
    const weekday = d.toLocaleDateString("en-AU", { weekday: "short" }).toUpperCase();
    const day = d.toLocaleDateString("en-AU", { day: "numeric" });
    const month = d.toLocaleDateString("en-AU", { month: "short" }).toUpperCase();
    const key = `${weekday}, ${day} ${month}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(r);
  }
  return Array.from(map.entries()).map(([label, items]) => ({ label, items }));
}

function groupByWeek(reminders: ReminderWithBuyer[]): { label: string; items: ReminderWithBuyer[] }[] {
  const map = new Map<string, ReminderWithBuyer[]>();
  for (const r of reminders) {
    const d = new Date(r.completed_at ?? r.reminder_at);
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const key = `${weekStart.toLocaleDateString("en-AU", { day: "numeric", month: "short" })} – ${weekEnd.toLocaleDateString("en-AU", { day: "numeric", month: "short" })}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(r);
  }
  return Array.from(map.entries()).map(([label, items]) => ({ label, items }));
}

function EmptyState({ tab }: { tab: ReminderTab }) {
  const messages: Record<ReminderTab, { heading: string; body?: string }> = {
    today: { heading: "No reminders for today. Nice." },
    upcoming: { heading: "No upcoming reminders.", body: "Add one from a buyer profile." },
    overdue: { heading: "Nothing overdue. Good work." },
    completed: { heading: "Completed reminders will show here." },
  };
  const { heading, body } = messages[tab];
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-8">
      <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4">
        <Bell size={28} className="text-text-secondary" strokeWidth={1.5} />
      </div>
      <p className="text-[17px] font-semibold text-text-primary">{heading}</p>
      {body && <p className="text-[14px] text-text-secondary mt-1 max-w-xs">{body}</p>}
    </div>
  );
}

type Props = {
  initialTab: ReminderTab;
  initialReminders: ReminderWithBuyer[];
  counts: Counts;
};

export function RemindersClient({ initialTab, initialReminders, counts: initialCounts }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ReminderTab>(initialTab);
  const [reminders, setReminders] = useState<ReminderWithBuyer[]>(initialReminders);
  const [counts] = useState<Counts>(initialCounts);
  const [isLoading, setIsLoading] = useState(false);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [snoozeReminderId, setSnoozeReminderId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const loadTab = useCallback(async (tab: ReminderTab) => {
    setActiveTab(tab);
    setIsLoading(true);
    const { reminders: data } = await fetchReminders(tab);
    setReminders(data);
    setIsLoading(false);
  }, []);

  function removeReminder(id: string) {
    setReminders((prev) => prev.filter((r) => r.id !== id));
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

  function handleSnoozeConfirm(id: string, snoozedUntil: string) {
    startTransition(async () => {
      const { error } = await snoozeReminder(id, snoozedUntil);
      if (!error) {
        removeReminder(id);
        router.refresh();
      }
    });
  }

  const TABS: { id: ReminderTab; label: string; count: number; alert?: boolean }[] = [
    { id: "today", label: "Today", count: counts.today },
    { id: "upcoming", label: "Upcoming", count: counts.upcoming },
    { id: "overdue", label: "Overdue", count: counts.overdue, alert: counts.overdue > 0 },
    { id: "completed", label: "Completed", count: counts.completed },
  ];

  function renderList() {
    if (isLoading) {
      return (
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-surface-container-low rounded-2xl h-28 animate-pulse" />
          ))}
        </div>
      );
    }
    if (reminders.length === 0) return <EmptyState tab={activeTab} />;

    if (activeTab === "upcoming") {
      const groups = groupByDay(reminders);
      return (
        <div className="flex flex-col gap-4">
          {groups.map((g) => (
            <div key={g.label} className="mt-4 first:mt-0">
              <p className="text-[12px] font-semibold text-primary uppercase tracking-wide mb-2">{g.label}</p>
              <div className="flex flex-col gap-3">
                {g.items.map((r) => (
                  <ReminderCard key={r.id} reminder={r} onComplete={handleComplete} onSnooze={setSnoozeReminderId} isCompleting={completingId === r.id} />
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === "completed") {
      const groups = groupByWeek(reminders);
      return (
        <div className="flex flex-col gap-4">
          {groups.map((g) => (
            <div key={g.label} className="mt-4 first:mt-0">
              <p className="text-[12px] font-semibold text-primary uppercase tracking-wide mb-2">{g.label}</p>
              <div className="flex flex-col gap-3">
                {g.items.map((r) => (
                  <ReminderCard key={r.id} reminder={r} showDate onComplete={handleComplete} onSnooze={setSnoozeReminderId} isCompleting={completingId === r.id} />
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-3">
        {reminders.map((r) => (
          <ReminderCard
            key={r.id}
            reminder={r}
            showDate={activeTab === "overdue"}
            onComplete={handleComplete}
            onSnooze={setSnoozeReminderId}
            isCompleting={completingId === r.id}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-container-low pb-24">
      <div className="bg-white pb-0 border-b border-border">
        <div className="px-4 lg:px-6 pt-4 lg:pt-6">
          <h1 className="text-[22px] lg:text-[32px] lg:leading-[1.2] lg:tracking-[-0.01em] font-bold text-primary pb-4">Reminders</h1>
        </div>
        {/* Tabs */}
        <div className="flex gap-2 px-4 lg:px-6 pb-4 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => loadTab(tab.id)}
              className={cn(
                "shrink-0 flex items-center gap-1.5 h-10 px-4 text-[13px] font-semibold rounded-full transition-colors",
                activeTab === tab.id
                  ? "bg-teal-action text-white"
                  : "bg-surface-container text-text-secondary hover:text-text-primary"
              )}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={cn(
                    "text-[11px] font-bold rounded-full px-1.5 py-0.5 leading-none",
                    activeTab === tab.id
                      ? "bg-white/20 text-white"
                      : tab.alert
                        ? "bg-error/10 text-error"
                        : "bg-surface-container-high text-text-secondary"
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="w-full px-4 lg:px-6 pt-4 pb-6">{renderList()}</div>

      {snoozeReminderId && (
        <SnoozeModal
          reminderId={snoozeReminderId}
          onSnooze={handleSnoozeConfirm}
          onClose={() => setSnoozeReminderId(null)}
          isMobile
        />
      )}

    </div>
  );
}
