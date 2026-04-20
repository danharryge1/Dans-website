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
          <p
            className="mb-3 text-center text-[11px] uppercase tracking-[0.2em]"
            style={{ fontFamily: "var(--font-marker)", color: "var(--gold-accent)", opacity: 0.7 }}
          >
            WHAT YOU GET
          </p>
          <h2
            id="services-heading"
            className="mb-8 text-center font-[var(--font-comico)] text-[clamp(1.6rem,7vw,3rem)] uppercase tracking-[0.05em] md:mb-12 md:text-[48px]"
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

        </div>
      </div>

      <ServicesClient />
    </section>
  );
}
