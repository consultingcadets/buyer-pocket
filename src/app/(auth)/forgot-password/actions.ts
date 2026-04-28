"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export type ForgotPasswordState =
  | { error: string }
  | { success: true }
  | null;

export async function sendResetLink(
  _prev: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const email = (formData.get("email") as string).trim();
  if (!email) return { error: "Please enter your email address." };

  const headersList = await headers();
  const host = headersList.get("host")!;
  const proto = process.env.NODE_ENV === "production" ? "https" : "http";
  const redirectTo = `${proto}://${host}/auth/callback?type=recovery`;

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  // Don't leak whether the email exists
  if (error) return { error: error.message };
  return { success: true };
}
