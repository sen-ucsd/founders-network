/**
 * POST /api/apply — chapter application submission endpoint.
 *
 * Validates the payload, logs server-side, and (if the
 * DISCORD_WEBHOOK_URL env var is set) posts a formatted summary to a
 * Discord channel so the founding team gets a notification when
 * applications come in. No DB persistence yet; wire Supabase or
 * similar here when ready.
 *
 * Returns:
 *   200 { ok: true }                          — accepted
 *   400 { message: string }                   — validation error
 *   500 { message: string }                   — unexpected
 */

import { NextResponse } from "next/server";

const REQUIRED_FIELDS = [
  "name",
  "email",
  "university",
  "year",
  "whyYou",
  "builtShipped",
] as const;

const ESSAY_MIN = 60;

interface ApplyPayload {
  name: string;
  email: string;
  university: string;
  country?: string;
  year: string;
  portfolio?: string;
  whyYou: string;
  builtShipped: string;
  anythingElse?: string;
}

export async function POST(request: Request) {
  let body: Partial<ApplyPayload>;
  try {
    body = (await request.json()) as Partial<ApplyPayload>;
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

  if (
    body.whyYou!.trim().length < ESSAY_MIN ||
    body.builtShipped!.trim().length < ESSAY_MIN
  ) {
    return NextResponse.json(
      { message: `Essay responses must be at least ${ESSAY_MIN} characters` },
      { status: 400 },
    );
  }

  const cleaned: ApplyPayload = {
    name: body.name!.trim(),
    email: body.email!.trim(),
    university: body.university!.trim(),
    country: body.country?.trim() || undefined,
    year: body.year!.trim(),
    portfolio: body.portfolio?.trim() || undefined,
    whyYou: body.whyYou!.trim(),
    builtShipped: body.builtShipped!.trim(),
    anythingElse: body.anythingElse?.trim() || undefined,
  };

  // Log to Vercel function logs so submissions aren't lost while
  // proper storage is being wired up.
  console.log("[apply]", {
    timestamp: new Date().toISOString(),
    name: cleaned.name,
    email: cleaned.email,
    university: cleaned.university,
    country: cleaned.country,
    year: cleaned.year,
    whyYouLength: cleaned.whyYou.length,
    builtShippedLength: cleaned.builtShipped.length,
  });

  // Optional: post to Discord. Set DISCORD_WEBHOOK_URL in Vercel env
  // vars to a channel webhook (Discord → Server Settings →
  // Integrations → Webhooks → New Webhook → Copy URL).
  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: formatForDiscord(cleaned) }),
      });
    } catch (err) {
      // Non-fatal: surface in logs but still confirm to the user.
      console.error("[apply] Discord webhook failed", err);
    }
  }

  return NextResponse.json({ ok: true });
}

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

function formatForDiscord(p: ApplyPayload): string {
  const lines: string[] = [
    `**New application — ${p.name}**`,
    `Email: ${p.email}`,
    `University: ${p.university}${p.country ? ` (${p.country})` : ""}`,
    `Year: ${p.year}`,
  ];
  if (p.portfolio) lines.push(`Portfolio: ${p.portfolio}`);
  lines.push("", "**Why you?**", truncate(p.whyYou, 800));
  lines.push("", "**Built / shipped:**", truncate(p.builtShipped, 800));
  if (p.anythingElse) {
    lines.push("", "**Anything else:**", truncate(p.anythingElse, 800));
  }
  // Discord caps `content` at 2000 chars. Truncating each section to
  // 800 chars keeps us safely under that limit.
  return lines.join("\n").slice(0, 1990);
}

function truncate(s: string, n: number): string {
  return s.length <= n ? s : s.slice(0, n - 1) + "…";
}
