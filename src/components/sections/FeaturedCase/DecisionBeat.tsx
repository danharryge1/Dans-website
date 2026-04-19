import type { ReactNode } from "react";

type Props = {
  index: number;
  title: string;
  body: string;
  children: ReactNode;
};

function formatNumeral(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export function DecisionBeat({ index, title, body, children }: Props) {
  return (
    <div
      data-case-beat=""
      data-beat-index={index}
      className="grid w-full grid-cols-1 gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12"
    >
      <div className="min-w-0">
        <div
          className="mb-4 font-[var(--font-comico)] text-[72px] leading-none md:text-[120px]"
          style={{ color: "var(--gold-accent)", opacity: 0.4 }}
        >
          {formatNumeral(index)}
        </div>
        <h3
          className="mb-5 font-[var(--font-comico)] text-[32px] uppercase leading-tight tracking-[0.05em] md:text-[48px]"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h3>
        <p
          className="max-w-[52ch] font-[var(--font-marker)] text-[15px] leading-[1.6] md:text-[18px]"
          style={{ color: "var(--text-secondary)" }}
        >
          {body}
        </p>
      </div>
      <div className="min-w-0">
        <div
          className="relative aspect-[4/3] w-full overflow-hidden rounded-[12px] border"
          style={{
            borderColor: "var(--services-card-border)",
            boxShadow: "inset 0 0 60px rgba(11,36,34,0.4)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
