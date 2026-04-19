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
        DENSITY_DISSIPATION: 0.97,
        VELOCITY_DISSIPATION: 0.18,
        PRESSURE: 0.8,
        PRESSURE_ITERATIONS: 20,
        CURL: 15,
        SPLAT_RADIUS: 0.35,
        SPLAT_FORCE: 2800,
        SPLAT_COUNT: 5,
        SHADING: true,
        COLORFUL: true,
        COLOR_UPDATE_SPEED: 4,
        PAUSED: false,
        BACK_COLOR: { r: 3, g: 14, b: 12 },
        TRANSPARENT: false,
        BLOOM: true,
        BLOOM_ITERATIONS: 8,
        BLOOM_RESOLUTION: 256,
        BLOOM_INTENSITY: 0.55,
        BLOOM_THRESHOLD: 0.4,
        BLOOM_SOFT_KNEE: 0.7,
        SUNRAYS: false,
      });

      // Forward section-level mousemove to the canvas so the fluid reacts
      // to cursor movement everywhere in the section, not just where the
      // canvas itself is the top-most pointer target.
      const section = document.getElementById("selected-works");
      if (section) {
        const forward = (e: MouseEvent) => {
          canvas.dispatchEvent(
            new MouseEvent("mousemove", {
              clientX: e.clientX,
              clientY: e.clientY,
              movementX: e.movementX,
              movementY: e.movementY,
              bubbles: false,
            }),
          );
        };
        section.addEventListener("mousemove", forward);
        sectionCleanup = () => section.removeEventListener("mousemove", forward);
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
    />
  );
}
