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
import { COLOR_SCHEMES } from "../lib/color-schemes";

interface Props {
  value: number;
  onChange: (next: number) => void;
}

const MAX = COLOR_SCHEMES.length - 1;

export function PaletteSlider({ value, onChange }: Props) {
  const [visible, setVisible] = useState(true);

  // Persist dismissal across reloads so the picker doesn't fight you
  // while you're showing other people the page.
  useEffect(() => {
    const stored = window.localStorage.getItem("fn:palette-slider-visible");
    if (stored === "false") setVisible(false);
  }, []);

  if (!visible) return null;

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

      <input
        type="range"
        min={0}
        max={MAX}
        step={0.01}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
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
