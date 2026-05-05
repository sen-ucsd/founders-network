import { FluidOrb, type PaletteUniforms } from "./fluid-orb";

export function OrbBackground({
  paletteUniforms,
}: {
  paletteUniforms: PaletteUniforms;
}) {
  return (
    <div className="orb-stage" aria-hidden="true">
      <FluidOrb paletteUniforms={paletteUniforms} />
      <div className="glass-film" />
      <div className="vignette" />
      <div className="grain-coarse" />
      <div className="grain" />
    </div>
  );
}
