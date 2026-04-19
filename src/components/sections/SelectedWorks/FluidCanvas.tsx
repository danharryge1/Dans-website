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
    let sectionCleanup: (() => void) | null = null;

    import("webgl-fluid").then(({ default: WebGLFluid }) => {
      if (cancelled || !canvasRef.current) return;

      WebGLFluid(canvas, {
        TRIGGER: "hover",
        IMMEDIATE: true,
        AUTO: true,
        INTERVAL: 4000,
        SIM_RESOLUTION: 128,
        DYE_RESOLUTION: 1024,
        DENSITY_DISSIPATION: 1.8,   // ~1.5s per splat, no accumulation at 4s interval
        VELOCITY_DISSIPATION: 0.45,
        PRESSURE: 0.6,
        PRESSURE_ITERATIONS: 20,
        CURL: 4,
        SPLAT_RADIUS: 0.24,
        SPLAT_FORCE: 3500,
        SPLAT_COUNT: 3,
        SHADING: true,
        COLORFUL: true,
        COLOR_UPDATE_SPEED: 2,
        PAUSED: false,
        BACK_COLOR: { r: 3, g: 14, b: 12 },
        TRANSPARENT: false,
        BLOOM: true,
        BLOOM_ITERATIONS: 8,
        BLOOM_RESOLUTION: 256,
        BLOOM_INTENSITY: 0.4,
        BLOOM_THRESHOLD: 0.5,
        BLOOM_SOFT_KNEE: 0.7,
        SUNRAYS: false,
      });

      // Auto-discover the nearest section or footer so this component
      // works anywhere without a hardcoded ID.
      const container =
        canvas.closest("section") ?? canvas.closest("footer");
      if (container) {
        const forward = (e: MouseEvent) => {
          if (!canvasRef.current) return;
          const rect = canvasRef.current.getBoundingClientRect();
          const ox = e.clientX - rect.left;
          const oy = e.clientY - rect.top;
          const synth = new MouseEvent("mousemove", {
            clientX: e.clientX,
            clientY: e.clientY,
            movementX: e.movementX,
            movementY: e.movementY,
            bubbles: false,
          });
          Object.defineProperty(synth, "offsetX", { get: () => ox });
          Object.defineProperty(synth, "offsetY", { get: () => oy });
          canvasRef.current.dispatchEvent(synth);
        };
        container.addEventListener("mousemove", forward);
        sectionCleanup = () =>
          container.removeEventListener("mousemove", forward);
      }
    });

    return () => {
      cancelled = true;
      sectionCleanup?.();
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
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        // sepia(0.65) collapses blues/purples into warm gold tones.
        // hue-rotate(40deg) shifts the sepia base to amber-gold and
        // nudges residual greens to teal. saturate(1.5) restores
        // visibility lost from sepia. brightness(0.72) caps the ceiling.
        filter:
          "sepia(0.65) hue-rotate(40deg) saturate(1.5) brightness(0.72)",
      }}
    />
  );
}
