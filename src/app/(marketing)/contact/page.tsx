import type { Metadata } from "next";
import ContactForm from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Send us a message and we'll get back to you within one business day.",
  openGraph: {
    title: "Contact — BuyerPocket",
    description: "Get in touch with the BuyerPocket team.",
    url: "https://buyerpocket.com.au/contact",
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
              href="mailto:support@buyerpocket.com.au"
              className="text-accent underline underline-offset-2"
            >
              support@buyerpocket.com.au
            </a>
            .
          </p>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
