import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BuyerDirectory } from "./BuyerDirectory";
import { PAGE_SIZE } from "@/lib/buyer-filters";
import type { Buyer } from "@/types/database";

export const metadata = { title: "Buyer Directory — BuyerPocket" };

export default async function BuyersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data, count } = await supabase
    .from("buyers")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .is("archived_at", null)
    .order("created_at", { ascending: false })
    .range(0, PAGE_SIZE - 1);

  return (
    <BuyerDirectory
      initialBuyers={(data ?? []) as Buyer[]}
      initialCount={count ?? 0}
    />
  );
}
