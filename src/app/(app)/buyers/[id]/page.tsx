import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { BuyerProfile } from "./BuyerProfile";

export default async function BuyerProfilePage({
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

  const [{ data: buyer }, { data: notes }, { data: reminders }] =
    await Promise.all([
      supabase
        .from("buyers")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single(),
      supabase
        .from("notes")
        .select("*")
        .eq("buyer_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("reminders")
        .select("*")
        .eq("buyer_id", id)
        .order("reminder_at", { ascending: true }),
    ]);

  if (!buyer) notFound();

  return (
    <BuyerProfile
      buyer={buyer}
      notes={notes ?? []}
      reminders={reminders ?? []}
    />
  );
}
