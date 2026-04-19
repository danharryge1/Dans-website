export function GoldThread() {
  return (
    <div
      aria-hidden="true"
      data-process-thread-container=""
      className="pointer-events-none absolute top-0 bottom-0 left-[22px] md:left-[28px] lg:left-[40px]"
    >
      <span
        aria-hidden="true"
        data-process-thread=""
        className="absolute top-0 left-[-0.75px] block w-[1.5px] h-full origin-top"
        style={{
          backgroundColor: "var(--gold-accent)",
          opacity: 0.9,
          transform: "scaleY(0)",
        }}
      />

      {[1, 2, 3].map((n) => (
        <span
          key={n}
          aria-hidden="true"
          data-process-dot={String(n)}
          className="absolute left-0 block h-[10px] w-[10px] rounded-full"
          style={{
            backgroundColor: "var(--gold-accent)",
            transform: "translate(-50%, -50%) scale(0)",
            opacity: 0,
            top: 0,
          }}
        />
      ))}
    </div>
  );
}
