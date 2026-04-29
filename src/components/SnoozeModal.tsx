"use client";

import { useState, useTransition } from "react";
import { Calendar } from "lucide-react";
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
    label: "Next Monday 9am",
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
    <div className="bg-surface rounded-2xl overflow-hidden">
      <div className="px-5 pt-5 pb-4">
        <h3 className="text-[17px] font-semibold text-foreground mb-4">Snooze until</h3>
        <div className="flex flex-col gap-2">
          {SNOOZE_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => handleOption(opt.value)}
              disabled={isPending}
              className="flex items-center justify-between px-4 py-3 rounded-xl border border-border hover:border-secondary hover:bg-secondary/5 transition-colors text-left"
            >
              <span className="text-[14px] font-medium text-foreground">{opt.label}</span>
              <span className="text-[12px] text-foreground-subtle">{opt.sublabel}</span>
            </button>
          ))}
          <button
            onClick={() => setShowCustom((v) => !v)}
            className={cn(
              "flex items-center justify-between px-4 py-3 rounded-xl border transition-colors text-left",
              showCustom
                ? "border-secondary bg-secondary/5"
                : "border-border hover:border-secondary hover:bg-secondary/5"
            )}
          >
            <span className="text-[14px] font-medium text-foreground">Custom…</span>
            <Calendar size={16} className="text-foreground-subtle" />
          </button>
          {showCustom && (
            <div className="flex gap-2">
              <input
                type="datetime-local"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                className="flex-1 rounded-xl border border-border px-3 py-2.5 text-[14px] text-foreground focus:outline-none focus:border-secondary"
              />
              <button
                onClick={handleCustom}
                disabled={!customValue || isPending}
                className="px-4 py-2.5 rounded-xl bg-secondary text-white text-[14px] font-medium disabled:opacity-40"
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
          className="w-full text-center text-[14px] text-accent font-medium py-2"
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
