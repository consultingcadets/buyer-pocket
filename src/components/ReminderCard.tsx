"use client";

import { Check, Clock } from "lucide-react";
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
  });
}

function formatReminderDate(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
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
        "text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full",
        styles[temp]
      )}
    >
      {temp}
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

  const isOverdue = new Date(reminder.reminder_at).getTime() < Date.now();

  return (
    <div className="bg-white rounded-xl border border-border shadow-card p-4 flex gap-3">
      {/* Avatar */}
      <div className="shrink-0 w-9 h-9 rounded-full bg-primary flex items-center justify-center mt-0.5">
        <span className="text-white text-[12px] font-bold">{initials(buyer.name)}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Name + badge + type label */}
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            <span className="text-[14px] font-semibold text-text-primary leading-tight">
              {buyer.name}
            </span>
            <TempBadge temp={buyer.buyer_temperature} />
          </div>
          {reminder.reminder_type && (
            <span className="shrink-0 text-[10px] font-semibold text-text-secondary uppercase tracking-wide">
              {reminder.reminder_type}
            </span>
          )}
        </div>

        {/* Time */}
        <div className="flex items-center gap-1 mt-0.5">
          <Clock size={11} className={cn("shrink-0", isOverdue ? "text-error" : "text-text-secondary")} />
          <span className={cn("text-[12px]", isOverdue ? "text-error font-medium" : "text-text-secondary")}>
            {showDate ? formatReminderDate(reminder.reminder_at) + " · " : ""}
            {formatReminderTime(reminder.reminder_at)}
          </span>
        </div>

        {/* Note */}
        {reminder.reminder_note && (
          <blockquote className="mt-2 border-l-2 border-border pl-3 text-[12px] text-text-secondary italic line-clamp-2">
            &ldquo;{reminder.reminder_note}&rdquo;
          </blockquote>
        )}

        {/* Buyer tags */}
        {(budgetLabel || suburbDisplay) && (
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            {suburbDisplay && (
              <span className="text-[11px] text-text-secondary bg-surface-container-low rounded-md px-1.5 py-0.5">
                {suburbDisplay}
              </span>
            )}
            {budgetLabel && (
              <span className="text-[11px] text-text-secondary bg-surface-container-low rounded-md px-1.5 py-0.5">
                {budgetLabel}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3">
          {buyer.phone && (
            <a
              href={`tel:${buyer.phone}`}
              className="flex items-center text-[12px] font-semibold text-white bg-teal-action rounded-full px-3 py-1.5 leading-none hover:bg-teal-action/90 transition-colors"
            >
              Call
            </a>
          )}
          {buyer.phone && (
            <a
              href={`sms:${buyer.phone}`}
              className="flex items-center text-[12px] font-semibold text-teal-action border border-teal-action/40 rounded-full px-3 py-1.5 leading-none hover:bg-teal-action/5 transition-colors"
            >
              SMS
            </a>
          )}

          {/* Done */}
          <button
            onClick={() => onComplete(reminder.id)}
            disabled={isCompleting}
            className="ml-auto flex items-center justify-center w-9 h-9 rounded-full border border-teal-action/30 text-teal-action hover:bg-teal-action/8 transition-colors disabled:opacity-50"
            aria-label="Mark done"
          >
            <Check size={15} />
          </button>

          {/* Snooze */}
          <button
            onClick={() => onSnooze(reminder.id)}
            className="flex items-center justify-center w-9 h-9 rounded-full border border-border text-text-secondary hover:bg-surface-container-low transition-colors"
            aria-label="Snooze"
          >
            <Clock size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
