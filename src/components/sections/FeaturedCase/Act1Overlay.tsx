"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Side = "draft" | "reality";

export function Act1Overlay() {
  const [active, setActive] = useState<Side | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    const check = () => {
      const el = ref.current;
      if (!el) return;
      const opacity = parseFloat(getComputedStyle(el).opacity);
      if (opacity < 0.5) {
        setActive(null);
        return;
      }
      const rect = el.getBoundingClientRect();
      if (rect.bottom < window.innerHeight * 0.3) setActive(null);
    };
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [active]);

  return (
    <div ref={ref} data-case-act="1" className="absolute inset-0 z-10">
      {/* Draft — same height as reality, centred in full overlay */}
      {active === "draft" && (
        <div className="pointer-events-none absolute inset-x-0 bottom-8 top-[96px] flex items-center justify-center md:bottom-12 md:top-[104px]">
          <div
            className="relative overflow-hidden"
            style={{
              boxShadow:
                "0 0 0 1px rgba(200,165,92,0.3), 0 40px 80px -16px rgba(0,0,0,0.75)",
            }}
          >
            <Image
              src="/assets/hero/nextup-old.webp"
              alt=""
              aria-hidden
              width={1820}
              height={1024}
              priority
              style={{
                display: "block",
                width: "auto",
                height: "calc(100vh - 160px)",
                maxWidth: "calc(100vw - 280px)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.38) 100%)",
              }}
            />
          </div>
        </div>
      )}

      {/* Reality — centred in full overlay */}
      {active === "reality" && (
        <div className="pointer-events-none absolute inset-x-0 bottom-8 top-[96px] flex items-center justify-center md:bottom-12 md:top-[104px]">
          <div
            className="relative overflow-hidden"
            style={{
              boxShadow:
                "0 0 0 1px rgba(200,165,92,0.3), 0 40px 80px -16px rgba(0,0,0,0.75)",
            }}
          >
            <RealityVideo />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.35) 100%)",
              }}
            />
          </div>
        </div>
      )}

      <div className="absolute inset-y-0 left-6 flex flex-col justify-center md:left-12">
        <p
          className="mb-2 font-[var(--font-comico)] text-[28px] uppercase tracking-[0.05em] md:text-[40px]"
          style={{ color: "var(--text-primary)" }}
        >
          NEXTUP 2026
        </p>
        <p
          className="font-[var(--font-marker)] text-[15px] leading-[1.5] md:text-[18px]"
          style={{ color: "var(--text-secondary)" }}
        >
          My company. I designed it, built it, ship to it.
        </p>
      </div>

      <div className="absolute inset-y-0 right-4 flex flex-col items-end justify-center md:right-12">
        <div className="flex items-center gap-2 md:gap-4">
          <ChipButton
            label="DRAFT"
            thumb="/assets/hero/nextup-old.webp"
            active={active === "draft"}
            onClick={() => setActive(active === "draft" ? null : "draft")}
          />
          <span
            aria-hidden="true"
            className="font-[var(--font-marker)] text-[14px]"
            style={{ color: "var(--gold-accent)" }}
          >
            →
          </span>
          <ChipButton
            label="REALITY"
            thumb="/assets/hero/nextup-intro-poster.jpg"
            active={active === "reality"}
            onClick={() => setActive(active === "reality" ? null : "reality")}
          />
          {active ? (
            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label="Return to default backdrop"
              className="ml-1 flex h-7 w-7 items-center justify-center rounded-full border font-[var(--font-marker)] text-[16px] leading-none transition-transform hover:scale-110 md:ml-2"
              style={{
                borderColor: "var(--gold-accent)",
                color: "var(--text-primary)",
                backgroundColor: "rgba(200,165,92,0.10)",
              }}
            >
              ×
            </button>
          ) : null}
        </div>

        {!active ? (
          <p
            aria-hidden="true"
            className="mt-3 font-[var(--font-marker)] text-[13px] tracking-[0.18em] md:text-[15px]"
            style={{ color: "var(--gold-accent)", opacity: 0.75 }}
          >
            ← tap to compare
          </p>
        ) : null}
      </div>
    </div>
  );
}

function RealityVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.currentTime = 0;
    v.load();
    v.play().catch(() => {});
  }, []);

  return (
    <video
      ref={ref}
      aria-hidden
      muted
      loop
      playsInline
      preload="auto"
      poster="/assets/hero/nextup-intro-poster.jpg"
      style={{ display: "block", width: "auto", height: "calc(100vh - 160px)", maxWidth: "calc(100vw - 280px)" }}
    >
      <source src="/assets/hero/nextup-intro.mp4" type="video/mp4" />
    </video>
  );
}

function ChipButton({
  label,
  thumb,
  active,
  onClick,
}: {
  label: string;
  thumb: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="group flex cursor-pointer flex-col items-center gap-1 focus:outline-none"
    >
      <div
        className="relative h-[80px] w-[80px] overflow-hidden border transition-all duration-300 group-hover:scale-105 md:h-[96px] md:w-[96px]"
        style={{
          borderColor: active ? "var(--gold-accent)" : "rgba(200,165,92,0.55)",
          boxShadow: active
            ? "0 0 0 1px var(--gold-accent), 0 4px 14px rgba(200,165,92,0.25)"
            : "0 1px 6px rgba(0,0,0,0.25)",
        }}
      >
        <Image
          src={thumb}
          alt=""
          aria-hidden={true}
          width={96}
          height={96}
          className="h-full w-full object-cover"
        />
      </div>
      <span
        className="font-[var(--font-marker)] text-[13px] tracking-[0.1em] transition-colors md:text-[14px]"
        style={{
          color: active ? "var(--gold-accent)" : "var(--text-secondary)",
        }}
      >
        {label}
      </span>
    </button>
  );
}
