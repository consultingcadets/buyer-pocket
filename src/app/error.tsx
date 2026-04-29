"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[App error]", error.digest ?? error.message);
  }, [error]);

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-text-primary mb-2">Something went wrong.</h1>
      <p className="text-base text-text-secondary max-w-xs mb-8">
        An unexpected error occurred. Try again, or contact support if the problem persists.
      </p>
      {error.digest && (
        <p className="text-xs text-text-secondary mb-6 font-mono">Error ID: {error.digest}</p>
      )}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="h-12 px-6 rounded-lg bg-secondary text-white font-semibold text-base"
        >
          Try again
        </button>
        <Link
          href="/today"
          className="h-12 px-6 rounded-lg border border-border text-text-primary font-medium text-base inline-flex items-center"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
