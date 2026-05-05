import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "./ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/signup");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, mobile")
    .eq("id", user.id)
    .single();

  const currentName = profile?.name ?? "";
  const needsName = !profile?.name;
  const needsMobile = !profile?.mobile;

  return (
    <ProfileForm
      initialName={currentName}
      needsName={needsName}
      needsMobile={needsMobile}
    />
  );
}
