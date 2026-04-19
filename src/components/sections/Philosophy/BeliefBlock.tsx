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

  const ruleWidthClass = "w-[96px] md:w-[120px] lg:w-[160px]";

  const gridClass = "grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-[1fr_minmax(0,480px)] lg:gap-16";

  return (
    <article
      data-philosophy-block=""
      data-scale={scale}
      className={gridClass}
    >
      <div className="flex flex-col">
        <h3
          className={`${headlineSizeClass} leading-[1.05] tracking-[-0.01em]`}
          style={{
            fontFamily: "var(--font-comico)",
            color: "var(--text-primary)",
          }}
        >
          {belief.headline}
        </h3>
        <span
          aria-hidden="true"
          data-philosophy-rule=""
          className={`mt-3 block h-[2px] ${ruleWidthClass} mb-10 lg:mb-0`}
          style={{ backgroundColor: "var(--gold-accent)" }}
        />
      </div>
      <p
        className="text-[18px] md:text-[20px] lg:text-[22px] leading-[1.55] tracking-[0.01em]"
        style={{
          fontFamily: "var(--font-marker)",
          color: "var(--text-secondary)",
        }}
      >
        {belief.body}
      </p>
    </article>
  );
}
