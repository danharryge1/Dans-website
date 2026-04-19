"use client";

import { useEffect, useRef } from "react";

export function FluidCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;

    import("webgl-fluid").then(({ default: WebGLFluid }) => {
      if (cancelled || !canvasRef.current) return;

      WebGLFluid(canvas, {
        TRIGGER: "hover",
        IMMEDIATE: true,
        AUTO: true,
        INTERVAL: 2000,
        SIM_RESOLUTION: 128,
        DYE_RESOLUTION: 1024,
        DENSITY_DISSIPATION: 0.95,
        VELOCITY_DISSIPATION: 0.2,
        PRESSURE: 0.8,
        PRESSURE_ITERATIONS: 20,
        CURL: 28,
        SPLAT_RADIUS: 0.28,
        SPLAT_FORCE: 6000,
        SPLAT_COUNT: 6,
        SHADING: true,
        COLORFUL: true,
        COLOR_UPDATE_SPEED: 8,
        PAUSED: false,
        BACK_COLOR: { r: 3, g: 14, b: 12 },
        TRANSPARENT: false,
        BLOOM: true,
        BLOOM_ITERATIONS: 8,
        BLOOM_RESOLUTION: 256,
        BLOOM_INTENSITY: 0.6,
        BLOOM_THRESHOLD: 0.4,
        BLOOM_SOFT_KNEE: 0.7,
        SUNRAYS: false,
      });
    });

    return () => {
      cancelled = true;
      try {
        const gl =
          canvas.getContext("webgl") ??
          (canvas.getContext(
            "experimental-webgl",
          ) as WebGLRenderingContext | null);
        gl?.getExtension("WEBGL_lose_context")?.loseContext();
      } catch (_) {}
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full"
    />
  );
}
