import Image from "next/image";
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
        {/* Single backdrop video — Client fades it out across Acts, gradient layer takes over by Act 3 */}
        <video
          data-case-video
          aria-hidden="true"
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
          poster="/assets/hero/nextup-live-hd-poster.webp"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          style={{ filter: "saturate(var(--case-video-desat))" }}
        >
          <source src="/assets/hero/nextup-live-hd.webm" type="video/webm" />
          <source src="/assets/hero/nextup-live-hd.mp4" type="video/mp4" />
        </video>

        {/* Act 3 backdrop — deep teal radial gradient with vignette, fades in as video fades out */}
        <div
          data-case-gradient
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: 0,
            background:
              "radial-gradient(ellipse at center, #0D544C 0%, #0B2422 80%), radial-gradient(ellipse at center, rgba(0,0,0,0) 60%, rgba(0,0,0,0.35) 100%)",
            backgroundBlendMode: "normal, multiply",
          }}
        />

        {/* Act 1 — setup */}
        <div data-case-act="1" className="absolute inset-0 z-10">
          <div className="absolute bottom-10 left-6 md:bottom-16 md:left-12">
            <p
              className="mb-2 font-[var(--font-comico)] text-[28px] uppercase tracking-[0.05em] md:text-[40px]"
              style={{ color: "var(--text-primary)" }}
            >
              NEXTUP 2026
            </p>
            <p
              className="font-[var(--font-marker)] text-[15px] leading-[1.5] md:text-[18px]"
              style={{ color: "var(--text-secondary)" }}
            >
              My company. I designed it, built it, ship to it.
            </p>
          </div>

          {/* micro-comparison chip — hidden on mobile */}
          <div className="absolute right-12 top-16 hidden items-center gap-4 md:flex">
            <div className="flex flex-col items-center gap-1">
              <div
                className="h-[40px] w-[60px] overflow-hidden border"
                style={{ borderColor: "var(--gold-accent)" }}
              >
                <Image
                  src="/assets/hero/nextup-old.webp"
                  alt=""
                  aria-hidden={true}
                  width={60}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>
              <span
                className="font-[var(--font-marker)] text-[11px] tracking-[0.1em]"
                style={{ color: "var(--text-secondary)" }}
              >
                DRAFT
              </span>
            </div>
            <span
              className="font-[var(--font-marker)] text-[14px]"
              style={{ color: "var(--gold-accent)" }}
            >
              →
            </span>
            <div className="flex flex-col items-center gap-1">
              <div
                className="h-[40px] w-[60px] overflow-hidden border"
                style={{ borderColor: "var(--gold-accent)" }}
              >
                <Image
                  src="/assets/hero/nextup-live-poster.webp"
                  alt=""
                  aria-hidden={true}
                  width={60}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>
              <span
                className="font-[var(--font-marker)] text-[11px] tracking-[0.1em]"
                style={{ color: "var(--text-secondary)" }}
              >
                REALITY
              </span>
            </div>
          </div>
        </div>

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
              <div className="flex h-full items-stretch gap-4 p-6">
                <div className="flex w-[96px] flex-col gap-[2px]">
                  {["#04265E", "#0B3D8C", "#1C5AC5", "#3B7BE0", "#6C9FEB", "#A8C4F2"].map((hex) => (
                    <div
                      key={hex}
                      className="h-full w-full"
                      style={{ background: hex }}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <div className="relative flex-1 overflow-hidden rounded-[8px]">
                  <Image
                    src="/assets/case-study/nextup/beat-01-hero-crop.webp"
                    alt=""
                    aria-hidden={true}
                    fill
                    sizes="(max-width: 768px) 80vw, 400px"
                    className="object-cover"
                  />
                </div>
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
              <video
                aria-hidden="true"
                muted
                autoPlay
                loop
                playsInline
                preload="metadata"
                poster="/assets/case-study/nextup/beat-03-magnetic-poster.webp"
                className="h-full w-full object-cover"
              >
                <source src="/assets/case-study/nextup/beat-03-magnetic.webm" type="video/webm" />
                <source src="/assets/case-study/nextup/beat-03-magnetic.mp4" type="video/mp4" />
              </video>
            </DecisionBeat>
          </div>
        </div>

        {/* Act 3 — outcome */}
        <div
          data-case-act="3"
          className="relative z-10 mx-auto w-full max-w-[1400px] px-6 py-32 text-center md:px-10 md:py-40 lg:px-12"
        >
          <p
            className="mb-6 font-[var(--font-comico)] text-[24px] md:text-[32px]"
            style={{ color: "var(--text-primary)" }}
          >
            The site&apos;s doing its job.
          </p>
          <p
            className="mx-auto mb-6 font-[var(--font-marker)] text-[15px] md:text-[16px]"
            style={{ color: "var(--text-secondary)" }}
          >
            Built to stay out of the way.
          </p>
          <p
            data-case-arrow-float
            className="font-[var(--font-marker)] text-[14px]"
            style={{
              color: "var(--text-secondary)",
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
