"use client";

import { useEffect, useRef } from "react";

const STATIC_LAYERS = [
  "radial-gradient(ellipse 90% 55% at 50% 92%, rgba(200,165,92,0.14) 0%, transparent 62%)",
  "radial-gradient(ellipse 65% 75% at 8% 42%, rgba(13,84,76,0.30) 0%, transparent 58%)",
  "radial-gradient(ellipse 55% 65% at 92% 58%, rgba(8,45,35,0.38) 0%, transparent 52%)",
  "radial-gradient(ellipse 50% 35% at 52% 5%, rgba(200,165,92,0.05) 0%, transparent 60%)",
].join(",");

export function BackgroundCanvas() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const goldRef   = useRef<HTMLDivElement>(null);
  const tealRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rafId: number;
    const W = () => window.innerWidth;
    const H = () => window.innerHeight;

    // Live mouse position
    let mx = W() * 0.5;
    let my = H() * 0.5;

    // Cursor glow — snaps to mouse
    let cx = mx, cy = my;
    // Gold drift orb
    let gx = W() * 0.5,  gy = H() * 0.75;
    // Teal drift orb
    let tx = W() * 0.18, ty = H() * 0.35;

    let t = 0;
    let hasMoved = false;

    const onMouse = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      hasMoved = true;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    function tick() {
      rafId = requestAnimationFrame(tick);
      t += 0.007;
      const w = W(), h = H();

      // Cursor glow — tight spring, follows mouse closely
      cx += (mx - cx) * 0.14;
      cy += (my - cy) * 0.14;

      // Gold orb — home near bottom-centre, moderate mouse pull
      const gTx = w * 0.50 + (mx - w * 0.5) * 0.28 + Math.sin(t * 0.55) * w * 0.05;
      const gTy = h * 0.75 + (my - h * 0.5) * 0.18 + Math.cos(t * 0.42) * h * 0.04;
      gx += (gTx - gx) * 0.055;
      gy += (gTy - gy) * 0.055;

      // Teal orb — home upper-left, slow drift
      const tTx = w * 0.18 + (mx - w * 0.5) * 0.12 + Math.cos(t * 0.48) * w * 0.035;
      const tTy = h * 0.32 + (my - h * 0.5) * 0.09 + Math.sin(t * 0.36) * h * 0.030;
      tx += (tTx - tx) * 0.022;
      ty += (tTy - ty) * 0.022;

      if (cursorRef.current) {
        // Cursor glow: 180px orb, centered on cursor
        cursorRef.current.style.transform = `translate3d(${cx - 90}px, ${cy - 90}px, 0)`;
        // Fade in only after first real mouse move so it doesn't sit at centre awkwardly
        if (hasMoved) cursorRef.current.style.opacity = "1";
      }
      if (goldRef.current) {
        goldRef.current.style.transform = `translate3d(${gx - 300}px, ${gy - 300}px, 0)`;
      }
      if (tealRef.current) {
        tealRef.current.style.transform = `translate3d(${tx - 350}px, ${ty - 350}px, 0)`;
      }
    }

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: -1, backgroundColor: "#070d0b", backgroundImage: STATIC_LAYERS }}
      aria-hidden="true"
    >
      {/* Tight cursor glow — makes mouse interaction obvious */}
      <div
        ref={cursorRef}
        className="absolute top-0 left-0"
        style={{
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "radial-gradient(circle at center, rgba(200,165,92,0.55) 0%, transparent 70%)",
          filter: "blur(32px)",
          willChange: "transform",
          opacity: 0,
          transition: "opacity 0.4s ease",
        }}
      />
      {/* Gold drift orb — large, lazy */}
      <div
        ref={goldRef}
        className="absolute top-0 left-0"
        style={{
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle at center, rgba(200,165,92,0.22) 0%, transparent 70%)",
          filter: "blur(90px)",
          willChange: "transform",
        }}
      />
      {/* Teal drift orb — large, sluggish */}
      <div
        ref={tealRef}
        className="absolute top-0 left-0"
        style={{
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle at center, rgba(13,84,76,0.35) 0%, transparent 70%)",
          filter: "blur(100px)",
          willChange: "transform",
        }}
      />
    </div>
  );
}
