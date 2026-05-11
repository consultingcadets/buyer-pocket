import {
  NotepadText,
  CalendarX2,
  SearchX,
  SlidersHorizontal,
  Zap,
  Bell,
  CheckCircle2,
  X,
  ArrowRight,
  Phone,
  Flame,
  PhoneCall,
  ArrowLeft,
  Pencil,
} from "lucide-react";
import CTAButton from "@/components/marketing/cta-button";
import { Testimonials } from "@/components/marketing/testimonials";

const SOFTWARE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "BuyerPocket",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, iOS, Android",
  description:
    "Buyer list and reminder tool for independent Australian real estate agents. Capture buyer preferences at open homes, filter your list when new listings arrive, and receive phone reminders before follow-ups go cold.",
  url: "https://buyerpocket.com.au",
  offers: {
    "@type": "Offer",
    price: "19",
    priceCurrency: "AUD",
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: "19",
      priceCurrency: "AUD",
      billingDuration: "P1M",
    },
    eligibleRegion: { "@type": "Country", name: "Australia" },
  },
  featureList: [
    "Buyer capture at open homes",
    "Filter by suburb, budget, bedrooms, land size, property type",
    "Phone push notifications for reminders",
    "Notes and contact history per buyer",
    "CSV export",
    "Matched buyer suggestions for new listings",
  ],
  publisher: {
    "@type": "Organization",
    name: "Consulting Cadets Pty Ltd",
    url: "https://buyerpocket.com.au",
  },
};

export const metadata = {
  title: { absolute: "Capture buyers fast. Follow up on time. — BuyerPocket" },
  description:
    "A simple buyer list and reminder tool built for Australian real estate agents. Save buyer details in seconds, find matching buyers for new listings, and never miss a follow-up.",
  openGraph: {
    title: "Capture buyers fast. Follow up on time. — BuyerPocket",
    description:
      "A simple buyer list and reminder tool built for Australian real estate agents. Save buyer details in seconds, find matching buyers for new listings, and never miss a follow-up.",
    url: "https://buyerpocket.com.au",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BuyerPocket — buyer list and reminder tool for Australian real estate agents" }],
  },
};

export default function MarketingHome() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SOFTWARE_SCHEMA) }}
      />
      {/* ── Hero ── */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <p className="text-xs font-bold tracking-[0.12em] text-secondary uppercase">
              For Australian real estate agents
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary leading-tight">
              Capture buyers fast. Follow up on time.
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed max-w-lg">
              A simple buyer list and reminder tool built for Australian real
              estate agents who own their buyer relationships. Save buyer details
              in seconds, find matching buyers when a new listing comes up, and
              never miss a follow-up.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
              <CTAButton href="/signup" size="lg">
                Start 7-day free trial
              </CTAButton>
              <span className="text-sm text-text-secondary">
                $19/month after trial. Cancel anytime. No credit card to start.
              </span>
            </div>
            <p className="text-sm text-text-secondary border-t border-border pt-4">
              Built for independent agents and small-agency principals. If you
              work under an agency, check that personal capture tools are
              permitted by your contract.
            </p>
          </div>

          {/* Phone mockup */}
          <div className="relative w-full flex justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-secondary-container/20 to-surface-container/20 rounded-full blur-3xl" />
            <div className="relative w-[300px] h-[600px] bg-surface border-[10px] border-surface-container-high rounded-[48px] shadow-2xl flex flex-col overflow-hidden">
              <div className="w-full h-7 bg-surface-container-high rounded-b-xl flex justify-center items-end pb-1">
                <div className="w-16 h-4 bg-surface rounded-full" />
              </div>
              <div className="p-4 flex flex-col gap-3 flex-1">
                <div className="flex justify-between items-center">
                  <ArrowLeft size={20} className="text-text-primary" />
                  <span className="text-xs font-semibold tracking-wide text-text-primary">
                    Buyer Profile
                  </span>
                  <Pencil size={16} className="text-text-primary" />
                </div>
                <div className="bg-background rounded-lg p-3 border border-border/40 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-text-primary">
                      Sarah Jenkins
                    </h3>
                    <div className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1">
                      <Flame size={10} />
                      Hot chip
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary flex items-center gap-1">
                    <Phone size={12} />
                    0412 345 678
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-background rounded-lg p-2 border border-border/40">
                    <span className="text-[10px] text-text-secondary block mb-0.5">
                      Budget
                    </span>
                    <span className="text-xs font-semibold text-text-primary">
                      $650k – $750k
                    </span>
                  </div>
                  <div className="bg-background rounded-lg p-2 border border-border/40">
                    <span className="text-[10px] text-text-secondary block mb-0.5">
                      Locations
                    </span>
                    <span className="text-xs font-semibold text-text-primary">
                      Wollert, Mernda
                    </span>
                  </div>
                </div>
                <div className="mt-auto bg-primary-container text-on-primary rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold">Follow up</div>
                    <div className="text-[10px] opacity-80">
                      Tomorrow, 10:00 am
                    </div>
                  </div>
                  <CheckCircle2 size={18} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Problem ── */}
      <section className="bg-surface-container py-16 md:py-24">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-text-primary mb-16">
            Buyer details shouldn&apos;t live in your phone notes.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(
              [
                {
                  icon: <NotepadText size={22} />,
                  title: "Notes get scattered",
                  body: "Buyer details end up in messages, paper, contacts, three different apps. By next week, you can't find them.",
                },
                {
                  icon: <CalendarX2 size={22} />,
                  title: "Follow-ups slip",
                  body: "You meant to call Tuesday. Tuesday turned into Friday. The buyer bought somewhere else.",
                },
                {
                  icon: <SearchX size={22} />,
                  title: "New listings, lost matches",
                  body: "A new property comes up. You know you met someone looking for exactly this two months ago. You can't remember who.",
                },
              ] as const
            ).map(({ icon, title, body }) => (
              <div
                key={title}
                className="bg-surface rounded-lg p-6 border border-border/20 shadow-sm flex flex-col gap-3 hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-error-bg text-error-text flex items-center justify-center">
                  {icon}
                </div>
                <h3 className="text-xl font-semibold text-text-primary">
                  {title}
                </h3>
                <p className="text-base text-text-secondary">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-text-primary mb-16">
          What BuyerPocket does.
        </h2>
        <div className="flex flex-col gap-28">
          {/* Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-4 order-2 md:order-1">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high text-text-primary flex items-center justify-center">
                <SlidersHorizontal size={20} />
              </div>
              <span className="text-xs font-bold tracking-[0.12em] text-secondary uppercase">
                Filter
              </span>
              <h3 className="text-2xl font-semibold text-text-primary">
                Find the right buyer in two taps
              </h3>
              <p className="text-lg text-text-secondary leading-relaxed">
                New listing in Wollert, 4 bedrooms, 600m² block? Filter your
                buyer list by suburb, land size, budget, and bedrooms. Get the
                matching buyers instantly. Call them before they see it on REA.
              </p>
            </div>
            <div className="order-1 md:order-2 bg-surface-container rounded-xl p-6 flex items-center justify-center h-[360px] border border-border/20">
              <div className="w-full max-w-sm bg-surface rounded-lg shadow-sm p-5 flex flex-col gap-4 border border-border/30">
                <div className="flex justify-between items-center border-b border-border/30 pb-3">
                  <span className="text-sm font-semibold text-text-primary">
                    Active Filters
                  </span>
                  <span className="text-sm text-secondary">Clear all</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Wollert", "$600k – $800k"].map((tag) => (
                    <div
                      key={tag}
                      className="bg-surface-container px-3 py-1.5 rounded-full flex items-center gap-1.5"
                    >
                      <span className="text-sm text-text-primary">{tag}</span>
                      <X size={12} className="text-text-secondary" />
                    </div>
                  ))}
                  <div className="bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <span className="text-sm font-medium">Hot chips only</span>
                    <X size={12} />
                  </div>
                </div>
                <div className="mt-2 bg-primary text-on-primary rounded py-2.5 text-center text-sm font-semibold">
                  Show 14 Buyers
                </div>
              </div>
            </div>
          </div>

          {/* Capture */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-1 bg-surface-container rounded-xl p-6 flex items-center justify-center h-[360px] border border-border/20">
              <div className="w-full max-w-sm bg-surface rounded-lg shadow-sm p-5 flex flex-col gap-4 border border-border/30">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-text-primary">
                    Buyer Name
                  </label>
                  <div className="w-full h-10 border border-border rounded flex items-center px-3 bg-background">
                    <div className="w-0.5 h-5 bg-secondary animate-pulse" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-text-primary">
                      Min Price
                    </label>
                    <div className="w-full h-10 border border-border rounded bg-background" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-text-primary">
                      Max Price
                    </label>
                    <div className="w-full h-10 border border-border rounded bg-background" />
                  </div>
                </div>
                <div className="w-full h-10 bg-teal-action text-on-teal-action rounded text-sm font-semibold flex items-center justify-center mt-1">
                  Save Buyer
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 order-2">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high text-text-primary flex items-center justify-center">
                <Zap size={20} />
              </div>
              <span className="text-xs font-bold tracking-[0.12em] text-secondary uppercase">
                Capture
              </span>
              <h3 className="text-2xl font-semibold text-text-primary">
                Add a buyer in 30 seconds
              </h3>
              <p className="text-lg text-text-secondary leading-relaxed">
                Name, phone, suburb, budget. Done. No 19-field forms slowing you
                down at an open home. Add the rest later when you&apos;re back
                at your desk.
              </p>
            </div>
          </div>

          {/* Remind */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-4 order-2 md:order-1">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high text-text-primary flex items-center justify-center">
                <Bell size={20} />
              </div>
              <span className="text-xs font-bold tracking-[0.12em] text-secondary uppercase">
                Remind
              </span>
              <h3 className="text-2xl font-semibold text-text-primary">
                Phone reminders that actually fire
              </h3>
              <p className="text-lg text-text-secondary leading-relaxed">
                Set a follow-up for tomorrow morning. We send a push
                notification straight to your phone. Tap it, the buyer profile
                opens, you call. That&apos;s it.
              </p>
            </div>
            <div className="order-1 md:order-2 bg-surface-container rounded-xl p-6 flex items-center justify-center h-[360px] border border-border/20 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-[0.045]"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Ccircle cx='1' cy='1' r='1.2' fill='%231B1B1D'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "repeat",
                }}
              />
              <div className="relative z-10 w-full max-w-sm bg-surface rounded-xl shadow-lg p-4 flex gap-4 border border-border/30">
                <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shrink-0">
                  <PhoneCall size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-text-primary">
                    Call Sarah Jenkins
                  </span>
                  <span className="text-sm text-text-secondary">
                    Checking in on 12 Smith St inspection.
                  </span>
                  <span className="text-sm text-secondary font-medium mt-1">
                    Now
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-surface-container-low py-16 md:py-24 border-y border-border/10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-text-primary mb-16">
            Three things. That&apos;s the whole product.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(
              [
                {
                  n: "1",
                  title: "Capture",
                  body: "Add buyers fast at open homes, inspections, or after phone enquiries.",
                },
                {
                  n: "2",
                  title: "Filter",
                  body: "When a new listing comes up, find every buyer who matches its criteria.",
                },
                {
                  n: "3",
                  title: "Follow up",
                  body: "Set reminders. We notify your phone. You make the call.",
                },
              ] as const
            ).map(({ n, title, body }) => (
              <div
                key={n}
                className="bg-surface rounded-lg p-8 border border-border/20 shadow-sm relative overflow-hidden"
              >
                <span className="absolute top-4 right-4 text-[80px] font-bold text-surface-container-high leading-none select-none">
                  {n}
                </span>
                <div className="relative z-10 flex flex-col gap-3">
                  <h3 className="text-xl font-semibold text-text-primary">
                    {title}
                  </h3>
                  <p className="text-base text-text-secondary">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-text-primary mb-16">
          One plan. One price.
        </h2>
        <div className="max-w-md mx-auto bg-surface rounded-xl shadow-lg p-8 border border-border/30 flex flex-col items-center">
          <div className="bg-primary text-on-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
            PRO
          </div>
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-[48px] font-bold text-text-primary leading-none">
              $19
            </span>
            <span className="text-base text-text-secondary">/ month AUD</span>
          </div>
          <p className="text-sm text-text-secondary mb-8">
            7-day free trial. No credit card required to start.
          </p>
          <ul className="w-full flex flex-col gap-4 mb-8">
            {[
              "Unlimited buyers",
              "Suburb, land size, budget, bedroom filtering",
              "Phone push reminders",
              "Notes and contact history per buyer",
              "Works on phone, tablet, and desktop",
              "Export your buyer list anytime",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2
                  size={18}
                  className="text-secondary shrink-0 mt-0.5"
                />
                <span className="text-base text-text-primary">{item}</span>
              </li>
            ))}
          </ul>
          <CTAButton href="/signup" fullWidth>
            Start free trial
          </CTAButton>
          <p className="text-sm text-text-secondary mt-3">
            Cancel anytime from settings.
          </p>
        </div>
      </section>

      {/* ── Who it's for ── */}
      <section className="bg-surface-container-low py-16 md:py-24 border-y border-border/10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-text-primary mb-16">
            Who BuyerPocket is for.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-semibold text-text-primary border-b border-border/30 pb-3">
                Built for
              </h3>
              <ul className="flex flex-col gap-3">
                {[
                  "Independent licensed agents",
                  "Small-agency principals",
                  "Agents whose agency permits personal capture tools",
                  "Anyone whose buyer relationships are theirs",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-base text-text-secondary"
                  >
                    <ArrowRight
                      size={16}
                      className="text-text-primary shrink-0 mt-0.5"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-4 opacity-80">
              <h3 className="text-xl font-semibold text-text-primary border-b border-border/30 pb-3">
                Not the right fit
              </h3>
              <ul className="flex flex-col gap-3">
                {[
                  "Contract agents at large agencies (your buyer data belongs to the agency)",
                  "Buyer's agents who need property research and matching tools (try Stash or BA-ICON)",
                  "Agencies needing a multi-user CRM (try Agentbox, VaultRE, or Rex)",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-base text-text-secondary"
                  >
                    <X
                      size={16}
                      className="text-text-secondary shrink-0 mt-0.5"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── What is BuyerPocket — definition block for AI citation ── */}
      <section className="max-w-2xl mx-auto px-6 md:px-12 py-12 text-center" aria-label="What is BuyerPocket">
        <h2 className="text-xl font-bold text-primary mb-3">What is BuyerPocket?</h2>
        <p className="text-[16px] text-text-secondary leading-relaxed">
          BuyerPocket is a buyer list and reminder tool built for independent Australian real estate agents.
          It lets agents save buyer preferences at open homes, filter their list when new listings arrive,
          and receive phone reminders before follow-ups go cold — without the complexity of a full agency CRM.
        </p>
      </section>

      {/* ── Testimonials ── */}
      <Testimonials />

      {/* ── Final CTA ── */}
      <section className="bg-primary text-on-primary py-24 mt-12 mx-6 md:mx-12 rounded-2xl text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
        <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Stop losing buyers in your phone notes.
          </h2>
          <p className="text-lg text-on-primary/80">
            Try BuyerPocket free for 7 days. $19/month after that. Cancel
            anytime.
          </p>
          <CTAButton href="/signup" size="lg" variant="dark">
            Start free trial
          </CTAButton>
        </div>
      </section>

      <div className="py-8" />
    </>
  );
}
