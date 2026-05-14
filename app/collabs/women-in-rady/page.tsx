"use client";

/**
 * /collabs/women-in-rady — landing page for the Founders Network ×
 * Women in Rady end-of-May collab event.
 *
 * Layout: hero with the crossover wordmark and the framing line, a
 * details section with four glass-pill items (when / where / format
 * / RSVP), a two-cards "the two networks" section, and a closing CTA
 * pointing at /apply. Whole page sits over the live orb canvas with a
 * subtle darkening overlay so the brand atmosphere carries through.
 *
 * Voice rules in effect: no em dashes, no "not X, but Y", no staccato
 * fragment stacks, at most one sentence under five words ("Be in the
 * room." at the closing CTA).
 */

import { useMemo } from "react";
import Link from "next/link";
import * as THREE from "three";

import { TopNav } from "../../components/top-nav";
import { OrbBackground } from "../../components/orb-background";
import { type PaletteUniforms } from "../../components/fluid-orb";
import { hexToLinearRGB } from "../../lib/color-schemes";

const PALETTE_HEX = {
  c0: "#080907",
  c1: "#1f2121",
  c2: "#6d7677",
  c3: "#e0ddce",
  accent: "#252220",
} as const;

interface DetailItem {
  label: string;
  body: string;
}

const DETAILS: DetailItem[] = [
  {
    label: "When",
    body: "End of May 2026, with the exact date locking in shortly.",
  },
  {
    label: "Where",
    body: "On campus at UCSD, with the venue confirmed once attendance is set.",
  },
  {
    label: "Format",
    body: "A closed-door evening with a small audience and a speaker lineup pulled from across the network.",
  },
  {
    label: "RSVP",
    body: "Goes live once the date is pinned. Until then, the chapter team is the way in.",
  },
];

export default function WomenInRadyCollab() {
  const paletteUniforms = useMemo<PaletteUniforms>(() => {
    const v = (h: string) => new THREE.Vector3(...hexToLinearRGB(h));
    return {
      uColor0: { value: v(PALETTE_HEX.c0) },
      uColor1: { value: v(PALETTE_HEX.c1) },
      uColor2: { value: v(PALETTE_HEX.c2) },
      uColor3: { value: v(PALETTE_HEX.c3) },
      uAccent: { value: v(PALETTE_HEX.accent) },
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06080a] text-neutral-100">
      {/* Live orb canvas spans the whole page; cursor-reactive but
       * dimmed by the radial overlay so content stays readable as the
       * page scrolls. */}
      <div className="absolute inset-0 z-0">
        <OrbBackground paletteUniforms={paletteUniforms} />
      </div>
      <div
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(6,8,10,0.32) 0%, rgba(6,8,10,0.58) 65%, rgba(6,8,10,0.74) 100%)",
        }}
      />

      <div className="relative z-10">
        <TopNav />

        {/* ---------------------------------------------------------- */}
        {/* Hero                                                       */}
        {/* ---------------------------------------------------------- */}
        <section className="flex min-h-screen items-center px-6 pb-32 pt-40 sm:px-12 sm:pb-40 sm:pt-44 md:px-20 lg:px-28">
          <div className="flex w-full max-w-5xl flex-col gap-7 sm:gap-9">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-300/80 sm:text-[12px]">
              Collaboration
              <span className="mx-2 text-neutral-500">·</span>
              End of May 2026
            </p>
            <h1 className="hero-text text-[44px] italic leading-[0.98] text-neutral-50 drop-shadow-[0_2px_30px_rgba(0,0,0,0.55)] sm:text-[80px] md:text-[108px] lg:text-[128px]">
              Founders Network{" "}
              <span className="not-italic font-light text-neutral-300">
                ×
              </span>{" "}
              Women in Rady.
            </h1>
            <p className="font-sans max-w-3xl text-lg leading-[1.55] text-neutral-300 sm:text-xl">
              A closed-door evening built around the women shipping things
              at UCSD. Speakers pulled from across the network, the
              audience pulled intentionally tight from both rooms.
            </p>
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link
                href="/apply"
                className="glass-cta-light rounded-full px-6 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900"
              >
                Join the network
              </Link>
              <Link
                href="#details"
                className="glass-pill rounded-full px-5 py-2.5 text-center text-xs font-medium uppercase tracking-[0.22em] text-neutral-100 transition hover:text-white"
              >
                See the details
              </Link>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Details                                                    */}
        {/* ---------------------------------------------------------- */}
        <section
          id="details"
          className="border-t border-white/[0.06] bg-[#06080a]/55 px-6 py-24 backdrop-blur-sm sm:px-12 sm:py-32 md:px-20 lg:px-28"
        >
          <div className="w-full max-w-5xl">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-300/80 sm:text-[12px]">
              The details
            </p>
            <h2 className="hero-text mt-6 text-4xl italic leading-[1.05] text-neutral-50 sm:text-5xl md:text-6xl">
              What we know so far.
            </h2>
            <p className="font-sans mt-5 max-w-2xl text-base leading-relaxed text-neutral-300 sm:text-lg">
              The shape is set and the lineup is being assembled this week.
              The rest locks in shortly.
            </p>
            <div className="mt-12 grid gap-3 sm:grid-cols-2">
              {DETAILS.map((d) => (
                <div
                  key={d.label}
                  className="glass-pill flex items-start gap-4 px-5 py-4 sm:px-6 sm:py-5"
                  style={{ borderRadius: 14 }}
                >
                  <span
                    aria-hidden="true"
                    className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#cfcfcf]"
                  />
                  <p className="text-base leading-relaxed text-neutral-200 sm:text-lg">
                    <strong className="font-semibold text-neutral-50">
                      {d.label}
                    </strong>
                    <span className="mx-2 text-neutral-500">·</span>
                    <span>{d.body}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* The two networks                                           */}
        {/* ---------------------------------------------------------- */}
        <section className="border-t border-white/[0.06] bg-[#06080a]/55 px-6 py-24 backdrop-blur-sm sm:px-12 sm:py-32 md:px-20 lg:px-28">
          <div className="w-full max-w-5xl">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-300/80 sm:text-[12px]">
              The two networks
            </p>
            <h2 className="hero-text mt-6 text-4xl italic leading-[1.05] text-neutral-50 sm:text-5xl md:text-6xl">
              Two collectives meeting in one room.
            </h2>
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              <div className="glass-card flex flex-col gap-3 p-6 sm:p-7">
                <p className="font-sans text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-300/85">
                  Founders Network
                </p>
                <h3 className="hero-text text-2xl italic text-neutral-50 sm:text-3xl">
                  The coalition of student builders.
                </h3>
                <p className="text-sm leading-relaxed text-neutral-300 sm:text-[15px]">
                  San Diego is the founding chapter of a network that
                  connects business, engineering, and science orgs into
                  one room at every campus the network lands on.
                </p>
              </div>
              <div className="glass-card flex flex-col gap-3 p-6 sm:p-7">
                <p className="font-sans text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-300/85">
                  Women in Rady
                </p>
                <h3 className="hero-text text-2xl italic text-neutral-50 sm:text-3xl">
                  The women shipping in Rady.
                </h3>
                <p className="text-sm leading-relaxed text-neutral-300 sm:text-[15px]">
                  The org gathering and amplifying the women building
                  things out of Rady, including the founders, the
                  operators, and the researchers turning work into shipped
                  output.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Closing CTA                                                */}
        {/* ---------------------------------------------------------- */}
        <section className="border-t border-white/[0.06] bg-[#06080a]/55 px-6 py-24 backdrop-blur-sm sm:px-12 sm:py-32 md:px-20 lg:px-28">
          <div className="w-full max-w-5xl">
            <h2 className="hero-text text-4xl italic leading-[1.05] text-neutral-50 sm:text-5xl md:text-7xl">
              Be in the room.
            </h2>
            <p className="font-sans mt-6 max-w-2xl text-base leading-relaxed text-neutral-300 sm:text-lg">
              Joining Founders Network puts you in the loop on this and the
              rest of the chapter&apos;s programming. The application is
              short and we read every one by hand.
            </p>
            <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link
                href="/apply"
                className="glass-cta-light rounded-full px-6 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900"
              >
                Join the network
              </Link>
              <Link
                href="/"
                className="glass-pill rounded-full px-5 py-2.5 text-center text-xs font-medium uppercase tracking-[0.22em] text-neutral-100 transition hover:text-white"
              >
                Back to home
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
