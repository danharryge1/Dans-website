"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
    const form = section.querySelector<HTMLElement>("form");
    const fields = Array.from(
      section.querySelectorAll<HTMLElement>("[data-contact-field]"),
    );
    const submit = section.querySelector<HTMLElement>("[data-contact-submit]");

    const ctx = gsap.context(() => {
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
    };
  }, []);

  return null;
}
