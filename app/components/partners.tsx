/**
 * UCSD coalition section — the partner orgs inside the founding
 * chapter. Distinct from "chapters" (geographic nodes); this is the
 * collection of student-led orgs that comprise the UCSD chapter.
 */

interface CoalitionOrg {
  name: string;
  short: string;
  role: string;
}

const COALITION: CoalitionOrg[] = [
  {
    name: "Student Entrepreneurs Network",
    short: "SEN",
    role: "Founding partner",
  },
];

export function Partners() {
  return (
    <section
      id="coalition"
      className="glass-panel relative z-10 px-5 py-20 sm:px-10 sm:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <h2 className="hero-text text-4xl italic leading-tight text-neutral-50 sm:text-5xl">
            UCSD coalition.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-neutral-300 sm:text-lg">
            The orgs that make up the founding chapter. Business,
            engineering, science, design. One table.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
          {COALITION.map((org) => (
            <div
              key={org.short}
              className="glass-card flex h-24 flex-col items-start justify-between p-3 sm:h-28 sm:p-4"
            >
              <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-200">
                {org.role}
              </span>
              <div>
                <div className="text-sm font-semibold text-white">
                  {org.short}
                </div>
                <div className="mt-0.5 text-[11px] leading-snug text-neutral-300">
                  {org.name}
                </div>
              </div>
            </div>
          ))}

          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={`placeholder-${i}`}
              className="flex h-24 items-center justify-center rounded-xl border border-dashed border-white/12 bg-white/[0.02] text-[10px] uppercase tracking-[0.22em] text-neutral-500 sm:h-28"
            >
              your org here
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
