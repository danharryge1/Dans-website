import { PROJECTS } from "../FeaturedCase/projects.data";
import { FluidCanvas } from "./FluidCanvas";
import { SelectedWorksClient } from "./SelectedWorksClient";
import { WorkCard } from "./WorkCard";

export function SelectedWorks() {
  return (
    <section
      id="selected-works"
      aria-labelledby="selected-works-heading"
      className="relative w-full py-24 md:py-32"
      style={{ background: "#030e0c" }}
    >
      <FluidCanvas />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 md:px-10 lg:px-12">
        <SelectedWorksClient />
        <h2
          id="selected-works-heading"
          data-works-heading=""
          className="mb-8 font-[var(--font-comico)] text-[24px] uppercase tracking-[0.05em] md:text-[32px]"
          style={{ color: "var(--text-primary)" }}
        >
          SELECTED WORKS
        </h2>

        <div
          data-works-row
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 md:gap-6"
        >
          {PROJECTS.map((entry) => (
            <div key={entry.id} className="snap-start">
              <WorkCard
                entry={{
                  id: entry.id,
                  title: entry.title,
                  year: entry.year,
                  descriptor: entry.descriptor,
                  thumbnailSrc: entry.thumbnailSrc,
                  thumbnailAlt: entry.thumbnailAlt,
                  href: entry.href,
                }}
              />
            </div>
          ))}
          <div className="snap-start">
            <WorkCard placeholder />
          </div>
        </div>
      </div>
    </section>
  );
}
