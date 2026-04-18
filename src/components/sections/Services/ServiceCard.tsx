"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type React from "react";
import { useEffect, useRef, useSyncExternalStore } from "react";
import type { ServiceEntry } from "./services.data";

type Props = {
  entry: ServiceEntry;
  index: number;
  className?: string;
};

const TILT_MAX = 3;

// useSyncExternalStore-backed gate: tilt is enabled only when the user has a
// fine pointer AND has not requested reduced motion. Computed client-side
// (server snapshot is always `false`) so SSR is stable.
function subscribeMedia(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const coarse = window.matchMedia("(pointer: coarse)");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  coarse.addEventListener("change", callback);
  reduced.addEventListener("change", callback);
  return () => {
    coarse.removeEventListener("change", callback);
    reduced.removeEventListener("change", callback);
  };
}

function getTiltEnabledSnapshot(): boolean {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return !coarse && !reduced;
}

function getTiltEnabledServerSnapshot(): boolean {
  return false;
}

export function ServiceCard({ entry, index, className }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const tiltEnabled = useSyncExternalStore(
    subscribeMedia,
    getTiltEnabledSnapshot,
    getTiltEnabledServerSnapshot,
  );

  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);

  const springConfig = { stiffness: 200, damping: 20, mass: 0.5 };
  const smoothX = useSpring(mvX, springConfig);
  const smoothY = useSpring(mvY, springConfig);

  const rotateY = useTransform(smoothX, [-1, 1], [-TILT_MAX, TILT_MAX]);
  const rotateX = useTransform(smoothY, [-1, 1], [TILT_MAX, -TILT_MAX]);

  useEffect(() => {
    if (!tiltEnabled) return;
    const el = ref.current;
    if (!el) return;

    const handleMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mvX.set(x * 2 - 1);
      mvY.set(y * 2 - 1);
    };
    const handleLeave = () => {
      mvX.set(0);
      mvY.set(0);
    };

    el.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerleave", handleLeave);
    return () => {
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
    };
  }, [tiltEnabled, mvX, mvY]);

  return (
    <motion.article
      ref={ref}
      role="listitem"
      data-services-card=""
      data-card-id={entry.id}
      data-card-index={index}
      className={[
        "group relative overflow-hidden rounded-[12px] border transition-[border-color,transform] duration-200 ease-out hover:-translate-y-[2px]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        background: "var(--services-card-bg)",
        borderColor: "var(--services-card-border)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        rotateX: tiltEnabled ? rotateX : 0,
        rotateY: tiltEnabled ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      whileHover={{
        borderColor: "var(--services-card-border-hover)",
      }}
    >
      {/* card-image panel — holds arc, sweep, label */}
      <div
        className="relative flex min-h-[180px] flex-col justify-end p-8"
        style={{ background: "var(--bg-darker)" }}
      >
        {/* arc flourish — top-right */}
        <svg
          aria-hidden="true"
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          className="absolute right-4 top-4"
          data-services-arc-float
        >
          <path
            d="M 48 0 A 48 48 0 0 0 0 48"
            stroke="var(--gold-accent)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            pathLength="75.4"
            data-services-arc-path
            style={{
              strokeDasharray: "75.4",
              strokeDashoffset: "75.4",
            }}
          />
          <circle
            cx="48"
            cy="0"
            r="2"
            fill="var(--gold-accent)"
            data-services-arc-dot
            style={{ opacity: 0 }}
          />
        </svg>

        {/* sweep overlay — gold seam position keyed to --sweep-x */}
        <div
          aria-hidden="true"
          data-services-sweep
          className="pointer-events-none absolute inset-0"
          style={
            {
              background:
                "linear-gradient(90deg, transparent 0%, " +
                "rgba(200,165,92,0.6) calc(var(--sweep-x) * 100% - 1px), " +
                "rgba(200,165,92,0.6) calc(var(--sweep-x) * 100% + 1px), " +
                "transparent 100%)",
            } as React.CSSProperties
          }
        />

        {/* label — unlock keyed to --sweep-x */}
        <div
          className="relative"
          data-services-label
          style={
            {
              opacity: "clamp(0, calc(var(--sweep-x) * 2 - 0.4), 1)",
            } as React.CSSProperties
          }
        >
          <h3
            className="font-[var(--font-comico)] text-[24px] uppercase tracking-[0.05em]"
            style={{ color: "var(--text-primary)" }}
          >
            {entry.title}
          </h3>
          <p
            className="mt-2 font-[var(--font-marker)] text-[15px] leading-[1.5]"
            style={{ color: "var(--text-secondary)" }}
          >
            {entry.body}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
