export function HeroScrollHint() {
  return (
    <div
      aria-hidden="true"
      data-hero-scroll-hint
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 motion-reduce:hidden"
      style={{
        opacity: "calc(1 - clamp(0, var(--hero-progress) * 20, 1))",
      } as React.CSSProperties}
    >
      <span
        className="text-[12px] uppercase tracking-[0.15em]"
        style={{
          fontFamily: "var(--font-marker)",
          color: "var(--text-secondary)",
        }}
      >
        Scroll to reveal
      </span>
      <span
        className="block text-[18px] leading-none"
        style={{ color: "var(--text-secondary)" }}
      >
        ⌄
      </span>
    </div>
  );
}
