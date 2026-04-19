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
    let observer: IntersectionObserver | null = null;

    import("webgl-fluid").then(({ default: WebGLFluid }) => {
      if (cancelled || !canvasRef.current) return;

      WebGLFluid(canvas, {
        TRIGGER: "hover",
        IMMEDIATE: true,
        AUTO: true,
        INTERVAL: 5000,
        SIM_RESOLUTION: 128,
        DYE_RESOLUTION: 1024,
        DENSITY_DISSIPATION: 1.8,
        VELOCITY_DISSIPATION: 0.35,
        PRESSURE: 0.8,
        PRESSURE_ITERATIONS: 20,
        CURL: 22,
        SPLAT_RADIUS: 0.22,
        SPLAT_FORCE: 5000,
        SPLAT_COUNT: 4,
        SHADING: true,
        COLORFUL: true,
        COLOR_UPDATE_SPEED: 6,
        PAUSED: false,
        BACK_COLOR: { r: 3, g: 14, b: 12 },
        TRANSPARENT: false,
        BLOOM: true,
        BLOOM_ITERATIONS: 8,
        BLOOM_RESOLUTION: 256,
        BLOOM_INTENSITY: 0.45,
        BLOOM_THRESHOLD: 0.5,
        BLOOM_SOFT_KNEE: 0.7,
        SUNRAYS: false,
      });

      // Hide canvas only after lib has initialised so clientWidth is non-zero
      observer = new IntersectionObserver(
        (entries) => {
          if (!canvasRef.current) return;
          canvasRef.current.style.visibility = entries[0].isIntersecting
            ? "visible"
            : "hidden";
        },
        { threshold: 0.05 },
      );
      observer.observe(canvas);
    });

    return () => {
      cancelled = true;
      observer?.disconnect();
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
