"use client";

import {
  useState,
  useTransition,
  useCallback,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, BarChart2, Search, FileText, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SuburbCombobox } from "@/components/ui/suburb-combobox";
import { formatPhone } from "@/lib/format";
import {
  getReminderDate,
  getReminderLabel,
  type ReminderChip,
} from "@/lib/reminder-utils";
import { addBuyer } from "./actions";
import { BottomNav } from "@/components/BottomNav";

// ─── Shared input style ───────────────────────────────────────────────────────

const inputBase =
  "w-full h-12 px-4 rounded-xl border bg-surface-container-low text-text-primary placeholder:text-outline focus:outline-none focus:ring-0 focus:border-2 focus:border-teal-action transition-colors text-[15px]";

function inputCls(hasError?: string) {
  return cn(inputBase, hasError ? "border-error" : "border-border");
}

// ─── Field card wrapper ───────────────────────────────────────────────────────

function FieldCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-card px-5 py-4 space-y-4">
      {children}
    </div>
  );
}

function FieldRow({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-text-secondary uppercase tracking-wide mb-2">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
    </div>
  );
}

// ─── Select dropdown ─────────────────────────────────────────────────────────

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

function MultiChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-10 px-4 rounded-full border text-[14px] font-medium transition-colors whitespace-nowrap",
        selected
          ? "bg-teal-action border-teal-action text-on-teal-action"
          : "bg-white border-border text-text-secondary hover:border-teal-action/40 hover:text-text-primary"
      )}
    >
      {label}
    </button>
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
        "flex-1 h-12 rounded-full border text-[14px] font-semibold transition-all flex items-center justify-center gap-1.5",
        active ? `${s.ring} ${s.text} ${s.bg}` : "border-border text-text-secondary bg-surface-container-low hover:border-primary/30 hover:text-text-primary"
      )}
    >
      {active && <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", s.dot)} />}
      {label}
    </button>
  );
}

// ─── Section divider ──────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[15px] font-bold text-primary tracking-tight pb-3 mb-3 border-b border-border">
      {children}
    </p>
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

// ─── Budget dropdown ──────────────────────────────────────────────────────────

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

// ─── Reminder chips config ────────────────────────────────────────────────────

const REMINDER_CHIPS: Array<{ id: Exclude<ReminderChip, null>; label: string }> = [
  { id: "tonight-7pm", label: "Tonight 7pm" },
  { id: "tomorrow-9am", label: "Tomorrow 9am" },
  { id: "tomorrow-5pm", label: "Tomorrow 5pm" },
  { id: "saturday-morning", label: "Sat morning" },
  { id: "next-monday-9am", label: "Mon 9am" },
  { id: "custom", label: "Custom…" },
];

// ─── Main form ────────────────────────────────────────────────────────────────

export function AddBuyerForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [suburbs, setSuburbs] = useState<string[]>([]);
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [bedrooms, setBedrooms] = useState("Any");
  const [landSizeMin, setLandSizeMin] = useState("Any");
  const [note, setNote] = useState("");
  const [buyerTemperature, setBuyerTemperature] = useState("");

  const [preferredContactMethod, setPreferredContactMethod] = useState("");
  const [bestTimeToContact, setBestTimeToContact] = useState("");
  const [contactConsent, setContactConsent] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [houseType, setHouseType] = useState("");
  const [bathrooms, setBathrooms] = useState("Any");
  const [carSpaces, setCarSpaces] = useState("Any");
  const [conditionPreference, setConditionPreference] = useState("");
  const [buildingSizeMin, setBuildingSizeMin] = useState("");
  const [blockPreference, setBlockPreference] = useState("");
  const [mustHaves, setMustHaves] = useState<string[]>([]);
  const [buyingTimeline, setBuyingTimeline] = useState("");
  const [buyerType, setBuyerType] = useState("");
  const [leadSource, setLeadSource] = useState("");

  const [reminder, setReminder] = useState<ReminderChip>(null);
  const [customDate, setCustomDate] = useState("");
  const [reminderContactType, setReminderContactType] = useState("");
  const [reminderNote, setReminderNote] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Enter the buyer's name";
    if (suburbs.length === 0) errs.suburbs = "Add at least one suburb";
    if (!phone.trim() && !email.trim()) errs.phone = "Enter a phone number or email address";
    const min = budgetMin ? parseInt(budgetMin) : null;
    const max = budgetMax ? parseInt(budgetMax) : null;
    if (min !== null && max !== null && min > max)
      errs.budgetMax = "Max must be greater than minimum";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  const handleSubmit = useCallback(() => {
    if (!validate()) return;

    let reminderAt: string | null = null;
    if (reminder && reminder !== "custom") {
      reminderAt = getReminderDate(reminder).toISOString();
    } else if (reminder === "custom" && customDate) {
      reminderAt = new Date(customDate).toISOString();
    }

    let landSizeValue: number | null = null;
    if (landSizeMin !== "Any") {
      landSizeValue = parseInt(landSizeMin, 10) || null;
    }

    let tempValue: "hot" | "warm" | "cold" | null = null;
    if (buyerTemperature) {
      const t = buyerTemperature.toLowerCase();
      if (t === "hot" || t === "warm" || t === "cold") tempValue = t;
    }

    startTransition(async () => {
      const result = await addBuyer({
        name: name.trim(),
        phone: phone || null,
        email: email || null,
        preferred_suburbs: suburbs,
        budget_min: budgetMin ? parseInt(budgetMin) : null,
        budget_max: budgetMax ? parseInt(budgetMax) : null,
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
        reminderAt,
        reminderContactType: reminderContactType || null,
        reminderNote: reminderNote || null,
      });

      if ("error" in result) {
        setErrors((prev) => ({ ...prev, _form: result.error }));
      } else {
        router.push("/buyers");
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    name, phone, email, suburbs, budgetMin, budgetMax, bedrooms,
    landSizeMin, note, preferredContactMethod, bestTimeToContact, contactConsent,
    propertyType, houseType, bathrooms, carSpaces, conditionPreference,
    buildingSizeMin, blockPreference, mustHaves, buyingTimeline, buyerTemperature,
    buyerType, leadSource, reminder, customDate, reminderContactType, reminderNote,
    router,
  ]);

  const toggleMustHave = useCallback((item: string) => {
    setMustHaves((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  }, []);

  const MUST_HAVES_OPTIONS = [
    "Pool", "Double garage", "Study/home office", "Alfresco/outdoor living",
    "Solar panels", "Granny flat", "Workshop", "Side access",
    "North-facing", "Large garden", "Street appeal", "Open plan living",
  ];

  // Footer height depends on whether reminder is selected
  const footerPb = reminder ? "pb-[320px]" : "pb-[240px]";

  return (
    <div className="h-[100dvh] bg-background flex flex-col overflow-hidden">
      <BottomNav />

      {/* ── Standard white app header ── */}
      <header className="shrink-0 bg-white z-20 border-b border-border">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-center">
          <h1 className="text-base font-semibold text-text-primary tracking-tight">
            Add Buyer
          </h1>
        </div>
      </header>

      {/* ── Scrollable content ── */}
      <div className={cn("flex-1 min-h-0 overflow-y-auto", footerPb)}>
        <div className="max-w-5xl mx-auto px-4 lg:px-6 py-5">

          {errors._form && (
            <div className="px-4 py-3 rounded-xl bg-error/10 border border-error/20 text-sm text-error mb-4">
              {errors._form}
            </div>
          )}

          {/* ── 2-column on desktop, single column on mobile ── */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-6 lg:items-start space-y-4 lg:space-y-0">

            {/* Left column: identity + status + notes */}
            <div className="space-y-4">
              <FieldCard>
                <SectionHeader icon={<User size={14} />} title="Identity" />
                <FieldRow label="Buyer Name" error={errors.name}>
                  <input
                    autoFocus
                    type="text"
                    placeholder="First and last name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputCls(errors.name)}
                  />
                </FieldRow>

                <FieldRow label="Phone">
                  <input
                    type="tel"
                    placeholder="0412 345 678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onBlur={(e) => setPhone(formatPhone(e.target.value))}
                    className={inputCls()}
                  />
                </FieldRow>

                <FieldRow label="Email">
                  <input
                    type="email"
                    placeholder="name@email.com"
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
              </FieldCard>

              <FieldCard>
                <SectionHeader icon={<BarChart2 size={14} />} title="Status" />
                <FieldRow label="Timeline">
                  <SelectField
                    options={["Ready now", "0–3 months", "3–6 months", "6+ months", "Just researching"]}
                    value={buyingTimeline}
                    onChange={setBuyingTimeline}
                  />
                </FieldRow>
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
              </FieldCard>

              <FieldCard>
                <SectionHeader icon={<FileText size={14} />} title="Agent Notes" />
                <FieldRow label="Notes">
                  <textarea
                    placeholder="Any extra details about this buyer…"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-surface-container-low text-text-primary placeholder:text-outline focus:outline-none focus:ring-0 focus:border-2 focus:border-teal-action transition-colors resize-none text-[15px]"
                  />
                </FieldRow>
              </FieldCard>
            </div>

            {/* Right column: requirements + preferences */}
            <div className="space-y-4">
              <FieldCard>
                <SectionHeader icon={<Search size={14} />} title="Property Search" />

                <FieldRow label="Preferred Suburbs" error={errors.suburbs}>
                  <SuburbCombobox
                    value={suburbs}
                    onChange={setSuburbs}
                    placeholder="Search and add suburbs…"
                    error={errors.suburbs}
                  />
                </FieldRow>

                <div className="grid grid-cols-2 gap-3">
                  <FieldRow label="Min Budget">
                    <BudgetSelect value={budgetMin} onChange={setBudgetMin} />
                  </FieldRow>
                  <FieldRow label="Max Budget" error={errors.budgetMax}>
                    <BudgetSelect value={budgetMax} onChange={setBudgetMax} />
                  </FieldRow>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <FieldRow label="Property type">
                    <SelectField options={["House", "Apartment/Unit", "Townhouse", "Land", "Rural"]} value={propertyType} onChange={setPropertyType} />
                  </FieldRow>
                  <FieldRow label="House style">
                    <SelectField options={["Freestanding", "Semi-detached", "Terrace", "Villa"]} value={houseType} onChange={setHouseType} />
                  </FieldRow>
                </div>

                <FieldRow label="Condition">
                  <SelectField options={["Any", "Established", "New/Modern", "Renovation project"]} value={conditionPreference} onChange={setConditionPreference} />
                </FieldRow>

                <FieldRow label="Bedrooms">
                  <SegmentedControl
                    options={["Any", "1+", "2+", "3+", "4+", "5+"]}
                    value={bedrooms}
                    onChange={setBedrooms}
                  />
                </FieldRow>

                <div className="grid grid-cols-2 gap-3">
                  <FieldRow label="Bathrooms">
                    <SegmentedControl options={["Any", "1+", "2+", "3+"]} value={bathrooms} onChange={setBathrooms} />
                  </FieldRow>
                  <FieldRow label="Car spaces">
                    <SegmentedControl options={["Any", "1+", "2+", "3+"]} value={carSpaces} onChange={setCarSpaces} />
                  </FieldRow>
                </div>

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

                <div className="grid grid-cols-2 gap-3">
                  <FieldRow label="Building size min (sq)">
                    <div className="relative">
                      <input type="text" inputMode="numeric" placeholder="e.g. 25" value={buildingSizeMin}
                        onChange={(e) => setBuildingSizeMin(e.target.value.replace(/[^0-9]/g, ""))}
                        className={cn(inputCls(), "pr-12")} />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-outline text-sm pointer-events-none">sq</span>
                    </div>
                  </FieldRow>
                  <FieldRow label="Block preference">
                    <SelectField options={["Flat", "Sloped", "Corner", "Any"]} value={blockPreference} onChange={setBlockPreference} />
                  </FieldRow>
                </div>
              </FieldCard>

              <FieldCard>
                <SectionLabel>Must-Haves</SectionLabel>
                <div className="flex flex-wrap gap-2">
                  {MUST_HAVES_OPTIONS.map((item) => (
                    <MultiChip key={item} label={item} selected={mustHaves.includes(item)} onClick={() => toggleMustHave(item)} />
                  ))}
                </div>
              </FieldCard>
            </div>

          </div>
        </div>
      </div>

      {/* ── Sticky footer ── */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-60 bg-white border-t border-border shadow-[0_-4px_16px_rgba(15,28,44,0.06)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6 pt-3 pb-5 space-y-3">
          {/* Reminder section */}
          <div>
            <p className="text-[12px] font-bold text-text-secondary uppercase tracking-wide mb-2.5">
              Set a follow-up reminder
            </p>
            <div className="flex flex-wrap gap-2">
              {REMINDER_CHIPS.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setReminder((r) => (r === chip.id ? null : chip.id))}
                  className={cn(
                    "h-9 px-3 rounded-full border text-sm font-medium transition-colors",
                    reminder === chip.id
                      ? "bg-primary border-primary text-white"
                      : "bg-surface-container-low border-border text-text-secondary hover:border-primary/40"
                  )}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {reminder && reminder !== "custom" && (
              <div className="mt-2.5">
                <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wide mb-2">Follow up type</p>
                <div className="flex flex-wrap gap-2">
                {["Call", "SMS", "Email", "Visit"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setReminderContactType((prev) => prev === t ? "" : t)}
                    className={cn(
                      "h-8 px-3 rounded-full border text-xs font-medium transition-colors",
                      reminderContactType === t
                        ? "bg-teal-action border-teal-action text-on-teal-action"
                        : "bg-surface-container-low border-border text-text-secondary hover:border-teal-action/40"
                    )}
                  >
                    {t}
                  </button>
                ))}
                </div>
              </div>
            )}

            {reminder === "custom" && (
              <input
                type="datetime-local"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className={cn(inputCls(), "mt-2.5")}
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link
              href="/buyers"
              className="flex-1 h-14 flex items-center justify-center text-sm font-semibold text-text-secondary rounded-2xl border border-border hover:bg-surface-container transition-colors"
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending || !name.trim()}
              className="flex-1 h-14 rounded-2xl bg-teal-action text-on-teal-action font-bold text-[15px] tracking-tight transition-opacity disabled:opacity-40 shadow-[0_4px_16px_rgba(0,106,98,0.35)]"
            >
              {isPending
                ? "Saving…"
                : reminder
                ? "Save buyer & set reminder"
                : "Save buyer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

