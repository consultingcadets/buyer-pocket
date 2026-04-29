"use client";

export function RetryButton() {
  return (
    <button
      type="button"
      onClick={() => window.location.reload()}
      className="h-12 px-8 rounded-lg bg-teal-action text-on-teal-action font-semibold text-base"
    >
      Retry
    </button>
  );
}
