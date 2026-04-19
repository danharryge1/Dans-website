"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SeamRevealClient() {
  useEffect(() => {
    const seams = Array.from(
      document.querySelectorAll<HTMLElement>("[data-section-seam]"),
    );
    if (seams.length === 0) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduced) {
      seams.forEach((s) => gsap.set(s, { scaleX: 1, opacity: 0.55 }));
      return;
    }

    const ctx = gsap.context(() => {
      seams.forEach((seam) => {
        gsap.fromTo(
          seam,
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1,
            opacity: 0.55,
            duration: 0.8,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: seam,
              start: "top 88%",
              once: true,
            },
          },
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
