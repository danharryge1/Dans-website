"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SelectedWorksClient() {
  useEffect(() => {
    const section = document.getElementById("selected-works");
    if (!section) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const heading = section.querySelector<HTMLElement>("[data-works-heading]");
    const cards = Array.from(
      section.querySelectorAll<HTMLElement>("[data-work-card]"),
    );
    const imgs = Array.from(
      section.querySelectorAll<HTMLElement>("[data-work-card] img"),
    );

    if (reduced) {
      if (heading) gsap.set(heading, { opacity: 1, x: 0 });
      cards.forEach((c) => gsap.set(c, { opacity: 1, y: 0, scale: 1 }));
      return;
    }

    const ctx = gsap.context(() => {
      if (heading) gsap.set(heading, { opacity: 0, x: -28 });
      cards.forEach((c) => gsap.set(c, { opacity: 0, y: 48, scale: 0.95 }));

      // One-shot stagger entry when section hits 75% of viewport
      ScrollTrigger.create({
        trigger: section,
        start: "top 75%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();
          if (heading) {
            tl.to(
              heading,
              { opacity: 1, x: 0, duration: 0.55, ease: "power2.out" },
              0,
            );
          }
          cards.forEach((card, i) => {
            tl.to(
              card,
              { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: "power2.out" },
              0.1 + i * 0.12,
            );
          });
        },
      });

      // Vertical parallax on each card image — even/odd get opposite drift
      // direction so the row feels alive as you scroll through.
      imgs.forEach((img, i) => {
        const from = i % 2 === 0 ? -10 : -6;
        const to = i % 2 === 0 ? 10 : 6;
        gsap.fromTo(
          img,
          { y: from },
          {
            y: to,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          },
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return null;
}
