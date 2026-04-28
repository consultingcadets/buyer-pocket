import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}/reset-password`);
      }

      // Check how far through onboarding the user is
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("eligibility_acknowledged_at, state")
          .eq("id", user.id)
          .single();

        if (!profile?.eligibility_acknowledged_at) {
          return NextResponse.redirect(`${origin}/signup/eligibility`);
        }
        if (!profile?.state) {
          return NextResponse.redirect(`${origin}/signup/profile`);
        }
      }

      return NextResponse.redirect(`${origin}/today`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
