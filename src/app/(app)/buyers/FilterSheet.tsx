"use client";

import { useState, useEffect, useTransition } from "react";
import { cn } from "@/lib/utils";
import { SuburbCombobox } from "@/components/ui/suburb-combobox";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { formatAmount, parseAmount } from "@/lib/format";
import {
  type BuyerFilters,
  BEDROOMS_OPTIONS,
  LAND_SIZE_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  BUYING_TIMELINE_OPTIONS,
  LEAD_STATUS_OPTIONS,
  REMINDER_DUE_OPTIONS,
  LAST_CONTACTED_OPTIONS,
} from "@/lib/buyer-filters";
import { getFilteredCount } from "./actions";

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#44474C] mb-2">
      {children}
    </p>
  );
}

function ChipRow({
  options,
  selected,
  multi = false,
  onChange,
}: {
  options: string[];
  selected: string | string[];
  multi?: boolean;
  onChange: (v: string | string[]) => void;
}) {
  const isSelected = (opt: string) =>
    multi
      ? (selected as string[]).includes(opt)
      : selected === opt;

  const toggle = (opt: string) => {
    if (multi) {
      const arr = selected as string[];
      onChange(arr.includes(opt) ? arr.filter((x) => x !== opt) : [...arr, opt]);
    } else {
      onChange(selected === opt ? "" : opt);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={cn(
            "h-8 px-3 rounded-full border text-[13px] font-medium transition-colors",
            isSelected(opt)
              ? "bg-[#0F1C2C] border-[#0F1C2C] text-white"
              : "bg-white border-[#E0E1DD] text-[#44474C] hover:border-[#0F1C2C]/30"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function RadioChipRow<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "h-8 px-3 rounded-full border text-[13px] font-medium transition-colors",
            value === opt.value
              ? "bg-[#0F1C2C] border-[#0F1C2C] text-white"
              : "bg-white border-[#E0E1DD] text-[#44474C] hover:border-[#0F1C2C]/30"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

const inputCls =
  "h-10 w-full rounded-lg border border-[#E0E1DD] bg-white px-3 text-[14px] text-[#1B1B1D] placeholder:text-[#A0A3AB] focus:outline-none focus:border-2 focus:border-[#3A86FF] transition-colors";

// ─── Main ─────────────────────────────────────────────────────────────────────

export function FilterSheet({
  filters,
  onFiltersChange,
  onClear,
  isOpen,
  onClose,
}: {
  filters: BuyerFilters;
  onFiltersChange: (f: BuyerFilters) => void;
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [pending, setPending] = useState<BuyerFilters>(filters);
  const [count, setCount] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  // Sync pending when parent filters change (e.g. chip removal)
  useEffect(() => {
    setPending(filters);
  }, [filters]);

  // Live count on pending filter changes (debounced)
  useEffect(() => {
    const t = setTimeout(() => {
      startTransition(async () => {
        const res = await getFilteredCount(pending);
        if (!res.error) setCount(res.count);
      });
    }, 350);
    return () => clearTimeout(t);
  }, [pending]);

  function handleApply() {
    onFiltersChange(pending);
    onClose();
  }

  function handleClear() {
    setPending({});
    onClear();
    onClose();
  }

  const budgetMinStr = pending.budgetMin != null ? String(pending.budgetMin) : "";
  const budgetMaxStr = pending.budgetMax != null ? String(pending.budgetMax) : "";

  const content = (
    <div className="flex flex-col h-full">
      {/* Mobile drag handle */}
      <div className="lg:hidden flex justify-center pt-3 pb-1">
        <div className="w-10 h-1 rounded-full bg-[#E0E1DD]" />
      </div>

      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between px-5 py-3 border-b border-[#E0E1DD]">
        <h2 className="text-[16px] font-semibold text-[#0F1C2C]">Filters</h2>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-[#44474C]">
          <XIcon />
        </button>
      </div>

      {/* Desktop title */}
      <div className="hidden lg:block px-5 pt-5 pb-3 border-b border-[#E0E1DD]">
        <h2 className="text-[13px] font-semibold text-[#0F1C2C] uppercase tracking-wide">Filters</h2>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

        {/* Suburb */}
        <div>
          <SectionTitle>Suburb</SectionTitle>
          <SuburbCombobox
            value={pending.suburbs ?? []}
            onChange={(v) => setPending((f) => ({ ...f, suburbs: v }))}
            placeholder="Add suburb..."
          />
        </div>

        {/* Budget */}
        <div>
          <SectionTitle>Budget range</SectionTitle>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#44474C] text-[13px]">$</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Min"
                className={cn(inputCls, "pl-6")}
                value={budgetMinStr ? formatAmount(budgetMinStr) : ""}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, "");
                  setPending((f) => ({ ...f, budgetMin: raw ? parseInt(raw) : null }));
                }}
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#44474C] text-[13px]">$</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Max"
                className={cn(inputCls, "pl-6")}
                value={budgetMaxStr ? formatAmount(budgetMaxStr) : ""}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, "");
                  setPending((f) => ({ ...f, budgetMax: raw ? parseInt(raw) : null }));
                }}
              />
            </div>
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <SectionTitle>Bedrooms</SectionTitle>
          <SegmentedControl
            options={BEDROOMS_OPTIONS}
            value={pending.bedrooms ?? "Any"}
            onChange={(v) => setPending((f) => ({ ...f, bedrooms: v }))}
          />
        </div>

        {/* Land size */}
        <div>
          <SectionTitle>Land size minimum</SectionTitle>
          <div className="overflow-x-auto -mx-1 px-1">
            <div className="min-w-max">
              <SegmentedControl
                options={LAND_SIZE_OPTIONS}
                value={pending.landSizeMin ?? "Any"}
                onChange={(v) => setPending((f) => ({ ...f, landSizeMin: v }))}
              />
            </div>
          </div>
        </div>

        {/* Property type */}
        <div>
          <SectionTitle>Property type</SectionTitle>
          <ChipRow
            options={PROPERTY_TYPE_OPTIONS}
            selected={pending.propertyTypes ?? []}
            multi
            onChange={(v) => setPending((f) => ({ ...f, propertyTypes: v as string[] }))}
          />
        </div>

        {/* Temperature */}
        <div>
          <SectionTitle>Buyer temperature</SectionTitle>
          <ChipRow
            options={["Hot", "Warm", "Cold"]}
            selected={(pending.temperatures ?? []).map((t) =>
              t.charAt(0).toUpperCase() + t.slice(1)
            )}
            multi
            onChange={(v) =>
              setPending((f) => ({
                ...f,
                temperatures: (v as string[]).map((t) => t.toLowerCase()),
              }))
            }
          />
        </div>

        {/* Buying timeline */}
        <div>
          <SectionTitle>Buying timeline</SectionTitle>
          <ChipRow
            options={BUYING_TIMELINE_OPTIONS}
            selected={pending.buyingTimeline ?? ""}
            onChange={(v) => setPending((f) => ({ ...f, buyingTimeline: v as string }))}
          />
        </div>

        {/* Lead status */}
        <div>
          <SectionTitle>Lead status</SectionTitle>
          <ChipRow
            options={LEAD_STATUS_OPTIONS}
            selected={pending.leadStatus ?? ""}
            onChange={(v) => setPending((f) => ({ ...f, leadStatus: v as string }))}
          />
        </div>

        {/* Reminder due */}
        <div>
          <SectionTitle>Reminder due</SectionTitle>
          <RadioChipRow
            options={REMINDER_DUE_OPTIONS}
            value={pending.reminderDue ?? "any"}
            onChange={(v) => setPending((f) => ({ ...f, reminderDue: v }))}
          />
        </div>

        {/* Last contacted */}
        <div>
          <SectionTitle>Last contacted</SectionTitle>
          <RadioChipRow
            options={LAST_CONTACTED_OPTIONS}
            value={pending.lastContacted ?? "any"}
            onChange={(v) => setPending((f) => ({ ...f, lastContacted: v }))}
          />
        </div>

        <div className="h-4" />
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 bg-white border-t border-[#E0E1DD] p-4 flex gap-3">
        <button
          onClick={handleClear}
          className="flex-1 h-11 text-[#3A86FF] font-medium text-[14px] rounded-lg hover:bg-blue-50 transition-colors"
        >
          Clear filters
        </button>
        <button
          onClick={handleApply}
          className="flex-1 h-11 bg-[#2EC4B6] text-white rounded-lg font-semibold text-[14px] hover:bg-[#27b0a4] transition-colors"
        >
          Apply{count !== null ? ` (${count})` : ""}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: persistent right panel */}
      <aside className="hidden lg:flex flex-col w-[280px] shrink-0 border-l border-[#E0E1DD] bg-white sticky top-0 h-screen overflow-hidden">
        {content}
      </aside>

      {/* Mobile: bottom sheet */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-50 flex flex-col justify-end transition-all duration-300",
          isOpen ? "visible" : "invisible pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-black/40 transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={onClose}
        />
        {/* Sheet */}
        <div
          className={cn(
            "relative bg-white rounded-t-2xl max-h-[88vh] flex flex-col transition-transform duration-300",
            isOpen ? "translate-y-0" : "translate-y-full"
          )}
        >
          {content}
        </div>
      </div>
    </>
  );
}
