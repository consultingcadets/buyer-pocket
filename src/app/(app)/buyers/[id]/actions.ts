"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Database } from "@/types/database";

type BuyerUpdate = Database["public"]["Tables"]["buyers"]["Update"];

async function authedClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function addNote(
  buyerId: string,
  note: string,
  contactType: string | null
): Promise<{ error?: string }> {
  const { supabase, user } = await authedClient();
  if (!user) return { error: "Unauthorized" };
  if (!note.trim()) return { error: "Note cannot be empty" };

  const { error } = await supabase.from("notes").insert({
    buyer_id: buyerId,
    user_id: user.id,
    note: note.trim(),
    contact_type: contactType,
  });
  if (error) return { error: error.message };

  await supabase
    .from("buyers")
    .update({ last_contacted_at: new Date().toISOString() })
    .eq("id", buyerId)
    .eq("user_id", user.id);

  revalidatePath(`/buyers/${buyerId}`);
  return {};
}

export async function markAsContacted(
  buyerId: string
): Promise<{ error?: string }> {
  const { supabase, user } = await authedClient();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("buyers")
    .update({ last_contacted_at: new Date().toISOString() })
    .eq("id", buyerId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath(`/buyers/${buyerId}`);
  return {};
}

export async function updateNote(
  noteId: string,
  buyerId: string,
  note: string
): Promise<{ error?: string }> {
  const { supabase, user } = await authedClient();
  if (!user) return { error: "Unauthorized" };
  if (!note.trim()) return { error: "Note cannot be empty" };

  const { error } = await supabase
    .from("notes")
    .update({ note: note.trim() })
    .eq("id", noteId)
    .eq("user_id", user.id);
  if (error) return { error: error.message };

  revalidatePath(`/buyers/${buyerId}`);
  return {};
}

export async function deleteNote(
  noteId: string,
  buyerId: string
): Promise<{ error?: string }> {
  const { supabase, user } = await authedClient();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", noteId)
    .eq("user_id", user.id);
  if (error) return { error: error.message };

  revalidatePath(`/buyers/${buyerId}`);
  return {};
}

export async function completeReminder(
  reminderId: string,
  buyerId: string
): Promise<{ error?: string }> {
  const { supabase, user } = await authedClient();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("reminders")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", reminderId)
    .eq("user_id", user.id);
  if (error) return { error: error.message };

  revalidatePath(`/buyers/${buyerId}`);
  return {};
}

export async function snoozeReminder(
  reminderId: string,
  buyerId: string,
  until: string
): Promise<{ error?: string }> {
  const { supabase, user } = await authedClient();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("reminders")
    .update({ status: "snoozed", snoozed_until: until, reminder_at: until })
    .eq("id", reminderId)
    .eq("user_id", user.id);
  if (error) return { error: error.message };

  revalidatePath(`/buyers/${buyerId}`);
  return {};
}

export async function deleteReminder(
  reminderId: string,
  buyerId: string
): Promise<{ error?: string }> {
  const { supabase, user } = await authedClient();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("reminders")
    .delete()
    .eq("id", reminderId)
    .eq("user_id", user.id);
  if (error) return { error: error.message };

  revalidatePath(`/buyers/${buyerId}`);
  return {};
}

export async function addReminder(
  buyerId: string,
  reminderAt: string,
  reminderType: string | null,
  reminderNote: string | null
): Promise<{ error?: string }> {
  const { supabase, user } = await authedClient();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase.from("reminders").insert({
    buyer_id: buyerId,
    user_id: user.id,
    reminder_at: reminderAt,
    reminder_type: reminderType,
    reminder_note: reminderNote,
    status: "pending",
  });
  if (error) return { error: error.message };

  await supabase
    .from("buyers")
    .update({ next_reminder_at: reminderAt })
    .eq("id", buyerId)
    .eq("user_id", user.id);

  revalidatePath(`/buyers/${buyerId}`);
  return {};
}

export async function updateBuyer(
  id: string,
  data: BuyerUpdate
): Promise<{ error?: string }> {
  const { supabase, user } = await authedClient();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("buyers")
    .update(data)
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return { error: error.message };

  revalidatePath(`/buyers/${id}`);
  return {};
}

export async function archiveBuyer(id: string): Promise<{ error?: string }> {
  const { supabase, user } = await authedClient();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("buyers")
    .update({ archived_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/buyers");
  return {};
}
