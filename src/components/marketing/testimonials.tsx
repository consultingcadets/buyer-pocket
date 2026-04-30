const TESTIMONIALS = [
  {
    quote:
      "I used to track buyers in a spreadsheet and phone notes. When a listing came up I'd spend twenty minutes working out who to call first. Now I filter and have a shortlist in seconds.",
    name: "Tom Fairweather",
    role: "Sales Agent, Inner Melbourne",
    initials: "TF",
  },
  {
    quote:
      "The reminders are what sold me. I'd set a follow-up in my calendar and then forget why I'd set it. BuyerPocket reminds me and shows me the buyer's details right there. Haven't lost a buyer to a missed follow-up since.",
    name: "Sarah Nguyen",
    role: "Independent Agent, Sydney Northern Beaches",
    initials: "SN",
  },
  {
    quote:
      "I looked at three CRMs before this. Too much. BuyerPocket does what I actually need without making me learn new software every time I want to call someone.",
    name: "Matt Boland",
    role: "Principal, South Brisbane",
    initials: "MB",
  },
];

export function Testimonials() {
  return (
    <section className="bg-surface-container-low border-t border-border/40 py-14 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-xs font-bold tracking-[0.12em] text-secondary uppercase text-center mb-2">
          From agents using BuyerPocket
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-10 tracking-tight">
          What agents say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ quote, name, role, initials }) => (
            <figure
              key={name}
              className="bg-surface rounded-2xl p-6 border border-border/30 shadow-sm flex flex-col gap-5"
            >
              <blockquote className="text-[15px] text-text-secondary leading-relaxed flex-1">
                &ldquo;{quote}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-text-primary">{name}</div>
                  <div className="text-xs text-text-secondary">{role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
