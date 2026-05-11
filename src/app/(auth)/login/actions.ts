"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type LoginState = { error: string } | null;

export async function loginWithEmail(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) return { error: error.message };
  redirect("/today");
}

export async function loginWithGoogle(formData: FormData): Promise<void> {
  void formData;
  const headersList = await headers();
  const host = headersList.get("host")!;
  const proto = process.env.NODE_ENV === "production" ? "https" : "http";
  const redirectTo = `${proto}://${host}/auth/callback`;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });

  if (error) redirect("/login?error=google");
  if (data.url) redirect(data.url);
}
