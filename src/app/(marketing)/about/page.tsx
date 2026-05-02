import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL_ABN, LEGAL_ENTITY, SUPPORT_EMAIL } from "@/lib/company";
import CTAButton from "@/components/marketing/cta-button";

export const metadata: Metadata = {
  title: { absolute: "About — BuyerPocket" },
  description:
    "BuyerPocket is built by Consulting Cadets, an Australian software company. Here's why we built it and who it's for.",
  openGraph: {
    title: "About — BuyerPocket",
    description:
      "BuyerPocket is built by Consulting Cadets, an Australian software company. Here's why we built it and who it's for.",
    url: "https://buyerpocket.com.au/about",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BuyerPocket" }],
  },
};

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-16 md:py-20">

        {/* What is BuyerPocket */}
        <section className="mb-14">
          <p className="text-xs font-bold tracking-[0.12em] text-secondary uppercase mb-3">
            About
          </p>
          <h1 className="text-[36px] md:text-[42px] font-bold text-primary tracking-[-0.02em] leading-tight mb-6">
            A buyer list and reminder tool for Australian real estate agents.
          </h1>
          <p className="text-[17px] text-text-secondary leading-relaxed mb-4">
            BuyerPocket is a simple tool that helps independent real estate agents
            capture buyer preferences, filter their list when a new listing comes up,
            and get phone reminders before follow-ups go cold.
          </p>
          <p className="text-[17px] text-text-secondary leading-relaxed">
            It is not a CRM. It does not manage listings, vendors, or your agency pipeline.
            It does three things well: capture, filter, remind. That is the whole product.
          </p>
        </section>

        {/* Why we built it */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-primary mb-4">Why we built it</h2>
          <p className="text-[16px] text-text-secondary leading-relaxed mb-4">
            Most real estate agents manage their buyer relationships the same way: phone
            notes, spreadsheets, memory. It works until it doesn&apos;t — when a listing comes
            up and you can&apos;t remember who wanted what, or when a buyer goes cold because
            you meant to call on Tuesday and it is now Friday.
          </p>
          <p className="text-[16px] text-text-secondary leading-relaxed mb-4">
            The big agency CRMs are not the answer. They are built for agencies, not
            individual agents, and they carry a weight of features that most agents will
            never use.
          </p>
          <p className="text-[16px] text-text-secondary leading-relaxed">
            We built BuyerPocket to be the minimum useful tool — fast enough to use at an
            open home, simple enough to actually use every day, and honest enough to tell
            you when it is not the right fit for your situation.
          </p>
        </section>

        {/* Who it's for */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-primary mb-4">Who it&apos;s for</h2>
          <ul className="space-y-2 text-[16px] text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-teal-action font-bold mt-0.5">✓</span>
              Independent licensed agents in Australia
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-action font-bold mt-0.5">✓</span>
              Small-agency principals who manage their own buyer relationships
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-action font-bold mt-0.5">✓</span>
              Agents whose agency permits personal capture tools
            </li>
          </ul>
          <div className="mt-5 rounded-xl bg-surface-container-low border border-border/40 px-5 py-4 text-[14px] text-text-secondary leading-relaxed">
            <strong className="text-text-primary">Not the right fit?</strong> If you work
            under a large agency network, check your contract first — buyer data may belong
            to the agency. If you are a buyer&apos;s agent, look at Stash or BA-ICON instead.
            They are built for property research and matching in a way BuyerPocket is not.
          </div>
        </section>

        {/* Company */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-primary mb-4">The company</h2>
          <p className="text-[16px] text-text-secondary leading-relaxed mb-4">
            BuyerPocket is operated by <strong className="text-text-primary">{LEGAL_ENTITY}</strong>,
            an Australian software company (ABN {LEGAL_ABN}).
          </p>
          <p className="text-[16px] text-text-secondary leading-relaxed">
            Your buyer data is stored on Australian servers, encrypted in transit and at
            rest, and never shared with third parties. You can export everything as CSV at
            any time and close your account from Settings.
          </p>
        </section>

        {/* Contact */}
        <section className="mb-14 border-t border-border/40 pt-10">
          <h2 className="text-xl font-bold text-primary mb-4">Get in touch</h2>
          <p className="text-[16px] text-text-secondary leading-relaxed mb-2">
            Questions, feedback, or something not working?
          </p>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-accent underline underline-offset-2 text-[16px]"
          >
            {SUPPORT_EMAIL}
          </a>
          <p className="text-[14px] text-text-secondary mt-2">
            We reply within one business day.
          </p>
        </section>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-start gap-4 border-t border-border/40 pt-10">
          <CTAButton href="/signup" size="lg">
            Start 7-day free trial
          </CTAButton>
          <Link
            href="/pricing"
            className="text-[15px] font-semibold text-text-secondary hover:text-text-primary underline underline-offset-4 transition-colors min-h-[48px] flex items-center"
          >
            See pricing
          </Link>
        </div>

      </div>
    </div>
  );
}
