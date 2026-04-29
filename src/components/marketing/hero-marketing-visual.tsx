import { CompactNotificationPreview } from "./landing-preview-cards";

/** Layered hero: floating cards + optional phone bezel with notification. */
export function HeroMarketingVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[440px] lg:max-w-none lg:translate-x-2 xl:translate-x-4">
      <div className="relative z-10 flex flex-col items-center gap-5 md:gap-6">
        <div className="relative w-[min(100%,312px)]">
          {/* Phone */}
          <div className="relative rounded-[2.25rem] border-[3px] border-primary/[0.12] bg-gradient-to-b from-surface-container-high to-white p-2 shadow-[0_20px_50px_-12px_rgba(15,28,44,0.25)] md:rounded-[2.5rem]">
            <div className="mx-auto mb-3 h-[18px] w-[94px] rounded-full bg-primary/[0.12]" aria-hidden />
            <div className="overflow-hidden rounded-[1.6rem] border border-border/80 bg-background">
              <div className="bg-primary/[0.04] px-3 py-2.5 text-center border-b border-border/80">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-secondary">
                  Today
                </span>
              </div>
              <div className="p-3">
                <CompactNotificationPreview />
              </div>
            </div>
          </div>
          {/* Floating buyer card */}
          <div className="absolute -right-2 top-[22%] z-10 w-[min(200px,calc(100%-180px))] translate-x-3 md:-right-12 md:w-[218px] md:translate-x-0 motion-safe:animate-float-slow-reverse">
            <FloatingMiniCard />
          </div>
        </div>

        <div className="hidden w-full max-w-[340px] sm:block motion-safe:-translate-y-2">
          <FilterStripMini />
        </div>
      </div>
      <MiniCaptureCardFloating className="absolute -bottom-8 left-0 z-10 max-sm:hidden xl:-bottom-12" />
    </div>
  );
}

function FloatingMiniCard() {
  return (
    <div className="rounded-xl border border-border bg-white shadow-modal p-3 text-[12px] select-none pointer-events-none">
      <div className="font-semibold text-primary truncate">Sarah Jenkins</div>
      <div className="text-text-secondary text-[11px] mt-0.5 truncate">Wollert · Hot</div>
      <div className="mt-2 flex gap-2 flex-wrap">
        <span className="rounded-full bg-teal-action/10 px-2 py-0.5 text-[10px] font-semibold text-teal-action">
          Follow-up 9 am
        </span>
      </div>
    </div>
  );
}

function FilterStripMini() {
  return (
    <div className="rounded-xl border border-border bg-white/95 shadow-card backdrop-blur-sm px-4 py-3 flex flex-wrap items-center gap-2 justify-center">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary">Matching</span>
      {["Suburb", "Budget", "Beds", "Land"].map((label) => (
        <span
          key={label}
          className="rounded-lg border border-border bg-surface-container-low px-2.5 py-1 text-[11px] font-medium text-primary"
        >
          {label}
        </span>
      ))}
      <span className="rounded-lg bg-teal-action px-2.5 py-1 text-[11px] font-semibold text-white">3 hits</span>
    </div>
  );
}

function MiniCaptureCardFloating({ className }: { className?: string }) {
  return (
    <div
      className={`w-[210px] rounded-xl border border-border bg-white shadow-modal p-3 text-[11px] select-none pointer-events-none motion-safe:animate-float-slow ${className ?? ""}`}
    >
      <div className="font-semibold uppercase tracking-wide text-text-secondary mb-2">Capture</div>
      <div className="space-y-1.5 mb-3">
        <div className="h-8 rounded-lg border border-border bg-surface-container-low px-2 flex items-center text-primary font-medium">
          Mei Chen
        </div>
        <div className="grid grid-cols-2 gap-1">
          <div className="h-7 rounded-md border border-dashed border-border px-2 flex items-center text-text-secondary bg-white">
            Phone
          </div>
          <div className="h-7 rounded-md border border-dashed border-border px-2 flex items-center text-text-secondary bg-white">
            Suburb
          </div>
        </div>
      </div>
      <div className="h-8 rounded-[10px] bg-teal-action text-white flex items-center justify-center text-[12px] font-semibold">
        Save buyer
      </div>
    </div>
  );
}
