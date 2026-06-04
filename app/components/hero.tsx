export function Hero() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-5 text-center">
      <h1 className="hero-text max-w-5xl text-[44px] italic text-neutral-50 drop-shadow-[0_2px_30px_rgba(0,0,0,0.55)] sm:text-7xl md:text-[120px]">
        Founders, Without Limits.
      </h1>

      <p className="mt-6 max-w-md text-xs leading-relaxed text-neutral-100/85 drop-shadow-[0_1px_10px_rgba(0,0,0,0.6)] sm:mt-10 sm:max-w-xl sm:text-base">
        College students who want to actually build things, gathered into one
        network across UCSD&apos;s business, engineering, and science orgs.
      </p>

      <div className="pointer-events-auto mt-7 flex flex-col items-stretch gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-4">
        <a
          href="/apply"
          className="glass-cta-light rounded-full px-6 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900"
        >
          Apply to join
        </a>
        <a
          href="#programs"
          className="glass-pill rounded-full px-5 py-2.5 text-center text-xs font-medium uppercase tracking-[0.22em] text-neutral-100 transition hover:text-white"
        >
          See the programs
        </a>
      </div>

      {/*
       * Floating event pills beneath the primary CTAs. Each one fades
       * in 800ms after page load with a slow-pulsing dot so the eye
       * finds them without them competing with the brand line.
       */}
      <div className="pointer-events-auto mt-10 flex flex-col items-stretch gap-2.5 sm:mt-14 sm:flex-row sm:items-center sm:gap-3">
        <a
          href="/founders-hike"
          className="hike-popup glass-pill inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 text-left transition hover:text-white"
        >
          <span
            aria-hidden="true"
            className="hike-popup-dot inline-block h-2 w-2 rounded-full bg-emerald-300"
          />
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-50 sm:text-[12px]">
            Founders&apos; Hike{" "}
            <span className="text-neutral-500">·</span> Torrey Pines
          </span>
          <span aria-hidden="true" className="text-[14px] text-neutral-300">
            →
          </span>
        </a>
        <a
          href="/workshops/claude"
          className="hike-popup glass-pill inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 text-left transition hover:text-white"
        >
          <span
            aria-hidden="true"
            className="hike-popup-dot inline-block h-2 w-2 rounded-full bg-amber-300"
          />
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-50 sm:text-[12px]">
            Workshop <span className="text-neutral-500">·</span> Build with
            Claude
          </span>
          <span aria-hidden="true" className="text-[14px] text-neutral-300">
            →
          </span>
        </a>
      </div>
    </div>
  );
}
