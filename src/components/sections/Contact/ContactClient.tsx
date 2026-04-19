"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const RESIZE_DEBOUNCE_MS = 150;

export function ContactClient() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const section = document.getElementById("contact");
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const headline = section.querySelector<HTMLElement>(
      "[data-contact-headline]",
    );
    const paragraph = section.querySelector<HTMLElement>(
      "[data-contact-paragraph]",
    );
    const threadContainer = section.querySelector<HTMLElement>(
      "[data-contact-thread-container]",
    );
    const threadLine = section.querySelector<HTMLElement>(
      "[data-contact-thread]",
    );
    const form = section.querySelector<HTMLElement>("form");
    const fields = Array.from(
      section.querySelectorAll<HTMLElement>("[data-contact-field]"),
    );
    const submit = section.querySelector<HTMLElement>("[data-contact-submit]");

    const positionThread = () => {
      if (!threadContainer || !threadLine) return;
      const offsetParent = threadContainer.offsetParent as HTMLElement | null;
      if (!offsetParent) return;

      const parentRect = offsetParent.getBoundingClientRect();
      const containerRect = threadContainer.getBoundingClientRect();

      threadContainer.style.top = `${containerRect.top - parentRect.top}px`;
      threadContainer.style.bottom = "auto";
      threadContainer.style.height = `${containerRect.height}px`;
    };

    requestAnimationFrame(positionThread);

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const observer = new ResizeObserver(() => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(positionThread, RESIZE_DEBOUNCE_MS);
    });
    observer.observe(section);

    const ctx = gsap.context(() => {
      if (threadLine) {
        gsap.set(threadLine, { scaleY: 0, transformOrigin: "top" });
        ScrollTrigger.create({
          trigger: section,
          start: "top 80%",
          end: "bottom 60%",
          scrub: 0.5,
          animation: gsap.to(threadLine, { scaleY: 1, ease: "none" }),
        });
      }

      if (headline) {
        gsap.set(headline, { opacity: 0, y: 16 });
        ScrollTrigger.create({
          trigger: headline,
          start: "top 75%",
          once: true,
          onEnter: () => {
            gsap.to(headline, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power2.out",
            });
          },
        });
      }

      if (paragraph) {
        gsap.set(paragraph, { opacity: 0, y: 16 });
        ScrollTrigger.create({
          trigger: paragraph,
          start: "top 75%",
          once: true,
          onEnter: () => {
            gsap.to(paragraph, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              delay: 0.12,
              ease: "power2.out",
            });
          },
        });
      }

      const revealTargets = [...fields];
      if (submit) revealTargets.push(submit);
      revealTargets.forEach((el) => {
        gsap.set(el, { opacity: 0, y: 16 });
      });

      if (form && revealTargets.length > 0) {
        ScrollTrigger.create({
          trigger: form,
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.to(revealTargets, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              stagger: 0.08,
            });
          },
        });
      }
    }, section);

    return () => {
      ctx.revert();
      observer.disconnect();
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  }, []);

  return null;
}
