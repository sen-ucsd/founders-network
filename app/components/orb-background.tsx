import { FluidOrb } from "./fluid-orb";

export function OrbBackground() {
  return (
    <div className="orb-stage" aria-hidden="true">
      <FluidOrb />
      <div className="glass-film" />
      <div className="vignette" />
      <div className="grain-coarse" />
      <div className="grain" />
    </div>
  );
}
