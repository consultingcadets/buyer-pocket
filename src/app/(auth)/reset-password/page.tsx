"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { updatePassword, type ResetPasswordState } from "./actions";
import { SUPPORT_EMAIL } from "@/lib/company";

export default function ResetPasswordPage() {
  const [state, formAction, pending] = useActionState<
    ResetPasswordState,
    FormData
  >(updatePassword, null);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <main className="min-h-screen bg-surface flex flex-col justify-center items-center p-4 antialiased">
      <div className="w-full max-w-[480px] flex flex-col gap-8">
        {/* Logo */}
        <div className="flex justify-center">
          <span className="text-brand-navy text-[24px] font-semibold tracking-tight">
            BuyerPocket
          </span>
        </div>

        {/* Card */}
        <div className="bg-surface-container-lowest rounded-lg shadow-[0_2px_4px_rgba(15,28,44,0.05),0_4px_6px_rgba(15,28,44,0.02)] p-8 w-full flex flex-col gap-6">
          <div className="flex flex-col gap-3 text-center">
            <h1 className="text-[32px] font-bold tracking-tight text-brand-navy">
              Reset your password
            </h1>
            <p className="text-[16px] text-on-surface-variant">
              Choose a new, strong password for your account.
            </p>
          </div>

          <form action={formAction} className="flex flex-col gap-6 mt-2">
            {state?.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-[14px] text-error">
                {state.error}
              </div>
            )}

            {/* New password */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="password"
                className="text-[14px] text-on-surface"
              >
                New password
              </label>
              <div className="relative w-full">
                <input
                  id="password"
                  name="password"
                  type={showNew ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  placeholder="Enter new password"
                  className="w-full bg-surface-container-lowest border border-[#E0E1DD] rounded text-on-surface text-[16px] px-4 py-3 focus:ring-0 focus:border-2 focus:border-brand-electric transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-brand-navy text-[14px] transition-colors"
                >
                  {showNew ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="confirm"
                className="text-[14px] text-on-surface"
              >
                Confirm new password
              </label>
              <div className="relative w-full">
                <input
                  id="confirm"
                  name="confirm"
                  type={showConfirm ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                  className="w-full bg-surface-container-lowest border border-[#E0E1DD] rounded text-on-surface text-[16px] px-4 py-3 focus:ring-0 focus:border-2 focus:border-brand-electric transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-brand-navy text-[14px] transition-colors"
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={pending}
              className="w-full bg-brand-teal text-white text-[14px] font-semibold tracking-wider rounded py-3.5 px-6 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-teal mt-2 disabled:opacity-60"
            >
              {pending ? "Updating…" : "Update password"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-[14px] text-outline">
            Need help?{" "}
            <Link
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-brand-electric hover:underline"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
