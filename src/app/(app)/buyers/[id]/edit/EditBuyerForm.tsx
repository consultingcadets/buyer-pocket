"use client";

import { useState, useTransition, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, BarChart2, Search, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SuburbCombobox } from "@/components/ui/suburb-combobox";
import { formatPhone, parseAmount, formatAmount } from "@/lib/format";
import { updateBuyer } from "../actions";
import type { Database } from "@/types/database";

type Buyer = Database["public"]["Tables"]["buyers"]["Row"];

const inputBase =
  "w-full h-12 px-4 rounded-xl border bg-surface-container-low text-text-primary placeholder:text-outline focus:outline-none focus:ring-0 focus:border-2 focus:border-teal-action transition-colors text-[15px]";

function inputCls(hasError?: string) {
  return cn(inputBase, hasError ? "border-error" : "border-border");
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-border shadow-sm p-5 space-y-4">
      {children}
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 pb-1">
      <span className="text-teal-action">{icon}</span>
      <p className="text-[12px] font-bold text-text-secondary uppercase tracking-wider">{title}</p>
    </div>
  );
}

function FieldRow({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-text-primary mb-1.5">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
    </div>
  );
}

function TempButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const styles: Record<string, { ring: string; text: string; bg: string; dot: string }> = {
    Hot:  { ring: "border-red-400",   text: "text-red-500",   bg: "bg-red-50",   dot: "bg-red-500" },
    Warm: { ring: "border-amber-400", text: "text-amber-600", bg: "bg-amber-50", dot: "bg-amber-500" },
    Cold: { ring: "border-blue-400",  text: "text-blue-500",  bg: "bg-blue-50",  dot: "bg-blue-500" },
  };
  const s = styles[label] ?? { ring: "border-border", text: "text-text-secondary", bg: "bg-surface-container", dot: "bg-outline" };
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 h-10 rounded-full border text-[13px] font-semibold transition-all flex items-center justify-center gap-1.5",
        active ? `${s.ring} ${s.text} ${s.bg}` : "border-border text-text-secondary bg-surface-container-low hover:border-primary/30 hover:text-text-primary"
      )}
    >
      {active && <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", s.dot)} />}
      {label}
    </button>
  );
}

function PillChip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-8 px-4 rounded-full border text-[13px] font-medium transition-colors whitespace-nowrap",
        selected
          ? "bg-teal-action border-teal-action text-on-teal-action"
          : "bg-white border-border text-text-secondary hover:border-teal-action/40 hover:text-text-primary"
      )}
    >
      {label}
    </button>
  );
}

function ChipGroup({ label, options, value, onChange }: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-[13px] font-medium text-text-secondary mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <PillChip key={opt} label={opt} selected={value === opt} onClick={() => onChange(value === opt ? "" : opt)} />
        ))}
      </div>
    </div>
  );
}

function AnimatedExpand({ open, children }: { open: boolean; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    setHeight(open ? ref.current.scrollHeight : 0);
  }, [open]);
  useEffect(() => {
    if (open && ref.current) setHeight(ref.current.scrollHeight);
  });
  return (
    <div style={{ height, overflow: "hidden", transition: "height 300ms ease" }}>
      <div ref={ref}>{children}</div>
    </div>
  );
}

const MUST_HAVES_OPTIONS = [
  "Pool", "Double garage", "Study/home office", "Alfresco/outdoor living",
  "Solar panels", "Granny flat", "Workshop", "Side access",
  "North-facing", "Large garden", "Street appeal", "Open plan living",
];

export function EditBuyerForm({ buyer }: { buyer: Buyer }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(buyer.name ?? "");
  const [phone, setPhone] = useState(buyer.phone ?? "");
  const [email, setEmail] = useState(buyer.email ?? "");
  const [suburbs, setSuburbs] = useState<string[]>(buyer.preferred_suburbs ?? []);
  const [budgetMin, setBudgetMin] = useState(buyer.budget_min ? formatAmount(String(buyer.budget_min)) : "");
  const [budgetMax, setBudgetMax] = useState(buyer.budget_max ? formatAmount(String(buyer.budget_max)) : "");
  const [bedrooms, setBedrooms] = useState(buyer.bedrooms ?? "Any");
  const [landSizeMin, setLandSizeMin] = useState(buyer.land_size_min ? `${buyer.land_size_min}m²` : "Any");
  const [note, setNote] = useState(buyer.notes_summary ?? "");
  const [showMore, setShowMore] = useState(false);

  const [preferredContactMethod, setPreferredContactMethod] = useState(buyer.preferred_contact_method ?? "");
  const [bestTimeToContact, setBestTimeToContact] = useState(buyer.best_time_to_contact ?? "");
  const [contactConsent, setContactConsent] = useState(buyer.contact_consent ?? "");
  const [propertyType, setPropertyType] = useState(buyer.property_type ?? "");
  const [houseType, setHouseType] = useState(buyer.house_type ?? "");
  const [bathrooms, setBathrooms] = useState(buyer.bathrooms ?? "Any");
  const [carSpaces, setCarSpaces] = useState(buyer.car_spaces ?? "Any");
  const [conditionPreference, setConditionPreference] = useState(buyer.condition_preference ?? "");
  const [buildingSizeMin, setBuildingSizeMin] = useState(buyer.building_size_min ? String(buyer.building_size_min) : "");
  const [blockPreference, setBlockPreference] = useState(buyer.block_preference ?? "");
  const [mustHaves, setMustHaves] = useState<string[]>(buyer.must_haves ?? []);
  const [buyingTimeline, setBuyingTimeline] = useState(buyer.buying_timeline ?? "");
  const [buyerTemperature, setBuyerTemperature] = useState(
    buyer.buyer_temperature ? buyer.buyer_temperature.charAt(0).toUpperCase() + buyer.buyer_temperature.slice(1) : ""
  );
  const [buyerType, setBuyerType] = useState(buyer.buyer_type ?? "");
  const [leadSource, setLeadSource] = useState(buyer.lead_source ?? "");

  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Enter the buyer's name";
    if (suburbs.length === 0) errs.suburbs = "Add at least one suburb";
    const min = parseAmount(budgetMin);
    const max = parseAmount(budgetMax);
    if (min !== null && max !== null && min > max) errs.budgetMax = "Max must be greater than minimum";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  const handleSubmit = useCallback(() => {
    if (!validate()) return;

    let landSizeValue: number | null = null;
    if (landSizeMin !== "Any") landSizeValue = parseInt(landSizeMin, 10) || null;

    let tempValue: "hot" | "warm" | "cold" | null = null;
    if (buyerTemperature) {
      const t = buyerTemperature.toLowerCase();
      if (t === "hot" || t === "warm" || t === "cold") tempValue = t;
    }

    startTransition(async () => {
      const res = await updateBuyer(buyer.id, {
        name: name.trim(),
        phone: phone || null,
        email: email || null,
        preferred_suburbs: suburbs,
        budget_min: parseAmount(budgetMin),
        budget_max: parseAmount(budgetMax),
        bedrooms: bedrooms === "Any" ? null : bedrooms,
        land_size_min: landSizeValue,
        notes_summary: note || null,
        preferred_contact_method: preferredContactMethod || null,
        best_time_to_contact: bestTimeToContact || null,
        contact_consent: contactConsent || null,
        property_type: propertyType || null,
        house_type: houseType || null,
        bathrooms: bathrooms === "Any" ? null : bathrooms,
        car_spaces: carSpaces === "Any" ? null : carSpaces,
        condition_preference: conditionPreference || null,
        building_size_min: buildingSizeMin ? parseInt(buildingSizeMin, 10) || null : null,
        block_preference: blockPreference || null,
        must_haves: mustHaves.length > 0 ? mustHaves : null,
        buying_timeline: buyingTimeline || null,
        buyer_temperature: tempValue,
        buyer_type: buyerType || null,
        lead_source: leadSource || null,
      });

      if (res.error) {
        setErrors((prev) => ({ ...prev, _form: res.error! }));
      } else {
        router.push(`/buyers/${buyer.id}`);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, phone, email, suburbs, budgetMin, budgetMax, bedrooms,
    landSizeMin, note, preferredContactMethod, bestTimeToContact, contactConsent,
    propertyType, houseType, bathrooms, carSpaces, conditionPreference,
    buildingSizeMin, blockPreference, mustHaves, buyingTimeline, buyerTemperature,
    buyerType, leadSource, router]);

  const toggleMustHave = useCallback((item: string) => {
    setMustHaves((prev) => prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* ── Header ── */}
      <header className="sticky top-0 bg-primary z-20 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 lg:px-6 h-14 flex items-center justify-between">
          <Link
            href={`/buyers/${buyer.id}`}
            className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </Link>
          <h1 className="text-base font-semibold text-white tracking-tight">Edit Buyer</h1>
          <div className="w-16" />
        </div>
      </header>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto pb-28">
        <div className="max-w-5xl mx-auto px-4 lg:px-6 py-5">

          {errors._form && (
            <div className="px-4 py-3 rounded-xl bg-error/10 border border-error/20 text-sm text-error mb-4">
              {errors._form}
            </div>
          )}

          {/* Desktop 2-col, mobile single-col */}
          <div className="lg:grid lg:grid-cols-[1fr_400px] lg:gap-6 lg:items-start space-y-4 lg:space-y-0">

            {/* ── Left: Identity + Status + Notes ── */}
            <div className="space-y-4">

              {/* Identity */}
              <SectionCard>
                <SectionHeader icon={<User size={14} />} title="Buyer Identity" />

                <FieldRow label="Full Name" error={errors.name}>
                  <input
                    autoFocus
                    type="text"
                    placeholder="e.g. Cameron Knight"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputCls(errors.name)}
                  />
                </FieldRow>

                <div className="grid grid-cols-2 gap-3">
                  <FieldRow label="Phone Number">
                    <input
                      type="tel"
                      placeholder="+61 400 000 000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onBlur={(e) => setPhone(formatPhone(e.target.value))}
                      className={inputCls()}
                    />
                  </FieldRow>
                  <FieldRow label="Email Address">
                    <input
                      type="email"
                      placeholder="name@email.com.au"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputCls()}
                    />
                  </FieldRow>
                </div>

                <FieldRow label="Buyer Temperature">
                  <div className="flex gap-2">
                    {["Hot", "Warm", "Cold"].map((t) => (
                      <TempButton
                        key={t}
                        label={t}
                        active={buyerTemperature === t}
                        onClick={() => setBuyerTemperature((v) => v === t ? "" : t)}
                      />
                    ))}
                  </div>
                </FieldRow>
              </SectionCard>

              {/* Engagement Status */}
              <SectionCard>
                <SectionHeader icon={<BarChart2 size={14} />} title="Engagement Status" />
                <ChipGroup
                  label="Buying Timeline"
                  options={["Ready now", "0–3 months", "3–6 months", "6+ months", "Just researching"]}
                  value={buyingTimeline}
                  onChange={setBuyingTimeline}
                />
                <ChipGroup
                  label="Buyer type"
                  options={["First home buyer", "Investor", "Upgrader", "Downsizer", "Interstate"]}
                  value={buyerType}
                  onChange={setBuyerType}
                />
                <ChipGroup
                  label="Lead source"
                  options={["Referral", "Database", "Open home", "Social media", "Website", "Other"]}
                  value={leadSource}
                  onChange={setLeadSource}
                />
              </SectionCard>

              {/* Internal Notes */}
              <SectionCard>
                <SectionHeader icon={<FileText size={14} />} title="Internal Notes" />
                <textarea
                  placeholder="Mention specific requirements, family situation, or urgency factors…"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface-container-low text-text-primary placeholder:text-outline focus:outline-none focus:ring-0 focus:border-2 focus:border-teal-action transition-colors resize-none text-[15px]"
                />
              </SectionCard>
            </div>

            {/* ── Right: Search Criteria (sticky on desktop) ── */}
            <div className="lg:sticky lg:top-[4.5rem] space-y-4">

              <SectionCard>
                <SectionHeader icon={<Search size={14} />} title="Search Criteria" />

                <FieldRow label="Target Suburbs" error={errors.suburbs}>
                  <SuburbCombobox
                    value={suburbs}
                    onChange={setSuburbs}
                    placeholder="e.g. Paddington, Woollahra"
                    error={errors.suburbs}
                  />
                </FieldRow>

                <div className="grid grid-cols-2 gap-3">
                  <FieldRow label="Min Budget" error={errors.budgetMax}>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline text-sm pointer-events-none">$</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="1,200,000"
                        value={budgetMin}
                        onChange={(e) => setBudgetMin(e.target.value.replace(/[^0-9]/g, ""))}
                        onBlur={(e) => setBudgetMin(formatAmount(e.target.value))}
                        className={cn(inputCls(), "pl-8")}
                      />
                    </div>
                  </FieldRow>
                  <FieldRow label="Max Budget" error={errors.budgetMax}>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline text-sm pointer-events-none">$</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="2,500,000"
                        value={budgetMax}
                        onChange={(e) => setBudgetMax(e.target.value.replace(/[^0-9]/g, ""))}
                        onBlur={(e) => setBudgetMax(formatAmount(e.target.value))}
                        className={cn(inputCls(errors.budgetMax), "pl-8")}
                      />
                    </div>
                  </FieldRow>
                </div>
                {errors.budgetMax && <p className="text-xs text-error -mt-2">{errors.budgetMax}</p>}

                <FieldRow label="Minimum Bedrooms">
                  <SegmentedControl options={["Any", "2+", "3+", "4+", "5+"]} value={bedrooms} onChange={setBedrooms} />
                </FieldRow>

                <FieldRow label="Land Size (min)">
                  <div className="overflow-x-auto -mx-5 px-5">
                    <div className="min-w-max">
                      <SegmentedControl
                        options={["Any", "300m²", "400m²", "500m²", "600m²", "700m²+"]}
                        value={landSizeMin}
                        onChange={setLandSizeMin}
                      />
                    </div>
                  </div>
                </FieldRow>
              </SectionCard>

              {/* Show more toggle */}
              <button
                type="button"
                onClick={() => setShowMore((v) => !v)}
                className="w-full flex items-center justify-center gap-1.5 text-sm font-semibold text-teal-action py-1"
              >
                {showMore ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {showMore ? "Hide details" : "Show more details"}
              </button>

              <AnimatedExpand open={showMore}>
                <div className="space-y-4 pt-1">
                  <SectionCard>
                    <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1">Contact Preferences</p>
                    <ChipGroup label="Preferred method" options={["Call", "SMS", "Email", "WhatsApp"]} value={preferredContactMethod} onChange={setPreferredContactMethod} />
                    <ChipGroup label="Best time" options={["Morning", "Afternoon", "Evening", "Weekends"]} value={bestTimeToContact} onChange={setBestTimeToContact} />
                    <ChipGroup label="Consent" options={["Consent given", "No consent", "Unknown"]} value={contactConsent} onChange={setContactConsent} />
                  </SectionCard>

                  <SectionCard>
                    <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1">Property Preferences</p>
                    <ChipGroup label="Type" options={["House", "Apartment/Unit", "Townhouse", "Land", "Rural"]} value={propertyType} onChange={setPropertyType} />
                    <ChipGroup label="House style" options={["Freestanding", "Semi-detached", "Terrace", "Villa"]} value={houseType} onChange={setHouseType} />
                    <div>
                      <p className="text-[13px] font-medium text-text-secondary mb-2">Bathrooms</p>
                      <SegmentedControl options={["Any", "1+", "2+", "3+"]} value={bathrooms} onChange={setBathrooms} />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-text-secondary mb-2">Car spaces</p>
                      <SegmentedControl options={["Any", "1+", "2+", "3+"]} value={carSpaces} onChange={setCarSpaces} />
                    </div>
                    <ChipGroup label="Condition" options={["Any", "Established", "New/Modern", "Renovation project"]} value={conditionPreference} onChange={setConditionPreference} />
                  </SectionCard>

                  <SectionCard>
                    <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1">Size Requirements</p>
                    <div>
                      <p className="text-[13px] font-medium text-text-secondary mb-2">Building size min (squares)</p>
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="e.g. 25"
                          value={buildingSizeMin}
                          onChange={(e) => setBuildingSizeMin(e.target.value.replace(/[^0-9]/g, ""))}
                          className={cn(inputCls(), "pr-12")}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-outline text-sm pointer-events-none">sq</span>
                      </div>
                    </div>
                    <ChipGroup label="Block preference" options={["Flat", "Sloped", "Corner", "Any"]} value={blockPreference} onChange={setBlockPreference} />
                  </SectionCard>

                  <SectionCard>
                    <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-3">Must-Haves</p>
                    <div className="flex flex-wrap gap-2">
                      {MUST_HAVES_OPTIONS.map((item) => (
                        <PillChip
                          key={item}
                          label={item}
                          selected={mustHaves.includes(item)}
                          onClick={() => toggleMustHave(item)}
                        />
                      ))}
                    </div>
                  </SectionCard>
                </div>
              </AnimatedExpand>
            </div>

          </div>
        </div>
      </div>

      {/* ── Save footer ── */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-60 bg-white border-t border-border shadow-[0_-4px_16px_rgba(15,28,44,0.06)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6 py-4 flex items-center gap-3">
          <Link
            href={`/buyers/${buyer.id}`}
            className="shrink-0 h-14 px-6 flex items-center justify-center text-sm font-semibold text-text-secondary rounded-2xl border border-border hover:bg-surface-container transition-colors"
          >
            Discard
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="flex-1 h-14 rounded-2xl bg-teal-action text-on-teal-action font-bold text-[15px] tracking-tight transition-opacity disabled:opacity-60 shadow-[0_4px_16px_rgba(0,106,98,0.35)]"
          >
            {isPending ? "Saving…" : "Save Buyer Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
