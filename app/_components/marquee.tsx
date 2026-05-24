import type { CSSProperties } from "react";

/**
 * Decorative horizontal marquee. The row is rendered twice inside a track that
 * scrolls -50%, so the loop is seamless. Marked aria-hidden: it's an ambient
 * brand flourish, not content (the same stack is enumerated on the About page).
 * The animation pauses under prefers-reduced-motion via CSS.
 */
export function Marquee({
  items,
  speedSeconds = 32,
  separator = "·",
}: {
  items: readonly string[];
  speedSeconds?: number;
  separator?: string;
}) {
  const row = (
    <div className="zf-mq-row">
      {items.map((item, i) => (
        <span className="zf-mq-item" key={i}>
          {item}
          <span className="zf-mq-sep" aria-hidden="true">
            {separator}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className="zf-mq"
      aria-hidden="true"
      style={{ "--zf-mq-speed": `${speedSeconds}s` } as CSSProperties}
    >
      <div className="zf-mq-track">
        {row}
        {row}
      </div>
    </div>
  );
}
