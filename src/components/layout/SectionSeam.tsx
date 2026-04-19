export function SectionSeam() {
  return (
    <div
      aria-hidden="true"
      data-section-seam=""
      className="w-full"
      style={{
        height: "1.5px",
        background: "var(--gold-accent)",
        opacity: 0,
        transform: "scaleX(0)",
        transformOrigin: "left",
      }}
    />
  );
}
