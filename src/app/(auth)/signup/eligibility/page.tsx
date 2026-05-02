import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { EligibilityForm } from "./EligibilityForm";

const DOTS = [false, true, false, false];

export default async function EligibilityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/signup");

  const { data: profile } = await supabase
    .from("profiles")
    .select("eligibility_acknowledged_at")
    .eq("id", user.id)
    .single();

  // Already completed this step
  if (profile?.eligibility_acknowledged_at) redirect("/signup/profile");

  return (
    <main className="min-h-screen bg-surface-container-low flex flex-col items-center justify-center px-4 py-8 antialiased">
      <div className="w-full max-w-[480px] flex flex-col items-center">
        <div className="mb-6">
          <span className="text-[24px] font-semibold text-primary">BuyerPocket</span>
        </div>
        <div className="flex justify-center gap-2 mb-6">
          {DOTS.map((active, i) => (
            <span
              key={i}
              className={active ? "w-2 h-2 rounded-full bg-primary" : "w-2 h-2 rounded-full border border-border bg-transparent"}
            />
          ))}
        </div>

        <div className="w-full bg-white rounded-lg shadow-card p-6 md:p-8 flex flex-col gap-6 border border-border">
          <div className="text-center">
            <h2 className="text-[32px] font-bold tracking-tight text-primary mb-2">
              Quick question first.
            </h2>
            <p className="text-[13px] text-text-secondary">
              BuyerPocket is built for agents who own their buyer relationships. Some agents at large agencies have employment contracts that say buyer data belongs to the agency, not them. Using a personal tool for that data could put you in breach. Pick the option that matches your situation:
            </p>
          </div>

          <EligibilityForm />
        </div>
      </div>
    </main>
  );
}
