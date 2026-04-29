"use client";

interface Props {
  onAddPayment: () => void;
  onExport: () => void;
}

export function TrialEndedModal({ onAddPayment, onExport }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred backdrop */}
      <div className="absolute inset-0 bg-brand-navy/40 backdrop-blur-sm" />

      <div className="relative z-10 bg-surface-container-lowest rounded-2xl shadow-[0_20px_60px_rgba(15,28,44,0.25)] w-full max-w-[440px] p-8 flex flex-col gap-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#006A62">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          </div>
        </div>

        {/* Copy */}
        <div className="flex flex-col items-center text-center gap-2">
          <h2 className="text-[24px] font-bold tracking-tight text-brand-navy">
            Your free trial has ended.
          </h2>
          <p className="text-[15px] text-on-surface-variant leading-relaxed">
            Add a payment method to continue using BuyerPocket Pro for $19 AUD/month.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onAddPayment}
            className="w-full bg-teal-action text-on-teal-action rounded min-h-[48px] px-6 text-[16px] font-semibold flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            Add payment method
          </button>
          <button
            onClick={onExport}
            className="w-full bg-transparent border border-outline-variant text-brand-navy hover:bg-surface-container rounded min-h-[48px] px-6 text-[15px] font-medium flex items-center justify-center transition-colors"
          >
            Export my buyers
          </button>
        </div>
      </div>
    </div>
  );
}
