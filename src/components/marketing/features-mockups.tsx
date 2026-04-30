/**
 * Feature page UI mockups — same visual language as landing preview cards.
 */

export function FeaturesCaptureFormMockup() {
  return (
    <div
      className="w-full max-w-[420px] rounded-2xl border border-border/90 bg-white shadow-card overflow-hidden select-none pointer-events-none motion-safe:transition-shadow motion-safe:hover:shadow-dropdown"
      aria-hidden
    >
      <div className="px-4 py-3 border-b border-border bg-primary/[0.03]">
        <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-text-secondary">Quick capture</div>
      </div>
      <div className="p-4 space-y-2.5">
        <MiniField label="Name" value="Alex Chen" />
        <MiniField label="Phone" value="0412 889 102" />
        <MiniField label="Suburb" value="Glen Waverley, VIC" />
        <div className="grid grid-cols-2 gap-2">
          <MiniField label="Budget" value="$700k – $850k" small />
          <MiniField label="Bedrooms" value="4+" small />
        </div>
        <div>
          <div className="text-[10px] text-text-secondary mb-1 font-medium">Note (optional)</div>
          <div className="min-h-[52px] rounded-lg border border-border border-dashed bg-surface-container-low/50 px-2.5 py-2 text-[11px] text-text-secondary leading-snug">
            Wants north-facing, near station
          </div>
        </div>
        <button
          type="button"
          tabIndex={-1}
          className="w-full min-h-[44px] rounded-xl bg-teal-action text-on-teal-action text-[13px] font-semibold mt-1"
        >
          Save buyer
        </button>
      </div>
    </div>
  );
}

function MiniField({
  label,
  value,
  small,
}: {
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div>
      <div className="text-[10px] text-text-secondary mb-1 font-medium">{label}</div>
      <div
        className={`h-9 rounded-lg border border-border bg-surface-container-low px-2.5 flex items-center font-medium text-primary ${small ? "text-[11px]" : "text-[12px]"}`}
      >
        {value}
      </div>
    </div>
  );
}

export function FeaturesFilterResultsMockup() {
  return (
    <div
      className="w-full max-w-[520px] lg:max-w-none rounded-2xl border border-border/90 bg-white shadow-card overflow-hidden select-none pointer-events-none lg:max-w-[560px] motion-safe:transition-shadow motion-safe:hover:shadow-dropdown"
      aria-hidden
    >
      <div className="grid lg:grid-cols-[1fr_1.1fr] divide-y lg:divide-y-0 lg:divide-x divide-border">
        <div className="p-4 space-y-3 bg-surface-container-low/35">
          <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-text-secondary">Filters</div>
          <FilterFieldRow k="Suburb contains" v="Wollert" />
          <FilterFieldRow k="Budget" v="$600k – $820k" />
          <FilterFieldRow k="Min beds" v="4" />
          <FilterFieldRow k="Min land" v="400 m²" />
          <FilterFieldRow k="Property type" v="House" />
          <FilterFieldRow k="Timeline" v="1–3 months" />
          <FilterFieldRow k="Buyer temperature" v="Hot +" />
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wide text-text-secondary">Matches</span>
            <span className="text-[10px] font-semibold text-teal-action">4 buyers</span>
          </div>
          <div className="space-y-2">
            {[
              { n: "Sarah Jenkins", d: "Budget fit · 4 bed + land", t: "Hot" },
              { n: "Priya Sharma", d: "Same suburb focus", t: "Warm" },
              { n: "Marcus Webb", d: "Needs pool · budget stretch", t: "Hot" },
            ].map((row) => (
              <div
                key={row.n}
                className="rounded-xl border border-border/80 bg-background px-3 py-2.5 flex justify-between gap-2 items-start shadow-sm"
              >
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold text-primary truncate">{row.n}</div>
                  <div className="text-[10px] text-text-secondary mt-0.5">{row.d}</div>
                </div>
                <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-teal-action/12 text-teal-action shrink-0">
                  {row.t}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterFieldRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-2 text-[11px]">
      <span className="text-text-secondary shrink-0">{k}</span>
      <span className="font-medium text-primary text-right truncate">{v}</span>
    </div>
  );
}

export function FeaturesRemindStackMockup() {
  return (
    <div className="w-full max-w-[440px] space-y-4">
      <div className="rounded-2xl border border-border/90 bg-white shadow-card overflow-hidden">
        <div className="px-3 py-2 bg-primary text-white text-[10px] font-bold tracking-wide uppercase">Phone preview</div>
        <div className="p-4 bg-gradient-to-br from-surface-container-low to-white">
          <div className="rounded-xl border border-border bg-white/95 shadow-dropdown p-3 flex gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <span className="text-white text-[10px] font-bold">BP</span>
            </div>
            <div className="min-w-0">
              <div className="text-[9px] font-semibold text-text-secondary uppercase tracking-wider">BuyerPocket</div>
              <p className="text-[13px] font-semibold text-primary mt-0.5">Follow up: Sarah Jenkins</p>
              <p className="text-[11px] text-text-secondary mt-1">Due now · tap to open profile</p>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-white shadow-sm p-3 flex gap-3 items-center">
        <div className="h-9 w-9 rounded-full bg-secondary/12 text-secondary flex items-center justify-center text-[10px] font-bold">
          SJ
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[12px] font-semibold text-primary truncate">Sarah Jenkins</div>
          <div className="text-[10px] text-text-secondary">Wollert · Call · Log note</div>
        </div>
      </div>
    </div>
  );
}

export function FeaturesNotesTimelineMockup() {
  return (
    <div
      className="w-full max-w-[420px] rounded-2xl border border-border/90 bg-white shadow-card p-4 select-none pointer-events-none motion-safe:transition-shadow motion-safe:hover:shadow-dropdown"
      aria-hidden
    >
      <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-text-secondary mb-4">Activity & notes</div>
      <div className="space-y-0 border-l-2 border-teal-action/25 ml-2 pl-4">
        {[
          { date: "28 Apr, 2:14 pm", text: "Called — wants second inspection Saturday. Budget still firm." },
          { date: "22 Apr, 11:08 am", text: "Opened home · loved backyard. Mentioned needing 4 beds min." },
          { date: "15 Apr", text: "Met at OFI. Saving Wollert + Mernda. Pre-approval roughly $780k." },
        ].map((n, i) => (
          <div key={i} className="relative pb-5 last:pb-0">
            <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-teal-action/80 ring-4 ring-white" />
            <div className="text-[10px] font-medium text-text-secondary mb-1">{n.date}</div>
            <p className="text-[12px] text-primary leading-snug">{n.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FeaturesExportCsvMockup() {
  return (
    <div
      className="w-full max-w-[380px] rounded-2xl border border-border/90 bg-white shadow-card p-5 select-none pointer-events-none motion-safe:transition-shadow motion-safe:hover:shadow-dropdown"
      aria-hidden
    >
      <div className="text-[11px] font-semibold text-primary mb-4">Your data</div>
      <div className="rounded-xl border border-border bg-surface-container-low/50 divide-y divide-border">
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[13px] font-medium text-primary">Export buyers (CSV)</div>
            <div className="text-[11px] text-text-secondary mt-0.5">Downloads your list with main fields</div>
          </div>
          <svg className="h-10 w-10 shrink-0 text-teal-action/90" viewBox="0 0 40 40" fill="none" aria-hidden>
            <rect x="8" y="6" width="24" height="28" rx="2" stroke="currentColor" strokeWidth="1.25" opacity="0.35" />
            <path d="M14 26h12M17 21l3 4 3-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-[11px] text-text-secondary">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-teal-action/12 text-teal-action font-bold text-[10px]">
          CSV
        </span>
        Open in Excel or Google Sheets
      </div>
    </div>
  );
}

/** Three mini pillars for the features hero. */
export function FeaturesHeroTriplePills() {
  return (
    <div className="mt-10 flex flex-wrap justify-center gap-3 md:gap-4" aria-hidden>
      {[
        { l: "Capture", sub: "In seconds", c: "bg-teal-action/14 text-teal-action border-teal-action/25" },
        { l: "Filter", sub: "When listings hit", c: "bg-primary/10 text-primary border-primary/18" },
        { l: "Remind", sub: "On your phone", c: "bg-brand-teal/12 text-teal-action border-brand-teal/25" },
      ].map(({ l, sub, c }) => (
        <div
          key={l}
          className={`rounded-2xl border px-4 py-3 text-center min-w-[140px] ${c} motion-safe:transition-transform motion-safe:hover:-translate-y-0.5`}
        >
          <div className="text-sm font-bold tracking-[0.1em] uppercase">{l}</div>
          <div className="text-[13px] text-text-secondary mt-1">{sub}</div>
        </div>
      ))}
    </div>
  );
}
