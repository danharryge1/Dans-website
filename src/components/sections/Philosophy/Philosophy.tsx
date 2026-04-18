import { BeliefBlock } from "./BeliefBlock";
import { beliefs } from "./beliefs.data";
import { PhilosophyClient } from "./PhilosophyClient";

export function Philosophy() {
  return (
    <section
      id="philosophy"
      aria-labelledby="philosophy-heading"
      className="relative w-full py-32 md:py-40"
      style={{ backgroundColor: "var(--bg-darker)" }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-12">
        <div className="mx-auto max-w-[1100px]">
          <h2
            id="philosophy-heading"
            data-philosophy-eyebrow=""
            className="text-[13px] md:text-[14px] uppercase tracking-[0.12em]"
            style={{
              fontFamily: "var(--font-marker)",
              color: "var(--gold-accent)",
            }}
          >
            OUR PHILOSOPHY
          </h2>

          <span
            aria-hidden="true"
            data-philosophy-bookend=""
            className="mt-6 block h-px w-full"
            style={{
              backgroundColor: "var(--gold-accent)",
              opacity: 0.35,
            }}
          />

          <div className="mt-16 md:mt-24 space-y-20 md:space-y-24 lg:space-y-32">
            {beliefs.map((belief) => (
              <BeliefBlock key={belief.id} belief={belief} />
            ))}
          </div>

          <span
            aria-hidden="true"
            data-philosophy-bookend=""
            className="mt-16 md:mt-24 block h-px w-full"
            style={{
              backgroundColor: "var(--gold-accent)",
              opacity: 0.35,
            }}
          />
        </div>
      </div>

      <PhilosophyClient />
    </section>
  );
}
