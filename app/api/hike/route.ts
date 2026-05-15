/**
 * POST /api/hike — Founders' Hike signup endpoint.
 *
 * Validates the payload, logs server-side, and (if SUPABASE_URL and
 * SUPABASE_SERVICE_ROLE_KEY are set) inserts a row into the
 * `hike_signups` table via Supabase's PostgREST endpoint. Also posts
 * a formatted notification to Discord if DISCORD_WEBHOOK_URL is set.
 *
 * Required env vars on Vercel:
 *   SUPABASE_URL                  e.g. https://abc.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY     service-role JWT (server-side only,
 *                                 never expose to the client)
 *
 * Optional:
 *   DISCORD_WEBHOOK_URL           channel webhook for live alerts
 *
 * Supabase table schema (run once in the SQL editor):
 *
 *   CREATE TABLE hike_signups (
 *     id BIGSERIAL PRIMARY KEY,
 *     name  TEXT NOT NULL,
 *     email TEXT NOT NULL,
 *     phone TEXT NOT NULL,
 *     created_at TIMESTAMPTZ DEFAULT NOW()
 *   );
 *
 *   -- Optional: prevent duplicates on email
 *   CREATE UNIQUE INDEX hike_signups_email_unique
 *     ON hike_signups (lower(email));
 *
 * Returns:
 *   200 { ok: true }                          — accepted
 *   400 { message: string }                   — validation error
 *   409 { message: string }                   — duplicate email
 *   500 { message: string }                   — storage error
 */

import { NextResponse } from "next/server";

const REQUIRED_FIELDS = ["name", "email", "phone"] as const;

interface HikePayload {
  name: string;
  email: string;
  phone: string;
}

export async function POST(request: Request) {
  let body: Partial<HikePayload>;
  try {
    body = (await request.json()) as Partial<HikePayload>;
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  for (const field of REQUIRED_FIELDS) {
    const v = body[field];
    if (typeof v !== "string" || v.trim() === "") {
      return NextResponse.json(
        { message: `Missing required field: ${field}` },
        { status: 400 },
      );
    }
  }

  if (!isEmail(body.email!)) {
    return NextResponse.json(
      { message: "Invalid email address" },
      { status: 400 },
    );
  }

  if (!isPhone(body.phone!)) {
    return NextResponse.json(
      { message: "Invalid phone number" },
      { status: 400 },
    );
  }

  const cleaned = {
    name: body.name!.trim(),
    email: body.email!.trim().toLowerCase(),
    phone: body.phone!.trim(),
  };

  console.log("[hike] signup", {
    timestamp: new Date().toISOString(),
    ...cleaned,
  });

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const resp = await fetch(
        `${supabaseUrl.replace(/\/$/, "")}/rest/v1/hike_signups`,
        {
          method: "POST",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify(cleaned),
        },
      );

      if (!resp.ok) {
        const errText = await resp.text().catch(() => "");
        console.error("[hike] Supabase insert failed", resp.status, errText);

        // Postgres unique violation code (when the email unique index
        // catches a duplicate signup).
        if (resp.status === 409 || errText.includes("23505")) {
          return NextResponse.json(
            { message: "Looks like you already signed up." },
            { status: 409 },
          );
        }

        return NextResponse.json(
          { message: "Storage error. Please try again." },
          { status: 500 },
        );
      }
    } catch (err) {
      console.error("[hike] Supabase fetch error", err);
      return NextResponse.json(
        { message: "Storage error. Please try again." },
        { status: 500 },
      );
    }
  } else {
    console.warn(
      "[hike] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set; signup logged only.",
    );
  }

  // Non-fatal Discord ping for live visibility.
  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (webhook) {
    fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content:
          `**Founders' Hike signup** — ${cleaned.name}\n` +
          `Email: ${cleaned.email}\n` +
          `Phone: ${cleaned.phone}`,
      }),
    }).catch((err) => console.error("[hike] Discord webhook failed", err));
  }

  return NextResponse.json({ ok: true });
}

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

function isPhone(s: string): boolean {
  // Permissive: 7-15 digits after stripping non-digits. Catches
  // US-style (10 digits with optional country code) plus most
  // international formats without being overly strict on punctuation.
  const digits = s.replace(/[^\d]/g, "");
  return digits.length >= 7 && digits.length <= 15;
}
