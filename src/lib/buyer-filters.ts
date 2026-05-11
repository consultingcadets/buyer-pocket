export const PAGE_SIZE = 20;

export type SortOption =
  | "recently_added"
  | "last_updated"
  | "last_contacted"
  | "next_reminder"
  | "temperature";

export type BuyerFilters = {
  search?: string;
  suburbs?: string[];
  budgetMin?: number | null;
  budgetMax?: number | null;
  bedrooms?: string;
  landSizeMin?: string;
  propertyTypes?: string[];
  temperatures?: string[];
  buyingTimeline?: string;
  leadStatus?: string;
  reminderDue?: "any" | "today" | "this_week" | "overdue" | "none";
  lastContacted?: "any" | "this_week" | "this_month" | "over_month" | "never";
  dateAdded?: "any" | "last_week" | "last_fortnight" | "last_month" | "last_3_months";
};

export type SortState = { field: SortOption; label: string };

export const SORT_OPTIONS: SortState[] = [
  { field: "recently_added", label: "Recently added" },
  { field: "last_updated", label: "Last updated" },
  { field: "last_contacted", label: "Last contacted" },
  { field: "next_reminder", label: "Next reminder" },
  { field: "temperature", label: "Buyer temperature" },
];

export const BEDROOMS_OPTIONS = ["Any", "1+", "2+", "3+", "4+", "5+"];
export const LAND_SIZE_OPTIONS = ["Any", "300m²", "400m²", "500m²", "600m²", "700m²+"];
export const PROPERTY_TYPE_OPTIONS = ["House", "Townhouse", "Apartment/Unit", "Land", "Rural"];
export const TEMPERATURE_OPTIONS = ["hot", "warm", "cold"];
export const BUYING_TIMELINE_OPTIONS = [
  "Ready now",
  "1–3 months",
  "3–6 months",
  "6–12 months",
  "12+ months",
];
export const LEAD_STATUS_OPTIONS = [
  "New Lead",
  "Active",
  "Follow-up",
  "On Hold",
  "Under Contract",
  "Lost",
];
export const REMINDER_DUE_OPTIONS = [
  { value: "any", label: "Any" },
  { value: "today", label: "Today" },
  { value: "this_week", label: "This week" },
  { value: "overdue", label: "Overdue" },
  { value: "none", label: "None set" },
] as const;
export const LAST_CONTACTED_OPTIONS = [
  { value: "any", label: "Any" },
  { value: "this_week", label: "This week" },
  { value: "this_month", label: "This month" },
  { value: "over_month", label: "Over a month" },
  { value: "never", label: "Never" },
] as const;

export const DATE_ADDED_OPTIONS = [
  { value: "any", label: "Any time" },
  { value: "last_week", label: "Last week" },
  { value: "last_fortnight", label: "Last fortnight" },
  { value: "last_month", label: "Last month" },
  { value: "last_3_months", label: "Last 3 months" },
] as const;

export function getActiveFilterCount(filters: BuyerFilters): number {
  let n = 0;
  if (filters.suburbs?.length) n++;
  if (filters.budgetMin != null || filters.budgetMax != null) n++;
  if (filters.bedrooms && filters.bedrooms !== "Any") n++;
  if (filters.landSizeMin && filters.landSizeMin !== "Any") n++;
  if (filters.propertyTypes?.length) n++;
  if (filters.temperatures?.length) n++;
  if (filters.buyingTimeline) n++;
  if (filters.leadStatus) n++;
  if (filters.reminderDue && filters.reminderDue !== "any") n++;
  if (filters.lastContacted && filters.lastContacted !== "any") n++;
  if (filters.dateAdded && filters.dateAdded !== "any") n++;
  return n;
}

export type ActiveChip = {
  id: string;
  label: string;
  remove: (f: BuyerFilters) => BuyerFilters;
};

export function formatBudgetLabel(
  min?: number | null,
  max?: number | null
): string {
  const fmt = (v: number) =>
    v >= 1_000_000
      ? `$${(v / 1_000_000) % 1 === 0 ? v / 1_000_000 : (v / 1_000_000).toFixed(1)}M`
      : `$${Math.round(v / 1000)}k`;
  if (min != null && max != null) return `${fmt(min)}–${fmt(max)}`;
  if (min != null) return `>${fmt(min)}`;
  if (max != null) return `<${fmt(max)}`;
  return "";
}

export function filtersToChips(filters: BuyerFilters): ActiveChip[] {
  const chips: ActiveChip[] = [];

  (filters.suburbs ?? []).forEach((s) => {
    const label = s.split(",")[0].trim();
    chips.push({
      id: `suburb-${s}`,
      label,
      remove: (f) => ({ ...f, suburbs: f.suburbs?.filter((x) => x !== s) }),
    });
  });

  if (filters.budgetMin != null || filters.budgetMax != null) {
    chips.push({
      id: "budget",
      label: formatBudgetLabel(filters.budgetMin, filters.budgetMax),
      remove: (f) => ({ ...f, budgetMin: null, budgetMax: null }),
    });
  }

  if (filters.bedrooms && filters.bedrooms !== "Any") {
    chips.push({
      id: "bedrooms",
      label: `${filters.bedrooms} bed`,
      remove: (f) => ({ ...f, bedrooms: undefined }),
    });
  }

  if (filters.landSizeMin && filters.landSizeMin !== "Any") {
    chips.push({
      id: "land",
      label: filters.landSizeMin,
      remove: (f) => ({ ...f, landSizeMin: undefined }),
    });
  }

  (filters.propertyTypes ?? []).forEach((t) => {
    chips.push({
      id: `type-${t}`,
      label: t,
      remove: (f) => ({
        ...f,
        propertyTypes: f.propertyTypes?.filter((x) => x !== t),
      }),
    });
  });

  (filters.temperatures ?? []).forEach((t) => {
    chips.push({
      id: `temp-${t}`,
      label: t === "hot" ? "Hot Buyers" : t === "warm" ? "Warm Buyers" : "Cold Buyers",
      remove: (f) => ({
        ...f,
        temperatures: f.temperatures?.filter((x) => x !== t),
      }),
    });
  });

  if (filters.buyingTimeline) {
    chips.push({
      id: "timeline",
      label: filters.buyingTimeline,
      remove: (f) => ({ ...f, buyingTimeline: undefined }),
    });
  }

  if (filters.leadStatus) {
    chips.push({
      id: "leadstatus",
      label: filters.leadStatus,
      remove: (f) => ({ ...f, leadStatus: undefined }),
    });
  }

  if (filters.reminderDue && filters.reminderDue !== "any") {
    const opt = REMINDER_DUE_OPTIONS.find((o) => o.value === filters.reminderDue);
    chips.push({
      id: "reminder",
      label: `Reminder: ${opt?.label ?? filters.reminderDue}`,
      remove: (f) => ({ ...f, reminderDue: "any" }),
    });
  }

  if (filters.lastContacted && filters.lastContacted !== "any") {
    const opt = LAST_CONTACTED_OPTIONS.find((o) => o.value === filters.lastContacted);
    chips.push({
      id: "contacted",
      label: `Contacted: ${opt?.label ?? filters.lastContacted}`,
      remove: (f) => ({ ...f, lastContacted: "any" }),
    });
  }

  if (filters.dateAdded && filters.dateAdded !== "any") {
    const opt = DATE_ADDED_OPTIONS.find((o) => o.value === filters.dateAdded);
    chips.push({
      id: "dateadded",
      label: `Added: ${opt?.label ?? filters.dateAdded}`,
      remove: (f) => ({ ...f, dateAdded: "any" }),
    });
  }

  return chips;
}
