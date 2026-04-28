"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type ProfileState = { error: string } | null;

export async function saveProfile(
  _prev: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signup");

  const state = formData.get("state") as string;
  const timezone = formData.get("timezone") as string;
  const agency_name =
    (formData.get("agency_name") as string | null)?.trim() || null;

  if (!state) return { error: "Please select your state." };
  if (!timezone) return { error: "Please select your timezone." };

  const { error } = await supabase
    .from("profiles")
    .update({ state, timezone, agency_name })
    .eq("id", user.id);

  if (error) return { error: error.message };

  redirect("/signup/notifications");
}
