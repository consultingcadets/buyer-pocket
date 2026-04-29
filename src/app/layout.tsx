import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { PWASetup, InstallPrompt } from "@/components/PWASetup";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
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
  },
};

export const viewport: Viewport = {
  themeColor: "#0F1C2C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-AU"
      className={cn("h-full antialiased", inter.variable, "font-sans")}
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
        {children}
        <PWASetup />
        <InstallPrompt />
      </body>
    </html>
  );
}
