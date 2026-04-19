import { ContactBg } from "./ContactBg";
import { ContactClient } from "./ContactClient";
import { ContactForm } from "./ContactForm";
import { contactCopy } from "./contact.data";

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const STATS = [
  { value: "48h", label: "Response time" },
  { value: "2–3", label: "Active projects" },
  { value: "100%", label: "Custom builds" },
] as const;

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative w-full py-32 md:py-40 overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #040d0b 0%, #071612 35%, #0a2018 70%, #040c09 100%)",
      }}
    >
      <ContactBg />
      {/* Radial glow top-left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 w-[500px] h-[500px]"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 0% 0%, rgba(200,165,92,0.09) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10 lg:px-12">
        <div className="relative mx-auto max-w-[1100px]">
          <span
            aria-hidden="true"
            data-contact-bookend=""
            className="mb-12 block h-px w-full md:mb-16"
            style={{
              backgroundColor: "var(--gold-accent)",
              opacity: 0.35,
            }}
          />

          <h2
            id="contact-heading"
            data-contact-headline=""
            className="text-[40px] md:text-[72px] lg:text-[96px] leading-[0.9] tracking-[-0.02em] mb-12 md:mb-16"
            style={{
              fontFamily: "var(--font-comico)",
              color: "var(--text-primary)",
            }}
          >
            {contactCopy.headline}
          </h2>

          {/* 3-col grid: left | divider | right */}
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1px_1fr] lg:gap-0">

            {/* Left panel */}
            <div data-contact-paragraph="" className="flex flex-col justify-between gap-10 lg:pr-16">
              <div
                className="text-[18px] md:text-[20px] leading-[1.55] tracking-[0.01em] max-w-[38ch]"
                style={{ fontFamily: "var(--font-marker)", color: "var(--text-primary)" }}
              >
                {contactCopy.paragraph.map((line, i) => (
                  <p key={i} className={i > 0 ? "mt-4" : undefined}>
                    {line}
                  </p>
                ))}
              </div>

              {/* Availability badge */}
              <div className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                    style={{ backgroundColor: "#4ade80" }}
                  />
                  <span
                    className="relative inline-flex h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: "#4ade80" }}
                  />
                </span>
                <span
                  className="text-[13px] uppercase tracking-[0.1em]"
                  style={{ fontFamily: "var(--font-marker)", color: "var(--text-secondary)" }}
                >
                  Available for new projects
                </span>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4">
                {STATS.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl p-4 transition-transform duration-200 ease-out hover:-translate-y-1.5 active:-translate-y-1.5 cursor-default"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(200,165,92,0.14) 0%, rgba(200,165,92,0.05) 100%)",
                      border: "1px solid rgba(200,165,92,0.22)",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
                    }}
                  >
                    <div
                      className="text-[28px] leading-none mb-1"
                      style={{ fontFamily: "var(--font-comico)", color: "var(--gold-accent)" }}
                    >
                      {s.value}
                    </div>
                    <div
                      className="text-[11px] uppercase tracking-[0.08em] leading-[1.3]"
                      style={{ fontFamily: "var(--font-marker)", color: "var(--text-secondary)" }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social links */}
              <div className="flex items-center gap-6">
                <a
                  href="https://x.com/dangeorge_studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (Twitter)"
                  className="flex items-center gap-2.5 transition-opacity hover:opacity-100 opacity-60"
                  style={{ color: "var(--text-primary)" }}
                >
                  <XIcon />
                  <span className="text-[13px] uppercase tracking-[0.08em]" style={{ fontFamily: "var(--font-marker)" }}>
                    @DanGeorge
                  </span>
                </a>
                <a
                  href="https://linkedin.com/in/dangeorge"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex items-center gap-2.5 transition-opacity hover:opacity-100 opacity-60"
                  style={{ color: "var(--text-primary)" }}
                >
                  <LinkedInIcon />
                  <span className="text-[13px] uppercase tracking-[0.08em]" style={{ fontFamily: "var(--font-marker)" }}>
                    LinkedIn
                  </span>
                </a>
              </div>
            </div>

            {/* Vertical divider — desktop only */}
            <div
              aria-hidden="true"
              className="hidden lg:block self-stretch w-px"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 0%, rgba(200,165,92,0.35) 20%, rgba(200,165,92,0.35) 80%, transparent 100%)",
              }}
            />

            {/* Right panel — form */}
            <div className="lg:pl-16">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>

      <ContactClient />
    </section>
  );
}
