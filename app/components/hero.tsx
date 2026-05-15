export function Hero() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-5 text-center">
      <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.32em] text-neutral-300/85 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] sm:mb-7 sm:text-[11px]">
        Born in San Diego
      </p>

      <h1 className="hero-text max-w-5xl text-[44px] italic text-neutral-50 drop-shadow-[0_2px_30px_rgba(0,0,0,0.55)] sm:text-7xl md:text-[120px]">
        Founders, Without Limits.
      </h1>

      <p className="mt-6 max-w-md text-xs leading-relaxed text-neutral-100/85 drop-shadow-[0_1px_10px_rgba(0,0,0,0.6)] sm:mt-10 sm:max-w-xl sm:text-base">
        College students who want to actually build things, gathered into one
        network. The San Diego chapter started it. New chapters are joining
        every quarter.
      </p>

      <div className="pointer-events-auto mt-7 flex flex-col items-stretch gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-4">
        <a
          href="/apply"
          className="glass-cta-light rounded-full px-6 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900"
        >
          Start a Chapter
        </a>
        <a
          href="#chapters"
          className="glass-pill rounded-full px-5 py-2.5 text-center text-xs font-medium uppercase tracking-[0.22em] text-neutral-100 transition hover:text-white"
        >
          Explore the Network
        </a>
      </div>

      {/*
       * Floating Founders' Hike popup. Sits bottom-centre under the
       * hero's primary CTAs, slowly pulsing so the eye finds it
       * without it crowding the brand line. Dismissible would be nice
       * later; for now it stays so every visitor sees it.
       */}
      <a
        href="/founders-hike"
        className="hike-popup glass-pill pointer-events-auto mt-10 inline-flex items-center gap-3 rounded-full px-5 py-2.5 text-left transition hover:text-white sm:mt-14"
      >
        <span
          aria-hidden="true"
          className="hike-popup-dot inline-block h-2 w-2 rounded-full bg-emerald-300"
        />
        <span className="flex flex-col leading-tight">
          <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-neutral-300/85 sm:text-[10px]">
            New
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-50 sm:text-[12px]">
            The Founders&apos; Hike at Torrey Pines
          </span>
        </span>
        <span
          aria-hidden="true"
          className="text-[14px] text-neutral-300 sm:text-[16px]"
        >
          →
        </span>
      </a>
    </div>
  );
}
