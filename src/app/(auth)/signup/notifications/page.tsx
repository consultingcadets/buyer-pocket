"use client";

import { useRouter } from "next/navigation";
import { requestPushPermission, getFCMToken } from "@/lib/fcm/client";
import { savePushToken } from "@/app/(app)/reminders/actions";

const DOTS = [false, false, false, true];

export default function NotificationsPage() {
  const router = useRouter();

  async function handleEnableNotifications() {
    const permission = await requestPushPermission();
    if (permission === "granted") {
      const token = await getFCMToken();
      if (token) {
        const browser = navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome")
          ? "safari"
          : navigator.userAgent.includes("Firefox")
          ? "firefox"
          : "chrome";
        const device = /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop";
        await savePushToken(token, device, browser);
      }
    }
    router.push("/today");
  }

  return (
    <main className="min-h-screen bg-background flex flex-col antialiased">
      {/* TopAppBar */}
      <header className="bg-surface-container-lowest border-b border-outline-variant">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="flex items-center justify-center p-2 rounded-full hover:bg-surface-container transition-colors"
          >
            <ArrowBack />
          </button>
          <div className="text-[20px] font-bold tracking-tight text-brand-navy">
            BuyerPocket
          </div>
          <div className="w-10" />
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 w-full flex items-center justify-center p-4 md:p-8">
        <div className="bg-surface-container-lowest w-full max-w-[480px] rounded-xl shadow-[0px_4px_20px_rgba(13,27,42,0.05)] border border-surface-container-highest p-6 md:p-8 flex flex-col gap-6">
          {/* Progress dots */}
          <div className="flex justify-center items-center gap-2 pt-1">
            {DOTS.map((active, i) => (
              <div
                key={i}
                className={`rounded-full transition-all ${
                  active ? "w-8 h-2 bg-teal-action" : "w-2 h-2 bg-surface-container-high"
                }`}
              />
            ))}
          </div>

          {/* Header */}
          <div className="flex flex-col items-center text-center gap-1">
            <h2 className="text-[32px] font-bold tracking-tight text-brand-navy">
              Turn on phone reminders.
            </h2>
            <p className="text-[16px] text-on-surface-variant">
              Stay ahead of the market. Get instant alerts for hot new listings
              and messages from potential buyers.
            </p>
          </div>

          {/* iPhone lock-screen mockup */}
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-brand-navy via-[#1a3a5c] to-[#0f2a42] flex flex-col justify-end p-4">
            {/* Time */}
            <div className="absolute top-6 left-0 right-0 flex justify-center">
              <div className="text-white text-[28px] font-semibold opacity-90 drop-shadow-md">
                09:41
              </div>
            </div>
            {/* Notification card */}
            <div className="relative z-10 w-full bg-white/95 backdrop-blur-md rounded-lg p-3 shadow-lg border border-white/30 flex gap-3">
              <div className="shrink-0 w-8 h-8 bg-brand-navy rounded flex items-center justify-center">
                <HomeIcon />
              </div>
              <div className="flex flex-col w-full">
                <div className="flex justify-between items-center w-full mb-0.5">
                  <span className="text-[11px] font-semibold tracking-widest text-on-surface-variant uppercase">
                    BuyerPocket
                  </span>
                  <span className="text-[12px] text-outline">Now</span>
                </div>
                <p className="text-[14px] font-semibold text-brand-navy leading-tight mb-1">
                  New Message from Sarah Jenkins
                </p>
                <p className="text-[13px] text-on-surface-variant leading-snug line-clamp-2">
                  &ldquo;Hi, I&apos;m very interested in the property at 24 Oak
                  Street. Is it available for viewing this Saturday?&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleEnableNotifications}
              className="w-full bg-teal-action text-on-teal-action rounded min-h-[48px] px-6 text-[16px] font-semibold flex items-center justify-center hover:opacity-90 transition-colors"
            >
              Enable notifications
            </button>
            <button
              onClick={() => router.push("/today")}
              className="w-full bg-transparent text-brand-navy hover:bg-surface-container rounded min-h-[48px] px-6 text-[16px] font-semibold flex items-center justify-center transition-colors"
            >
              Skip for now
            </button>
          </div>

          {/* iOS helper card */}
          <div className="bg-surface-container border border-surface-variant rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <PhoneIcon />
              <h3 className="text-[14px] font-semibold tracking-wider text-brand-navy uppercase">
                Add to Home Screen (iOS)
              </h3>
            </div>
            <ol className="flex flex-col gap-2 text-[14px] text-on-surface-variant pl-5 list-decimal marker:text-outline marker:font-semibold">
              <li className="pl-1">
                Tap the{" "}
                <span className="inline-flex items-center justify-center bg-surface-container-highest rounded px-1 py-0.5 mx-0.5">
                  <ShareIcon />
                </span>{" "}
                Share icon at the bottom of your browser.
              </li>
              <li className="pl-1">Scroll down the menu options.</li>
              <li className="pl-1">
                Tap <strong>&ldquo;Add to Home Screen&rdquo;</strong>.
              </li>
              <li className="pl-1">Confirm the app name and icon.</li>
              <li className="pl-1">
                Tap <strong>&ldquo;Add&rdquo;</strong> in the top right corner.
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-surface-container-low border-t border-outline-variant mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-8 py-8 max-w-7xl mx-auto gap-4">
          <div className="text-[14px] text-on-surface-variant">
            © 2026 BuyerPocket. All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {["Privacy Policy", "Terms of Service", "Help Centre"].map(
              (link) => (
                <a
                  key={link}
                  href="#"
                  className="text-[14px] font-semibold tracking-wider text-on-surface-variant hover:text-brand-navy transition-colors"
                >
                  {link}
                </a>
              )
            )}
          </div>
        </div>
      </footer>
    </main>
  );
}

function ArrowBack() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-brand-navy">
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#006A62">
      <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-on-surface-variant">
      <path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z"/>
    </svg>
  );
}
