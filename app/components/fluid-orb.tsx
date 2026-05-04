"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/* ================================================================== */
/* Shared GLSL                                                        */
/* ================================================================== */

const FLOW_GLSL = /* glsl */ `
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

  /*
   * Iridescent palette: indexed by a [0,1] key, smoothly cycles through
   * black-green → olive → amber → gold and back. The fract+reflect step
   * makes the cycle continuous so banded patterns don't show a seam.
   */
  vec3 iridescent(float k){
    k = fract(k);
    if (k > 0.5) k = 1.0 - k;
    k *= 2.0;

    vec3 c0 = vec3(0.020, 0.035, 0.022);   // black-green
    vec3 c1 = vec3(0.150, 0.205, 0.105);   // dark olive
    vec3 c2 = vec3(0.490, 0.350, 0.150);   // amber
    vec3 c3 = vec3(0.880, 0.740, 0.310);   // gold

    vec3 col = mix(c0, c1, smoothstep(0.00, 0.40, k));
    col      = mix(col, c2, smoothstep(0.30, 0.70, k));
    col      = mix(col, c3, smoothstep(0.65, 1.00, k));
    return col;
  }

  /*
   * Banded flow:
   *   1. FBM domain-warp the input position so the field swirls.
   *   2. Project the warped position onto a slanted axis.
   *   3. Take sin(axis) — a stripe pattern, but warped by the FBM so the
   *      stripes become curving organic bands instead of straight lines.
   *   4. Use that banded value (plus extra noise) as the palette key, so
   *      adjacent bands pull different colours from the iridescent cycle.
   *   5. Multiply by a soft noise mask to carve dark "valleys" between
   *      the bright bands — gives the look of viewing oil on glass.
   */
  vec3 flowColor(vec2 p, float t){
    vec2 q = vec2(
      fbm(p * 0.8 + vec2(0.0, t)),
      fbm(p * 0.8 + vec2(5.2, 1.3 - t))
    );
    vec2 r = vec2(
      fbm(p + 1.8 * q + vec2(t * 0.5, 9.2)),
      fbm(p + 1.8 * q + vec2(8.3, t * 0.5))
    );

    // Two stripe families at different angles, warped by the FBM field.
    float ax1 = (p.x * 0.55 + p.y * 0.35) + r.x * 1.7 + r.y * 0.6;
    float ax2 = (p.x * 0.40 - p.y * 0.65) + r.y * 1.5 + r.x * 0.4;
    float v1  = sin(ax1 * 5.5 + t * 0.45);
    float v2  = sin(ax2 * 7.5 + t * 0.30);

    // Combined band value, [-1, 1].
    float bands = v1 * 0.65 + v2 * 0.40;

    // Key into the iridescent palette.
    float key = bands * 0.45
              + length(r) * 0.28
              + p.x * 0.05
              + t * 0.06;

    vec3 col = iridescent(key);

    // Dark valleys where the noise dips: stripes only show on the brighter
    // half of the field.
    float lift = q.x * 0.5 + 0.5;       // [0, 1]
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

  ${FLOW_GLSL}

  void main(){
    vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);
    p *= 0.95;

    vec3 col = flowColor(p, uTime * 0.22);

    // Soft accent in the lower-left quadrant so the empty side has weight.
    vec2 secCenter = vec2(-1.05, -0.55);
    float secD = length(p - secCenter);
    col += smoothstep(0.85, 0.0, secD) * vec3(0.28, 0.20, 0.07) * 0.35;

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

  ${FLOW_GLSL}

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

  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vObjNormal;

  ${FLOW_GLSL}

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

function Scene() {
  const bgMatRef = useRef<THREE.ShaderMaterial>(null);
  const sphereMatRef = useRef<THREE.ShaderMaterial>(null);
  const sphereMeshRef = useRef<THREE.Mesh>(null);

  /* Cursor tracking ------------------------------------------------ */
  const cursor = useRef({ x: 0, y: 0 });
  const lastCursor = useRef({ x: 0, y: 0 });

  /* Shared animation state ----------------------------------------- */
  const sharedTime = useRef(0);
  const animSpeed = useRef(1);
  const velocity = useRef(new THREE.Vector3());
  const target = useRef(new THREE.Vector3());

  /* Uniforms ------------------------------------------------------- */
  const bgUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }),
    [],
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
    }),
    [],
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

    /* 3. Sphere mouse-follow with bounded spring */
    if (sphereMeshRef.current) {
      const homeX = 1.15;
      const homeY = 0.5;
      const mouseWorldX = cursor.current.x * 1.8;
      const mouseWorldY = cursor.current.y * 1.1;

      const pos = sphereMeshRef.current.position;
      const toMouseX = mouseWorldX - pos.x;
      const toMouseY = mouseWorldY - pos.y;
      const dist = Math.hypot(toMouseX, toMouseY);
      const attraction = Math.exp(-dist * 0.55);

      let offsetX = (mouseWorldX - homeX) * attraction * 0.65;
      let offsetY = (mouseWorldY - homeY) * attraction * 0.65;
      const MAX_OFFSET = 0.7;
      const offLen = Math.hypot(offsetX, offsetY);
      if (offLen > MAX_OFFSET) {
        offsetX = (offsetX / offLen) * MAX_OFFSET;
        offsetY = (offsetY / offLen) * MAX_OFFSET;
      }
      target.current.set(homeX + offsetX, homeY + offsetY, 0);

      const stiffness = 14;
      const damping = 6;
      const fx = (target.current.x - pos.x) * stiffness;
      const fy = (target.current.y - pos.y) * stiffness;
      velocity.current.x += fx * dt;
      velocity.current.y += fy * dt;
      velocity.current.x *= Math.exp(-damping * dt);
      velocity.current.y *= Math.exp(-damping * dt);
      pos.x += velocity.current.x * dt;
      pos.y += velocity.current.y * dt;

      // Slow ambient rotation (uses sharedTime so it speeds up too).
      sphereMeshRef.current.rotation.y = sharedTime.current * 0.08;
      sphereMeshRef.current.rotation.x =
        Math.sin(sharedTime.current * 0.13) * 0.10;
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

      <mesh ref={sphereMeshRef} scale={1.55}>
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

export function FluidOrb() {
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
        <Scene />
      </Canvas>
    </div>
  );
}
