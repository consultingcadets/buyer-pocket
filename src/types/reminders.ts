import type { Reminder } from "./database";

export type ReminderBuyerSnippet = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  buyer_temperature: "hot" | "warm" | "cold" | null;
  budget_min: number | null;
  budget_max: number | null;
  preferred_suburbs: string[] | null;
  bedrooms: string | null;
  land_size_min: number | null;
};

export type ReminderWithBuyer = Omit<Reminder, never> & {
  buyer: ReminderBuyerSnippet;
};

export const REMINDER_TYPES = [
  "Call",
  "SMS",
  "Email",
  "Inspection follow-up",
  "Finance follow-up",
  "Offer follow-up",
  "General",
] as const;

export type ReminderType = (typeof REMINDER_TYPES)[number];
