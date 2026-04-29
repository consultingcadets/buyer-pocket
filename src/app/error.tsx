"use client";

import { useEffect } from "react";

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
      <h2 className="text-2xl font-bold text-text-primary mb-2">Something went wrong on our end.</h2>
      <p className="text-base text-text-secondary max-w-xs mb-8">
        We&apos;ve been notified. Try again in a moment.
      </p>
      {error.digest && (
        <p className="text-xs text-text-secondary mb-6 font-mono">Error ID: {error.digest}</p>
      )}
      <button
        type="button"
        onClick={reset}
        className="h-12 px-8 rounded-lg bg-secondary text-white font-semibold text-base"
      >
        Retry
      </button>
    </main>
  );
}
