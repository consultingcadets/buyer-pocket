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
    <main className="min-h-screen bg-surface-container-low flex flex-col justify-center items-center p-4 antialiased">
      <div className="w-full max-w-[480px] flex flex-col items-center">
        <div className="mb-8">
          <span className="text-primary text-[24px] font-semibold tracking-tight">
            BuyerPocket
          </span>
        </div>

        <div className="bg-white rounded-lg shadow-card border border-border p-6 md:p-8 w-full flex flex-col gap-6">
          <div className="flex flex-col gap-3 text-center">
            <h1 className="text-[32px] font-bold tracking-tight text-primary">
              Choose a new password.
            </h1>
            <p className="text-[16px] text-text-secondary">
              Make it something you&apos;ll remember.
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
                className="text-[14px] text-text-secondary"
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
                  className="w-full min-h-12 bg-white border border-border rounded-lg text-text-primary text-[16px] px-4 py-3 focus:ring-0 focus:border-2 focus:border-accent transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary text-[14px] transition-colors"
                >
                  {showNew ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="confirm"
                className="text-[14px] text-text-secondary"
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
                  className="w-full min-h-12 bg-white border border-border rounded-lg text-text-primary text-[16px] px-4 py-3 focus:ring-0 focus:border-2 focus:border-accent transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary text-[14px] transition-colors"
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={pending}
              className="w-full min-h-12 bg-teal-action text-white text-[16px] font-semibold rounded-lg py-3 px-6 hover:opacity-90 transition-opacity mt-2 disabled:opacity-60"
            >
              {pending ? "Updating…" : "Reset password"}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <p className="text-[14px] text-text-secondary">
            Need help?{" "}
            <Link
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-accent hover:underline"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
