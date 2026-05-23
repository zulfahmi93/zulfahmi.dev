"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Stagger step 1–3, mapped to a transition-delay in CSS. */
  delay?: 1 | 2 | 3;
  className?: string;
};

/**
 * Fades content up on first scroll into view. The CSS no-ops this entirely
 * under `prefers-reduced-motion: reduce`, so content is always visible.
 */
export function Reveal({ children, delay, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shown]);

  return (
    <div
      ref={ref}
      className={`zf-reveal${shown ? " in" : ""}${className ? ` ${className}` : ""}`}
      data-delay={delay}
    >
      {children}
    </div>
  );
}
