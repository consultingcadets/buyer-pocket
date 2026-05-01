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
    <main className="min-h-screen bg-surface-container-low flex flex-col items-center justify-center px-4 py-8 antialiased">
      <div className="w-full max-w-[480px] flex flex-col items-center">
        <div className="mb-8">
          <span className="text-[24px] font-semibold text-primary">BuyerPocket</span>
        </div>
        <div className="w-full bg-white rounded-lg shadow-card p-6 md:p-8 border border-border flex flex-col gap-6">
          <div className="flex flex-col gap-1 text-center">
            <h1 className="text-[32px] font-bold text-primary">
              Forgot your password?
            </h1>
            <p className="text-[16px] text-text-secondary">
              Enter your account email and we&apos;ll send you a reset link.
            </p>
          </div>

          {state && "success" in state ? (
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-4 text-center">
              <h2 className="text-[24px] font-semibold text-primary mb-1">
                Check your email.
              </h2>
              <p className="text-[14px] text-text-secondary">
                If that email is registered with BuyerPocket, you&apos;ll get a reset link in the next minute. Check your spam folder if you don&apos;t see it.
              </p>
              <Link
                href="/login"
                className="inline-block mt-4 text-[16px] text-accent hover:underline"
              >
                Back to login
              </Link>
            </div>
          ) : (
            <form action={formAction} className="flex flex-col gap-6 mt-2">
              {state?.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-[14px] text-error">
                  {(state as { error: string }).error}
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="email"
                  className="text-[14px] text-text-secondary mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full min-h-12 bg-white border border-border rounded-lg p-3 text-[16px] text-text-primary focus:outline-none focus:border-2 focus:border-accent transition-colors"
                />
              </div>

              <div className="flex flex-col gap-4 pt-2">
                <button
                  type="submit"
                  disabled={pending}
                  className="w-full min-h-12 bg-teal-action hover:opacity-90 text-white text-[16px] font-semibold rounded-lg transition-colors flex justify-center items-center disabled:opacity-60"
                >
                  {pending ? "Sending…" : "Send reset link"}
                </button>
                <Link
                  href="/login"
                  className="w-full text-center text-text-secondary hover:text-primary text-[16px] transition-colors py-2 inline-block"
                >
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
