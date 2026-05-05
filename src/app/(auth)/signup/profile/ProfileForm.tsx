"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AU_TIMEZONE_OPTIONS,
  DEFAULT_TIMEZONE_BY_STATE,
} from "@/lib/australia-profile";
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

const selectClass =
  "w-full min-h-12 px-4 appearance-none bg-white border border-border rounded-lg focus:outline-none focus:border-2 focus:border-accent transition-colors text-[16px] text-text-primary";

const inputClass =
  "w-full min-h-12 px-4 bg-white border border-border rounded-lg focus:outline-none focus:border-2 focus:border-accent transition-colors text-[16px] text-text-primary";

export function ProfileForm({
  initialName,
  needsName,
  needsMobile,
}: {
  initialName: string;
  needsName: boolean;
  needsMobile: boolean;
}) {
  const router = useRouter();
  const [stateVal, setStateVal] = useState("");
  const [timezoneVal, setTimezoneVal] = useState("");
  const [formState, formAction, pending] = useActionState<ProfileState, FormData>(
    saveProfile,
    null
  );

  function handleStateChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const v = e.target.value;
    setStateVal(v);
    const tz = DEFAULT_TIMEZONE_BY_STATE[v];
    if (tz) setTimezoneVal(tz);
  }

  return (
    <main className="min-h-screen bg-surface-container-low flex flex-col items-center justify-center px-4 py-8 antialiased">
      <div className="w-full max-w-[480px] flex flex-col items-center">
        <div className="mb-6">
          <span className="text-[24px] font-semibold text-primary">BuyerPocket</span>
        </div>
        <div className="flex items-center gap-2 mb-6">
          {DOTS.map((active, i) => (
            <span
              key={i}
              className={active ? "w-2 h-2 rounded-full bg-primary" : "w-2 h-2 rounded-full border border-border bg-transparent"}
            />
          ))}
        </div>

        <div className="w-full bg-white rounded-lg shadow-card border border-border p-6 md:p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2 items-center text-center">
            <h1 className="text-[32px] font-bold tracking-tight text-primary">
              Set up your profile.
            </h1>
            <p className="text-[16px] text-text-secondary">
              We&apos;ll use this for your reminders and exports.
            </p>
          </div>

          <form action={formAction} className="flex flex-col gap-6">
            {formState?.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-[14px] text-error">
                {formState.error}
              </div>
            )}

            {/* Name — only shown for OAuth users who don't have one */}
            {needsName && (
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="name"
                  className="text-[14px] font-semibold tracking-wider text-text-secondary uppercase"
                >
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  defaultValue={initialName}
                  autoComplete="name"
                  className={inputClass}
                />
              </div>
            )}

            {/* Mobile — only shown when missing */}
            {needsMobile && (
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="mobile"
                  className="text-[14px] font-semibold tracking-wider text-text-secondary uppercase"
                >
                  Mobile number{" "}
                  <span className="text-text-secondary font-normal normal-case ml-1">
                    (optional)
                  </span>
                </label>
                <div className="flex">
                  <span className="flex items-center px-3 border border-r-0 border-border rounded-l-lg bg-surface-container text-[16px] text-text-secondary select-none">
                    +61
                  </span>
                  <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    autoComplete="tel-national"
                    placeholder="4XX XXX XXX"
                    className="flex-1 min-h-12 px-4 bg-white border border-border rounded-r-lg focus:outline-none focus:border-2 focus:border-accent transition-colors text-[16px] text-text-primary"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label
                htmlFor="agency_name"
                className="text-[14px] font-semibold tracking-wider text-text-secondary uppercase"
              >
                Agency name{" "}
                <span className="text-text-secondary font-normal normal-case ml-1">
                  (optional)
                </span>
              </label>
              <input
                id="agency_name"
                name="agency_name"
                type="text"
                className={inputClass}
              />
              <p className="text-[14px] text-text-secondary">
                If you work alone, leave this blank
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="state"
                className="text-[14px] font-semibold tracking-wider text-text-secondary uppercase"
              >
                State
              </label>
              <div className="relative">
                <select
                  id="state"
                  name="state"
                  value={stateVal}
                  onChange={handleStateChange}
                  className={selectClass}
                >
                  <option value="" disabled>
                    Select a state
                  </option>
                  {STATES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none text-[20px]">
                  ▾
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="timezone"
                className="text-[14px] font-semibold tracking-wider text-text-secondary uppercase"
              >
                Timezone
              </label>
              <p className="text-[13px] text-text-secondary -mt-1 mb-1">
                Auto-detected from your device
              </p>
              <div className="relative">
                <select
                  id="timezone"
                  name="timezone"
                  value={timezoneVal}
                  onChange={(e) => setTimezoneVal(e.target.value)}
                  className={selectClass}
                >
                  <option value="" disabled>
                    Select a timezone
                  </option>
                  {AU_TIMEZONE_OPTIONS.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none text-[20px]">
                  ▾
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <button
                type="submit"
                disabled={pending}
                className="w-full min-h-12 bg-teal-action text-on-teal-action text-[16px] font-semibold rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {pending ? "Saving…" : "Continue"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full min-h-12 bg-transparent text-text-secondary text-[16px] font-semibold rounded-lg flex items-center justify-center hover:bg-surface-container-low transition-colors"
              >
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
