"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type SignupState = { error: string } | { checkEmail: true } | null;

export async function signUpWithEmail(
  _prev: SignupState,
  formData: FormData
): Promise<SignupState> {
  const supabase = await createClient();

  const name = (formData.get("name") as string).trim();
  const email = (formData.get("email") as string).trim();
  const password = formData.get("password") as string;
  const mobile = (formData.get("mobile") as string | null)?.trim() || null;

  if (name.length < 2) return { error: "Please enter your full name." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });

  if (error) return { error: error.message };

  // Update profile with name and mobile
  if (data.user) {
    await supabase
      .from("profiles")
      .update({ name, mobile })
      .eq("id", data.user.id);
  }

  // No session = email confirmation required
  if (!data.session) return { checkEmail: true };

  redirect("/signup/eligibility");
}

export async function signUpWithGoogle(_formData: FormData): Promise<void> {
  const headersList = await headers();
  const host = headersList.get("host")!;
  const proto = process.env.NODE_ENV === "production" ? "https" : "http";
  const redirectTo = `${proto}://${host}/auth/callback`;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });

  if (error) redirect("/signup?error=google");
  if (data.url) redirect(data.url);
}
