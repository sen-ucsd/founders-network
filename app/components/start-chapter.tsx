/**
 * Start-a-Chapter CTA section — verbatim SEN headline, body, and
 * three-step description (Apply / Interview / Charter). The actual
 * /apply page is still TODO; the CTA points at the local section
 * anchor for now and will swap to /apply once that route ships.
 */

interface Step {
  label: string;
  body: string;
}

const STEPS: Step[] = [
  {
    label: "Apply",
    body: "A short application about you and your campus.",
  },
  {
    label: "Interview",
    body: "Two conversations with the founding team.",
  },
  {
    label: "Charter",
    body: "Your chapter receives funding, training, and inaugural cohort support.",
  },
];

export function StartChapter() {
  return (
    <section
      id="join"
      className="relative z-10 border-t border-white/[0.06] bg-[#08080660] px-6 py-24 backdrop-blur-sm sm:px-10 sm:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 max-w-2xl">
          <h2 className="hero-text text-4xl italic leading-tight text-neutral-50 sm:text-5xl">
            Bring Founders Network to your campus.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-neutral-300 sm:text-lg">
            Looking for the kind of student who would have started this
            without waiting for permission. The application is short.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <div
              key={s.label}
              className="glass-card flex flex-col gap-3 p-6 sm:p-7"
            >
              <div className="text-[10px] uppercase tracking-[0.28em] text-neutral-400">
                Step {i + 1}
              </div>
              <h3 className="hero-text text-2xl italic text-neutral-50 sm:text-[28px]">
                {s.label}
              </h3>
              <p className="text-sm leading-relaxed text-neutral-300 sm:text-[15px]">
                {s.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
          <a
            href="/apply"
            className="glass-cta-light rounded-full px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900"
          >
            Start the Application
          </a>
          <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-400">
            Reviewed Weekly · Reply within Seven Days
          </p>
        </div>
      </div>
    </section>
  );
}
