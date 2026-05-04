export function CircularBadge() {
  return (
    <div className="absolute bottom-5 left-5 z-10 sm:bottom-10 sm:left-10">
      <div className="glass-disc relative h-20 w-20 rounded-full sm:h-28 sm:w-28">
        <svg
          viewBox="0 0 200 200"
          className="badge-rotate absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <path
              id="circle-path"
              d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0"
            />
          </defs>
          <text
            fill="rgba(245,245,240,0.9)"
            fontSize="13"
            fontFamily="var(--font-sans), sans-serif"
            letterSpacing="3"
            style={{ textTransform: "uppercase", fontWeight: 500 }}
          >
            <textPath href="#circle-path" startOffset="0">
              founders network &middot; ucsd &middot; biz &middot; eng &middot;
              sci &middot;&nbsp;
            </textPath>
          </text>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur-md ring-1 ring-white/35 sm:h-11 sm:w-11">
            <span className="text-[10px] font-semibold tracking-[0.15em] text-neutral-50">
              FN
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
