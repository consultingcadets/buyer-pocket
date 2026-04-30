"use client";

import { useRouter } from "next/navigation";
import { SubscriptionBanner } from "./SubscriptionBanner";
import { TrialEndedModal } from "./TrialEndedModal";
import { CancelledModal } from "./CancelledModal";
import type { BannerType, AccessLevel } from "@/lib/subscription";
import { useState } from "react";

interface Props {
  accessLevel: AccessLevel;
  bannerType: BannerType;
  children: React.ReactNode;
}

async function startCheckout(router: ReturnType<typeof useRouter>) {
  const res = await fetch("/api/billing/checkout", { method: "POST" });
  const data = await res.json();
  if (data.url) router.push(data.url);
}

async function startPortal(router: ReturnType<typeof useRouter>) {
  const res = await fetch("/api/billing/portal", { method: "POST" });
  const data = await res.json();
  if (data.url) router.push(data.url);
}

export function BillingGuard({
  accessLevel,
  bannerType,
  children,
}: Props) {
  const router = useRouter();
  const [readOnlyDismissed, setReadOnlyDismissed] = useState(false);

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
