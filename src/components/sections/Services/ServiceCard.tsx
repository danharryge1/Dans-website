"use client";

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type React from "react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ServiceEntry } from "./services.data";

type Props = {
  entry: ServiceEntry;
  index: number;
  className?: string;
};

const TILT_MAX = 8.4;

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
  const [popped, setPopped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const showDeliverables = hovered || popped;

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
      onClick={() => setPopped((p) => !p)}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={[
        "group relative overflow-hidden rounded-[12px] border cursor-pointer transition-[border-color] duration-300 ease-out",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        background: "var(--services-card-bg)",
        borderColor: popped
          ? "color-mix(in oklch, var(--gold-accent) 60%, transparent)"
          : "var(--services-card-border)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        rotateX: tiltEnabled ? rotateX : 0,
        rotateY: tiltEnabled ? rotateY : 0,
        transformStyle: "preserve-3d",
        transformPerspective: 700,
        willChange: tiltEnabled ? "transform" : undefined,
      }}
      animate={
        popped
          ? {
              y: -20,
              scale: 1.04,
              boxShadow:
                "0 40px 80px -20px rgba(0,0,0,0.6), 0 0 48px -6px rgba(200,165,92,0.4)",
            }
          : {
              y: 0,
              scale: 1,
              boxShadow: "0 4px 16px -4px rgba(0,0,0,0.3)",
            }
      }
      whileHover={
        !popped
          ? {
              y: -8,
              scale: 1.025,
              borderColor: "var(--services-card-border-hover)",
              boxShadow:
                "0 24px 48px -16px rgba(0,0,0,0.45), 0 0 32px -4px rgba(200,165,92,0.28)",
              transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
            }
          : undefined
      }
      whileTap={
        !popped
          ? {
              y: -4,
              scale: 1.015,
              boxShadow:
                "0 16px 32px -12px rgba(0,0,0,0.4), 0 0 24px -4px rgba(200,165,92,0.2)",
              transition: { duration: 0.12 },
            }
          : undefined
      }
      transition={{ type: "spring", stiffness: 280, damping: 18, mass: 0.45 }}
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

        {/* label — revealed by --sweep-x scroll animation */}
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

      {/* Deliverables — slides up on hover or click */}
      <AnimatePresence initial={false}>
        {showDeliverables && (
          <motion.div
            key="deliverables"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <ul className="flex flex-col gap-2 px-8 pb-7 pt-5">
              {entry.deliverables.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.045, duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-start gap-3 text-[13px] leading-[1.5]"
                  style={{ fontFamily: "var(--font-marker)", color: "var(--text-secondary)" }}
                >
                  <span
                    className="mt-[5px] block h-1 w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: "var(--gold-accent)", opacity: 0.65 }}
                    aria-hidden="true"
                  />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
