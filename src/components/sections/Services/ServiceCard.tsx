import type { ServiceEntry } from "./services.data";

type Props = {
  entry: ServiceEntry;
  index: number;
};

export function ServiceCard({ entry, index }: Props) {
  return (
    <article
      role="listitem"
      data-services-card=""
      data-card-id={entry.id}
      data-card-index={index}
      className="group relative overflow-hidden rounded-[12px] border p-0"
      style={
        {
          background: "var(--services-card-bg)",
          borderColor: "var(--services-card-border)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        } as React.CSSProperties
      }
    >
      {/* card-image panel — holds arc, sweep, label */}
      <div
        className="relative flex min-h-[180px] flex-col justify-end p-8"
        style={{ background: "var(--bg-darker)" }}
      >
        {/* arc flourish — top-right */}
        <svg
          aria-hidden="true"
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          className="absolute right-4 top-4"
          data-services-arc-float
        >
          <path
            d="M 48 0 A 48 48 0 0 0 0 48"
            stroke="var(--gold-accent)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            pathLength="75.4"
            data-services-arc-path
            style={{
              strokeDasharray: "75.4",
              strokeDashoffset: "75.4",
            }}
          />
          <circle
            cx="48"
            cy="0"
            r="2"
            fill="var(--gold-accent)"
            data-services-arc-dot
            style={{ opacity: 0 }}
          />
        </svg>

        {/* sweep overlay — gold seam position keyed to --sweep-x */}
        <div
          aria-hidden="true"
          data-services-sweep
          className="pointer-events-none absolute inset-0"
          style={
            {
              background:
                "linear-gradient(90deg, transparent 0%, " +
                "rgba(200,165,92,0.6) calc(var(--sweep-x) * 100% - 1px), " +
                "rgba(200,165,92,0.6) calc(var(--sweep-x) * 100% + 1px), " +
                "transparent 100%)",
            } as React.CSSProperties
          }
        />

        {/* label — unlock keyed to --sweep-x */}
        <div
          className="relative"
          data-services-label
          style={
            {
              opacity: "clamp(0, calc(var(--sweep-x) * 2 - 0.4), 1)",
            } as React.CSSProperties
          }
        >
          <h3
            className="font-[var(--font-comico)] text-[24px] uppercase tracking-[0.05em]"
            style={{ color: "var(--text-primary)" }}
          >
            {entry.title}
          </h3>
          <p
            className="mt-2 font-[var(--font-marker)] text-[15px] leading-[1.5]"
            style={{ color: "var(--text-secondary)" }}
          >
            {entry.body}
          </p>
        </div>
      </div>
    </article>
  );
}
