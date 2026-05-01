"use client";

import { useActionState, useState } from "react";
import { saveEligibility, type EligibilityState } from "./actions";
import { useRouter } from "next/navigation";

const OPTIONS = [
  {
    value: "independent",
    label: "I'm an independent agent or principal",
    description: "I run my own agency, work as a sole trader, or otherwise own my buyer relationships.",
  },
  {
    value: "agency_permitted",
    label: "I work at an agency and have permission",
    description:
      "My agency knows about and permits the use of personal capture tools alongside the agency CRM.",
  },
  {
    value: "unconfirmed",
    label: "I work at an agency and I'm not sure",
    description: "I haven't checked with my principal or read my contract.",
  },
  {
    value: "something_else",
    label: "Something else",
    description: "I want to learn more before signing up.",
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
      <input type="hidden" name="eligibility" value={selected} />

      {state?.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-[14px] text-error">
          {state.error}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {OPTIONS.map((option) => {
          const isSelected = selected === option.value;
          return (
            <label
              key={option.value}
              className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                isSelected
                  ? "border-teal-action bg-surface-container-low"
                  : "border-border hover:border-border-strong"
              }`}
              onClick={() => setSelected(option.value)}
            >
              <div className="mt-0.5 flex items-center justify-center shrink-0">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected ? "border-teal-action" : "border-border"
                  }`}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-teal-action" />
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[16px] font-semibold text-primary">
                  {option.label}
                </span>
                {option.description && (
                  <span className="text-[14px] text-text-secondary mt-0.5">
                    {option.description}
                  </span>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {selected === "unconfirmed" && (
        <div className="bg-warning-bg border border-warning-text/20 rounded-lg p-4 flex flex-col gap-2">
          <p className="text-[14px] font-semibold text-warning-text">
            Please check your contract first.
          </p>
          <p className="text-[14px] text-warning-text">
            Buyer data captured during agency work is often agency property. If you proceed without confirming permission, you take responsibility for compliance with your employment terms.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3 mt-2">
        <button
          type="submit"
          disabled={pending || !selected}
          className="w-full min-h-12 bg-teal-action text-on-teal-action text-[16px] font-semibold rounded-lg hover:opacity-90 transition-all flex items-center justify-center disabled:opacity-40"
        >
          {pending ? "Saving…" : selected === "unconfirmed" ? "I've confirmed, continue" : "Continue"}
        </button>
        {selected === "unconfirmed" && (
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="w-full min-h-12 text-[16px] font-semibold text-text-secondary hover:text-primary transition-colors rounded-lg"
          >
            I&apos;ll come back later
          </button>
        )}
      </div>
    </form>
  );
}
