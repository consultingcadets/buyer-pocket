"use client";

import { useActionState } from "react";
import Link from "next/link";
import { sendResetLink, type ForgotPasswordState } from "./actions";

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState<
    ForgotPasswordState,
    FormData
  >(sendResetLink, null);

  return (
    <main className="min-h-screen bg-background flex flex-col antialiased">
      <div className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 w-full">
        <div className="w-full max-w-[480px]">
          <div className="bg-surface-container-lowest rounded-lg shadow-[0_2px_8px_-2px_rgba(15,28,44,0.08),0_4px_16px_-4px_rgba(15,28,44,0.04)] p-8 w-full flex flex-col gap-6">
            {/* Logo */}
            <div className="flex justify-center pb-2">
              <span className="text-[32px] font-bold tracking-tight text-brand-navy">
                BuyerPocket
              </span>
            </div>

            {/* Header */}
            <div className="flex flex-col gap-1 text-center">
              <h1 className="text-[24px] font-semibold text-on-surface">
                Forgot your password?
              </h1>
              <p className="text-[16px] text-on-surface-variant">
                Enter the email address associated with your account and
                we&apos;ll send you a link to reset your password.
              </p>
            </div>

            {state && "success" in state ? (
              <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-4 text-center">
                <p className="text-[16px] font-semibold text-green-800 mb-1">
                  Check your inbox.
                </p>
                <p className="text-[14px] text-green-700">
                  We&apos;ve sent a password reset link to your email address.
                </p>
              </div>
            ) : (
              <form action={formAction} className="flex flex-col gap-6 mt-2">
                {state?.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-[14px] text-error">
                    {(state as { error: string }).error}
                  </div>
                )}

                {/* Email */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="email"
                    className="text-[14px] text-on-surface-variant mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="e.g. james@eliterealty.com.au"
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded p-3 text-[16px] text-on-surface focus:outline-none focus:border-brand-electric focus:ring-1 focus:ring-brand-electric transition-colors h-12"
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={pending}
                    className="w-full bg-brand-teal hover:opacity-90 text-white text-[14px] font-semibold tracking-wider py-3.5 px-4 rounded transition-colors flex justify-center items-center h-12 disabled:opacity-60"
                  >
                    {pending ? "Sending…" : "Send reset link"}
                  </button>
                  <Link
                    href="/login"
                    className="w-full text-center text-brand-navy hover:text-brand-electric text-[16px] transition-colors py-2 inline-block"
                  >
                    Back to login
                  </Link>
                </div>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-[14px] text-on-surface-variant opacity-70">
              © 2026 BuyerPocket. Built in Australia.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
