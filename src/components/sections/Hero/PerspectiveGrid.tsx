export function PerspectiveGrid() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* receding grid floor */}
      <div
        className="absolute left-1/2 top-[55%] -translate-x-1/2 w-[220%] h-[180%]"
        style={{
          transform:
            "translateX(-50%) perspective(800px) rotateX(55deg) translateY(-6%)",
          transformOrigin: "top center",
          backgroundImage:
            "repeating-linear-gradient(90deg, var(--grid-line) 0 1px, transparent 1px 60px), " +
            "repeating-linear-gradient(0deg, var(--grid-line) 0 1px, transparent 1px 60px)",
          maskImage:
            "radial-gradient(ellipse at 50% 30%, #000 40%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 30%, #000 40%, transparent 75%)",
        }}
      />
      {/* radial glow at vanishing point */}
      <div
        className="absolute left-1/2 top-[30%] -translate-x-1/2 w-[60%] h-[40%] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--grid-glow), transparent 70%)",
        }}
      />
    </div>
  );
}
