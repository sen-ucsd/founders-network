# Iridescent banded glass — how the hero effect works

This is the technique used in the hero on `app/components/fluid-orb.tsx`.
Both the background and the sphere share a single `flowColor(p, t)`
function, so the bands flow continuously between them. It's the same
visual signature as the hero on [monopo.vn](https://monopo.vn).

## The trick

Most "liquid orb" shader attempts produce a **flat noise blob** — one
big mass of color drifting around. That's because the mainstream recipe
is:

```glsl
vec3 col = mix(colorA, colorB, fbm(p));
```

Smooth FBM noise mapped to a 2-color gradient → one big blurry blob, no
internal structure. That's what the earlier iterations of this shader
were doing.

What monopo does — and what the current shader does — is to break that
smooth noise into **discrete bands** by feeding a **sine wave** through
the warped position. The sine has crests and troughs; each crest is a
bright band, each trough a dark valley. Then you bend those bands by
warping the sine's input through the FBM noise field. Result: flowing
curved stripes of iridescent color across the whole surface, like oil
floating on glass.

## The 6-step recipe

### 1. Domain-warp the input position

Two passes of FBM produce vector fields `q` and `r` that distort the
coordinate system. This is what makes the bands curve and swirl
instead of running straight.

```glsl
vec2 q = vec2(fbm(p * 0.8 + vec2(0.0, t)),
              fbm(p * 0.8 + vec2(5.2, 1.3 - t)));
vec2 r = vec2(fbm(p + 1.8 * q + vec2(t * 0.5, 9.2)),
              fbm(p + 1.8 * q + vec2(8.3, t * 0.5)));
```

### 2. Project the warped position onto a slanted axis

```glsl
float ax1 = (p.x * 0.55 + p.y * 0.35) + r.x * 1.7 + r.y * 0.6;
```

Critically, the FBM-derived `r` gets added in. **That's what bends the
axis through the noise field** — without it, you just get straight
diagonal stripes.

### 3. Take `sin(axis)` — the band generator

```glsl
float v1 = sin(ax1 * 5.5 + t * 0.45);
```

Frequency controls thickness. Higher = thinner bands. The `* (warped
position + noise)` is what makes the bands look like organic flow.

### 4. Run two band families and combine

A single direction looks too regular. Two crossed directions interfere
into the rich pattern monopo has.

```glsl
float v2    = sin(ax2 * 7.5 + t * 0.30);
float bands = v1 * 0.65 + v2 * 0.40;
```

### 5. Index an iridescent palette by the band value

```glsl
float key = bands * 0.45 + length(r) * 0.28 + p.x * 0.05 + t * 0.06;
vec3  col = iridescent(key);
```

The palette is a 4-stop gradient that wraps continuously: black-green
→ olive → amber → gold and back. Each band's `key` lands in a
different part of the cycle, so adjacent bands pull different colors.
`fract(key)` + reflect handles the wrap cleanly so there's no seam.

### 6. Multiply by a noise mask to carve dim valleys

Without this, everything looks evenly lit — the bands need real dark
valleys between them to read as oil-on-glass:

```glsl
float lift = q.x * 0.5 + 0.5;
col *= 0.35 + 0.85 * smoothstep(0.10, 0.85, lift);
```

## Why the sphere doesn't look like a ring

When the sphere samples its iridescent surface color, **it samples
`flowColor(sphericalUv(N), t)` at the surface NORMAL — not the
reflection vector**.

- The **surface normal** varies smoothly across the sphere, so bands
  wrap continuously around the body.
- The **reflection vector** (`reflect(-V, N)`) concentrates at the rim
  for a viewer-facing sphere — every silhouette pixel reflects in a
  similar direction. Sampling there pulls similar colors all around
  the rim, producing a "ring of light" artifact.

Two more pieces keep the sphere reading as a solid 3D body:

- **Half-Lambert lighting**: `pow(N·L * 0.5 + 0.5, 1.4)`. No hard
  terminator line between the lit and shaded hemispheres; everything
  blends smoothly.
- **Fresnel as brightness multiplier, not a colored addition**:
  `lighting *= 1.0 + fres * uRimBoost`. Brightens the silhouette
  without painting an amber halo on it.

## Tuning knobs

Open `app/components/fluid-orb.tsx`. Inside `flowColor`:

| Parameter | Effect |
|---|---|
| `sin(ax1 * 5.5)` frequency | Lower = thicker bands. Try 3-4 for chunky stripes, 8-10 for fine pinstripes. |
| `r.x * 1.7` warp scale | Higher = more chaotic curves. 0.5 for nearly-straight bands, 3.0 for wild swirls. |
| `iridescent` palette stops `c0..c3` | Edit RGB to change the color cycle. |
| `bands * 0.45` palette key gain | Higher = more color variation per band. Low = flat iridescent effect. |
| `0.35 + 0.85 *` valley contrast | First number = floor brightness (raise to lift dark valleys), second = range. |

For sphere body shading, the uniforms in `MouseSphere`:

| Uniform | Effect |
|---|---|
| `uAmbient` | Floor lighting on the back side. Higher = flatter, lower = more directional. |
| `uRimBoost` | Silhouette brightness. Don't push past ~0.5 or you'll re-introduce a ring. |
| `uSpecPower` / `uSpecStrength` | Sharpness/intensity of the glass-shine highlight. |
| `uDispersion` | Chromatic UV offset for R/B channels. Adds "glass" feel; 0 disables. |

## Cursor-velocity time modulation

In `Scene`'s `useFrame`:

```ts
const cursorSpeed   = Math.hypot(dx, dy) / Math.max(delta, 0.001);
const targetSpeed   = 0.6 + Math.min(cursorSpeed * 0.55, 5.4);
animSpeed.current   = lerp(animSpeed.current, targetSpeed, dt * 5);
sharedTime.current += delta * animSpeed.current;
```

Cursor velocity in normalized device coords/sec maps to an animation
speed multiplier (`0.6×` when still, up to `~6×` when whipping). The
multiplier is smoothed with a one-pole lerp so it eases in and out
rather than snapping. A single `sharedTime` ref drives both the
background and sphere uniforms, so they accelerate together.

## Reference

The original public monopo source is at
[github.com/jsonkcli/monopo.vn](https://github.com/jsonkcli/monopo.vn).
That repo uses three.js + a render-target/cube-map two-pass setup;
the same visual signature is reproducible in a single-pass fragment
shader by warping a sine-band pattern through FBM noise as above.

Performance footprint of the current single-pass version: 6 FBM calls
per fragment (4 octaves of cheap hash-based value noise each),
plus 3 chromatic samples on the sphere. Runs comfortably above 60 fps
on integrated GPUs at 1.5× DPR with antialiasing off.
