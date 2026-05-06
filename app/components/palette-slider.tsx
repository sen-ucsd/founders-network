"use client";

/**
 * Temporary palette preview tool.
 *
 * Drag the slider to morph the hero shader through the curated
 * COLOR_SCHEMES list. The slider value is fractional (e.g. 2.4 means
 * "Forest Verdigris" 60% blended into "Ember" 40%) and the underlying
 * uniform is a linear interpolation between the two adjacent schemes,
 * so the transition feels fluid.
 *
 * The "✕" button hides the panel for the rest of the session.
 *
 * To remove the picker entirely later: delete this file, drop the
 * <PaletteSlider> from FluidOrbHero, and inline a fixed scheme into
 * the palette uniforms in fluid-orb-hero.tsx.
 */

import { useEffect, useState } from "react";
import { COLOR_SCHEMES, blendHex } from "../lib/color-schemes";

interface Props {
  value: number;
  onChange: (next: number) => void;
}

const MAX = COLOR_SCHEMES.length - 1;

/**
 * Build a paste-ready snapshot of the current slider state: the raw
 * slider position, the two schemes being blended (or just the one
 * scheme if we're sitting on an integer), and the resolved sRGB hex
 * values for the five palette stops after the linear-space blend.
 */
function buildSnapshot(value: number): string {
  const i = Math.max(0, Math.min(MAX, Math.floor(value)));
  const j = Math.min(MAX, i + 1);
  const f = Math.max(0, Math.min(1, value - i));
  const a = COLOR_SCHEMES[i];
  const b = COLOR_SCHEMES[j];

  const onScheme = f < 0.005 || f > 0.995;
  const headerLine = onScheme
    ? `Scheme: ${(f < 0.5 ? a : b).name}`
    : `Blend: ${a.name} → ${b.name} @ ${Math.round(f * 100)}%`;

  return [
    `[fn-palette]`,
    `slider=${value.toFixed(3)}`,
    headerLine,
    `c0=${blendHex(a.c0, b.c0, f)}`,
    `c1=${blendHex(a.c1, b.c1, f)}`,
    `c2=${blendHex(a.c2, b.c2, f)}`,
    `c3=${blendHex(a.c3, b.c3, f)}`,
    `accent=${blendHex(a.accent, b.accent, f)}`,
  ].join("\n");
}

export function PaletteSlider({ value, onChange }: Props) {
  const [visible, setVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  // Persist dismissal across reloads so the picker doesn't fight you
  // while you're showing other people the page.
  useEffect(() => {
    const stored = window.localStorage.getItem("fn:palette-slider-visible");
    if (stored === "false") setVisible(false);
  }, []);

  // Persist the slider position too so refreshes don't lose your picks.
  useEffect(() => {
    const stored = window.localStorage.getItem("fn:palette-slider-value");
    if (stored !== null) {
      const n = parseFloat(stored);
      if (Number.isFinite(n)) onChange(n);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildSnapshot(value));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard blocked — silently fail */
    }
  };

  const handleSliderChange = (next: number) => {
    onChange(next);
    window.localStorage.setItem("fn:palette-slider-value", next.toString());
  };

  const i = Math.floor(value);
  const f = value - i;
  const aName = COLOR_SCHEMES[i]?.name ?? "—";
  const bName = COLOR_SCHEMES[Math.min(i + 1, MAX)]?.name ?? aName;
  const dominantName = f < 0.5 ? aName : bName;
  const dominantMood =
    f < 0.5
      ? COLOR_SCHEMES[i]?.mood
      : COLOR_SCHEMES[Math.min(i + 1, MAX)]?.mood;

  return (
    <div
      className="glass-pill fixed bottom-5 right-5 z-50 flex w-[min(420px,calc(100vw-40px))] flex-col gap-2 px-5 py-4 sm:bottom-8 sm:right-8"
      style={{ borderRadius: 18 }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-300">
            palette preview
          </span>
          <span className="mt-1 text-[15px] font-semibold text-neutral-50">
            {dominantName}
          </span>
          {dominantMood ? (
            <span className="mt-0.5 text-[11px] italic text-neutral-300/80">
              {dominantMood}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-100 transition hover:border-white/30 hover:bg-white/10"
          >
            {copied ? "copied" : "copy"}
          </button>
          <button
            type="button"
            aria-label="Hide palette preview"
            onClick={() => {
              setVisible(false);
              window.localStorage.setItem(
                "fn:palette-slider-visible",
                "false",
              );
            }}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/5 text-neutral-200 transition hover:border-white/30 hover:bg-white/10"
          >
            ✕
          </button>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={MAX}
        step={0.01}
        value={value}
        onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
        className="palette-range w-full"
        aria-label="Palette scheme"
      />

      <div className="flex justify-between text-[9px] uppercase tracking-[0.22em] text-neutral-400">
        <span>{COLOR_SCHEMES[0].name}</span>
        <span>{COLOR_SCHEMES[MAX].name}</span>
      </div>
    </div>
  );
}
