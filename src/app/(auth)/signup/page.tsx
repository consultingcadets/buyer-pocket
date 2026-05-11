"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signUpWithEmail, signUpWithGoogle, type SignupState } from "./actions";
import { isNative } from "@/lib/capacitor/native";
import { signInWithGoogleNative } from "@/lib/capacitor/auth";

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
      <main className="flex min-h-screen flex-col items-center justify-center px-4 py-8 antialiased">
        <div className="mb-8">
          <span className="text-[24px] font-semibold text-primary">BuyerPocket</span>
        </div>
        <div className="app-section-card w-full max-w-[480px] rounded-xl p-6 md:p-8 flex flex-col gap-6 text-center">
          <h2 className="text-[32px] font-bold text-brand-navy">Check your email.</h2>
          <p className="text-[16px] text-text-secondary">
            We&apos;ve sent a confirmation link to your email address. Click it
            to continue setting up your account.
          </p>
          <p className="text-[14px] text-text-secondary">
            Already confirmed?{" "}
            <Link href="/login" className="text-teal-action font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    );
  }

  const strength = getPasswordStrength(password);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-8 antialiased">
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

        <div className="app-section-card w-full rounded-xl p-6 md:p-8 flex flex-col gap-6">
          <div className="text-center flex flex-col gap-1">
            <h2 className="text-[32px] font-bold tracking-tight text-primary">
              Start your 7-day free trial.
            </h2>
            <p className="text-[16px] text-text-secondary">
              No credit card needed.
            </p>
          </div>

          <form>
            <button
              type="submit"
              formAction={signUpWithGoogle}
              onClick={(e) => {
                if (isNative()) {
                  e.preventDefault();
                  signInWithGoogleNative();
                }
              }}
              className="w-full min-h-12 flex items-center justify-center gap-2 bg-white border border-primary rounded-lg text-primary text-[16px] font-semibold hover:bg-surface-container-low transition-colors"
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </form>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[14px] font-semibold tracking-widest text-text-secondary uppercase">
              or
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form action={formAction} className="flex flex-col gap-6">
            {state?.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-[14px] text-error">
                {(state as { error: string }).error}
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-[14px] font-semibold tracking-wider text-text-secondary uppercase">
                Full name
              </label>
              <input
                name="name"
                type="text"
                required
                autoComplete="name"
                className="w-full min-h-12 px-4 bg-white border border-border rounded-lg text-[16px] text-text-primary focus:outline-none focus:border-2 focus:border-teal-action transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[14px] font-semibold tracking-wider text-text-secondary uppercase">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full min-h-12 px-4 bg-white border border-border rounded-lg text-[16px] text-text-primary focus:outline-none focus:border-2 focus:border-teal-action transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[14px] font-semibold tracking-wider text-text-secondary uppercase">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full min-h-12 px-4 pr-12 bg-white border border-border rounded-lg text-[16px] text-text-primary focus:outline-none focus:border-2 focus:border-teal-action transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[14px] text-text-secondary hover:text-primary"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
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
                          : "bg-border"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[14px] font-semibold tracking-wider text-text-secondary uppercase">
                Mobile number{" "}
                <span className="text-text-secondary font-normal normal-case">
                  (optional)
                </span>
              </label>
              <div className="flex border border-border rounded-lg focus-within:border-2 focus-within:border-accent transition-colors overflow-hidden">
                <div className="min-h-12 px-4 flex items-center bg-surface-container border-r border-border shrink-0">
                  <span className="text-[16px] text-text-secondary">+61</span>
                </div>
                <input
                  name="mobile"
                  type="tel"
                  autoComplete="tel"
                  className="w-full min-h-12 px-4 bg-white border-none focus:outline-none focus:ring-0 text-[16px] text-text-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full min-h-12 mt-2 bg-teal-action text-on-teal-action text-[16px] font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-60"
            >
              {pending ? "Creating account…" : "Continue"}
            </button>
          </form>

          <p className="text-[14px] text-text-secondary text-center">
            By continuing, you agree to our Terms and Privacy Policy.
          </p>
        </div>
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
