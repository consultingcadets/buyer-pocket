"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Phone, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBudgetLabel } from "@/lib/buyer-filters";
import { getLeadStaleness } from "@/lib/format";
import type { Buyer } from "@/types/database";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatSuburbs(suburbs: string[] | null): string {
  if (!suburbs?.length) return "No suburbs specified";
  const clean = suburbs.map((s) => s.split(",")[0].trim());
  if (clean.length <= 3) return clean.join(", ");
  return `${clean.slice(0, 3).join(", ")} +${clean.length - 3} more`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TemperatureChip({ temp }: { temp: string | null }) {
  if (!temp) return null;
  const styles: Record<string, { bg: string; text: string; dot: string }> = {
    hot:  { bg: "bg-red-50",    text: "text-red-600",    dot: "bg-red-500" },
    warm: { bg: "bg-amber-50",  text: "text-amber-600",  dot: "bg-amber-500" },
    cold: { bg: "bg-blue-50",   text: "text-blue-600",   dot: "bg-blue-500" },
  };
  const s = styles[temp] ?? { bg: "bg-surface-container", text: "text-text-secondary", dot: "bg-text-secondary" };
  return (
    <span className={cn("shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase", s.bg, s.text)}>
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", s.dot)} />
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
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container text-text-secondary"
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

// ─── Desktop Table Row ────────────────────────────────────────────────────────

export function BuyerTableRow({
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

  return (
    <tr className="border-b border-border hover:bg-surface-container-low/60 group transition-colors">
      {/* Name */}
      <td className="px-4 py-3 max-w-[200px]">
        <Link href={`/buyers/${buyer.id}`} className="block">
          <span className="flex items-center gap-1.5">
            {(() => {
              const { colour } = getLeadStaleness(buyer.last_contacted_at, buyer.created_at);
              return <span className={cn("w-2 h-2 rounded-full shrink-0",
                colour === "green" && "bg-emerald-500",
                colour === "amber" && "bg-amber-500",
                colour === "red"   && "bg-red-500",
                colour === "grey"  && "bg-outline",
              )} />;
            })()}
            <span className="font-semibold text-[14px] text-primary truncate hover:underline">
              {buyer.name}
            </span>
          </span>
          {buyer.phone && (
            <span className="text-[12px] text-text-secondary truncate block pl-3.5">{buyer.phone}</span>
          )}
        </Link>
      </td>

      {/* Suburb */}
      <td className="px-4 py-3 max-w-[160px]">
        <span className="text-[13px] text-text-primary truncate block">
          {(buyer.preferred_suburbs?.length ?? 0) > 0
            ? formatSuburbs(buyer.preferred_suburbs)
            : <span className="text-outline">—</span>}
        </span>
      </td>

      {/* Budget */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="text-[13px] text-text-primary">
          {budgetLabel ?? <span className="text-outline">—</span>}
        </span>
      </td>

      {/* Land size */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="text-[13px] text-text-primary">
          {buyer.land_size_min
            ? `${buyer.land_size_min.toLocaleString()}m²`
            : <span className="text-outline">—</span>}
        </span>
      </td>

      {/* Buying time */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="text-[13px] text-text-primary">
          {buyer.buying_timeline ?? <span className="text-outline">—</span>}
        </span>
      </td>

      {/* Temperature */}
      <td className="px-4 py-3">
        <TemperatureChip temp={buyer.buyer_temperature} />
      </td>

      {/* Actions */}
      <td className="px-2 py-3 w-10">
        <ThreeDotMenu
          buyer={buyer}
          onArchive={onArchive}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </td>
    </tr>
  );
}

// ─── Mobile Card ─────────────────────────────────────────────────────────────

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

  return (
    <article className="relative mx-4 mb-3 bg-white rounded-lg overflow-hidden shadow-card">
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
        {(() => {
          const { label, colour } = getLeadStaleness(buyer.last_contacted_at, buyer.created_at);
          return (
            <span className={cn(
              "text-[12px] font-medium flex items-center gap-1.5",
              colour === "green" && "text-emerald-700",
              colour === "amber" && "text-amber-600",
              colour === "red" && "text-red-600",
              colour === "grey" && "text-text-secondary",
            )}>
              <span className={cn(
                "w-2 h-2 rounded-full shrink-0",
                colour === "green" && "bg-emerald-500",
                colour === "amber" && "bg-amber-500",
                colour === "red" && "bg-red-500",
                colour === "grey" && "bg-outline",
              )} />
              <Clock className="w-3 h-3 opacity-60" />
              {buyer.last_contacted_at ? `Last contact: ${label}` : label}
            </span>
          );
        })()}
        <a
          href={buyer.phone ? `tel:${buyer.phone}` : undefined}
          className="text-[13px] font-medium text-teal-action flex items-center gap-1"
        >
          <Phone className="w-3 h-3" />
          Call
        </a>
      </div>
    </article>
  );
}
