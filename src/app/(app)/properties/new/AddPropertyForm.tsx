"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatAmount, parseAmount } from "@/lib/format";
import { SuburbCombobox } from "@/components/ui/suburb-combobox";
import { addProperty } from "../actions";

type FormErrors = {
  street_address?: string;
  suburb?: string;
  price?: string;
  general?: string;
};

const PROPERTY_TYPES = ["House", "Townhouse", "Apartment/Unit", "Land", "Rural"];
const BEDROOMS_OPTIONS = ["1", "2", "3", "4", "5+"];
const BATHROOMS_OPTIONS = ["1", "2", "3", "4+"];

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-text-primary mb-1.5">
      {children}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-error">{message}</p>;
}

function inputClass(hasError?: boolean) {
  return cn(
    "w-full h-12 px-3 rounded-lg border bg-white text-sm text-text-primary placeholder:text-text-secondary outline-none transition-colors",
    hasError ? "border-error" : "border-border focus:border-teal-action focus:ring-1 focus:ring-teal-action"
  );
}

function selectClass(hasError?: boolean) {
  return cn(
    "w-full h-12 px-3 rounded-lg border bg-white text-sm text-text-primary outline-none transition-colors appearance-none",
    hasError ? "border-error" : "border-border focus:border-teal-action focus:ring-1 focus:ring-teal-action"
  );
}

export function AddPropertyForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [streetAddress, setStreetAddress] = useState("");
  const [suburb, setSuburb] = useState(""); // single "Suburb, STATE" string
  const [priceDisplay, setPriceDisplay] = useState(""); // formatted with commas
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [landSize, setLandSize] = useState("");
  const [listingUrl, setListingUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!streetAddress.trim()) errs.street_address = "Street address is required.";
    if (!suburb) errs.suburb = "Suburb is required.";
    const priceNum = parseAmount(priceDisplay);
    if (!priceDisplay.trim() || priceNum == null) errs.price = "Price is required.";
    return errs;
  }

  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setPriceDisplay(raw ? formatAmount(raw) : "");
  }

  function handleSuburbChange(v: string[]) {
    // Single selection — take the last element
    setSuburb(v[v.length - 1] ?? "");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    const priceNum = parseAmount(priceDisplay)!;

    startTransition(async () => {
      const result = await addProperty({
        street_address: streetAddress,
        suburbLabel: suburb,
        price: priceNum,
        property_type: propertyType || null,
        bedrooms: bedrooms ? (bedrooms === "5+" ? 5 : parseInt(bedrooms)) : null,
        bathrooms: bathrooms ? (bathrooms === "4+" ? 4 : parseInt(bathrooms)) : null,
        land_size: landSize ? parseInt(landSize) : null,
        listing_url: listingUrl || null,
        notes: notes || null,
      });

      if ("error" in result) {
        setErrors({ general: result.error });
        return;
      }

      router.push("/properties/" + result.propertyId);
    });
  }

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
          <h1 className="text-[18px] font-bold text-text-primary">Add Property</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 pb-28">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          {errors.general && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {errors.general}
            </div>
          )}

          {/* Street address */}
          <div>
            <FieldLabel htmlFor="street_address">Street address</FieldLabel>
            <input
              id="street_address"
              type="text"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              placeholder="12 Smith Street"
              className={inputClass(!!errors.street_address)}
              autoComplete="off"
            />
            <FieldError message={errors.street_address} />
          </div>

          {/* Suburb */}
          <div>
            <FieldLabel htmlFor="suburb-search">Suburb</FieldLabel>
            <SuburbCombobox
              value={suburb ? [suburb] : []}
              onChange={handleSuburbChange}
              placeholder="Search suburbs…"
              error={errors.suburb}
            />
          </div>

          {/* Price */}
          <div>
            <FieldLabel htmlFor="price">Price</FieldLabel>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-secondary select-none">
                $
              </span>
              <input
                id="price"
                type="text"
                inputMode="numeric"
                value={priceDisplay}
                onChange={handlePriceChange}
                placeholder="680,000"
                className={cn(inputClass(!!errors.price), "pl-7")}
              />
            </div>
            <FieldError message={errors.price} />
          </div>

          {/* Property type */}
          <div>
            <FieldLabel htmlFor="property_type">Property type</FieldLabel>
            <div className="relative">
              <select
                id="property_type"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className={selectClass()}
              >
                <option value="">Select type…</option>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary">
                ▾
              </span>
            </div>
          </div>

          {/* Bedrooms + Bathrooms side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel htmlFor="bedrooms">Bedrooms</FieldLabel>
              <div className="relative">
                <select
                  id="bedrooms"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className={selectClass()}
                >
                  <option value="">Any</option>
                  {BEDROOMS_OPTIONS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary">
                  ▾
                </span>
              </div>
            </div>
            <div>
              <FieldLabel htmlFor="bathrooms">Bathrooms</FieldLabel>
              <div className="relative">
                <select
                  id="bathrooms"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className={selectClass()}
                >
                  <option value="">Any</option>
                  {BATHROOMS_OPTIONS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary">
                  ▾
                </span>
              </div>
            </div>
          </div>

          {/* Land size */}
          <div>
            <FieldLabel htmlFor="land_size">Land size (m²)</FieldLabel>
            <input
              id="land_size"
              type="number"
              inputMode="numeric"
              min={0}
              value={landSize}
              onChange={(e) => setLandSize(e.target.value)}
              placeholder="Optional"
              className={inputClass()}
            />
          </div>

          {/* Listing URL */}
          <div>
            <FieldLabel htmlFor="listing_url">Listing URL</FieldLabel>
            <input
              id="listing_url"
              type="url"
              value={listingUrl}
              onChange={(e) => setListingUrl(e.target.value)}
              placeholder="https://…"
              className={inputClass()}
            />
          </div>

          {/* Notes */}
          <div>
            <FieldLabel htmlFor="notes">Notes</FieldLabel>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes about this property…"
              className={cn(
                "w-full px-3 py-3 rounded-lg border bg-white text-sm text-text-primary placeholder:text-text-secondary outline-none transition-colors resize-none",
                "border-border focus:border-teal-action focus:ring-1 focus:ring-teal-action"
              )}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full h-12 bg-teal-action text-on-teal-action text-sm font-semibold rounded-xl hover:bg-teal-action/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? "Saving…" : "Add Property"}
          </button>
        </form>
      </div>
    </div>
  );
}
