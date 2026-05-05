"use client";

/**
 * The full hero composition: the WebGL fluid-orb canvas + the temporary
 * palette preview slider. Owns the palette state so the slider can drive
 * the shader uniforms imperatively (no React re-renders per drag tick).
 *
 * When we ditch the picker, this whole component collapses back to
 * `<FluidOrb paletteUniforms={...}>` with a fixed scheme.
 */

import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { type PaletteUniforms } from "./fluid-orb";
import { OrbBackground } from "./orb-background";
import { PaletteSlider } from "./palette-slider";
import { COLOR_SCHEMES, hexToLinearRGB } from "../lib/color-schemes";

const MAX = COLOR_SCHEMES.length - 1;

type LinearScheme = {
  c0: THREE.Vector3;
  c1: THREE.Vector3;
  c2: THREE.Vector3;
  c3: THREE.Vector3;
  accent: THREE.Vector3;
};

/** Pre-compute linear-space Vector3s for every scheme once. */
function buildLinearSchemes(): LinearScheme[] {
  return COLOR_SCHEMES.map((s) => ({
    c0: new THREE.Vector3(...hexToLinearRGB(s.c0)),
    c1: new THREE.Vector3(...hexToLinearRGB(s.c1)),
    c2: new THREE.Vector3(...hexToLinearRGB(s.c2)),
    c3: new THREE.Vector3(...hexToLinearRGB(s.c3)),
    accent: new THREE.Vector3(...hexToLinearRGB(s.accent)),
  }));
}

function applyBlend(
  uniforms: PaletteUniforms,
  schemes: LinearScheme[],
  t: number,
) {
  const i = Math.max(0, Math.min(MAX, Math.floor(t)));
  const j = Math.min(MAX, i + 1);
  const f = Math.max(0, Math.min(1, t - i));
  const a = schemes[i];
  const b = schemes[j];

  uniforms.uColor0.value.lerpVectors(a.c0, b.c0, f);
  uniforms.uColor1.value.lerpVectors(a.c1, b.c1, f);
  uniforms.uColor2.value.lerpVectors(a.c2, b.c2, f);
  uniforms.uColor3.value.lerpVectors(a.c3, b.c3, f);
  uniforms.uAccent.value.lerpVectors(a.accent, b.accent, f);
}

export function FluidOrbHero() {
  // Pre-compute linear vectors once. (useRef so it survives re-renders.)
  const linearSchemesRef = useRef<LinearScheme[] | null>(null);
  if (linearSchemesRef.current === null) {
    linearSchemesRef.current = buildLinearSchemes();
  }

  // The palette uniforms are also memoised once and are mutated
  // imperatively when the slider changes — never re-allocated.
  const paletteUniforms = useMemo<PaletteUniforms>(() => {
    const uniforms: PaletteUniforms = {
      uColor0: { value: new THREE.Vector3() },
      uColor1: { value: new THREE.Vector3() },
      uColor2: { value: new THREE.Vector3() },
      uColor3: { value: new THREE.Vector3() },
      uAccent: { value: new THREE.Vector3() },
    };
    // Initialise to scheme 0.
    if (linearSchemesRef.current) {
      applyBlend(uniforms, linearSchemesRef.current, 0);
    }
    return uniforms;
  }, []);

  const [sliderT, setSliderT] = useState(0);

  const handleChange = (next: number) => {
    setSliderT(next);
    if (linearSchemesRef.current) {
      applyBlend(paletteUniforms, linearSchemesRef.current, next);
    }
  };

  return (
    <>
      <OrbBackground paletteUniforms={paletteUniforms} />
      <PaletteSlider value={sliderT} onChange={handleChange} />
    </>
  );
}
