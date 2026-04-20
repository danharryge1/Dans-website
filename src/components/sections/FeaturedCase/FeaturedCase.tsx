import { Act1Overlay } from "./Act1Overlay";
import { DecisionBeat } from "./DecisionBeat";
import { FeaturedCaseClient } from "./FeaturedCaseClient";
import { MagneticButton } from "@/lib/motion/MagneticButton";

export function FeaturedCase() {
  return (
    <section
      id="case-study-nextup"
      aria-labelledby="case-study-heading"
      className="relative w-full"
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
              "radial-gradient(ellipse 90% 70% at 50% 38%, rgba(20,130,110,0.45) 0%, rgba(13,84,76,0) 65%), radial-gradient(ellipse at center, #0D544C 0%, #083D38 55%, #041E1B 100%)",
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
              <div
                aria-hidden="true"
                className="relative flex h-full w-full items-center justify-center"
                style={{ background: "#04265E" }}
              >
                <div className="relative flex items-center justify-center" style={{ width: "80%", aspectRatio: "1" }}>
                  {[
                    { hex: "#A8C4F2", size: "85%", z: 1 },
                    { hex: "#3B7BE0", size: "68%", z: 2 },
                    { hex: "#1C5AC5", size: "52%", z: 3 },
                    { hex: "#0B3D8C", size: "36%", z: 4 },
                  ].map(({ hex, size, z }) => (
                    <div
                      key={hex}
                      className="absolute rounded-full"
                      style={{
                        width: size,
                        height: size,
                        backgroundColor: hex,
                        zIndex: z,
                      }}
                    />
                  ))}
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
                preload="auto"
                poster="/assets/hero/intro-bg-poster.jpg"
                disablePictureInPicture
                disableRemotePlayback
                controls={false}
                tabIndex={-1}
                className="pointer-events-none h-full w-full object-cover"
              >
                <source src="/assets/hero/intro-bg.mp4" type="video/mp4" />
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
                preload="auto"
                poster="/assets/hero/nextup-v2-poster.jpg"
                disablePictureInPicture
                disableRemotePlayback
                controls={false}
                tabIndex={-1}
                className="pointer-events-none h-full w-full object-cover"
              >
                <source src="/assets/hero/nextup-v2.mp4" type="video/mp4" />
              </video>
            </DecisionBeat>
          </div>
        </div>

        {/* Act 3 — outcome */}
        <div
          data-case-act="3"
          className="relative z-10 w-full overflow-hidden text-center"
          style={{ minHeight: "100vh" }}
        >
          {/* Background — light teal top fading to near-black at bottom */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background: [
                "linear-gradient(to bottom, #0f5a52 0%, #093d37 40%, #041e1b 70%, #020d0b 100%)",
                "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(20,120,105,0.4) 0%, transparent 60%)",
                "radial-gradient(ellipse 100% 40% at 50% 100%, rgba(200,165,92,0.18) 0%, transparent 60%)",
              ].join(","),
            }}
          />
          <div className="relative mx-auto w-full max-w-[1400px] px-6 py-32 md:px-10 md:py-40 lg:px-12">
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
          <MagneticButton
            href="https://nextupco.com"
            target="_blank"
            rel="noreferrer noopener"
            variant="outline"
            arrow
            strength={16}
          >
            Visit the live site
          </MagneticButton>
          <p
            data-case-arrow-float
            className="mt-16 font-[var(--font-marker)] text-[13px] tracking-[0.08em] md:text-[14px]"
            style={{
              color: "var(--text-secondary)",
              opacity: 0.75,
              animation: "case-arrow-float 1.2s ease-in-out infinite",
            }}
          >
            Keep scrolling ↓
          </p>
        </div>
        </div>
      </div>

      <FeaturedCaseClient />
    </section>
  );
}
