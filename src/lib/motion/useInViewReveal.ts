"use client";

/**
 * useInViewReveal — GSAP-free one-shot reveal triggered by IntersectionObserver.
 *
 * Use when a section wants cheap CSS-var-driven reveals without pulling in
 * ScrollTrigger. Writes `--reveal: 0|1` onto the element and fires `onEnter`
 * once. CSS consumes `--reveal` (via calc / opacity / transform).
 *
 * This is the fallback driver for the Tap-to-Sink and Sign-the-Page hooks.
 * For pinned / scrub-linked behaviour, keep using ScrollTrigger directly.
 */

import { useEffect, useRef } from "react";

type Options = {
  /** 0..1 — how much of the element must be visible. Default 0.25. */
  threshold?: number;
  /** CSS margin string for the observer. Default "0px". */
  rootMargin?: string;
};

export function useInViewReveal<T extends HTMLElement = HTMLElement>(
  onEnter?: (el: T) => void,
  { threshold = 0.25, rootMargin = "0px" }: Options = {},
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined") return;

    // Set the initial CSS var — CSS should pair against [data-reveal="0"]
    // or consume `--reveal` directly.
    el.style.setProperty("--reveal", "0");
    el.dataset.reveal = "0";

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      el.style.setProperty("--reveal", "1");
      el.dataset.reveal = "1";
      onEnter?.(el);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) return;
        el.style.setProperty("--reveal", "1");
        el.dataset.reveal = "1";
        onEnter?.(el);
        io.disconnect();
      },
      { threshold, rootMargin },
    );
    io.observe(el);

    return () => {
      io.disconnect();
    };
  }, [onEnter, threshold, rootMargin]);

  return ref;
}
