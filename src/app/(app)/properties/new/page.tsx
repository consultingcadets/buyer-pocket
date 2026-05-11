import { createClient } from "@/lib/supabase/server";
import { AddPropertyForm } from "./AddPropertyForm";

export const metadata = { title: "Add Property — BuyerPocket" };

export default async function AddPropertyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from("profiles").select("state").eq("id", user.id).single()
    : { data: null };
  return <AddPropertyForm agentState={profile?.state} />;
}
