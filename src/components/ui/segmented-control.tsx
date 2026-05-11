"use client";

import { cn } from "@/lib/utils";

interface SegmentedControlProps {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
}

export function SegmentedControl({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps) {
  return (
    <div
      className={cn(
        "flex min-h-12 rounded-xl border border-border overflow-hidden bg-surface-container-low p-1",
        className
      )}
    >
      {options.map((option) => {
        const isActive = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "flex-1 flex min-h-10 items-center justify-center rounded-lg text-sm font-semibold transition-colors duration-150",
              isActive
                ? "bg-primary text-white shadow-sm"
                : "text-text-secondary hover:bg-white hover:text-text-primary"
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
