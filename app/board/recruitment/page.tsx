"use client";

/**
 * /board/recruitment — animated slideshow walkthrough of the fall
 * recruitment plan. Source material: the 2026-06-11 Irene sync plus
 * the broader-board call on the same evening (rooms, food, dates,
 * stakes). Each slide is laid out by `kind` so the deck reads as a
 * structured presentation rather than a uniform stack of cards:
 *
 *   - cover            centred title + small date sub
 *   - shape            framing + 4-step day timeline + pulled callout
 *   - day              big italic day numeral, eyebrow, title, body,
 *                      numbered item cards in a 3-up grid
 *   - sequence         numbered ordered list (used for speaker plan)
 *   - note             minimal callout-style single statement
 *   - checklist        eyebrow + title + timing-chip action rows
 *
 * Same animation framework as the GBM #1 slideshow: crossfade between
 * slides, click anywhere or arrow keys to advance, FN badge bottom-
 * right, slim top context bar. Action items intentionally land on the
 * last slide so the deck closes on what the board owns next.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import * as THREE from "three";

import { OrbBackground } from "../../components/orb-background";
import { type PaletteUniforms } from "../../components/fluid-orb";
import { hexToLinearRGB } from "../../lib/color-schemes";

type SlideKind =
  | "cover"
  | "shape"
  | "day"
  | "sequence"
  | "note"
  | "checklist";

interface SlideItem {
  label: string;
  body: string;
}

interface TimelineStep {
  label: string;
  sub: string;
}

interface Slide {
  id: string;
  kind: SlideKind;
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
  subtitle?: string;
  items?: SlideItem[];
  dayNumber?: string;
  timeline?: TimelineStep[];
  callout?: string;
}

const SLIDES: Slide[] = [
  {
    id: "cover",
    kind: "cover",
    title: <>The recruitment cycle.</>,
  },
  {
    id: "shape",
    kind: "shape",
    eyebrow: "The shape",
    title: <>Four days, designed to feel exclusive.</>,
    body: (
      <>
        Three programmed nights plus interviews, targeting week 3 of fall
        (about October 6). Goal is 100+ at every event.
      </>
    ),
    timeline: [
      { label: "Day 1", sub: "Info Night, Otterson 114" },
      { label: "Day 2", sub: "Meet the Board, Otterson 114" },
      { label: "Day 3", sub: "Case Study, MPR2/NPR2" },
      { label: "Day 4", sub: "Interviews" },
    ],
    callout: "They should feel like they need to be there.",
  },
  {
    id: "day-1",
    kind: "day",
    dayNumber: "01",
    eyebrow: "Day one",
    title: <>Info night.</>,
    body: (
      <>
        Otterson 114, snacks on the table. A loose opening night built
        around showing what the org is about rather than performing at the
        room.
      </>
    ),
    items: [
      {
        label: "No formal presentations",
        body: "The night focuses on explaining what the organization is about.",
      },
      {
        label: "Casual atmosphere",
        body: "Busy people can drift; others stay and talk to organizers.",
      },
      {
        label: "Heavy hitter speaker",
        body: "Top-tier guest opens Day 1 to drive attendance urgency.",
      },
    ],
  },
  {
    id: "day-2",
    kind: "day",
    dayNumber: "02",
    eyebrow: "Day two",
    title: <>Meet the board, with industry plants.</>,
    body: (
      <>
        Otterson 114 again, with Ike&rsquo;s sandwiches (50, first-come,
        first-served) on the table. Structured to get attendees actually
        talking to specific people instead of crowding around one person.
      </>
    ),
    items: [
      {
        label: "Board mini-presentations",
        body: "Each board member gets one or two slides, one to two minutes each, on what they are working on.",
      },
      {
        label: "Worksheet game",
        body: "Questions only answerable by talking to specific board members. Top scorers win a prize or gift card.",
      },
      {
        label: "Industry plants",
        body: "Hidden guests with industry credibility mixed in to keep energy distributed.",
      },
    ],
  },
  {
    id: "day-3",
    kind: "day",
    dayNumber: "03",
    eyebrow: "Day three",
    title: <>Case study night, by design.</>,
    body: (
      <>
        MPR2/NPR2 over in Rady. Two hours, assigned teams, minimal prompt.
        We are watching for how people think, not checking compliance with
        rules.
      </>
    ),
    items: [
      {
        label: "Three-bullet brief",
        body: "Three requirements per group, enough to frame the concept without locking it.",
      },
      {
        label: "Graded on a rubric",
        body: "Each submission scored against a shared rubric so feedback stays consistent.",
      },
      {
        label: "Themes still open",
        body: "Industry themes vs uniform prompts is deferred. Self-select risks clustering on easy topics, so random groups are on the table.",
      },
    ],
  },
  {
    id: "day-4",
    kind: "day",
    dayNumber: "04",
    eyebrow: "Day four",
    title: <>Interviews close out the cycle.</>,
    body: (
      <>
        The closing day brings the candidates who carried through the three
        programmed nights back in for individual interviews with the board.
      </>
    ),
  },
  {
    id: "speakers",
    kind: "sequence",
    eyebrow: "Speakers",
    title: <>Speakers stay hidden until the reveal.</>,
    body: (
      <>
        Reviving the hidden speaker format used previously, the one with
        Chris Thornham as a reference point. Attendees are told a special
        guest is in the room, but the identity stays hidden.
      </>
    ),
    items: [
      {
        label: "The hunt",
        body: "Attendees try to identify the speaker throughout the event.",
      },
      {
        label: "Grand reveal",
        body: "The day ends with the reveal.",
      },
      {
        label: "Recommendation",
        body: "One major speaker at the start, plus multiple industry plants on Day 2 to sustain the vibe.",
      },
    ],
  },
  {
    id: "logistics",
    kind: "shape",
    eyebrow: "Logistics",
    title: <>Rooms, food, and timing are locked.</>,
    body: (
      <>
        Otterson 114 holds the first two nights, MPR2/NPR2 holds the case
        study. AS funding covers food, which doubles as a marketing tool to
        pull attendance.
      </>
    ),
    timeline: [
      { label: "Otterson 114", sub: "Info Night + Meet the Board" },
      { label: "MPR2/NPR2", sub: "Case Study, Rady-side" },
      { label: "Food", sub: "Ike’s sandwiches + snacks, AS funding" },
      { label: "Rady 5F", sub: "Dropped, access disputes" },
    ],
    callout: "Food on both nights is the marketing incentive.",
  },
  {
    id: "stakes",
    kind: "note",
    eyebrow: "The stakes",
    title: <>This fall has to land.</>,
    body: (
      <>
        Recruitment this cycle has to pull serious membership. The club&rsquo;s
        survival is on it.
      </>
    ),
  },
  {
    id: "action-items",
    kind: "checklist",
    eyebrow: "Action items",
    title: <>Where we go from here.</>,
    body: (
      <>
        What the board owns coming out of this conversation, in roughly the
        order it needs to happen.
      </>
    ),
    items: [
      {
        label: "Tonight",
        body: "Submit the AS funding application for food.",
      },
      {
        label: "This week",
        body: "Max fills out the room reservation form. Otterson 114 for nights 1 and 2, MPR2/NPR2 for the case study.",
      },
      {
        label: "This week",
        body: "Pull Noah’s recruitment calendar into the shared club calendar.",
      },
      {
        label: "Pre-event",
        body: "Order Ike’s sandwiches (50, first-come, first-served). Source Info Night snacks.",
      },
      {
        label: "Two weeks",
        body: "Reconvene midsummer to tighten the case study format and remaining details.",
      },
    ],
  },
];

const TOTAL = SLIDES.length;
const TRANSITION_MS = 520;

const SLIDE_PALETTE_HEX = {
  c0: "#060809",
  c1: "#1a2228",
  c2: "#5e7a8a",
  c3: "#d8dde2",
  accent: "#1c2832",
} as const;

export default function BoardRecruitmentSlideshow() {
  const [current, setCurrent] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const paletteUniforms = useMemo<PaletteUniforms>(() => {
    const v = (h: string) => new THREE.Vector3(...hexToLinearRGB(h));
    return {
      uColor0: { value: v(SLIDE_PALETTE_HEX.c0) },
      uColor1: { value: v(SLIDE_PALETTE_HEX.c1) },
      uColor2: { value: v(SLIDE_PALETTE_HEX.c2) },
      uColor3: { value: v(SLIDE_PALETTE_HEX.c3) },
      uAccent: { value: v(SLIDE_PALETTE_HEX.accent) },
    };
  }, []);

  const navigate = useCallback((nextIdx: number) => {
    setCurrent((curr) => {
      if (nextIdx === curr) return curr;
      if (nextIdx < 0 || nextIdx > TOTAL - 1) return curr;
      if (transitionTimer.current) clearTimeout(transitionTimer.current);
      setPrevious(curr);
      transitionTimer.current = setTimeout(() => {
        setPrevious(null);
        transitionTimer.current = null;
      }, TRANSITION_MS);
      return nextIdx;
    });
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === "ArrowRight" ||
        e.key === " " ||
        e.key === "PageDown" ||
        e.key === "Enter"
      ) {
        e.preventDefault();
        navigate(current + 1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        navigate(current - 1);
      } else if (e.key === "Home") {
        navigate(0);
      } else if (e.key === "End") {
        navigate(TOTAL - 1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current, navigate]);

  useEffect(
    () => () => {
      if (transitionTimer.current) clearTimeout(transitionTimer.current);
    },
    [],
  );

  const atStart = current === 0;
  const atEnd = current === TOTAL - 1;
  const next = () => navigate(current + 1);
  const prev = () => navigate(current - 1);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06080a] text-neutral-100">
      <div className="absolute inset-0 z-0">
        <OrbBackground paletteUniforms={paletteUniforms} />
      </div>
      <div
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(6,8,10,0.36) 0%, rgba(6,8,10,0.68) 65%, rgba(6,8,10,0.84) 100%)",
        }}
      />

      <SlideshowHeader />

      <div
        className="relative z-10 flex min-h-screen cursor-pointer select-none flex-col items-stretch justify-center px-6 sm:px-12 md:px-20 lg:px-28"
        onClick={next}
        role="button"
        tabIndex={-1}
        aria-label="Advance to next slide"
      >
        <div className="relative flex min-h-[640px] flex-1 items-stretch py-32 sm:py-36">
          {previous !== null ? (
            <SlideView
              key={`prev-${previous}`}
              slide={SLIDES[previous]}
              phase="leaving"
            />
          ) : null}
          <SlideView
            key={`curr-${current}`}
            slide={SLIDES[current]}
            phase={previous !== null ? "entering" : "settled"}
          />
        </div>
      </div>

      <SlideshowFooter
        idx={current}
        total={TOTAL}
        atStart={atStart}
        atEnd={atEnd}
        onPrev={prev}
        onNext={next}
      />

      <FNBadge />
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                             */
/* ------------------------------------------------------------------ */

function SlideshowHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-6 sm:px-10 sm:py-7">
      <Link
        href="/"
        className="flex items-center gap-3 transition hover:text-white"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-white/5 text-[10px] font-semibold tracking-[0.05em] text-neutral-100 backdrop-blur-sm">
          FN
        </span>
        <span className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-200 sm:text-[12px]">
          Founders Network <span className="text-neutral-400">·</span> UCSD
        </span>
      </Link>
      <span className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-300/75 sm:text-[12px]">
        Recruitment plan <span className="text-neutral-500">·</span> Board
      </span>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Slide view (dispatches by kind)                                    */
/* ------------------------------------------------------------------ */

type Phase = "entering" | "leaving" | "settled";

function SlideView({ slide, phase }: { slide: Slide; phase: Phase }) {
  const idxFromId = SLIDES.findIndex((s) => s.id === slide.id);
  const slideNumber = String(idxFromId + 1).padStart(2, "0");

  const animClass =
    phase === "entering"
      ? "slide-anim-enter"
      : phase === "leaving"
        ? "slide-anim-leave"
        : "";

  const positionClass =
    phase === "settled" ? "relative w-full" : "absolute inset-0";

  const wrapperClass = `${positionClass} ${animClass} flex flex-col justify-center`;

  switch (slide.kind) {
    case "cover":
      return (
        <article
          className={`${positionClass} ${animClass} flex items-center justify-center px-6 text-center`}
        >
          <div className="flex max-w-5xl flex-col items-center gap-6">
            <h2 className="hero-text text-5xl italic leading-[0.98] text-neutral-50 drop-shadow-[0_2px_30px_rgba(0,0,0,0.55)] sm:text-7xl md:text-[120px] lg:text-[150px]">
              {slide.title}
            </h2>
            {slide.subtitle ? (
              <p className="font-sans text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-400 sm:text-[12px]">
                {slide.subtitle}
              </p>
            ) : null}
          </div>
        </article>
      );

    case "shape":
      return (
        <article className={wrapperClass}>
          <div className="flex w-full max-w-6xl flex-col gap-10 sm:gap-12">
            <SlideHeader
              slideNumber={slideNumber}
              eyebrow={slide.eyebrow}
              title={slide.title}
              body={slide.body}
              size="large"
            />
            {slide.timeline ? (
              <Timeline steps={slide.timeline} />
            ) : null}
            {slide.callout ? (
              <Callout text={slide.callout} />
            ) : null}
          </div>
        </article>
      );

    case "day":
      return (
        <article className={wrapperClass}>
          <div className="flex w-full max-w-6xl flex-col gap-8 sm:gap-10">
            <DayHeader
              slideNumber={slideNumber}
              dayNumber={slide.dayNumber ?? ""}
              eyebrow={slide.eyebrow}
              title={slide.title}
              body={slide.body}
            />
            {slide.items && slide.items.length > 0 ? (
              <NumberedGrid items={slide.items} />
            ) : null}
          </div>
        </article>
      );

    case "sequence":
      return (
        <article className={wrapperClass}>
          <div className="flex w-full max-w-5xl flex-col gap-8 sm:gap-10">
            <SlideHeader
              slideNumber={slideNumber}
              eyebrow={slide.eyebrow}
              title={slide.title}
              body={slide.body}
            />
            {slide.items && slide.items.length > 0 ? (
              <Sequence items={slide.items} />
            ) : null}
          </div>
        </article>
      );

    case "note":
      return (
        <article className={wrapperClass}>
          <div className="flex w-full max-w-3xl flex-col gap-6 rounded-2xl border border-white/[0.08] bg-[#06080a]/55 p-8 sm:gap-8 sm:p-12">
            {slide.eyebrow ? (
              <p className="font-sans text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-300/80 sm:text-[12px]">
                <span className="text-neutral-100">{slideNumber}</span>
                <span className="mx-2 text-neutral-500">·</span>
                <span>{slide.eyebrow}</span>
              </p>
            ) : null}
            <h2 className="hero-text text-3xl italic leading-[1.1] text-neutral-50 sm:text-4xl md:text-5xl">
              {slide.title}
            </h2>
            {slide.body ? (
              <p className="font-sans text-base leading-[1.6] text-neutral-300 sm:text-lg">
                {slide.body}
              </p>
            ) : null}
          </div>
        </article>
      );

    case "checklist":
      return (
        <article className={wrapperClass}>
          <div className="flex w-full max-w-4xl flex-col gap-8 sm:gap-10">
            <SlideHeader
              slideNumber={slideNumber}
              eyebrow={slide.eyebrow}
              title={slide.title}
              body={slide.body}
            />
            {slide.items && slide.items.length > 0 ? (
              <Checklist items={slide.items} />
            ) : null}
          </div>
        </article>
      );
  }
}

/* ------------------------------------------------------------------ */
/* Shared sub-blocks                                                  */
/* ------------------------------------------------------------------ */

function SlideHeader({
  slideNumber,
  eyebrow,
  title,
  body,
  size = "default",
}: {
  slideNumber: string;
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
  size?: "default" | "large";
}) {
  const titleSize =
    size === "large"
      ? "text-[40px] sm:text-[72px] md:text-[96px] lg:text-[120px]"
      : "text-[38px] sm:text-[64px] md:text-[88px] lg:text-[108px]";
  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      {eyebrow ? (
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-300/80 sm:text-[12px]">
          <span className="text-neutral-100">{slideNumber}</span>
          <span className="mx-2 text-neutral-500">·</span>
          <span>{eyebrow}</span>
        </p>
      ) : null}
      <h2
        className={`hero-text italic leading-[1.0] text-neutral-50 drop-shadow-[0_2px_30px_rgba(0,0,0,0.55)] ${titleSize}`}
      >
        {title}
      </h2>
      {body ? (
        <p className="font-sans max-w-3xl text-lg leading-[1.55] text-neutral-300 sm:text-xl">
          {body}
        </p>
      ) : null}
    </div>
  );
}

function DayHeader({
  slideNumber,
  dayNumber,
  eyebrow,
  title,
  body,
}: {
  slideNumber: string;
  dayNumber: string;
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-10">
      {/* Big italic day numeral. Anchors the visual identity of each
       * day slide. */}
      <div className="flex shrink-0 flex-row items-baseline gap-4 sm:flex-col sm:items-end sm:gap-1">
        <span
          className="hero-text text-[88px] italic leading-[0.85] text-neutral-50/95 drop-shadow-[0_2px_30px_rgba(0,0,0,0.55)] sm:text-[140px] md:text-[180px] lg:text-[220px]"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {dayNumber}
        </span>
        <span className="font-sans text-[10px] font-medium uppercase tracking-[0.32em] text-neutral-400 sm:text-[11px]">
          Day
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-5 sm:gap-6 sm:pt-3">
        {eyebrow ? (
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-300/80 sm:text-[12px]">
            <span className="text-neutral-100">{slideNumber}</span>
            <span className="mx-2 text-neutral-500">·</span>
            <span>{eyebrow}</span>
          </p>
        ) : null}
        <h2 className="hero-text text-[32px] italic leading-[1.05] text-neutral-50 drop-shadow-[0_2px_30px_rgba(0,0,0,0.55)] sm:text-[48px] md:text-[64px] lg:text-[76px]">
          {title}
        </h2>
        {body ? (
          <p className="font-sans max-w-2xl text-base leading-[1.55] text-neutral-300 sm:text-lg">
            {body}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function NumberedGrid({ items }: { items: SlideItem[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
      {items.map((item, i) => (
        <div
          key={i}
          className="glass-card font-sans flex flex-col gap-3 p-5 sm:gap-4 sm:p-6"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] text-[11px] font-semibold tabular-nums text-neutral-200">
              {i + 1}
            </span>
            <h3 className="text-[15px] font-semibold uppercase tracking-[0.08em] text-neutral-50 sm:text-base">
              {item.label}
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-neutral-300 sm:text-[15px]">
            {item.body}
          </p>
        </div>
      ))}
    </div>
  );
}

function Timeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="relative">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {steps.map((step, i) => (
          <div
            key={i}
            className="glass-pill flex flex-col gap-2 p-4 sm:p-5"
            style={{ borderRadius: 14 }}
          >
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#cfcfcf]" />
              <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.32em] text-neutral-100 sm:text-[11px]">
                {step.label}
              </span>
            </div>
            <p className="font-sans text-[13px] leading-snug text-neutral-300 sm:text-sm">
              {step.sub}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Callout({ text }: { text: string }) {
  return (
    <div className="relative max-w-3xl border-l-2 border-[#e0ddce] pl-6 sm:pl-8">
      <p className="hero-text text-2xl italic leading-snug text-neutral-100 sm:text-3xl md:text-4xl">
        &ldquo;{text}&rdquo;
      </p>
    </div>
  );
}

function Sequence({ items }: { items: SlideItem[] }) {
  return (
    <ol className="flex flex-col gap-3">
      {items.map((item, i) => (
        <li
          key={i}
          className="glass-pill flex items-start gap-5 px-5 py-4 sm:px-6 sm:py-5"
          style={{ borderRadius: 14 }}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/[0.05] text-[11px] font-semibold tabular-nums text-neutral-100 sm:h-10 sm:w-10 sm:text-[13px]">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="flex flex-col gap-1.5 sm:gap-2">
            <h3 className="font-sans text-[14px] font-semibold uppercase tracking-[0.1em] text-neutral-50 sm:text-[15px]">
              {item.label}
            </h3>
            <p className="font-sans text-sm leading-relaxed text-neutral-300 sm:text-[15px]">
              {item.body}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function Checklist({ items }: { items: SlideItem[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item, i) => (
        <li
          key={i}
          className="glass-card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6"
        >
          {/* Timing chip — bone-cream tinted so action items pop. */}
          <span
            className="inline-flex w-fit shrink-0 items-center justify-center rounded-full border px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] sm:px-5 sm:py-2 sm:text-[11px]"
            style={{
              borderColor: "rgba(224, 221, 206, 0.32)",
              background: "rgba(224, 221, 206, 0.08)",
              color: "#e8e3cf",
            }}
          >
            {item.label}
          </span>
          <p className="font-sans text-base leading-relaxed text-neutral-100 sm:text-lg">
            {item.body}
          </p>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                             */
/* ------------------------------------------------------------------ */

function SlideshowFooter({
  idx,
  total,
  atStart,
  atEnd,
  onPrev,
  onNext,
}: {
  idx: number;
  total: number;
  atStart: boolean;
  atEnd: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  const stop = (e: React.MouseEvent) => e.stopPropagation();
  return (
    <footer
      className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-center px-6 pb-6 sm:pb-10"
      onClick={stop}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={(e) => {
            stop(e);
            onPrev();
          }}
          disabled={atStart}
          className="glass-pill font-sans rounded-full px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-100 transition disabled:cursor-not-allowed disabled:opacity-35 sm:px-6 sm:py-2.5 sm:text-[11px]"
        >
          Prev
        </button>

        <div className="glass-pill flex items-center gap-3 rounded-full px-5 py-2 sm:px-6 sm:py-2.5">
          <SlideProgressDots total={total} idx={idx} />
        </div>

        <div className="glass-pill flex items-center rounded-full px-4 py-2 sm:px-5 sm:py-2.5">
          <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-200 sm:text-[11px]">
            {String(idx + 1).padStart(2, "0")}{" "}
            <span className="text-neutral-500">/</span>{" "}
            {String(total).padStart(2, "0")}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            stop(e);
            onNext();
          }}
          disabled={atEnd}
          className="glass-pill font-sans rounded-full px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-100 transition disabled:cursor-not-allowed disabled:opacity-35 sm:px-6 sm:py-2.5 sm:text-[11px]"
        >
          {atEnd ? "Done" : "Next"}
        </button>
      </div>
    </footer>
  );
}

function SlideProgressDots({ total, idx }: { total: number; idx: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={
            "rounded-full transition-all duration-300 " +
            (i === idx
              ? "h-1 w-5 bg-neutral-50"
              : i < idx
                ? "h-1 w-1 bg-neutral-200/55"
                : "h-1 w-1 bg-neutral-300/20")
          }
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FN badge                                                           */
/* ------------------------------------------------------------------ */

function FNBadge() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-6 right-6 z-30 hidden sm:bottom-10 sm:right-10 sm:block"
    >
      <div className="relative h-20 w-20 sm:h-24 sm:w-24">
        <svg
          viewBox="0 0 200 200"
          className="badge-rotate absolute inset-0 h-full w-full"
        >
          <defs>
            <path
              id="fn-badge-circle"
              d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0"
            />
          </defs>
          <text
            fill="rgba(245,245,240,0.55)"
            fontSize="12"
            fontFamily="var(--font-sans), sans-serif"
            letterSpacing="3.2"
            style={{ textTransform: "uppercase", fontWeight: 500 }}
          >
            <textPath href="#fn-badge-circle" startOffset="0">
              founders network &middot; ucsd &middot; biz &middot; eng
              &middot; sci &middot;&nbsp;
            </textPath>
          </text>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/[0.06] backdrop-blur-sm sm:h-11 sm:w-11">
            <span className="font-sans text-[10px] font-semibold tracking-[0.05em] text-neutral-50 sm:text-[11px]">
              FN
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
