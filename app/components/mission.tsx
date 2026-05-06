/**
 * Vision section — adapted from SEN's homepage Vision section, with
 * `SEN` swapped for `Founders Network`. Includes the three pillars
 * (Build / Network / Ship) inlined as glass cards under the prose.
 *
 * Voice rules: lift SEN's wording verbatim where possible, no em
 * dashes, no "not X but Y" constructions, no filler eyebrow labels.
 */

interface Pillar {
  title: string;
  body: string;
}

const PILLARS: Pillar[] = [
  {
    title: "Build",
    body: "Practical execution over theoretical frameworks. The proof of concept matters more than the pitch deck.",
  },
  {
    title: "Network",
    body: "A decentralized web of student founders. Access to a global collective of peers who are building the next decade.",
  },
  {
    title: "Ship",
    body: "The final and most crucial act. Real users on real products is the only true metric of success.",
  },
];

export function Mission() {
  return (
    <section
      id="vision"
      className="relative z-10 border-t border-white/[0.06] bg-[#0a0a08]/60 px-6 py-24 backdrop-blur-sm sm:px-10 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <h2 className="hero-text text-4xl italic leading-[1.05] text-neutral-50 sm:text-5xl md:text-6xl">
            Every great company starts in a dorm room. The rooms should be
            connected.
          </h2>

          <p className="mt-10 text-base leading-relaxed text-neutral-300 sm:text-lg">
            Greatness rarely happens in isolation. It grows in the quiet hum
            of shared ambition and the friction of competing ideas. Founders
            Network is a return to the artisan builder, the student who
            treats their campus as a forge, and treats other campuses as the
            rest of the workshop.
          </p>
        </div>

        <div className="mt-16 grid gap-5 sm:mt-20 sm:grid-cols-3">
          {PILLARS.map((p) => (
            <div
              key={p.title}
              className="glass-card flex flex-col gap-3 p-6 sm:p-7"
            >
              <h3 className="hero-text text-2xl italic font-normal text-neutral-50 sm:text-[28px]">
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
