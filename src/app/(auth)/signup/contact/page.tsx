import Link from "next/link";
import { SUPPORT_EMAIL } from "@/lib/company";

export default function SignupContactPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8 antialiased">
      <div className="w-full max-w-[480px] bg-surface-container-lowest rounded-lg shadow-[0px_4px_20px_rgba(13,27,42,0.05)] p-8 flex flex-col gap-6 text-center">
        <h1 className="text-[32px] font-bold tracking-tight text-brand-navy">
          Thanks for letting us know.
        </h1>
        <p className="text-[16px] text-on-surface-variant">
          BuyerPocket is currently designed for independent agents and those
          with agency permission. We&apos;d love to support more use cases in
          the future.
        </p>
        <p className="text-[16px] text-on-surface-variant">
          If you think your situation should be covered, get in touch and
          we&apos;ll look into it.
        </p>
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="w-full h-12 bg-teal-action text-on-teal-action text-[16px] font-semibold rounded flex items-center justify-center hover:opacity-90 transition-opacity"
        >
          Contact us
        </a>
        <Link
          href="/login"
          className="text-[16px] text-brand-navy hover:underline transition-colors"
        >
          Back to login
        </Link>
      </div>
    </main>
  );
}
