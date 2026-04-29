"use client";

import { useEffect, useState } from "react";

// ── Service worker registration ───────────────────────────────────────────────

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

// ── Android install prompt ────────────────────────────────────────────────────

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show if already installed (standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    // Don't show if dismissed this session
    if (sessionStorage.getItem("pwa-prompt-dismissed")) return;

    function handler(e: Event) {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!prompt || dismissed) return null;

  async function handleInstall() {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted" || outcome === "dismissed") {
      setDismissed(true);
      sessionStorage.setItem("pwa-prompt-dismissed", "1");
    }
  }

  function handleDismiss() {
    setDismissed(true);
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
        className="flex-shrink-0 h-9 px-4 rounded-lg bg-teal-action text-white text-sm font-semibold"
      >
        Install
      </button>
      <button
        type="button"
        onClick={handleDismiss}
        className="flex-shrink-0 text-white/60 text-lg leading-none px-1"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
