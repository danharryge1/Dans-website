import React from "react";

// Deterministic positions — no randomness so SSR and CSR outputs match.
// Each entry also carries a delay fraction used to stagger the sparkle fade-in
// between --hero-progress 0.4 and 0.8.
const SPARKLES = [
  { top: "18%", left: "12%", delay: 0.0 },
  { top: "28%", left: "82%", delay: 0.08 },
  { top: "62%", left: "8%", delay: 0.16 },
  { top: "74%", left: "88%", delay: 0.24 },
  { top: "40%", left: "22%", delay: 0.32 },
  { top: "48%", left: "78%", delay: 0.04 },
  { top: "82%", left: "36%", delay: 0.12 },
  { top: "22%", left: "62%", delay: 0.2 },
] as const;

type CSSCustom = React.CSSProperties & Record<`--${string}`, string | number>;

export function HeroSparkles() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {SPARKLES.map((s, i) => (
        <span
          key={i}
          data-hero-sparkle
          aria-hidden="true"
          className="absolute block w-[4px] h-[4px] rounded-full"
          style={
            {
              top: s.top,
              left: s.left,
              backgroundColor: "var(--sparkle-core)",
              boxShadow: "0 0 10px 2px var(--sparkle-halo)",
              opacity: 0,
              "--sparkle-delay": s.delay,
            } as CSSCustom
          }
        />
      ))}
    </div>
  );
}
