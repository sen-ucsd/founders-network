/**
 * Chapters section — adapted from SEN's "constellation of nodes"
 * concept. Lists only chapters that actually exist (per the brand
 * decisions memo: don't advertise placeholder chapters). San Diego
 * is the founding chapter; the closing line points at expansion
 * without naming specific cities until they're real.
 *
 * Each real chapter card links to its dedicated page at
 * /chapters/<slug>. San Diego currently routes to the GBM #1
 * slideshow living there.
 */

import Link from "next/link";

interface Chapter {
  name: string;
  region: string;
  status: string;
  href: string;
  cta: string;
  quote?: string;
}

const CHAPTERS: Chapter[] = [
  {
    name: "San Diego",
    region: "California",
    status: "Founding Chapter",
    href: "/chapters/san-diego",
    cta: "Open the chapter",
    quote:
      "The energy here is different. We are welding the future, not talking about it.",
  },
];

export function Chapters() {
  return (
    <section
      id="chapters"
      className="relative z-10 border-t border-white/[0.06] bg-[#0a0a08]/60 px-6 py-24 backdrop-blur-sm sm:px-10 sm:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-2xl">
          <h2 className="hero-text text-4xl italic leading-tight text-neutral-50 sm:text-5xl">
            A constellation of nodes.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-neutral-300 sm:text-lg">
            Each chapter is a node in a global collective of student builders.
            San Diego started it. New chapters charter every quarter.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {CHAPTERS.map((c) => (
            <Link
              key={c.name}
              href={c.href}
              className="glass-card group flex flex-col gap-5 p-6 sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="hero-text text-3xl italic text-neutral-50 sm:text-4xl">
                    {c.name}
                  </h3>
                  <p className="mt-1.5 text-[10px] uppercase tracking-[0.28em] text-neutral-400">
                    {c.region}
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-neutral-200">
                  {c.status}
                </span>
              </div>
              {c.quote ? (
                <p className="text-sm italic leading-relaxed text-neutral-200 sm:text-[15px]">
                  &ldquo;{c.quote}&rdquo;
                </p>
              ) : null}
              <span className="mt-2 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-300 transition group-hover:text-white">
                {c.cta}
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          ))}

          {/* Visual placeholder representing the expansion narrative without
           * making aspirational claims. Communicates "more nodes coming"
           * as architecture, not as a list of fake chapters. */}
          <div className="flex h-full min-h-[140px] flex-col justify-between rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <span className="text-[10px] uppercase tracking-[0.28em] text-neutral-500">
              Next nodes
            </span>
            <p className="text-sm leading-relaxed text-neutral-400 sm:text-[15px]">
              Charter teams forming on other campuses. New nodes are
              announced as they charter, not before.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
