"use client";

/**
 * /workshops/claude — landing + signup for the Claude workshop.
 *
 * No location photo (this isn't a place); the hero leans on
 * typography. Italic emphasis on "Claude" gives the headline a
 * visual hook that distinguishes the page from the other event
 * landings without introducing new visual machinery.
 *
 * Background is the static gradient + grain stack (same as /apply
 * and the non-hero sections of /founders-hike) so the page loads on
 * anything with a browser.
 *
 * Submissions POST to /api/workshop → Supabase `workshop_signups`.
 *
 * Voice rules: no em dashes, no "not X but Y", flowing prose, max
 * one sentence under five words ("Build with Claude." reserved).
 */

import { useState } from "react";
import Link from "next/link";

import { TopNav } from "../../components/top-nav";

interface AgendaItem {
  label: string;
  body: string;
}

const AGENDA: AgendaItem[] = [
  {
    label: "Claude, the model",
    body: "Prompting, tool use, vision, and what the marketing page leaves out.",
  },
  {
    label: "Claude Code",
    body: "The terminal agent that ships while you eat lunch. Setup, hooks, MCP.",
  },
  {
    label: "Real workflows",
    body: "How the team uses Claude day-to-day, with live examples from shipping projects.",
  },
  {
    label: "Bring a project",
    body: "Open laptops, real work. You leave with something of yours moved forward.",
  },
];

interface FormState {
  name: string;
  email: string;
  phone: string;
}

const EMPTY_FORM: FormState = { name: "", email: "", phone: "" };

type Status = "idle" | "submitting" | "success" | "error";

export default function ClaudeWorkshopPage() {
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
      const resp = await fetch("/api/workshop", {
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
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 82% 60% at 20% 18%, rgba(82, 96, 108, 0.36) 0%, transparent 60%), radial-gradient(ellipse 82% 60% at 80% 84%, rgba(44, 52, 60, 0.30) 0%, transparent 60%), radial-gradient(ellipse at 50% 50%, #13171a 0%, #08090c 60%, #050608 100%)",
          }}
        />
        <div className="grain-coarse" />
        <div className="grain" />
      </div>

      <div className="relative z-10">
        <TopNav />

        {/* ---------------------------------------------------------- */}
        {/* Hero                                                       */}
        {/* ---------------------------------------------------------- */}
        <section className="flex min-h-screen items-center px-6 pb-20 pt-36 sm:px-12 sm:pb-28 sm:pt-44 md:px-20 lg:px-28">
          <div className="flex w-full max-w-5xl flex-col gap-6 sm:gap-8">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-300/80 sm:text-[12px]">
              Workshop
              <span className="mx-2 text-neutral-500">·</span>
              Claude &amp; Claude Code
            </p>
            <h1 className="hero-text text-[52px] leading-[0.96] text-neutral-50 drop-shadow-[0_2px_30px_rgba(0,0,0,0.55)] sm:text-[88px] md:text-[120px] lg:text-[140px]">
              Build with <span className="italic">Claude.</span>
            </h1>
            <p className="font-sans max-w-2xl text-lg leading-[1.55] text-neutral-200 sm:text-xl">
              Hands-on with the model and the terminal agent. You move a real
              project forward and see how the team is shipping with Claude.
            </p>
            <div className="flex flex-col items-stretch gap-3 pt-2 sm:flex-row sm:items-center sm:gap-4">
              <a
                href="#signup"
                className="glass-cta-light rounded-full px-6 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900"
              >
                Save your seat
              </a>
              <a
                href="#agenda"
                className="glass-pill rounded-full px-5 py-2.5 text-center text-xs font-medium uppercase tracking-[0.22em] text-neutral-100 transition hover:text-white"
              >
                See the agenda
              </a>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Agenda                                                     */}
        {/* ---------------------------------------------------------- */}
        <section
          id="agenda"
          className="relative bg-[#06080a]/65 px-6 py-14 sm:px-12 sm:py-20 md:px-20 lg:px-28"
        >
          <div className="mx-auto w-full max-w-5xl">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-300/80 sm:text-[12px]">
              The agenda
            </p>
            <h2 className="hero-text mt-5 text-4xl italic leading-[1.05] text-neutral-50 sm:text-5xl md:text-6xl">
              What we&apos;re working through.
            </h2>
            <p className="font-sans mt-4 max-w-xl text-base leading-relaxed text-neutral-300 sm:text-lg">
              Four blocks, weighted toward hands-on work.
            </p>
            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              {AGENDA.map((item) => (
                <div
                  key={item.label}
                  className="glass-pill flex items-start gap-4 px-5 py-4 sm:px-6 sm:py-5"
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
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Signup form                                                */}
        {/* ---------------------------------------------------------- */}
        <section
          id="signup"
          className="relative bg-[#06080a]/65 px-6 py-14 sm:px-12 sm:py-20 md:px-20 lg:px-28"
        >
          <div className="mx-auto w-full max-w-3xl">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-300/80 sm:text-[12px]">
              Sign up
            </p>
            <h2 className="hero-text mt-5 text-4xl italic leading-[1.05] text-neutral-50 sm:text-5xl md:text-6xl">
              Save your seat in the room.
            </h2>
            <p className="font-sans mt-4 max-w-xl text-base leading-relaxed text-neutral-300 sm:text-lg">
              Three fields and we&apos;ll email the venue and date the moment
              they lock in.
            </p>

            {status === "success" ? (
              <div className="glass-card mt-8 flex flex-col gap-3 p-6 sm:p-8">
                <p className="font-sans text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-300/85">
                  You&apos;re in
                </p>
                <h3 className="hero-text text-2xl italic text-neutral-50 sm:text-3xl">
                  See you in the room.
                </h3>
                <p className="text-sm leading-relaxed text-neutral-300 sm:text-[15px]">
                  Watch for an email once the date and venue are set. Bring
                  a laptop and a project that needs a push.
                </p>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                className="mt-8 flex flex-col gap-5"
                noValidate
              >
                <label className="flex flex-col gap-2">
                  <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-300/85">
                    Name{" "}
                    <span className="ml-1 text-neutral-500">· required</span>
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

                <div className="mt-1 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
                  <button
                    type="submit"
                    disabled={!valid || status === "submitting"}
                    className="glass-cta-light rounded-full px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {status === "submitting" ? "Saving…" : "Save my seat"}
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
        <section className="relative bg-[#06080a]/65 px-6 py-14 sm:px-12 sm:py-20 md:px-20 lg:px-28">
          <div className="mx-auto w-full max-w-5xl">
            <h2 className="hero-text text-4xl italic leading-[1.05] text-neutral-50 sm:text-5xl md:text-6xl">
              Forward this to a builder.
            </h2>
            <p className="font-sans mt-5 max-w-xl text-base leading-relaxed text-neutral-300 sm:text-lg">
              Open to UCSD students first, then the surrounding founder
              community as space allows.
            </p>
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
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
