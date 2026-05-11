import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { AddBuyerForm } from "./AddBuyerForm";

export const metadata: Metadata = {
  title: "Add Buyer — BuyerPocket",
};

export default async function AddBuyerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from("profiles").select("state").eq("id", user.id).single()
    : { data: null };
  return <AddBuyerForm agentState={profile?.state} />;
}
