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
          href="#join"
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

      <p className="mt-12 text-[10px] font-medium uppercase tracking-[0.42em] text-neutral-400/80 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] sm:mt-16 sm:text-[11px]">
        Per Ardua Ad Astra
      </p>
    </div>
  );
}
