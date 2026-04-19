"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const RESIZE_DEBOUNCE_MS = 150;

export function ProcessClient() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const section = document.getElementById("process");
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const eyebrow = section.querySelector<HTMLElement>(
      "[data-process-eyebrow]",
    );
    const blocks = Array.from(
      section.querySelectorAll<HTMLElement>("[data-process-block]"),
    );
    const threadContainer = section.querySelector<HTMLElement>(
      "[data-process-thread-container]",
    );
    const threadLine = section.querySelector<HTMLElement>(
      "[data-process-thread]",
    );
    const dots = Array.from(
      section.querySelectorAll<HTMLElement>("[data-process-dot]"),
    );

    const positionThread = () => {
      if (!threadContainer || !threadLine || blocks.length === 0) return;
      const offsetParent = threadContainer.offsetParent as HTMLElement | null;
      if (!offsetParent) return;

      const numerals = blocks
        .map((b) => b.querySelector<HTMLElement>("[data-process-numeral]"))
        .filter((n): n is HTMLElement => n !== null);

      if (numerals.length === 0) return;

      const parentRect = offsetParent.getBoundingClientRect();
      const yCenters = numerals.map((n) => {
        const r = n.getBoundingClientRect();
        return r.top + r.height / 2 - parentRect.top;
      });

      const firstY = yCenters[0];
      const lastY = yCenters[yCenters.length - 1];

      threadContainer.style.top = `${firstY}px`;
      threadContainer.style.bottom = "auto";
      threadContainer.style.height = `${lastY - firstY}px`;

      dots.forEach((dot, i) => {
        const relativeY = (yCenters[i] ?? firstY) - firstY;
        dot.style.top = `${relativeY}px`;
      });
    };

    requestAnimationFrame(positionThread);

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const observer = new ResizeObserver(() => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(positionThread, RESIZE_DEBOUNCE_MS);
    });
    observer.observe(section);

    const ctx = gsap.context(() => {
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

      if (threadLine) {
        gsap.set(threadLine, { scaleY: 0, transformOrigin: "top" });
        const scrubTrigger = threadContainer ?? section;
        ScrollTrigger.create({
          trigger: scrubTrigger,
          start: "top 70%",
          end: "bottom 50%",
          scrub: 0.5,
          animation: gsap.to(threadLine, { scaleY: 1, ease: "none" }),
        });
      }

      blocks.forEach((block, i) => {
        const numeral = block.querySelector<HTMLElement>(
          "[data-process-numeral]",
        );
        const title = block.querySelector<HTMLElement>("h3");
        const body = block.querySelector<HTMLElement>("p");
        const dot = dots[i];

        if (numeral) gsap.set(numeral, { opacity: 0, y: 16 });
        if (title) gsap.set(title, { opacity: 0, y: 16 });
        if (body) gsap.set(body, { opacity: 0, y: 16 });
        if (dot) gsap.set(dot, { scale: 0, opacity: 0 });

        ScrollTrigger.create({
          trigger: block,
          start: "top 75%",
          once: true,
          onEnter: () => {
            if (dot) {
              gsap.to(dot, {
                scale: 1,
                opacity: 1,
                duration: 0.4,
                ease: "back.out(1.5)",
              });
            }
            if (numeral) {
              gsap.to(numeral, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                delay: 0.1,
                ease: "power2.out",
              });
            }
            if (title) {
              gsap.to(title, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                delay: 0.18,
                ease: "power2.out",
              });
            }
            if (body) {
              gsap.to(body, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                delay: 0.26,
                ease: "power2.out",
              });
            }
          },
        });
      });
    }, section);

    return () => {
      ctx.revert();
      observer.disconnect();
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  }, []);

  return null;
}
