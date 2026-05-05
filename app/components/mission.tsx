/**
 * Mission section — adapts SEN's "rooms should be connected" voice for
 * the broader Founders Network framing. Sits directly below the hero on
 * the long landing.
 *
 * Voice rules in effect: no em dashes, no "not X but Y" constructions,
 * no filler eyebrow labels.
 */

export function Mission() {
  return (
    <section
      id="mission"
      className="relative z-10 border-t border-white/[0.06] bg-[#0a0a08]/60 px-6 py-24 backdrop-blur-sm sm:px-10 sm:py-32"
    >
      <div className="mx-auto max-w-3xl">
        <h2 className="hero-text text-4xl italic leading-tight text-neutral-50 sm:text-5xl md:text-6xl">
          The rooms should be connected.
        </h2>

        <div className="mt-10 space-y-6 text-base leading-relaxed text-neutral-300 sm:text-lg">
          <p>
            Every great company starts in a dorm room. Founders Network is a
            coalition of student builders, beginning at UCSD and expanding
            outward. A place where the engineer in the lab, the operator in
            the business school, and the researcher at Scripps find each
            other before they need to.
          </p>
          <p>
            UCSD is the founding chapter. Other campuses follow as they
            charter. Inside each chapter, every serious student-led
            entrepreneurship, engineering, and science org sits at one
            table.
          </p>
          <p className="text-neutral-200">
            We are welding the future, not talking about it.
          </p>
        </div>
      </div>
    </section>
  );
}
