"use client";

/**
 * San Diego chapter — currently lives as the GBM #1 slideshow for the
 * club's first general body meeting.
 *
 * Layout mirrors the FN board deck visual language:
 *   - Slim top context bar: FN circle badge + wordmark left, deck
 *     context (e.g. "GBM #1 · MAY 2026") right.
 *   - Slide content is left-aligned in a constrained max-width column
 *     vertically centred in the stage. Eyebrow ("04 · ON THE
 *     CALENDAR"), then huge italic Instrument Serif headline, then a
 *     short body paragraph (max ~3 sentences), then optional glass-
 *     pill bullet items.
 *   - Hype slides centre a single huge italic title with no body or
 *     items. Cover uses the same centred layout.
 *   - Footer holds a single glass-pill row of controls
 *     (PREV · progress dots · counter · NEXT) and a rotating FN
 *     badge anchors the bottom-right corner.
 *
 * Slide-to-slide transitions are a real crossfade: when the index
 * changes, the outgoing slide stays mounted with a fade-out animation
 * while the incoming slide mounts with a fade-in. Both occupy the
 * same absolute-positioned slot during the overlap.
 *
 * Voice rules (enforced):
 *   - no em dashes
 *   - no "not X, but Y"
 *   - flowing prose, no staccato fragment stacks
 *   - bodies trimmed to 2-3 sentences max
 *
 * Background: subdued bone-grey + glacier-blue orb canvas with a
 * translucent darkening layer. Cursor still tracks the sphere.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import * as THREE from "three";

import { OrbBackground } from "../../components/orb-background";
import { type PaletteUniforms } from "../../components/fluid-orb";
import { hexToLinearRGB } from "../../lib/color-schemes";

interface SlideItem {
  label: string;
  body: string;
}

interface Slide {
  id: string;
  /** Eyebrow LABEL only — the slide number is prepended at render. */
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
  items?: SlideItem[];
  /** Centre-stack the title, no eyebrow / body / items. */
  centred?: boolean;
}

const SLIDES: Slide[] = [
  {
    id: "cover",
    title: <>Founders, Without Limits.</>,
    centred: true,
  },
  {
    id: "rebrand",
    eyebrow: "What changed",
    title: <>SEN is now Founders Network.</>,
    body: (
      <>
        Same organization with broader scope, and we are building it toward
        chapter expansion beyond UCSD.
      </>
    ),
  },
  {
    id: "coalition",
    eyebrow: "Coalition",
    title: <>The RAIN coalition is locked in.</>,
    body: (
      <>
        Founders Network sits as the connective tissue across UCSD&apos;s
        student-built ecosystem.
      </>
    ),
    items: [
      { label: "5,000", body: "members across the coalition." },
      { label: "12", body: "partner orgs and growing every quarter." },
    ],
  },
  {
    id: "events",
    eyebrow: "On the calendar",
    title: <>Two events to ship this month.</>,
    body: (
      <>
        Both events pull speakers, audience, and energy from the network and
        feed the result back into it.
      </>
    ),
    items: [
      {
        label: "May 8",
        body: "Sit-down with Neal that funnels into a co-branded mega-hike and the Skool community.",
      },
      {
        label: "End of the month",
        body: "Women in Rady event with the speaker lineup pulled from the network.",
      },
    ],
  },
  {
    id: "sponsorship",
    eyebrow: "How we fund this",
    title: <>Every San Diego business is a partner.</>,
    body: (
      <>
        A simple ask-and-give model worked one local business at a time.
      </>
    ),
    items: [
      { label: "Ask", body: "Products, gift cards, raffle items, speakers." },
      {
        label: "Give",
        body: "Awards, event placement, the audience that shows up in our room.",
      },
    ],
  },
  {
    id: "vision",
    eyebrow: "The grander vision",
    title: <>Every great company starts in a dorm room.</>,
    body: (
      <>
        The rooms should be connected. Founders Network is the constellation
        of student-builder chapters that share the same standards and the
        understanding that the proof of concept matters more than the pitch
        deck.
      </>
    ),
  },
  {
    id: "hype",
    title: <>We create the future.</>,
    centred: true,
  },
  {
    id: "discussion",
    eyebrow: "Founders' Discussion",
    title: <>What are you building, and where are you stuck?</>,
    body: (
      <>
        Spend ten minutes naming the project you are most invested in and
        the one block that would clear the path if it moved by Friday.
        Someone two seats away can probably move it the moment you say it
        aloud.
      </>
    ),
  },
  {
    id: "coffee",
    eyebrow: "Coffee chats",
    title: <>Find one person you didn&apos;t come in knowing.</>,
    body: (
      <>
        Set up the chat for this week before you leave the room, and post
        who you are meeting in the chat afterward so the network actually
        wires itself together.
      </>
    ),
  },
  {
    id: "outro",
    eyebrow: "Until next time",
    title: <>Now go and build something this week.</>,
    body: (
      <>
        The site lives at ucsdfounders.com, and applications to charter
        chapters elsewhere are open at /apply. The next GBM lands when
        there is something worth gathering for.
      </>
    ),
  },
];

const TOTAL = SLIDES.length;
const TRANSITION_MS = 520;

/* Bone-grey + glacier-blue palette for the slideshow. Cooler than the
 * homepage's locked Bone/Glacier 33% blend so it visually distinguishes
 * the chapter context, while still belonging to the same family. */
const SLIDE_PALETTE_HEX = {
  c0: "#060809",
  c1: "#1a2228",
  c2: "#5e7a8a",
  c3: "#d8dde2",
  accent: "#1c2832",
} as const;

export default function SanDiegoChapter() {
  /* Two indices keep the outgoing and incoming slide mounted at the
   * same time during the crossfade. `previous` clears once the
   * fade-out animation finishes. */
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

  const next = useCallback(() => {
    navigate(current + 1);
  }, [current, navigate]);
  const prev = useCallback(() => {
    navigate(current - 1);
  }, [current, navigate]);

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

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06080a] text-neutral-100">
      {/* Live orb canvas (cursor-reactive) with bone+glacier palette,
       * dimmed via a translucent vignette so the slide text dominates. */}
      <div className="absolute inset-0 z-0">
        <OrbBackground paletteUniforms={paletteUniforms} />
      </div>
      <div
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(6,8,10,0.36) 0%, rgba(6,8,10,0.66) 65%, rgba(6,8,10,0.82) 100%)",
        }}
      />

      <SlideshowHeader idx={current} total={TOTAL} />

      <div
        className="relative z-10 flex min-h-screen cursor-pointer select-none flex-col items-stretch justify-center px-6 sm:px-12 md:px-20 lg:px-28"
        onClick={next}
        role="button"
        tabIndex={-1}
        aria-label="Advance to next slide"
      >
        {/* Slide stage. Both slides occupy the same absolute slot
         * during a crossfade. */}
        <div className="relative flex min-h-[640px] flex-1 items-stretch py-32 sm:py-40">
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
/* Slideshow header (top context bar)                                 */
/* ------------------------------------------------------------------ */

function SlideshowHeader({ idx, total }: { idx: number; total: number }) {
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
      <span
        aria-label={`Slide ${idx + 1} of ${total}`}
        className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-300/75 sm:text-[12px]"
      >
        GBM #1 <span className="text-neutral-500">·</span> May 2026
      </span>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Slide view (entering / leaving / settled)                          */
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
    phase === "settled"
      ? "relative w-full"
      : "absolute inset-0";

  if (slide.centred) {
    return (
      <article
        className={`${positionClass} ${animClass} flex items-center justify-center px-6 text-center`}
      >
        <h2 className="hero-text text-5xl italic leading-[0.98] text-neutral-50 drop-shadow-[0_2px_30px_rgba(0,0,0,0.55)] sm:text-7xl md:text-[120px] lg:text-[150px]">
          {slide.title}
        </h2>
      </article>
    );
  }

  return (
    <article
      className={`${positionClass} ${animClass} flex flex-col justify-center`}
    >
      <div className="flex w-full max-w-5xl flex-col gap-7 sm:gap-9">
        {slide.eyebrow ? (
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-300/75 sm:text-[12px]">
            <span className="text-neutral-100">{slideNumber}</span>
            <span className="mx-2 text-neutral-500">·</span>
            <span>{slide.eyebrow}</span>
          </p>
        ) : null}

        <h2 className="hero-text text-[44px] italic leading-[0.98] text-neutral-50 drop-shadow-[0_2px_30px_rgba(0,0,0,0.55)] sm:text-[80px] md:text-[110px] lg:text-[136px]">
          {slide.title}
        </h2>

        {slide.body ? (
          <p className="font-sans max-w-3xl text-lg leading-[1.55] text-neutral-300 sm:text-xl">
            {slide.body}
          </p>
        ) : null}

        {slide.items && slide.items.length > 0 ? (
          <div className="mt-2 flex max-w-3xl flex-col gap-3">
            {slide.items.map((item, i) => (
              <div
                key={i}
                className="glass-pill font-sans flex items-start gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                style={{ borderRadius: 14 }}
              >
                <span
                  aria-hidden="true"
                  className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#cfcfcf]"
                />
                <p className="text-base leading-relaxed text-neutral-200 sm:text-lg">
                  <strong className="font-semibold text-neutral-50">
                    {item.label}
                  </strong>
                  <span className="mx-2 text-neutral-500">·</span>
                  <span>{item.body}</span>
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Slideshow footer (bottom controls)                                 */
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
/* FN circular badge — bottom-right corner (mirrors screenshot)       */
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
