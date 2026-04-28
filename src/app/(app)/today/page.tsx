import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function TodayPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("eligibility_acknowledged_at, state, name")
    .eq("id", user.id)
    .single();

  if (!profile?.eligibility_acknowledged_at) redirect("/signup/eligibility");
  if (!profile?.state) redirect("/signup/profile");

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-[32px] font-bold text-brand-navy mb-2">
          Today
        </h1>
        {profile.name && (
          <p className="text-[16px] text-on-surface-variant">
            Welcome back, {profile.name}.
          </p>
        )}
        <p className="text-[14px] text-on-surface-variant mt-8">
          Dashboard coming soon.
        </p>
      </div>
    </main>
  );
}
