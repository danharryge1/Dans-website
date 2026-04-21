import type { Phase } from "./phases.data";

type Props = {
  phase: Phase;
};

export function PhaseBlock({ phase }: Props) {
  return (
    <article
      data-process-block=""
      data-phase-number={phase.number}
      className="grid grid-cols-[44px_1fr] gap-4 md:grid-cols-[56px_auto_1fr] md:gap-6 lg:grid-cols-[80px_auto_1fr] lg:gap-12"
    >
      {/* Thread rail column (reserved whitespace — actual thread rendered by <GoldThread />) */}
      <div aria-hidden="true" className="relative" />

      {/* Mobile: numeral + title in flex row, body below. Tablet/Desktop: numeral in its own column. */}
      <div className="flex flex-col md:contents">
        <div className="flex items-start gap-4 md:contents">
          <span
            data-process-numeral=""
            aria-hidden="true"
            className="text-[80px] leading-[0.9] tracking-[-0.02em] md:text-[140px] lg:text-[180px]"
            style={{
              fontFamily: "var(--font-comico)",
              color: "var(--text-primary)",
            }}
          >
            {phase.number}
          </span>

          <div className="flex-1 md:flex-none">
            <h3
              className="text-[28px] leading-[1.1] tracking-[-0.01em] md:text-[36px] lg:text-[44px] mb-3"
              style={{
                fontFamily: "var(--font-comico)",
                color: "var(--text-primary)",
              }}
            >
              {phase.title}
            </h3>

            <p
              className="text-[18px] leading-[1.55] tracking-[0.01em] md:text-[20px] lg:text-[22px] max-w-[52ch]"
              style={{
                fontFamily: "var(--font-marker)",
                color: "var(--text-primary)",
              }}
            >
              {phase.body}
            </p>

            {phase.note && (
              <p
                className="mt-3 text-[13px] leading-[1.5] tracking-[0.03em] uppercase"
                style={{
                  fontFamily: "var(--font-marker)",
                  color: "var(--gold-accent)",
                  opacity: 0.75,
                }}
              >
                {phase.note}
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
