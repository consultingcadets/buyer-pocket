"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signUpWithEmail, signUpWithGoogle, type SignupState } from "./actions";

const DOTS = [true, false, false, false];

export default function SignupPage() {
  const [state, formAction, pending] = useActionState<SignupState, FormData>(
    signUpWithEmail,
    null
  );
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  if (state && "checkEmail" in state) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8 antialiased">
        <div className="w-full max-w-[480px] bg-surface-container-lowest rounded-lg shadow-[var(--shadow-card-resting)] p-8 flex flex-col gap-6 text-center">
          <h2 className="text-[32px] font-bold text-brand-navy">Check your email.</h2>
          <p className="text-[16px] text-on-surface-variant">
            We&apos;ve sent a confirmation link to your email address. Click it
            to continue setting up your account.
          </p>
          <p className="text-[14px] text-on-surface-variant">
            Already confirmed?{" "}
            <Link href="/login" className="text-brand-teal font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    );
  }

  const strength = getPasswordStrength(password);

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8 antialiased">
      <div className="w-full max-w-[480px] bg-surface-container-lowest rounded-lg shadow-[var(--shadow-card-resting)] p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-[32px] font-bold tracking-tight text-brand-navy">
            BuyerPocket
          </h1>
          {/* Progress dots */}
          <div className="flex items-center gap-2">
            {DOTS.map((active, i) => (
              <div
                key={i}
                className={`rounded-full transition-all ${
                  active ? "w-2 h-2 bg-brand-navy" : "w-2 h-2 bg-surface-variant"
                }`}
              />
            ))}
          </div>
          <div className="text-center flex flex-col gap-1">
            <h2 className="text-[32px] font-bold tracking-tight text-brand-navy">
              Start your 7-day free trial.
            </h2>
            <p className="text-[16px] text-on-surface-variant">
              No credit card needed.
            </p>
          </div>
        </div>

        {/* Google OAuth */}
        <form>
          <button
            type="submit"
            formAction={signUpWithGoogle}
            className="w-full h-12 flex items-center justify-center gap-2 bg-surface-container-lowest border border-brand-navy rounded text-brand-navy text-[16px] font-semibold hover:bg-surface-container-low transition-colors"
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-surface-variant" />
          <span className="text-[14px] font-semibold tracking-widest text-on-surface-variant uppercase">
            or
          </span>
          <div className="flex-1 h-px bg-surface-variant" />
        </div>

        {/* Email/password form */}
        <form action={formAction} className="flex flex-col gap-6">
          {state?.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-[14px] text-error">
              {(state as { error: string }).error}
            </div>
          )}

          {/* Full name */}
          <div className="flex flex-col gap-1">
            <label className="text-[14px] font-semibold tracking-wider text-on-surface-variant uppercase">
              Full name
            </label>
            <input
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Jane Doe"
              className="w-full h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded text-[16px] text-on-surface focus:outline-none focus:border-teal-action focus:ring-1 focus:ring-teal-action transition-colors"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-[14px] font-semibold tracking-wider text-on-surface-variant uppercase">
              Email address
            </label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="jane@example.com"
              className="w-full h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded text-[16px] text-on-surface focus:outline-none focus:border-teal-action focus:ring-1 focus:ring-teal-action transition-colors"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-[14px] font-semibold tracking-wider text-on-surface-variant uppercase">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 pr-12 bg-surface-container-lowest border border-outline-variant rounded text-[16px] text-on-surface focus:outline-none focus:border-teal-action focus:ring-1 focus:ring-teal-action transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[14px] text-on-surface-variant hover:text-brand-navy"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {/* Password strength indicator */}
            {password.length > 0 && (
              <div className="flex gap-1 mt-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i < strength
                        ? strength === 1
                          ? "bg-error"
                          : strength === 2
                          ? "bg-warning-strong"
                          : "bg-secondary"
                        : "bg-surface-variant"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Mobile (optional) */}
          <div className="flex flex-col gap-1">
            <label className="text-[14px] font-semibold tracking-wider text-on-surface-variant uppercase">
              Mobile number{" "}
              <span className="text-on-surface-variant font-normal normal-case">
                (optional)
              </span>
            </label>
            <div className="flex border border-outline-variant rounded focus-within:border-teal-action focus-within:ring-1 focus-within:ring-teal-action transition-colors overflow-hidden">
              <div className="h-12 px-4 flex items-center bg-surface-container border-r border-outline-variant shrink-0">
                <span className="text-[16px] text-on-surface-variant">+61</span>
              </div>
              <input
                name="mobile"
                type="tel"
                autoComplete="tel"
                placeholder="400 000 000"
                className="w-full h-12 px-4 bg-surface-container-lowest border-none focus:outline-none focus:ring-0 text-[16px] text-on-surface"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={pending}
            className="w-full h-12 mt-2 bg-teal-action text-on-teal-action text-[16px] font-semibold rounded hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-60"
          >
            {pending ? "Creating account…" : "Continue"}
          </button>
        </form>

        {/* Terms */}
        <p className="text-[14px] text-on-surface-variant text-center">
          By continuing, you agree to our{" "}
          <a href="#" className="text-brand-navy underline hover:text-teal-action transition-colors">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-brand-navy underline hover:text-teal-action transition-colors">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </main>
  );
}

function getPasswordStrength(password: string): 0 | 1 | 2 | 3 {
  if (password.length === 0) return 0;
  if (password.length < 8) return 1;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const score = [hasUpper, hasNumber, hasSymbol].filter(Boolean).length;
  if (password.length >= 12 && score >= 2) return 3;
  if (score >= 1) return 2;
  return 1;
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
