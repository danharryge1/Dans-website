import { GoldThread } from "./GoldThread";
import { PhaseBlock } from "./PhaseBlock";
import { phases } from "./phases.data";
import { ProcessClient } from "./ProcessClient";

export function Process() {
  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="relative w-full py-32 md:py-40"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-12">
        <div className="relative mx-auto max-w-[1100px]">
          <span
            aria-hidden="true"
            data-process-bookend=""
            className="mb-6 block h-px w-full"
            style={{
              backgroundColor: "var(--gold-accent)",
              opacity: 0.35,
            }}
          />

          <h2
            id="process-heading"
            data-process-eyebrow=""
            className="text-[13px] md:text-[14px] uppercase tracking-[0.12em] mb-12 md:mb-16"
            style={{
              fontFamily: "var(--font-marker)",
              color: "var(--gold-accent)",
            }}
          >
            THE PROCESS
          </h2>

          <div className="space-y-20 md:space-y-24 lg:space-y-32">
            {phases.map((phase) => (
              <PhaseBlock key={phase.id} phase={phase} />
            ))}
          </div>

          <GoldThread />
        </div>
      </div>

      <ProcessClient />
    </section>
  );
}
