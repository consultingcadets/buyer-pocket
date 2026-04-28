export type ReminderChip =
  | "tonight-7pm"
  | "tomorrow-9am"
  | "tomorrow-5pm"
  | "saturday-morning"
  | "next-monday-9am"
  | "custom"
  | null;

/**
 * Compute the Date for a quick-select reminder chip relative to now.
 */
export function getReminderDate(
  chip: Exclude<ReminderChip, "custom" | null>
): Date {
  const now = new Date();

  switch (chip) {
    case "tonight-7pm": {
      const d = new Date(now);
      d.setHours(19, 0, 0, 0);
      // If already past 7 pm, schedule for tomorrow 7 pm
      if (now >= d) {
        d.setDate(d.getDate() + 1);
      }
      return d;
    }
    case "tomorrow-9am": {
      const d = new Date(now);
      d.setDate(d.getDate() + 1);
      d.setHours(9, 0, 0, 0);
      return d;
    }
    case "tomorrow-5pm": {
      const d = new Date(now);
      d.setDate(d.getDate() + 1);
      d.setHours(17, 0, 0, 0);
      return d;
    }
    case "saturday-morning": {
      const d = new Date(now);
      const day = d.getDay(); // 0=Sun, 6=Sat
      const daysUntilSat = day === 6 ? 7 : (6 - day + 7) % 7 || 7;
      d.setDate(d.getDate() + daysUntilSat);
      d.setHours(9, 0, 0, 0);
      return d;
    }
    case "next-monday-9am": {
      const d = new Date(now);
      const day = d.getDay(); // 0=Sun, 1=Mon
      const daysUntilMon = day === 1 ? 7 : (8 - day) % 7 || 7;
      d.setDate(d.getDate() + daysUntilMon);
      d.setHours(9, 0, 0, 0);
      return d;
    }
  }
}

/**
 * Return the human-readable label for a reminder chip value.
 */
export function getReminderLabel(chip: ReminderChip): string {
  switch (chip) {
    case "tonight-7pm":
      return "Tonight 7pm";
    case "tomorrow-9am":
      return "Tomorrow 9am";
    case "tomorrow-5pm":
      return "Tomorrow 5pm";
    case "saturday-morning":
      return "Sat morning";
    case "next-monday-9am":
      return "Mon 9am";
    case "custom":
      return "Custom";
    case null:
      return "";
  }
}
