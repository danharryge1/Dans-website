"use client";

import { useEffect, useRef } from "react";

// Clamp orb radius so orbs never overflow a narrow viewport.
function orbRadius(base: number, vw: number): number {
  return Math.min(base, vw * 0.46);
}

// Mobile = no horizontal mouse parallax; orb anchors shift inward to stay visible.
function isMobile(vw: number) { return vw < 768; }

export function BackgroundCanvas() {
  const goldRef  = useRef<HTMLDivElement>(null);
  const tealRef  = useRef<HTMLDivElement>(null);
  const greenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rafId: number;
    let frame = 0;

    const w0 = window.innerWidth, h0 = window.innerHeight;
    let rG = orbRadius(350, w0);
    let rT = orbRadius(380, w0);
    let rE = orbRadius(320, w0);

    let mx = w0 * 0.5;
    let my = h0 * 0.5;

    const anchorX = (vw: number) => isMobile(vw)
      ? { g: 0.50, t: 0.32, e: 0.68 }
      : { g: 0.55, t: 0.18, e: 0.80 };

    const a0 = anchorX(w0);
    let gx = w0 * a0.g, gy = h0 * 0.72;
    let tx = w0 * a0.t, ty = h0 * 0.32;
    let ex = w0 * a0.e, ey = h0 * 0.55;

    let t = 0;

    const onMouse = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener("mousemove", onMouse, { passive: true });

    const onResize = () => {
      const vw = window.innerWidth, vh = window.innerHeight;
      rG = orbRadius(350, vw);
      rT = orbRadius(380, vw);
      rE = orbRadius(320, vw);
      mx = vw * 0.5; my = vh * 0.5;
      const a = anchorX(vw);
      gx = vw * a.g; gy = vh * 0.72;
      tx = vw * a.t; ty = vh * 0.32;
      ex = vw * a.e; ey = vh * 0.55;
    };
    window.addEventListener("resize", onResize, { passive: true });

    function tick() {
      rafId = requestAnimationFrame(tick);
      // 30 fps — halves GPU blur repaints, imperceptible for ambient orbs.
      if (++frame % 2 !== 0) return;

      t += 0.014;
      const w = window.innerWidth, h = window.innerHeight;
      const mobile = isMobile(w);
      const mp = mobile ? 0 : 1; // no mouse parallax on touch

      const a = anchorX(w);
      const gTx = w * a.g + (mx - w * 0.5) * 0.45 * mp + Math.sin(t * 0.55) * w * 0.06;
      const gTy = h * 0.72 + (my - h * 0.5) * 0.32 * mp + Math.cos(t * 0.42) * h * 0.05;
      gx += (gTx - gx) * 0.05;
      gy += (gTy - gy) * 0.05;

      const tTx = w * a.t + (mx - w * 0.5) * 0.22 * mp + Math.cos(t * 0.48) * w * 0.04;
      const tTy = h * 0.32 + (my - h * 0.5) * 0.16 * mp + Math.sin(t * 0.36) * h * 0.035;
      tx += (tTx - tx) * 0.028;
      ty += (tTy - ty) * 0.028;

      const eTx = w * a.e + (mx - w * 0.5) * 0.14 * mp + Math.sin(t * 0.38) * w * 0.04;
      const eTy = h * 0.55 + (my - h * 0.5) * 0.10 * mp + Math.cos(t * 0.52) * h * 0.03;
      ex += (eTx - ex) * 0.018;
      ey += (eTy - ey) * 0.018;

      if (goldRef.current)  goldRef.current.style.transform  = `translate3d(${gx - rG}px, ${gy - rG}px, 0)`;
      if (tealRef.current)  tealRef.current.style.transform  = `translate3d(${tx - rT}px, ${ty - rT}px, 0)`;
      if (greenRef.current) greenRef.current.style.transform = `translate3d(${ex - rE}px, ${ey - rE}px, 0)`;
    }

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: -1, backgroundColor: "#070d0b" }}
      aria-hidden="true"
    >
      {/* Orb sizes use clamp so they scale down on narrow viewports. */}
      <div ref={goldRef}  className="absolute top-0 left-0" style={{ width: "min(700px, 92vw)", height: "min(700px, 92vw)", borderRadius: "50%", background: "radial-gradient(circle at center, rgba(200,165,92,0.20) 0%, transparent 70%)", filter: "blur(55px)", willChange: "transform" }} />
      <div ref={tealRef}  className="absolute top-0 left-0" style={{ width: "min(760px, 92vw)", height: "min(760px, 92vw)", borderRadius: "50%", background: "radial-gradient(circle at center, rgba(18,120,105,0.36) 0%, transparent 70%)", filter: "blur(60px)", willChange: "transform" }} />
      <div ref={greenRef} className="absolute top-0 left-0" style={{ width: "min(640px, 92vw)", height: "min(640px, 92vw)", borderRadius: "50%", background: "radial-gradient(circle at center, rgba(14,95,62,0.34) 0%, transparent 70%)", filter: "blur(50px)", willChange: "transform" }} />
    </div>
  );
}
