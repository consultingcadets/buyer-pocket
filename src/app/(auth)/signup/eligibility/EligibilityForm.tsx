"use client";

import { useActionState, useState } from "react";
import { saveEligibility, type EligibilityState } from "./actions";
import { useRouter } from "next/navigation";

const OPTIONS = [
  {
    value: "independent",
    label: "Independent agent or Principal",
    description: "I own my buyer relationships and operate independently.",
  },
  {
    value: "agency_permitted",
    label: "Agency work with permission",
    description:
      "I work for an agency but have explicit permission to use external tools.",
  },
  {
    value: "unconfirmed",
    label: "Agency work — not sure",
    description: "I work for an agency and am unsure about tool policies.",
  },
  {
    value: "something_else",
    label: "Something else",
    description: null,
  },
] as const;

export function EligibilityForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<EligibilityState, FormData>(
    saveEligibility,
    null
  );
  const [selected, setSelected] = useState<string>("");

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {/* Hidden field carries the selected value */}
      <input type="hidden" name="eligibility" value={selected} />

      {state?.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-[14px] text-error">
          {state.error}
        </div>
      )}

      {/* Radio options */}
      <div className="flex flex-col gap-4">
        {OPTIONS.map((option) => {
          const isSelected = selected === option.value;
          return (
            <label
              key={option.value}
              className={`flex items-start gap-4 p-4 rounded border cursor-pointer transition-colors ${
                isSelected
                  ? "border-teal-action bg-surface-container-low"
                  : "border-surface-variant hover:border-outline-variant"
              }`}
              onClick={() => setSelected(option.value)}
            >
              <div className="mt-0.5 flex items-center justify-center shrink-0">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected
                      ? "border-teal-action"
                      : "border-outline-variant"
                  }`}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-teal-action" />
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[16px] font-semibold text-brand-navy">
                  {option.label}
                </span>
                {option.description && (
                  <span className="text-[14px] text-on-surface-variant mt-0.5">
                    {option.description}
                  </span>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {/* Warning card for "unconfirmed" */}
      {selected === "unconfirmed" && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex flex-col gap-2">
          <p className="text-[14px] font-semibold text-amber-900">
            Check with your agency first.
          </p>
          <p className="text-[14px] text-amber-800">
            Using external tools without your agency&apos;s explicit permission
            may violate your agency&apos;s policies. By continuing, you
            acknowledge this risk and take personal responsibility for checking
            your agency&apos;s tool policies before using BuyerPocket.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center mt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-[16px] font-semibold text-on-surface-variant hover:text-brand-navy transition-colors py-2 px-4 rounded"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={pending || !selected}
          className="bg-teal-action text-on-teal-action text-[16px] font-semibold h-12 px-6 rounded hover:opacity-90 transition-all flex items-center justify-center disabled:opacity-40"
        >
          {pending ? "Saving…" : "Continue"}
        </button>
      </div>
    </form>
  );
}
