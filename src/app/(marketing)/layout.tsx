import type { Viewport } from "next";
import { createClient } from "@/lib/supabase/server";
import MarketingNav from "@/components/marketing/marketing-nav";
import MarketingFooter from "@/components/marketing/marketing-footer";

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col min-h-screen">
      <MarketingNav isLoggedIn={!!user} />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}
