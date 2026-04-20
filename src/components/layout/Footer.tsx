function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="border-t py-8 px-6"
      style={{ borderColor: "var(--grid-line)" }}
    >
      <div className="mx-auto max-w-[1400px] flex flex-col items-center gap-5">
        <a
          href="#contact"
          className="text-[22px] md:text-[28px] uppercase tracking-[0.03em] transition-opacity hover:opacity-70 flex items-center gap-3"
          style={{ fontFamily: "var(--font-comico)", color: "var(--gold-accent)" }}
        >
          Ready to build? <span aria-hidden="true">→</span>
        </a>

        <div className="flex items-center gap-5">
          <a
            href="https://x.com/dangeorge_studio"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter)"
            className="transition-opacity hover:opacity-100 opacity-50"
            style={{ color: "var(--text-secondary)" }}
          >
            <XIcon />
          </a>
          <a
            href="https://linkedin.com/in/dangeorge"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="transition-opacity hover:opacity-100 opacity-50"
            style={{ color: "var(--text-secondary)" }}
          >
            <LinkedInIcon />
          </a>
        </div>

        <p
          className="text-[11px] uppercase tracking-[0.05em]"
          style={{ fontFamily: "var(--font-marker)", color: "var(--text-secondary)", opacity: 0.5 }}
        >
          © {year} DanGeorge.studio. Every pixel considered.
        </p>
      </div>
    </footer>
  );
}
