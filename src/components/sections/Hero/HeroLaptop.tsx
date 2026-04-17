import type { ReactNode } from "react";

type HeroLaptopProps = { children: ReactNode };

export function HeroLaptop({ children }: HeroLaptopProps) {
  return (
    <div
      className="relative mx-auto"
      style={{ perspective: "var(--laptop-perspective)" }}
    >
      <div
        data-hero-laptop
        className="relative w-[280px] md:w-[380px] lg:w-[560px] mx-auto p-[6px_6px_0] rounded-t-[10px] rounded-b-[6px]"
        style={{
          background: "linear-gradient(180deg, #2a2f2d, #15191a)",
          boxShadow:
            "0 24px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(245,245,240,0.08)",
          transform:
            "rotateX(var(--laptop-tilt-x)) rotateZ(var(--laptop-tilt-z))",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {/* 16:10 screen slot */}
        <div className="relative w-full rounded-[6px] overflow-hidden" style={{ aspectRatio: "16 / 10" }}>
          {children}
        </div>
        {/* deck / keyboard strip */}
        <div
          aria-hidden="true"
          className="h-[10px] mt-[6px] -mx-[6px] rounded-b-[14px]"
          style={{ background: "linear-gradient(180deg,#1a1e1d,#0c0e0e)" }}
        />
      </div>
    </div>
  );
}
