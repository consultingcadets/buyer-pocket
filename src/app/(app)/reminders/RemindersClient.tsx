"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { ReminderCard } from "@/components/ReminderCard";
import { SnoozeModal } from "@/components/SnoozeModal";
import { ReminderPickerModal } from "@/components/ReminderPickerModal";
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
    const key = d.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" });
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
  const messages: Record<ReminderTab, { heading: string; body: string }> = {
    today: { heading: "Nothing for today.", body: "No follow-ups due. Take a breath." },
    upcoming: { heading: "No upcoming reminders.", body: "Set a reminder from any buyer profile to never miss a follow-up." },
    overdue: { heading: "All caught up!", body: "No overdue reminders." },
    completed: { heading: "No completed reminders yet.", body: "Mark reminders as done to see them here." },
  };
  const { heading, body } = messages[tab];
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-8">
      <div className="w-16 h-16 rounded-full bg-[#F0EDEE] flex items-center justify-center mb-4">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#75777D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      </div>
      <p className="text-[17px] font-semibold text-[#1B1B1D]">{heading}</p>
      <p className="text-[13px] text-[#44474C] mt-1 max-w-xs">{body}</p>
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
  const [isPending, startTransition] = useTransition();

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
            <div key={i} className="bg-white rounded-2xl h-28 animate-pulse" />
          ))}
        </div>
      );
    }
    if (reminders.length === 0) return <EmptyState tab={activeTab} />;

    if (activeTab === "upcoming") {
      const groups = groupByDay(reminders);
      return (
        <div className="flex flex-col gap-5">
          {groups.map((g) => (
            <div key={g.label}>
              <p className="text-[11px] font-semibold text-[#75777D] uppercase tracking-wide mb-2">{g.label}</p>
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
        <div className="flex flex-col gap-5">
          {groups.map((g) => (
            <div key={g.label}>
              <p className="text-[11px] font-semibold text-[#75777D] uppercase tracking-wide mb-2">{g.label}</p>
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

    // today + overdue: flat list
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
    <div className="min-h-screen bg-[#F5F3F4] pb-24">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-0 shadow-sm">
        <h1 className="text-[22px] font-bold text-[#1B1B1D] pb-4">Reminders</h1>
        {/* Tabs */}
        <div className="flex gap-0 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => loadTab(tab.id)}
              className={cn(
                "shrink-0 flex items-center gap-1.5 px-4 py-3 text-[13px] font-semibold border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-[#2EC4B6] text-[#2EC4B6]"
                  : "border-transparent text-[#44474C]"
              )}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={cn(
                    "text-[11px] font-bold rounded-full px-1.5 py-0.5 leading-none",
                    tab.alert ? "bg-red-100 text-red-600" : "bg-[#F0EDEE] text-[#44474C]"
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
      <div className="px-4 pt-4">{renderList()}</div>

      {/* Snooze modal */}
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
