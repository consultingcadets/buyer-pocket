import { RetryButton } from "./RetryButton";

export const metadata = { title: "You're offline — BuyerPocket" };

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mb-6">
        <svg
          className="w-10 h-10 text-text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3l18 18M8.111 8.111A5.97 5.97 0 006 12c0 1.657.672 3.157 1.757 4.243M12 6a6 6 0 016 6 5.97 5.97 0 01-1.757 4.243M9.88 9.88A3 3 0 0012 9a3 3 0 013 3 2.993 2.993 0 01-.88 2.12"
          />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-text-primary mb-2">
        You&apos;re offline.
      </h1>
      <p className="text-base text-text-secondary max-w-xs mb-8">
        BuyerPocket needs an internet connection. Check your connection and try
        again.
      </p>

      <RetryButton />
    </main>
  );
}
