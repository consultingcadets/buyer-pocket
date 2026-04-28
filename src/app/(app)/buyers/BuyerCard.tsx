"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatBudgetLabel } from "@/lib/buyer-filters";
import type { Buyer } from "@/types/database";

// ─── Icons ───────────────────────────────────────────────────────────────────

function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function PhoneIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.87h3a2 2 0 0 1 2 1.72c.127.96.36 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.4a16 16 0 0 0 6.29 6.29l.95-.91a2 2 0 0 1 2.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function DotsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
    </svg>
  );
}
function BedIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4v16" /><path d="M2 8h18a2 2 0 0 1 2 2v10" /><path d="M2 17h20" /><path d="M6 8v9" />
    </svg>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatSuburbs(suburbs: string[] | null): string {
  if (!suburbs?.length) return "No suburbs specified";
  const clean = suburbs.map((s) => s.split(",")[0].trim());
  if (clean.length <= 3) return clean.join(", ");
  return `${clean.slice(0, 3).join(", ")} +${clean.length - 3} more`;
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TemperatureChip({ temp }: { temp: string | null }) {
  if (!temp) return null;
  const styles = {
    hot: "bg-amber-400 text-white",
    warm: "bg-[#2EC4B6] text-white",
    cold: "bg-gray-400 text-white",
  };
  return (
    <span
      className={cn(
        "shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase",
        styles[temp as keyof typeof styles] ?? "bg-gray-200 text-gray-700"
      )}
    >
      {temp}
    </span>
  );
}

function DataBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 min-w-0 bg-[#F0EDEE] rounded-md px-2.5 py-1.5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#44474C] leading-none">
        {label}
      </p>
      <p className="text-[13px] font-semibold text-[#1B1B1D] mt-1 truncate">{value}</p>
    </div>
  );
}

function ThreeDotMenu({
  buyer,
  onArchive,
  className,
}: {
  buyer: Buyer;
  onArchive: (id: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  const actions = [
    {
      label: "Call",
      href: buyer.phone ? `tel:${buyer.phone}` : null,
    },
    {
      label: "SMS",
      href: buyer.phone ? `sms:${buyer.phone}` : null,
    },
    {
      label: "Email",
      href: buyer.email ? `mailto:${buyer.email}` : null,
    },
    { label: "Edit", href: `/buyers/${buyer.id}/edit` },
    { label: "Archive", href: null, danger: true },
  ];

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F0EDEE] text-[#44474C]"
        aria-label="More actions"
      >
        <DotsIcon />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-9 z-50 w-40 bg-white rounded-lg border border-[#E0E1DD] shadow-lg py-1 overflow-hidden">
            {actions.map((a) =>
              a.href ? (
                <Link
                  key={a.label}
                  href={a.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block px-4 py-2.5 text-[13px] hover:bg-[#F0EDEE]",
                    a.danger ? "text-[#BA1A1A]" : "text-[#1B1B1D]"
                  )}
                >
                  {a.label}
                </Link>
              ) : (
                <button
                  key={a.label}
                  onClick={() => {
                    setOpen(false);
                    if (a.label === "Archive") onArchive(buyer.id);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2.5 text-[13px] hover:bg-[#F0EDEE]",
                    a.danger ? "text-[#BA1A1A]" : "text-[#1B1B1D]"
                  )}
                >
                  {a.label}
                </button>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function BuyerCard({
  buyer,
  onArchive,
}: {
  buyer: Buyer;
  onArchive: (id: string) => void;
}) {
  const budgetLabel =
    buyer.budget_min || buyer.budget_max
      ? formatBudgetLabel(buyer.budget_min, buyer.budget_max)
      : null;

  // ── Desktop row ──────────────────────────────────────────────────────────
  const desktopRow = (
    <div className="hidden lg:flex items-center px-6 py-3.5 border-b border-[#E0E1DD] hover:bg-[#F5F3F4] group cursor-default">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[15px] text-[#0F1C2C] truncate">
            {buyer.name}
          </span>
          <TemperatureChip temp={buyer.buyer_temperature} />
        </div>
        {(buyer.preferred_suburbs?.length ?? 0) > 0 && (
          <div className="flex items-center gap-1 mt-0.5 text-[#44474C]">
            <PinIcon />
            <span className="text-[13px]">
              {formatSuburbs(buyer.preferred_suburbs)}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 text-[13px] text-[#44474C] shrink-0 ml-4">
        {budgetLabel && <span className="font-medium">{budgetLabel}</span>}
        {buyer.bedrooms && buyer.bedrooms !== "Any" && (
          <>
            <span className="text-[#C5C6CD] mx-1">·</span>
            <span className="flex items-center gap-1">
              <BedIcon />
              {buyer.bedrooms.replace("+", "")} bed
            </span>
          </>
        )}
        {buyer.land_size_min && (
          <>
            <span className="text-[#C5C6CD] mx-1">·</span>
            <span>{buyer.land_size_min}m²</span>
          </>
        )}
        {buyer.property_type && (
          <>
            <span className="text-[#C5C6CD] mx-1">·</span>
            <span>{buyer.property_type}</span>
          </>
        )}
        {buyer.next_reminder_at && (
          <span className="ml-2 px-2 py-0.5 bg-blue-50 text-[#3A86FF] rounded-full text-[11px] font-medium">
            {formatRelativeTime(buyer.next_reminder_at)}
          </span>
        )}
      </div>

      <ThreeDotMenu
        buyer={buyer}
        onArchive={onArchive}
        className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>
  );

  // ── Mobile card ───────────────────────────────────────────────────────────
  const mobileCard = (
    <article
      className="lg:hidden relative mx-4 mb-3 bg-white rounded-lg overflow-hidden"
      style={{ boxShadow: "0px 4px 20px rgba(13,27,42,0.05)" }}
    >
      {/* Reminder dot */}
      {buyer.next_reminder_at && (
        <span className="absolute top-3.5 right-12 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h2 className="text-[20px] font-semibold text-[#0F1C2C] leading-tight flex-1">
            {buyer.name}
          </h2>
          <div className="flex items-center gap-1 shrink-0 mt-0.5">
            <TemperatureChip temp={buyer.buyer_temperature} />
            <ThreeDotMenu buyer={buyer} onArchive={onArchive} />
          </div>
        </div>

        {(buyer.preferred_suburbs?.length ?? 0) > 0 && (
          <p className="text-[13px] text-[#44474C] mb-3">
            Looking in {formatSuburbs(buyer.preferred_suburbs)}
          </p>
        )}

        {(budgetLabel || buyer.bedrooms || buyer.property_type) && (
          <div className="flex gap-2">
            {budgetLabel && <DataBox label="Budget" value={budgetLabel} />}
            {buyer.bedrooms && buyer.bedrooms !== "Any" && (
              <DataBox label="Beds" value={buyer.bedrooms} />
            )}
            {buyer.property_type && (
              <DataBox label="Type" value={buyer.property_type} />
            )}
          </div>
        )}
      </div>

      <div className="border-t border-[#E0E1DD] px-4 py-2.5 flex items-center justify-between">
        <span className="text-[13px] text-[#44474C] flex items-center gap-1.5">
          <ClockIcon />
          {buyer.last_contacted_at
            ? `Last contact: ${formatRelativeTime(buyer.last_contacted_at)}`
            : "Not yet contacted"}
        </span>
        <a
          href={buyer.phone ? `tel:${buyer.phone}` : undefined}
          className="text-[13px] font-medium text-[#3A86FF] flex items-center gap-1"
        >
          <PhoneIcon />
          Log Call
        </a>
      </div>
    </article>
  );

  return (
    <>
      {desktopRow}
      {mobileCard}
    </>
  );
}
