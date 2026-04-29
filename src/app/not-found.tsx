import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-text-primary mb-2">We couldn&apos;t find that.</h2>
      <p className="text-base text-text-secondary max-w-xs mb-8">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/today"
        className="h-12 px-8 rounded-lg bg-secondary text-white font-semibold text-base inline-flex items-center"
      >
        Back to dashboard
      </Link>
    </main>
  );
}
