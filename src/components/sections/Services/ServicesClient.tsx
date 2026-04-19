"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type CSSVarTweenVars = gsap.TweenVars & Record<`--${string}`, string | number>;

gsap.registerPlugin(ScrollTrigger);

export function ServicesClient() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const section = document.getElementById("services");
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;

    // IO hoisted OUTSIDE gsap.context — raw DOM observers aren't tracked by ctx.revert().
    let io: IntersectionObserver | null = null;
    const floatTweens: gsap.core.Tween[] = [];

    if (prefersReducedMotion) {
      return () => {
        // nothing to tear down
      };
    }

    const cards = Array.from(
      section.querySelectorAll<HTMLElement>("[data-services-card]"),
    );
    const heading = section.querySelector<HTMLElement>(
      "[data-services-heading]",
    );

    const ctx = gsap.context(() => {
      // reset each card to dim before animating in
      cards.forEach((card) => {
        gsap.set(card, { "--sweep-x": 0 } as CSSVarTweenVars);
      });

      if (isDesktop) {
        // header reveal
        if (heading) {
          gsap.set(heading, {
            y: 16,
            opacity: 0,
            letterSpacing: "0.08em",
          });
          ScrollTrigger.create({
            trigger: heading,
            start: "top 75%",
            once: true,
            onEnter: () => {
              gsap.to(heading, {
                y: 0,
                opacity: 1,
                letterSpacing: "0.05em",
                duration: 0.6,
                ease: "power2.out",
              });
            },
          });
        }

        // per-card scroll-linked sweep
        cards.forEach((card) => {
          const arcPath = card.querySelector<SVGPathElement>(
            "[data-services-arc-path]",
          );
          const arcDot = card.querySelector<SVGCircleElement>(
            "[data-services-arc-dot]",
          );
          let arcDrawn = false;
          // Ledger stamp — fires once when the card enters the viewport.
          // Toggling [data-reveal=1] drives the `ledger-stamp` keyframe in
          // globals.css. Independent of scrub so the stamp feels decisive.
          let stamped = false;

          ScrollTrigger.create({
            trigger: card,
            start: "top 80%",
            end: "top 30%",
            scrub: 0.6,
            onUpdate: (self) => {
              gsap.set(card, {
                "--sweep-x": self.progress,
              } as CSSVarTweenVars);

              if (!stamped && self.progress > 0) {
                stamped = true;
                card.dataset.reveal = "1";
              }

              if (!arcDrawn && self.progress >= 0.6) {
                arcDrawn = true;
                if (arcPath) {
                  gsap.to(arcPath, {
                    strokeDashoffset: 0,
                    duration: 0.6,
                    ease: "power2.out",
                  });
                }
                if (arcDot) {
                  gsap.to(arcDot, {
                    opacity: 1,
                    duration: 0.2,
                    delay: 0.4,
                    ease: "power2.out",
                  });
                }
              }
            },
          });
        });
      } else {
        // mobile one-shot — scale + opacity initial state; fired by IO below
        if (heading) {
          gsap.set(heading, { y: 12, opacity: 0 });
        }
        cards.forEach((card) => {
          gsap.set(card, { opacity: 0, scale: 0.98 });
        });
      }
    }, section);

    if (!isDesktop) {
      io = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (!entry?.isIntersecting) return;

          const tl = gsap.timeline();

          if (heading) {
            tl.to(heading, {
              y: 0,
              opacity: 1,
              duration: 0.4,
              ease: "power2.out",
            });
          }

          cards.forEach((card, i) => {
            const arcPath = card.querySelector<SVGPathElement>(
              "[data-services-arc-path]",
            );
            const arcDot = card.querySelector<SVGCircleElement>(
              "[data-services-arc-dot]",
            );

            const cardStart = 0.2 + i * 0.2; // 200ms stagger

            // Ledger stamp — mobile one-shot mirrors the desktop behaviour.
            tl.call(
              () => {
                card.dataset.reveal = "1";
              },
              [],
              cardStart,
            );

            tl.to(
              card,
              {
                opacity: 1,
                scale: 1,
                duration: 0.7,
                ease: "power2.out",
              },
              cardStart,
            );

            tl.to(
              card,
              {
                "--sweep-x": 1,
                duration: 0.9,
                ease: "power2.out",
              } as CSSVarTweenVars,
              cardStart,
            );

            if (arcPath) {
              tl.to(
                arcPath,
                {
                  strokeDashoffset: 0,
                  duration: 0.6,
                  ease: "power2.out",
                },
                cardStart + 0.54,
              );
            }
            if (arcDot) {
              tl.to(
                arcDot,
                {
                  opacity: 1,
                  duration: 0.2,
                  ease: "power2.out",
                },
                cardStart + 0.9,
              );
            }
          });

          // post-reveal arc float
          tl.add(() => {
            cards.forEach((card) => {
              const arcSvg = card.querySelector<SVGElement>(
                "[data-services-arc-float]",
              );
              if (arcSvg) {
                floatTweens.push(
                  gsap.to(arcSvg, {
                    y: -1,
                    duration: 2,
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: -1,
                  }),
                );
              }
            });
          });

          // one-shot
          io?.disconnect();
        },
        { threshold: 0.25 },
      );
      io.observe(section);
    }

    return () => {
      ctx.revert();
      if (io) io.disconnect();
      floatTweens.forEach((t) => t.kill());
    };
  }, []);

  return null;
}
