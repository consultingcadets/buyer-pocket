"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Fade/slide-up when section enters viewport. Respects prefers-reduced-motion.
 */
export function RevealOnView({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqHandler = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", mqHandler);

    const el = ref.current;
    if (!el) return () => mq.removeEventListener("change", mqHandler);

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setVisible(true);
      },
      { threshold: 0.06, rootMargin: "0px 0px -44px 0px" },
    );
    obs.observe(el);
    return () => {
      mq.removeEventListener("change", mqHandler);
      obs.disconnect();
    };
  }, []);

  const show = reduceMotion || visible;

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none",
        show || reduceMotion ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5",
        className,
      )}
    >
      {children}
    </div>
  );
}
