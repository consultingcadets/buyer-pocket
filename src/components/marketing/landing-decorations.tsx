/**
 * Abstract SVG ornaments — restrained, brand-aligned.
 */

export function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <svg
        className="absolute -right-[20%] top-10 h-[min(520px,80vw)] w-[min(520px,90vw)] text-brand-teal/15 motion-safe:animate-float-slow opacity-90"
        viewBox="0 0 400 400"
        fill="none"
      >
        <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="1" />
        <circle cx="200" cy="200" r="140" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        <path d="M40 340 Q200 260 360 340" stroke="currentColor" strokeWidth="1" opacity="0.4" fill="none" />
      </svg>
      {/* <div className="absolute bottom-10 left-[5%] h-28 w-28 rounded-[2rem] border border-primary/[0.08] bg-white/40 backdrop-blur-sm motion-safe:animate-float-slow-reverse" /> */}
    </div>
  );
}

export function SectionPatternMuted({ flipped, uid = "default" }: { flipped?: boolean; uid?: string }) {
  const pid = `landing-grid-dot-${uid}`;
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden opacity-[0.35] ${flipped ? "scale-x-[-1]" : ""}`}
      aria-hidden
    >
      <svg className="h-full w-full" preserveAspectRatio="none">
        <defs>
          <pattern id={pid} width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="currentColor" className="text-primary/25" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pid})`} />
      </svg>
    </div>
  );
}

export function CTADecorationBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Same base as MarketingFooter (`bg-primary`) so the CTA strip and footer read as one navy block */}
      <div className="absolute inset-0 bg-primary" />
      <svg className="absolute -left-[10%] top-1/2 h-[min(400px,60vw)] w-[min(400px,85vw)] -translate-y-1/2 text-white/[0.05] motion-safe:animate-float-slow">
        <circle cx="200" cy="200" r="190" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
      <svg className="absolute -right-[5%] bottom-0 h-[min(280px,50vw)] w-[min(280px,75vw)] text-brand-teal/25 motion-safe:animate-float-slow-reverse opacity-80 md:opacity-100">
        <ellipse
          cx="170"
          cy="220"
          rx="110"
          ry="74"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          transform="rotate(-10 170 220)"
        />
      </svg>
    </div>
  );
}
