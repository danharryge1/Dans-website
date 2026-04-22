import Image from "next/image";
import { about } from "./about.data";
import { AboutClient } from "./AboutClient";
import { AboutCta } from "./AboutCta";
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

          {/* Two-column: copy left, photo placeholder right */}
          <div className="mt-16 md:mt-24 grid md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_380px] gap-16 md:gap-20 items-start">

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

            {/* Right: photo */}
            <div
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: "3/4" }}
            >
              <Image
                src="/assets/images/dan-george.jpg"
                alt="Dan George"
                fill
                style={{ objectFit: "cover", objectPosition: "center 12%" }}
                sizes="(max-width: 768px) 100vw, 380px"
                priority
              />
              {/* Bottom fade — blends photo base into section background */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
                style={{
                  background: "linear-gradient(to bottom, transparent, #020d0b)",
                }}
              />
            </div>
          </div>

          {/* Facts: horizontal row */}
          <div className="mt-14 md:mt-16 grid grid-cols-3 gap-6 md:gap-10">
            {about.facts.map((fact, i) => (
              <div key={fact.id} data-about-fact="" className="flex flex-col">
                <span
                  className="block text-[11px] uppercase tracking-[0.12em] mb-2"
                  style={{ fontFamily: "var(--font-marker)", color: "var(--gold-accent)", opacity: 0.5 }}
                >
                  0{i + 1}
                </span>
                <span
                  className="block text-[20px] md:text-[26px] uppercase leading-[1] tracking-[-0.01em]"
                  style={{ fontFamily: "var(--font-comico)", color: "var(--text-primary)" }}
                >
                  {fact.label}
                </span>
                <span
                  className="mt-2 block text-[13px] leading-[1.4]"
                  style={{ fontFamily: "var(--font-marker)", color: "var(--text-secondary)" }}
                >
                  {fact.caption}
                </span>
              </div>
            ))}
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

            <div data-about-cta="">
              <AboutCta label={about.cta.label} href={about.cta.href} />
            </div>
          </div>

        </div>
      </div>

      <AboutClient />
    </section>
  );
}
