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
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8 antialiased">
      <div className="w-full max-w-[480px] bg-surface-container-lowest rounded-lg shadow-[0px_4px_20px_rgba(13,27,42,0.05)] p-8 flex flex-col gap-6">
        {/* Progress dots */}
        <div className="flex justify-center gap-2">
          {DOTS.map((active, i) => (
            <div
              key={i}
              className={`rounded-full ${
                active ? "w-2 h-2 bg-brand-navy" : "w-2 h-2 bg-surface-variant"
              }`}
            />
          ))}
        </div>

        {/* Header */}
        <div className="text-center">
          <h2 className="text-[32px] font-bold tracking-tight text-brand-navy mb-2">
            Quick question first.
          </h2>
          <p className="text-[16px] text-on-surface-variant">
            To ensure you can take full advantage of BuyerPocket, we need to
            know how you operate regarding buyer relationships.
          </p>
        </div>

        {/* Interactive form */}
        <EligibilityForm />
      </div>
    </main>
  );
}
