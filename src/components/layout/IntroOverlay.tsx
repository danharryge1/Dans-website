"use client";

import { useEffect, useState } from "react";

const TEXT = "average is invisible.";

export function IntroOverlay() {
  const [displayed, setDisplayed] = useState("");
  const [cursorOn, setCursorOn] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const [phase, setPhase] = useState<"in" | "fading" | "gone">("in");

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, []);

  useEffect(() => {
    let charIndex = 0;
    let typeInterval: ReturnType<typeof setInterval>;
    let blinkInterval: ReturnType<typeof setInterval>;
    let buttonTimer: ReturnType<typeof setTimeout>;

    const startTimer = setTimeout(() => {
      typeInterval = setInterval(() => {
        charIndex++;
        setDisplayed(TEXT.slice(0, charIndex));
        if (charIndex >= TEXT.length) {
          clearInterval(typeInterval);
          let blinks = 0;
          blinkInterval = setInterval(() => {
            setCursorOn((v) => !v);
            blinks++;
            if (blinks >= 6) {
              clearInterval(blinkInterval);
              setCursorOn(false);
              buttonTimer = setTimeout(() => setShowButton(true), 300);
            }
          }, 300);
        }
      }, 60);
    }, 800);

    return () => {
      clearTimeout(startTimer);
      clearInterval(typeInterval!);
      clearInterval(blinkInterval!);
      clearTimeout(buttonTimer!);
    };
  }, []);

  const enter = () => {
    document.querySelectorAll<HTMLVideoElement>("video").forEach((v) => {
      v.play().catch(() => {});
    });
    document.body.classList.remove("overflow-hidden");
    setPhase("fading");
  };

  if (phase === "gone") return null;

  return (
    <div
      onTransitionEnd={() => {
        if (phase === "fading") setPhase("gone");
      }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{
        backgroundColor: "#070d0b",
        opacity: phase === "fading" ? 0 : 1,
        transition: "opacity 0.65s ease",
        pointerEvents: phase === "fading" ? "none" : undefined,
      }}
    >
      {/* Tagline */}
      <p
        className="mb-10 text-[clamp(14px,2vw,20px)] tracking-[0.05em]"
        style={{
          fontFamily: "var(--font-marker)",
          color: "var(--text-secondary)",
          minHeight: "1.6em",
        }}
      >
        {displayed}
        <span style={{ opacity: cursorOn ? 1 : 0, marginLeft: "2px" }}>|</span>
      </p>

      {/* Enter button */}
      <button
        onClick={enter}
        aria-label="Enter site"
        className="flex items-center gap-2.5 rounded-sm px-7 py-3 text-[13px] uppercase tracking-[0.28em] hover:translate-x-0.5"
        style={{
          fontFamily: "var(--font-marker)",
          color: "var(--gold-accent)",
          border: "1px solid rgba(200,165,92,0.35)",
          background: "none",
          cursor: "pointer",
          opacity: showButton ? 1 : 0,
          pointerEvents: showButton ? undefined : "none",
          transition: "opacity 0.4s ease, transform 0.2s ease",
        }}
      >
        <svg width="9" height="11" viewBox="0 0 9 11" fill="currentColor" aria-hidden="true">
          <path d="M0 0 L9 5.5 L0 11 Z" />
        </svg>
        ENTER
      </button>
    </div>
  );
}
