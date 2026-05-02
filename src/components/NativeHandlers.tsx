"use client";

import { useEffect } from "react";
import { isNative } from "@/lib/capacitor/native";

export function NativeHandlers() {
  useEffect(() => {
    if (!isNative()) return;

    let cleanup: (() => void) | undefined;

    async function setup() {
      const { App } = await import("@capacitor/app");
      const { Browser } = await import("@capacitor/browser");
      const { StatusBar, Style } = await import("@capacitor/status-bar");
      const { SplashScreen } = await import("@capacitor/splash-screen");

      StatusBar.setStyle({ style: Style.Light });
      SplashScreen.hide();

      const listener = await App.addListener("appUrlOpen", ({ url }) => {
        if (url.includes("/auth/callback")) {
          Browser.close().catch(() => {});
          // Navigate the WebView to the callback URL so the server can exchange the code
          window.location.href = url;
        }
      });

      cleanup = () => listener.remove();
    }

    setup();
    return () => cleanup?.();
  }, []);

  return null;
}
