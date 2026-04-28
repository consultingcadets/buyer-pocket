"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { loginWithEmail, loginWithGoogle, type LoginState } from "./actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    loginWithEmail,
    null
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-8 antialiased">
      <div className="w-full max-w-[480px] flex flex-col items-center">
        {/* Logo */}
        <div className="mb-6">
          <span className="text-[24px] font-bold tracking-tighter text-brand-navy">
            BuyerPocket
          </span>
        </div>

        {/* Card */}
        <div className="bg-surface-container-lowest w-full rounded-lg shadow-[var(--shadow-card-resting)] p-8 flex flex-col gap-6 border border-surface-container">
          {/* Header */}
          <div className="flex flex-col gap-1 text-center">
            <h1 className="text-[32px] font-bold leading-tight tracking-tight text-brand-navy">
              Welcome back.
            </h1>
            <p className="text-[16px] leading-relaxed text-on-surface-variant">
              Sign in to your buyer list.
            </p>
          </div>

          {/* Google OAuth */}
          <form>
            <button
              type="submit"
              formAction={loginWithGoogle}
              className="w-full flex items-center justify-center gap-2 bg-surface-container-lowest text-brand-navy text-[14px] font-semibold tracking-wider py-4 px-4 rounded-lg border border-brand-navy hover:bg-surface-container-low transition-colors duration-200"
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-surface-container" />
            <span className="flex-shrink-0 mx-4 text-[14px] text-on-surface-variant bg-surface-container-lowest">
              or
            </span>
            <div className="flex-grow border-t border-surface-container" />
          </div>

          {/* Email/password form */}
          <form action={formAction} className="flex flex-col gap-4">
            {state?.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-[14px] text-error">
                {state.error}
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="email"
                className="text-[14px] text-on-surface-variant font-medium"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="Enter your email"
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-2 px-4 text-[16px] text-on-surface focus:outline-none focus:border-2 focus:border-brand-electric transition-all"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="password"
                className="text-[14px] text-on-surface-variant font-medium"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-2 pl-4 pr-12 text-[16px] text-on-surface focus:outline-none focus:border-2 focus:border-brand-electric transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[14px] text-on-surface-variant hover:text-brand-navy"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end mt-1">
              <Link
                href="/forgot-password"
                className="text-[14px] text-brand-electric hover:underline transition-all"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={pending}
              className="w-full bg-brand-teal text-white text-[14px] font-semibold tracking-wider py-4 px-4 rounded-lg hover:opacity-90 transition-opacity duration-200 mt-1 disabled:opacity-60"
            >
              {pending ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {/* Sign-up prompt */}
          <div className="text-center">
            <p className="text-[14px] text-on-surface-variant">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-brand-teal font-medium hover:underline"
              >
                Start free trial
              </Link>
            </p>
          </div>
        </div>

        {/* Terms footer */}
        <div className="mt-6 text-center px-4">
          <p className="text-[12px] text-on-surface-variant">
            By continuing, you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
