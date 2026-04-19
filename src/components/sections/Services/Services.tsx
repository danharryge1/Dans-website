import { SERVICES } from "./services.data";
import { ServiceCard } from "./ServiceCard";
import { ServicesClient } from "./ServicesClient";

export function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative w-full py-32 md:py-40 overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #061c19 0%, #0d544c 28%, #0f6a61 52%, #0b4840 76%, #071a17 100%)",
      }}
    >
      {/* Decorative radial glow — top centre */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[600px]"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(200,165,92,0.08) 0%, transparent 70%)",
        }}
      />
      {/* Decorative radial glow — bottom right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 w-[600px] h-[600px]"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 100% 100%, rgba(15,106,97,0.4) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1400px] px-6 md:px-10 lg:px-12">
        <div className="mx-auto max-w-[1200px]">
          <h2
            id="services-heading"
            className="mb-8 text-center font-[var(--font-comico)] text-[36px] uppercase tracking-[0.05em] md:mb-12 md:text-[48px]"
            style={{ color: "var(--text-primary)" }}
            data-services-heading
          >
            TAILORED DIGITAL SOLUTIONS
          </h2>

          <div
            role="list"
            className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3"
            style={{ perspective: "1000px" }}
            data-services-grid
          >
            {SERVICES.map((entry, i) => (
              <ServiceCard
                key={entry.id}
                entry={entry}
                index={i}
                className={
                  i === SERVICES.length - 1
                    ? "md:col-span-2 lg:col-span-1"
                    : undefined
                }
              />
            ))}
          </div>

          {/* What you get — deliverables grid */}
          <div className="mt-20 md:mt-28">
            <p
              className="mb-10 text-center text-[11px] uppercase tracking-[0.18em]"
              style={{
                fontFamily: "var(--font-marker)",
                color: "var(--gold-accent)",
                opacity: 0.7,
              }}
            >
              WHAT YOU GET
            </p>

            <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
              {SERVICES.map((entry) => (
                <div key={entry.id}>
                  <h3
                    className="mb-4 text-[13px] uppercase tracking-[0.1em]"
                    style={{
                      fontFamily: "var(--font-marker)",
                      color: "var(--gold-accent)",
                    }}
                  >
                    {entry.title}
                  </h3>
                  <ul className="space-y-2.5">
                    {entry.deliverables.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-[14px] leading-[1.5]"
                        style={{
                          fontFamily: "var(--font-marker)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        <span
                          className="mt-[6px] block h-1 w-1 shrink-0 rounded-full"
                          style={{ backgroundColor: "var(--gold-accent)", opacity: 0.6 }}
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div
              aria-hidden="true"
              className="mt-14 h-px w-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(200,165,92,0.3) 50%, transparent 100%)",
              }}
            />
          </div>
        </div>
      </div>

      <ServicesClient />
    </section>
  );
}
