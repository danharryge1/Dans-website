export function ContactThread() {
  return (
    <div
      aria-hidden="true"
      data-contact-thread-container=""
      className="pointer-events-none absolute top-0 bottom-0 left-[22px] md:left-[28px] lg:left-[40px]"
    >
      <span
        aria-hidden="true"
        data-contact-thread=""
        className="absolute top-0 left-0 block w-[1.5px] h-full origin-top"
        style={{
          backgroundColor: "var(--gold-accent)",
          opacity: 0.9,
          transform: "scaleY(0)",
        }}
      />
    </div>
  );
}
