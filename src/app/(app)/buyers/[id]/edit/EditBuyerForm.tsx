"use client";

import { useState, useTransition, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Search, FileText, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SuburbCombobox } from "@/components/ui/suburb-combobox";
import { formatPhone } from "@/lib/format";
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
    <div className="flex items-center gap-2 pb-3 mb-3 border-b border-border">
      <span className="text-teal-action">{icon}</span>
      <p className="text-[15px] font-bold text-primary tracking-tight">{title}</p>
    </div>
  );
}

const fieldLabelClass = "text-[11px] font-semibold uppercase tracking-[0.08em] text-text-secondary";

function FieldRow({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={cn("mb-1.5 block", fieldLabelClass)}>
        {label}
      </label>
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

function SelectField({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(inputBase, "appearance-none cursor-pointer pr-10", !value && "text-outline")}
      >
        <option value="">Select…</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
    </div>
  );
}

const BUDGET_OPTIONS = [
  50000, 75000, 100000, 125000, 150000, 175000, 200000, 225000, 250000, 275000,
  300000, 325000, 350000, 375000, 400000, 425000, 450000, 475000, 500000,
  550000, 600000, 650000, 700000, 750000, 800000, 850000, 900000, 950000,
  1000000, 1100000, 1200000, 1300000, 1400000, 1500000, 1600000, 1700000,
  1800000, 1900000, 2000000,
];

function BudgetSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(inputBase, "appearance-none cursor-pointer pr-10", !value && "text-outline")}
      >
        <option value="">Any</option>
        {BUDGET_OPTIONS.map((n) => (
          <option key={n} value={String(n)}>${n.toLocaleString("en-AU")}</option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
    </div>
  );
}

const MUST_HAVES_OPTIONS = [
  "Pool", "Double garage", "Study/home office", "Alfresco/outdoor living",
  "Solar panels", "Granny flat", "Workshop", "Side access",
  "North-facing", "Large garden", "Street appeal", "Open plan living",
];

export function EditBuyerForm({ buyer, agentState }: { buyer: Buyer; agentState?: string | null }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(buyer.name ?? "");
  const [phone, setPhone] = useState(buyer.phone ?? "");
  const [email, setEmail] = useState(buyer.email ?? "");
  const [suburbs, setSuburbs] = useState<string[]>(buyer.preferred_suburbs ?? []);
  const [budgetMin, setBudgetMin] = useState(buyer.budget_min ? String(buyer.budget_min) : "");
  const [budgetMax, setBudgetMax] = useState(buyer.budget_max ? String(buyer.budget_max) : "");
  const [bedrooms, setBedrooms] = useState(buyer.bedrooms ?? "Any");
  const [landSizeMin, setLandSizeMin] = useState(buyer.land_size_min ? `${buyer.land_size_min}m²` : "Any");
  const [note, setNote] = useState(buyer.notes_summary ?? "");

  const [preferredContactMethod] = useState(buyer.preferred_contact_method ?? "");
  const [bestTimeToContact] = useState(buyer.best_time_to_contact ?? "");
  const [contactConsent] = useState(buyer.contact_consent ?? "");
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
    const min = budgetMin ? parseInt(budgetMin, 10) : null;
    const max = budgetMax ? parseInt(budgetMax, 10) : null;
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
        budget_min: budgetMin ? parseInt(budgetMin, 10) : null,
        budget_max: budgetMax ? parseInt(budgetMax, 10) : null,
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
    <div className="h-dvh bg-background flex flex-col overflow-hidden">
      {/* ── Header ── */}
      <header className="shrink-0 bg-primary z-20 border-b border-white/10">
        <div className="w-full px-4 lg:px-6 h-14 flex items-center justify-between">
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
      <div className="flex-1 min-h-0 overflow-y-auto pb-28">
        <div className="w-full px-4 lg:px-6 py-5">

          {errors._form && (
            <div className="px-4 py-3 rounded-xl bg-error/10 border border-error/20 text-sm text-error mb-4">
              {errors._form}
            </div>
          )}

          {/* Desktop 2-col, mobile single-col */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-6 lg:items-start space-y-4 lg:space-y-0">

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

                <div className="pt-1 border-t border-border/70">
                  <p className="text-[15px] font-bold text-primary tracking-tight pt-3 mb-3">Engagement</p>
                </div>
                <FieldRow label="Buyer type">
                  <SelectField
                    options={["First home buyer", "Investor", "Upgrader", "Downsizer", "Interstate"]}
                    value={buyerType}
                    onChange={setBuyerType}
                  />
                </FieldRow>
                <FieldRow label="Lead source">
                  <SelectField
                    options={["Referral", "Database", "Open home", "Social media", "Website", "Other"]}
                    value={leadSource}
                    onChange={setLeadSource}
                  />
                </FieldRow>
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

            {/* ── Right: Requirements + Preferences ── */}
            <div className="space-y-4">

              <SectionCard>
                <SectionHeader icon={<Search size={14} />} title="Property Search" />

                <div className="space-y-5">
                  {/* Row 1: Suburbs | Budget */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                    <FieldRow label="Target Suburbs" error={errors.suburbs}>
                      <SuburbCombobox
                        value={suburbs}
                        onChange={setSuburbs}
                        placeholder="e.g. Paddington, Woollahra"
                        error={errors.suburbs}
                        preferredState={agentState}
                      />
                    </FieldRow>
                    <div className="space-y-3 min-w-0">
                      <FieldRow label="Min Budget">
                        <BudgetSelect value={budgetMin} onChange={setBudgetMin} />
                      </FieldRow>
                      <FieldRow label="Max Budget" error={errors.budgetMax}>
                        <BudgetSelect value={budgetMax} onChange={setBudgetMax} />
                      </FieldRow>
                    </div>
                  </div>

                  {/* Row 2: Timeline | Condition */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                    <FieldRow label="Buying Timeline">
                      <SelectField
                        options={["Ready now", "0–3 months", "3–6 months", "6+ months", "Just researching"]}
                        value={buyingTimeline}
                        onChange={setBuyingTimeline}
                      />
                    </FieldRow>
                    <FieldRow label="Condition">
                      <SelectField
                        options={["Any", "Established", "New/Modern", "Renovation project"]}
                        value={conditionPreference}
                        onChange={setConditionPreference}
                      />
                    </FieldRow>
                  </div>

                  {/* Row 3: Property criteria */}
                  <div>
                    <p className={cn(fieldLabelClass, "mb-2")}>Property criteria</p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                      <div className="rounded-lg border border-border/80 bg-surface-container-low p-3 min-w-0">
                        <FieldRow label="Minimum Bedrooms">
                          <SegmentedControl options={["Any", "2+", "3+", "4+", "5+"]} value={bedrooms} onChange={setBedrooms} />
                        </FieldRow>
                      </div>
                      <div className="rounded-lg border border-border/80 bg-surface-container-low p-3 min-w-0">
                        <FieldRow label="Bathrooms">
                          <SegmentedControl options={["Any", "1+", "2+", "3+"]} value={bathrooms} onChange={setBathrooms} />
                        </FieldRow>
                      </div>
                      <div className="rounded-lg border border-border/80 bg-surface-container-low p-3 min-w-0">
                        <FieldRow label="Car spaces">
                          <SegmentedControl options={["Any", "1+", "2+", "3+"]} value={carSpaces} onChange={setCarSpaces} />
                        </FieldRow>
                      </div>
                    </div>
                    <div className="mt-2 rounded-lg border border-border/80 bg-surface-container-low p-3 min-w-0">
                      <FieldRow label="Land Size (min)">
                        <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
                          <div className="min-w-max">
                            <SegmentedControl
                              options={["Any", "300m²", "400m²", "500m²", "600m²", "700m²+"]}
                              value={landSizeMin}
                              onChange={setLandSizeMin}
                            />
                          </div>
                        </div>
                      </FieldRow>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FieldRow label="Property type">
                      <SelectField options={["House", "Apartment/Unit", "Townhouse", "Land", "Rural"]} value={propertyType} onChange={setPropertyType} />
                    </FieldRow>
                    <FieldRow label="House style">
                      <SelectField options={["Freestanding", "Semi-detached", "Terrace", "Villa"]} value={houseType} onChange={setHouseType} />
                    </FieldRow>
                  </div>

                <div className="grid grid-cols-2 gap-3">
                  <FieldRow label="Building size min (sq)">
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
                  </FieldRow>
                  <FieldRow label="Block preference">
                    <SelectField options={["Flat", "Sloped", "Corner", "Any"]} value={blockPreference} onChange={setBlockPreference} />
                  </FieldRow>
                </div>
                </div>
              </SectionCard>

              <SectionCard>
                <p className="text-[15px] font-bold text-primary tracking-tight pb-3 mb-3 border-b border-border">Must-Haves</p>
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

          </div>
        </div>
      </div>

      {/* ── Save footer ── */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-60 bg-white border-t border-border shadow-[0_-4px_16px_rgba(15,28,44,0.06)]">
        <div className="w-full px-4 lg:px-6 py-4 flex items-center gap-3">
          <Link
            href={`/buyers/${buyer.id}`}
            className="flex-1 h-14 flex items-center justify-center text-sm font-semibold text-text-secondary rounded-2xl border border-border hover:bg-surface-container transition-colors"
          >
            Discard
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending || !name.trim()}
            className="flex-1 h-14 rounded-2xl bg-teal-action text-on-teal-action font-bold text-[15px] tracking-tight transition-opacity disabled:opacity-40 shadow-[0_4px_16px_rgba(0,106,98,0.35)]"
          >
            {isPending ? "Saving…" : "Save Buyer Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
