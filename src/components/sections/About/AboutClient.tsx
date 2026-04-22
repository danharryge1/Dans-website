"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function AboutClient() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const section = document.getElementById("about");
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const eyebrow = section.querySelector<HTMLElement>("[data-about-eyebrow]");
    const name = section.querySelector<HTMLElement>("[data-about-name]");
    const subtitle = section.querySelector<HTMLElement>("[data-about-subtitle]");
    const paras = Array.from(
      section.querySelectorAll<HTMLElement>("[data-about-para]"),
    );
    const facts = Array.from(
      section.querySelectorAll<HTMLElement>("[data-about-fact]"),
    );
    const closing = section.querySelector<HTMLElement>("[data-about-closing]");
    const cta = section.querySelector<HTMLElement>("[data-about-cta]");

    const ctx = gsap.context(() => {
      // Eyebrow entrance
      if (eyebrow) {
        gsap.set(eyebrow, { opacity: 0, y: 8 });
        ScrollTrigger.create({
          trigger: eyebrow,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(eyebrow, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
          },
        });
      }

      // Name + subtitle: cinematic reveal from below
      if (name) {
        gsap.set(name, { opacity: 0, y: 48 });
        if (subtitle) gsap.set(subtitle, { opacity: 0, y: 24 });
        ScrollTrigger.create({
          trigger: name,
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.to(name, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" });
            if (subtitle) {
              gsap.to(subtitle, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                delay: 0.15,
                ease: "power2.out",
              });
            }
          },
        });
      }

      // Paragraphs: individual scroll triggers for stagger
      paras.forEach((para, i) => {
        gsap.set(para, { opacity: 0, y: 28 });
        ScrollTrigger.create({
          trigger: para,
          start: "top 82%",
          once: true,
          onEnter: () => {
            gsap.to(para, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              delay: i * 0.1,
              ease: "power2.out",
            });
          },
        });
      });

      // Facts: single trigger on first, stagger rest
      if (facts.length > 0) {
        facts.forEach((fact) => gsap.set(fact, { opacity: 0, y: 20 }));
        ScrollTrigger.create({
          trigger: facts[0],
          start: "top 85%",
          once: true,
          onEnter: () => {
            facts.forEach((fact, i) => {
              gsap.to(fact, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                delay: i * 0.09,
                ease: "power2.out",
              });
            });
          },
        });
      }

      // Closing + CTA
      if (closing) {
        gsap.set(closing, { opacity: 0, y: 28 });
        if (cta) gsap.set(cta, { opacity: 0, y: 16 });
        ScrollTrigger.create({
          trigger: closing,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(closing, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
            if (cta) {
              gsap.to(cta, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                delay: 0.2,
                ease: "power2.out",
              });
            }
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
