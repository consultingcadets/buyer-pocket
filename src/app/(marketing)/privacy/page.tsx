import Link from "next/link";
import { LEGAL_ABN, LEGAL_ENTITY, SUPPORT_EMAIL } from "@/lib/company";

export const metadata = {
  title: "Privacy Policy — BuyerPocket",
};

const EFFECTIVE_DATE = "1 May 2026";
const APP = "BuyerPocket";
const URL = "buyerpocket.com.au";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Privacy Policy</h1>
        <p className="text-sm text-text-secondary mb-10">
          Effective date: {EFFECTIVE_DATE} · {APP} is operated by {LEGAL_ENTITY} (ABN {LEGAL_ABN})
        </p>

        <div className="prose prose-sm max-w-none text-text-primary space-y-8">

          <Section title="1. About this policy">
            <p>
              {LEGAL_ENTITY} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates {APP} at {URL}. This policy explains how we collect, use, disclose, and protect personal information in accordance with the <em>Privacy Act 1988</em> (Cth) and the Australian Privacy Principles (APPs).
            </p>
            <p>
              By using {APP} you consent to the practices described in this policy. If you do not agree, please do not use the service.
            </p>
          </Section>

          <Section title="2. Information we collect">
            <p>We collect the following categories of personal information:</p>
            <ul>
              <li><strong>Account information:</strong> Your name, email address, mobile number, agency name, and state.</li>
              <li><strong>Buyer records:</strong> Names, phone numbers, email addresses, property preferences, notes, and reminders that you enter about your clients. You are the data controller for this information.</li>
              <li><strong>Usage data:</strong> Pages visited, features used, timestamps, and device information (collected via PostHog analytics and server logs).</li>
              <li><strong>Payment information:</strong> Processed by Stripe. We do not store card numbers or full payment details.</li>
              <li><strong>Push notification tokens:</strong> Device identifiers used to deliver push notifications.</li>
            </ul>
          </Section>

          <Section title="3. How we use your information">
            <p>We use personal information to:</p>
            <ul>
              <li>Provide and improve the {APP} service</li>
              <li>Send reminders and notifications you have configured</li>
              <li>Process billing and subscriptions</li>
              <li>Respond to support requests</li>
              <li>Comply with legal obligations</li>
              <li>Detect and prevent fraud or misuse</li>
            </ul>
            <p>We do not sell your personal information or your buyers&apos; information to third parties. We do not use buyer data for advertising or AI model training.</p>
          </Section>

          <Section title="4. Buyer data — your responsibilities">
            <p>
              {APP} is a tool for real estate agents to manage their own client relationships. The buyer records you enter are <strong>your responsibility</strong>. You must:
            </p>
            <ul>
              <li>Have a lawful basis to collect and store your buyers&apos; personal information</li>
              <li>Comply with the Privacy Act and any applicable state legislation</li>
              <li>Obtain consent where required before contacting buyers</li>
              <li>Not enter information about individuals without their knowledge where consent is required</li>
            </ul>
            <p>
              We process buyer records on your behalf as a data processor. Our data processing agreement is incorporated into our Terms of Service.
            </p>
          </Section>

          <Section title="5. Disclosure of information">
            <p>We share information with:</p>
            <ul>
              <li><strong>Supabase:</strong> Database and authentication hosting (servers located in Australia — ap-southeast-2)</li>
              <li><strong>Stripe:</strong> Payment processing</li>
              <li><strong>Resend:</strong> Transactional email delivery</li>
              <li><strong>Firebase (Google):</strong> Push notification delivery</li>
              <li><strong>Vercel:</strong> Web hosting and CDN</li>
              <li><strong>PostHog:</strong> Product analytics (anonymised)</li>
            </ul>
            <p>
              We require all service providers to protect personal information in accordance with Australian privacy law. We will disclose information if required by law, court order, or to protect the safety of individuals.
            </p>
          </Section>

          <Section title="6. Data storage and security">
            <p>
              Your data is stored in Supabase&apos;s Sydney region (AWS ap-southeast-2). We implement row-level security so each user can only access their own data. All data is encrypted in transit (TLS 1.2+) and at rest (AES-256).
            </p>
            <p>
              Despite our precautions, no internet transmission is 100% secure. You are responsible for maintaining the security of your account credentials.
            </p>
          </Section>

          <Section title="7. Data retention and deletion">
            <p>
              We retain your account data for as long as your account is active. If you delete your account, your data is retained for 30 days (to allow recovery) then permanently deleted. You may email {SUPPORT_EMAIL} within 30 days to cancel a deletion request.
            </p>
            <p>
              Billing records may be retained for up to 7 years to meet our legal obligations under Australian tax law.
            </p>
          </Section>

          <Section title="8. Your rights">
            <p>Under the Privacy Act, you have the right to:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Ask us to correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data via Settings → Your data</li>
              <li><strong>Portability:</strong> Export your buyer data as CSV at any time from Settings</li>
              <li><strong>Complaint:</strong> Lodge a complaint with the Office of the Australian Information Commissioner (OAIC) at oaic.gov.au</li>
            </ul>
            <p>To exercise any right, email {SUPPORT_EMAIL}. We will respond within 30 days.</p>
          </Section>

          <Section title="9. Cookies and tracking">
            <p>
              {APP} uses cookies and similar technologies for authentication (Supabase session cookies) and analytics (PostHog). We do not use advertising cookies or cross-site tracking.
            </p>
          </Section>

          <Section title="10. Children">
            <p>
              {APP} is not directed at children under 18. We do not knowingly collect information from children. If you believe a child has provided us with personal information, contact {SUPPORT_EMAIL}.
            </p>
          </Section>

          <Section title="11. Changes to this policy">
            <p>
              We may update this policy from time to time. Material changes will be notified by email or in-app notice at least 14 days before they take effect. Continued use of {APP} after the effective date constitutes acceptance.
            </p>
          </Section>

          <Section title="12. Contact">
            <p>
              Privacy enquiries: <a href={`mailto:${SUPPORT_EMAIL}`} className="text-accent">{SUPPORT_EMAIL}</a>
            </p>
            <p>
              {LEGAL_ENTITY} (ABN {LEGAL_ABN})<br />
              Australia
            </p>
          </Section>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <Link href="/terms" className="text-sm text-accent mr-6">Terms of Service</Link>
          <Link href="/" className="text-sm text-accent">Home</Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-text-primary mb-3">{title}</h2>
      <div className="space-y-3 text-sm text-text-primary leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
        {children}
      </div>
    </section>
  );
}
