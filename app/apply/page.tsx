"use client";

/**
 * /apply — chapter application form. Mirrors SEN's /apply layout and
 * voice almost verbatim. The form posts to /api/apply, which validates
 * server-side and optionally forwards to a Discord webhook (set the
 * DISCORD_WEBHOOK_URL env var on Vercel to enable that).
 *
 * No DB integration yet — submissions are logged on the server until
 * we wire Supabase or similar. The form UX is complete regardless.
 */

import { useMemo, useState } from "react";
import Link from "next/link";

import { TopNav } from "../components/top-nav";

const YEARS = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate", "Other"];
const ESSAY_MIN = 60;

interface FormState {
  name: string;
  email: string;
  university: string;
  country: string;
  year: string;
  portfolio: string;
  whyYou: string;
  builtShipped: string;
  anythingElse: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  university: "",
  country: "",
  year: "",
  portfolio: "",
  whyYou: "",
  builtShipped: "",
  anythingElse: "",
};

type Status = "idle" | "submitting" | "success" | "error";

export default function ApplyPage() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const validations = useMemo(() => validateForm(form), [form]);
  const canSubmit = validations.ok && status !== "submitting";

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("submitting");
    setErrorMsg(null);

    try {
      const resp = await fetch("/api/apply", {
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

  if (status === "success") {
    return <SuccessView name={form.name} />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0a08] text-neutral-200">
      <BackgroundLayers />

      <div className="relative z-10">
        <TopNav />

        <div className="mx-auto max-w-3xl px-5 pt-32 pb-32 sm:px-8 sm:pt-40 sm:pb-40">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-300 transition hover:text-white"
          >
            ← Back to the network
          </Link>

          <header className="mt-10 sm:mt-14">
            <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-neutral-300/85">
              Join Founders Network
            </p>
            <h1 className="hero-text mt-4 text-5xl italic leading-[1.02] text-neutral-50 sm:text-6xl md:text-7xl">
              The application.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-neutral-300 sm:text-lg">
              Short by design. Real answers matter more than long ones.
              Reviewed weekly. We reply within seven days.
            </p>
          </header>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 sm:mt-20">
            <section className="glass-card flex flex-col gap-4 p-6 sm:p-7">
              <h2 className="text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-300/85">
                Who we&apos;re looking for
              </h2>
              <ul className="flex flex-col gap-3 text-sm leading-relaxed text-neutral-200 sm:text-[15px]">
                <li>Students already building things at UCSD.</li>
                <li>
                  Curators who can convene other builders, not just attend
                  events.
                </li>
                <li>
                  People who would have started this without waiting for
                  permission.
                </li>
                <li>
                  Anyone serious about turning ambition into shipped work.
                </li>
              </ul>
            </section>

            <section className="glass-card flex flex-col gap-4 p-6 sm:p-7">
              <h2 className="text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-300/85">
                Timeline
              </h2>
              <p className="text-sm leading-relaxed text-neutral-200 sm:text-[15px]">
                Reply within seven days. If invited, two short conversations
                with the team, then you&apos;re in.
              </p>
              <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-400">
                Reviewed Weekly · Reply within Seven Days
              </p>
            </section>
          </div>

          <form onSubmit={onSubmit} className="mt-14 flex flex-col gap-10">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full Name" required>
                <input
                  type="text"
                  className="glass-input"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  required
                  autoComplete="name"
                />
              </Field>

              <Field label="Email" required>
                <input
                  type="email"
                  className="glass-input"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  required
                  autoComplete="email"
                />
              </Field>

              <Field label="University" required>
                <input
                  type="text"
                  className="glass-input"
                  value={form.university}
                  onChange={(e) => update("university", e.target.value)}
                  required
                  autoComplete="organization"
                />
              </Field>

              <Field label="Country">
                <input
                  type="text"
                  className="glass-input"
                  value={form.country}
                  onChange={(e) => update("country", e.target.value)}
                  autoComplete="country-name"
                />
              </Field>

              <Field label="Year in School" required>
                <select
                  className="glass-input glass-select"
                  value={form.year}
                  onChange={(e) => update("year", e.target.value)}
                  required
                >
                  <option value="">Select one</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Portfolio or LinkedIn URL">
                <input
                  type="url"
                  className="glass-input"
                  value={form.portfolio}
                  onChange={(e) => update("portfolio", e.target.value)}
                  placeholder="https://…"
                  autoComplete="url"
                />
              </Field>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-300/85">
                The actual application
              </p>
              <p className="text-[13px] text-neutral-400">
                Two essays. Concrete answers beat ambitious ones.
              </p>
            </div>

            <div className="grid gap-6">
              <EssayField
                label="Why do you want to be part of Founders Network?"
                required
                value={form.whyYou}
                onChange={(v) => update("whyYou", v)}
                placeholder="2 to 4 sentences. Concrete reasons beat ambitious ones."
                minChars={ESSAY_MIN}
              />

              <EssayField
                label="What have you built or shipped?"
                required
                value={form.builtShipped}
                onChange={(v) => update("builtShipped", v)}
                placeholder="A startup, a side project, a club, a research output, a piece of writing. Links welcome."
                minChars={ESSAY_MIN}
              />

              <EssayField
                label="Anything else we should know?"
                value={form.anythingElse}
                onChange={(v) => update("anythingElse", v)}
                placeholder="Optional. Skip if there isn't anything."
              />
            </div>

            {errorMsg ? (
              <div className="rounded-xl border border-red-400/30 bg-red-400/10 px-5 py-3 text-sm text-red-200">
                {errorMsg}
              </div>
            ) : null}

            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
              <button
                type="submit"
                disabled={!canSubmit}
                className="glass-cta-light rounded-full px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === "submitting"
                  ? "Submitting…"
                  : "Submit Application"}
              </button>
              {!validations.ok ? (
                <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-400">
                  {validations.firstHint}
                </p>
              ) : (
                <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-400">
                  Reviewed weekly · Reply within seven days
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                     */
/* ------------------------------------------------------------------ */

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-300/85">
        {label}
        {required ? (
          <span className="ml-1 text-neutral-500"> · required</span>
        ) : null}
      </span>
      {children}
    </label>
  );
}

function EssayField({
  label,
  required,
  value,
  onChange,
  placeholder,
  minChars,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  minChars?: number;
}) {
  const trimmed = value.trim().length;
  return (
    <Field label={label} required={required}>
      <textarea
        className="glass-input min-h-[140px] resize-y leading-relaxed sm:min-h-[160px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={5}
      />
      {minChars ? (
        <span className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
          {trimmed} / {minChars} minimum
        </span>
      ) : null}
    </Field>
  );
}

function BackgroundLayers() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 25% 15%, rgba(70, 70, 60, 0.28) 0%, transparent 55%), radial-gradient(ellipse 80% 60% at 75% 80%, rgba(40, 40, 30, 0.20) 0%, transparent 55%), radial-gradient(ellipse at 50% 50%, #14140f 0%, #0a0a08 60%, #050504 100%)",
        }}
      />
      <div className="grain-coarse" />
      <div className="grain" />
    </div>
  );
}

function SuccessView({ name }: { name: string }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0a08] text-neutral-200">
      <BackgroundLayers />
      <div className="relative z-10">
        <TopNav />
        <div className="mx-auto flex max-w-2xl flex-col gap-8 px-5 pt-40 pb-32 sm:px-8 sm:pt-48">
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-neutral-300/85">
            Application received
          </p>
          <h1 className="hero-text text-5xl italic leading-[1.02] text-neutral-50 sm:text-6xl md:text-7xl">
            Thanks{name ? `, ${name.split(" ")[0]}` : ""}.
          </h1>
          <p className="text-base leading-relaxed text-neutral-300 sm:text-lg">
            We read every application by hand. Expect a reply within seven
            days. If we move forward, you&apos;ll hear from one of the team
            for two short conversations.
          </p>
          <Link
            href="/"
            className="mt-2 self-start text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-300 transition hover:text-white"
          >
            ← Back to the network
          </Link>
        </div>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Validation                                                         */
/* ------------------------------------------------------------------ */

function validateForm(f: FormState): { ok: boolean; firstHint: string } {
  if (!f.name.trim()) return { ok: false, firstHint: "Add your name" };
  if (!isEmail(f.email))
    return { ok: false, firstHint: "Add a valid email" };
  if (!f.university.trim())
    return { ok: false, firstHint: "Add your university" };
  if (!f.year) return { ok: false, firstHint: "Select your year" };
  if (f.whyYou.trim().length < ESSAY_MIN)
    return {
      ok: false,
      firstHint: `Why-you essay needs ${ESSAY_MIN}+ chars`,
    };
  if (f.builtShipped.trim().length < ESSAY_MIN)
    return {
      ok: false,
      firstHint: `Built/shipped essay needs ${ESSAY_MIN}+ chars`,
    };
  return { ok: true, firstHint: "" };
}

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

// Note: this is a "use client" file so we can't export `metadata`
// directly. The apply page's title falls back to the root layout's
// template. To give /apply a unique title, split this into a server-
// component shell that imports the client form. Deferring.
