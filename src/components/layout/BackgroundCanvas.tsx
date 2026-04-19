"use client";

import { useEffect, useRef } from "react";

// Static atmospheric layers — pure CSS, zero runtime cost
const STATIC_LAYERS = [
  // Gold bloom, bottom-centre — the signature warmth
  "radial-gradient(ellipse 90% 55% at 50% 92%, rgba(200,165,92,0.17) 0%, transparent 62%)",
  // Teal wash, left side
  "radial-gradient(ellipse 65% 75% at 8% 42%, rgba(13,84,76,0.38) 0%, transparent 58%)",
  // Deep green, right side
  "radial-gradient(ellipse 55% 65% at 92% 58%, rgba(8,45,35,0.44) 0%, transparent 52%)",
  // Soft warm blush, top-centre — keeps it from reading pure black at scroll-top
  "radial-gradient(ellipse 50% 35% at 52% 5%, rgba(200,165,92,0.07) 0%, transparent 60%)",
].join(",");

export function BackgroundCanvas() {
  const goldRef = useRef<HTMLDivElement>(null);
  const tealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rafId: number;
    // Current orb centre in px
    let gx = window.innerWidth * 0.5;
    let gy = window.innerHeight * 0.8;
    let tx = window.innerWidth * 0.2;
    let ty = window.innerHeight * 0.35;
    // Mouse in px (default to centre)
    let mx = window.innerWidth * 0.5;
    let my = window.innerHeight * 0.5;
    let t = 0;

    const onMouse = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener("mousemove", onMouse, { passive: true });

    function tick() {
      rafId = requestAnimationFrame(tick);
      t += 0.007;

      const W = window.innerWidth;
      const H = window.innerHeight;

      // Gold orb — natural home near bottom-centre, drawn softly toward cursor
      const gTargetX = W * 0.5  + (mx - W * 0.5) * 0.20 + Math.sin(t * 0.6)  * W * 0.04;
      const gTargetY = H * 0.80 + (my - H * 0.5) * 0.12 + Math.cos(t * 0.45) * H * 0.03;
      gx += (gTargetX - gx) * 0.06;
      gy += (gTargetY - gy) * 0.06;

      // Teal orb — natural home upper-left, moves sluggishly
      const tTargetX = W * 0.18 + (mx - W * 0.5) * 0.10 + Math.cos(t * 0.5)  * W * 0.03;
      const tTargetY = H * 0.32 + (my - H * 0.5) * 0.08 + Math.sin(t * 0.38) * H * 0.025;
      tx += (tTargetX - tx) * 0.028;
      ty += (tTargetY - ty) * 0.028;

      if (goldRef.current) {
        goldRef.current.style.transform = `translate3d(${gx - 200}px, ${gy - 200}px, 0)`;
      }
      if (tealRef.current) {
        tealRef.current.style.transform = `translate3d(${tx - 280}px, ${ty - 280}px, 0)`;
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
      {/* Gold cursor orb — warm, responsive */}
      <div
        ref={goldRef}
        className="absolute top-0 left-0"
        style={{
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle at center, rgba(200,165,92,0.28) 0%, transparent 70%)",
          filter: "blur(55px)",
          willChange: "transform",
        }}
      />
      {/* Teal cursor orb — cool, laggy */}
      <div
        ref={tealRef}
        className="absolute top-0 left-0"
        style={{
          width: 560,
          height: 560,
          borderRadius: "50%",
          background: "radial-gradient(circle at center, rgba(13,84,76,0.32) 0%, transparent 70%)",
          filter: "blur(70px)",
          willChange: "transform",
        }}
      />
    </div>
  );
}
