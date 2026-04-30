import type { Metadata } from "next";
import ContactForm from "./contact-form";
import { SUPPORT_EMAIL } from "@/lib/company";
import { getPublicAppUrl } from "@/lib/app-url";

const appUrl = getPublicAppUrl();

export const metadata: Metadata = {
  title: "Contact",
  description: "Send us a message and we'll get back to you within one business day.",
  openGraph: {
    title: "Contact — BuyerPocket",
    description: "Get in touch with the BuyerPocket team — buyer list and reminder tool for Australian real estate agents.",
    url: `${appUrl}/contact`,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BuyerPocket" }],
  },
};

export default function ContactPage() {
  return (
    <section className="bg-background min-h-[60vh] py-16 md:py-20">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="max-w-[520px] mx-auto">
          <h1 className="text-[36px] font-bold text-primary tracking-[-0.02em] mb-2">
            Contact us
          </h1>
          <p className="text-[16px] text-text-secondary mb-8">
            Send us a message and we'll get back to you within one business day. Or email us directly at{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-accent underline underline-offset-2"
            >
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
