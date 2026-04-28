"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type EligibilityState = { error: string } | null;

export async function saveEligibility(
  _prev: EligibilityState,
  formData: FormData
): Promise<EligibilityState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signup");

  const eligibility = formData.get("eligibility") as string;

  if (!eligibility) {
    return { error: "Please select an option to continue." };
  }

  // "Something else" — don't update DB, redirect to contact page
  if (eligibility === "something_else") {
    redirect("/signup/contact");
  }

  // Validate against allowed DB values
  const allowed = ["independent", "agency_permitted", "unconfirmed"] as const;
  if (!allowed.includes(eligibility as (typeof allowed)[number])) {
    return { error: "Invalid selection." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      eligibility_type: eligibility as (typeof allowed)[number],
      eligibility_acknowledged_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  redirect("/signup/profile");
}
