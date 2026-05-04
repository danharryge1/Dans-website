import { BeliefBlock } from "./BeliefBlock";
import { beliefs } from "./beliefs.data";
import { PhilosophyClient } from "./PhilosophyClient";
import { FluidCanvas } from "@/components/sections/SelectedWorks/FluidCanvas";

export function Philosophy() {
  return (
    <section
      id="philosophy"
      aria-labelledby="philosophy-heading"
      className="relative w-full py-20 md:py-40 overflow-hidden"
      style={{
        background:
          "linear-gradient(175deg, #020d0b 0%, #041a14 18%, #071f18 38%, #030e0b 62%, #051510 80%, #020d0b 100%)",
      }}
    >
      <FluidCanvas filter="sepia(0.50) hue-rotate(40deg) saturate(0.9) brightness(0.60)" />

      {/* Radial warm glow — centre depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 45% at 50% 52%, rgba(200,165,92,0.055) 0%, transparent 65%)",
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10 lg:px-12">
        <div className="mx-auto max-w-[1100px]">
          <h2
            id="philosophy-heading"
            data-philosophy-eyebrow=""
            className="text-[42px] md:text-[64px] lg:text-[80px] uppercase leading-[0.95] tracking-[-0.01em]"
            style={{
              fontFamily: "var(--font-comico)",
              color: "var(--gold-accent)",
            }}
          >
            THE WAY I <span style={{ color: "var(--gold-accent)" }}>BUILD</span>
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

          <div className="mt-10 md:mt-20">
            {beliefs.map((belief, i) => (
              <div key={belief.id}>
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="my-10 md:my-20 block h-px w-full"
                    style={{ backgroundColor: "var(--gold-accent)", opacity: 0.2 }}
                  />
                )}
                <BeliefBlock belief={belief} />
              </div>
            ))}
          </div>

          <span
            aria-hidden="true"
            data-philosophy-bookend=""
            className="mt-10 md:mt-24 block h-px w-full"
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
