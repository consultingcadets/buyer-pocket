"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { saveProfile, type ProfileState } from "./actions";

const DOTS = [false, false, true, false];

const STATES = [
  { value: "NSW", label: "New South Wales (NSW)" },
  { value: "VIC", label: "Victoria (VIC)" },
  { value: "QLD", label: "Queensland (QLD)" },
  { value: "WA", label: "Western Australia (WA)" },
  { value: "SA", label: "South Australia (SA)" },
  { value: "TAS", label: "Tasmania (TAS)" },
  { value: "ACT", label: "Australian Capital Territory (ACT)" },
  { value: "NT", label: "Northern Territory (NT)" },
];

const TIMEZONES = [
  { value: "Australia/Sydney", label: "Australian Eastern Standard Time (AEST)" },
  { value: "Australia/Sydney_DST", label: "Australian Eastern Daylight Time (AEDT)" },
  { value: "Australia/Darwin", label: "Australian Central Standard Time (ACST)" },
  { value: "Australia/Adelaide", label: "Australian Central Daylight Time (ACDT)" },
  { value: "Australia/Perth", label: "Australian Western Standard Time (AWST)" },
];

const selectClass =
  "w-full h-12 px-4 appearance-none bg-surface-container-lowest border border-outline-variant rounded focus:outline-none focus:border-teal-action focus:ring-1 focus:ring-teal-action transition-colors text-[16px] text-on-surface";

export default function ProfilePage() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ProfileState, FormData>(
    saveProfile,
    null
  );

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8 antialiased">
      <div className="w-full max-w-[480px] bg-surface-container-lowest rounded-lg shadow-[0px_4px_20px_rgba(13,27,42,0.05)] border border-surface-variant p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 items-center text-center">
          <div className="text-[32px] font-bold tracking-tight text-on-surface">
            BuyerPocket
          </div>
          {/* Progress dots */}
          <div className="flex items-center gap-2">
            {DOTS.map((active, i) => (
              <div
                key={i}
                className={`rounded-full ${
                  active
                    ? "w-2 h-2 bg-brand-navy"
                    : "w-2 h-2 bg-surface-variant"
                }`}
              />
            ))}
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-[32px] font-bold tracking-tight text-on-surface">
              Set up your profile
            </h1>
            <p className="text-[16px] text-on-surface-variant">
              Complete your professional details to personalize your BuyerPocket
              experience.
            </p>
          </div>
        </div>

        {/* Form */}
        <form action={formAction} className="flex flex-col gap-6">
          {state?.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-[14px] text-error">
              {state.error}
            </div>
          )}

          {/* Agency name */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="agency_name"
              className="text-[14px] font-semibold tracking-wider text-on-surface uppercase"
            >
              Agency name{" "}
              <span className="text-on-surface-variant font-normal normal-case ml-1">
                (Optional)
              </span>
            </label>
            <input
              id="agency_name"
              name="agency_name"
              type="text"
              placeholder="e.g. Ray White, LJ Hooker"
              className="w-full h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded focus:outline-none focus:border-teal-action focus:ring-1 focus:ring-teal-action transition-colors text-[16px] text-on-surface placeholder:text-outline"
            />
            <p className="text-[14px] text-on-surface-variant">
              This will appear on reports and client communications.
            </p>
          </div>

          {/* State */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="state"
              className="text-[14px] font-semibold tracking-wider text-on-surface uppercase"
            >
              State
            </label>
            <div className="relative">
              <select id="state" name="state" defaultValue="" className={selectClass}>
                <option value="" disabled>
                  Select a State
                </option>
                {STATES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[20px]">
                ▾
              </span>
            </div>
          </div>

          {/* Timezone */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="timezone"
              className="text-[14px] font-semibold tracking-wider text-on-surface uppercase"
            >
              Timezone
            </label>
            <div className="relative">
              <select
                id="timezone"
                name="timezone"
                defaultValue=""
                className={selectClass}
              >
                <option value="" disabled>
                  Select a Timezone
                </option>
                {TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[20px]">
                ▾
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 mt-2">
            <button
              type="submit"
              disabled={pending}
              className="w-full h-12 bg-teal-action text-on-teal-action text-[16px] font-semibold rounded flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {pending ? "Saving…" : "Continue"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full h-12 bg-transparent text-on-surface text-[16px] font-semibold rounded flex items-center justify-center hover:bg-surface-container-low transition-colors"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
