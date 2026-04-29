import Link from "next/link";

export const metadata = {
  title: { absolute: "Install BuyerPocket on iPhone — BuyerPocket" },
  robots: { index: false, follow: false },
};

const steps = [
  {
    num: 1,
    title: "Open BuyerPocket in Safari",
    description:
      "Make sure you're using Safari — Chrome and Firefox on iPhone can't install apps to your home screen.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
  },
  {
    num: 2,
    title: 'Tap the Share button',
    description:
      'Look for the Share button — it looks like a box with an arrow pointing up — at the bottom of your screen.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
      </svg>
    ),
  },
  {
    num: 3,
    title: '"Add to Home Screen"',
    description:
      'Scroll down in the share sheet and tap "Add to Home Screen". If you don\'t see it, swipe left on the bottom row of icons.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    num: 4,
    title: 'Tap "Add"',
    description:
      'Confirm by tapping "Add" in the top-right corner. BuyerPocket will appear on your home screen like any other app.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function IOSInstallPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl font-bold text-secondary">B</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Add BuyerPocket to your iPhone
          </h1>
          <p className="text-base text-text-secondary">
            Install the app for quick access to your buyers — it works just like a native app, with no App Store required.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-white rounded-xl border border-border p-5 flex gap-4"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
                {step.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                    Step {step.num}
                  </span>
                </div>
                <p className="font-semibold text-text-primary text-sm mb-1">
                  {step.title}
                </p>
                <p className="text-sm text-text-secondary">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-8 p-4 bg-surface-container rounded-xl text-sm text-text-secondary">
          <p>
            <strong className="text-text-primary">Note:</strong> Push notifications
            are not supported on iOS 15 and earlier. For the best experience, use iOS 16.4 or later.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Link
            href="/today"
            className="inline-flex h-12 px-8 rounded-lg bg-secondary text-white font-semibold items-center justify-center"
          >
            Open BuyerPocket
          </Link>
        </div>
      </div>
    </main>
  );
}
