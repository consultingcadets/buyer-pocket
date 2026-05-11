"use client";

import Link from "next/link";
import { Plus, Building2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/BottomNav";
import type { Property } from "@/types/property";

function formatPrice(price: number): string {
  if (price >= 1_000_000) {
    return `$${(price / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  return `$${Math.round(price / 1000)}k`;
}

function StatusBadge({ status }: { status: Property["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        status === "active" && "bg-emerald-100 text-emerald-700",
        status === "sold" && "bg-surface-container text-text-secondary",
        status === "off_market" && "bg-amber-100 text-amber-700"
      )}
    >
      {status === "active" ? "Active" : status === "sold" ? "Sold" : "Off market"}
    </span>
  );
}

interface PropertiesListProps {
  initialProperties: Property[];
}

export function PropertiesList({ initialProperties }: PropertiesListProps) {
  const properties = initialProperties;

  return (
    <div className="min-h-screen bg-surface-container">
      {/* Header */}
      <div className="bg-white border-b border-border px-4 pt-safe-top">
        <div className="max-w-2xl mx-auto flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <h1 className="text-[18px] font-bold text-text-primary">Properties</h1>
            {properties.length > 0 && (
              <span className="text-sm text-text-secondary font-normal">
                {properties.length}
              </span>
            )}
          </div>
          <Link
            href="/properties/new"
            className="inline-flex items-center gap-1.5 h-10 px-4 bg-teal-action text-on-teal-action text-sm font-semibold rounded-lg hover:bg-teal-action/90 transition-colors"
          >
            <Plus size={16} />
            Add Property
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
        {properties.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center text-center py-20 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white border border-border flex items-center justify-center">
              <Building2 size={28} className="text-text-secondary" />
            </div>
            <div>
              <p className="text-[16px] font-semibold text-text-primary">No properties yet</p>
              <p className="text-sm text-text-secondary mt-1">
                Add a property to find matching buyers.
              </p>
            </div>
            <Link
              href="/properties/new"
              className="inline-flex items-center gap-1.5 h-12 px-6 bg-teal-action text-on-teal-action text-sm font-semibold rounded-xl hover:bg-teal-action/90 transition-colors"
            >
              <Plus size={16} />
              Add Property
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {properties.map((property) => (
              <li key={property.id}>
                <Link
                  href={`/properties/${property.id}`}
                  className="block bg-white rounded-xl border border-border p-4 hover:border-teal-action/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-[15px] font-semibold text-text-primary truncate">
                          {property.street_address}
                        </p>
                        <StatusBadge status={property.status} />
                      </div>
                      <p className="text-sm text-text-secondary mt-0.5">
                        {property.suburb}, {property.state}
                      </p>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className="text-[15px] font-bold text-text-primary">
                          {formatPrice(property.price)}
                        </span>
                        {(property.property_type || property.bedrooms != null) && (
                          <span className="text-sm text-text-secondary">
                            {[
                              property.property_type,
                              property.bedrooms != null ? `${property.bedrooms} bed` : null,
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-text-secondary shrink-0 mt-1" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
