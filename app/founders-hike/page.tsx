"use client";

/**
 * /founders-hike — landing + signup for the biggest Founders' Hike
 * at Torrey Pines.
 *
 * Hero stacks three background layers:
 *   1. Live orb canvas (cursor-reactive, locked palette).
 *   2. Aerial Torrey Pines photograph at /public/founders-hike-
 *      torrey-pines.jpg, blended via mix-blend-mode and opacity so
 *      the brand orb still reads through it.
 *   3. A cinematic gradient that evokes sandstone cliffs over the
 *      Pacific — acts as a fallback if the photo file isn't there
 *      yet and as a colour wash even when it is.
 *
 * Below the hero: event details cards, then the signup form posting
 * to /api/hike which inserts into Supabase's `hike_signups` table.
 *
 * Voice rules: no em dashes, no "not X, but Y", no staccato fragment
 * stacks, max one sentence under five words (the closing CTA).
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import * as THREE from "three";

import { TopNav } from "../components/top-nav";
import { OrbBackground } from "../components/orb-background";
import { type PaletteUniforms } from "../components/fluid-orb";
import { hexToLinearRGB } from "../lib/color-schemes";

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
    label: "Where",
    body: "Torrey Pines State Natural Reserve. Meeting point shared once you sign up.",
  },
  {
    label: "Who",
    body: "UCSD students get priority. Other student founders in the San Diego area welcome as space allows.",
  },
  {
    label: "Why show up",
    body: "Hundreds of founders, a real conversation, and the next collaboration somewhere along the trail.",
  },
  {
    label: "Date",
    body: "Locking in shortly. We will email everyone who signs up the moment it is set.",
  },
];

interface FormState {
  name: string;
  email: string;
  phone: string;
}

const EMPTY_FORM: FormState = { name: "", email: "", phone: "" };

type Status = "idle" | "submitting" | "success" | "error";

export default function FoundersHikePage() {
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

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const valid =
    form.name.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) &&
    form.phone.replace(/[^\d]/g, "").length >= 7;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!valid || status === "submitting") return;
    setStatus("submitting");
    setErrorMsg(null);

    try {
      const resp = await fetch("/api/hike", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!resp.ok) {
        const data = (await resp.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(data?.message ?? `Submission failed (${resp.status})`);
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Submission failed");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06080a] text-neutral-100">
      {/* Layer 1: live orb canvas. */}
      <div className="absolute inset-0 z-0">
        <OrbBackground paletteUniforms={paletteUniforms} />
      </div>

      {/* Layer 2: Torrey Pines aerial photograph (when present at
       * /public/founders-hike-torrey-pines.jpg). Blended via screen-
       * style mixing so the brand orb stays present beneath. */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          backgroundImage:
            "url('/founders-hike-torrey-pines.jpg'), linear-gradient(to bottom, rgba(190, 165, 130, 0.35) 0%, rgba(120, 130, 140, 0.32) 38%, rgba(40, 70, 95, 0.45) 70%, rgba(15, 30, 45, 0.55) 100%)",
          backgroundSize: "cover, cover",
          backgroundPosition: "center, center",
          backgroundRepeat: "no-repeat, no-repeat",
          opacity: 0.55,
          mixBlendMode: "soft-light",
        }}
      />

      {/* Layer 3: darkening vignette so content stays readable. */}
      <div
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(6,8,10,0.40) 0%, rgba(6,8,10,0.60) 60%, rgba(6,8,10,0.80) 100%)",
        }}
      />

      <div className="relative z-10">
        <TopNav />

        {/* ---------------------------------------------------------- */}
        {/* Hero                                                       */}
        {/* ---------------------------------------------------------- */}
        <section className="flex min-h-screen items-center px-6 pb-24 pt-40 sm:px-12 sm:pb-32 sm:pt-44 md:px-20 lg:px-28">
          <div className="flex w-full max-w-5xl flex-col gap-7 sm:gap-9">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-300/80 sm:text-[12px]">
              The Founders&apos; Hike
              <span className="mx-2 text-neutral-500">·</span>
              Torrey Pines
            </p>
            <h1 className="hero-text text-[44px] italic leading-[0.98] text-neutral-50 drop-shadow-[0_2px_30px_rgba(0,0,0,0.55)] sm:text-[80px] md:text-[108px] lg:text-[128px]">
              Hundreds of founders, one hike.
            </h1>
            <p className="font-sans max-w-3xl text-lg leading-[1.55] text-neutral-200 sm:text-xl">
              The biggest Founders&apos; Hike in San Diego, hosted by Founders
              Network and built around UCSD students who are already
              building things or feel like they probably will. The trail
              does the work that classrooms do not.
            </p>
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
              <a
                href="#signup"
                className="glass-cta-light rounded-full px-6 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900"
              >
                Save your spot
              </a>
              <a
                href="#details"
                className="glass-pill rounded-full px-5 py-2.5 text-center text-xs font-medium uppercase tracking-[0.22em] text-neutral-100 transition hover:text-white"
              >
                See the details
              </a>
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
              What you are walking into.
            </h2>
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
        {/* Signup form                                                */}
        {/* ---------------------------------------------------------- */}
        <section
          id="signup"
          className="border-t border-white/[0.06] bg-[#06080a]/55 px-6 py-24 backdrop-blur-sm sm:px-12 sm:py-32 md:px-20 lg:px-28"
        >
          <div className="w-full max-w-3xl">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-300/80 sm:text-[12px]">
              Sign up
            </p>
            <h2 className="hero-text mt-6 text-4xl italic leading-[1.05] text-neutral-50 sm:text-5xl md:text-6xl">
              Save your spot on the trail.
            </h2>
            <p className="font-sans mt-5 max-w-2xl text-base leading-relaxed text-neutral-300 sm:text-lg">
              Three fields, no friction. We will email you the meeting point
              and the exact date the moment they are set.
            </p>

            {status === "success" ? (
              <div className="glass-card mt-10 flex flex-col gap-3 p-6 sm:p-8">
                <p className="font-sans text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-300/85">
                  You&apos;re in
                </p>
                <h3 className="hero-text text-2xl italic text-neutral-50 sm:text-3xl">
                  See you at Torrey Pines.
                </h3>
                <p className="text-sm leading-relaxed text-neutral-300 sm:text-[15px]">
                  Look out for an email from the chapter once the date
                  locks in. Bring water, decent shoes, and one project
                  worth talking about on the walk.
                </p>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                className="mt-10 flex flex-col gap-5"
                noValidate
              >
                <label className="flex flex-col gap-2">
                  <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-300/85">
                    Name <span className="ml-1 text-neutral-500">· required</span>
                  </span>
                  <input
                    type="text"
                    autoComplete="name"
                    required
                    className="glass-input"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                  />
                </label>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-300/85">
                      Email{" "}
                      <span className="ml-1 text-neutral-500">· required</span>
                    </span>
                    <input
                      type="email"
                      autoComplete="email"
                      required
                      className="glass-input"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-300/85">
                      Phone{" "}
                      <span className="ml-1 text-neutral-500">· required</span>
                    </span>
                    <input
                      type="tel"
                      autoComplete="tel"
                      required
                      placeholder="(555) 123-4567"
                      className="glass-input"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                    />
                  </label>
                </div>

                {errorMsg ? (
                  <div className="rounded-xl border border-red-400/30 bg-red-400/10 px-5 py-3 text-sm text-red-200">
                    {errorMsg}
                  </div>
                ) : null}

                <div className="mt-2 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
                  <button
                    type="submit"
                    disabled={!valid || status === "submitting"}
                    className="glass-cta-light rounded-full px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {status === "submitting"
                      ? "Saving…"
                      : "Save my spot"}
                  </button>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-400">
                    UCSD students get priority
                  </p>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Closing                                                    */}
        {/* ---------------------------------------------------------- */}
        <section className="border-t border-white/[0.06] bg-[#06080a]/55 px-6 py-24 backdrop-blur-sm sm:px-12 sm:py-28 md:px-20 lg:px-28">
          <div className="w-full max-w-5xl">
            <h2 className="hero-text text-4xl italic leading-[1.05] text-neutral-50 sm:text-5xl md:text-6xl">
              Bring someone who builds.
            </h2>
            <p className="font-sans mt-6 max-w-2xl text-base leading-relaxed text-neutral-300 sm:text-lg">
              The hike is open to UCSD students first, and to the rest of
              the San Diego founder community as space allows. Forward this
              page to anyone in your room who would belong on the trail.
            </p>
            <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
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
