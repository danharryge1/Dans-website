"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// Tighter type for tweens that set CSS custom properties.
// Avoids broad `as gsap.TweenVars` casts at call sites.
type CSSVarTweenVars = gsap.TweenVars & Record<`--${string}`, string | number>;

export function HeroClient() {
  useEffect(() => {
    // Register inside useEffect so it only runs in a browser context.
    // Safe to call multiple times — GSAP deduplicates registrations.
    gsap.registerPlugin(ScrollTrigger);
    const section = document.getElementById("hero");
    if (!section) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const desktop = window.matchMedia("(min-width: 768px)").matches;

    // Reduced motion: skip autoplay, snap reveal in 600ms, stop here.
    // No Lenis, no ScrollTrigger, no float tween. Sparkles + side-labels land
    // in the same end-state as scroll-complete so reduced-motion users are not
    // stuck with `opacity: 0` inline markup that scroll-driven tweens normally
    // flip.
    if (reduced) {
      gsap.to(section, {
        duration: 0.6,
        delay: 0.2,
        "--hero-progress": 1,
        "--seam-x": "100%",
        ease: "power2.out",
      } as CSSVarTweenVars);

      const reducedSparkles = section.querySelectorAll<HTMLElement>(
        "[data-hero-sparkle]",
      );
      if (reducedSparkles.length > 0) {
        gsap.to(reducedSparkles, {
          opacity: 1,
          duration: 0.6,
          delay: 0.2,
          ease: "power2.out",
        });
      }

      const reducedSideLabels = section.querySelectorAll<HTMLElement>(
        "[data-hero-side-label]",
      );
      if (reducedSideLabels.length > 0) {
        gsap.to(reducedSideLabels, {
          opacity: 0,
          duration: 0.6,
          delay: 0.2,
          ease: "power2.out",
        });
      }
      return;
    }

    // Float animation: infinite y oscillation on laptop mockup element.
    // Created outside gsap.context because it's not ScrollTrigger-driven;
    // must be killed manually in cleanup.
    const laptop = section.querySelector<HTMLElement>("[data-hero-laptop]");
    const floatTween =
      laptop &&
      gsap.to(laptop, {
        y: -8,
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

    // Lenis + GSAP ticker coordination (desktop only).
    // Mobile uses native scroll — Lenis causes jank on touch devices.
    let lenis: Lenis | null = null;
    let rafHandler: ((time: number) => void) | null = null;
    if (desktop) {
      lenis = new Lenis();
      lenis.on("scroll", ScrollTrigger.update);
      rafHandler = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(rafHandler);
      gsap.ticker.lagSmoothing(0);
    }

    const sparkles = Array.from(
      section.querySelectorAll<HTMLElement>("[data-hero-sparkle]"),
    );
    const sideLabels = Array.from(
      section.querySelectorAll<HTMLElement>("[data-hero-side-label]"),
    );

    // Hoisted so cleanup can disconnect even if the component unmounts
    // before the observer fires. `ctx.revert()` does NOT clean up raw
    // IntersectionObservers, so leaving it inside gsap.context would leak.
    let io: IntersectionObserver | null = null;

    const ctx = gsap.context(() => {
      if (desktop) {
        // Desktop: scrubbed ScrollTrigger timeline — all tweens share one master trigger.
        // Pin for one viewport of scroll so the scrub has full runway to sweep the seam
        // across the width, regardless of total page length.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=100%",
            scrub: 0.6,
            pin: true,
            pinSpacing: true,
          },
        });

        tl.to(
          section,
          {
            "--hero-progress": 1,
            "--seam-x": "100%",
            ease: "none",
          } as CSSVarTweenVars,
          0,
        );

        // Sparkle stagger keyed off --sparkle-delay set by HeroSparkles.
        sparkles.forEach((sparkle, i) => {
          const delay = Number(
            getComputedStyle(sparkle).getPropertyValue("--sparkle-delay") ||
              i * 0.04,
          );
          tl.to(
            sparkle,
            { opacity: 1, duration: 0.4, ease: "power2.out" },
            0.4 + delay,
          );
        });

        // Side labels fade out as scroll approaches the end (progress ≥ 0.9).
        tl.to(sideLabels, { opacity: 0, ease: "none" }, 0.9);
      } else {
        // Mobile: one-shot IntersectionObserver reveal — no scroll coupling.
        io = new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) {
              const tl = gsap.timeline();

              tl.to(
                section,
                {
                  "--hero-progress": 1,
                  "--seam-x": "100%",
                  duration: 1.8,
                  ease: "power3.out",
                } as CSSVarTweenVars,
                0,
              );

              sparkles.forEach((sparkle, i) => {
                tl.to(
                  sparkle,
                  { opacity: 1, duration: 0.4, ease: "power2.out" },
                  0.9 + i * 0.04,
                );
              });

              tl.to(sideLabels, { opacity: 0, duration: 0.3 }, 1.5);

              // Disconnect after first fire — one-shot only.
              io?.disconnect();
            }
          },
          { threshold: 0.3 },
        );
        io.observe(section);
      }
    }, section);

    return () => {
      ctx.revert();
      if (floatTween) floatTween.kill();
      if (rafHandler) gsap.ticker.remove(rafHandler);
      if (lenis) lenis.destroy();
      // Idempotent — safe if the observer already self-disconnected.
      if (io) io.disconnect();
    };
  }, []);

  return null;
}
