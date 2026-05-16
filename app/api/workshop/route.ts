/**
 * POST /api/workshop — Claude workshop signup endpoint.
 *
 * Mirrors /api/hike: validates the payload, logs server-side,
 * inserts into the Supabase `workshop_signups` table via PostgREST
 * when SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set, optionally
 * pings DISCORD_WEBHOOK_URL. Fails open when env vars are missing.
 *
 * Supabase schema (already provisioned via Management API):
 *
 *   CREATE TABLE workshop_signups (
 *     id BIGSERIAL PRIMARY KEY,
 *     name  TEXT NOT NULL,
 *     email TEXT NOT NULL,
 *     phone TEXT NOT NULL,
 *     created_at TIMESTAMPTZ DEFAULT NOW()
 *   );
 *   CREATE UNIQUE INDEX workshop_signups_email_unique
 *     ON workshop_signups (lower(email));
 */

import { NextResponse } from "next/server";

const REQUIRED_FIELDS = ["name", "email", "phone"] as const;

interface WorkshopPayload {
  name: string;
  email: string;
  phone: string;
}

export async function POST(request: Request) {
  let body: Partial<WorkshopPayload>;
  try {
    body = (await request.json()) as Partial<WorkshopPayload>;
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

  console.log("[workshop] signup", {
    timestamp: new Date().toISOString(),
    ...cleaned,
  });

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const resp = await fetch(
        `${supabaseUrl.replace(/\/$/, "")}/rest/v1/workshop_signups`,
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
        console.error(
          "[workshop] Supabase insert failed",
          resp.status,
          errText,
        );

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
      console.error("[workshop] Supabase fetch error", err);
      return NextResponse.json(
        { message: "Storage error. Please try again." },
        { status: 500 },
      );
    }
  } else {
    console.warn(
      "[workshop] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set; signup logged only.",
    );
  }

  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (webhook) {
    fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content:
          `**Claude workshop signup** — ${cleaned.name}\n` +
          `Email: ${cleaned.email}\n` +
          `Phone: ${cleaned.phone}`,
      }),
    }).catch((err) => console.error("[workshop] Discord webhook failed", err));
  }

  return NextResponse.json({ ok: true });
}

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

function isPhone(s: string): boolean {
  const digits = s.replace(/[^\d]/g, "");
  return digits.length >= 7 && digits.length <= 15;
}
