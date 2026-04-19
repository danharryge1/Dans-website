import type { Belief } from "./beliefs.data";

type Props = {
  belief: Belief;
};

export function BeliefBlock({ belief }: Props) {
  const scale = belief.scale ?? "lg";

  const headlineSizeClass =
    scale === "xl"
      ? "text-[48px] md:text-[80px] lg:text-[120px]"
      : "text-[40px] md:text-[64px] lg:text-[96px]";

  return (
    <article
      data-philosophy-block=""
      data-scale={scale}
      className="flex flex-col"
    >
      <h3
        className={`${headlineSizeClass} leading-[1.05] tracking-[-0.01em]`}
        style={{
          fontFamily: "var(--font-comico)",
          color: "var(--text-primary)",
        }}
      >
        {belief.headline}
      </h3>
      <p
        className="mt-6 text-[17px] md:text-[19px] leading-[1.6] tracking-[0.01em] max-w-[52ch]"
        style={{
          fontFamily: "var(--font-marker)",
          color: "var(--gold-accent)",
          opacity: 0.75,
        }}
      >
        {belief.body}
      </p>
    </article>
  );
}
