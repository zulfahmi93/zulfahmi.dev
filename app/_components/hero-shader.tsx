"use client";

import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";
import { useReducedMotion } from "./use-reduced-motion";

/**
 * Animated sphere gradient behind the home hero. Recoloured from the supplied
 * config to the site's warm sunset palette (orange → amber → yellow on cream).
 * Renders nothing under prefers-reduced-motion, so the static CSS hero gradient
 * (.zf-hero-bg) shows instead — also what CI/Playwright (GPU-less) sees.
 */
export function HeroShader() {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <div className="zf-hero-shader" aria-hidden="true">
      <ShaderGradientCanvas
        style={{ width: "100%", height: "100%" }}
        pixelDensity={1}
        fov={45}
        pointerEvents="none"
      >
        <ShaderGradient
          animate="on"
          type="sphere"
          color1="#fa520f"
          color2="#ff7a1a"
          color3="#ffc21f"
          brightness={1.5}
          cAzimuthAngle={250}
          cDistance={1.5}
          cPolarAngle={140}
          cameraZoom={12.5}
          positionX={1.3}
          positionY={0}
          positionZ={0}
          rotationX={0}
          rotationY={0}
          rotationZ={140}
          uAmplitude={7}
          uDensity={0.8}
          uFrequency={5.5}
          uSpeed={0.3}
          uStrength={0.4}
          uTime={0}
          envPreset="city"
          grain="on"
          lightType="3d"
          reflection={0.5}
          range="disabled"
          rangeStart={0}
          rangeEnd={40}
          shader="defaults"
          wireframe={false}
        />
      </ShaderGradientCanvas>
    </div>
  );
}
