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
        "flex h-12 rounded-lg border border-border overflow-hidden",
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
              "flex-1 flex items-center justify-center text-sm font-medium transition-colors duration-150 border-r border-border last:border-r-0",
              isActive
                ? "bg-primary text-white font-semibold"
                : "bg-white text-text-secondary hover:bg-surface-container"
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
