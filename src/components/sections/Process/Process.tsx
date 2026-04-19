import { FluidCanvas } from "@/components/sections/SelectedWorks/FluidCanvas";
import { GoldThread } from "./GoldThread";
import { PhaseBlock } from "./PhaseBlock";
import { phases } from "./phases.data";
import { ProcessClient } from "./ProcessClient";

export function Process() {
  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="relative w-full overflow-hidden py-48 md:py-64"
      style={{ background: "#030e0c" }}
    >
      <FluidCanvas />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10 lg:px-12">
        <div className="relative mx-auto max-w-[1200px]">
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
            className="mb-16 text-[13px] uppercase tracking-[0.12em] md:mb-20 md:text-[14px]"
            style={{
              fontFamily: "var(--font-marker)",
              color: "var(--gold-accent)",
            }}
          >
            THE PROCESS
          </h2>

          <div className="space-y-28 md:space-y-36 lg:space-y-48">
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
