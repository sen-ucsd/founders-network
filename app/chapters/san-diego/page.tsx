"use client";

/**
 * San Diego chapter — currently lives as the GBM #1 slideshow for the
 * club's first general body meeting. Click anywhere to advance; arrow
 * keys also work; the prev/next controls are anchored bottom-centre.
 *
 * Voice rules (enforced):
 *   - no em dashes
 *   - no "not X, but Y"
 *   - no unnecessary eyebrow labels
 *   - flowing prose with conjunctions, no stacked staccato fragments
 *   - at most one sentence under five words across the deck (reserved
 *     for the "Founders, Without Limits." brand line on the cover)
 *
 * Content here is pulled from the May 2026 internal board deck and
 * trimmed to what's safe to share publicly. The board deck flagged
 * several specifics as internal: $1k from Tim, AS-still-in-conversation,
 * Khosla pathway via Courtney, the Greg/Rady DEI move, the TTV deal,
 * and the board roster with personal emails. None of that surfaces here.
 *
 * Background uses the orb canvas with a bone-grey + glacier-blue palette
 * and a translucent overlay so the WebGL stays subdued and the words
 * are the focal point. The sphere still tracks the cursor for the
 * "somewhat interactive" feel.
 *
 * Slide-to-slide transitions are CSS-only and direction-aware: forward
 * navigations bring the new slide in from the right, back navigations
 * from the left, both with a soft fade.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import * as THREE from "three";

import { TopNav } from "../../components/top-nav";
import { OrbBackground } from "../../components/orb-background";
import { type PaletteUniforms } from "../../components/fluid-orb";
import { hexToLinearRGB } from "../../lib/color-schemes";

interface Slide {
  id: string;
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;
  /** Hype slides skip the body and centre-stack a huge title. */
  hype?: boolean;
}

const SLIDES: Slide[] = [
  {
    id: "cover",
    eyebrow: "GBM #1 · San Diego · Spring 2026",
    title: <>Founders, Without Limits.</>,
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
        Five thousand members across twelve partner orgs and growing, with
        Founders Network sitting as the connective tissue.
      </>
    ),
  },
  {
    id: "events",
    eyebrow: "On the calendar",
    title: <>Two events to ship this month.</>,
    body: (
      <>
        May 8 brings a sit-down with Neal that funnels into a co-branded
        mega-hike and the Skool community, and the end of the month brings
        the Women in Rady event with our speaker lineup pulled from the
        network.
      </>
    ),
  },
  {
    id: "sponsorship",
    eyebrow: "How we fund the work",
    title: <>Every San Diego business is a partner.</>,
    body: (
      <>
        We trade products, gift cards, raffle items, and speakers for
        awards, event placement, and the audience that shows up in our
        room.
      </>
    ),
  },
  {
    id: "vision",
    eyebrow: "The grander vision",
    title: <>Every great company starts in a dorm room.</>,
    body: (
      <>
        The rooms should be connected. Founders Network is the
        constellation of student-builder chapters that share the same
        standards and the understanding that the proof of concept matters
        more than the pitch deck.
      </>
    ),
  },
  {
    id: "hype",
    hype: true,
    title: (
      <>
        We <em>weld</em> the future before we talk about it.
      </>
    ),
    footer:
      "The energy here is different, and the work of this room is to keep it that way.",
  },
  {
    id: "discussion",
    eyebrow: "Founders' Discussion",
    title: <>What are you building, and where are you stuck?</>,
    body: (
      <>
        Spend ten minutes naming the project you are most invested in and
        the one block that would clear the path if it moved by Friday,
        since someone two seats away can probably move it the moment you
        say it aloud.
      </>
    ),
  },
  {
    id: "coffee",
    eyebrow: "Coffee chats",
    title: <>Find one person you didn&apos;t come in knowing.</>,
    body: (
      <>
        Pick someone whose angle is different enough that the conversation
        goes somewhere unexpected, set up the coffee chat for this week
        before you leave the room, and post who you are meeting in the
        chat afterward so the network actually wires itself together.
      </>
    ),
  },
  {
    id: "outro",
    eyebrow: "See you at GBM #2",
    title: <>Now go and build something this week.</>,
    body: (
      <>
        The site lives at ucsdfounders.com, applications to charter
        chapters elsewhere are open at /apply, and the next GBM lands when
        there is something worth gathering for.
      </>
    ),
  },
];

const TOTAL = SLIDES.length;

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

type Direction = "forward" | "back";

export default function SanDiegoChapter() {
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState<Direction>("forward");

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

  const next = useCallback(() => {
    setIdx((i) => {
      if (i >= TOTAL - 1) return i;
      setDirection("forward");
      return i + 1;
    });
  }, []);
  const prev = useCallback(() => {
    setIdx((i) => {
      if (i <= 0) return i;
      setDirection("back");
      return i - 1;
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
        next();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        prev();
      } else if (e.key === "Home") {
        setDirection("back");
        setIdx(0);
      } else if (e.key === "End") {
        setDirection("forward");
        setIdx(TOTAL - 1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  const slide = SLIDES[idx];
  const atStart = idx === 0;
  const atEnd = idx === TOTAL - 1;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06080a] text-neutral-200">
      {/* Live orb canvas with the bone+glacier palette. Stays cursor-
       * reactive but a translucent darkening layer above it subdues
       * the visual relative to the homepage hero. */}
      <div className="absolute inset-0 z-0">
        <OrbBackground paletteUniforms={paletteUniforms} />
      </div>
      <div
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(6,8,10,0.32) 0%, rgba(6,8,10,0.62) 65%, rgba(6,8,10,0.78) 100%)",
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        <TopNav />

        <div
          className="flex flex-1 cursor-pointer select-none flex-col items-center justify-center px-6 pb-32 pt-20 sm:px-10 sm:pb-40 sm:pt-28"
          onClick={next}
          role="button"
          tabIndex={-1}
          aria-label="Advance to next slide"
        >
          <SlideView slide={slide} index={idx} direction={direction} />
        </div>

        <SlideControls
          idx={idx}
          total={TOTAL}
          atStart={atStart}
          atEnd={atEnd}
          onPrev={prev}
          onNext={next}
        />
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Slide view                                                         */
/* ------------------------------------------------------------------ */

function SlideView({
  slide,
  index,
  direction,
}: {
  slide: Slide;
  index: number;
  direction: Direction;
}) {
  const animClass =
    direction === "back" ? "slide-enter slide-enter-back" : "slide-enter";

  if (slide.hype) {
    return (
      <article
        key={index}
        className={`${animClass} flex max-w-5xl flex-col items-center gap-8 text-center`}
      >
        <h2 className="hero-text text-5xl leading-[1.05] text-neutral-50 drop-shadow-[0_2px_30px_rgba(0,0,0,0.55)] sm:text-7xl md:text-[112px]">
          {slide.title}
        </h2>
        {slide.footer ? (
          <p className="font-sans max-w-2xl text-base leading-relaxed text-neutral-300 sm:text-lg">
            {slide.footer}
          </p>
        ) : null}
      </article>
    );
  }

  return (
    <article
      key={index}
      className={`${animClass} flex w-full max-w-4xl flex-col gap-8`}
    >
      {slide.eyebrow ? (
        <p className="font-sans text-[10px] font-medium uppercase tracking-[0.32em] text-neutral-300/85 sm:text-[11px]">
          {slide.eyebrow}
        </p>
      ) : null}
      <h2 className="hero-text text-4xl leading-[1.06] text-neutral-50 drop-shadow-[0_2px_30px_rgba(0,0,0,0.55)] sm:text-6xl md:text-7xl">
        {slide.title}
      </h2>
      {slide.body ? (
        <p className="font-sans max-w-2xl text-lg leading-relaxed text-neutral-200 sm:text-xl">
          {slide.body}
        </p>
      ) : null}
      {slide.footer ? (
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-400">
          {slide.footer}
        </p>
      ) : null}
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Slide controls                                                     */
/* ------------------------------------------------------------------ */

function SlideControls({
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
    <div
      className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-3 px-5 pb-6 sm:px-10 sm:pb-10"
      onClick={stop}
    >
      <Link
        href="/"
        onClick={stop}
        className="glass-pill font-sans rounded-full px-4 py-2 text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-200 transition hover:text-white sm:px-5 sm:text-[11px]"
      >
        ← Exit
      </Link>

      <div className="glass-pill flex items-center gap-2 rounded-full px-4 py-2 sm:px-5">
        <SlideProgress total={total} idx={idx} />
        <span className="font-sans ml-1 text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-300 sm:text-[11px]">
          {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={(e) => {
            stop(e);
            onPrev();
          }}
          disabled={atStart}
          className="glass-pill font-sans rounded-full px-4 py-2 text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-200 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:px-5 sm:text-[11px]"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={(e) => {
            stop(e);
            onNext();
          }}
          disabled={atEnd}
          className="glass-cta-light font-sans rounded-full px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:text-[11px]"
        >
          {atEnd ? "Done" : "Next →"}
        </button>
      </div>
    </div>
  );
}

function SlideProgress({ total, idx }: { total: number; idx: number }) {
  return (
    <div className="hidden items-center gap-1.5 sm:flex">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={
            "h-1 rounded-full transition-all duration-300 " +
            (i === idx
              ? "w-6 bg-neutral-100"
              : i < idx
                ? "w-3 bg-neutral-300/60"
                : "w-3 bg-neutral-300/20")
          }
        />
      ))}
    </div>
  );
}
