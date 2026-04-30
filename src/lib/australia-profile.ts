/** IANA zones for Australia — one value per row; DST is applied by the zone, not a separate “_DST” id. */
export const AU_TIMEZONE_OPTIONS: { value: string; label: string }[] = [
  { value: "Australia/Sydney", label: "Sydney / Melbourne (AEST/AEDT)" },
  { value: "Australia/Melbourne", label: "Melbourne (AEST/AEDT)" },
  { value: "Australia/Brisbane", label: "Brisbane (AEST)" },
  { value: "Australia/Adelaide", label: "Adelaide (ACST/ACDT)" },
  { value: "Australia/Perth", label: "Perth (AWST)" },
  { value: "Australia/Darwin", label: "Darwin (ACST)" },
  { value: "Australia/Hobart", label: "Hobart (AEST/AEDT)" },
  { value: "Australia/Canberra", label: "Canberra (AEST/AEDT)" },
  { value: "Australia/Lord_Howe", label: "Lord Howe Island" },
];

/**
 * Sensible default IANA timezone when the user picks a state/territory.
 * Users can still change the timezone (e.g. border cases, travel, preference).
 */
export const DEFAULT_TIMEZONE_BY_STATE: Record<string, string> = {
  NSW: "Australia/Sydney",
  VIC: "Australia/Melbourne",
  QLD: "Australia/Brisbane",
  WA: "Australia/Perth",
  SA: "Australia/Adelaide",
  TAS: "Australia/Hobart",
  ACT: "Australia/Canberra",
  NT: "Australia/Darwin",
};
