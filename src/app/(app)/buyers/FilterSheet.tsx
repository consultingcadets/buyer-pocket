"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import { cn } from "@/lib/utils";
import { SuburbCombobox } from "@/components/ui/suburb-combobox";
import { SegmentedControl } from "@/components/ui/segmented-control";
import {
  type BuyerFilters,
  BEDROOMS_OPTIONS,
  LAND_SIZE_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  BUYING_TIMELINE_OPTIONS,
  LEAD_STATUS_OPTIONS,
  LAST_CONTACTED_OPTIONS,
  DATE_ADDED_OPTIONS,
} from "@/lib/buyer-filters";

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

const BUDGET_OPTIONS = [
  50000, 75000, 100000, 125000, 150000, 175000, 200000, 225000, 250000, 275000,
  300000, 325000, 350000, 375000, 400000, 425000, 450000, 475000, 500000,
  550000, 600000, 650000, 700000, 750000, 800000, 850000, 900000, 950000,
  1000000, 1100000, 1200000, 1300000, 1400000, 1500000, 1600000, 1700000,
  1800000, 1900000, 2000000,
];

function BudgetSelect({
  value,
  placeholder,
  onChange,
}: {
  value: number | null;
  placeholder: string;
  onChange: (v: number | null) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value != null ? String(value) : ""}
        onChange={(e) => onChange(e.target.value ? parseInt(e.target.value) : null)}
        className={cn(inputCls, "appearance-none cursor-pointer pr-8", !value && "text-outline")}
      >
        <option value="">{placeholder}</option>
        {BUDGET_OPTIONS.map((n) => (
          <option key={n} value={String(n)}>${n.toLocaleString("en-AU")}</option>
        ))}
      </select>
      <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
    </div>
  );
}

export function FilterSheet({
  filters,
  onFiltersChange,
  onClear,
  isOpen,
  onClose,
  agentState,
}: {
  filters: BuyerFilters;
  onFiltersChange: (f: BuyerFilters) => void;
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
  agentState?: string | null;
}) {
  const [pending, setPending] = useState<BuyerFilters>(filters);
  const [, startTransition] = useTransition();
  const syncFromParent = useRef(false);

  useEffect(() => {
    syncFromParent.current = true;
    startTransition(() => setPending(filters));
    const reset = setTimeout(() => { syncFromParent.current = false; }, 0);
    return () => clearTimeout(reset);
  }, [filters]);

  // Auto-apply on every change with debounce
  useEffect(() => {
    if (syncFromParent.current) {
      syncFromParent.current = false;
      return;
    }
    const t = setTimeout(() => { onFiltersChange(pending); }, 400);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending]);

  function handleClear() { setPending({}); onClear(); onClose(); }

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 transition-all duration-300",
        isOpen ? "visible" : "invisible pointer-events-none"
      )}
    >
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-primary/40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white flex flex-col shadow-2xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h2 className="text-[16px] font-semibold text-text-primary">Filters</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleClear}
              className="text-[13px] font-semibold text-teal-action hover:opacity-70 transition-opacity"
            >
              Clear all
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container text-text-secondary transition-colors"
            >
              <XIcon />
            </button>
          </div>
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
              <BudgetSelect
                value={pending.budgetMin ?? null}
                placeholder="Min"
                onChange={(v) => setPending((f) => ({ ...f, budgetMin: v }))}
              />
              <BudgetSelect
                value={pending.budgetMax ?? null}
                placeholder="Max"
                onChange={(v) => setPending((f) => ({ ...f, budgetMax: v }))}
              />
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
      </div>
    </div>
  );
}
