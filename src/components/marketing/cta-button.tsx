"use client";

import Link from "next/link";
import posthog from "posthog-js";
import { cn } from "@/lib/utils";

interface Props {
  href: string;
  children: React.ReactNode;
  size?: "sm" | "default" | "lg";
  variant?: "primary" | "outline" | "dark";
  fullWidth?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function CTAButton({
  href,
  children,
  size = "default",
  variant = "primary",
  fullWidth,
  className,
  onClick,
}: Props) {
  const track = () => {
    try {
      posthog.capture("signup_started", { cta_href: href });
    } catch {
      // PostHog not initialised yet
    }
    onClick?.();
  };

  return (
    <Link
      href={href}
      onClick={track}
      className={cn(
        "inline-flex items-center justify-center font-semibold rounded-xl transition-opacity",
        "min-h-[48px] focus-visible:outline-2 focus-visible:outline-offset-2",
        size === "sm" && "px-4 text-sm min-h-[44px] rounded-[10px]",
        size === "default" && "px-6 py-3 text-sm",
        size === "lg" && "px-8 py-4 text-base rounded-xl",
        variant === "primary" && "bg-teal-action text-on-teal-action hover:opacity-90 focus-visible:outline-teal-action",
        variant === "outline" && "border border-primary text-primary hover:bg-surface-container focus-visible:outline-primary",
        variant === "dark" && "bg-teal-action text-white hover:opacity-90 focus-visible:outline-teal-action",
        fullWidth && "w-full",
        className,
      )}
    >
      {children}
    </Link>
  );
}
