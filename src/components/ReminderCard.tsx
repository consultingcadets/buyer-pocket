"use client";

import { useMemo } from "react";
import { Check, Clock, Phone, MessageSquare, BellRing } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBudgetLabel } from "@/lib/buyer-filters";
import type { ReminderWithBuyer } from "@/types/reminders";

function initials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  return trimmed
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatReminderTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-AU", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).toLowerCase();
}

function formatReminderDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function TempBadge({ temp }: { temp: "hot" | "warm" | "cold" | null }) {
  if (!temp) return null;
  const styles: Record<string, string> = {
    hot: "bg-secondary text-white",
    warm: "bg-accent text-white",
    cold: "bg-white text-primary border border-primary",
  };
  return (
    <span
      className={cn(
        "text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full",
        styles[temp]
      )}
    >
      {temp}
    </span>
  );
}

function SummaryTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-6 items-center rounded-full border border-border/60 bg-surface-container-low px-2 text-[12px] text-text-secondary">
      {children}
    </span>
  );
}

type Props = {
  reminder: ReminderWithBuyer;
  showDate?: boolean;
  onComplete: (id: string) => void;
  onSnooze: (id: string) => void;
  isCompleting?: boolean;
};

export function ReminderCard({
  reminder,
  showDate = false,
  onComplete,
  onSnooze,
  isCompleting,
}: Props) {
  const { buyer } = reminder;
  const budgetLabel = formatBudgetLabel(buyer.budget_min, buyer.budget_max);
  const suburbDisplay = buyer.preferred_suburbs?.[0]?.split(",")[0] ?? "";
  const bedsLabel = buyer.bedrooms ? `${buyer.bedrooms} bed` : "";
  const landLabel = buyer.land_size_min ? `${buyer.land_size_min}m²+` : "";

  const { isOverdueNow, isUpcomingNow } = useMemo(() => {
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now();
    const reminderTs = new Date(reminder.reminder_at).getTime();
    return {
      isOverdueNow: reminderTs < now && reminder.status !== "completed",
      isUpcomingNow: reminderTs >= now && reminder.status !== "completed",
    };
  }, [reminder.reminder_at, reminder.status]);
  const timeToneClass = isOverdueNow
    ? "text-error"
    : isUpcomingNow
      ? "text-teal-action"
      : "text-text-secondary";

  const summaryItems = [suburbDisplay, budgetLabel, bedsLabel, landLabel].filter(Boolean);

  return (
    <div className="w-full rounded-2xl border border-border/70 bg-white p-4 lg:p-5 shadow-card transition-shadow hover:shadow-dropdown">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary">
          <span className="text-white text-[11px] font-bold">{initials(buyer.name)}</span>
        </div>
        <h4 className="text-[18px] font-semibold text-primary leading-tight min-w-0 truncate">
          {buyer.name}
        </h4>
        <div className="ml-auto">
          <TempBadge temp={buyer.buyer_temperature} />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 border-b border-border/60 pb-3">
        <Clock size={14} className={timeToneClass} />
        <span className={cn("text-[14px] font-semibold", timeToneClass)}>
          {showDate ? `${formatReminderDate(reminder.reminder_at)} · ` : ""}
          {formatReminderTime(reminder.reminder_at)}
        </span>
        {reminder.reminder_type && (
          <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-surface-container-low px-2 py-0.5 text-[12px] text-text-secondary">
            <BellRing size={12} />
            {reminder.reminder_type}
          </span>
        )}
      </div>

      {summaryItems.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {summaryItems.map((item, index) => (
            <div key={`${item}-${index}`} className="inline-flex items-center gap-1.5">
              {index > 0 && <span className="text-text-secondary text-[12px]">·</span>}
              <SummaryTag>{item}</SummaryTag>
            </div>
          ))}
        </div>
      )}

      {reminder.reminder_note && (
        <p className="mt-2 text-[12px] text-text-secondary italic line-clamp-2">
          {reminder.reminder_note}
        </p>
      )}

      <div className="mt-4 flex items-center gap-2">
        <div className="flex items-center gap-2">
          {buyer.phone && (
            <a
              href={`tel:${buyer.phone}`}
              className="inline-flex h-11 min-w-24 items-center justify-center gap-1.5 rounded-lg bg-teal-action px-4 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-teal-action/90"
            >
              <Phone size={14} />
              Call
            </a>
          )}
          {buyer.phone && (
            <a
              href={`sms:${buyer.phone}`}
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg border border-border px-4 text-[14px] font-semibold text-primary transition-colors hover:bg-surface-container-low"
            >
              <MessageSquare size={14} />
              SMS
            </a>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => onComplete(reminder.id)}
            disabled={isCompleting}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:bg-surface-container-low disabled:opacity-50"
            aria-label="Done"
          >
            <Check size={16} />
          </button>
          <button
            onClick={() => onSnooze(reminder.id)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:bg-surface-container-low"
            aria-label="Snooze"
          >
            <Clock size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
