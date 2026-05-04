const NAV_ITEMS = [
  { label: "ABOUT", href: "#about", showOnMobile: false },
  { label: "MANIFESTO", href: "#manifesto", showOnMobile: false },
  { label: "ORGS", href: "#orgs", showOnMobile: true },
  { label: "JOIN", href: "#join", showOnMobile: true },
];

export function TopNav() {
  return (
    <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-5 sm:px-10 sm:py-8">
      <div className="flex flex-col text-[11px] font-medium uppercase leading-tight tracking-[0.18em] text-neutral-100">
        <span className="text-sm font-semibold tracking-[0.04em] normal-case sm:text-base">
          founders network
        </span>
        <span className="text-neutral-300/80">ucsd</span>
      </div>

      <nav className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-200 sm:gap-6 sm:text-[11px]">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={
              "transition hover:text-white" +
              (item.showOnMobile ? "" : " hidden sm:inline")
            }
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
