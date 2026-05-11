import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { PWASetup, InstallPrompt, IOSInstallPrompt } from "@/components/PWASetup";
import { NativeHandlers } from "@/components/NativeHandlers";
import { PHProvider } from "@/components/analytics/posthog-provider";

const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BuyerPocket",
  legalName: "Consulting Cadets Pty Ltd",
  url: "https://buyerpocket.com.au",
  logo: {
    "@type": "ImageObject",
    url: "https://buyerpocket.com.au/icons/icon-512.png",
    width: 512,
    height: 512,
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@consultingcadets.com",
    contactType: "customer service",
    areaServed: "AU",
    availableLanguage: "English",
  },
  areaServed: "AU",
  knowsAbout: ["Real estate", "Buyer management", "Property sales", "CRM"],
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://buyerpocket.com.au"),
  title: { default: "BuyerPocket", template: "%s — BuyerPocket" },
  description: "Buyer list and reminder tool for independent Australian real estate agents. Capture buyers at open homes, match them to new listings, and never miss a follow-up.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BuyerPocket",
  },
  formatDetection: { telephone: false },
  openGraph: {
    title: "BuyerPocket — Buyer List for Australian Real Estate Agents",
    description: "Capture buyers at open homes, match them to new listings, and never miss a follow-up. Built for independent Australian real estate agents.",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BuyerPocket — buyer list and reminder tool for Australian real estate agents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BuyerPocket — Buyer List for Australian Real Estate Agents",
    description: "Capture buyers at open homes, match them to new listings, and never miss a follow-up.",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_SCHEMA) }}
        />
        {/* iOS PWA icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        {/* Mask icon for Safari pinned tab */}
        <link rel="mask-icon" href="/icons/icon.svg" color="#0F1C2C" />
      </head>
      <body className="min-h-full flex flex-col">
        <PHProvider>
          {children}
        </PHProvider>
        <PWASetup />
        <InstallPrompt />
        <IOSInstallPrompt />
        <NativeHandlers />
      </body>
    </html>
  );
}
