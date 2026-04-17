"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { label: "PORTFOLIO", href: "#portfolio" },
  { label: "SERVICES", href: "#services" },
  { label: "ABOUT", href: "#about" },
  { label: "CONTACT", href: "#contact" },
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <nav
        data-scrolled={scrolled ? "true" : "false"}
        className="fixed top-0 inset-x-0 z-50 py-6 transition-[background-color,backdrop-filter] duration-[250ms] ease-out"
        style={{
          backgroundColor: scrolled ? "rgba(11,36,34,0.6)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <ul
          className="hidden md:flex justify-center gap-10 text-[14px] uppercase tracking-[0.05em]"
          style={{ fontFamily: "var(--font-marker)" }}
        >
          {LINKS.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="transition-colors duration-200 ease-out"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-label="Open menu"
          className="md:hidden absolute right-6 top-1/2 -translate-y-1/2 text-2xl"
          style={{ color: "var(--text-primary)" }}
          onClick={() => setOpen(true)}
        >
          ☰
        </button>
      </nav>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-10 transition-opacity duration-300"
          style={{ backgroundColor: "var(--bg-darker)" }}
        >
          <button
            type="button"
            aria-label="Close menu"
            className="absolute right-6 top-6 text-3xl"
            style={{ color: "var(--text-primary)" }}
            onClick={() => setOpen(false)}
          >
            ×
          </button>
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-[48px] leading-none"
              style={{ fontFamily: "var(--font-comico)", color: "var(--text-primary)" }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
