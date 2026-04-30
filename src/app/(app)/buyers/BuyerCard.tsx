"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Phone, MapPin, Bed, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBudgetLabel } from "@/lib/buyer-filters";
import type { Buyer } from "@/types/database";

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
  const styles: Record<string, string> = {
    hot: "bg-secondary text-white",
    warm: "bg-accent text-white",
    cold: "bg-white text-primary border border-primary",
  };
  return (
    <span
      className={cn(
        "shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase",
        styles[temp] ?? "bg-surface-container text-text-secondary"
      )}
    >
      {temp}
    </span>
  );
}

function DataBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 min-w-0 bg-surface-container rounded-md px-2.5 py-1.5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary leading-none">
        {label}
      </p>
      <p className="text-[13px] font-semibold text-text-primary mt-1 truncate">{value}</p>
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
    { label: "Call", href: buyer.phone ? `tel:${buyer.phone}` : null },
    { label: "SMS", href: buyer.phone ? `sms:${buyer.phone}` : null },
    { label: "Email", href: buyer.email ? `mailto:${buyer.email}` : null },
    { label: "Edit", href: `/buyers/${buyer.id}/edit` },
    { label: "Archive", href: null, danger: true },
  ];

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container text-text-secondary"
        aria-label="More actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-9 z-50 w-40 bg-white rounded-lg border border-border shadow-dropdown py-1 overflow-hidden">
            {actions.map((a) =>
              a.href ? (
                <Link
                  key={a.label}
                  href={a.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block px-4 py-2.5 text-[13px] hover:bg-surface-container",
                    a.danger ? "text-error" : "text-text-primary"
                  )}
                >
                  {a.label}
                </Link>
              ) : (
                <button
                  key={a.label}
                  onClick={() => { setOpen(false); if (a.label === "Archive") onArchive(buyer.id); }}
                  className={cn(
                    "w-full text-left px-4 py-2.5 text-[13px] hover:bg-surface-container",
                    a.danger ? "text-error" : "text-text-primary"
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
    <div className="hidden lg:flex items-center px-6 py-3.5 border-b border-border hover:bg-surface-container-low group cursor-default">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[15px] text-primary truncate">
            {buyer.name}
          </span>
        </div>
        {(buyer.preferred_suburbs?.length ?? 0) > 0 && (
          <div className="flex items-center gap-1 mt-0.5 text-text-secondary">
            <MapPin className="w-3 h-3" />
            <span className="text-[13px]">
              {formatSuburbs(buyer.preferred_suburbs)}
            </span>
          </div>
        )}
      </div>

      {/* Temperature column */}
      <div className="w-16 shrink-0 flex justify-center ml-4">
        {buyer.buyer_temperature ? (
          <TemperatureChip temp={buyer.buyer_temperature} />
        ) : (
          <span className="text-[12px] text-outline">—</span>
        )}
      </div>

      <div className="flex items-center gap-1 text-[13px] text-text-secondary shrink-0 ml-4">
        {budgetLabel && <span className="font-medium">{budgetLabel}</span>}
        {buyer.bedrooms && buyer.bedrooms !== "Any" && (
          <>
            <span className="text-outline-variant mx-1">·</span>
            <span className="flex items-center gap-1">
              <Bed className="w-3 h-3" />
              {buyer.bedrooms.replace("+", "")} bed
            </span>
          </>
        )}
        {buyer.land_size_min && (
          <>
            <span className="text-outline-variant mx-1">·</span>
            <span>{buyer.land_size_min}m²</span>
          </>
        )}
        {buyer.next_reminder_at && (
          <span className="ml-2 px-2 py-0.5 bg-accent/10 text-accent rounded-full text-[11px] font-medium">
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
      className="lg:hidden relative mx-4 mb-3 bg-white rounded-lg overflow-hidden shadow-card"
    >
      {/* Reminder dot */}
      {buyer.next_reminder_at && (
        <span className="absolute top-3.5 right-12 w-2.5 h-2.5 bg-secondary rounded-full" />
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h2 className="text-[20px] font-semibold text-primary leading-tight flex-1">
            {buyer.name}
          </h2>
          <div className="flex items-center gap-1 shrink-0 mt-0.5">
            <TemperatureChip temp={buyer.buyer_temperature} />
            <ThreeDotMenu buyer={buyer} onArchive={onArchive} />
          </div>
        </div>

        {(buyer.preferred_suburbs?.length ?? 0) > 0 && (
          <p className="text-[13px] text-text-secondary mb-3">
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

      <div className="border-t border-border px-4 py-2.5 flex items-center justify-between">
        <span className="text-[13px] text-text-secondary flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          {buyer.last_contacted_at
            ? `Last contact: ${formatRelativeTime(buyer.last_contacted_at)}`
            : "Not yet contacted"}
        </span>
        <a
          href={buyer.phone ? `tel:${buyer.phone}` : undefined}
          className="text-[13px] font-medium text-accent flex items-center gap-1"
        >
          <Phone className="w-3 h-3" />
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
