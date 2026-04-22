"use client";

import { useEffect, useRef } from "react";

export function FluidCanvas({ filter }: { filter?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let initDone = false;
    let sectionCleanup: (() => void) | null = null;
    let io: IntersectionObserver | null = null;

    const supportsWebGL = (): boolean => {
      try {
        const testCanvas = document.createElement("canvas");
        const gl =
          testCanvas.getContext("webgl2") ??
          testCanvas.getContext("webgl") ??
          (testCanvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
        if (!gl) return false;
        // webgl-fluid requires at least one of these to render properly.
        // Safari WebGL1 often lacks EXT_color_buffer_half_float.
        const hasHalfFloat =
          gl.getExtension("OES_texture_half_float") !== null ||
          (gl instanceof WebGL2RenderingContext);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        return hasHalfFloat;
      } catch {
        return false;
      }
    };

    const initFluid = () => {
      if (cancelled || !canvasRef.current) return;
      if (!supportsWebGL()) return;

      import("webgl-fluid").then(({ default: WebGLFluid }) => {
      if (cancelled || !canvasRef.current) return;

      try { WebGLFluid(canvas, {
        TRIGGER: "hover",
        IMMEDIATE: true,
        AUTO: true,
        INTERVAL: 3500,
        SIM_RESOLUTION: 64,
        DYE_RESOLUTION: 512,
        DENSITY_DISSIPATION: 1.2,
        VELOCITY_DISSIPATION: 0.5,
        PRESSURE: 0.5,
        PRESSURE_ITERATIONS: 12,
        CURL: 5,
        SPLAT_RADIUS: 0.18,
        SPLAT_FORCE: 2000,
        SPLAT_COUNT: 3,
        SHADING: true,
        COLORFUL: true,
        COLOR_UPDATE_SPEED: 4,
        PAUSED: false,
        BACK_COLOR: { r: 3, g: 14, b: 12 },
        TRANSPARENT: false,
        BLOOM: true,
        BLOOM_ITERATIONS: 4,
        BLOOM_RESOLUTION: 256,
        BLOOM_INTENSITY: 0.4,
        BLOOM_THRESHOLD: 0.5,
        BLOOM_SOFT_KNEE: 0.7,
        SUNRAYS: false,
      });

      // Dispatch a synthetic mousemove at a random position every 2s so the
      // fluid keeps generating splats even when the user isn't hovering.
      // This is a fallback in case the library's AUTO only fires on hover.
      const autoSplatInterval = setInterval(() => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const rx = rect.left + Math.random() * rect.width;
        const ry = rect.top  + Math.random() * rect.height;
        const synth = new MouseEvent("mousemove", {
          clientX: rx, clientY: ry,
          movementX: (Math.random() - 0.5) * 20,
          movementY: (Math.random() - 0.5) * 20,
          bubbles: false,
        });
        Object.defineProperty(synth, "offsetX", { get: () => rx - rect.left });
        Object.defineProperty(synth, "offsetY", { get: () => ry - rect.top });
        canvasRef.current.dispatchEvent(synth);
      }, 2000);

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
        sectionCleanup = () => {
          container.removeEventListener("mousemove", forward);
          clearInterval(autoSplatInterval);
        };
      } else {
        sectionCleanup = () => clearInterval(autoSplatInterval);
      }
      } catch { /* WebGL init failed — unsupported or context lost */ }
      }).catch(() => {});
    };

    const doInit = () => {
      if (initDone) return;
      initDone = true;
      io?.disconnect();
      io = null;
      initFluid();
    };

    // Timer fallback — fires if the canvas is already in the viewport on mount
    // (e.g. on /about where the section fills the full page height).
    const fallbackTimer = setTimeout(doInit, 800);

    io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) doInit();
      },
      { rootMargin: "200px" },
    );
    io.observe(canvas);

    return () => {
      cancelled = true;
      clearTimeout(fallbackTimer);
      io?.disconnect();
      sectionCleanup?.();
    };
  }, []);

  // Filter applied to the wrapper div, NOT the canvas — Safari stops
  // compositing WebGL canvas frames when a CSS filter is on the canvas itself.
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        filter: filter ?? "sepia(0.55) hue-rotate(40deg) saturate(1.0) brightness(0.58)",
      }}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
      />
    </div>
  );
}
