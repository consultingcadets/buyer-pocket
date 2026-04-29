"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import CTAButton from "./cta-button";

export default function MarketingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <nav
        className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="font-bold text-[18px] text-primary tracking-tight"
          aria-label="BuyerPocket home"
        >
          BuyerPocket
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/features"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/login"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Login
          </Link>
          <CTAButton href="/signup" size="sm">
            Start free trial
          </CTAButton>
        </div>

        <button
          className="md:hidden p-2 -mr-2 text-text-primary hover:text-text-secondary transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-white border-t border-border px-6 py-4 flex flex-col gap-1">
          <Link
            href="/features"
            className="text-sm text-text-primary py-3 border-b border-border"
            onClick={() => setOpen(false)}
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="text-sm text-text-primary py-3 border-b border-border"
            onClick={() => setOpen(false)}
          >
            Pricing
          </Link>
          <Link
            href="/login"
            className="text-sm text-text-primary py-3 border-b border-border"
            onClick={() => setOpen(false)}
          >
            Login
          </Link>
          <div className="pt-3">
            <CTAButton href="/signup" fullWidth onClick={() => setOpen(false)}>
              Start free trial
            </CTAButton>
          </div>
        </div>
      )}
    </header>
  );
}
