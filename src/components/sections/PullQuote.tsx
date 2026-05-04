"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function PullQuote() {
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const topRef = useRef<HTMLSpanElement>(null);
  const bottomRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const q = quoteRef.current;
    if (!q) return;

    const ctx = gsap.context(() => {
      // Rules draw in
      [topRef.current, bottomRef.current].forEach((rule) => {
        if (!rule) return;
        gsap.fromTo(
          rule,
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1,
            opacity: 0.35,
            duration: 0.7,
            ease: "power2.inOut",
            scrollTrigger: { trigger: rule, start: "top 85%", once: true },
          },
        );
      });

      // Eyebrow fade
      if (eyebrowRef.current) {
        gsap.fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 6 },
          {
            opacity: 0.65,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: eyebrowRef.current,
              start: "top 82%",
              once: true,
            },
          },
        );
      }

      // Quote — clip-path curtain lift
      gsap.fromTo(
        q,
        { clipPath: "inset(0 0 100% 0)", opacity: 0 },
        {
          clipPath: "inset(0 0 0% 0)",
          opacity: 1,
          duration: 0.95,
          ease: "power2.out",
          scrollTrigger: { trigger: q, start: "top 78%", once: true },
        },
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      aria-label="Studio philosophy"
      className="w-full px-6 py-20 md:py-32"
      style={{ background: "#070d0b" }}
    >
      <div className="mx-auto max-w-[1400px]">
        <span
          ref={topRef}
          aria-hidden="true"
          className="mb-8 block h-px w-full origin-left md:mb-12"
          style={{ background: "var(--gold-accent)", opacity: 0 }}
        />

        <p
          ref={eyebrowRef}
          className="mb-5 font-[var(--font-marker)] text-[11px] uppercase tracking-[0.24em] md:mb-6"
          style={{ color: "var(--gold-accent)", opacity: 0 }}
        >
          The Studio
        </p>

        <blockquote
          ref={quoteRef}
          className="font-[var(--font-comico)] uppercase leading-[1.0] tracking-[-0.01em]"
          style={{ fontSize: "clamp(2.6rem, 11vw, 7rem)" }}
        >
          <span style={{ color: "var(--gold-accent)" }}>Fewer</span>
          <span style={{ color: "var(--text-primary)" }}> hands.</span>
          <br />
          <span style={{ color: "var(--gold-accent)" }}>More</span>
          <span style={{ color: "var(--text-primary)" }}> care.</span>
        </blockquote>

        <span
          ref={bottomRef}
          aria-hidden="true"
          className="mt-8 block h-px w-full origin-left md:mt-12"
          style={{ background: "var(--gold-accent)", opacity: 0 }}
        />
      </div>
    </section>
  );
}
