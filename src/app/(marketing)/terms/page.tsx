import Link from "next/link";

export const metadata = {
  title: "Terms of Service — BuyerPocket",
};

const EFFECTIVE_DATE = "1 May 2026";
const COMPANY = "BuyerPocket Pty Ltd";
const EMAIL = "support@buyerpocket.com.au";
const APP = "BuyerPocket";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Terms of Service</h1>
        <p className="text-sm text-text-secondary mb-10">
          Effective date: {EFFECTIVE_DATE} · {COMPANY} (ABN pending)
        </p>

        <div className="space-y-8 text-sm text-text-primary leading-relaxed">

          <Section title="1. Agreement to terms">
            <p>
              By accessing or using {APP} at buyerpocket.com.au (&ldquo;Service&rdquo;), you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree, do not use the Service.
            </p>
            <p>
              These Terms constitute a legally binding agreement between you and {COMPANY} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;).
            </p>
          </Section>

          <Section title="2. Eligibility">
            <p>You must be:</p>
            <ul>
              <li>At least 18 years old</li>
              <li>A licensed real estate agent or operate under the direct supervision of one, in accordance with the laws of your Australian state or territory</li>
              <li>Using the Service for legitimate professional purposes</li>
            </ul>
            <p>
              {APP} is designed for <strong>independent real estate agents and boutique agencies</strong> that are not affiliated with a franchise network that prohibits the use of third-party CRM tools. By registering, you confirm you have the authority to use {APP} in your professional capacity.
            </p>
          </Section>

          <Section title="3. Account registration">
            <p>
              You must provide accurate and complete information when registering. You are responsible for maintaining the security of your account credentials and for all activity that occurs under your account.
            </p>
            <p>
              Notify us immediately at {EMAIL} if you believe your account has been compromised.
            </p>
          </Section>

          <Section title="4. Acceptable use">
            <p>You agree to use {APP} only for lawful purposes. You must not:</p>
            <ul>
              <li>Enter personal information about individuals without a lawful basis to do so</li>
              <li>Use the Service to harass, stalk, or contact individuals without their consent</li>
              <li>Scrape, reverse-engineer, or copy any part of the Service</li>
              <li>Share your account with other users</li>
              <li>Attempt to circumvent any security or access controls</li>
              <li>Use the Service in a manner that violates the <em>Privacy Act 1988</em> (Cth) or the Spam Act</li>
            </ul>
          </Section>

          <Section title="5. Buyer data — your responsibility">
            <p>
              The personal information of your buyers that you enter into {APP} is your data. You are the data controller; we are a data processor acting on your instructions.
            </p>
            <p>You must:</p>
            <ul>
              <li>Have a lawful basis to collect, store, and process your buyers&apos; personal information</li>
              <li>Handle buyer data in compliance with the <em>Privacy Act 1988</em>, applicable state legislation, and your agency&apos;s privacy policy</li>
              <li>Obtain consent before contacting buyers where required by law</li>
              <li>Not use {APP} as a substitute for proper client consent management</li>
            </ul>
            <p>
              We are not liable for any misuse of buyer data or for your failure to comply with applicable privacy laws.
            </p>
          </Section>

          <Section title="6. Subscription and billing">
            <p>
              {APP} is offered on a subscription basis. Pricing is displayed on our website and in your account settings. Subscriptions are charged in AUD.
            </p>
            <ul>
              <li><strong>Free trial:</strong> New accounts receive a 7-day free trial with full access. No payment is required during the trial.</li>
              <li><strong>Billing:</strong> After the trial, your nominated payment method is charged monthly or annually (depending on your plan) via Stripe.</li>
              <li><strong>Cancellation:</strong> You may cancel at any time via Settings → Billing. Access continues until the end of your billing period. No refunds are provided for unused portions of a billing period.</li>
              <li><strong>Price changes:</strong> We will give you 30 days notice of any price increase. Continued use after the notice period constitutes acceptance.</li>
            </ul>
          </Section>

          <Section title="7. Intellectual property">
            <p>
              {APP}, its design, software, and content are owned by {COMPANY} and protected by Australian and international intellectual property laws. You are granted a limited, non-exclusive, non-transferable licence to use the Service for your personal professional purposes.
            </p>
            <p>
              You retain all rights to the buyer data you enter. By using the Service, you grant us a limited licence to store and process that data solely to provide the Service to you.
            </p>
          </Section>

          <Section title="8. Service availability">
            <p>
              We aim for 99.5% monthly uptime but do not guarantee uninterrupted access. Planned maintenance will be notified in advance where possible.
            </p>
            <p>
              We reserve the right to modify, suspend, or discontinue the Service with 30 days notice. In the event of discontinuation, we will provide a CSV export of your data.
            </p>
          </Section>

          <Section title="9. Limitation of liability">
            <p>
              To the maximum extent permitted by Australian law, we exclude all liability for indirect, incidental, special, consequential, or punitive damages arising from your use of the Service, including loss of buyers, loss of commissions, or loss of data.
            </p>
            <p>
              Our total liability to you for any claim arising from these Terms or the Service is limited to the amount you paid us in the 12 months preceding the claim.
            </p>
            <p>
              Nothing in these Terms excludes any rights you have under the <em>Australian Consumer Law</em> that cannot be excluded.
            </p>
          </Section>

          <Section title="10. Indemnity">
            <p>
              You agree to indemnify and hold {COMPANY} harmless from any claims, damages, or expenses (including legal fees) arising from your use of the Service, your breach of these Terms, or your violation of any third party&apos;s rights.
            </p>
          </Section>

          <Section title="11. Termination">
            <p>
              We may suspend or terminate your account immediately if you breach these Terms, engage in fraudulent activity, or use the Service in a manner harmful to others or to us.
            </p>
            <p>
              You may terminate your account at any time via Settings → Your data → Delete account. Sections 5, 9, 10, and 13 survive termination.
            </p>
          </Section>

          <Section title="12. Changes to terms">
            <p>
              We may update these Terms from time to time. Material changes will be notified by email at least 14 days before they take effect. Continued use of the Service after the effective date constitutes acceptance.
            </p>
          </Section>

          <Section title="13. Governing law">
            <p>
              These Terms are governed by the laws of New South Wales, Australia. Any dispute arising from these Terms will be subject to the exclusive jurisdiction of the courts of New South Wales.
            </p>
          </Section>

          <Section title="14. Contact">
            <p>
              Questions about these Terms: <a href={`mailto:${EMAIL}`} className="text-accent">{EMAIL}</a>
            </p>
            <p>
              {COMPANY}<br />
              Australia
            </p>
          </Section>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <Link href="/privacy" className="text-sm text-accent mr-6">Privacy Policy</Link>
          <Link href="/" className="text-sm text-accent">Home</Link>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-text-primary mb-3">{title}</h2>
      <div className="space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
        {children}
      </div>
    </section>
  );
}
