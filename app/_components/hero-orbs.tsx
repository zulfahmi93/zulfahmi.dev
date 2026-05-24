/**
 * Drifting atmospheric backdrop: three blurred radial orbs that slowly move on
 * different timings, a directional veil that fades them into the page, and a
 * grain layer for film texture. Pure CSS — no WebGL — so it costs nothing on the
 * main thread and stops cleanly under prefers-reduced-motion. Colours come from
 * the palette tokens, so it follows light/dark automatically.
 *
 * `full` is used behind the home hero; `soft` is the gentler interior-page header.
 */
export function HeroOrbs({ variant = "full" }: { variant?: "full" | "soft" }) {
  return (
    <div className={`zf-orbs ${variant}`} aria-hidden="true">
      <div className="zf-orb zf-orb-1" />
      <div className="zf-orb zf-orb-2" />
      <div className="zf-orb zf-orb-3" />
      <div className="zf-orbs-veil" />
      <div className="zf-grain" />
    </div>
  );
}
