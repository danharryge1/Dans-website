import Image from "next/image";
import { Act1Overlay } from "./Act1Overlay";
import { DecisionBeat } from "./DecisionBeat";
import { FeaturedCaseClient } from "./FeaturedCaseClient";

export function FeaturedCase() {
  return (
    <section
      id="case-study-nextup"
      aria-labelledby="case-study-heading"
      className="relative w-full"
      style={{ background: "var(--bg-primary)" }}
    >
      <h2 id="case-study-heading" className="sr-only">
        NextUp, featured case study
      </h2>

      <div
        data-case-pin
        className="relative w-full"
        style={{ minHeight: "100vh" }}
      >
        {/* Default backdrop — deep navy gradient shared across Acts 1 and 2. Act 3 gradient fades in on top later. */}
        <div
          aria-hidden="true"
          data-case-bg-default
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 85% 65% at 50% 38%, rgba(60,125,230,0.32) 0%, rgba(28,90,197,0) 65%), radial-gradient(ellipse at center, #0B3D8C 0%, #04265E 55%, #020E26 100%)",
          }}
        />

        {/* Act 3 backdrop — layered teal with warmer core highlight + edge vignette */}
        <div
          data-case-gradient
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: 0,
            background:
              "radial-gradient(ellipse 60% 45% at 50% 48%, rgba(200,165,92,0.10) 0%, rgba(200,165,92,0) 70%), radial-gradient(ellipse at center, #104F48 0%, #0A201E 85%), radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)",
            backgroundBlendMode: "screen, normal, multiply",
          }}
        />

        {/* Act 1 — setup (interactive chip swap) */}
        <Act1Overlay />

        {/* Act 2 — thinking */}
        <div
          data-case-act="2"
          className="relative z-20 mx-auto w-full max-w-[1400px] px-6 py-32 md:px-10 md:py-40 lg:px-12"
        >
          <div className="flex flex-col gap-32 md:gap-40">
            <DecisionBeat
              index={0}
              title="WHY BLUE"
              body="Our competition is loud. I chose blue because trust is the moat. Trust looks calm, not flashy. The whole palette defers to the work instead of shouting over it."
            >
              <div className="flex h-full w-full flex-col">
                {[
                  { hex: "#04265E", role: "deepest", onDark: true },
                  { hex: "#0B3D8C", role: "anchor", onDark: true },
                  { hex: "#1C5AC5", role: "primary", onDark: true },
                  { hex: "#3B7BE0", role: "accent", onDark: true },
                  { hex: "#6C9FEB", role: "support", onDark: false },
                  { hex: "#A8C4F2", role: "lightest", onDark: false },
                ].map(({ hex, role, onDark }) => (
                  <div
                    key={hex}
                    className="flex flex-1 items-center justify-between px-5 md:px-8"
                    style={{ background: hex, minHeight: "56px" }}
                    aria-hidden="true"
                  >
                    <span
                      className="font-[var(--font-marker)] text-[13px] tracking-[0.1em] md:text-[15px]"
                      style={{
                        color: onDark
                          ? "rgba(255,255,255,0.92)"
                          : "rgba(11,36,34,0.78)",
                      }}
                    >
                      {hex}
                    </span>
                    <span
                      className="font-[var(--font-marker)] text-[10px] uppercase tracking-[0.18em] md:text-[11px]"
                      style={{
                        color: onDark
                          ? "rgba(255,255,255,0.6)"
                          : "rgba(11,36,34,0.55)",
                      }}
                    >
                      {role}
                    </span>
                  </div>
                ))}
              </div>
            </DecisionBeat>

            <DecisionBeat
              index={1}
              title="MODERN, NOT LOUD"
              body={`"Modern" is easy to overdo. The brief was to look like a 2026 company without looking like a demo reel. Every motion decision passes one filter: does it help the user, or just perform for them?`}
            >
              <video
                aria-hidden="true"
                muted
                autoPlay
                loop
                playsInline
                preload="metadata"
                poster="/assets/case-study/nextup/beat-02-scroll-poster.webp"
                className="h-full w-full object-cover"
              >
                <source src="/assets/case-study/nextup/beat-02-scroll.webm" type="video/webm" />
                <source src="/assets/case-study/nextup/beat-02-scroll.mp4" type="video/mp4" />
              </video>
            </DecisionBeat>

            <DecisionBeat
              index={2}
              title="SMALL FLOURISHES, BIG LIFT"
              body="Magnetic buttons. A full intro sequence. A background that responds to your cursor. Tiny craft decisions, stacked. Crafted by hand, not generated."
            >
              <div className="grid h-full grid-cols-2 gap-[6px] p-[6px]">
                <div className="grid grid-rows-2 gap-[6px]">
                  <figure className="relative overflow-hidden rounded-[4px]">
                    <Image
                      src="/assets/case-study/nextup/beat-03-rest.webp"
                      alt=""
                      aria-hidden={true}
                      fill
                      sizes="(max-width: 768px) 40vw, 240px"
                      className="object-cover"
                    />
                    <figcaption
                      className="absolute bottom-1.5 left-2 font-[var(--font-marker)] text-[11px] tracking-[0.05em]"
                      style={{
                        color: "rgba(255,255,255,0.78)",
                        textShadow: "0 1px 2px rgba(0,0,0,0.6)",
                      }}
                    >
                      button at rest.
                    </figcaption>
                  </figure>
                  <figure className="relative overflow-hidden rounded-[4px]">
                    <Image
                      src="/assets/case-study/nextup/beat-03-glow.webp"
                      alt=""
                      aria-hidden={true}
                      fill
                      sizes="(max-width: 768px) 40vw, 240px"
                      className="object-cover"
                    />
                    <figcaption
                      className="absolute bottom-1.5 left-2 font-[var(--font-marker)] text-[11px] tracking-[0.05em]"
                      style={{
                        color: "rgba(255,255,255,0.78)",
                        textShadow: "0 1px 2px rgba(0,0,0,0.6)",
                      }}
                    >
                      cursor pulls it.
                    </figcaption>
                  </figure>
                </div>
                <figure className="relative overflow-hidden rounded-[4px]">
                  <Image
                    src="/assets/case-study/nextup/beat-03-bg.webp"
                    alt=""
                    aria-hidden={true}
                    fill
                    sizes="(max-width: 768px) 40vw, 320px"
                    className="object-cover"
                  />
                  <figcaption
                    className="absolute bottom-2 left-2.5 font-[var(--font-marker)] text-[11px] tracking-[0.05em]"
                    style={{
                      color: "rgba(255,255,255,0.82)",
                      textShadow: "0 1px 2px rgba(0,0,0,0.6)",
                    }}
                  >
                    atmosphere responds.
                  </figcaption>
                </figure>
              </div>
            </DecisionBeat>
          </div>
        </div>

        {/* Act 3 — outcome */}
        <div
          data-case-act="3"
          className="relative z-10 mx-auto w-full max-w-[1400px] px-6 py-32 text-center md:px-10 md:py-40 lg:px-12"
        >
          <p
            className="mb-5 font-[var(--font-marker)] text-[12px] uppercase tracking-[0.28em] md:text-[13px]"
            style={{ color: "var(--gold-accent)" }}
          >
            Nextup, 2026
          </p>
          <span
            aria-hidden="true"
            className="mx-auto mb-10 block h-[1px] w-[72px] md:w-[96px]"
            style={{ backgroundColor: "var(--gold-accent)", opacity: 0.55 }}
          />
          <h3
            className="mx-auto mb-6 max-w-[22ch] font-[var(--font-comico)] text-[40px] leading-[1.05] tracking-[-0.01em] md:text-[64px] lg:text-[80px]"
            style={{ color: "var(--text-primary)" }}
          >
            The site&apos;s doing its job.
          </h3>
          <p
            className="mx-auto mb-12 max-w-[36ch] font-[var(--font-marker)] text-[17px] leading-[1.55] md:text-[20px] lg:text-[22px]"
            style={{ color: "var(--text-secondary)" }}
          >
            Built to stay out of the way. Designed, shipped, and maintained by
            one person.
          </p>
          <a
            href="https://nextupco.com"
            target="_blank"
            rel="noreferrer noopener"
            className="group relative inline-flex items-center gap-3 rounded-full border px-7 py-3 font-[var(--font-marker)] text-[14px] uppercase tracking-[0.14em] transition-all duration-300 hover:gap-4 md:text-[15px]"
            style={{
              borderColor: "var(--gold-accent)",
              color: "var(--text-primary)",
              backgroundColor: "rgba(200,165,92,0.04)",
              boxShadow: "0 1px 20px rgba(200,165,92,0.12)",
            }}
          >
            Visit the live site
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-300 group-hover:translate-x-1"
              style={{ color: "var(--gold-accent)" }}
            >
              →
            </span>
          </a>
          <p
            data-case-arrow-float
            className="mt-16 font-[var(--font-marker)] text-[13px] tracking-[0.08em] md:text-[14px]"
            style={{
              color: "var(--text-secondary)",
              opacity: 0.75,
              animation: "case-arrow-float 1.2s ease-in-out infinite",
            }}
          >
            Selected works ↓
          </p>
        </div>
      </div>

      <FeaturedCaseClient />
    </section>
  );
}
