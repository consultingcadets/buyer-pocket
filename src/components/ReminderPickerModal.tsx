"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { getReminderDate } from "@/lib/reminder-utils";
import type { ReminderChip } from "@/lib/reminder-utils";
import { REMINDER_TYPES } from "@/types/reminders";
import { setReminder } from "@/app/(app)/reminders/actions";

type QuickChip = {
  label: string;
  sublabel: string;
  value: Exclude<ReminderChip, null>;
};

const QUICK_CHIPS: QuickChip[] = [
  { label: "Tonight 7pm", sublabel: "This evening", value: "tonight-7pm" },
  { label: "Tomorrow 9am", sublabel: "Morning", value: "tomorrow-9am" },
  { label: "Tomorrow 5pm", sublabel: "Evening", value: "tomorrow-5pm" },
  { label: "Sat morning", sublabel: "Weekend", value: "saturday-morning" },
  { label: "Mon 9am", sublabel: "Start of week", value: "next-monday-9am" },
  { label: "Custom…", sublabel: "Pick date & time", value: "custom" },
];

type Props = {
  buyerId: string;
  buyerName: string;
  onSaved: (reminderId: string, reminderAt: string) => void;
  onClose: () => void;
  isMobile?: boolean;
};

export function ReminderPickerModal({ buyerId, buyerName, onSaved, onClose, isMobile = false }: Props) {
  const [selectedChip, setSelectedChip] = useState<Exclude<ReminderChip, null> | null>(null);
  const [customDateTime, setCustomDateTime] = useState("");
  const [reminderType, setReminderType] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function getSelectedTime(): string | null {
    if (!selectedChip) return null;
    if (selectedChip === "custom") {
      return customDateTime ? new Date(customDateTime).toISOString() : null;
    }
    return getReminderDate(selectedChip as Exclude<ReminderChip, "custom" | null>).toISOString();
  }

  function handleSave() {
    const at = getSelectedTime();
    if (!at) {
      setError("Pick a time first.");
      return;
    }
    startTransition(async () => {
      const result = await setReminder(buyerId, at, reminderType, note.trim() || null);
      if (result.error) {
        setError(result.error);
        return;
      }
      onSaved(result.reminderId!, at);
      onClose();
    });
  }

  const content = (
    <div className="bg-white rounded-2xl overflow-hidden flex flex-col max-h-[85vh]">
      {/* Header */}
      <div className="px-5 pt-5 pb-1 shrink-0">
        <h3 className="text-[17px] font-semibold text-[#1B1B1D]">Set reminder</h3>
        <p className="text-[13px] text-[#44474C] mt-0.5">for {buyerName}</p>
      </div>

      <div className="overflow-y-auto px-5 py-4 flex flex-col gap-5">
        {/* When */}
        <div>
          <p className="text-[12px] font-semibold text-[#44474C] uppercase tracking-wide mb-2">When to follow up</p>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip.value}
                onClick={() => setSelectedChip(chip.value)}
                className={cn(
                  "flex flex-col items-start px-3 py-2.5 rounded-xl border transition-colors text-left",
                  selectedChip === chip.value
                    ? "border-[#2EC4B6] bg-[#F0FFFE]"
                    : "border-[#E4E2E3] hover:border-[#2EC4B6]"
                )}
              >
                <span className="text-[13px] font-medium text-[#1B1B1D]">{chip.label}</span>
                <span className="text-[11px] text-[#75777D] mt-0.5">{chip.sublabel}</span>
              </button>
            ))}
          </div>
          {selectedChip === "custom" && (
            <input
              type="datetime-local"
              value={customDateTime}
              onChange={(e) => setCustomDateTime(e.target.value)}
              className="mt-2 w-full rounded-xl border border-[#E4E2E3] px-3 py-2.5 text-[14px] text-[#1B1B1D] focus:outline-none focus:border-[#2EC4B6]"
            />
          )}
        </div>

        {/* Type */}
        <div>
          <p className="text-[12px] font-semibold text-[#44474C] uppercase tracking-wide mb-2">What kind of follow-up?</p>
          <div className="flex flex-wrap gap-2">
            {REMINDER_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setReminderType(reminderType === type ? null : type)}
                className={cn(
                  "px-3 py-1.5 rounded-full border text-[13px] font-medium transition-colors",
                  reminderType === type
                    ? "border-[#2EC4B6] bg-[#2EC4B6] text-white"
                    : "border-[#E4E2E3] text-[#1B1B1D] hover:border-[#2EC4B6]"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div>
          <p className="text-[12px] font-semibold text-[#44474C] uppercase tracking-wide mb-2">Note (optional)</p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Ask about their deposit status…"
            rows={3}
            className="w-full rounded-xl border border-[#E4E2E3] px-3 py-2.5 text-[14px] text-[#1B1B1D] placeholder:text-[#75777D] focus:outline-none focus:border-[#2EC4B6] resize-none bg-[#F5F3F4]"
          />
        </div>

        {error && <p className="text-[13px] text-red-600">{error}</p>}
      </div>

      {/* Actions */}
      <div className="px-5 pb-5 pt-2 shrink-0 flex items-center justify-between border-t border-[#F0EDEE]">
        <button onClick={onClose} className="text-[14px] text-[#3A86FF] font-medium">
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isPending || !selectedChip || (selectedChip === "custom" && !customDateTime)}
          className="px-5 py-2.5 rounded-full bg-[#2EC4B6] text-white text-[14px] font-semibold disabled:opacity-40 transition-opacity"
        >
          {isPending ? "Saving…" : "Set reminder"}
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose} />
        <div className="fixed bottom-0 left-0 right-0 z-50 p-3 pb-6">{content}</div>
      </>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        {content}
      </div>
    </div>
  );
}
