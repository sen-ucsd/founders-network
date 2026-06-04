/**
 * Programs section. Three programs UCSD's chapter actually runs.
 * Inter-Chapter Exchange dropped along with the broader chapter
 * model; Capital Connections rephrased away from "each chapter's
 * region" to the San Diego area.
 */

interface Program {
  title: string;
  body: string;
}

const PROGRAMS: Program[] = [
  {
    title: "Build Nights",
    body: "Distraction-free working sessions every week where members ship side projects together and unblock each other in real time.",
  },
  {
    title: "Founder Conversations",
    body: "Off-the-record talks with operators and investors who answer the questions you would never ask on a public stage.",
  },
  {
    title: "Capital Connections",
    body: "Warm intros to angels, funds, and accelerators around San Diego for projects that show real traction.",
  },
];

export function Programs() {
  return (
    <section
      id="programs"
      className="relative z-10 border-t border-white/[0.06] bg-[#08080660] px-6 py-24 backdrop-blur-sm sm:px-10 sm:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-2xl">
          <h2 className="hero-text text-4xl italic leading-tight text-neutral-50 sm:text-5xl">
            The infrastructure for impact.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-neutral-300 sm:text-lg">
            Three programs designed to compound the work members do on
            their own products and on each other&apos;s.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {PROGRAMS.map((p) => (
            <div
              key={p.title}
              className="glass-card flex flex-col gap-3 p-6 sm:p-7"
            >
              <h3 className="text-xl font-semibold text-neutral-50 sm:text-2xl">
                {p.title}
              </h3>
              <p className="text-sm leading-relaxed text-neutral-300 sm:text-[15px]">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
