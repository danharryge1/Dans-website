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
      className="relative w-full min-h-screen flex flex-col items-center justify-center pt-32 pb-24 overflow-hidden"
    >
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
          THE WEB, EARNED.
        </h1>
        <p
          className="text-[16px] md:text-[18px] tracking-[0.02em]"
          style={{
            fontFamily: "var(--font-marker)",
            color: "var(--text-secondary)",
          }}
        >
          Where ideas become interfaces.
        </p>
      </div>

      <div className="relative z-10 mt-10 md:mt-12">
        <HeroLaptop>
          <HeroScreen
            draftSrc="/assets/hero/nextup-old.webp"
            draftAlt="NextUp Co. homepage, pre-redesign"
            videoMp4="/assets/hero/nextup-v2.mp4"
            videoPoster="/assets/hero/nextup-v2-poster.jpg"
          />
        </HeroLaptop>
      </div>

      <p
        className="relative z-10 mt-6 text-[13px] uppercase tracking-[0.15em]"
        style={{
          fontFamily: "var(--font-marker)",
          color: "var(--text-secondary)",
        }}
      >
        Case Study 01 &middot; NextUp Co.
      </p>

      <HeroScrollHint />
      <HeroClient />
    </section>
  );
}
