import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Check, X, SlidersHorizontal, UserPlus, Bell } from "lucide-react";
import MarketingNav from "@/components/marketing/marketing-nav";
import MarketingFooter from "@/components/marketing/marketing-footer";
import CTAButton from "@/components/marketing/cta-button";

export const metadata: Metadata = {
  title: "BuyerPocket — Capture buyers fast. Follow up on time.",
  description:
    "A simple buyer list and reminder tool built for Australian real estate agents who own their buyer relationships.",
  openGraph: {
    title: "BuyerPocket — Capture buyers fast. Follow up on time.",
    description:
      "A simple buyer list and reminder tool built for Australian real estate agents who own their buyer relationships.",
    type: "website",
    url: "https://buyerpocket.com.au",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "BuyerPocket",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, iOS, Android",
  description:
    "A simple buyer list and reminder tool built for Australian real estate agents who own their buyer relationships.",
  url: "https://buyerpocket.com.au",
  offers: {
    "@type": "Offer",
    price: "19",
    priceCurrency: "AUD",
    priceValidUntil: "2027-12-31",
  },
  featureList: [
    "Unlimited buyers",
    "Suburb, land size, budget, bedroom filtering",
    "Phone push reminders",
    "Notes and contact history",
    "CSV export",
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <MarketingNav />

      <main>
        {/* Hero */}
        <section className="bg-background pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="max-w-[1440px] mx-auto px-6">
            <div className="max-w-[680px]">
              <h1 className="text-[40px] md:text-[56px] font-bold text-primary leading-[1.1] tracking-[-0.02em]">
                Capture buyers fast. Follow up on time.
              </h1>
              <p className="mt-5 text-[18px] text-text-secondary leading-[1.6] max-w-[560px]">
                A simple buyer list and reminder tool built for Australian real estate agents who own their buyer
                relationships. Save buyer details in seconds, find matching buyers when a new listing comes up, and
                never miss a follow-up.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <CTAButton href="/signup" size="lg">
                  Start 7-day free trial
                </CTAButton>
                <p className="text-sm text-text-secondary">
                  $19/month after trial. Cancel anytime. No credit card to start.
                </p>
              </div>
              <p className="mt-4 text-[13px] text-text-secondary leading-[1.5]">
                Built for independent agents and small-agency principals. If you work under an agency, check that
                personal capture tools are permitted by your contract.
              </p>
            </div>
          </div>
        </section>

        {/* Problem */}
        <section className="bg-white py-16 md:py-20">
          <div className="max-w-[1440px] mx-auto px-6">
            <h2 className="text-[32px] font-bold text-primary tracking-[-0.01em] mb-10 max-w-[640px]">
              Buyer details shouldn't live in your phone notes.
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Notes get scattered",
                  body: "Buyer details end up in messages, paper, contacts, three different apps. By next week, you can't find them.",
                },
                {
                  title: "Follow-ups slip",
                  body: "You meant to call Tuesday. Tuesday turned into Friday. The buyer bought somewhere else.",
                },
                {
                  title: "New listings, lost matches",
                  body: "A new property comes up. You know you met someone looking for exactly this two months ago. You can't remember who.",
                },
              ].map(({ title, body }) => (
                <div
                  key={title}
                  className="bg-background rounded-[8px] p-6"
                  style={{ boxShadow: "0px 4px 20px rgba(13, 27, 42, 0.05)" }}
                >
                  <h3 className="text-[18px] font-semibold text-primary mb-2">{title}</h3>
                  <p className="text-[15px] text-text-secondary leading-[1.6]">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-background py-16 md:py-24">
          <div className="max-w-[1440px] mx-auto px-6">
            <h2 className="text-[32px] font-bold text-primary tracking-[-0.01em] mb-14 text-center">
              What BuyerPocket does.
            </h2>
            <div className="flex flex-col gap-16 md:gap-20">
              <FeatureBlock
                tag="FILTER"
                tagColor="bg-accent text-primary"
                title="Find the right buyer in two taps"
                body="New listing in Wollert, 4 bedrooms, 600m² block? Filter your buyer list by suburb, land size, budget, and bedrooms. Get the matching buyers instantly. Call them before they see it on REA."
                icon={<SlidersHorizontal size={28} className="text-accent" />}
                reverse={false}
              />
              <FeatureBlock
                tag="CAPTURE"
                tagColor="bg-secondary text-primary"
                title="Add a buyer in 30 seconds"
                body="Name, phone, suburb, budget. Done. No 19-field forms slowing you down at an open home. Add the rest later when you're back at your desk."
                icon={<UserPlus size={28} className="text-secondary" />}
                reverse={true}
              />
              <FeatureBlock
                tag="REMIND"
                tagColor="bg-primary text-white"
                title="Phone reminders that actually fire"
                body="Set a follow-up for tomorrow morning. We send a push notification straight to your phone. Tap it, the buyer profile opens, you call. That's it."
                icon={<Bell size={28} className="text-primary" />}
                reverse={false}
              />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-surface-container-low py-16 md:py-20">
          <div className="max-w-[1440px] mx-auto px-6">
            <h2 className="text-[32px] font-bold text-primary tracking-[-0.01em] mb-10 text-center">
              Three things. That's the whole product.
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-[900px] mx-auto">
              {[
                {
                  n: "1",
                  label: "Capture",
                  body: "Add buyers fast at open homes, inspections, or after phone enquiries.",
                },
                {
                  n: "2",
                  label: "Filter",
                  body: "When a new listing comes up, find every buyer who matches its criteria.",
                },
                {
                  n: "3",
                  label: "Follow up",
                  body: "Set reminders. We notify your phone. You make the call.",
                },
              ].map(({ n, label, body }) => (
                <div key={label} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-teal-action text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    {n}
                  </div>
                  <div>
                    <div className="font-semibold text-primary text-[16px] mb-1">{label}</div>
                    <p className="text-[15px] text-text-secondary leading-[1.6]">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="bg-white py-16 md:py-20">
          <div className="max-w-[1440px] mx-auto px-6">
            <h2 className="text-[32px] font-bold text-primary tracking-[-0.01em] mb-10 text-center">
              One plan. One price.
            </h2>
            <div className="max-w-[440px] mx-auto">
              <div
                className="bg-white rounded-[8px] border border-border p-8"
                style={{ boxShadow: "0px 4px 20px rgba(13, 27, 42, 0.05)" }}
              >
                <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-text-secondary mb-3">
                  PRO
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-[44px] font-bold text-primary leading-none">$19</span>
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
                <ul className="mt-6 space-y-3">
                  {[
                    "Unlimited buyers",
                    "Suburb, land size, budget, bedroom filtering",
                    "Phone push reminders",
                    "Notes and contact history per buyer",
                    "Works on phone, tablet, and desktop",
                    "Export your buyer list anytime",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[14px] text-text-primary">
                      <Check size={16} className="text-secondary mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Who it's for */}
            <div className="mt-14 max-w-[800px] mx-auto">
              <h2 className="text-[32px] font-bold text-primary tracking-[-0.01em] mb-8 text-center">
                Who BuyerPocket is for.
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div
                  className="bg-background rounded-[8px] p-6"
                  style={{ boxShadow: "0px 4px 20px rgba(13, 27, 42, 0.05)" }}
                >
                  <div className="text-[12px] font-semibold tracking-[0.05em] uppercase text-teal-action mb-4">
                    Built for
                  </div>
                  <ul className="space-y-2.5">
                    {[
                      "Independent licensed agents",
                      "Small-agency principals",
                      "Agents whose agency permits personal capture tools",
                      "Anyone whose buyer relationships are theirs",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[14px] text-text-primary">
                        <Check size={15} className="text-secondary mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-background rounded-[8px] p-6" style={{ boxShadow: "0px 4px 20px rgba(13, 27, 42, 0.05)" }}>
                  <div className="text-[12px] font-semibold tracking-[0.05em] uppercase text-text-secondary mb-4">
                    Not the right fit
                  </div>
                  <ul className="space-y-2.5">
                    {[
                      "Contract agents at large agencies (your buyer data belongs to the agency)",
                      "Buyer's agents who need property research and matching tools (try Stash or BA-ICON)",
                      "Agencies needing a multi-user CRM (try Agentbox, VaultRE, or Rex)",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[14px] text-text-secondary">
                        <X size={15} className="text-text-secondary mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
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
      </main>

      <MarketingFooter />
    </>
  );
}

function FeatureBlock({
  tag,
  tagColor,
  title,
  body,
  icon,
  reverse,
}: {
  tag: string;
  tagColor: string;
  title: string;
  body: string;
  icon: React.ReactNode;
  reverse: boolean;
}) {
  return (
    <div className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} gap-8 items-center`}>
      <div className="flex-1">
        <span
          className={`inline-block text-[11px] font-semibold tracking-[0.08em] uppercase px-3 py-1 rounded-full mb-4 ${tagColor}`}
        >
          {tag}
        </span>
        <h3 className="text-[24px] font-semibold text-primary mb-3 leading-[1.3]">{title}</h3>
        <p className="text-[16px] text-text-secondary leading-[1.7]">{body}</p>
      </div>
      <div className="flex-1 flex justify-center">
        <div
          className="w-full max-w-[400px] h-[240px] bg-surface-container rounded-[12px] flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="flex flex-col items-center gap-3 opacity-40">
            {icon}
            <div className="w-32 h-2 bg-border rounded-full" />
            <div className="w-24 h-2 bg-border rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
