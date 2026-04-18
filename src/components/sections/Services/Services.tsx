import type React from "react";
import { SERVICES } from "./services.data";
import { ServiceCard } from "./ServiceCard";
import { ServicesClient } from "./ServicesClient";

export function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative w-full py-32 md:py-40"
      style={{ background: "var(--bg-darker)" } as React.CSSProperties}
    >
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10 lg:px-12">
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
            style={{ perspective: "1000px" } as React.CSSProperties}
            data-services-grid
          >
            {SERVICES.map((entry, i) => (
              <div
                key={entry.id}
                className={
                  i === 2 ? "md:col-span-2 lg:col-span-1" : undefined
                }
              >
                <ServiceCard entry={entry} index={i} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <ServicesClient />
    </section>
  );
}
