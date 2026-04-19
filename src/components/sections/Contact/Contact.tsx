import { ContactClient } from "./ContactClient";
import { ContactForm } from "./ContactForm";
import { ContactThread } from "./ContactThread";
import { contactCopy } from "./contact.data";

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative w-full py-32 md:py-40"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-12">
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

          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <div
              data-contact-paragraph=""
              className="text-[18px] md:text-[20px] lg:text-[22px] leading-[1.55] tracking-[0.01em] max-w-[44ch]"
              style={{
                fontFamily: "var(--font-marker)",
                color: "var(--text-primary)",
              }}
            >
              {contactCopy.paragraph.map((line, i) => (
                <p key={i} className={i > 0 ? "mt-4" : undefined}>
                  {line}
                </p>
              ))}
            </div>

            <div>
              <ContactForm />
            </div>
          </div>

          <ContactThread />
        </div>
      </div>

      <ContactClient />
    </section>
  );
}
