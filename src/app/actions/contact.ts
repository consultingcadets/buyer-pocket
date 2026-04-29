"use server";

import { Resend } from "resend";
import { DEFAULT_RESEND_FROM_EMAIL, SUPPORT_EMAIL } from "@/lib/company";

const resend = new Resend(process.env.RESEND_API_KEY);

export type ContactResult =
  | { ok: true }
  | { ok: false; error: string };

export async function submitContact(_prev: ContactResult | null, formData: FormData): Promise<ContactResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { ok: false, error: "Please fill in all fields." };
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }

  if (message.length < 10) {
    return { ok: false, error: "Message is too short." };
  }

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? DEFAULT_RESEND_FROM_EMAIL,
      to: SUPPORT_EMAIL,
      replyTo: email,
      subject: `Contact form — ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    return { ok: true };
  } catch {
    return { ok: false, error: `Couldn't send your message. Try again or email ${SUPPORT_EMAIL} directly.` };
  }
}
