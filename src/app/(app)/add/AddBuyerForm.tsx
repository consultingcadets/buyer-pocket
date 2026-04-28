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

// ─── Shared input style helpers ──────────────────────────────────────────────

const inputBase =
  "w-full h-12 px-4 rounded-lg border bg-white text-text-primary placeholder:text-[#A0A3AB] focus:outline-none focus:ring-0 focus:border-2 focus:border-accent transition-colors";

function inputClassName(hasError?: string) {
  return cn(inputBase, hasError ? "border-error" : "border-border");
}

// ─── Chip components ─────────────────────────────────────────────────────────

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
        "h-9 px-4 rounded-full border text-sm font-medium transition-colors",
        selected
          ? "bg-primary border-primary text-white"
          : "bg-white border-border text-text-secondary hover:border-primary/30"
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
        "h-9 px-4 rounded-full border text-sm font-medium transition-colors",
        selected
          ? "bg-primary border-primary text-white"
          : "bg-white border-border text-text-secondary hover:border-primary/30"
      )}
    >
      {label}
    </button>
  );
}

// ─── Section group wrapper ────────────────────────────────────────────────────

function SectionGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg bg-surface-container p-4 space-y-4">
      <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
        {title}
      </p>
      {children}
    </div>
  );
}

// ─── Chip row field ───────────────────────────────────────────────────────────

function ChipField({
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

// ─── Animated expand ─────────────────────────────────────────────────────────

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
    if (open) {
      setHeight(ref.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [open]);

  // Re-measure when children change (e.g. chips added)
  useEffect(() => {
    if (open && ref.current) {
      setHeight(ref.current.scrollHeight);
    }
  });

  return (
    <div
      style={{ height, overflow: "hidden", transition: "height 300ms ease" }}
    >
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

  // Required / primary fields
  const [name, setName] = useState("");
  const [contactMode, setContactMode] = useState<"phone" | "email">("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [suburbs, setSuburbs] = useState<string[]>([]);
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [bedrooms, setBedrooms] = useState("Any");
  const [landSizeMin, setLandSizeMin] = useState("Any");
  const [note, setNote] = useState("");

  // Show-more toggle
  const [showMore, setShowMore] = useState(false);

  // Expanded / optional fields
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
  const [buyerTemperature, setBuyerTemperature] = useState("");
  const [buyerType, setBuyerType] = useState("");
  const [leadSource, setLeadSource] = useState("");

  // Reminder
  const [reminder, setReminder] = useState<ReminderChip>(null);
  const [customDate, setCustomDate] = useState("");
  const [reminderContactType, setReminderContactType] = useState("");
  const [reminderNote, setReminderNote] = useState("");

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ─── Validation ──────────────────────────────────────────────────────────

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Enter the buyer's name";
    if (contactMode === "phone" && !phone.trim())
      errs.contact =
        "Add a phone number or email so you can contact them";
    if (contactMode === "email" && !email.trim())
      errs.contact =
        "Add a phone number or email so you can contact them";
    if (suburbs.length === 0) errs.suburbs = "Add at least one suburb";
    const min = parseAmount(budgetMin);
    const max = parseAmount(budgetMax);
    if (min !== null && max !== null && min > max)
      errs.budgetMax = "Max must be greater than minimum";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // ─── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = useCallback(() => {
    if (!validate()) return;

    let reminderAt: string | null = null;
    if (reminder && reminder !== "custom") {
      reminderAt = getReminderDate(reminder).toISOString();
    } else if (reminder === "custom" && customDate) {
      reminderAt = new Date(customDate).toISOString();
    }

    // Parse land size
    let landSizeValue: number | null = null;
    if (landSizeMin !== "Any") {
      landSizeValue = parseInt(landSizeMin, 10) || null;
    }

    // Normalise buyer temperature label
    let tempValue: "hot" | "warm" | "cold" | null = null;
    if (buyerTemperature) {
      const t = buyerTemperature.toLowerCase().replace(" 🔥", "");
      if (t === "hot" || t === "warm" || t === "cold") tempValue = t;
    }

    startTransition(async () => {
      const result = await addBuyer({
        name: name.trim(),
        phone: contactMode === "phone" ? phone || null : null,
        email: contactMode === "email" ? email || null : null,
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
        console.error(result.error);
        setErrors((prev) => ({ ...prev, _form: result.error }));
      } else {
        router.push("/buyers");
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    name, contactMode, phone, email, suburbs, budgetMin, budgetMax, bedrooms,
    landSizeMin, note, preferredContactMethod, bestTimeToContact, contactConsent,
    propertyType, houseType, bathrooms, carSpaces, conditionPreference,
    buildingSizeMin, blockPreference, mustHaves, buyingTimeline, buyerTemperature,
    buyerType, leadSource, reminder, customDate, reminderContactType, reminderNote,
    router,
  ]);

  // ─── Must-haves multi-select ──────────────────────────────────────────────

  const toggleMustHave = useCallback((item: string) => {
    setMustHaves((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  }, []);

  const MUST_HAVES_OPTIONS = [
    "Pool",
    "Double garage",
    "Study/home office",
    "Alfresco/outdoor living",
    "Solar panels",
    "Granny flat",
    "Workshop",
    "Side access",
    "North-facing",
    "Large garden",
    "Street appeal",
    "Open plan living",
  ];

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sticky header */}
      <header className="sticky top-0 bg-surface z-10 border-b border-border">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/buyers"
            className="text-accent text-sm font-medium w-16"
          >
            Cancel
          </Link>
          <h1 className="text-base font-semibold text-text-primary">
            Add Buyer
          </h1>
          <div className="w-16" />
        </div>
      </header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-[280px]">
        <div className="max-w-2xl mx-auto px-6 py-6 space-y-6">

          {/* Form-level error */}
          {errors._form && (
            <div className="px-4 py-3 rounded-lg bg-error/10 border border-error/20 text-sm text-error">
              {errors._form}
            </div>
          )}

          {/* Buyer Name */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Buyer Name
            </label>
            <input
              autoFocus
              type="text"
              placeholder="First and last name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={cn(
                inputBase,
                errors.name ? "border-error" : "border-border"
              )}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-error">{errors.name}</p>
            )}
          </div>

          {/* Phone / Email toggle */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-text-secondary">
                {contactMode === "phone" ? "Phone" : "Email"}
              </label>
              <button
                type="button"
                onClick={() =>
                  setContactMode((m) => (m === "phone" ? "email" : "phone"))
                }
                className="text-sm font-medium text-accent"
              >
                {contactMode === "phone"
                  ? "Use email instead"
                  : "Use phone instead"}
              </button>
            </div>
            {contactMode === "phone" ? (
              <input
                type="tel"
                placeholder="0412 345 678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onBlur={(e) => setPhone(formatPhone(e.target.value))}
                className={inputClassName(errors.contact)}
              />
            ) : (
              <input
                type="email"
                placeholder="name@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClassName(errors.contact)}
              />
            )}
            {errors.contact && (
              <p className="mt-1 text-xs text-error">{errors.contact}</p>
            )}
          </div>

          {/* Suburbs */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Preferred Suburbs
            </label>
            <SuburbCombobox
              value={suburbs}
              onChange={setSuburbs}
              placeholder="Search and add suburbs…"
              error={errors.suburbs}
            />
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Budget
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary text-sm pointer-events-none">
                  $
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Min"
                  value={budgetMin}
                  onChange={(e) =>
                    setBudgetMin(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  onBlur={(e) => setBudgetMin(formatAmount(e.target.value))}
                  className={cn(inputBase, "pl-8 border-border")}
                />
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary text-sm pointer-events-none">
                  $
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Max"
                  value={budgetMax}
                  onChange={(e) =>
                    setBudgetMax(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  onBlur={(e) => setBudgetMax(formatAmount(e.target.value))}
                  className={cn(
                    inputBase,
                    "pl-8",
                    errors.budgetMax ? "border-error" : "border-border"
                  )}
                />
              </div>
            </div>
            {errors.budgetMax && (
              <p className="mt-1 text-xs text-error">{errors.budgetMax}</p>
            )}
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Bedrooms
            </label>
            <SegmentedControl
              options={["Any", "1+", "2+", "3+", "4+", "5+"]}
              value={bedrooms}
              onChange={setBedrooms}
            />
          </div>

          {/* Land Size */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Land Size (min)
            </label>
            <div className="overflow-x-auto -mx-6 px-6">
              <div className="min-w-max">
                <SegmentedControl
                  options={["Any", "300m²", "400m²", "500m²", "600m²", "700m²+"]}
                  value={landSizeMin}
                  onChange={setLandSizeMin}
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Notes
            </label>
            <textarea
              placeholder="Any extra details about this buyer…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-border bg-white text-text-primary placeholder:text-[#A0A3AB] focus:outline-none focus:ring-0 focus:border-2 focus:border-accent transition-colors resize-none"
            />
          </div>

          {/* Expand toggle */}
          <button
            type="button"
            onClick={() => setShowMore((v) => !v)}
            className="text-accent text-sm font-medium"
          >
            {showMore ? "− Hide details" : "+ Add more details"}
          </button>

          {/* Expanded section */}
          <AnimatedExpand open={showMore}>
            <div className="space-y-4 pt-2">
              {/* Contact section */}
              <SectionGroup title="Contact Preferences">
                <ChipField
                  label="Preferred contact method"
                  options={["Call", "SMS", "Email", "WhatsApp"]}
                  value={preferredContactMethod}
                  onChange={setPreferredContactMethod}
                />
                <ChipField
                  label="Best time to contact"
                  options={["Morning", "Afternoon", "Evening", "Weekends"]}
                  value={bestTimeToContact}
                  onChange={setBestTimeToContact}
                />
                <ChipField
                  label="Contact consent"
                  options={["Consent given", "No consent", "Unknown"]}
                  value={contactConsent}
                  onChange={setContactConsent}
                />
              </SectionGroup>

              {/* Property section */}
              <SectionGroup title="Property Preferences">
                <ChipField
                  label="Property type"
                  options={[
                    "House",
                    "Apartment/Unit",
                    "Townhouse",
                    "Land",
                    "Rural",
                  ]}
                  value={propertyType}
                  onChange={setPropertyType}
                />
                <ChipField
                  label="House type"
                  options={[
                    "Freestanding",
                    "Semi-detached",
                    "Terrace",
                    "Villa",
                  ]}
                  value={houseType}
                  onChange={setHouseType}
                />
                <div>
                  <p className="text-sm font-medium text-text-secondary mb-2">
                    Bathrooms
                  </p>
                  <SegmentedControl
                    options={["Any", "1+", "2+", "3+"]}
                    value={bathrooms}
                    onChange={setBathrooms}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-secondary mb-2">
                    Car spaces
                  </p>
                  <SegmentedControl
                    options={["Any", "1+", "2+", "3+"]}
                    value={carSpaces}
                    onChange={setCarSpaces}
                  />
                </div>
                <ChipField
                  label="Condition"
                  options={[
                    "Any",
                    "Established",
                    "New/Modern",
                    "Renovation project",
                  ]}
                  value={conditionPreference}
                  onChange={setConditionPreference}
                />
              </SectionGroup>

              {/* Size section */}
              <SectionGroup title="Size Requirements">
                <div>
                  <p className="text-sm font-medium text-text-secondary mb-2">
                    Building size min (squares)
                  </p>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="e.g. 25"
                      value={buildingSizeMin}
                      onChange={(e) =>
                        setBuildingSizeMin(
                          e.target.value.replace(/[^0-9]/g, "")
                        )
                      }
                      className={cn(inputBase, "border-border pr-12")}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary text-sm pointer-events-none">
                      sq
                    </span>
                  </div>
                </div>
                <ChipField
                  label="Block preference"
                  options={["Flat", "Sloped", "Corner", "Any"]}
                  value={blockPreference}
                  onChange={setBlockPreference}
                />
              </SectionGroup>

              {/* Must-haves section */}
              <SectionGroup title="Must-Haves">
                <div className="flex flex-wrap gap-2">
                  {MUST_HAVES_OPTIONS.map((item) => (
                    <MultiChip
                      key={item}
                      label={item}
                      selected={mustHaves.includes(item)}
                      onClick={() => toggleMustHave(item)}
                    />
                  ))}
                </div>
              </SectionGroup>

              {/* Status section */}
              <SectionGroup title="Buyer Status">
                <ChipField
                  label="Buying timeline"
                  options={[
                    "Ready now",
                    "1-3 months",
                    "3-6 months",
                    "6-12 months",
                    "12+ months",
                  ]}
                  value={buyingTimeline}
                  onChange={setBuyingTimeline}
                />
                <ChipField
                  label="Buyer temperature"
                  options={["Hot 🔥", "Warm", "Cold"]}
                  value={buyerTemperature}
                  onChange={setBuyerTemperature}
                />
                <ChipField
                  label="Buyer type"
                  options={[
                    "First home buyer",
                    "Investor",
                    "Upgrader",
                    "Downsizer",
                    "Interstate",
                  ]}
                  value={buyerType}
                  onChange={setBuyerType}
                />
                <ChipField
                  label="Lead source"
                  options={[
                    "Referral",
                    "Database",
                    "Open home",
                    "Social media",
                    "Website",
                    "Other",
                  ]}
                  value={leadSource}
                  onChange={setLeadSource}
                />
              </SectionGroup>
            </div>
          </AnimatedExpand>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border">
        <div className="max-w-2xl mx-auto px-6 pt-4 pb-6 space-y-4">
          {/* Reminder section */}
          <div>
            <p className="text-sm font-medium text-text-secondary mb-3">
              Set a follow-up reminder
            </p>
            <div className="flex flex-wrap gap-2">
              {REMINDER_CHIPS.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() =>
                    setReminder((r) => (r === chip.id ? null : chip.id))
                  }
                  className={cn(
                    "h-9 px-3 rounded-full border text-sm font-medium transition-colors",
                    reminder === chip.id
                      ? "bg-primary border-primary text-white"
                      : "bg-white border-border text-text-secondary hover:border-primary/30"
                  )}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Follow-up type chips */}
            {reminder && reminder !== "custom" && (
              <div className="mt-3">
                <p className="text-xs text-text-secondary mb-2">
                  What kind of follow-up?
                </p>
                <div className="flex gap-2 flex-wrap">
                  {["Call", "SMS", "Email", "Visit"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() =>
                        setReminderContactType((prev) =>
                          prev === t ? "" : t
                        )
                      }
                      className={cn(
                        "h-8 px-3 rounded-full border text-xs font-medium transition-colors",
                        reminderContactType === t
                          ? "bg-primary border-primary text-white"
                          : "bg-white border-border text-text-secondary hover:border-primary/30"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom datetime picker */}
            {reminder === "custom" && (
              <input
                type="datetime-local"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className={cn(
                  inputBase,
                  "border-border mt-3"
                )}
              />
            )}
          </div>

          {/* Save button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full h-14 rounded-lg bg-secondary text-white font-semibold text-base transition-opacity disabled:opacity-60"
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
