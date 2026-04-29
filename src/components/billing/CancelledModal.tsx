"use client";

interface Props {
  accessLevel: "read_only" | "export_only" | "expired";
  onResubscribe: () => void;
  onExport: () => void;
  onContinueReadOnly?: () => void;
}

export function CancelledModal({
  accessLevel,
  onResubscribe,
  onExport,
  onContinueReadOnly,
}: Props) {
  const isExpired = accessLevel === "expired";

  const subtitle = isExpired
    ? "Your subscription has expired. Resubscribe to regain full access."
    : accessLevel === "export_only"
    ? "Export your data before access is permanently removed."
    : "Your subscription is cancelled. You have read-only access until the end of your billing period.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-navy/40 backdrop-blur-sm" />

      <div className="relative z-10 bg-surface-container-lowest rounded-2xl shadow-[0_20px_60px_rgba(15,28,44,0.25)] w-full max-w-[440px] p-8 flex flex-col gap-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#75777D">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          </div>
        </div>

        <div className="flex flex-col items-center text-center gap-2">
          <h2 className="text-[24px] font-bold tracking-tight text-brand-navy">
            Your subscription is cancelled.
          </h2>
          <p className="text-[15px] text-on-surface-variant leading-relaxed">{subtitle}</p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onResubscribe}
            className="w-full bg-teal-action text-on-teal-action rounded min-h-[48px] px-6 text-[16px] font-semibold flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            Resubscribe — $19 AUD/month
          </button>
          <button
            onClick={onExport}
            className="w-full bg-transparent border border-outline-variant text-brand-navy hover:bg-surface-container rounded min-h-[48px] px-6 text-[15px] font-medium flex items-center justify-center transition-colors"
          >
            Export my buyers
          </button>
          {accessLevel === "read_only" && onContinueReadOnly && (
            <button
              onClick={onContinueReadOnly}
              className="w-full text-on-surface-variant hover:text-brand-navy text-[14px] font-medium py-2 transition-colors"
            >
              Continue with read-only access
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
