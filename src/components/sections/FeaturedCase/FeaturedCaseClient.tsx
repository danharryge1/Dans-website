"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function FeaturedCaseClient() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const section = document.getElementById("case-study-nextup");
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;

    if (prefersReducedMotion || !isDesktop) return;

    const pin = section.querySelector<HTMLElement>("[data-case-pin]");
    const gradient = section.querySelector<HTMLElement>(
      "[data-case-gradient]",
    );
    const act1 = section.querySelector<HTMLElement>('[data-case-act="1"]');
    const act2 = section.querySelector<HTMLElement>('[data-case-act="2"]');
    const act3 = section.querySelector<HTMLElement>('[data-case-act="3"]');
    const beats = Array.from(
      section.querySelectorAll<HTMLElement>("[data-case-beat]"),
    );

    if (!pin || !act2 || beats.length < 3) return;

    const beatVideos = beats.flatMap((beat) =>
      Array.from(beat.querySelectorAll<HTMLVideoElement>("video")),
    );
    beatVideos.forEach((v) => {
      const playPromise = v.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
    });

    const ctx = gsap.context(() => {
      gsap.set(act2, {
        position: "absolute",
        inset: 0,
        margin: 0,
        padding: 0,
        maxWidth: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      });
      beats.forEach((beat) => {
        gsap.set(beat, {
          position: "absolute",
          inset: 0,
          margin: "auto",
          maxWidth: "1400px",
          paddingLeft: "3rem",
          paddingRight: "3rem",
          opacity: 0,
          y: 40,
          alignContent: "center",
          pointerEvents: "none",
        });
      });
      if (act3)
        gsap.set(act3, {
          opacity: 0,
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        });
      if (act1) gsap.set(act1, { opacity: 1 });
      if (gradient) gsap.set(gradient, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: "+=500%",
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
        },
      });

      tl.addLabel("act-1-end", 0.1);
      if (act1) tl.to(act1, { opacity: 0, duration: 0.08 }, "act-1-end");

      tl.addLabel("beat-01", 0.2);
      tl.to(beats[0], { opacity: 1, y: 0, duration: 0.12 }, "beat-01");
      tl.to(beats[0], { opacity: 0, y: -40, duration: 0.08 }, "beat-01+=0.2");

      tl.addLabel("beat-02", 0.4);
      tl.fromTo(
        beats[1],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.12 },
        "beat-02",
      );
      tl.to(beats[1], { opacity: 0, y: -40, duration: 0.08 }, "beat-02+=0.2");

      tl.addLabel("beat-03", 0.6);
      tl.fromTo(
        beats[2],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.12 },
        "beat-03",
      );
      tl.to(beats[2], { opacity: 0, y: -40, duration: 0.08 }, "beat-03+=0.2");

      tl.addLabel("act-3-start", 0.85);
      if (gradient)
        tl.to(gradient, { opacity: 1, duration: 0.12 }, "act-3-start");
      if (act3)
        tl.to(
          act3,
          { opacity: 1, pointerEvents: "auto", duration: 0.08 },
          "act-3-start",
        );
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return null;
}
