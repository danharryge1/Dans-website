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
        INTERVAL: 2000,
        SIM_RESOLUTION: 128,
        DYE_RESOLUTION: 1024,
        DENSITY_DISSIPATION: 0.45,
        VELOCITY_DISSIPATION: 0.12,
        PRESSURE: 0.7,
        PRESSURE_ITERATIONS: 20,
        CURL: 12,
        SPLAT_RADIUS: 0.3,
        SPLAT_FORCE: 5000,
        SPLAT_COUNT: 5,
        SHADING: true,
        COLORFUL: true,
        COLOR_UPDATE_SPEED: 3,
        PAUSED: false,
        BACK_COLOR: { r: 3, g: 14, b: 12 },
        TRANSPARENT: false,
        BLOOM: true,
        BLOOM_ITERATIONS: 8,
        BLOOM_RESOLUTION: 256,
        BLOOM_INTENSITY: 0.65,
        BLOOM_THRESHOLD: 0.2,
        BLOOM_SOFT_KNEE: 0.7,
        SUNRAYS: false,
      });

      // Forward section-level mousemove to canvas. The library reads
      // e.offsetX / e.offsetY so we must inject canvas-relative coords
      // via Object.defineProperty — synthetic events have offsetX=0 by default.
      const section = document.getElementById("selected-works");
      if (section) {
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
        section.addEventListener("mousemove", forward);
        sectionCleanup = () =>
          section.removeEventListener("mousemove", forward);
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
        // Rotate the hue spectrum ~50° to pull the rainbow into gold/amber
        // (reds→golds) and green/teal (yellows→greens) — the brand palette.
        // Reduce saturation slightly for a relaxed, not-flashy feel.
        // Shift rainbow → gold/amber + green/teal; reduce saturation
        // to keep the palette relaxed and on-brand.
        filter: "hue-rotate(55deg) saturate(0.78)",
      }}
    />
  );
}
