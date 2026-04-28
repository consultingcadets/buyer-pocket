"use server";

import { createClient } from "@/lib/supabase/server";

export type AddBuyerPayload = {
  name: string;
  phone?: string | null;
  email?: string | null;
  preferred_suburbs?: string[] | null;
  budget_min?: number | null;
  budget_max?: number | null;
  bedrooms?: string | null;
  land_size_min?: number | null;
  notes_summary?: string | null;
  preferred_contact_method?: string | null;
  best_time_to_contact?: string | null;
  contact_consent?: string | null;
  property_type?: string | null;
  house_type?: string | null;
  bathrooms?: string | null;
  car_spaces?: string | null;
  condition_preference?: string | null;
  building_size_min?: number | null;
  block_preference?: string | null;
  must_haves?: string[] | null;
  buying_timeline?: string | null;
  buyer_temperature?: "hot" | "warm" | "cold" | null;
  buyer_type?: string | null;
  lead_source?: string | null;
  // Reminder fields
  reminderAt?: string | null;
  reminderContactType?: string | null;
  reminderNote?: string | null;
};

export type AddBuyerResult =
  | { success: true; buyerId: string }
  | { error: string };

export async function addBuyer(
  payload: AddBuyerPayload
): Promise<AddBuyerResult> {
  // Validate required fields
  if (!payload.name?.trim()) {
    return { error: "Buyer name is required." };
  }
  if (!payload.phone?.trim() && !payload.email?.trim()) {
    return { error: "A phone number or email is required." };
  }
  if (!payload.preferred_suburbs || payload.preferred_suburbs.length === 0) {
    return { error: "At least one suburb is required." };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be logged in to add a buyer." };
  }

  // Insert buyer
  const { data: buyer, error: buyerError } = await supabase
    .from("buyers")
    .insert({
      user_id: user.id,
      name: payload.name.trim(),
      phone: payload.phone ?? null,
      email: payload.email ?? null,
      preferred_suburbs: payload.preferred_suburbs ?? null,
      budget_min: payload.budget_min ?? null,
      budget_max: payload.budget_max ?? null,
      bedrooms: payload.bedrooms ?? null,
      land_size_min: payload.land_size_min ?? null,
      notes_summary: payload.notes_summary ?? null,
      preferred_contact_method: payload.preferred_contact_method ?? null,
      best_time_to_contact: payload.best_time_to_contact ?? null,
      contact_consent: payload.contact_consent ?? null,
      property_type: payload.property_type ?? null,
      house_type: payload.house_type ?? null,
      bathrooms: payload.bathrooms ?? null,
      car_spaces: payload.car_spaces ?? null,
      condition_preference: payload.condition_preference ?? null,
      building_size_min: payload.building_size_min ?? null,
      block_preference: payload.block_preference ?? null,
      must_haves: payload.must_haves ?? null,
      buying_timeline: payload.buying_timeline ?? null,
      buyer_temperature: payload.buyer_temperature ?? null,
      buyer_type: payload.buyer_type ?? null,
      lead_source: payload.lead_source ?? null,
      next_reminder_at: payload.reminderAt ?? null,
    })
    .select("id")
    .single();

  if (buyerError || !buyer) {
    console.error("addBuyer insert error:", buyerError);
    return { error: buyerError?.message ?? "Failed to save buyer." };
  }

  // Optionally insert reminder row
  if (payload.reminderAt) {
    const { error: reminderError } = await supabase.from("reminders").insert({
      user_id: user.id,
      buyer_id: buyer.id,
      reminder_at: payload.reminderAt,
      reminder_type: payload.reminderContactType ?? null,
      reminder_note: payload.reminderNote ?? null,
      status: "pending",
    });

    if (reminderError) {
      // Buyer was saved; log but don't fail the whole operation
      console.error("addBuyer reminder insert error:", reminderError);
    }
  }

  return { success: true, buyerId: buyer.id };
}
