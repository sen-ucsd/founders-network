/**
 * Curated palettes for the hero shader.
 *
 * Each scheme is four stops (c0 → c3) plus a soft accent used by the
 * background's lower-left bloom. The shader's `iridescent()` function
 * cycles through the four stops continuously, so:
 *   - c0 should be the darkest (near-black)
 *   - c1 a dim mid (the "valley" colour between bright bands)
 *   - c2 a warm/saturated mid (the "band" colour)
 *   - c3 the brightest accent (gold / cream / highlight)
 *
 * This file is plain data; it has no THREE/React deps so it can be
 * imported from anywhere. Hex values are sRGB.
 */

export interface ColorScheme {
  name: string;
  /** A short tagline describing the mood — surfaced in the picker UI. */
  mood: string;
  c0: string;
  c1: string;
  c2: string;
  c3: string;
  accent: string;
}

export const COLOR_SCHEMES: ColorScheme[] = [
  {
    name: "Bronze Dusk",
    mood: "the original monopo iridescence",
    c0: "#050907",
    c1: "#262815",
    c2: "#7d5926",
    c3: "#e0bd4f",
    accent: "#473214",
  },
  {
    name: "Midnight Gold",
    mood: "SEN brass-and-indigo",
    c0: "#050816",
    c1: "#1a1a30",
    c2: "#7c5d22",
    c3: "#d4a843",
    accent: "#3a2a14",
  },
  {
    name: "Forest Verdigris",
    mood: "old library lamp",
    c0: "#040805",
    c1: "#152117",
    c2: "#3a6e5e",
    c3: "#a8d4b5",
    accent: "#1a3026",
  },
  {
    name: "Ember",
    mood: "banked coals at midnight",
    c0: "#0c0504",
    c1: "#3a1410",
    c2: "#9c3a1e",
    c3: "#f0a662",
    accent: "#4a1808",
  },
  {
    name: "Cobalt",
    mood: "deep water under stars",
    c0: "#020514",
    c1: "#0e2150",
    c2: "#3060c0",
    c3: "#a0c8ff",
    accent: "#10204a",
  },
  {
    name: "Aubergine",
    mood: "velvet curtains, low light",
    c0: "#080510",
    c1: "#2a1430",
    c2: "#7c3475",
    c3: "#d8a8d8",
    accent: "#321840",
  },
  {
    name: "Iron",
    mood: "monochrome, all-business",
    c0: "#050505",
    c1: "#1c1c1c",
    c2: "#646464",
    c3: "#c8c8c8",
    accent: "#202020",
  },
  {
    name: "Bone",
    mood: "warm parchment over black",
    c0: "#0a0805",
    c1: "#251f15",
    c2: "#7a6a52",
    c3: "#e8d8b8",
    accent: "#2c2014",
  },
  {
    name: "Glacier",
    mood: "ice at the polar dawn",
    c0: "#050a0c",
    c1: "#0e2632",
    c2: "#4a8aa8",
    c3: "#d0e8f4",
    accent: "#102530",
  },
  {
    name: "Pine Smoke",
    mood: "wet conifers, late autumn",
    c0: "#040706",
    c1: "#152422",
    c2: "#4a7060",
    c3: "#b0c8b8",
    accent: "#152822",
  },
  {
    name: "Magenta Storm",
    mood: "neon at 2am",
    c0: "#0a0410",
    c1: "#280a30",
    c2: "#a02080",
    c3: "#ff90c0",
    accent: "#3a0a30",
  },
  {
    name: "Saffron",
    mood: "spice market evening",
    c0: "#0a0604",
    c1: "#2a1a08",
    c2: "#a86018",
    c3: "#ffc870",
    accent: "#3a200a",
  },
];

/**
 * Convert a sRGB hex string ("#aabbcc") into a 3-tuple of linear-space
 * floats in [0, 1]. Three.js renderers operate in linear space and
 * encode to sRGB on output, so palette uniforms need to be linearised
 * up front or the output gets darkened.
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
