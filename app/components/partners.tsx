const PARTNERS = [
  {
    name: "Student Entrepreneurs Network",
    short: "SEN",
    role: "Founding partner",
  },
];

export function Partners() {
  return (
    <section
      id="orgs"
      className="glass-panel relative z-10 px-5 py-12 sm:px-10 sm:py-14"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
        {PARTNERS.map((p) => (
          <div
            key={p.short}
            className="glass-card flex h-24 flex-col items-start justify-between p-3 sm:h-28 sm:p-4"
          >
            <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-200">
              {p.role}
            </span>
            <div>
              <div className="text-sm font-semibold text-white">
                {p.short}
              </div>
              <div className="mt-0.5 text-[11px] leading-snug text-neutral-300">
                {p.name}
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
    </section>
  );
}
