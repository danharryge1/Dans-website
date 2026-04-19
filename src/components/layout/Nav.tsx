"use client";

import { useEffect, useRef, useState } from "react";

const LINKS = [
  { label: "PORTFOLIO", href: "#selected-works" },
  { label: "SERVICES", href: "#services" },
  { label: "ABOUT", href: "#philosophy" },
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
              <a href={l.href}>{l.label}</a>
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
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-10"
          style={{ backgroundColor: "var(--bg-darker)" }}
        >
          <button
            type="button"
            aria-label="Close menu"
            className="absolute right-4 top-4 w-11 h-11 flex items-center justify-center text-3xl"
            style={{ color: "var(--text-primary)" }}
            onClick={() => setOpen(false)}
          >
            <span aria-hidden="true">×</span>
          </button>
          {LINKS.map((l, i) => (
            <a
              key={l.label}
              ref={i === 0 ? firstLinkRef : undefined}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-[48px] leading-none"
              style={{ fontFamily: "var(--font-comico)" }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
