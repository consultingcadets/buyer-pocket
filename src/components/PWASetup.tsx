"use client";

import { useEffect, useState, useTransition } from "react";

export function PWASetup() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch((err) => console.error("[SW] Registration failed:", err));
    }
  }, []);

  return null;
}

// ── Android / Chrome install prompt ──────────────────────────────────────────

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (window.innerWidth > 1024) return;
    if (sessionStorage.getItem("pwa-prompt-dismissed")) return;

    function handler(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!deferredPrompt || dismissed) return null;

  async function handleInstall() {
    const ev = deferredPrompt;
    if (!ev) return;
    try {
      await ev.prompt();
      await ev.userChoice;
    } catch {
      // ignore
    }
    setDismissed(true);
    setDeferredPrompt(null);
    sessionStorage.setItem("pwa-prompt-dismissed", "1");
  }

  function handleDismiss() {
    setDismissed(true);
    setDeferredPrompt(null);
    sessionStorage.setItem("pwa-prompt-dismissed", "1");
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-primary text-white rounded-xl p-4 shadow-xl flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">Add BuyerPocket to your home screen</p>
        <p className="text-xs text-white/70 mt-0.5">Works offline, loads faster.</p>
      </div>
      <button
        type="button"
        onClick={handleInstall}
        className="shrink-0 h-9 px-4 rounded-lg bg-teal-action text-white text-sm font-semibold"
      >
        Install
      </button>
      <button
        type="button"
        onClick={handleDismiss}
        className="shrink-0 text-white/60 text-lg leading-none px-1"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}

// ── iOS Safari install prompt ─────────────────────────────────────────────────

function isIosSafari(): boolean {
  const ua = navigator.userAgent;
  const isIos = /iphone|ipad|ipod/i.test(ua);
  // Chrome and Firefox on iOS include "CriOS"/"FxiOS" — they can't install PWAs
  const isSafari = /safari/i.test(ua) && !/crios|fxios|opios/i.test(ua);
  return isIos && isSafari;
}

export function IOSInstallPrompt() {
  const [show, setShow] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (window.innerWidth > 1024) return;
    if (sessionStorage.getItem("pwa-ios-dismissed")) return;
    if (!isIosSafari()) return;
    startTransition(() => setShow(true));
  }, []);

  if (!show) return null;

  function handleDismiss() {
    setShow(false);
    sessionStorage.setItem("pwa-ios-dismissed", "1");
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-primary text-white rounded-xl p-4 shadow-xl">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">Add BuyerPocket to your home screen</p>
          <p className="text-xs text-white/70 mt-1 leading-relaxed">
            Tap the{" "}
            <span className="inline-flex items-center gap-0.5 font-medium text-white">
              Share
              {/* iOS share icon */}
              <svg className="w-3.5 h-3.5 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/>
                <polyline points="16 6 12 2 8 6"/>
                <line x1="12" y1="2" x2="12" y2="15"/>
              </svg>
            </span>{" "}
            button then <span className="font-medium text-white">&quot;Add to Home Screen&quot;</span>.
          </p>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="shrink-0 text-white/60 text-lg leading-none px-1 mt-0.5"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
      {/* Arrow pointing to Safari share button at bottom */}
      <div className="mt-3 flex justify-center">
        <svg className="w-5 h-5 text-white/50 animate-bounce" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 16l-6-6h12l-6 6z"/>
        </svg>
      </div>
    </div>
  );
}
