"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import CTAButton from "./cta-button";
import { createClient } from "@/lib/supabase/client";

export default function MarketingNav({ isLoggedIn: initialIsLoggedIn }: { isLoggedIn?: boolean }) {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn ?? false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-md shadow-[0_1px_0_rgba(15,28,44,0.05)]">
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="font-bold text-[18px] text-primary tracking-tight shrink-0"
          aria-label="BuyerPocket home"
        >
          BuyerPocket
        </Link>

        <div className="hidden md:flex flex-nowrap items-center gap-5 lg:gap-7 shrink-0 min-w-0">
          <Link
            href="/features"
            className="flex min-h-12 items-center whitespace-nowrap rounded-lg px-3 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-container-low hover:text-text-primary"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="flex min-h-12 items-center whitespace-nowrap rounded-lg px-3 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-container-low hover:text-text-primary"
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className="flex min-h-12 items-center whitespace-nowrap rounded-lg px-3 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-container-low hover:text-text-primary"
          >
            About
          </Link>
          {isLoggedIn ? (
            <CTAButton href="/today" size="sm" className="shrink-0">
              Open app
            </CTAButton>
          ) : (
            <>
              <Link
                href="/login"
                className="flex min-h-12 items-center whitespace-nowrap rounded-lg px-3 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-container-low hover:text-text-primary"
              >
                Login
              </Link>
              <CTAButton href="/signup" size="sm" className="shrink-0">
                Start free trial
              </CTAButton>
            </>
          )}
        </div>

        <button
          className="md:hidden min-h-12 min-w-12 rounded-lg p-2 text-text-primary transition-colors hover:bg-surface-container-low hover:text-text-secondary"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-white border-t border-border px-4 sm:px-6 py-3 flex flex-col gap-0 pb-6 max-h-[min(70vh,28rem)] overflow-y-auto shadow-[inset_0_1px_0_rgba(15,28,44,0.04)]">
          <Link
            href="/features"
            className="text-sm font-medium text-primary py-3.5 border-b border-border active:bg-surface-container-low"
            onClick={() => setOpen(false)}
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-primary py-3.5 border-b border-border active:bg-surface-container-low"
            onClick={() => setOpen(false)}
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-primary py-3.5 border-b border-border active:bg-surface-container-low"
            onClick={() => setOpen(false)}
          >
            About
          </Link>
          {isLoggedIn ? (
            <div className="pt-4">
              <CTAButton href="/today" fullWidth onClick={() => setOpen(false)}>
                Open app
              </CTAButton>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-primary py-3.5 border-b border-border active:bg-surface-container-low"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
              <div className="pt-4">
                <CTAButton href="/signup" fullWidth onClick={() => setOpen(false)}>
                  Start free trial
                </CTAButton>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}
