import Image from "next/image";

type RealProps = {
  entry: {
    id: string;
    title: string;
    year: number;
    descriptor: string;
    thumbnailSrc: string;
    thumbnailAlt: string;
    href?: string;
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
        aria-label="Placeholder, new project landing soon"
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
            ON DECK →
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
  const content = (
    <>
      <div
        className="relative aspect-[16/10] w-full overflow-hidden rounded-[12px] border transition-[border-color,box-shadow] duration-300 ease-out group-hover:[border-color:var(--ledger-card-border-hover)] group-hover:shadow-[0_24px_48px_-20px_rgba(200,165,92,0.35)]"
        style={{ borderColor: "var(--services-card-border)" }}
      >
        <Image
          src={entry.thumbnailSrc}
          alt={entry.thumbnailAlt}
          fill
          sizes="(max-width: 768px) 100vw, 320px"
          className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.06]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-3 flex h-8 w-8 translate-y-[-6px] items-center justify-center rounded-full text-[14px] opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100"
          style={{
            backgroundColor: "rgba(11,36,34,0.85)",
            color: "var(--gold-accent)",
            border: "1px solid var(--gold-accent)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        >
          ↗
        </span>
      </div>
      <div className="flex items-baseline justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3
            className="font-[var(--font-comico)] text-[20px] uppercase tracking-[0.05em] transition-colors duration-200 ease-out group-hover:[color:var(--gold-accent)]"
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
    </>
  );

  const classes =
    "group relative flex w-[320px] shrink-0 flex-col gap-4 transition-transform duration-300 ease-out hover:-translate-y-[6px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--bg-primary)] rounded-[12px]";

  if (entry.href) {
    return (
      <article data-work-card="" data-card-id={entry.id}>
        <a
          href={entry.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${entry.title}, open live site in a new tab`}
          className={classes}
        >
          {content}
        </a>
      </article>
    );
  }

  return (
    <article data-work-card="" data-card-id={entry.id} className={classes}>
      {content}
    </article>
  );
}
