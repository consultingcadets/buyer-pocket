"use server";
import { createClient } from "@/lib/supabase/server";
import type { Property, MatchedBuyer } from "@/types/property";

export type AddPropertyPayload = {
  street_address: string;
  suburbLabel: string; // "Suburb, STATE" from combobox
  price: number;
  property_type?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  land_size?: number | null;
  listing_url?: string | null;
  notes?: string | null;
};

export type AddPropertyResult = { success: true; propertyId: string } | { error: string };

export async function addProperty(payload: AddPropertyPayload): Promise<AddPropertyResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const parts = payload.suburbLabel.split(",");
  const suburb = parts[0]?.trim() ?? payload.suburbLabel;
  const state = parts[1]?.trim() ?? "";

  const { data, error } = await supabase
    .from("properties")
    .insert({
      user_id: user.id,
      street_address: payload.street_address.trim(),
      suburb,
      state,
      price: payload.price,
      property_type: payload.property_type ?? null,
      bedrooms: payload.bedrooms ?? null,
      bathrooms: payload.bathrooms ?? null,
      land_size: payload.land_size ?? null,
      listing_url: payload.listing_url?.trim() || null,
      notes: payload.notes?.trim() || null,
    })
    .select("id")
    .single();

  if (error || !data) return { error: error?.message ?? "Failed to save property." };
  return { success: true, propertyId: data.id };
}

export async function fetchProperties(): Promise<{ properties: Property[]; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { properties: [], error: "Not authenticated" };

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return { properties: [], error: error.message };
  return { properties: (data ?? []) as Property[] };
}

export async function fetchProperty(id: string): Promise<{ property: Property | null; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { property: null, error: "Not authenticated" };

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) return { property: null, error: error.message };
  return { property: data as Property | null };
}

export async function matchBuyersForProperty(propertyId: string): Promise<{ buyers: MatchedBuyer[]; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { buyers: [], error: "Not authenticated" };

  const { data: prop, error: propError } = await supabase
    .from("properties")
    .select("*")
    .eq("id", propertyId)
    .eq("user_id", user.id)
    .single();

  if (propError || !prop) return { buyers: [], error: "Property not found" };

  const { data: buyers, error: buyersError } = await supabase
    .from("buyers")
    .select("id, name, phone, email, buyer_temperature, budget_min, budget_max, preferred_suburbs, bedrooms, land_size_min, property_type, last_contacted_at, created_at")
    .eq("user_id", user.id)
    .is("archived_at", null);

  if (buyersError) return { buyers: [], error: buyersError.message };

  const suburbLabel = `${prop.suburb}, ${prop.state}`;
  const tempOrder: Record<string, number> = { hot: 0, warm: 1, cold: 2 };
  const scored: MatchedBuyer[] = [];

  for (const b of buyers ?? []) {
    const matchedCriteria: string[] = [];

    const suburbMatch = (b.preferred_suburbs as string[] ?? []).some(
      (s: string) => s.toLowerCase() === suburbLabel.toLowerCase()
    );
    if (suburbMatch) matchedCriteria.push("Suburb");

    if (b.budget_max != null && b.budget_max >= prop.price) matchedCriteria.push("Budget");

    if (b.bedrooms && b.bedrooms !== "Any" && prop.bedrooms != null) {
      const minBeds = parseInt(b.bedrooms);
      if (!isNaN(minBeds) && prop.bedrooms >= minBeds) matchedCriteria.push("Bedrooms");
    }

    if (b.land_size_min != null && prop.land_size != null && prop.land_size >= b.land_size_min) {
      matchedCriteria.push("Land size");
    }

    if (b.property_type && prop.property_type &&
        b.property_type.toLowerCase() === prop.property_type.toLowerCase()) {
      matchedCriteria.push("Property type");
    }

    if (matchedCriteria.length > 0) {
      scored.push({
        id: b.id,
        name: b.name,
        phone: b.phone,
        email: b.email,
        buyer_temperature: b.buyer_temperature,
        budget_min: b.budget_min,
        budget_max: b.budget_max,
        last_contacted_at: b.last_contacted_at,
        created_at: b.created_at,
        score: matchedCriteria.length,
        matchedCriteria,
      });
    }
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (tempOrder[a.buyer_temperature ?? "cold"] ?? 2) - (tempOrder[b.buyer_temperature ?? "cold"] ?? 2);
  });

  return { buyers: scored };
}

export async function updatePropertyStatus(
  id: string,
  status: "active" | "sold" | "off_market"
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("properties")
    .update({ status })
    .eq("id", id)
    .eq("user_id", user.id);

  return error ? { error: error.message } : {};
}

export type MatchedProperty = Property & {
  score: number;
  matchedCriteria: string[];
};

export async function matchPropertiesForBuyer(
  buyerId: string
): Promise<{ properties: MatchedProperty[]; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { properties: [], error: "Not authenticated" };

  const { data: buyer, error: buyerError } = await supabase
    .from("buyers")
    .select("preferred_suburbs, budget_max, bedrooms, land_size_min, property_type")
    .eq("id", buyerId)
    .eq("user_id", user.id)
    .single();

  if (buyerError || !buyer) return { properties: [], error: "Buyer not found" };

  const { data: properties, error: propsError } = await supabase
    .from("properties")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active");

  if (propsError) return { properties: [], error: propsError.message };

  const buyerSuburbs = ((buyer.preferred_suburbs as string[]) ?? []).map((s) =>
    s.toLowerCase()
  );

  const scored: MatchedProperty[] = [];

  for (const p of properties ?? []) {
    const matchedCriteria: string[] = [];
    const propSuburbLabel = `${p.suburb}, ${p.state}`.toLowerCase();

    if (buyerSuburbs.includes(propSuburbLabel)) matchedCriteria.push("Suburb");

    if (buyer.budget_max != null && buyer.budget_max >= p.price) matchedCriteria.push("Budget");

    if (buyer.bedrooms && buyer.bedrooms !== "Any" && p.bedrooms != null) {
      const minBeds = parseInt(buyer.bedrooms);
      if (!isNaN(minBeds) && p.bedrooms >= minBeds) matchedCriteria.push("Bedrooms");
    }

    if (buyer.land_size_min != null && p.land_size != null && p.land_size >= buyer.land_size_min) {
      matchedCriteria.push("Land size");
    }

    if (
      buyer.property_type &&
      p.property_type &&
      buyer.property_type.toLowerCase() === p.property_type.toLowerCase()
    ) {
      matchedCriteria.push("Property type");
    }

    if (matchedCriteria.length > 0) {
      scored.push({ ...(p as Property), score: matchedCriteria.length, matchedCriteria });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return { properties: scored };
}
