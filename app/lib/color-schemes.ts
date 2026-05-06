/**
 * sRGB ↔ linear conversion helpers for the hero shader's palette
 * uniforms. Three.js renders in linear space and encodes to sRGB on
 * output, so any colour we want to look "the way it does in CSS" needs
 * to go in linearised.
 *
 * (The full slider/scheme machinery used to live here. After locking
 * in a final palette in fluid-orb-hero.tsx, only the hex → linear
 * helper is still needed.)
 */

export function hexToLinearRGB(hex: string): [number, number, number] {
  const v = parseInt(hex.replace("#", ""), 16);
  const sr = ((v >> 16) & 0xff) / 255;
  const sg = ((v >> 8) & 0xff) / 255;
  const sb = (v & 0xff) / 255;
  return [srgbToLinear(sr), srgbToLinear(sg), srgbToLinear(sb)];
}

function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
