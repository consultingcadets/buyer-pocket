"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import { cn } from "@/lib/utils";
import { SuburbCombobox } from "@/components/ui/suburb-combobox";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { formatAmount } from "@/lib/format";
import {
  type BuyerFilters,
  BEDROOMS_OPTIONS,
  LAND_SIZE_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  BUYING_TIMELINE_OPTIONS,
  LEAD_STATUS_OPTIONS,
  REMINDER_DUE_OPTIONS,
  LAST_CONTACTED_OPTIONS,
  DATE_ADDED_OPTIONS,
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
    <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-text-secondary mb-2.5">
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
    multi ? (selected as string[]).includes(opt) : selected === opt;

  const toggle = (opt: string) => {
    if (multi) {
      const arr = selected as string[];
      onChange(arr.includes(opt) ? arr.filter((x) => x !== opt) : [...arr, opt]);
    } else {
      onChange(selected === opt ? "" : opt);
    }
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={cn(
            "h-8 px-3 rounded-full border text-[13px] font-medium transition-colors",
            isSelected(opt)
              ? "bg-primary border-primary text-white"
              : "bg-surface-container-low border-border text-text-secondary hover:border-primary/30 hover:text-text-primary"
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
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "h-8 px-3 rounded-full border text-[13px] font-medium transition-colors",
            value === opt.value
              ? "bg-primary border-primary text-white"
              : "bg-surface-container-low border-border text-text-secondary hover:border-primary/30 hover:text-text-primary"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

const inputCls =
  "h-10 w-full rounded-lg border border-border bg-surface-container-low px-3 text-[14px] text-text-primary placeholder:text-outline focus:outline-none focus:border-2 focus:border-teal-action transition-colors";

export function FilterSheet({
  filters,
  onFiltersChange,
  onClear,
  isOpen,
  onClose,
  desktopOpen = true,
  agentState,
}: {
  filters: BuyerFilters;
  onFiltersChange: (f: BuyerFilters) => void;
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
  desktopOpen?: boolean;
  agentState?: string | null;
}) {
  const [pending, setPending] = useState<BuyerFilters>(filters);
  const [count, setCount] = useState<number | null>(null);
  const [, startTransition] = useTransition();
  const syncFromParent = useRef(false);

  useEffect(() => {
    syncFromParent.current = true;
    startTransition(() => setPending(filters));
    // Always reset flag — if setPending is a no-op (same value), the auto-apply
    // effect won't fire to reset it, leaving the flag stuck true and silently
    // eating the next user interaction.
    const reset = setTimeout(() => { syncFromParent.current = false; }, 0);
    return () => clearTimeout(reset);
  }, [filters]);

  useEffect(() => {
    const t = setTimeout(() => {
      startTransition(async () => {
        const res = await getFilteredCount(pending);
        if (!res.error) setCount(res.count);
      });
    }, 350);
    return () => clearTimeout(t);
  }, [pending]);

  // Desktop sidebar: auto-apply on change (no "Show" click needed)
  useEffect(() => {
    if (!desktopOpen || syncFromParent.current) {
      syncFromParent.current = false;
      return;
    }
    const t = setTimeout(() => { onFiltersChange(pending); }, 500);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending]);

  function handleApply() { onFiltersChange(pending); onClose(); }
  function handleClear() { setPending({}); onClear(); onClose(); }

  const budgetMinStr = pending.budgetMin != null ? String(pending.budgetMin) : "";
  const budgetMaxStr = pending.budgetMax != null ? String(pending.budgetMax) : "";

  const content = (
    <div className="flex flex-col h-full">
      {/* Mobile drag handle */}
      <div className="lg:hidden flex justify-center pt-3 pb-1">
        <div className="w-10 h-1 rounded-full bg-border" />
      </div>

      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between px-5 py-3 border-b border-border">
        <h2 className="text-[16px] font-semibold text-text-primary">Filters</h2>
        <button onClick={onClose} className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-surface-container text-text-secondary">
          <XIcon />
        </button>
      </div>

      {/* Desktop title */}
      <div className="hidden lg:flex items-center px-5 pt-5 pb-3 border-b border-border">
        <h2 className="text-[13px] font-bold text-primary uppercase tracking-[0.1em] flex-1">Filters</h2>
        <button
          onClick={handleClear}
          className="text-[12px] font-semibold text-teal-action hover:opacity-70 transition-opacity"
        >
          Clear all
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

        <div>
          <SectionTitle>Suburb</SectionTitle>
          <SuburbCombobox
            value={pending.suburbs ?? []}
            onChange={(v) => setPending((f) => ({ ...f, suburbs: v }))}
            placeholder="Add suburb..."
            preferredState={agentState}
          />
        </div>

        <div>
          <SectionTitle>Budget range</SectionTitle>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[13px]">$</span>
              <input
                type="text" inputMode="numeric" placeholder="Min"
                className={cn(inputCls, "pl-6")}
                value={budgetMinStr ? formatAmount(budgetMinStr) : ""}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, "");
                  setPending((f) => ({ ...f, budgetMin: raw ? parseInt(raw) : null }));
                }}
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[13px]">$</span>
              <input
                type="text" inputMode="numeric" placeholder="Max"
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

        <div>
          <SectionTitle>Bedrooms</SectionTitle>
          <SegmentedControl
            options={BEDROOMS_OPTIONS}
            value={pending.bedrooms ?? "Any"}
            onChange={(v) => setPending((f) => ({ ...f, bedrooms: v }))}
          />
        </div>

        {/* Land size — chips so they wrap, no overflow */}
        <div>
          <SectionTitle>Land size minimum</SectionTitle>
          <ChipRow
            options={LAND_SIZE_OPTIONS}
            selected={pending.landSizeMin ?? "Any"}
            onChange={(v) => setPending((f) => ({ ...f, landSizeMin: v as string }))}
          />
        </div>

        <div>
          <SectionTitle>Property type</SectionTitle>
          <ChipRow
            options={PROPERTY_TYPE_OPTIONS}
            selected={pending.propertyTypes ?? []}
            multi
            onChange={(v) => setPending((f) => ({ ...f, propertyTypes: v as string[] }))}
          />
        </div>

        <div>
          <SectionTitle>Buyer temperature</SectionTitle>
          <ChipRow
            options={["Hot", "Warm", "Cold"]}
            selected={(pending.temperatures ?? []).map((t) => t.charAt(0).toUpperCase() + t.slice(1))}
            multi
            onChange={(v) => setPending((f) => ({ ...f, temperatures: (v as string[]).map((t) => t.toLowerCase()) }))}
          />
        </div>

        <div>
          <SectionTitle>Buying timeline</SectionTitle>
          <ChipRow
            options={BUYING_TIMELINE_OPTIONS}
            selected={pending.buyingTimeline ?? ""}
            onChange={(v) => setPending((f) => ({ ...f, buyingTimeline: v as string }))}
          />
        </div>

        <div>
          <SectionTitle>Lead status</SectionTitle>
          <ChipRow
            options={LEAD_STATUS_OPTIONS}
            selected={pending.leadStatus ?? ""}
            onChange={(v) => setPending((f) => ({ ...f, leadStatus: v as string }))}
          />
        </div>

        <div>
          <SectionTitle>Reminder due</SectionTitle>
          <RadioChipRow
            options={REMINDER_DUE_OPTIONS}
            value={pending.reminderDue ?? "any"}
            onChange={(v) => setPending((f) => ({ ...f, reminderDue: v }))}
          />
        </div>

        <div>
          <SectionTitle>Last contacted</SectionTitle>
          <RadioChipRow
            options={LAST_CONTACTED_OPTIONS}
            value={pending.lastContacted ?? "any"}
            onChange={(v) => setPending((f) => ({ ...f, lastContacted: v }))}
          />
        </div>

        <div>
          <SectionTitle>Date added</SectionTitle>
          <RadioChipRow
            options={DATE_ADDED_OPTIONS}
            value={pending.dateAdded ?? "any"}
            onChange={(v) => setPending((f) => ({ ...f, dateAdded: v }))}
          />
        </div>

        <div className="h-2" />
      </div>

      {/* Footer — mobile only (desktop auto-applies) */}
      <div className="lg:hidden border-t border-border bg-white p-4 flex gap-3">
        <button
          onClick={handleClear}
          className="flex-1 h-12 text-teal-action font-semibold text-[14px] rounded-xl border border-teal-action/30 hover:bg-teal-action/5 transition-colors"
        >
          Clear
        </button>
        <button
          onClick={handleApply}
          className="flex-1 h-12 bg-teal-action text-on-teal-action rounded-xl font-bold text-[14px] hover:opacity-90 transition-opacity"
        >
          Show{count !== null ? ` ${count}` : ""}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: toggleable right panel */}
      {desktopOpen && (
        <aside className="hidden lg:flex flex-col w-[260px] shrink-0 border-l border-border bg-surface-container-low/40 sticky top-0 h-screen">
          {content}
        </aside>
      )}

      {/* Mobile: bottom sheet */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-50 flex flex-col justify-end transition-all duration-300",
          isOpen ? "visible" : "invisible pointer-events-none"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-primary/40 transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={onClose}
        />
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
