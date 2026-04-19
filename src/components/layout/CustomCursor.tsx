"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (coarse || reduced) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.style.cursor = "none";

    let mx = -200, my = -200;
    let rx = -200, ry = -200;
    let rafId = 0;

    const loop = () => {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      dot.style.transform = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
      ring.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`;
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    const isInteractive = (t: EventTarget | null) =>
      !!(t as Element)?.closest?.("a, button, [role=button], [data-magnetic], label");

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const onLeave = () => { mx = -200; my = -200; };
    const onOver = (e: MouseEvent) => {
      if (isInteractive(e.target)) { dot.dataset.hover = "1"; ring.dataset.hover = "1"; }
    };
    const onOut = (e: MouseEvent) => {
      if (isInteractive(e.relatedTarget ?? e.target)) {
        delete dot.dataset.hover;
        delete ring.dataset.hover;
      }
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      document.documentElement.style.cursor = "";
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="cursor-dot"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="cursor-ring"
      />
    </>
  );
}
