"use client";

import { useEffect, useRef } from "react";

export function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let disposed = false;
    let cleanupFn: (() => void) | null = null;

    import("./BackgroundScene").then(({ startScene }) => {
      if (disposed || !canvasRef.current) return;
      cleanupFn = startScene(canvasRef.current);
    });

    return () => {
      disposed = true;
      cleanupFn?.();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 9999, mixBlendMode: "screen" }}
      aria-hidden="true"
    />
  );
}
