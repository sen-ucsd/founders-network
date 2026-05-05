/**
 * Programs section — the four concrete things Founders Network actually
 * does, ported and reworded from SEN's program list. Designed to slot
 * below Mission on the landing.
 */

interface Program {
  title: string;
  body: string;
}

const PROGRAMS: Program[] = [
  {
    title: "Build Nights",
    body: "Weekly working sessions. Quiet rooms, full focus, ship something by the time you leave.",
  },
  {
    title: "Founder Conversations",
    body: "Off-the-record talks with operators and investors who have actually done the thing.",
  },
  {
    title: "Inter-Chapter Exchange",
    body: "Spend a week working out of another chapter's city. Live in their rooms, ship from their desks.",
  },
  {
    title: "Capital Connections",
    body: "Warm intros to angels, funds, and accelerators when projects hit traction.",
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
            What we run.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-neutral-300 sm:text-lg">
            Four programs, designed to put the work first. Members get all
            of them; chapters opt into all of them.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
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
