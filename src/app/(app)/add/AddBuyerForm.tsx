"use client";

import {
  useState,
  useTransition,
  useRef,
  useEffect,
  useCallback,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, BarChart2, Search, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SuburbCombobox } from "@/components/ui/suburb-combobox";
import { formatPhone, parseAmount, formatAmount } from "@/lib/format";
import {
  getReminderDate,
  getReminderLabel,
  type ReminderChip,
} from "@/lib/reminder-utils";
import { addBuyer } from "./actions";

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

// ─── Chip components ──────────────────────────────────────────────────────────

function SelectChip({
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

// ─── Section divider ──────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.1em] mb-2">
      {children}
    </p>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <span className="text-teal-action">{icon}</span>
      <p className="text-[12px] font-bold text-text-secondary uppercase tracking-wider">{title}</p>
    </div>
  );
}

// ─── Animated expand ──────────────────────────────────────────────────────────

function AnimatedExpand({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) {
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
  const [showMore, setShowMore] = useState(false);

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
    const min = parseAmount(budgetMin);
    const max = parseAmount(budgetMax);
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
    <div className="min-h-screen bg-background flex flex-col">

      {/* ── Navy sticky header ── */}
      <header className="sticky top-0 bg-primary z-20 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link
            href="/buyers"
            className="text-white/70 hover:text-white text-sm font-medium w-16 transition-colors"
          >
            Cancel
          </Link>
          <h1 className="text-base font-semibold text-white tracking-tight">
            Add Buyer
          </h1>
          <div className="w-16" />
        </div>
      </header>

      {/* ── Scrollable content ── */}
      <div className={cn("flex-1 overflow-y-auto", footerPb)}>
        <div className="max-w-5xl mx-auto px-4 lg:px-6 py-5">

          {errors._form && (
            <div className="px-4 py-3 rounded-xl bg-error/10 border border-error/20 text-sm text-error mb-4">
              {errors._form}
            </div>
          )}

          {/* ── 2-column on desktop, single column on mobile ── */}
          <div className="lg:grid lg:grid-cols-[1fr_400px] lg:gap-6 lg:items-start space-y-4 lg:space-y-0">

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

                <div className="grid grid-cols-2 gap-3">
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
              </FieldCard>

              <FieldCard>
                <SectionHeader icon={<BarChart2 size={14} />} title="Status" />
                <SectionLabel>Buyer Status</SectionLabel>
                <ChipFieldInline
                  label="Timeline"
                  options={["Ready now", "0–3 months", "3–6 months", "6+ months", "Just researching"]}
                  value={buyingTimeline}
                  onChange={setBuyingTimeline}
                />
                <ChipFieldInline
                  label="Buyer type"
                  options={["First home buyer", "Investor", "Upgrader", "Downsizer", "Interstate"]}
                  value={buyerType}
                  onChange={setBuyerType}
                />
                <ChipFieldInline
                  label="Lead source"
                  options={["Referral", "Database", "Open home", "Social media", "Website", "Other"]}
                  value={leadSource}
                  onChange={setLeadSource}
                />
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

            {/* Right column: property criteria + expanded (sticky on desktop) */}
            <div className="lg:sticky lg:top-[4.5rem] space-y-4">
              <FieldCard>
                <SectionHeader icon={<Search size={14} />} title="Requirements" />
                <FieldRow label="Preferred Suburbs" error={errors.suburbs}>
                  <SuburbCombobox
                    value={suburbs}
                    onChange={setSuburbs}
                    placeholder="Search and add suburbs…"
                    error={errors.suburbs}
                  />
                </FieldRow>

                <FieldRow label="Budget" error={errors.budgetMax}>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline text-sm pointer-events-none">$</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Min"
                        value={budgetMin}
                        onChange={(e) => setBudgetMin(e.target.value.replace(/[^0-9]/g, ""))}
                        onBlur={(e) => setBudgetMin(formatAmount(e.target.value))}
                        className={cn(inputCls(), "pl-8")}
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline text-sm pointer-events-none">$</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Max"
                        value={budgetMax}
                        onChange={(e) => setBudgetMax(e.target.value.replace(/[^0-9]/g, ""))}
                        onBlur={(e) => setBudgetMax(formatAmount(e.target.value))}
                        className={cn(inputCls(errors.budgetMax), "pl-8")}
                      />
                    </div>
                  </div>
                </FieldRow>

                <FieldRow label="Bedrooms">
                  <SegmentedControl
                    options={["Any", "1+", "2+", "3+", "4+", "5+"]}
                    value={bedrooms}
                    onChange={setBedrooms}
                  />
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
              </FieldCard>

              {/* Expand toggle */}
              <button
                type="button"
                onClick={() => setShowMore((v) => !v)}
                className="w-full flex items-center justify-center gap-1.5 text-sm font-semibold text-teal-action py-1"
              >
                {showMore ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {showMore ? "Hide details" : "Show more details"}
              </button>

              <AnimatedExpand open={showMore}>
                <div className="space-y-4 pt-2">
                  <FieldCard>
                    <SectionLabel>Contact Preferences</SectionLabel>
                    <ChipFieldInline label="Preferred method" options={["Call", "SMS", "Email", "WhatsApp"]} value={preferredContactMethod} onChange={setPreferredContactMethod} />
                    <ChipFieldInline label="Best time" options={["Morning", "Afternoon", "Evening", "Weekends"]} value={bestTimeToContact} onChange={setBestTimeToContact} />
                    <ChipFieldInline label="Consent" options={["Consent given", "No consent", "Unknown"]} value={contactConsent} onChange={setContactConsent} />
                  </FieldCard>

                  <FieldCard>
                    <SectionLabel>Property Preferences</SectionLabel>
                    <ChipFieldInline label="Type" options={["House", "Apartment/Unit", "Townhouse", "Land", "Rural"]} value={propertyType} onChange={setPropertyType} />
                    <ChipFieldInline label="House style" options={["Freestanding", "Semi-detached", "Terrace", "Villa"]} value={houseType} onChange={setHouseType} />
                    <div>
                      <p className="text-sm font-medium text-text-secondary mb-2">Bathrooms</p>
                      <SegmentedControl options={["Any", "1+", "2+", "3+"]} value={bathrooms} onChange={setBathrooms} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-secondary mb-2">Car spaces</p>
                      <SegmentedControl options={["Any", "1+", "2+", "3+"]} value={carSpaces} onChange={setCarSpaces} />
                    </div>
                    <ChipFieldInline label="Condition" options={["Any", "Established", "New/Modern", "Renovation project"]} value={conditionPreference} onChange={setConditionPreference} />
                  </FieldCard>

                  <FieldCard>
                    <SectionLabel>Size Requirements</SectionLabel>
                    <div>
                      <p className="text-sm font-medium text-text-secondary mb-2">Building size min (squares)</p>
                      <div className="relative">
                        <input type="text" inputMode="numeric" placeholder="e.g. 25" value={buildingSizeMin}
                          onChange={(e) => setBuildingSizeMin(e.target.value.replace(/[^0-9]/g, ""))}
                          className={cn(inputCls(), "pr-12")} />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-outline text-sm pointer-events-none">sq</span>
                      </div>
                    </div>
                    <ChipFieldInline label="Block preference" options={["Flat", "Sloped", "Corner", "Any"]} value={blockPreference} onChange={setBlockPreference} />
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
              </AnimatedExpand>
            </div>

          </div>
        </div>
      </div>

      {/* ── Sticky footer ── */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-56 bg-white border-t border-border shadow-[0_-4px_16px_rgba(15,28,44,0.06)]">
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
              <div className="mt-2.5 flex flex-wrap gap-2">
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

          {/* Save button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full h-14 rounded-2xl bg-teal-action text-on-teal-action font-bold text-[15px] tracking-tight transition-opacity disabled:opacity-60 shadow-[0_4px_16px_rgba(0,106,98,0.35)]"
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
  );
}

// ─── Inline chip field (used in expanded sections) ────────────────────────────

function ChipFieldInline({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-text-secondary mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <SelectChip
            key={opt}
            label={opt}
            selected={value === opt}
            onClick={() => onChange(value === opt ? "" : opt)}
          />
        ))}
      </div>
    </div>
  );
}
