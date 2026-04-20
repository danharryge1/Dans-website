"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MagneticButton } from "@/lib/motion/MagneticButton";

const TEXT = "average is invisible.";
const SEEN_KEY = "intro-seen";

export function IntroOverlay() {
  const [mounted, setMounted] = useState(false);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem(SEEN_KEY)) setSeen(true);
  }, []);

  if (!mounted || seen) return null;

  return createPortal(<IntroOverlayInner />, document.body);
}

function IntroOverlayInner() {
  const [displayed, setDisplayed] = useState("");
  const [cursorOn, setCursorOn] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const [phase, setPhase] = useState<"in" | "fading" | "gone">("in");

  useEffect(() => {
    document.body.classList.add("overflow-hidden");

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
            if (blinks >= 2) {
              clearInterval(blinkInterval);
              setCursorOn(false);
              buttonTimer = setTimeout(() => setShowButton(true), 100);
            }
          }, 300);
        }
      }, 90);
    }, 800);

    return () => {
      document.body.classList.remove("overflow-hidden");
      clearTimeout(startTimer);
      clearInterval(typeInterval!);
      clearInterval(blinkInterval!);
      clearTimeout(buttonTimer!);
    };
  }, []);

  const enter = () => {
    sessionStorage.setItem(SEEN_KEY, "1");
    document.documentElement.style.background = "";
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

      {/* Opacity wrapper — MagneticButton doesn't accept a style prop */}
      <div
        style={{
          opacity: showButton ? 1 : 0,
          pointerEvents: showButton ? undefined : "none",
          transition: "opacity 0.4s ease",
        }}
      >
        <MagneticButton
          onClick={enter}
          variant="outline"
          arrow={false}
          strength={16}
          aria-label="Enter site"
        >
          <svg width="9" height="11" viewBox="0 0 9 11" fill="currentColor" aria-hidden="true">
            <path d="M0 0 L9 5.5 L0 11 Z" />
          </svg>
          ENTER
        </MagneticButton>
      </div>
    </div>
  );
}
