"use client";

import { useRouter } from "next/navigation";
import { getAccessLevel, getBannerType } from "@/lib/subscription";
import { SubscriptionBanner } from "./SubscriptionBanner";
import { TrialEndedModal } from "./TrialEndedModal";
import { CancelledModal } from "./CancelledModal";
import type { Subscription } from "@/types/database";
import type { BannerType } from "@/lib/subscription";
import { useState } from "react";

interface Props {
  subscription: Subscription | null;
  children: React.ReactNode;
}

async function startCheckout(router: ReturnType<typeof useRouter>) {
  const res = await fetch("/api/billing/checkout", { method: "POST" });
  const { url } = await res.json();
  if (url) router.push(url);
}

async function startPortal(router: ReturnType<typeof useRouter>) {
  const res = await fetch("/api/billing/portal", { method: "POST" });
  const { url } = await res.json();
  if (url) router.push(url);
}

export function BillingGuard({ subscription, children }: Props) {
  const router = useRouter();
  const [readOnlyDismissed, setReadOnlyDismissed] = useState(false);

  const accessLevel = getAccessLevel(subscription);
  const bannerType = getBannerType(subscription);

  const handleAddPayment = () => startCheckout(router);
  const handleExport = () => router.push("/buyers?export=true");
  const handleResubscribe = () => startPortal(router);

  const showTrialEndedModal =
    bannerType === "trial_ended" && accessLevel !== "full";

  const showCancelledModal =
    (accessLevel === "read_only" ||
      accessLevel === "export_only" ||
      accessLevel === "expired") &&
    !showTrialEndedModal &&
    !readOnlyDismissed;

  const activeBanner =
    bannerType !== "none" &&
    bannerType !== "trial_ended"
      ? (bannerType as Exclude<BannerType, "none" | "trial_ended">)
      : null;

  return (
    <>
      {activeBanner && (
        <SubscriptionBanner
          bannerType={activeBanner}
          onAddPayment={handleAddPayment}
        />
      )}

      {showTrialEndedModal && (
        <TrialEndedModal
          onAddPayment={handleAddPayment}
          onExport={handleExport}
        />
      )}

      {showCancelledModal && (
        <CancelledModal
          accessLevel={accessLevel as "read_only" | "export_only" | "expired"}
          onResubscribe={handleResubscribe}
          onExport={handleExport}
          onContinueReadOnly={
            accessLevel === "read_only"
              ? () => setReadOnlyDismissed(true)
              : undefined
          }
        />
      )}

      {children}
    </>
  );
}
