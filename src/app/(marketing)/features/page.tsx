import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

import { getPublicAppUrl } from "@/lib/app-url";
import { Check, Smartphone } from "lucide-react";
import CTAButton from "@/components/marketing/cta-button";
import { RevealOnView } from "@/components/marketing/reveal-on-view";
import {
  CTADecorationBackdrop,
  HeroBackdrop,
  SectionPatternMuted,
} from "@/components/marketing/landing-decorations";
import {
  FeaturesCaptureFormMockup,
  FeaturesExportCsvMockup,
  FeaturesFilterResultsMockup,
  FeaturesHeroTriplePills,
  FeaturesNotesTimelineMockup,
  FeaturesRemindStackMockup,
} from "@/components/marketing/features-mockups";

const appUrl = getPublicAppUrl();

export const metadata: Metadata = {
  title: "Features — BuyerPocket",
  description:
    "Capture buyers in the field, filter your list when listings land, reminders on your phone, notes in one place, and CSV export.",
  openGraph: {
    title: "Features — BuyerPocket",
    description:
      "Three simple tools for staying on top of buyers: capture, filter, remind — plus notes history and export.",
    url: `${appUrl}/features`,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BuyerPocket" }],
  },
};

const MAX = "max-w-6xl mx-auto px-4 sm:px-6";
const CARD_CALLOUT =
  "rounded-2xl border border-border bg-surface-container-low/80 p-4 md:p-5 shadow-sm motion-safe:transition-shadow motion-safe:hover:shadow-card";

export default function FeaturesPage() {
  return (
    <div className="overflow-x-hidden bg-background">
      {/* Hero */}
      <section className="relative isolate border-b border-border/60">
        <HeroBackdrop />
        <div className={`${MAX} relative z-10 pt-12 pb-12 sm:pt-16 sm:pb-14 md:pt-16 md:pb-16`}>
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block text-[10px] font-bold tracking-[0.16em] uppercase text-teal-action mb-4">
              Features
            </span>
            <h1 className="text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] font-bold text-primary tracking-[-0.03em] leading-[1.08]">
              Built for Australian real estate agents.
            </h1>
            <p className="mt-4 text-[16px] md:text-[17px] text-text-secondary leading-relaxed">
              BuyerPocket helps you capture buyer details quickly, find the right match when a listing comes up, and follow
              up before interest goes cold.
            </p>
            <p className="mt-4 text-[13px] text-text-secondary leading-snug">
              Built for independent agents and small-agency principals in Australia.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <CTAButton href="/signup" size="lg">
                Start free trial
              </CTAButton>
              <CTAButton href="/pricing" size="lg" variant="outline">
                View pricing
              </CTAButton>
            </div>
          </div>
          <FeaturesHeroTriplePills />
        </div>
      </section>

      {/* Capture */}
      <RevealOnView>
        <section className="relative bg-white py-14 md:py-16 overflow-hidden border-b border-border/40">
          <SectionPatternMuted uid="feat-capture" />
          <div className={`${MAX} relative z-10`}>
            <FeatureBand
              eyebrow="CAPTURE"
              eyebrowClass="bg-teal-action/14 text-teal-action border border-teal-action/25"
              title="Quick capture, designed for the field"
              intro="At an open home, you do not have time for a long form. BuyerPocket keeps capture short on purpose. Add the basics — name, phone, suburb, budget, bedrooms, and an optional note — then save and move on. Add more detail later when you are back in the car or at your desk."
              bullets={[
                "Fast enough to use between conversations",
                "Only the key details upfront",
                "Extra detail can be added later",
              ]}
              visual={<FeaturesCaptureFormMockup />}
              reversed={false}
            />
          </div>
        </section>
      </RevealOnView>

      {/* Filter */}
      <RevealOnView>
        <section className="relative bg-gradient-to-b from-background via-[#faf8f9] to-surface-container-low/70 py-14 md:py-16 border-b border-border/40">
          <div className={MAX}>
            <FeatureBand
              eyebrow="FILTER"
              eyebrowClass="bg-primary/10 text-primary border border-primary/18"
              title="Find matching buyers fast"
              intro="When a new listing comes up, you should not be digging through old notes trying to remember who wanted what. Filter your buyer list by suburb, budget, bedrooms, land size, timing, and notes to quickly find the buyers worth calling first."
              bullets={[
                "Find likely matches in seconds",
                "Reduce memory-based follow-up",
                "Get to the right buyers first",
              ]}
              visual={<FeaturesFilterResultsMockup />}
              reversed
            />
          </div>
        </section>
      </RevealOnView>

      {/* Remind */}
      <RevealOnView>
        <section className="relative bg-white py-14 md:py-16 border-b border-border/40 overflow-hidden">
          <SectionPatternMuted uid="feat-remind" flipped />
          <div className={`${MAX} relative z-10`}>
            <FeatureBand
              eyebrow="REMIND"
              eyebrowClass="bg-primary text-white border border-primary shadow-sm"
              title="Reminders that actually arrive"
              intro="Set a reminder when you save a buyer or any time later from their profile. Choose tonight, tomorrow morning, next week, or a custom time. When it is due, BuyerPocket sends a notification to your phone so you can follow up while the conversation is still fresh."
              bullets={[
                "Set reminders in seconds",
                "Phone notification keeps it practical",
                "Open buyer profile and call from there",
              ]}
              visual={<FeaturesRemindStackMockup />}
              reversed={false}
              afterVisual={
                <div className={`${CARD_CALLOUT} w-full max-w-[440px]`}>
                  <div className="flex gap-3">
                    <div className="h-11 w-11 rounded-xl bg-teal-action/10 flex items-center justify-center shrink-0">
                      <Smartphone className="h-5 w-5 text-teal-action" aria-hidden strokeWidth={1.75} />
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-primary mb-1">Heads up for iPhone users</div>
                      <p className="text-[13px] text-text-secondary leading-relaxed">
                        To receive reminders, BuyerPocket needs to be added to the Home Screen. We guide you through
                        that during onboarding.
                      </p>
                    </div>
                  </div>
                </div>
              }
            />
          </div>
        </section>
      </RevealOnView>

      {/* Notes */}
      <RevealOnView>
        <section className="relative bg-surface-container-low py-14 md:py-16 border-b border-border/40 overflow-hidden">
          <div className={MAX}>
            <FeatureBand
              eyebrow="NOTES"
              eyebrowClass="bg-teal-action/14 text-teal-action border border-teal-action/22"
              title="Every conversation, in one place"
              intro="Add a quick note after a call, inspection, text, or email. BuyerPocket stores the full history against the buyer profile so you can come back weeks later and know exactly what was said, what they wanted, what they didn't, and what you agreed to do next. No more asking a buyer questions you have already asked them before."
              bullets={[
                "Log calls, emails, SMS, and in-person conversations",
                "Notes stay with the buyer — not buried in your phone",
                "Scroll back through weeks of history in seconds",
                "Avoids the embarrassing question you already asked last time",
              ]}
              visual={<FeaturesNotesTimelineMockup />}
              reversed
            />
          </div>
        </section>
      </RevealOnView>

      {/* Export */}
      <RevealOnView>
        <section className="relative bg-white py-14 md:py-16 border-b border-border/40 overflow-hidden">
          <SectionPatternMuted uid="feat-export" />
          <div className={`${MAX} relative z-10`}>
            <FeatureBand
              eyebrow="EXPORT"
              eyebrowClass="bg-brand-teal/12 text-teal-action border border-brand-teal/28"
              title="Your data, exportable any time"
              intro="BuyerPocket is not a locked box. Your buyer data belongs to you — export it as a CSV whenever you want, with all fields included. Use it for backup, feed it into a spreadsheet for admin work, or take it with you if you ever move to another tool. No permission required, no hidden data, no exit fee."
              bullets={[
                "Full CSV export includes all buyer fields and notes",
                "Download any time from Settings — no need to contact support",
                "Useful for weekly backups, compliance records, or admin reviews",
                "Your data is yours — always exportable, never held hostage",
              ]}
              visual={<FeaturesExportCsvMockup />}
              reversed={false}
            />
            <p className="text-[13px] text-text-secondary text-center mt-8 max-w-lg mx-auto">
              Your buyer list stays yours.
            </p>
          </div>
        </section>
      </RevealOnView>

      {/* Final CTA — aligned with homepage */}
      <section className="relative overflow-hidden isolate py-11 md:py-14 border-t border-white/5">
        <CTADecorationBackdrop />
        <div className={`${MAX} relative z-10 text-center py-2`}>
          <h2 className="text-[1.45rem] sm:text-[1.75rem] md:text-[2rem] font-bold text-white tracking-[-0.02em] max-w-lg mx-auto leading-tight">
            Stop losing buyers in your phone notes.
          </h2>
          <p className="mt-3 text-[15px] md:text-base text-white/75 max-w-md mx-auto leading-relaxed">
            Try BuyerPocket free for 7 days. Then it is $19/month. Cancel anytime.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="inline-flex rounded-xl motion-safe:shadow-[0_0_32px_-6px_rgba(46,196,182,0.45)]">
              <CTAButton href="/signup" size="lg" className="min-w-[200px]">
                Start free trial
              </CTAButton>
            </div>
            <Link
              href="/pricing"
              className="text-[15px] font-semibold text-white/85 hover:text-white underline underline-offset-4 transition-colors min-h-[48px] flex items-center"
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureBand({
  eyebrow,
  eyebrowClass,
  title,
  intro,
  bullets,
  visual,
  reversed,
  afterVisual,
}: {
  eyebrow: string;
  eyebrowClass: string;
  title: string;
  intro: string;
  bullets: string[];
  visual: ReactNode;
  reversed: boolean;
  afterVisual?: ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-8 md:gap-10 lg:gap-12 ${reversed ? "lg:flex-row-reverse" : "lg:flex-row"} items-start`}>
      <div className="flex-1 min-w-0 max-w-xl mx-auto lg:mx-0 text-center lg:text-left w-full">
        <span
          className={`inline-block text-[10px] font-bold tracking-[0.14em] uppercase px-3 py-1.5 rounded-full mb-4 ${eyebrowClass}`}
        >
          {eyebrow}
        </span>
        <h2 className="text-xl sm:text-2xl md:text-[1.65rem] font-semibold text-primary leading-snug tracking-[-0.02em]">
          {title}
        </h2>
        <p className="mt-3 text-[15px] md:text-[16px] text-text-secondary leading-relaxed">{intro}</p>
        <ul className="mt-5 space-y-2.5 text-left mx-auto lg:mx-0 max-w-md lg:max-w-none">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-[14px] text-text-primary leading-snug">
              <Check className="h-4 w-4 text-teal-action mt-0.5 shrink-0" strokeWidth={2.25} aria-hidden />
              {b}
            </li>
          ))}
        </ul>
      </div>

      <div
        className={`flex flex-1 w-full flex-col gap-5 min-w-0 items-center ${reversed ? "lg:items-start" : "lg:items-end"}`}
      >
        <div className={`w-full flex justify-center ${reversed ? "lg:justify-start" : "lg:justify-end"}`}>
          {visual}
        </div>
        {afterVisual ? (
          <div className={`w-full flex justify-center ${reversed ? "lg:justify-start" : "lg:justify-end"}`}>
            {afterVisual}
          </div>
        ) : null}
      </div>
    </div>
  );
}
