"use client";

import { useEffect, useRef, useState } from "react";
import { useMagnetic } from "@/lib/motion/useMagnetic";

function NavMagLink({ href, label }: { href: string; label: string }) {
  const { ref, innerRef } = useMagnetic<HTMLAnchorElement>({
    strength: 7,
    writeFillVars: false,
  });
  return (
    <a ref={ref} href={href}>
      <span ref={(el) => { innerRef.current = el; }}>{label}</span>
    </a>
  );
}

const LINKS = [
  { label: "SERVICES", href: "#services" },
  { label: "WORK", href: "#case-study-nextup" },
  { label: "ABOUT", href: "/about" },
  { label: "CONTACT", href: "#contact" },
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <nav
        data-scrolled={scrolled ? "true" : "false"}
        className="fixed top-0 inset-x-0 z-50 py-6 transition-[background-color] duration-[250ms] ease-out"
      >
        <ul
          className="hidden md:flex justify-center gap-10 text-[14px] uppercase tracking-[0.05em]"
          style={{ fontFamily: "var(--font-marker)" }}
        >
          {LINKS.map((l) => (
            <li key={l.label}>
              <NavMagLink href={l.href} label={l.label} />
            </li>
          ))}
        </ul>

        <button
          ref={triggerRef}
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-2xl"
          style={{ color: "var(--text-primary)" }}
          onClick={() => setOpen(true)}
        >
          <span aria-hidden="true">☰</span>
        </button>
      </nav>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Main navigation"
          className="fixed inset-0 z-[60] flex flex-col justify-between px-8 py-10"
          style={{ backgroundColor: "var(--bg-darker)" }}
        >
          <button
            type="button"
            aria-label="Close menu"
            className="self-end w-11 h-11 flex items-center justify-center text-3xl"
            style={{ color: "var(--text-primary)" }}
            onClick={() => setOpen(false)}
          >
            <span aria-hidden="true">×</span>
          </button>

          <div className="flex flex-col gap-6">
            {LINKS.map((l, i) => (
              <a
                key={l.label}
                ref={i === 0 ? firstLinkRef : undefined}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-[64px] leading-[1] uppercase"
                style={{ fontFamily: "var(--font-comico)", color: "var(--text-primary)" }}
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-6 pb-2">
            <a
              href="https://x.com/dangeorge_studio"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[13px] uppercase tracking-[0.08em] opacity-60 hover:opacity-100 transition-opacity"
              style={{ fontFamily: "var(--font-marker)", color: "var(--text-primary)" }}
              aria-label="X (Twitter)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              @DanGeorge
            </a>
            <a
              href="https://linkedin.com/in/dangeorge"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[13px] uppercase tracking-[0.08em] opacity-60 hover:opacity-100 transition-opacity"
              style={{ fontFamily: "var(--font-marker)", color: "var(--text-primary)" }}
              aria-label="LinkedIn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
          </div>
        </div>
      )}
    </>
  );
}
