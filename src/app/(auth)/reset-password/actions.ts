"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type ResetPasswordState = { error: string } | null;

export async function updatePassword(
  _prev: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const password = formData.get("password") as string;
  const confirm = formData.get("confirm") as string;

  if (password.length < 8)
    return { error: "Password must be at least 8 characters." };
  if (password !== confirm) return { error: "Passwords do not match." };

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/forgot-password");

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };

  redirect("/today");
}
