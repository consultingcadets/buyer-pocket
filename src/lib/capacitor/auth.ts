import { Browser } from "@capacitor/browser";
import { createClient } from "@/lib/supabase/client";

export async function signInWithGoogleNative(): Promise<void> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "https://buyerpocket.com.au/auth/callback",
      skipBrowserRedirect: true,
    },
  });

  if (error || !data.url) return;
  await Browser.open({ url: data.url });
}
