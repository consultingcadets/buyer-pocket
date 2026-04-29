"use client";

import { useState } from "react";
import type { BannerType } from "@/lib/subscription";

interface Props {
  bannerType: Exclude<BannerType, "none" | "trial_ended">;
  onAddPayment: () => void;
}

export function SubscriptionBanner({ bannerType, onAddPayment }: Props) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed && bannerType === "trial_warning") return null;

  const isUrgent = bannerType === "trial_urgent";
  const isPastDue = bannerType === "past_due";

  const bg = isPastDue || isUrgent ? "bg-[#F97316]" : "bg-[#EAB308]";
  const text = isPastDue || isUrgent ? "text-white" : "text-brand-navy";

  const message = isPastDue
    ? "Your payment is overdue. Please add a payment method to keep access."
    : isUrgent
    ? "Your free trial ends today. Add a payment method to continue."
    : "Your free trial ends in a few days. Add a card to keep access.";

  return (
    <div className={`${bg} ${text} px-4 py-2.5 flex items-center justify-between gap-4 text-[14px]`}>
      <span className="font-medium">{message}</span>
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onAddPayment}
          className="bg-white text-brand-navy rounded px-3 py-1 text-[13px] font-semibold hover:opacity-90 transition-opacity"
        >
          Add payment
        </button>
        {bannerType === "trial_warning" && (
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
            className="opacity-70 hover:opacity-100 transition-opacity"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
