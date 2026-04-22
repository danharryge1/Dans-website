import { about } from "./about.data";
import { AboutClient } from "./AboutClient";
import { FluidCanvas } from "@/components/sections/SelectedWorks/FluidCanvas";

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative w-full pt-40 pb-32 md:pt-48 md:pb-40 overflow-hidden"
      style={{
        background:
          "linear-gradient(175deg, #020d0b 0%, #041a14 18%, #071f18 38%, #030e0b 62%, #051510 80%, #020d0b 100%)",
      }}
    >
      <FluidCanvas />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 30% 45%, rgba(200,165,92,0.05) 0%, transparent 65%)",
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10 lg:px-12">
        <div className="mx-auto max-w-[1100px]">

          {/* Eyebrow */}
          <p
            data-about-eyebrow=""
            className="text-[12px] uppercase tracking-[0.15em]"
            style={{ fontFamily: "var(--font-marker)", color: "var(--gold-accent)" }}
          >
            {about.eyebrow}
          </p>

          <span
            aria-hidden="true"
            className="mt-4 block h-px w-full"
            style={{ backgroundColor: "var(--gold-accent)", opacity: 0.35 }}
          />

          {/* Name + subtitle */}
          <div className="mt-14 md:mt-20">
            <h1
              id="about-heading"
              data-about-name=""
              className="text-[72px] md:text-[110px] lg:text-[148px] uppercase leading-[0.88] tracking-[-0.02em]"
              style={{ fontFamily: "var(--font-comico)", color: "var(--text-primary)" }}
            >
              {about.name}
            </h1>

            <p
              data-about-subtitle=""
              className="mt-6 md:mt-8 text-[17px] md:text-[20px] leading-[1.5]"
              style={{ fontFamily: "var(--font-marker)", color: "var(--gold-accent)", opacity: 0.8 }}
            >
              {about.subtitle}
            </p>
          </div>

          <span
            aria-hidden="true"
            className="mt-16 md:mt-24 block h-px w-full"
            style={{ backgroundColor: "var(--gold-accent)", opacity: 0.18 }}
          />

          {/* Two-column body: left copy, right numbered facts */}
          <div className="mt-16 md:mt-24 grid md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_320px] gap-16 md:gap-20 items-start">

            {/* Left: paragraphs */}
            <div className="flex flex-col gap-10">
              {about.paragraphs.map((para, i) => (
                <p
                  key={i}
                  data-about-para=""
                  className="text-[17px] md:text-[19px] leading-[1.7] tracking-[0.01em] max-w-[46ch]"
                  style={{ fontFamily: "var(--font-marker)", color: "var(--text-primary)", opacity: 0.82 }}
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Right: numbered facts */}
            <div className="flex flex-col gap-0">
              {about.facts.map((fact, i) => (
                <div key={fact.id}>
                  <div data-about-fact="" className="py-8">
                    <span
                      className="block text-[11px] uppercase tracking-[0.12em] mb-2"
                      style={{ fontFamily: "var(--font-marker)", color: "var(--gold-accent)", opacity: 0.5 }}
                    >
                      0{i + 1}
                    </span>
                    <span
                      className="block text-[24px] md:text-[28px] uppercase leading-[1] tracking-[-0.01em]"
                      style={{ fontFamily: "var(--font-comico)", color: "var(--text-primary)" }}
                    >
                      {fact.label}
                    </span>
                    <span
                      className="mt-2 block text-[14px] leading-[1.4]"
                      style={{ fontFamily: "var(--font-marker)", color: "var(--text-secondary)" }}
                    >
                      {fact.caption}
                    </span>
                  </div>
                  {i < about.facts.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="block h-px w-full"
                      style={{ backgroundColor: "var(--gold-accent)", opacity: 0.12 }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <span
            aria-hidden="true"
            className="mt-20 md:mt-28 block h-px w-full"
            style={{ backgroundColor: "var(--gold-accent)", opacity: 0.35 }}
          />

          {/* Closing + CTA */}
          <div className="mt-16 md:mt-20 flex flex-col md:flex-row md:items-end md:justify-between gap-10">
            <p
              data-about-closing=""
              className="text-[40px] md:text-[56px] lg:text-[72px] uppercase leading-[1.0] tracking-[-0.015em] max-w-[12ch]"
              style={{ fontFamily: "var(--font-comico)", color: "var(--text-primary)" }}
            >
              {about.closing}
            </p>

            <a
              data-about-cta=""
              href={about.cta.href}
              className="inline-flex items-center gap-3 border rounded-full px-8 py-4 text-[13px] uppercase tracking-[0.1em] transition-colors duration-200"
              style={{
                fontFamily: "var(--font-marker)",
                borderColor: "var(--text-primary)",
                color: "var(--text-primary)",
              }}
            >
              {about.cta.label}
            </a>
          </div>

        </div>
      </div>

      <AboutClient />
    </section>
  );
}
