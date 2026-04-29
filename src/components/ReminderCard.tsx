"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatBudgetLabel } from "@/lib/buyer-filters";
import type { ReminderWithBuyer } from "@/types/reminders";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatReminderTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit", hour12: true });
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
  return d.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" });
}

function TempBadge({ temp }: { temp: "hot" | "warm" | "cold" | null }) {
  if (!temp) return null;
  const styles = {
    hot: "bg-amber-100 text-amber-700",
    warm: "bg-teal-100 text-teal-700",
    cold: "bg-gray-100 text-gray-500",
  };
  return (
    <span className={cn("text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full", styles[temp])}>
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

export function ReminderCard({ reminder, showDate = false, onComplete, onSnooze, isCompleting }: Props) {
  const { buyer } = reminder;
  const [menuOpen, setMenuOpen] = useState(false);

  const budgetLabel = formatBudgetLabel(buyer.budget_min, buyer.budget_max);
  const suburbDisplay = buyer.preferred_suburbs?.[0]?.split(",")[0] ?? "";

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_8px_-2px_rgba(15,28,44,0.08)] p-4 flex gap-3">
      {/* Avatar */}
      <div className="shrink-0 w-11 h-11 rounded-full bg-[#2EC4B6] flex items-center justify-center">
        <span className="text-white text-[13px] font-bold">{initials(buyer.name)}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Name row */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[15px] font-semibold text-[#1B1B1D] leading-tight">{buyer.name}</span>
          <TempBadge temp={buyer.buyer_temperature} />
        </div>

        {/* Time + type */}
        <div className="flex items-center gap-1 mt-0.5">
          <span className="text-[12px] text-[#44474C]">
            {showDate ? formatReminderDate(reminder.reminder_at) + " · " : ""}
            {formatReminderTime(reminder.reminder_at)}
          </span>
          {reminder.reminder_type && (
            <>
              <span className="text-[#C5C6CD]">·</span>
              <span className="text-[12px] text-[#44474C]">{reminder.reminder_type}</span>
            </>
          )}
        </div>

        {/* Note */}
        {reminder.reminder_note && (
          <p className="text-[13px] text-[#44474C] mt-1 line-clamp-2">{reminder.reminder_note}</p>
        )}

        {/* Buyer details */}
        {(budgetLabel || suburbDisplay) && (
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {suburbDisplay && (
              <span className="text-[11px] text-[#75777D] bg-[#F5F3F4] rounded px-1.5 py-0.5">{suburbDisplay}</span>
            )}
            {budgetLabel && (
              <span className="text-[11px] text-[#75777D] bg-[#F5F3F4] rounded px-1.5 py-0.5">{budgetLabel}</span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3">
          {buyer.phone && (
            <a
              href={`tel:${buyer.phone}`}
              className="text-[13px] font-medium text-white bg-[#2EC4B6] rounded-full px-3 py-1.5 leading-none"
            >
              Call
            </a>
          )}
          {buyer.phone && (
            <a
              href={`sms:${buyer.phone}`}
              className="text-[13px] font-medium text-[#2EC4B6] border border-[#2EC4B6] rounded-full px-3 py-1.5 leading-none"
            >
              SMS
            </a>
          )}
          <button
            onClick={() => onComplete(reminder.id)}
            disabled={isCompleting}
            className="ml-auto flex items-center justify-center w-8 h-8 rounded-full border border-[#E0E1DD] text-[#2EC4B6] hover:bg-[#F0FFFE] transition-colors disabled:opacity-50"
            aria-label="Mark done"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </button>
          <button
            onClick={() => onSnooze(reminder.id)}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-[#E0E1DD] text-[#44474C] hover:bg-[#F5F3F4] transition-colors"
            aria-label="Snooze"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
          </button>
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center justify-center w-8 h-8 rounded-full border border-[#E0E1DD] text-[#44474C] hover:bg-[#F5F3F4] transition-colors"
              aria-label="More"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
              </svg>
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-9 z-20 bg-white rounded-xl shadow-lg border border-[#E0E1DD] py-1 min-w-[140px]">
                  <a
                    href={`/buyers/${buyer.id}`}
                    className="block px-4 py-2.5 text-[13px] text-[#1B1B1D] hover:bg-[#F5F3F4]"
                    onClick={() => setMenuOpen(false)}
                  >
                    Open profile
                  </a>
                  {buyer.email && (
                    <a
                      href={`mailto:${buyer.email}`}
                      className="block px-4 py-2.5 text-[13px] text-[#1B1B1D] hover:bg-[#F5F3F4]"
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
