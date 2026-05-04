"use client";

import { useState } from "react";
import Image from "next/image";
import { MagneticButton } from "@/lib/motion/MagneticButton";

type Tab = "reality" | "draft";

const BEATS = [
  {
    num: "01",
    title: "WHY BLUE",
    body: "Our competition is loud. I chose blue because trust is the moat. Trust looks calm, not flashy. The whole palette defers to the work instead of shouting over it.",
    visual: (
      <div
        className="relative flex h-full w-full items-center justify-center"
        style={{ background: "#04265E" }}
      >
        <div
          className="relative flex items-center justify-center"
          style={{ width: "72%", aspectRatio: "1" }}
        >
          {[
            { hex: "#A8C4F2", size: "85%" },
            { hex: "#3B7BE0", size: "68%" },
            { hex: "#1C5AC5", size: "52%" },
            { hex: "#0B3D8C", size: "36%" },
          ].map(({ hex, size }) => (
            <div
              key={hex}
              className="absolute rounded-full"
              style={{ width: size, height: size, backgroundColor: hex }}
            />
          ))}
        </div>
      </div>
    ),
  },
  {
    num: "02",
    title: "MODERN, NOT LOUD",
    body: `"Modern" is easy to overdo. The brief was to look like a 2026 company without a demo reel. Every motion decision passes one filter: does it help the user, or just perform for them?`,
    visual: (
      <video
        aria-hidden
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
        poster="/assets/hero/intro-bg-poster.jpg"
        className="pointer-events-none h-full w-full object-cover"
      >
        <source src="/assets/hero/intro-bg.mp4" type="video/mp4" />
      </video>
    ),
  },
  {
    num: "03",
    title: "SMALL FLOURISHES, BIG LIFT",
    body: "Magnetic buttons. A full intro sequence. A background that responds to your cursor. Tiny craft decisions, stacked. Crafted by hand, not generated.",
    visual: (
      <video
        aria-hidden
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
        poster="/assets/hero/nextup-v2-poster.jpg"
        className="pointer-events-none h-full w-full object-cover"
      >
        <source src="/assets/hero/nextup-v2.mp4" type="video/mp4" />
      </video>
    ),
  },
] as const;

export function FeaturedCaseMobile() {
  const [tab, setTab] = useState<Tab>("reality");

  return (
    <div className="md:hidden">
      {/* ── Act 1: Intro + before/after ── */}
      <div
        className="relative flex min-h-svh flex-col justify-between px-6 pb-12 pt-20"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 38%, rgba(20,130,110,0.45) 0%, rgba(13,84,76,0) 65%), radial-gradient(ellipse at center, #0D544C 0%, #083D38 55%, #041E1B 100%)",
        }}
      >
        {/* Header */}
        <div>
          <p
            className="mb-2 font-[var(--font-marker)] text-[11px] uppercase tracking-[0.28em]"
            style={{ color: "var(--gold-accent)" }}
          >
            Case Study · 01
          </p>
          <h2
            className="font-[var(--font-comico)] text-[40px] uppercase leading-[1.0] tracking-[0.03em]"
            style={{ color: "var(--text-primary)" }}
          >
            NEXTUP 2026
          </h2>
          <p
            className="mt-2 font-[var(--font-marker)] text-[15px] leading-[1.5]"
            style={{ color: "var(--text-secondary)" }}
          >
            My company. I designed it, built it, ship to it.
          </p>
        </div>

        {/* Before / after toggle */}
        <div className="my-8">
          {/* Tab strip */}
          <div className="mb-4 flex items-center gap-3">
            {(["reality", "draft"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                aria-pressed={tab === t}
                className="font-[var(--font-marker)] text-[12px] uppercase tracking-[0.16em] transition-colors"
                style={{
                  color:
                    tab === t ? "var(--gold-accent)" : "var(--text-secondary)",
                  opacity: tab === t ? 1 : 0.55,
                  paddingBottom: "2px",
                  borderBottom: tab === t ? "1px solid var(--gold-accent)" : "1px solid transparent",
                }}
              >
                {t === "reality" ? "RESULT" : "DRAFT"}
              </button>
            ))}
            <span
              className="font-[var(--font-marker)] text-[11px]"
              style={{ color: "var(--text-secondary)", opacity: 0.5 }}
            >
              — tap to compare
            </span>
          </div>

          {/* Preview panel */}
          <div
            className="relative overflow-hidden rounded-[10px]"
            style={{
              border: "1px solid rgba(200,165,92,0.22)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.55)",
              aspectRatio: "16/10",
            }}
          >
            {tab === "reality" ? (
              <video
                key="reality"
                aria-hidden
                muted
                autoPlay
                loop
                playsInline
                preload="auto"
                poster="/assets/hero/nextup-intro-poster.jpg"
                className="pointer-events-none h-full w-full object-cover"
              >
                <source src="/assets/hero/nextup-intro.mp4" type="video/mp4" />
              </video>
            ) : (
              <Image
                key="draft"
                src="/assets/hero/nextup-old.webp"
                alt="NextUp Co. draft design"
                fill
                className="object-cover"
              />
            )}
            {/* Bottom gradient */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
              style={{
                background: "linear-gradient(to top, rgba(4,14,12,0.6) 0%, transparent 100%)",
              }}
            />
          </div>
        </div>

        <p
          className="text-center font-[var(--font-marker)] text-[12px] tracking-[0.12em]"
          style={{ color: "var(--text-secondary)", opacity: 0.5 }}
        >
          Keep scrolling ↓
        </p>
      </div>

      {/* ── Act 2: Decision beats ── */}
      <div
        className="space-y-12 px-6 py-16"
        style={{
          background:
            "linear-gradient(to bottom, #041E1B 0%, #020d0b 50%, #041E1B 100%)",
        }}
      >
        {BEATS.map((beat) => (
          <article
            key={beat.num}
            data-case-beat-m
            className="flex flex-col gap-5"
          >
            <div
              className="font-[var(--font-comico)] text-[56px] leading-none"
              style={{ color: "var(--gold-accent)", opacity: 0.3 }}
            >
              {beat.num}
            </div>
            <h3
              className="font-[var(--font-comico)] text-[26px] uppercase leading-tight tracking-[0.04em]"
              style={{ color: "var(--text-primary)" }}
            >
              {beat.title}
            </h3>
            <p
              className="font-[var(--font-marker)] text-[15px] leading-[1.65]"
              style={{ color: "var(--text-secondary)" }}
            >
              {beat.body}
            </p>
            <div
              className="relative aspect-[4/3] w-full overflow-hidden rounded-[10px]"
              style={{ border: "1px solid rgba(200,165,92,0.12)" }}
            >
              {beat.visual}
            </div>
          </article>
        ))}
      </div>

      {/* ── Act 3: Outcome ── */}
      <div
        className="relative flex min-h-svh flex-col items-center justify-center px-6 py-20 text-center"
        style={{
          background: [
            "linear-gradient(to bottom, #0f5a52 0%, #093d37 40%, #071f18 70%, #051510 100%)",
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(20,120,105,0.4) 0%, transparent 60%)",
            "radial-gradient(ellipse 100% 40% at 50% 100%, rgba(200,165,92,0.18) 0%, transparent 60%)",
          ].join(","),
        }}
      >
        <p
          className="mb-5 font-[var(--font-marker)] text-[11px] uppercase tracking-[0.28em]"
          style={{ color: "var(--gold-accent)" }}
        >
          Nextup, 2026
        </p>
        <span
          aria-hidden="true"
          className="mx-auto mb-8 block h-[1px] w-[60px]"
          style={{ backgroundColor: "var(--gold-accent)", opacity: 0.55 }}
        />
        <h3
          className="mx-auto mb-5 max-w-[20ch] font-[var(--font-comico)] text-[36px] leading-[1.05] tracking-[-0.01em]"
          style={{ color: "var(--text-primary)" }}
        >
          The site&apos;s doing its job.
        </h3>
        <p
          className="mx-auto mb-10 max-w-[32ch] font-[var(--font-marker)] text-[16px] leading-[1.55]"
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
      </div>
    </div>
  );
}
