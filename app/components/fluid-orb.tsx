"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/* ================================================================== */
/* Shared GLSL                                                        */
/* ================================================================== */

/*
 * NOISE_GLSL — vertex-safe helpers (no uniform refs, so it can be
 * spliced into either vertex or fragment shaders).
 */
const NOISE_GLSL = /* glsl */ `
  float hash21(vec2 p){
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float vnoise(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p){
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++){
      v += a * vnoise(p);
      p  = p * 2.03 + vec2(31.7, 19.3);
      a *= 0.5;
    }
    return v;
  }
`;

/*
 * COLOR_GLSL — references uColor0..3 uniforms, so this is FRAGMENT-ONLY.
 * Splicing this into a vertex shader that doesn't declare those uniforms
 * is a GLSL compile error and silently kills the whole material.
 */
const COLOR_GLSL = /* glsl */ `
  vec3 iridescent(float k){
    k = fract(k);
    if (k > 0.5) k = 1.0 - k;
    k *= 2.0;

    vec3 col = mix(uColor0, uColor1, smoothstep(0.00, 0.40, k));
    col      = mix(col,    uColor2, smoothstep(0.30, 0.70, k));
    col      = mix(col,    uColor3, smoothstep(0.65, 1.00, k));
    return col;
  }

  vec3 flowColor(vec2 p, float t){
    vec2 q = vec2(
      fbm(p * 0.8 + vec2(0.0, t)),
      fbm(p * 0.8 + vec2(5.2, 1.3 - t))
    );
    vec2 r = vec2(
      fbm(p + 1.8 * q + vec2(t * 0.5, 9.2)),
      fbm(p + 1.8 * q + vec2(8.3, t * 0.5))
    );

    float ax1 = (p.x * 0.55 + p.y * 0.35) + r.x * 1.7 + r.y * 0.6;
    float ax2 = (p.x * 0.40 - p.y * 0.65) + r.y * 1.5 + r.x * 0.4;
    float v1  = sin(ax1 * 5.5 + t * 0.45);
    float v2  = sin(ax2 * 7.5 + t * 0.30);

    float bands = v1 * 0.65 + v2 * 0.40;

    float key = bands * 0.45
              + length(r) * 0.28
              + p.x * 0.05
              + t * 0.06;

    vec3 col = iridescent(key);

    float lift = q.x * 0.5 + 0.5;
    col *= 0.35 + 0.85 * smoothstep(0.10, 0.85, lift);

    return col;
  }
`;

/* ================================================================== */
/* Background                                                         */
/* ================================================================== */

const BG_VERTEX = /* glsl */ `
  void main(){
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const BG_FRAGMENT = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec3  uColor0;
  uniform vec3  uColor1;
  uniform vec3  uColor2;
  uniform vec3  uColor3;
  uniform vec3  uAccent;

  ${NOISE_GLSL}
  ${COLOR_GLSL}

  void main(){
    vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);
    p *= 0.95;

    vec3 col = flowColor(p, uTime * 0.22);

    // Soft accent in the lower-left quadrant so the empty side has weight.
    vec2 secCenter = vec2(-1.05, -0.55);
    float secD = length(p - secCenter);
    col += smoothstep(0.85, 0.0, secD) * uAccent * 0.35;

    col *= smoothstep(2.10, 0.60, length(p));

    gl_FragColor = vec4(col, 1.0);
  }
`;

/* ================================================================== */
/* Sphere                                                             */
/* ================================================================== */

const SPHERE_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uDisplace;

  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vObjNormal;

  ${NOISE_GLSL}

  float bump(vec3 p){
    return vnoise(p.xy + p.z * 0.7);
  }

  void main(){
    float t = uTime * 0.28;
    float n = bump(position * 1.4 + vec3(0.0, 0.0, t));
    vec3 pos = position + normal * n * uDisplace;

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vNormal    = normalize(normalMatrix * normal);
    vObjNormal = normalize(normal);

    vec3 viewPos = (viewMatrix * worldPos).xyz;
    vViewDir = normalize(-viewPos);

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const SPHERE_FRAGMENT = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uFresnelPower;
  uniform float uRimBoost;
  uniform float uDispersion;
  uniform float uAmbient;
  uniform float uSpecPower;
  uniform float uSpecStrength;
  uniform vec3  uColor0;
  uniform vec3  uColor1;
  uniform vec3  uColor2;
  uniform vec3  uColor3;

  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vObjNormal;

  ${NOISE_GLSL}
  ${COLOR_GLSL}

  vec2 sphericalUv(vec3 dir){
    float lat = asin(clamp(dir.y, -1.0, 1.0));
    float lon = atan(dir.z, dir.x);
    return vec2(lon * 0.55, lat * 0.85);
  }

  void main(){
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewDir);
    vec3 L = normalize(vec3(-0.30, 0.55, 0.85));

    /*
     * Half-Lambert lighting: smooth, no hard terminator. The back of the
     * sphere blends gradually into the front instead of showing a clear
     * lit/unlit boundary.
     */
    float ndotl = dot(N, L);
    float halfLambert = pow(ndotl * 0.5 + 0.5, 1.4);
    float lighting = uAmbient + (1.0 - uAmbient) * halfLambert;

    // Fresnel as a BRIGHTNESS multiplier only — keeps the silhouette
    // glassy without painting a coloured rim.
    float fres = pow(1.0 - max(dot(N, V), 0.0), uFresnelPower);
    lighting *= 1.0 + fres * uRimBoost;

    // Iridescent surface colour, sampled at the surface NORMAL so it
    // varies smoothly across the sphere (no rim concentration).
    float t = uTime * 0.22;
    vec2 baseUv = sphericalUv(vObjNormal);
    vec2 du = vec2(0.045, 0.020) * uDispersion;
    vec3 envR = flowColor(baseUv + du, t);
    vec3 envG = flowColor(baseUv,      t);
    vec3 envB = flowColor(baseUv - du, t);
    vec3 envCol = vec3(envR.r, envG.g, envB.b);

    vec3 col = envCol * lighting;

    // Glass specular highlight: bright pinpoint where the half-vector
    // aligns with the normal. This is the trademark "glass shine".
    vec3 H = normalize(L + V);
    float spec = pow(max(dot(N, H), 0.0), uSpecPower);
    col += spec * vec3(1.0, 0.95, 0.85) * uSpecStrength;

    // Secondary inner specular from the camera direction — soft sheen
    // that helps the body read as glass rather than matte.
    float innerSpec = pow(max(dot(N, V), 0.0), 6.0);
    col += innerSpec * vec3(0.6, 0.55, 0.45) * 0.06;

    gl_FragColor = vec4(col, 1.0);
  }
`;

/* ================================================================== */
/* Scene: cursor tracking, shared time, sphere spring physics         */
/* ================================================================== */

interface PaletteUniforms {
  uColor0: { value: THREE.Vector3 };
  uColor1: { value: THREE.Vector3 };
  uColor2: { value: THREE.Vector3 };
  uColor3: { value: THREE.Vector3 };
  uAccent: { value: THREE.Vector3 };
}

function Scene({ paletteUniforms }: { paletteUniforms: PaletteUniforms }) {
  const bgMatRef = useRef<THREE.ShaderMaterial>(null);
  const sphereMatRef = useRef<THREE.ShaderMaterial>(null);
  const sphereMeshRef = useRef<THREE.Mesh>(null);

  /* Cursor tracking ------------------------------------------------ */
  const cursor = useRef({ x: 0, y: 0 });
  const lastCursor = useRef({ x: 0, y: 0 });

  /* Shared animation state ----------------------------------------- */
  const sharedTime = useRef(0);
  const animSpeed = useRef(1);
  const target = useRef(new THREE.Vector3());

  /* Uniforms — palette uniforms are shared by reference between bg
   * and sphere so a single update flips both. */
  const bgUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uColor0: paletteUniforms.uColor0,
      uColor1: paletteUniforms.uColor1,
      uColor2: paletteUniforms.uColor2,
      uColor3: paletteUniforms.uColor3,
      uAccent: paletteUniforms.uAccent,
    }),
    [paletteUniforms],
  );

  const sphereUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDisplace: { value: 0.09 },
      uFresnelPower: { value: 2.4 },
      uRimBoost: { value: 0.40 },
      uDispersion: { value: 1.0 },
      uAmbient: { value: 0.78 },
      uSpecPower: { value: 28.0 },
      uSpecStrength: { value: 0.45 },
      uColor0: paletteUniforms.uColor0,
      uColor1: paletteUniforms.uColor1,
      uColor2: paletteUniforms.uColor2,
      uColor3: paletteUniforms.uColor3,
    }),
    [paletteUniforms],
  );

  /* Cursor listener ------------------------------------------------ */
  useEffect(() => {
    const handler = (e: PointerEvent) => {
      cursor.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      cursor.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", handler, { passive: true });
    return () => window.removeEventListener("pointermove", handler);
  }, []);

  /* Per-frame ------------------------------------------------------ */
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);

    /* 1. Cursor velocity → animation speed multiplier */
    const dx = cursor.current.x - lastCursor.current.x;
    const dy = cursor.current.y - lastCursor.current.y;
    const cursorSpeed = Math.hypot(dx, dy) / Math.max(delta, 0.001);
    // Map: still = 0.6× base, fast = up to ~6× base.
    const targetSpeed = 0.6 + Math.min(cursorSpeed * 0.55, 5.4);
    animSpeed.current = THREE.MathUtils.lerp(
      animSpeed.current,
      targetSpeed,
      Math.min(1, dt * 5),
    );

    /* 2. Advance shared time, push to both shaders */
    sharedTime.current += delta * animSpeed.current;
    if (bgMatRef.current) {
      bgMatRef.current.uniforms.uTime.value = sharedTime.current;
      const size = state.gl.getDrawingBufferSize(new THREE.Vector2());
      bgMatRef.current.uniforms.uResolution.value.set(size.x, size.y);
    }
    if (sphereMatRef.current) {
      sphereMatRef.current.uniforms.uTime.value = sharedTime.current;
    }

    /* 3. Sphere mouse-repulsion with bounded ease-out toward target.
     *
     * Inverted from the earlier attraction model: when the cursor
     * approaches the sphere's home position, the sphere displaces
     * AWAY from the cursor; when the cursor moves far away, the
     * sphere returns to home. Magnitude is capped by MAX_OFFSET so
     * the sphere never escapes a bounded region around home.
     *
     * Direction is computed from cursor → home (so the offset moves
     * the sphere further along the away-from-cursor axis).
     * Magnitude uses a smoothstep on cursor-to-home distance, peaking
     * at proximity and falling to zero past REPULSION_RANGE.
     */
    if (sphereMeshRef.current) {
      const homeX = 1.15;
      const homeY = 0.5;
      const mouseWorldX = cursor.current.x * 1.8;
      const mouseWorldY = cursor.current.y * 1.1;

      const pos = sphereMeshRef.current.position;

      const awayX = homeX - mouseWorldX;
      const awayY = homeY - mouseWorldY;
      const cursorDistToHome = Math.hypot(awayX, awayY);

      const REPULSION_RANGE = 1.3;
      const MAX_OFFSET = 0.7;
      const proximity = Math.max(
        0,
        1 - cursorDistToHome / REPULSION_RANGE,
      );
      const magnitude = proximity * proximity * MAX_OFFSET;

      const safeDist = Math.max(cursorDistToHome, 0.001);
      const dirX = awayX / safeDist;
      const dirY = awayY / safeDist;

      const offsetX = dirX * magnitude;
      const offsetY = dirY * magnitude;

      target.current.set(homeX + offsetX, homeY + offsetY, 0);

      /*
       * Distance-dependent ease-out: rate is high while the sphere
       * is far from target (fast initial dash) and drops sharply
       * as it nears (long, visible deceleration tail).
       *
       * Pure exponential decay gives a constant fractional rate,
       * which means the deceleration is the same shape at every
       * scale and reads as "uniform settle". Stretching the tail
       * needs a non-uniform rate. We blend FAST_RATE → SLOW_RATE
       * with a smoothstep on `dist / FAR_DIST` so the transition
       * itself is smooth.
       *
       *   dist >> FAR_DIST  →  rate ≈ FAST_RATE   (snappy dash)
       *   dist == FAR_DIST  →  rate ≈ FAST_RATE
       *   dist <  FAR_DIST  →  rate slides toward SLOW_RATE
       *   dist ≈ 0          →  rate ≈ SLOW_RATE   (long glide)
       */
      const FAST_RATE = 26;
      const SLOW_RATE = 2.4;
      const FAR_DIST = 0.45;

      const dx = target.current.x - pos.x;
      const dy = target.current.y - pos.y;
      const distNow = Math.hypot(dx, dy);
      const tt = Math.min(distNow / FAR_DIST, 1);
      const blend = tt * tt * (3 - 2 * tt); // smoothstep
      const rate = SLOW_RATE + (FAST_RATE - SLOW_RATE) * blend;
      const f = 1 - Math.exp(-rate * dt);
      pos.x += dx * f;
      pos.y += dy * f;

      // No rotation: the time-warped noise inside flowColor already
      // animates the surface, and the spherical-UV seam stays parked
      // in the back hemisphere via the static rotation-y on the mesh.
    }

    lastCursor.current.x = cursor.current.x;
    lastCursor.current.y = cursor.current.y;
  });

  return (
    <>
      <mesh frustumCulled={false} renderOrder={-10}>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          ref={bgMatRef}
          vertexShader={BG_VERTEX}
          fragmentShader={BG_FRAGMENT}
          uniforms={bgUniforms}
          depthTest={false}
          depthWrite={false}
        />
      </mesh>

      {/*
       * rotation-y = -PI/2 sweeps the spherical-UV seam meridian
       * (originally at object-space -X) onto -Z, parking it behind
       * the sphere from the camera's POV so the discontinuity is
       * never visible.
       */}
      <mesh
        ref={sphereMeshRef}
        scale={1.55}
        rotation-y={-Math.PI / 2}
      >
        <icosahedronGeometry args={[1, 14]} />
        <shaderMaterial
          ref={sphereMatRef}
          vertexShader={SPHERE_VERTEX}
          fragmentShader={SPHERE_FRAGMENT}
          uniforms={sphereUniforms}
        />
      </mesh>
    </>
  );
}

/* ================================================================== */
/* Canvas wrapper                                                     */
/* ================================================================== */

export function FluidOrb({
  paletteUniforms,
}: {
  paletteUniforms: PaletteUniforms;
}) {
  return (
    <div className="absolute inset-0">
      <Canvas
        className="!absolute inset-0"
        camera={{ position: [0, 0, 3.6], fov: 44 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
        }}
      >
        <Scene paletteUniforms={paletteUniforms} />
      </Canvas>
    </div>
  );
}

export type { PaletteUniforms };
