"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function PhilosophyClient() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const section = document.getElementById("philosophy");
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const eyebrow = section.querySelector<HTMLElement>(
      "[data-philosophy-eyebrow]",
    );
    const blocks = Array.from(
      section.querySelectorAll<HTMLElement>("[data-philosophy-block]"),
    );

    const ctx = gsap.context(() => {
      // Eyebrow entrance
      if (eyebrow) {
        gsap.set(eyebrow, { opacity: 0, y: 8 });
        ScrollTrigger.create({
          trigger: eyebrow,
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.to(eyebrow, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
            });
          },
        });
      }

      // Per-block entrance
      blocks.forEach((block) => {
        const headline = block.querySelector<HTMLElement>("h3");
        const rule = block.querySelector<HTMLElement>(
          "[data-philosophy-rule]",
        );
        const body = block.querySelector<HTMLElement>("p");

        // Capture the rule's final width from the computed style so we can
        // animate from 0 → final without hard-coding breakpoint values.
        const finalRuleWidth = rule
          ? window.getComputedStyle(rule).width
          : "0px";

        if (headline) gsap.set(headline, { opacity: 0, y: 24 });
        if (body) gsap.set(body, { opacity: 0, y: 24 });
        if (rule) gsap.set(rule, { width: 0 });

        ScrollTrigger.create({
          trigger: block,
          start: "top 80%",
          once: true,
          onEnter: () => {
            // Tap-to-Sink stamp — drives the `philosophy-sink` keyframe on
            // the h3. The y-tween below stays for layout parity with the
            // other elements, but the sink animation takes visual lead.
            block.dataset.reveal = "1";
            if (headline) {
              gsap.to(headline, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: "power2.out",
              });
            }
            if (body) {
              gsap.to(body, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                delay: 0.08,
                ease: "power2.out",
              });
            }
            if (rule) {
              gsap.to(rule, {
                width: finalRuleWidth,
                duration: 0.6,
                delay: 0.15,
                ease: "power2.out",
              });
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
