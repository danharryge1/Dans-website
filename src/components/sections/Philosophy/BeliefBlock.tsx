import Image from "next/image";
import type { Belief, BeliefMedia } from "./beliefs.data";

type Props = {
  belief: Belief;
};

function BeliefMediaPanel({ media }: { media: BeliefMedia }) {
  if (media.kind === "image") {
    return (
      <div
        className="relative w-full overflow-hidden rounded-[8px] border"
        style={{
          aspectRatio: "16 / 10",
          borderColor: "var(--services-card-border)",
        }}
      >
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes="(max-width: 1024px) 0px, 280px"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col justify-center rounded-[8px] border p-6"
      style={{
        minHeight: "180px",
        borderColor: "var(--services-card-border)",
        backgroundColor: "var(--bg-primary)",
      }}
    >
      <div className="flex items-baseline gap-2">
        <span
          className="text-[80px] leading-none tracking-[-0.02em]"
          style={{
            fontFamily: "var(--font-comico)",
            color: "var(--text-primary)",
          }}
        >
          {media.figure}
        </span>
        {media.unit && (
          <span
            className="text-[20px] uppercase tracking-[0.08em]"
            style={{
              fontFamily: "var(--font-marker)",
              color: "var(--gold-accent)",
            }}
          >
            {media.unit}
          </span>
        )}
      </div>
      <span
        aria-hidden="true"
        className="my-3 block h-[2px] w-[48px]"
        style={{ backgroundColor: "var(--gold-accent)" }}
      />
      <p
        className="text-[14px] leading-[1.45] tracking-[0.02em]"
        style={{
          fontFamily: "var(--font-marker)",
          color: "var(--text-secondary)",
        }}
      >
        {media.caption}
      </p>
    </div>
  );
}

export function BeliefBlock({ belief }: Props) {
  const scale = belief.scale ?? "lg";

  const headlineSizeClass =
    scale === "xl"
      ? "text-[48px] md:text-[80px] lg:text-[120px]"
      : "text-[40px] md:text-[64px] lg:text-[96px]";

  const ruleWidthClass = "w-[96px] md:w-[120px] lg:w-[160px]";

  const gridClass = belief.media
    ? "grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-[1fr_minmax(0,380px)_minmax(0,260px)] lg:items-center lg:gap-12"
    : "grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-[1fr_minmax(0,480px)] lg:gap-16";

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
          color: "var(--text-primary)",
        }}
      >
        {belief.body}
      </p>
      {belief.media && (
        <div data-philosophy-media="" className="hidden lg:block">
          <BeliefMediaPanel media={belief.media} />
        </div>
      )}
    </article>
  );
}
