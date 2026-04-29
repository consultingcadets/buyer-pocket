"use client";

import { useActionState } from "react";
import { submitContact } from "@/app/actions/contact";

export default function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, null);

  if (state?.ok) {
    return (
      <div className="bg-background rounded-[8px] border border-border p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M4 10l4.5 4.5L16 6"
              stroke="#2EC4B6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-[22px] font-bold text-primary mb-2">Message sent.</h2>
        <p className="text-[15px] text-text-secondary">
          Thanks — we'll be in touch within one business day.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-[14px] font-semibold text-text-primary mb-1.5">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="w-full h-12 px-4 rounded border border-border bg-white text-[16px] text-text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-[14px] font-semibold text-text-primary mb-1.5">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full h-12 px-4 rounded border border-border bg-white text-[16px] text-text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-[14px] font-semibold text-text-primary mb-1.5">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full px-4 py-3 rounded border border-border bg-white text-[16px] text-text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition resize-none"
          placeholder="How can we help?"
        />
      </div>

      {state && !state.ok && (
        <p role="alert" className="text-[14px] text-error">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full h-12 bg-teal-action text-white font-semibold rounded text-[15px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
