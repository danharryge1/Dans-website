import { HeroClient } from "./HeroClient";
import { HeroLaptop } from "./HeroLaptop";
import { HeroScreen } from "./HeroScreen";
import { HeroSparkles } from "./HeroSparkles";
import { HeroScrollHint } from "./HeroScrollHint";
import { PerspectiveGrid } from "./PerspectiveGrid";

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative w-full h-[100dvh] flex flex-col items-center justify-center pt-[88px] pb-8 overflow-hidden"
    >
      {/* Full-screen background video — sits above the canvas (z-index:-1) */}
      <video
        aria-hidden="true"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/assets/hero/hero-bg-poster.jpg"
        disablePictureInPicture
        disableRemotePlayback
        controls={false}
        tabIndex={-1}
        className="pointer-events-none absolute inset-0 w-full h-full object-cover"
      >
        <source src="/assets/hero/hero-bg.mp4" type="video/mp4" />
      </video>
      {/* Gradient overlay — ensures text stays readable + eases into teal below */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(13,84,76,0.45) 0%, rgba(13,84,76,0.3) 50%, rgba(13,84,76,0.72) 100%)",
        }}
      />

      <PerspectiveGrid />
      <HeroSparkles />

      <div className="relative z-10 flex flex-col items-center gap-3 md:gap-4 text-center">
        <h1
          id="hero-heading"
          className="text-[40px] md:text-[48px] lg:text-[72px] leading-[1.05] tracking-[0.02em] uppercase"
          style={{
            fontFamily: "var(--font-comico)",
            color: "var(--text-primary)",
            textShadow: "0 0 24px rgba(200,165,92,0.18)",
          }}
        >
          THE WEB, <span style={{ color: "var(--gold-accent)" }}>EARNED.</span>
        </h1>
        <p
          className="text-[16px] md:text-[18px] tracking-[0.02em]"
          style={{
            fontFamily: "var(--font-marker)",
            color: "var(--text-secondary)",
          }}
        >
          Live in 5 days. From £299.
        </p>
      </div>

      <div className="relative z-10 mt-6 md:mt-8">
        <HeroLaptop>
          <HeroScreen
            draftSrc="/assets/hero/nextup-old.webp"
            draftAlt="NextUp Co. homepage, pre-redesign"
            videoMp4="/assets/hero/nextup-intro.mp4"
            videoPoster="/assets/hero/nextup-intro-poster.jpg"
          />
        </HeroLaptop>
      </div>

      <div className="relative z-10 mt-3">
        <span
          className="inline-flex items-center px-4 py-[6px] rounded-full text-[13px] uppercase tracking-[0.15em]"
          style={{
            fontFamily: "var(--font-marker)",
            color: "var(--text-secondary)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            background: "rgba(7,13,11,0.42)",
            border: "1px solid rgba(200,165,92,0.22)",
            boxShadow: "inset 0 1px 0 rgba(200,165,92,0.10)",
          }}
        >
          Case Study 01 &middot; NextUp Co.
        </span>
      </div>

      <HeroScrollHint />
      <HeroClient />
    </section>
  );
}
