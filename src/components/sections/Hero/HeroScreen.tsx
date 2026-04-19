type HeroScreenProps = {
  draftSrc: string;
  draftAlt: string;
  videoMp4: string;
  videoPoster: string;
};

export function HeroScreen({
  draftSrc,
  draftAlt,
  videoMp4,
  videoPoster,
}: HeroScreenProps) {
  return (
    <div data-hero-screen className="relative w-full h-full select-none">
      <p className="sr-only">
        Animated reveal: drag the seam to compare the original NextUp Co. site
        on the left with the redesign on the right.
      </p>

      {/* Draft side — original static image underneath */}
      <div data-hero-draft className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={draftSrc}
          alt={draftAlt}
          width={1820}
          height={1024}
          className="w-full h-full object-cover object-top"
          loading="eager"
          decoding="async"
        />
        <span
          data-hero-side-label
          aria-hidden="true"
          className="absolute bottom-2.5 left-2.5 px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.18em]"
          style={{
            fontFamily: "var(--font-marker)",
            color: "rgba(245,245,240,0.9)",
            backgroundColor: "rgba(11,36,34,0.85)",
            border: "1px solid rgba(245,245,240,0.2)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        >
          Draft
        </span>
      </div>

      {/* Reality side — new video, clipped by the seam */}
      <div
        data-hero-reality
        className="absolute inset-0"
        style={{
          clipPath: "inset(0 calc(100% - var(--seam-x)) 0 0)",
          WebkitClipPath: "inset(0 calc(100% - var(--seam-x)) 0 0)",
        }}
      >
        <video
          aria-hidden="true"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={videoPoster}
          className="w-full h-full object-cover object-top"
        >
          <source src={videoMp4} type="video/mp4" />
        </video>
        <span
          data-hero-side-label
          aria-hidden="true"
          className="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.18em]"
          style={{
            fontFamily: "var(--font-marker)",
            color: "rgba(245,245,240,0.95)",
            backgroundColor: "rgba(200,165,92,0.2)",
            border: "1px solid rgba(200,165,92,0.5)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            boxShadow: "0 0 12px rgba(200,165,92,0.2)",
          }}
        >
          Reality
        </span>
      </div>

      {/* seam + knob */}
      <div
        data-hero-seam
        aria-hidden="true"
        className="absolute top-0 bottom-0 pointer-events-none"
        style={{
          left: "var(--seam-x)",
          width: "2px",
          backgroundColor: "var(--gold-accent)",
          boxShadow: "0 0 12px rgba(200,165,92,0.9)",
          transform: "translateX(-1px)",
        }}
      >
        <button
          type="button"
          data-hero-knob
          aria-label="Drag to compare the draft and the live site"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32px] h-[32px] rounded-full p-0 flex items-center justify-center gap-[2.5px] cursor-ew-resize pointer-events-auto touch-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-accent)] focus-visible:ring-offset-2"
          style={{
            backgroundColor: "var(--text-primary)",
            border: "2px solid var(--gold-accent)",
            boxShadow:
              "0 0 18px rgba(200,165,92,0.65), 0 4px 10px rgba(0,0,0,0.3)",
            animation: "hero-knob-pulse 2.4s ease-in-out infinite",
          }}
        >
          <span
            aria-hidden="true"
            className="block w-[2px] h-[10px] rounded-full"
            style={{ backgroundColor: "var(--gold-accent)" }}
          />
          <span
            aria-hidden="true"
            className="block w-[2px] h-[10px] rounded-full"
            style={{ backgroundColor: "var(--gold-accent)" }}
          />
        </button>
      </div>
    </div>
  );
}
