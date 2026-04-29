import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { PWASetup, InstallPrompt, IOSInstallPrompt } from "@/components/PWASetup";
import { PHProvider } from "@/components/analytics/posthog-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: { default: "BuyerPocket", template: "%s — BuyerPocket" },
  description: "Your buyers, always in your pocket.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BuyerPocket",
  },
  formatDetection: { telephone: false },
  openGraph: {
    title: "BuyerPocket",
    description: "Your buyers, always in your pocket.",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BuyerPocket" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BuyerPocket",
    description: "Your buyers, always in your pocket.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0F1C2C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-AU"
      className={cn("h-full antialiased scroll-smooth", inter.variable, "font-sans")}
    >
      <head>
        {/* iOS PWA icons */}
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512.png" />
        {/* Mask icon for Safari tab */}
        <link rel="mask-icon" href="/icons/icon.svg" color="#0F1C2C" />
      </head>
      <body className="min-h-full flex flex-col">
        <PHProvider>
          {children}
        </PHProvider>
        <PWASetup />
        <InstallPrompt />
        <IOSInstallPrompt />
      </body>
    </html>
  );
}
