"use client";

/**
 * useMagnetic — pointer-reactive pull for a DOM element + inner label.
 *
 * Pulls `el` and (optionally) `inner` toward the cursor with lerp smoothing.
 * Gated by `(prefers-reduced-motion: reduce)` and `(pointer: coarse)` — on
 * touch devices or when reduced motion is requested, the hook no-ops.
 *
 * Contract:
 *  - `ref` attaches to the outer element (the magnetic shell).
 *  - `innerRef` attaches to the optional inner label that pulls 2x harder
 *    than the shell, creating parallax separation.
 *  - `strength` is the max outer-translation in px at the cursor edge.
 *    Inner label pulls 2× that. Default 10. Solid CTAs feel right around
 *    14, outline / ghost CTAs around 10, text links around 6.
 *
 * Teardown: removes listeners, cancels RAF, resets transforms. Safe to
 * unmount mid-animation.
 */

import { useEffect, useRef } from "react";

type Options = {
  /** Max outer translation in px. Default 10. */
  strength?: number;
  /**
   * Whether to also write the pointer position into CSS vars `--fx` / `--fy`
   * as percentages, for gold-fill hover seeds. Default true.
   */
  writeFillVars?: boolean;
};

export function useMagnetic<T extends HTMLElement = HTMLElement>(
  options: Options = {},
): {
  ref: React.RefObject<T | null>;
  innerRef: React.RefObject<HTMLElement | null>;
} {
  const { strength = 10, writeFillVars = true } = options;

  const ref = useRef<T | null>(null);
  const innerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");

    // Gate. If either condition is true we skip the effect entirely.
    // We DO re-subscribe to the media queries so if a user e.g. pairs a
    // mouse to a tablet mid-session the magnetic effect activates on
    // remount (we keep this simple — no hot re-enable without remount).
    if (reduced.matches || coarse.matches) return;

    const inner = innerRef.current;

    let rect: DOMRect | null = null;
    let raf: number | null = null;
    let inside = false;

    let tx = 0;
    let ty = 0;
    let ix = 0;
    let iy = 0;
    let targetX = 0;
    let targetY = 0;
    let targetIX = 0;
    let targetIY = 0;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const measure = () => {
      rect = el.getBoundingClientRect();
    };

    const loop = () => {
      tx = lerp(tx, targetX, 0.22);
      ty = lerp(ty, targetY, 0.22);
      ix = lerp(ix, targetIX, 0.22);
      iy = lerp(iy, targetIY, 0.22);

      el.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${inside ? 1.02 : 1})`;
      if (inner) {
        inner.style.transform = `translate(${ix.toFixed(2)}px, ${iy.toFixed(2)}px)`;
      }

      const settled =
        Math.abs(tx - targetX) < 0.1 &&
        Math.abs(ty - targetY) < 0.1 &&
        Math.abs(ix - targetIX) < 0.1 &&
        Math.abs(iy - targetIY) < 0.1;

      if (!settled) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    };

    const kick = () => {
      if (raf === null) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      if (!rect) measure();
      if (!rect) return;

      const nx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const ny = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

      // clamp nx/ny to [-1, 1] — prevents overshoot if the pointer leaves
      // the box faster than the rect refresh catches up.
      const cx = Math.max(-1, Math.min(1, nx));
      const cy = Math.max(-1, Math.min(1, ny));

      targetIX = cx * strength;
      targetIY = cy * strength;
      // Outer shell pulls half as hard as the inner label → parallax.
      targetX = targetIX * 0.5;
      targetY = targetIY * 0.5;

      if (writeFillVars) {
        const px = ((e.clientX - rect.left) / rect.width) * 100;
        const py = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty("--fx", `${px.toFixed(1)}%`);
        el.style.setProperty("--fy", `${py.toFixed(1)}%`);
      }

      kick();
    };

    const onEnter = () => {
      measure();
      inside = true;
      kick();
    };

    const onLeave = () => {
      inside = false;
      targetX = 0;
      targetY = 0;
      targetIX = 0;
      targetIY = 0;

      // Slightly longer eased return gives the "rubber band snap" feel.
      el.style.transition =
        "transform 480ms cubic-bezier(.22,1,.36,1), border-color 280ms ease, color 280ms ease, background 280ms ease, box-shadow 280ms ease";
      if (inner) {
        inner.style.transition = "transform 480ms cubic-bezier(.22,1,.36,1)";
      }

      requestAnimationFrame(() => {
        el.style.transform = "translate(0,0) scale(1)";
        if (inner) inner.style.transform = "translate(0,0)";
        tx = ty = ix = iy = 0;
      });

      const clear = window.setTimeout(() => {
        el.style.transition = "";
        if (inner) inner.style.transition = "";
      }, 520);

      return () => window.clearTimeout(clear);
    };

    const onFocus = () => {
      el.style.transition =
        "transform 280ms cubic-bezier(.22,1,.36,1), border-color 280ms ease, color 280ms ease, background 280ms ease, box-shadow 280ms ease";
      if (inner) {
        inner.style.transition = "transform 280ms cubic-bezier(.22,1,.36,1)";
      }
      el.style.transform = "translate(0,-2px) scale(1.01)";
    };

    const onBlur = () => {
      el.style.transform = "";
      if (inner) inner.style.transform = "";
      window.setTimeout(() => {
        el.style.transition = "";
        if (inner) inner.style.transition = "";
      }, 300);
    };

    const onResize = () => measure();
    const onScroll = () => measure();

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("focus", onFocus);
    el.addEventListener("blur", onBlur);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("focus", onFocus);
      el.removeEventListener("blur", onBlur);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
      el.style.transform = "";
      el.style.transition = "";
      if (inner) {
        inner.style.transform = "";
        inner.style.transition = "";
      }
    };
  }, [strength, writeFillVars]);

  return { ref, innerRef };
}
