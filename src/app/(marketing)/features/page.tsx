import type { Metadata } from "next";
import { SlidersHorizontal, UserPlus, Bell, MessageCircle, Download, Smartphone } from "lucide-react";
import CTAButton from "@/components/marketing/cta-button";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Three features. Done well. Filter buyers, capture fast at open homes, and set reminders that actually arrive.",
  openGraph: {
    title: "Features — BuyerPocket",
    description:
      "Filter buyers instantly, capture at open homes, reminders that fire to your phone. We do three things and we do them fast.",
    url: "https://buyerpocket.com.au/features",
  },
};

export default function FeaturesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-background pt-16 pb-12 md:pt-20 md:pb-16">
        <div className="max-w-[1440px] mx-auto px-6 text-center">
          <h1 className="text-[40px] md:text-[48px] font-bold text-primary tracking-[-0.02em] leading-[1.15] mb-4">
            Three features. Done well.
          </h1>
          <p className="text-[18px] text-text-secondary leading-[1.6] max-w-[520px] mx-auto">
            We don't try to replace your agency CRM. We do three things, and we do them fast.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="max-w-[760px]">
            <span className="inline-block text-[11px] font-semibold tracking-[0.08em] uppercase bg-accent text-primary px-3 py-1 rounded-full mb-5">
              FILTER
            </span>
            <h2 className="text-[32px] font-bold text-primary tracking-[-0.01em] mb-4">
              Match buyers to listings instantly
            </h2>
            <p className="text-[17px] text-text-secondary leading-[1.7] mb-8">
              When a new listing comes in, you don't want to scroll through 200 buyers trying to remember who wanted
              what. Open BuyerPocket, set the filters, see your matches.
            </p>
            <div className="bg-background rounded-[8px] p-6 border border-border">
              <div className="text-[12px] font-semibold tracking-[0.05em] uppercase text-text-secondary mb-4">
                Filter options
              </div>
              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
                {[
                  "Suburb (multi-select with typeahead)",
                  "Budget range",
                  "Bedrooms minimum",
                  "Land size minimum",
                  "Property type",
                  "Buyer temperature (Hot, Warm, Cold)",
                  "Buying timeline",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[14px] text-text-primary">
                    <SlidersHorizontal size={14} className="text-accent flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Capture */}
      <section className="bg-background py-16 md:py-20">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="max-w-[760px] md:ml-auto">
            <span className="inline-block text-[11px] font-semibold tracking-[0.08em] uppercase bg-secondary text-primary px-3 py-1 rounded-full mb-5">
              CAPTURE
            </span>
            <h2 className="text-[32px] font-bold text-primary tracking-[-0.01em] mb-4">
              Quick capture, designed for the field
            </h2>
            <p className="text-[17px] text-text-secondary leading-[1.7]">
              At an open home, you have 30 seconds. The capture form is short on purpose. Name, phone, suburb,
              budget, bedrooms, optional note. Save. Add detail later from your car or office.
            </p>
            <div className="mt-8 bg-white rounded-[8px] border border-border p-6">
              <div className="space-y-3">
                {["Name", "Phone", "Suburb", "Budget", "Bedrooms", "Note (optional)"].map((field, i) => (
                  <div key={field} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-surface-container text-text-secondary text-[12px] font-semibold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 h-10 bg-background rounded border border-border flex items-center px-3">
                      <span className="text-[13px] text-text-secondary">{field}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 h-11 bg-teal-action rounded flex items-center justify-center">
                <UserPlus size={16} className="text-white mr-2" />
                <span className="text-[14px] font-semibold text-white">Save buyer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reminders */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="max-w-[760px]">
            <span className="inline-block text-[11px] font-semibold tracking-[0.08em] uppercase bg-primary text-white px-3 py-1 rounded-full mb-5">
              REMIND
            </span>
            <h2 className="text-[32px] font-bold text-primary tracking-[-0.01em] mb-4">
              Reminders that actually arrive
            </h2>
            <p className="text-[17px] text-text-secondary leading-[1.7] mb-6">
              Set a reminder when you save a buyer, or anytime later from their profile. Tonight at 7pm, tomorrow
              morning, next Monday, or pick a custom time. We send a push notification to your phone. Tap it — the
              buyer profile opens. You call. You log a note. Done.
            </p>
            <div className="bg-surface-container-low rounded-[8px] p-5 border border-border">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Smartphone size={18} className="text-secondary" />
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-primary mb-1">Heads up for iPhone users</div>
                  <p className="text-[13px] text-text-secondary leading-[1.6]">
                    Apple requires you to add BuyerPocket to your Home Screen to receive push notifications. We'll
                    walk you through it during onboarding.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notes & history */}
      <section className="bg-background py-16 md:py-20">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="max-w-[760px] md:ml-auto">
            <div className="w-12 h-12 rounded-[12px] bg-surface-container flex items-center justify-center mb-5">
              <MessageCircle size={22} className="text-text-secondary" />
            </div>
            <h2 className="text-[32px] font-bold text-primary tracking-[-0.01em] mb-4">
              Every conversation, in one place
            </h2>
            <p className="text-[17px] text-text-secondary leading-[1.7]">
              Add a note after every call, inspection, or email. BuyerPocket timestamps it and shows the full
              history on the buyer profile. Six weeks later, you'll know exactly what you said last.
            </p>
          </div>
        </div>
      </section>

      {/* Export */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="max-w-[760px]">
            <div className="w-12 h-12 rounded-[12px] bg-surface-container flex items-center justify-center mb-5">
              <Download size={22} className="text-text-secondary" />
            </div>
            <h2 className="text-[32px] font-bold text-primary tracking-[-0.01em] mb-4">
              Your data, exportable any time
            </h2>
            <p className="text-[17px] text-text-secondary leading-[1.7]">
              BuyerPocket isn't a vault. Export your full buyer list as CSV from Settings whenever you want. Use it
              for analysis, backup, or moving to another tool.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-primary py-16 md:py-20">
        <div className="max-w-[1440px] mx-auto px-6 text-center">
          <h2 className="text-[32px] font-bold text-white tracking-[-0.01em] mb-8">
            Stop losing buyers in your phone notes.
          </h2>
          <CTAButton href="/signup" size="lg">
            Start free trial
          </CTAButton>
        </div>
      </section>
    </>
  );
}
