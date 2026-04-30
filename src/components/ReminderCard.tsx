"use client";

import { useState } from "react";
import { Check, Clock, MoreVertical } from "lucide-react";
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
  const [menuOpen, setMenuOpen] = useState(false);

  const budgetLabel = formatBudgetLabel(buyer.budget_min, buyer.budget_max);
  const suburbDisplay = buyer.preferred_suburbs?.[0]?.split(",")[0] ?? "";

  return (
    <div className="bg-white rounded-xl border border-border shadow-card p-4 flex gap-3">
      {/* Avatar */}
      <div className="shrink-0 w-9 h-9 rounded-full bg-secondary/15 flex items-center justify-center mt-0.5">
        <span className="text-secondary text-[12px] font-bold">{initials(buyer.name)}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Name + badge */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[14px] font-semibold text-text-primary leading-tight">
            {buyer.name}
          </span>
          <TempBadge temp={buyer.buyer_temperature} />
        </div>

        {/* Time + type */}
        <div className="flex items-center gap-1 mt-0.5">
          <span className="text-[12px] text-text-secondary">
            {showDate ? formatReminderDate(reminder.reminder_at) + " · " : ""}
            {formatReminderTime(reminder.reminder_at)}
          </span>
          {reminder.reminder_type && (
            <>
              <span className="text-outline-variant">·</span>
              <span className="text-[12px] text-text-secondary">{reminder.reminder_type}</span>
            </>
          )}
        </div>

        {/* Note */}
        {reminder.reminder_note && (
          <p className="text-[12px] text-text-secondary mt-1 line-clamp-2">
            {reminder.reminder_note}
          </p>
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
              className="flex items-center text-[12px] font-semibold text-white bg-secondary rounded-full px-3 py-1.5 leading-none hover:bg-secondary/90 transition-colors"
            >
              Call
            </a>
          )}
          {buyer.phone && (
            <a
              href={`sms:${buyer.phone}`}
              className="flex items-center text-[12px] font-semibold text-secondary border border-secondary/40 rounded-full px-3 py-1.5 leading-none hover:bg-secondary/5 transition-colors"
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

          {/* More */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center justify-center w-9 h-9 rounded-full border border-border text-text-secondary hover:bg-surface-container-low transition-colors"
              aria-label="More options"
            >
              <MoreVertical size={15} />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-10 z-20 bg-white rounded-xl shadow-dropdown border border-border py-1 min-w-[140px]">
                  <a
                    href={`/buyers/${buyer.id}`}
                    className="block px-4 py-2.5 text-[13px] text-text-primary hover:bg-surface-container-low"
                    onClick={() => setMenuOpen(false)}
                  >
                    Open profile
                  </a>
                  {buyer.email && (
                    <a
                      href={`mailto:${buyer.email}`}
                      className="block px-4 py-2.5 text-[13px] text-text-primary hover:bg-surface-container-low"
                      onClick={() => setMenuOpen(false)}
                    >
                      Email
                    </a>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
