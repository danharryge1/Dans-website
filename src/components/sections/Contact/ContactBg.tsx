"use client";

import { useEffect, useRef } from "react";

const OVERLAYS = [
  // step 1 — teal warmth bleeds in
  "linear-gradient(145deg, transparent 0%, rgba(11,72,58,0.65) 55%, rgba(13,84,76,0.45) 100%)",
  // step 2 — gold undertone layers on top
  "linear-gradient(145deg, rgba(200,165,92,0.14) 0%, transparent 45%, rgba(140,100,18,0.18) 100%)",
] as const;

export function ContactBg() {
  const refs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];

  useEffect(() => {
    const handler = (e: Event) => {
      const step = (e as CustomEvent<{ step: number }>).detail.step;
      refs.forEach((ref, i) => {
        if (!ref.current) return;
        ref.current.style.opacity = step > i ? "1" : "0";
      });
    };
    window.addEventListener("contact-step", handler);
    return () => window.removeEventListener("contact-step", handler);
  // refs are stable — intentionally omitted from dep array
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {OVERLAYS.map((bg, i) => (
        <div
          key={i}
          ref={refs[i]}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ opacity: 0, transition: "opacity 1.1s ease", background: bg }}
        />
      ))}
    </>
  );
}
