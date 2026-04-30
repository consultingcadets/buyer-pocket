import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { EditBuyerForm } from "./EditBuyerForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Buyer — BuyerPocket" };

export default async function EditBuyerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: buyer } = await supabase
    .from("buyers")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!buyer) notFound();

  return <EditBuyerForm buyer={buyer} />;
}
