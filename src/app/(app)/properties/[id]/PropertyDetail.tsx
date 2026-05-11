"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, BedDouble, Bath, Ruler, ExternalLink, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { updatePropertyStatus } from "../actions";
import type { Property, MatchedBuyer } from "@/types/property";
import { getLeadStaleness } from "@/lib/format";

function formatPrice(price: number): string {
  if (price >= 1_000_000) {
    return `$${(price / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  return `$${Math.round(price / 1000)}k`;
}

type Status = Property["status"];

const STATUS_LABELS: Record<Status, string> = {
  active: "Active",
  sold: "Sold",
  off_market: "Off market",
};

function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
        status === "active" && "bg-emerald-100 text-emerald-700",
        status === "sold" && "bg-surface-container text-text-secondary",
        status === "off_market" && "bg-amber-100 text-amber-700"
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

function LeadAgeBadge({ lastContactedAt, createdAt }: { lastContactedAt: string | null; createdAt: string }) {
  const { label, colour } = getLeadStaleness(lastContactedAt, createdAt);
  return (
    <span className={cn(
      "inline-flex items-center gap-1 text-[11px] font-medium",
      colour === "green" && "text-emerald-700",
      colour === "amber" && "text-amber-600",
      colour === "red" && "text-red-600",
      colour === "grey" && "text-text-secondary",
    )}>
      <span className={cn(
        "w-1.5 h-1.5 rounded-full",
        colour === "green" && "bg-emerald-500",
        colour === "amber" && "bg-amber-500",
        colour === "red" && "bg-red-500",
        colour === "grey" && "bg-text-secondary",
      )} />
      {label}
    </span>
  );
}

function LeadAgeLegend() {
  const items = [
    { colour: "bg-emerald-500", label: "< 2 weeks" },
    { colour: "bg-amber-500",   label: "2 weeks – 2 months" },
    { colour: "bg-red-500",     label: "> 2 months / stale" },
    { colour: "bg-outline",     label: "Never contacted" },
  ];
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5 px-1">
      {items.map(({ colour, label }) => (
        <span key={label} className="flex items-center gap-1.5 text-[11px] text-text-secondary">
          <span className={`w-2 h-2 rounded-full shrink-0 ${colour}`} />
          {label}
        </span>
      ))}
    </div>
  );
}

function TempChip({ temperature }: { temperature: string | null }) {
  if (!temperature) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize",
        temperature === "hot" && "bg-red-100 text-red-700",
        temperature === "warm" && "bg-amber-100 text-amber-700",
        temperature === "cold" && "bg-blue-100 text-blue-700"
      )}
    >
      {temperature}
    </span>
  );
}

function CriteriaChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
      {label}
    </span>
  );
}

interface PropertyDetailProps {
  property: Property;
  matchedBuyers: MatchedBuyer[];
}

export function PropertyDetail({ property, matchedBuyers }: PropertyDetailProps) {
  const [status, setStatus] = useState<Status>(property.status);
  const [isPending, startTransition] = useTransition();
  const [statusError, setStatusError] = useState<string | null>(null);

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as Status;
    const prev = status;
    setStatus(newStatus);
    setStatusError(null);
    startTransition(async () => {
      const result = await updatePropertyStatus(property.id, newStatus);
      if (result.error) {
        setStatus(prev);
        setStatusError(result.error);
      }
    });
  }

  const maxCriteria = 5; // suburb, budget, bedrooms, land size, property type

  return (
    <div className="min-h-screen bg-surface-container">
      {/* Header */}
      <div className="bg-white border-b border-border px-4 lg:px-6 pt-safe-top">
        <div className="flex items-center gap-3 h-16">
          <Link
            href="/properties"
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-surface-container transition-colors text-text-secondary"
            aria-label="Back to properties"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-[17px] font-bold text-text-primary flex-1 min-w-0 truncate">
            {property.street_address}
          </h1>
        </div>
      </div>

      <div className="w-full px-4 py-5 pb-28 lg:px-6 flex flex-col gap-5">
        {/* Property summary card */}
        <div className="bg-white rounded-xl border border-border p-4 flex flex-col gap-3">
          <div>
            <p className="text-sm text-text-secondary">
              {property.suburb}, {property.state}
              {property.postcode ? ` ${property.postcode}` : ""}
            </p>
          </div>

          {/* Status row */}
          <div className="flex items-center gap-3 flex-wrap">
            <StatusBadge status={status} />
            <div className="relative">
              <select
                value={status}
                onChange={handleStatusChange}
                disabled={isPending}
                className="h-9 pl-3 pr-8 rounded-lg border border-border bg-white text-sm text-text-primary outline-none focus:border-teal-action appearance-none disabled:opacity-60"
                aria-label="Change property status"
              >
                <option value="active">Active</option>
                <option value="sold">Sold</option>
                <option value="off_market">Off market</option>
              </select>
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary text-xs">
                ▾
              </span>
            </div>
            {statusError && (
              <p className="text-xs text-error">{statusError}</p>
            )}
          </div>

          {/* Key stats */}
          <div className="flex items-center gap-4 flex-wrap pt-1 border-t border-border">
            <div className="flex items-center gap-1.5">
              <span className="text-[17px] font-bold text-text-primary">
                {formatPrice(property.price)}
              </span>
            </div>
            {property.bedrooms != null && (
              <div className="flex items-center gap-1 text-sm text-text-secondary">
                <BedDouble size={15} />
                <span>{property.bedrooms} bed</span>
              </div>
            )}
            {property.bathrooms != null && (
              <div className="flex items-center gap-1 text-sm text-text-secondary">
                <Bath size={15} />
                <span>{property.bathrooms} bath</span>
              </div>
            )}
            {property.land_size != null && (
              <div className="flex items-center gap-1 text-sm text-text-secondary">
                <Ruler size={15} />
                <span>{property.land_size.toLocaleString("en-AU")} m²</span>
              </div>
            )}
            {property.property_type && (
              <div className="flex items-center gap-1 text-sm text-text-secondary">
                <Building2 size={15} />
                <span>{property.property_type}</span>
              </div>
            )}
          </div>

          {/* Listing URL */}
          {property.listing_url && (
            <a
              href={property.listing_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-teal-action hover:underline"
            >
              <ExternalLink size={14} />
              View listing
            </a>
          )}

          {/* Notes */}
          {property.notes && (
            <p className="text-sm text-text-secondary border-t border-border pt-3">
              {property.notes}
            </p>
          )}
        </div>

        {/* Matched buyers section */}
        <div className="flex flex-col gap-3">
          <LeadAgeLegend />
          <h2 className="text-[16px] font-bold text-text-primary">
            {matchedBuyers.length > 0
              ? `${matchedBuyers.length} buyer${matchedBuyers.length === 1 ? "" : "s"} match this property`
              : "No buyers match this property"}
          </h2>

          {matchedBuyers.length === 0 ? (
            <div className="bg-white rounded-xl border border-border p-6 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center">
                <Building2 size={22} className="text-text-secondary" />
              </div>
              <p className="text-sm text-text-secondary">
                No buyers match this property yet. Try adjusting the price or suburb.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {matchedBuyers.map((buyer) => (
                <li key={buyer.id} className="bg-white rounded-xl border border-border p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={`/buyers/${buyer.id}`}
                          className="text-[15px] font-semibold text-text-primary hover:text-teal-action transition-colors"
                        >
                          {buyer.name}
                        </Link>
                        <TempChip temperature={buyer.buyer_temperature} />
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-text-secondary">
                          {buyer.score} of {maxCriteria} criteria matched
                        </p>
                        <span className="text-text-secondary">·</span>
                        <LeadAgeBadge lastContactedAt={buyer.last_contacted_at} createdAt={buyer.created_at} />
                      </div>
                    </div>
                  </div>

                  {/* Criteria chips */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {buyer.matchedCriteria.map((criterion) => (
                      <CriteriaChip key={criterion} label={criterion} />
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/buyers/${buyer.id}`}
                      className="flex-1 flex items-center justify-center h-10 rounded-lg border border-border text-sm font-medium text-text-primary hover:bg-surface-container transition-colors"
                    >
                      View profile
                    </Link>
                    <Link
                      href={`/buyers/${buyer.id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-lg bg-teal-action text-on-teal-action text-sm font-medium hover:bg-teal-action/90 transition-colors"
                    >
                      <Bell size={14} />
                      Add reminder
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
