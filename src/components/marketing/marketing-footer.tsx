import Link from "next/link";

export default function MarketingFooter() {
  return (
    <footer className="bg-primary text-white border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-12">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8">
          <div>
            <div className="font-bold text-[18px] tracking-tight text-white">BuyerPocket</div>
            <p className="text-sm text-white/60 mt-1.5 leading-relaxed">
              © 2026 BuyerPocket. Built in Australia.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {[
                { label: "Features", href: "/features" },
                { label: "Pricing", href: "/pricing" },
                { label: "About", href: "/about" },
                { label: "Privacy", href: "/privacy" },
                { label: "Terms", href: "/terms" },
                { label: "Contact", href: "/contact" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="inline-flex min-h-12 items-center rounded-lg px-2 py-1 text-sm text-white/75 transition-colors hover:bg-white/10 hover:text-white sm:min-h-0"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
