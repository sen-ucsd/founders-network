"use client";

/**
 * Builds the locked palette uniforms once and hands them to the
 * canvas. Was previously the home of the temporary palette-preview
 * slider; the slider chose this blend (Bone → Glacier @ 33%) and is
 * now retired.
 */

import { useMemo } from "react";
import * as THREE from "three";

import { type PaletteUniforms } from "./fluid-orb";
import { OrbBackground } from "./orb-background";
import { hexToLinearRGB } from "../lib/color-schemes";

const PALETTE = {
  c0: "#080907",
  c1: "#1f2121",
  c2: "#6d7677",
  c3: "#e0ddce",
  accent: "#252220",
};

function vec3FromHex(hex: string): THREE.Vector3 {
  return new THREE.Vector3(...hexToLinearRGB(hex));
}

export function FluidOrbHero() {
  const paletteUniforms = useMemo<PaletteUniforms>(
    () => ({
      uColor0: { value: vec3FromHex(PALETTE.c0) },
      uColor1: { value: vec3FromHex(PALETTE.c1) },
      uColor2: { value: vec3FromHex(PALETTE.c2) },
      uColor3: { value: vec3FromHex(PALETTE.c3) },
      uAccent: { value: vec3FromHex(PALETTE.accent) },
    }),
    [],
  );

  return <OrbBackground paletteUniforms={paletteUniforms} />;
}
