"use client";

import { useEffect, useRef } from "react";

export function BackgroundCanvas() {
  const goldRef  = useRef<HTMLDivElement>(null);
  const tealRef  = useRef<HTMLDivElement>(null);
  const greenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rafId: number;
    let mx = window.innerWidth  * 0.5;
    let my = window.innerHeight * 0.5;

    // Each orb tracks a current centre (px)
    let gx = window.innerWidth  * 0.55, gy = window.innerHeight * 0.72;
    let tx = window.innerWidth  * 0.18, ty = window.innerHeight * 0.32;
    let ex = window.innerWidth  * 0.80, ey = window.innerHeight * 0.55;

    let t = 0;

    const onMouse = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener("mousemove", onMouse, { passive: true });

    function tick() {
      rafId = requestAnimationFrame(tick);
      t += 0.007;
      const w = window.innerWidth, h = window.innerHeight;

      // Gold — home centre-bottom, pulled strongly toward mouse
      const gTx = w * 0.55 + (mx - w * 0.5) * 0.45 + Math.sin(t * 0.55) * w * 0.06;
      const gTy = h * 0.72 + (my - h * 0.5) * 0.32 + Math.cos(t * 0.42) * h * 0.05;
      gx += (gTx - gx) * 0.05;
      gy += (gTy - gy) * 0.05;

      // Teal — home upper-left, moderate mouse pull
      const tTx = w * 0.18 + (mx - w * 0.5) * 0.22 + Math.cos(t * 0.48) * w * 0.04;
      const tTy = h * 0.32 + (my - h * 0.5) * 0.16 + Math.sin(t * 0.36) * h * 0.035;
      tx += (tTx - tx) * 0.028;
      ty += (tTy - ty) * 0.028;

      // Deep green — home right-side, slow lazy drift
      const eTx = w * 0.80 + (mx - w * 0.5) * 0.14 + Math.sin(t * 0.38) * w * 0.04;
      const eTy = h * 0.55 + (my - h * 0.5) * 0.10 + Math.cos(t * 0.52) * h * 0.03;
      ex += (eTx - ex) * 0.018;
      ey += (eTy - ey) * 0.018;

      if (goldRef.current)
        goldRef.current.style.transform  = `translate3d(${gx - 350}px, ${gy - 350}px, 0)`;
      if (tealRef.current)
        tealRef.current.style.transform  = `translate3d(${tx - 380}px, ${ty - 380}px, 0)`;
      if (greenRef.current)
        greenRef.current.style.transform = `translate3d(${ex - 320}px, ${ey - 320}px, 0)`;
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
      style={{ zIndex: -1, backgroundColor: "#070d0b" }}
      aria-hidden="true"
    >
      {/* Gold orb */}
      <div
        ref={goldRef}
        className="absolute top-0 left-0"
        style={{
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle at center, rgba(200,165,92,0.20) 0%, transparent 70%)",
          filter: "blur(100px)",
          willChange: "transform",
        }}
      />
      {/* Teal orb */}
      <div
        ref={tealRef}
        className="absolute top-0 left-0"
        style={{
          width: 760,
          height: 760,
          borderRadius: "50%",
          background: "radial-gradient(circle at center, rgba(18,120,105,0.36) 0%, transparent 70%)",
          filter: "blur(110px)",
          willChange: "transform",
        }}
      />
      {/* Deep green orb */}
      <div
        ref={greenRef}
        className="absolute top-0 left-0"
        style={{
          width: 640,
          height: 640,
          borderRadius: "50%",
          background: "radial-gradient(circle at center, rgba(14,95,62,0.34) 0%, transparent 70%)",
          filter: "blur(95px)",
          willChange: "transform",
        }}
      />
    </div>
  );
}
