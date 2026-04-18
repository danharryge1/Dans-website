"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type CSSVarTweenVars = gsap.TweenVars & Record<`--${string}`, string | number>;

gsap.registerPlugin(ScrollTrigger);

export function ServicesClient() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const section = document.getElementById("services");
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;

    if (prefersReducedMotion) {
      // snap-to-lit — cards already render lit via default token; nothing to do.
      return;
    }

    if (!isDesktop) {
      // mobile path lands in Task 6
      return;
    }

    const cards = Array.from(
      section.querySelectorAll<HTMLElement>("[data-services-card]"),
    );
    const heading = section.querySelector<HTMLElement>(
      "[data-services-heading]",
    );

    const ctx = gsap.context(() => {
      cards.forEach((card) => {
        gsap.set(card, { "--sweep-x": 0 } as CSSVarTweenVars);
      });

      if (heading) {
        gsap.set(heading, {
          y: 16,
          opacity: 0,
          letterSpacing: "0.08em",
        });
        ScrollTrigger.create({
          trigger: heading,
          start: "top 75%",
          once: true,
          onEnter: () => {
            gsap.to(heading, {
              y: 0,
              opacity: 1,
              letterSpacing: "0.05em",
              duration: 0.6,
              ease: "power2.out",
            });
          },
        });
      }

      cards.forEach((card) => {
        const arcPath = card.querySelector<SVGPathElement>(
          "[data-services-arc-path]",
        );
        const arcDot = card.querySelector<SVGCircleElement>(
          "[data-services-arc-dot]",
        );
        let arcDrawn = false;

        ScrollTrigger.create({
          trigger: card,
          start: "top 80%",
          end: "top 30%",
          scrub: 0.6,
          onUpdate: (self) => {
            gsap.set(card, {
              "--sweep-x": self.progress,
            } as CSSVarTweenVars);

            if (!arcDrawn && self.progress >= 0.6) {
              arcDrawn = true;
              if (arcPath) {
                gsap.to(arcPath, {
                  strokeDashoffset: 0,
                  duration: 0.6,
                  ease: "power2.out",
                });
              }
              if (arcDot) {
                gsap.to(arcDot, {
                  opacity: 1,
                  duration: 0.2,
                  delay: 0.4,
                  ease: "power2.out",
                });
              }
            }
          },
        });
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return null;
}
