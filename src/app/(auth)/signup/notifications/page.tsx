"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { requestPushPermission, getFCMToken } from "@/lib/fcm/client";
import { savePushToken } from "@/app/(app)/reminders/actions";
import { isNative } from "@/lib/capacitor/native";
import { registerNativePush } from "@/lib/capacitor/push";

const DOTS = [false, false, false, true];

function useIosSafariInstallState() {
  const [showInstallCard, setShowInstallCard] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const ua = navigator.userAgent;
    const isIos =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isSafari = /Safari/.test(ua) && !/Chrome|CriOS|FxiOS|EdgiOS/.test(ua);
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    startTransition(() => setShowInstallCard(isIos && isSafari && !isStandalone));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return showInstallCard;
}

export default function NotificationsPage() {
  const router = useRouter();
  const showInstallCard = useIosSafariInstallState();
  const [permissionDenied, setPermissionDenied] = useState(false);

  async function handleEnableNotifications() {
    if (isNative()) {
      await registerNativePush();
      router.push("/today");
      return;
    }

    const permission = await requestPushPermission();
    if (permission === "denied") {
      setPermissionDenied(true);
      return;
    }
    if (permission === "granted") {
      const token = await getFCMToken();
      if (token) {
        const ua = navigator.userAgent;
        const browser =
          ua.includes("Safari") && !ua.includes("Chrome")
            ? "safari"
            : ua.includes("Firefox")
              ? "firefox"
              : "chrome";
        const deviceKind = /Mobi|Android/i.test(ua) ? "mobile" : "desktop";
        await savePushToken(token, deviceKind, browser);
      }
      router.push("/today");
    }
  }

  return (
    <main className="min-h-screen bg-surface-container-low flex flex-col items-center justify-center px-4 py-8 antialiased">
      <div className="w-full max-w-[480px] flex flex-col items-center">
        <div className="mb-6">
          <span className="text-[24px] font-semibold text-primary">BuyerPocket</span>
        </div>
        <div className="flex items-center gap-2 mb-6">
          {DOTS.map((active, i) => (
            <span
              key={i}
              className={active ? "w-2 h-2 rounded-full bg-primary" : "w-2 h-2 rounded-full border border-border bg-transparent"}
            />
          ))}
        </div>

        <div className="w-full bg-white rounded-lg shadow-card border border-border p-6 md:p-8 flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-[32px] font-bold tracking-tight text-primary">
              Turn on phone reminders.
            </h2>
            <p className="text-[16px] text-text-secondary mt-1">
              BuyerPocket sends push notifications when your follow-up reminders are due. Without this, the reminders won&apos;t reach your phone.
            </p>
          </div>

          <div className="w-full max-h-[200px] h-[200px] bg-surface-container-low rounded-lg border border-border flex items-center justify-center p-4">
            <div className="w-full max-w-[280px] rounded-2xl border border-border bg-white shadow-card p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
                BuyerPocket
              </p>
              <p className="text-[14px] font-semibold text-primary mt-1">
                Reminder: Call Sarah Jenkins
              </p>
              <p className="text-[13px] text-text-secondary mt-1">
                Looking in Wollert, Mernda, $650k–$750k, 4 bed.
              </p>
            </div>
          </div>

          {showInstallCard && (
            <div className="bg-surface-container-low rounded-lg border border-border p-4">
              <h3 className="text-[18px] font-semibold text-primary mb-3">
                Adding BuyerPocket to your iPhone
              </h3>
              <ol className="space-y-2 text-[14px] text-text-secondary list-decimal pl-5">
                <li>Open BuyerPocket in Safari (you may already have)</li>
                <li>Tap the Share button at the bottom of the screen</li>
                <li>Tap &quot;Add to Home Screen&quot;</li>
                <li>Open BuyerPocket from the new icon</li>
                <li>Tap &quot;Enable notifications&quot; again</li>
              </ol>
              <p className="text-[12px] text-text-secondary mt-3">
                Apple requires this for web apps. It only takes 30 seconds.
              </p>
            </div>
          )}

          {permissionDenied && (
            <div className="bg-warning-bg border border-warning-text/20 rounded-lg p-4">
              <h3 className="text-[18px] font-semibold text-warning-text">Notifications are off.</h3>
              <p className="text-[14px] text-warning-text mt-1">
                Without push notifications, your reminders won&apos;t reach your phone. You can turn them on later in Settings.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {permissionDenied ? (
              <>
                <button
                  type="button"
                  onClick={() => router.push("/today")}
                  className="w-full min-h-12 bg-teal-action text-white rounded-lg text-[16px] font-semibold hover:opacity-90 transition-opacity"
                >
                  Continue anyway
                </button>
                <button
                  type="button"
                  onClick={handleEnableNotifications}
                  className="w-full min-h-12 bg-transparent text-text-secondary rounded-lg text-[16px] font-semibold hover:bg-surface-container-low transition-colors"
                >
                  Try again
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleEnableNotifications}
                  className="w-full min-h-12 bg-teal-action text-white rounded-lg text-[16px] font-semibold hover:opacity-90 transition-opacity"
                >
                  Enable notifications
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/today")}
                  className="w-full min-h-12 bg-transparent text-text-secondary rounded-lg text-[16px] font-semibold hover:bg-surface-container-low transition-colors"
                >
                  Skip for now
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
