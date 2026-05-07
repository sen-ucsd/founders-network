"use client";

/**
 * San Diego chapter — currently lives as the GBM #1 slideshow for the
 * club's first general body meeting. Click anywhere to advance; arrow
 * keys also work; the prev/next controls are anchored bottom-centre.
 *
 * The voice rules in effect (see memory):
 *   - no em dashes
 *   - no "not X, but Y"
 *   - no unnecessary eyebrow labels
 *   - no staccato — full sentences with conjunctions, prose that
 *     flows rather than stacked fragments
 *
 * To turn this back into a real chapter landing later, replace the
 * default export with the chapter page and move this slideshow to
 * /chapters/san-diego/gbm-1/page.tsx.
 */

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";

import { TopNav } from "../../components/top-nav";

interface Slide {
  id: string;
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;
  /** When true, render the title huge and centre-stack with no body. */
  hype?: boolean;
}

const SLIDES: Slide[] = [
  {
    id: "cover",
    eyebrow: "GBM #1 · San Diego · Founding Chapter",
    title: (
      <>
        We finally got <em>everyone</em> in the same room.
      </>
    ),
    body: (
      <>
        First general body meeting of Founders Network at San Diego, the
        founding chapter of a network we are taking outward from here.
      </>
    ),
  },
  {
    id: "state",
    eyebrow: "Where we are",
    title: (
      <>
        We have a name, a site, and a story now.
      </>
    ),
    body: (
      <>
        Founders Network is the new identity that the club is moving toward,
        the site at <span className="font-medium text-neutral-100">ucsdfounders.com</span>{" "}
        is the home of the brand, and the four programs that have been
        running under the old name will keep running here without missing a
        step. The change of name carries an expanded ambition behind it:
        San Diego is no longer one campus club but the founding chapter of
        a network that we plan to charter on other campuses through the
        rest of the year.
      </>
    ),
  },
  {
    id: "vision",
    eyebrow: "The grander vision",
    title: <>Every great company starts in a dorm room.</>,
    body: (
      <>
        The rooms should be connected. We are building a constellation of
        student-builder chapters that share the same programs, the same
        standards, and the same understanding that the proof of concept
        matters more than the pitch deck, and San Diego is the first node
        in that constellation. Every chapter that joins after this one
        inherits what we are building right now in this room.
      </>
    ),
  },
  {
    id: "programs",
    eyebrow: "What we run",
    title: <>The infrastructure for impact.</>,
    body: (
      <>
        Every chapter, including this one, runs the same four programs that
        are designed to compound the work members are already doing on
        their own products. Build Nights are weekly working sessions where
        the room ships side projects together and unblocks each other in
        real time, Founder Conversations bring in operators and investors
        for off-the-record talks that answer the questions you would never
        ask on a public stage, Inter-Chapter Exchange will let members spend
        a week working out of another chapter&apos;s city as those nodes
        come online, and Capital Connections is the warm-intro layer
        between projects with real traction and the angels and funds in
        each chapter&apos;s region.
      </>
    ),
  },
  {
    id: "expansion",
    eyebrow: "What is coming",
    title: <>Other campuses next.</>,
    body: (
      <>
        New chapters charter on a rolling timeline, with charter teams
        already forming on a handful of campuses that we are not naming
        yet because we name nothing until it ships. By the end of this
        year there will be more nodes in the constellation than just this
        one, and the people in this room are the ones who will host the
        first inter-chapter exchanges that make the network feel real
        rather than aspirational.
      </>
    ),
  },
  {
    id: "hype",
    hype: true,
    title: (
      <>
        We are <em>welding</em> the future, not talking about it.
      </>
    ),
    footer: "The energy here is different. Let it stay different.",
  },
  {
    id: "discussion",
    eyebrow: "Founders' Discussion",
    title: <>What are you building, and where are you stuck?</>,
    body: (
      <>
        Take the next ten minutes to say two things to the room: the
        project you are most invested in right now, and the one block that
        would actually move the needle if it cleared in the next two weeks.
        The point of doing this out loud is that someone two seats away
        can probably move that block by Friday, and the only way that
        happens is if you say what it is.
      </>
    ),
  },
  {
    id: "coffee",
    eyebrow: "Coffee chats",
    title: <>Find one person you didn&apos;t come in knowing.</>,
    body: (
      <>
        Pick someone whose project, background, or angle is different
        enough from yours that the conversation will go somewhere
        unexpected, set up a coffee chat for this week before you leave
        the room, and post who you are meeting in the chat afterward so
        the rest of us can see the network actually wiring itself
        together. The chapter exists in the connections that get made
        between meetings, so this part is the meeting.
      </>
    ),
  },
  {
    id: "outro",
    eyebrow: "See you at GBM #2",
    title: <>Now go build something.</>,
    body: (
      <>
        Founders Network lives at ucsdfounders.com, applications to
        charter chapters on other campuses are open at /apply, and the
        next GBM lands when there is something worth gathering for. Until
        then, ship something this week that you can show on the wall the
        next time we meet.
      </>
    ),
  },
];

const TOTAL = SLIDES.length;

export default function SanDiegoChapter() {
  const [idx, setIdx] = useState(0);

  const next = useCallback(() => {
    setIdx((i) => Math.min(TOTAL - 1, i + 1));
  }, []);
  const prev = useCallback(() => {
    setIdx((i) => Math.max(0, i - 1));
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
        setIdx(0);
      } else if (e.key === "End") {
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
    <main className="relative min-h-screen overflow-hidden bg-[#0a0a08] text-neutral-200">
      <BackgroundLayers />

      <div className="relative z-10 flex min-h-screen flex-col">
        <TopNav />

        {/* The slide stage. Click anywhere outside the controls to
         * advance — common for in-person presentations. We capture
         * pointer events here and stop propagation on the actual
         * buttons below so they don't double-fire. */}
        <div
          className="flex flex-1 cursor-pointer select-none flex-col items-center justify-center px-6 pb-32 pt-20 sm:px-10 sm:pb-40 sm:pt-28"
          onClick={next}
          role="button"
          tabIndex={-1}
          aria-label="Advance to next slide"
        >
          <SlideView slide={slide} index={idx} />
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

function SlideView({ slide, index }: { slide: Slide; index: number }) {
  if (slide.hype) {
    return (
      <article
        key={index}
        className="slide-fade flex max-w-5xl flex-col items-center gap-8 text-center"
      >
        <h2 className="hero-text text-5xl italic leading-[1.02] text-neutral-50 drop-shadow-[0_2px_30px_rgba(0,0,0,0.55)] sm:text-7xl md:text-[112px]">
          {slide.title}
        </h2>
        {slide.footer ? (
          <p className="max-w-xl text-base leading-relaxed text-neutral-300 sm:text-lg">
            {slide.footer}
          </p>
        ) : null}
      </article>
    );
  }

  return (
    <article
      key={index}
      className="slide-fade flex w-full max-w-4xl flex-col gap-8"
    >
      {slide.eyebrow ? (
        <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-neutral-300/80 sm:text-[11px]">
          {slide.eyebrow}
        </p>
      ) : null}
      <h2 className="hero-text text-4xl italic leading-[1.05] text-neutral-50 drop-shadow-[0_2px_30px_rgba(0,0,0,0.55)] sm:text-6xl md:text-7xl">
        {slide.title}
      </h2>
      {slide.body ? (
        <p className="max-w-2xl text-lg leading-relaxed text-neutral-200 sm:text-xl">
          {slide.body}
        </p>
      ) : null}
      {slide.footer ? (
        <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-400">
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
        className="glass-pill rounded-full px-4 py-2 text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-200 transition hover:text-white sm:px-5 sm:text-[11px]"
      >
        ← Exit
      </Link>

      <div className="glass-pill flex items-center gap-2 rounded-full px-4 py-2 sm:px-5">
        <SlideProgress total={total} idx={idx} />
        <span className="ml-1 text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-300 sm:text-[11px]">
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
          className="glass-pill rounded-full px-4 py-2 text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-200 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:px-5 sm:text-[11px]"
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
          className="glass-cta-light rounded-full px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:text-[11px]"
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

/* ------------------------------------------------------------------ */
/* Background — static gradient + grain. No live shader during a
/* presentation, so the audience focuses on the words.                */
/* ------------------------------------------------------------------ */

function BackgroundLayers() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 25% 18%, rgba(80, 80, 70, 0.30) 0%, transparent 55%), radial-gradient(ellipse 90% 70% at 75% 82%, rgba(45, 45, 35, 0.22) 0%, transparent 55%), radial-gradient(ellipse at 50% 50%, #161510 0%, #0a0a08 60%, #050504 100%)",
        }}
      />
      <div className="grain-coarse" />
      <div className="grain" />
    </div>
  );
}
