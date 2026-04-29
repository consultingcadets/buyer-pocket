"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { getReminderDate } from "@/lib/reminder-utils";

type SnoozeOption = {
  label: string;
  sublabel: string;
  value: () => string;
};

const SNOOZE_OPTIONS: SnoozeOption[] = [
  {
    label: "1 hour",
    sublabel: "Quick snooze",
    value: () => {
      const d = new Date();
      d.setHours(d.getHours() + 1);
      return d.toISOString();
    },
  },
  {
    label: "Tonight 7pm",
    sublabel: "This evening",
    value: () => getReminderDate("tonight-7pm").toISOString(),
  },
  {
    label: "Tomorrow 9am",
    sublabel: "Morning",
    value: () => getReminderDate("tomorrow-9am").toISOString(),
  },
  {
    label: "Next Monday",
    sublabel: "Start of week",
    value: () => getReminderDate("next-monday-9am").toISOString(),
  },
];

type Props = {
  reminderId: string;
  onSnooze: (reminderId: string, snoozedUntil: string) => void;
  onClose: () => void;
  isMobile?: boolean;
};

export function SnoozeModal({ reminderId, onSnooze, onClose, isMobile = false }: Props) {
  const [customValue, setCustomValue] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleOption(valueFn: () => string) {
    startTransition(() => {
      onSnooze(reminderId, valueFn());
      onClose();
    });
  }

  function handleCustom() {
    if (!customValue) return;
    startTransition(() => {
      onSnooze(reminderId, new Date(customValue).toISOString());
      onClose();
    });
  }

  const content = (
    <div className="bg-white rounded-2xl overflow-hidden">
      <div className="px-5 pt-5 pb-4">
        <h3 className="text-[17px] font-semibold text-[#1B1B1D] mb-4">Snooze reminder</h3>
        <div className="flex flex-col gap-2">
          {SNOOZE_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => handleOption(opt.value)}
              disabled={isPending}
              className="flex items-center justify-between px-4 py-3 rounded-xl border border-[#E4E2E3] hover:border-[#2EC4B6] hover:bg-[#F0FFFE] transition-colors text-left"
            >
              <span className="text-[14px] font-medium text-[#1B1B1D]">{opt.label}</span>
              <span className="text-[12px] text-[#75777D]">{opt.sublabel}</span>
            </button>
          ))}
          <button
            onClick={() => setShowCustom((v) => !v)}
            className={cn(
              "flex items-center justify-between px-4 py-3 rounded-xl border transition-colors text-left",
              showCustom
                ? "border-[#2EC4B6] bg-[#F0FFFE]"
                : "border-[#E4E2E3] hover:border-[#2EC4B6] hover:bg-[#F0FFFE]"
            )}
          >
            <span className="text-[14px] font-medium text-[#1B1B1D]">Custom…</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
            </svg>
          </button>
          {showCustom && (
            <div className="flex gap-2">
              <input
                type="datetime-local"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                className="flex-1 rounded-xl border border-[#E4E2E3] px-3 py-2.5 text-[14px] text-[#1B1B1D] focus:outline-none focus:border-[#2EC4B6]"
              />
              <button
                onClick={handleCustom}
                disabled={!customValue || isPending}
                className="px-4 py-2.5 rounded-xl bg-[#2EC4B6] text-white text-[14px] font-medium disabled:opacity-40"
              >
                Set
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="px-5 pb-5">
        <button
          onClick={onClose}
          className="w-full text-center text-[14px] text-[#3A86FF] font-medium py-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose} />
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-8">{content}</div>
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
        <div className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
          {content}
        </div>
      </div>
    </>
  );
}
