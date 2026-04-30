import type { Metadata } from "next";
import { Check, X } from "lucide-react";

import { getPublicAppUrl } from "@/lib/app-url";
import CTAButton from "@/components/marketing/cta-button";

const appUrl = getPublicAppUrl();

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple pricing. No surprises. $19 per month. 7-day free trial. Cancel anytime from settings.",
  openGraph: {
    title: "Pricing — BuyerPocket",
    description: "$19/month. 7-day free trial. No credit card required to start.",
    url: `${appUrl}/pricing`,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BuyerPocket" }],
  },
};

const INCLUDED = [
  "Unlimited buyers",
  "Unlimited reminders",
  "Suburb, land size, budget, bedroom, timeline filters",
  "Phone push notifications",
  "Notes and contact history",
  "CSV export",
  "Works on phone, tablet, desktop (PWA)",
  "Email support",
];

const NOT_IN_V1 = [
  "SMS reminders",
  "Team or agency accounts",
  "REA / Domain integrations",
  "Listing management",
  "Vendor management",
  "AI capture",
];

const FAQS = [
  {
    q: "Is this a replacement for my agency CRM?",
    a: "No. BuyerPocket is a personal buyer list. If your agency uses Agentbox, VaultRE, Rex or similar, BuyerPocket sits alongside it. Check with your agency that personal tools are permitted before using it for agency-collected leads.",
  },
  {
    q: "What happens after the 7-day trial?",
    a: "You'll be charged $19/month and can keep using BuyerPocket. If you cancel before the trial ends, you won't be charged. Your data stays available so you can export it.",
  },
  {
    q: "Do I need a credit card to start?",
    a: "No. You can start the trial with just an email address. We'll ask for payment details before the trial ends.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from Settings then Billing. You'll keep access until the end of your billing period.",
  },
  {
    q: "Will my data be safe?",
    a: "Your buyer data is yours. It's stored securely on Australian servers, encrypted in transit and at rest, and only accessible to you. You can export everything as CSV at any time.",
  },
  {
    q: "Is this for buyer's agents?",
    a: "No. BuyerPocket is built for selling agents. If you're a buyer's agent, look at Stash or BA-ICON — they have property research tools you'd need.",
  },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />
      {/* Hero */}
      <section className="bg-background pt-16 pb-12 md:pt-20 md:pb-16">
        <div className="max-w-[1440px] mx-auto px-6 text-center">
          <h1 className="text-[40px] md:text-[48px] font-bold text-primary tracking-[-0.02em] leading-[1.15] mb-4">
            Simple pricing. No surprises.
          </h1>
          <p className="text-[18px] text-text-secondary">
            $19 per month. 7-day free trial. Cancel anytime from settings.
          </p>
        </div>
      </section>

      {/* Pricing card */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-[1440px] mx-auto px-6">
          <div
            className="max-w-[440px] mx-auto bg-white rounded-[8px] border border-border p-8"
            style={{ boxShadow: "0px 4px 20px rgba(13, 27, 42, 0.05)" }}
          >
            <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-text-secondary mb-3">
              PRO
            </div>
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-[48px] font-bold text-primary leading-none">$19</span>
              <span className="text-text-secondary text-[15px]">/ month AUD</span>
            </div>
            <p className="text-[13px] text-text-secondary mb-6">
              7-day free trial. No credit card required to start.
            </p>
            <CTAButton href="/signup" size="lg" fullWidth>
              Start free trial
            </CTAButton>
            <p className="text-[13px] text-text-secondary text-center mt-3">
              Cancel anytime from settings.
            </p>
            <ul className="mt-7 space-y-3">
              {[
                "Unlimited buyers",
                "Suburb/land/budget/bedroom filtering",
                "Phone push reminders",
                "Notes/contact history",
                "Works on phone/tablet/desktop",
                "Export anytime",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[14px] text-text-primary">
                  <Check size={16} className="text-secondary mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="bg-background py-16 md:py-20">
        <div className="max-w-[1440px] mx-auto px-6">
          <h2 className="text-[32px] font-bold text-primary tracking-[-0.01em] mb-10 text-center">
            What you get
          </h2>
          <div className="max-w-[800px] mx-auto grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-[8px] border border-border p-6" style={{ boxShadow: "0px 4px 20px rgba(13, 27, 42, 0.05)" }}>
              <div className="flex items-center gap-2 mb-5">
                <Check size={16} className="text-secondary" />
                <span className="text-[13px] font-semibold text-primary uppercase tracking-[0.05em]">Included</span>
              </div>
              <ul className="space-y-2.5">
                {INCLUDED.map((f) => (
                  <li key={f} className="text-[14px] text-text-primary leading-[1.5]">
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-[8px] border border-border p-6" style={{ boxShadow: "0px 4px 20px rgba(13, 27, 42, 0.05)" }}>
              <div className="flex items-center gap-2 mb-5">
                <X size={16} className="text-text-secondary" />
                <span className="text-[13px] font-semibold text-text-secondary uppercase tracking-[0.05em]">Not in V1</span>
              </div>
              <ul className="space-y-2.5">
                {NOT_IN_V1.map((f) => (
                  <li key={f} className="text-[14px] text-text-secondary leading-[1.5]">
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-[1440px] mx-auto px-6">
          <h2 className="text-[32px] font-bold text-primary tracking-[-0.01em] mb-10 text-center">
            Common questions
          </h2>
          <div className="max-w-[680px] mx-auto divide-y divide-border">
            {FAQS.map(({ q, a }) => (
              <details key={q} className="group py-5">
                <summary className="flex items-center justify-between cursor-pointer list-none gap-4">
                  <span className="text-[16px] font-semibold text-primary">{q}</span>
                  <span className="text-text-secondary text-xl group-open:rotate-45 transition-transform duration-150 flex-shrink-0 font-light">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[15px] text-text-secondary leading-[1.7]">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-primary py-16 md:py-20">
        <div className="max-w-[1440px] mx-auto px-6 text-center">
          <h2 className="text-[32px] font-bold text-white tracking-[-0.01em] mb-3">
            Stop losing buyers in your phone notes.
          </h2>
          <p className="text-[17px] text-white/70 mb-8">
            Try BuyerPocket free for 7 days. $19/month after that. Cancel anytime.
          </p>
          <CTAButton href="/signup" size="lg">
            Start free trial
          </CTAButton>
        </div>
      </section>
    </>
  );
}
