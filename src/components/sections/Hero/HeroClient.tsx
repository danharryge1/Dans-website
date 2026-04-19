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

    // Force-play every video in the hero. Retries on canplay, visibilitychange,
    // focus, and first user interaction so Safari's autoplay gating can never
    // leave the video stuck on a poster frame.
    const heroVideos = Array.from(section.querySelectorAll<HTMLVideoElement>("video"));
    const tryPlayVideo = () => heroVideos.forEach((v) => {
      if (v.paused) v.play().catch(() => {});
    });
    tryPlayVideo();
    heroVideos.forEach((v) => {
      v.addEventListener("canplay", tryPlayVideo);
      v.addEventListener("loadeddata", tryPlayVideo);
    });
    const visibilityHandler = () => {
      if (!document.hidden) tryPlayVideo();
    };
    const focusHandler = () => tryPlayVideo();
    const interactionHandler = () => {
      tryPlayVideo();
      window.removeEventListener("pointerdown", interactionHandler);
      window.removeEventListener("keydown", interactionHandler);
      window.removeEventListener("scroll", interactionHandler);
    };
    document.addEventListener("visibilitychange", visibilityHandler);
    window.addEventListener("focus", focusHandler);
    window.addEventListener("pointerdown", interactionHandler, { passive: true });
    window.addEventListener("keydown", interactionHandler);
    window.addEventListener("scroll", interactionHandler, { passive: true });

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

    // Mouse parallax on the laptop — x-only so it doesn't conflict with
    // the float tween which owns y.
    let quickX: ((val: number) => void) | null = null;
    const onHeroMouseMove = desktop && laptop
      ? (e: MouseEvent) => {
          if (!quickX) {
            quickX = gsap.quickTo(laptop, "x", { duration: 0.7, ease: "power2.out" });
          }
          const rect = section.getBoundingClientRect();
          const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
          quickX(nx * -10);
        }
      : null;

    if (onHeroMouseMove) {
      section.addEventListener("mousemove", onHeroMouseMove);
    }

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

    // Seam drag — lets visitors scrub the comparison by grabbing the knob,
    // independent of scroll position. Active on desktop + mobile (touch).
    const knob = section.querySelector<HTMLElement>("[data-hero-knob]");
    const screen = section.querySelector<HTMLElement>("[data-hero-screen]");
    let dragging = false;
    const updateSeamFromX = (clientX: number) => {
      if (!screen) return;
      const rect = screen.getBoundingClientRect();
      const pct = Math.max(
        0,
        Math.min(100, ((clientX - rect.left) / rect.width) * 100),
      );
      section.style.setProperty("--seam-x", `${pct}%`);
    };
    const onKnobDown = (e: PointerEvent) => {
      dragging = true;
      try {
        knob?.setPointerCapture(e.pointerId);
      } catch {
        /* noop — capture not supported */
      }
      e.preventDefault();
    };
    const onKnobMove = (e: PointerEvent) => {
      if (!dragging) return;
      updateSeamFromX(e.clientX);
    };
    const onKnobUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      try {
        knob?.releasePointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
    };
    if (knob) {
      knob.addEventListener("pointerdown", onKnobDown);
      knob.addEventListener("pointermove", onKnobMove);
      knob.addEventListener("pointerup", onKnobUp);
      knob.addEventListener("pointercancel", onKnobUp);
    }

    const ctx = gsap.context(() => {
      if (desktop) {
        // Sparkles fade in on mount (autonomous — not scroll-driven) so motion
        // is visible immediately without waiting for scroll.
        sparkles.forEach((sparkle, i) => {
          const delay = Number(
            getComputedStyle(sparkle).getPropertyValue("--sparkle-delay") ||
              i * 0.04,
          );
          gsap.to(sparkle, {
            opacity: 1,
            duration: 0.6,
            delay: 0.5 + delay * 2,
            ease: "power2.out",
          });
        });

        // Scroll scrub — created synchronously so document height is stable
        // from mount and other ScrollTriggers (services, case-study) can cache
        // correct positions on first refresh.
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

        // Seam opens from its CSS initial 55% to fully revealed.
        tl.fromTo(
          section,
          { "--seam-x": "55%" } as CSSVarTweenVars,
          { "--seam-x": "100%", ease: "none" } as CSSVarTweenVars,
          0,
        );
        // --hero-progress drives scroll hint fade + other scroll-linked bits.
        tl.fromTo(
          section,
          { "--hero-progress": 0 } as CSSVarTweenVars,
          { "--hero-progress": 1, ease: "none" } as CSSVarTweenVars,
          0,
        );
        // Labels fade out once the comparison is nearly fully revealed.
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
      if (io) io.disconnect();
      document.removeEventListener("visibilitychange", visibilityHandler);
      window.removeEventListener("focus", focusHandler);
      window.removeEventListener("pointerdown", interactionHandler);
      window.removeEventListener("keydown", interactionHandler);
      window.removeEventListener("scroll", interactionHandler);
      heroVideos.forEach((v) => {
        v.removeEventListener("canplay", tryPlayVideo);
        v.removeEventListener("loadeddata", tryPlayVideo);
      });
      if (onHeroMouseMove) section.removeEventListener("mousemove", onHeroMouseMove);
      if (knob) {
        knob.removeEventListener("pointerdown", onKnobDown);
        knob.removeEventListener("pointermove", onKnobMove);
        knob.removeEventListener("pointerup", onKnobUp);
        knob.removeEventListener("pointercancel", onKnobUp);
      }
    };
  }, []);

  return null;
}
