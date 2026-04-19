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

  const fullImage =
    active === "draft"
      ? "/assets/hero/nextup-old.webp"
      : active === "reality"
        ? "/assets/hero/nextup-live-poster.webp"
        : null;

  return (
    <div ref={ref} data-case-act="1" className="absolute inset-0 z-10">
      {fullImage ? (
        <div className="pointer-events-none absolute inset-0">
          <Image
            src={fullImage}
            alt=""
            aria-hidden={true}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.55) 100%)",
            }}
          />
        </div>
      ) : null}

      <div className="absolute bottom-10 left-6 md:bottom-16 md:left-12">
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

      <div className="absolute right-4 top-8 flex items-center gap-2 md:right-12 md:top-16 md:gap-4">
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
          thumb="/assets/hero/nextup-live-poster.webp"
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
          className="absolute right-4 top-[84px] font-[var(--font-marker)] text-[10px] tracking-[0.18em] md:right-12 md:top-[100px] md:text-[11px]"
          style={{ color: "var(--gold-accent)", opacity: 0.75 }}
        >
          ← tap to compare
        </p>
      ) : null}
    </div>
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
        className="relative h-[36px] w-[54px] overflow-hidden border transition-all duration-300 group-hover:scale-105 md:h-[40px] md:w-[60px]"
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
          width={60}
          height={40}
          className="h-full w-full object-cover"
        />
      </div>
      <span
        className="font-[var(--font-marker)] text-[11px] tracking-[0.1em] transition-colors"
        style={{
          color: active ? "var(--gold-accent)" : "var(--text-secondary)",
        }}
      >
        {label}
      </span>
    </button>
  );
}
