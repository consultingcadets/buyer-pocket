import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPublicAppUrl } from "@/lib/app-url";
import { Check, ClipboardList, Timer, Home, X } from "lucide-react";
import MarketingNav from "@/components/marketing/marketing-nav";
import MarketingFooter from "@/components/marketing/marketing-footer";
import CTAButton from "@/components/marketing/cta-button";
import { RevealOnView } from "@/components/marketing/reveal-on-view";
import {
  HeroBackdrop,
  SectionPatternMuted,
  CTADecorationBackdrop,
} from "@/components/marketing/landing-decorations";
import { HeroMarketingVisual } from "@/components/marketing/hero-marketing-visual";
import {
  QuickCapturePreviewCard,
  FilterWithMatchingBuyersPreview,
  ReminderNotificationCard,
} from "@/components/marketing/landing-preview-cards";

const appUrl = getPublicAppUrl();

export const metadata: Metadata = {
  title: "BuyerPocket — Capture buyers fast. Follow up on time.",
  description:
    "A simple buyer list and reminder tool for Australian agents: save buyers quickly, filter when listings land, stay on follow-ups.",
  openGraph: {
    title: "BuyerPocket — Capture buyers fast. Follow up on time.",
    description:
      "A simple buyer list and reminder tool for Australian agents: save buyers quickly, filter when listings land, stay on follow-ups.",
    type: "website",
    url: appUrl,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is BuyerPocket?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "BuyerPocket is a buyer list and reminder tool built for independent Australian real estate agents. It lets agents save buyer preferences at open homes, filter their list when new listings arrive, and receive phone reminders before follow-ups go cold. It costs $19 AUD per month after a 7-day free trial, and is operated by Consulting Cadets Pty Ltd (ABN 73 683 393 508).",
      },
    },
    {
      "@type": "Question",
      name: "Who is BuyerPocket for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "BuyerPocket is for independent licensed real estate agents and small-agency principals in Australia who manage their own buyer relationships. It is not designed for large agency teams needing a multi-user CRM, or for buyer's agents who need property research tools.",
      },
    },
    {
      "@type": "Question",
      name: "How much does BuyerPocket cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "$19 AUD per month. There is a 7-day free trial with no credit card required to start. You can cancel anytime from Settings.",
      },
    },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "BuyerPocket",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, iOS, Android",
  description:
    "A simple buyer list and reminder tool for Australian real estate agents who keep their own buyer relationships organised.",
  url: appUrl,
  offers: {
    "@type": "Offer",
    price: "19",
    priceCurrency: "AUD",
    priceValidUntil: "2027-12-31",
  },
  featureList: [
    "Unlimited buyers",
    "Buyer filters",
    "Phone push reminders",
    "Notes and contact history",
    "Works on phone, tablet, desktop",
    "CSV export",
  ],
};

const MAX = "max-w-6xl mx-auto px-4 sm:px-6";
const CARD_HOVER =
  "rounded-2xl border border-border/90 bg-white shadow-card transition-[box-shadow,transform] duration-300 motion-safe:hover:shadow-dropdown motion-safe:hover:-translate-y-0.5";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/today");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

      <MarketingNav />

      <main className="overflow-x-hidden bg-background">
        {/* Hero */}
        <section className="relative isolate border-b border-border/60">
          <HeroBackdrop />
          <div className={`${MAX} py-14 sm:py-16 md:py-20 lg:py-24 relative z-10`}>
            <div className="grid gap-12 lg:gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(280px,440px)] items-center lg:items-start">
              <div className="pt-2">
                <h1 className="text-[2.125rem] sm:text-[2.625rem] md:text-[3.125rem] font-bold text-primary leading-[1.08] tracking-[-0.03em]">
                  Capture buyers fast. Follow up on time.
                </h1>
                <p className="mt-5 text-[17px] sm:text-lg text-text-secondary leading-relaxed max-w-xl">
                  BuyerPocket helps you keep buyer details in one place, find the right matches when a new listing
                  comes up, and stay on top of follow-ups before opportunities go cold.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:flex-wrap">
                  <CTAButton href="/signup" size="lg">
                    Start 7-day free trial
                  </CTAButton>
                  <p className="text-sm text-text-secondary sm:max-w-[14rem]">
                    $19/month after trial. Cancel anytime. No credit card to start.
                  </p>
                </div>
                <p className="mt-6 text-[13px] text-text-secondary leading-snug max-w-lg">
                  Built for independent agents and small-agency principals in Australia.
                </p>
              </div>
              <div className="flex justify-center lg:justify-end w-full lg:pt-4">
                <HeroMarketingVisual />
              </div>
            </div>
          </div>
        </section>

        {/* Problem */}
        <RevealOnView>
          <section className="relative bg-white py-14 md:py-20 overflow-hidden">
            <SectionPatternMuted uid="problem" />
            <div className={`${MAX} relative z-10`}>
              <h2 className="text-[1.625rem] sm:text-[1.875rem] md:text-[2.125rem] font-bold text-primary tracking-[-0.02em] max-w-xl leading-tight">
                Buyer details should not live in your phone notes.
              </h2>
              <div className="mt-10 md:mt-14 grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Notes get scattered",
                    body:
                      "Buyer details end up in messages, notebooks, contacts, and random apps. A week later, you are trying to remember where you wrote them down.",
                    Icon: ClipboardList,
                  },
                  {
                    title: "Follow-ups get missed",
                    body:
                      "You meant to call on Tuesday. Tuesday became Friday. By then, the buyer has moved on or bought somewhere else.",
                    Icon: Timer,
                  },
                  {
                    title: "New listings come up, but the match is gone",
                    body:
                      "A property hits the market and you know you met the right buyer before. The trouble is you cannot quickly find who it was.",
                    Icon: Home,
                  },
                ].map(({ title, body, Icon }) => (
                  <article key={title} className={`${CARD_HOVER} p-6 flex flex-col gap-4`}>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-action/12 text-teal-action">
                      <Icon className="h-6 w-6" aria-hidden strokeWidth={1.75} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary">{title}</h3>
                      <p className="mt-2 text-[15px] text-text-secondary leading-relaxed">{body}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </RevealOnView>

        {/* Features */}
        <RevealOnView>
          <section className="relative bg-gradient-to-b from-background via-[#faf8f9] to-surface-container-low/80 py-16 md:py-20">
            <div className={MAX}>
              <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
                <h2 className="text-[1.625rem] sm:text-[2rem] md:text-[2.25rem] font-bold text-primary tracking-[-0.02em]">
                  What BuyerPocket helps you do.
                </h2>
                <p className="mt-3 text-text-secondary text-[15px] md:text-base">
                  Three straightforward jobs — capture, filter, remind.
                </p>
              </div>

              <div className="flex flex-col gap-16 md:gap-20 xl:gap-24">
                <FeatureSpread
                  eyebrow="CAPTURE"
                  tagClass="bg-teal-action/14 text-teal-action border border-teal-action/25"
                  title="Add a buyer in under 30 seconds"
                  body="Save the important details fast — name, phone, suburb, budget, and bedrooms — then fill in the rest later when you have time."
                  visual={<QuickCapturePreviewCard />}
                  reversed={false}
                />
                <FeatureSpread
                  eyebrow="FILTER"
                  tagClass="bg-primary/10 text-primary border border-primary/15"
                  title="Find the right buyer when a new listing comes up"
                  body="Filter your buyer list by suburb, budget, bedrooms, land size, and notes so you can quickly see who matches a property."
                  visual={<FilterWithMatchingBuyersPreview />}
                  reversed
                />
                <FeatureSpread
                  eyebrow="REMIND"
                  tagClass="bg-brand-teal/15 text-teal-action border border-brand-teal/30"
                  title="Stay on top of follow-ups"
                  body="Set a reminder and get a phone notification when it is time to call, text, or check in."
                  visual={<ReminderNotificationCard />}
                  reversed={false}
                />
              </div>
            </div>
          </section>
        </RevealOnView>

        {/* How it works */}
        <RevealOnView>
          <section className="bg-surface-container-low border-y border-border/70 py-12 md:py-16 relative overflow-hidden">
            <SectionPatternMuted uid="how" flipped />
            <div className={`${MAX} relative z-10`}>
              <h2 className="text-center text-xl sm:text-2xl md:text-[1.625rem] font-bold text-primary tracking-[-0.02em] mb-8 md:mb-12">
                Three simple steps. That&apos;s the whole product.
              </h2>
              <div className="grid sm:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto">
                {[
                  {
                    n: "1",
                    label: "Capture",
                    body: "Add buyers after open homes, phone enquiries, or inspections.",
                  },
                  {
                    n: "2",
                    label: "Filter",
                    body: "When a new listing comes up, quickly find buyers who fit.",
                  },
                  {
                    n: "3",
                    label: "Follow up",
                    body: "Set reminders and stay in touch while interest is still fresh.",
                  },
                ].map(({ n, label, body }) => (
                  <div
                    key={label}
                    className="flex gap-4 p-5 rounded-2xl bg-white/90 border border-border/80 shadow-sm"
                  >
                    <div className="w-9 h-9 rounded-full bg-teal-action text-on-teal-action flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-sm">
                      {n}
                    </div>
                    <div>
                      <div className="font-semibold text-primary text-[16px] mb-1">{label}</div>
                      <p className="text-[14px] md:text-[15px] text-text-secondary leading-relaxed">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </RevealOnView>

        {/* Pricing + who for */}
        <RevealOnView>
          <section className="bg-white py-14 md:py-20">
            <div className={MAX}>
              <h2 className="text-center text-[1.625rem] sm:text-[2rem] font-bold text-primary tracking-[-0.02em] mb-10 md:mb-12">
                Simple pricing.
              </h2>
              <div className="max-w-md mx-auto">
                <div className={`${CARD_HOVER} p-8 md:p-10 text-left`}>
                  <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-text-secondary mb-2">
                    Pro
                  </div>
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-[2.75rem] font-bold text-primary leading-none tracking-tight">$19</span>
                    <span className="text-text-secondary text-[15px]">/ month AUD</span>
                  </div>
                  <p className="text-[13px] text-text-secondary mt-2 mb-6">
                    7-day free trial. No credit card required to start.
                  </p>
                  <CTAButton href="/signup" size="lg" fullWidth>
                    Start free trial
                  </CTAButton>
                  <p className="text-[13px] text-text-secondary text-center mt-3">Cancel anytime from settings.</p>
                  <ul className="mt-7 space-y-3 border-t border-border/80 pt-7">
                    {[
                      "Unlimited buyers",
                      "Buyer filters",
                      "Phone push reminders",
                      "Notes and contact history",
                      "Works on phone, tablet, and desktop",
                      "CSV export",
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[14px] text-text-primary">
                        <Check className="h-4 w-4 text-teal-action mt-0.5 flex-shrink-0" strokeWidth={2.25} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="mt-6 text-[13px] text-text-secondary text-center leading-relaxed max-w-md mx-auto">
                  Built for independent agents and small-agency principals. If you work under an agency, check that
                  personal buyer capture tools are permitted by your contract.
                </p>
              </div>

              <div className="mt-16 md:mt-20 max-w-4xl mx-auto">
                <h2 className="text-center text-[1.625rem] sm:text-[2rem] font-bold text-primary tracking-[-0.02em] mb-8 md:mb-10">
                  Who BuyerPocket is for.
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className={`${CARD_HOVER} p-6 md:p-8`}>
                    <div className="text-xs font-semibold tracking-[0.08em] uppercase text-teal-action mb-4">Built for</div>
                    <ul className="space-y-3">
                      {[
                        "Independent licensed agents",
                        "Small-agency principals",
                        "Agents who are allowed to keep their own buyer list",
                        "Agents who want a simple follow-up tool without the clutter",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-[14px] text-text-primary">
                          <Check className="h-4 w-4 text-teal-action mt-0.5 flex-shrink-0" strokeWidth={2.25} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={`${CARD_HOVER} p-6 md:p-8`}>
                    <div className="text-xs font-semibold tracking-[0.08em] uppercase text-text-secondary mb-4">
                      Not the right fit
                    </div>
                    <ul className="space-y-3">
                      {[
                        "Large agencies needing a full CRM",
                        "Teams needing shared pipelines and permissions",
                        "Agents wanting property research or market-comparison tools",
                        "Agencies already relying on systems like Agentbox, VaultRE, Rex, Stash, or BA-ICON",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-[14px] text-text-secondary">
                          <X className="h-4 w-4 text-text-secondary/80 mt-0.5 flex-shrink-0" strokeWidth={2} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </RevealOnView>

        {/* Final CTA */}
        <section className="relative overflow-hidden isolate py-12 md:py-16">
          <CTADecorationBackdrop />
          <div className={`${MAX} relative z-10 text-center py-2`}>
            <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] font-bold text-white tracking-[-0.02em] max-w-lg mx-auto leading-tight">
              Stop losing buyers in your phone notes.
            </h2>
            <p className="mt-3 md:mt-4 text-[15px] md:text-base text-white/75 max-w-md mx-auto leading-relaxed">
              Try BuyerPocket free for 7 days. Then it is $19/month. Cancel anytime.
            </p>
            <div className="mt-7 md:mt-8 inline-flex rounded-xl motion-safe:shadow-[0_0_32px_-6px_rgba(46,196,182,0.45)]">
              <CTAButton href="/signup" size="lg" className="min-w-[200px]">
                Start free trial
              </CTAButton>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </>
  );
}

function FeatureSpread({
  eyebrow,
  tagClass,
  title,
  body,
  visual,
  reversed,
}: {
  eyebrow: string;
  tagClass: string;
  title: string;
  body: string;
  visual: ReactNode;
  reversed: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-8 md:gap-12 lg:gap-16 ${reversed ? "lg:flex-row-reverse" : "lg:flex-row"} items-center`}
    >
      <div className="flex-1 min-w-0 max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
        <span
          className={`inline-block text-[10px] font-bold tracking-[0.14em] uppercase px-3 py-1.5 rounded-full mb-4 ${tagClass}`}
        >
          {eyebrow}
        </span>
        <h3 className="text-xl sm:text-2xl font-semibold text-primary leading-snug tracking-[-0.02em]">{title}</h3>
        <p className="mt-3 text-[15px] md:text-base text-text-secondary leading-relaxed">{body}</p>
      </div>
      <div
        className={`flex-1 w-full flex justify-center min-w-0 ${reversed ? "lg:justify-start" : "lg:justify-end"}`}
      >
        {visual}
      </div>
    </div>
  );
}
