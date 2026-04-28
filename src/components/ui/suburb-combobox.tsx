"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { searchSuburbs } from "@/data/au-suburbs";

interface SuburbComboboxProps {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  error?: string;
}

export function SuburbCombobox({
  value,
  onChange,
  placeholder = "Search suburbs…",
  error,
}: SuburbComboboxProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = query.length >= 1 ? searchSuburbs(query, 20) : [];

  // Close dropdown on outside click
  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  const addSuburb = useCallback(
    (label: string) => {
      if (!value.includes(label)) {
        onChange([...value, label]);
      }
      setQuery("");
      setOpen(false);
      inputRef.current?.focus();
    },
    [value, onChange]
  );

  const removeSuburb = useCallback(
    (label: string) => {
      onChange(value.filter((s) => s !== label));
    },
    [value, onChange]
  );

  const showAddFreeText =
    query.length >= 2 &&
    results.length === 0;

  const showDropdown = open && (results.length > 0 || showAddFreeText);

  return (
    <div ref={containerRef} className="relative">
      <div
        className={cn(
          "min-h-[48px] w-full px-3 py-2 rounded-lg border bg-white flex flex-wrap gap-1.5 items-center cursor-text",
          error ? "border-error" : "border-border",
          open && !error && "border-2 border-accent"
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((suburb) => (
          <span
            key={suburb}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary text-white text-sm font-medium"
          >
            {suburb}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeSuburb(suburb);
              }}
              className="ml-0.5 text-white/80 hover:text-white leading-none"
              aria-label={`Remove ${suburb}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            if (query.length >= 1) setOpen(true);
          }}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm text-text-primary placeholder:text-[#A0A3AB]"
        />
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white rounded-lg shadow-card border border-border max-h-60 overflow-y-auto">
          {results.map((s) => {
            const label = `${s.suburb}, ${s.state}`;
            return (
              <button
                key={`${s.suburb}-${s.state}-${s.postcode}`}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  addSuburb(label);
                }}
                className="w-full text-left px-4 h-11 flex items-center text-sm text-text-primary hover:bg-surface-container transition-colors"
              >
                <span className="font-medium">{s.suburb}</span>
                <span className="text-text-secondary ml-1">
                  , {s.state} {s.postcode}
                </span>
              </button>
            );
          })}
          {showAddFreeText && (
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                addSuburb(query.trim());
              }}
              className="w-full text-left px-4 h-11 flex items-center text-sm text-accent font-medium hover:bg-surface-container transition-colors"
            >
              Add &quot;{query.trim()}&quot;
            </button>
          )}
        </div>
      )}

      {error && (
        <p className="mt-1 text-xs text-error">{error}</p>
      )}
    </div>
  );
}
