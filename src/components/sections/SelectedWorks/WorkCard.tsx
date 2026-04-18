type RealProps = {
  entry: {
    id: string;
    title: string;
    year: number;
    descriptor: string;
    thumbnailSrc: string;
    thumbnailAlt: string;
  };
  placeholder?: false;
};

type PlaceholderProps = {
  placeholder: true;
  entry?: never;
};

type Props = RealProps | PlaceholderProps;

export function WorkCard(props: Props) {
  if (props.placeholder) {
    return (
      <article
        data-work-card-placeholder=""
        aria-label="Placeholder — new project landing soon"
        className="group relative flex w-[320px] shrink-0 flex-col gap-4"
      >
        <div
          className="relative flex aspect-[16/10] w-full items-center justify-center rounded-[12px] border border-dashed"
          style={{
            background: "rgba(245, 245, 240, 0.02)",
            borderColor: "rgba(245, 245, 240, 0.2)",
          }}
        >
          <span
            className="font-[var(--font-comico)] text-[20px] uppercase tracking-[0.1em]"
            style={{ color: "var(--text-secondary)" }}
          >
            NEXT UP →
          </span>
        </div>
        <p
          className="font-[var(--font-marker)] text-[14px] leading-[1.5]"
          style={{ color: "var(--text-secondary)", opacity: 0.6 }}
        >
          New project landing soon.
        </p>
      </article>
    );
  }

  const { entry } = props;
  return (
    <article
      data-work-card=""
      data-card-id={entry.id}
      className="group relative flex w-[320px] shrink-0 flex-col gap-4 transition-transform duration-200 ease-out hover:-translate-y-[2px]"
    >
      <div
        className="relative aspect-[16/10] w-full overflow-hidden rounded-[12px] border transition-[border-color] duration-200 ease-out group-hover:[border-color:var(--ledger-card-border-hover)]"
        style={{ borderColor: "var(--services-card-border)" }}
      >
        <img
          src={entry.thumbnailSrc}
          alt={entry.thumbnailAlt}
          className="h-full w-full object-cover transition-transform duration-[400ms] ease-out group-hover:scale-[1.02]"
        />
      </div>
      <div className="flex items-baseline justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3
            className="font-[var(--font-comico)] text-[20px] uppercase tracking-[0.05em]"
            style={{ color: "var(--text-primary)" }}
          >
            {entry.title}
          </h3>
          <p
            className="font-[var(--font-marker)] text-[14px] leading-[1.5]"
            style={{ color: "var(--text-secondary)" }}
          >
            {entry.descriptor}
          </p>
        </div>
        <span
          className="font-[var(--font-marker)] text-[12px]"
          style={{ color: "var(--gold-accent)" }}
        >
          {entry.year}
        </span>
      </div>
    </article>
  );
}
