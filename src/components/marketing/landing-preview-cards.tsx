/**
 * Static UI-style preview cards for the marketing landing page (not live app data).
 */

export function HeroProductMockup() {
  return (
    <div
      className="w-full max-w-[400px] rounded-xl border border-border bg-white shadow-card overflow-hidden select-none pointer-events-none"
      aria-hidden
    >
      <div className="px-4 py-3 bg-primary/[0.04] border-b border-border flex items-center gap-2">
        <span className="h-8 w-8 rounded-full bg-secondary/15 text-secondary flex items-center justify-center text-[11px] font-bold">
          SJ
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold text-primary truncate">Sarah Jenkins</div>
          <div className="text-[11px] text-text-secondary truncate">Buyer · Saved today</div>
        </div>
      </div>
      <dl className="divide-y divide-border text-[13px]">
        <div className="px-4 py-2.5 flex justify-between gap-3">
          <dt className="text-text-secondary shrink-0">Suburb focus</dt>
          <dd className="font-medium text-primary text-right">Wollert, VIC + nearby</dd>
        </div>
        <div className="px-4 py-2.5 flex justify-between gap-3">
          <dt className="text-text-secondary shrink-0">Budget</dt>
          <dd className="font-medium text-primary text-right">$650k – $780k</dd>
        </div>
        <div className="px-4 py-2.5 flex justify-between gap-3">
          <dt className="text-text-secondary shrink-0">Bedrooms</dt>
          <dd className="font-medium text-primary text-right">4+</dd>
        </div>
        <div className="px-4 py-2.5 flex justify-between gap-3 bg-surface-container-low/80">
          <dt className="text-text-secondary shrink-0">Reminder</dt>
          <dd className="font-medium text-primary text-right">Tomorrow, 9:00 AM</dd>
        </div>
      </dl>
      <div className="px-4 py-2.5 text-[11px] text-text-secondary bg-surface-container-low border-t border-border">
        Tap notification to open this buyer · push enabled
      </div>
    </div>
  );
}

export function CompactNotificationPreview() {
  return (
    <div className="rounded-lg border border-border bg-white p-2.5 flex gap-2.5 shadow-dropdown" aria-hidden>
      <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
        <span className="text-[9px] font-bold text-white">BP</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex justify-between items-start gap-2 mb-0.5">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-text-secondary">BuyerPocket</span>
          <span className="text-[10px] text-text-secondary">now</span>
        </div>
        <p className="text-[12px] font-semibold text-primary leading-tight">Follow up: Sarah Jenkins</p>
        <p className="text-[10px] text-text-secondary mt-0.5 line-clamp-2">Call before Saturday open · Wollert</p>
      </div>
    </div>
  );
}

export function QuickCapturePreviewCard() {
  return (
    <div
      className="rounded-xl border border-border bg-white shadow-card p-4 w-full max-w-[400px] select-none pointer-events-none"
      aria-hidden
    >
      <div className="text-[11px] font-semibold uppercase tracking-wide text-text-secondary mb-3">Quick add</div>
      <div className="space-y-2.5">
        <div className="h-9 rounded-lg border border-border bg-surface-container-low px-3 flex items-center text-[12px] text-primary font-medium">
          Alex Rivera
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="h-9 rounded-lg border border-border bg-surface-container-low px-2 flex items-center text-[11px] text-text-secondary">
            0421 990 022
          </div>
          <div className="h-9 rounded-lg border border-border bg-surface-container-low px-2 flex items-center text-[11px] text-text-secondary">
            Hillside VIC
          </div>
        </div>
        <button
          type="button"
          className="w-full min-h-[40px] rounded-[10px] bg-teal-action text-on-teal-action text-[13px] font-semibold flex items-center justify-center"
          tabIndex={-1}
        >
          Save buyer
        </button>
      </div>
    </div>
  );
}

export function BuyersListPreviewCard() {
  return (
    <div
      className="rounded-xl border border-border bg-white shadow-card overflow-hidden text-[13px] select-none pointer-events-none w-full max-w-[400px]"
      aria-hidden
    >
      <div className="px-3 py-2 border-b border-border bg-surface-container-low/60 flex justify-between items-center">
        <span className="font-semibold text-primary">Buyers</span>
        <span className="text-text-secondary text-[11px]">12 active</span>
      </div>
      <div className="divide-y divide-border">
        {[
          { name: "Sarah Jenkins", tag: "Hot", tagClass: "bg-secondary/12 text-secondary" },
          { name: "Marcus Webb", tag: "Warm", tagClass: "bg-primary/8 text-primary" },
          { name: "Priya Sharma", tag: "Hot", tagClass: "bg-secondary/12 text-secondary" },
        ].map((row) => (
          <div key={row.name} className="px-3 py-2.5 flex items-center justify-between gap-2">
            <span className="font-medium text-primary truncate">{row.name}</span>
            <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${row.tagClass}`}>
              {row.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FilterPanelPreviewCard() {
  return (
    <div
      className="rounded-xl border border-border bg-white shadow-card p-4 w-full max-w-[400px] select-none pointer-events-none"
      aria-hidden
    >
      <div className="text-[11px] font-semibold tracking-wide uppercase text-text-secondary mb-3">Filters</div>
      <div className="flex flex-wrap gap-2 mb-4">
        {["Suburb", "Budget", "Beds", "Land"].map((l) => (
          <span
            key={l}
            className="text-[12px] px-3 py-1.5 rounded-full border border-border bg-surface-container-low text-primary font-medium"
          >
            {l}
          </span>
        ))}
      </div>
      <div className="space-y-2 text-[12px]">
        <div className="flex justify-between text-text-secondary">
          <span>Suburb contains</span>
          <span className="text-primary font-medium">Wollert</span>
        </div>
        <div className="flex justify-between text-text-secondary">
          <span>Min beds</span>
          <span className="text-primary font-medium">4</span>
        </div>
        <div className="h-2 rounded-full bg-surface-container-high overflow-hidden">
          <div className="h-full w-[65%] rounded-full bg-teal-action" />
        </div>
        <p className="text-[11px] text-text-secondary pt-1">3 buyers match these filters</p>
      </div>
    </div>
  );
}

export function ReminderNotificationCard() {
  return (
    <div
      className="rounded-xl border border-border bg-white shadow-card overflow-hidden w-full max-w-[400px] select-none pointer-events-none"
      aria-hidden
    >
      <div className="px-3 py-2 bg-primary text-white text-[11px] font-semibold tracking-wide uppercase">
        Preview — phone lock screen
      </div>
      <div className="p-4 bg-gradient-to-br from-surface-container-low to-white">
        <div className="rounded-xl bg-white/95 backdrop-blur border border-border shadow-dropdown p-3 flex gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="text-white text-[10px] font-bold">BP</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex justify-between items-start gap-2 mb-1">
              <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">
                BuyerPocket
              </span>
              <span className="text-[11px] text-text-secondary">now</span>
            </div>
            <p className="text-[13px] font-semibold text-primary leading-snug">Follow up: Sarah Jenkins</p>
            <p className="text-[12px] text-text-secondary mt-0.5 line-clamp-2">
              Reminder set for Wollert buyer — call before open home Saturday.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Filter + short list — one combined preview for the “match” feature row. */
export function FilterWithMatchingBuyersPreview() {
  return (
    <div
      className="rounded-xl border border-border bg-white shadow-card overflow-hidden w-full max-w-[420px] md:max-w-[480px] select-none pointer-events-none"
      aria-hidden
    >
      <div className="grid md:grid-cols-5 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
        <div className="md:col-span-2 p-4 space-y-3">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary">Filters</div>
          <div className="flex flex-wrap gap-1.5">
            {["Suburb", "Beds", "Land"].map((l) => (
              <span
                key={l}
                className="text-[11px] px-2 py-1 rounded-md border border-border bg-surface-container-low text-primary font-medium"
              >
                {l}
              </span>
            ))}
          </div>
          <div className="space-y-1.5 text-[11px] text-text-secondary">
            <div className="flex justify-between">
              <span>Suburb contains</span>
              <span className="font-medium text-primary">Wollert</span>
            </div>
            <div className="flex justify-between">
              <span>Min beds</span>
              <span className="font-medium text-primary">4</span>
            </div>
          </div>
        </div>
        <div className="md:col-span-3 p-4 bg-surface-container-low/40">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary mb-2">Matches</div>
          <div className="space-y-2">
            {[
              { name: "Sarah Jenkins", sub: "Budget $650k+", t: "Hot" },
              { name: "Priya Sharma", sub: "Needs 4 bed", t: "Warm" },
            ].map((row) => (
              <div
                key={row.name}
                className="flex items-center justify-between gap-2 rounded-lg bg-white border border-border/80 px-3 py-2 shadow-sm"
              >
                <div className="min-w-0">
                  <div className="text-[12px] font-semibold text-primary truncate">{row.name}</div>
                  <div className="text-[10px] text-text-secondary">{row.sub}</div>
                </div>
                <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-teal-action/12 text-teal-action shrink-0">
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
