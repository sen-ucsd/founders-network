/**
 * UCSD coalition section — the partner orgs inside the founding
 * chapter. Distinct from "chapters" (geographic nodes); this is the
 * collection of student-led orgs that comprise the UCSD chapter.
 *
 * Order is deliberate: SEN as the founding partner, RAIN as the
 * anchor coalition partner, Women in Rady as the active collab, then
 * the remaining orgs roughly grouped by domain.
 */

interface CoalitionOrg {
  /** Primary display name on the card. Required. */
  short: string;
  /** Optional full name shown beneath. Skip if uncertain. */
  name?: string;
  /** Optional eyebrow above the name. Only set for special members. */
  role?: string;
}

const COALITION: CoalitionOrg[] = [
  {
    short: "SEN",
    name: "Student Entrepreneurs Network",
    role: "Founding partner",
  },
  { short: "RAIN" },
  { short: "Women in Rady" },
  {
    short: "CSE Society",
    name: "Computer Science & Engineering Society",
  },
  {
    short: "IEEE EMBS",
    name: "Engineering in Medicine & Biology Society",
  },
  { short: "BMES", name: "Biomedical Engineering Society" },
  { short: "BEGS", name: "Bioengineering Graduate Society" },
  { short: "HDSI Student Council" },
  { short: "DS3", name: "Data Science Student Society" },
  { short: "WIC", name: "Women in Computing" },
  { short: "GMBE" },
  { short: "Bioengineering Project Team" },
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
            The orgs that make up the network, gathered at one table
            across business, engineering, science, and design.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
          {COALITION.map((org) => (
            <div
              key={org.short}
              className="glass-card flex h-28 flex-col items-start p-3 sm:h-32 sm:p-4"
            >
              {org.role ? (
                <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-200">
                  {org.role}
                </span>
              ) : null}
              <div className="mt-auto">
                <div className="text-sm font-semibold leading-snug text-white">
                  {org.short}
                </div>
                {org.name ? (
                  <div className="mt-1 text-[11px] leading-snug text-neutral-300">
                    {org.name}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
