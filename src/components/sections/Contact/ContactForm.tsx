"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { submitContact, type ContactState } from "@/lib/contact-action";
import { MagneticButton } from "@/lib/motion/MagneticButton";
import { contactCopy } from "./contact.data";

const initialState: ContactState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  // Sign-the-Page: MagneticButton solid variant + underline-on-hover
  // animation defined in globals.css under [data-contact-submit].
  return (
    <div data-contact-submit="" className="w-full">
      <MagneticButton
        type="submit"
        variant="solid"
        arrow
        strength={14}
        disabled={pending}
        className="w-full !rounded-xl !py-4"
      >
        {pending ? contactCopy.submit.pending : contactCopy.submit.idle}
      </MagneticButton>
    </div>
  );
}

function SuccessBlock() {
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      headingRef.current?.focus();
    });
  }, []);

  return (
    <div role="status" aria-live="polite" className="min-h-[240px]">
      <h3
        ref={headingRef}
        tabIndex={-1}
        className="text-[28px] md:text-[32px] lg:text-[36px] leading-[1.1] tracking-[-0.01em] outline-none"
        style={{
          fontFamily: "var(--font-comico)",
          color: "var(--text-primary)",
        }}
      >
        {contactCopy.success.heading}
      </h3>
      <p
        className="text-[18px] md:text-[20px] mt-4"
        style={{
          fontFamily: "var(--font-marker)",
          color: "var(--text-primary)",
        }}
      >
        {contactCopy.success.body}
      </p>
    </div>
  );
}

function FieldError({
  id,
  message,
}: {
  id: string;
  message: string | undefined;
}) {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className="mt-1 text-[14px]"
      style={{
        color: "#E8A098",
        fontFamily: "var(--font-marker)",
      }}
    >
      {message}
    </p>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContact, initialState);
  const errors = state.status === "error" ? state.errors : {};
  const firstErrorRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(
    null,
  );

  useEffect(() => {
    if (state.status === "error") {
      requestAnimationFrame(() => {
        firstErrorRef.current?.focus();
      });
    }
  }, [state]);

  if (state.status === "success") {
    return <SuccessBlock />;
  }

  const nameError = errors.name;
  const emailError = errors.email;
  const messageError = errors.message;

  const inputBaseClass =
    "w-full rounded-xl border-2 bg-transparent px-4 py-3 text-[16px] transition-colors focus:outline-none focus:ring-2";

  const inputStyle = {
    borderColor: "var(--border-input)",
    color: "var(--text-primary)",
    fontFamily: "var(--font-marker)",
  };

  return (
    <form
      action={formAction}
      noValidate
      className="flex flex-col gap-4"
    >
      <div data-contact-field="" className="flex flex-col">
        <label htmlFor="contact-name" className="sr-only">
          {contactCopy.fields.name}
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          placeholder={contactCopy.fields.name}
          autoComplete="name"
          className={inputBaseClass}
          style={inputStyle}
          aria-invalid={Boolean(nameError)}
          aria-describedby={nameError ? "contact-name-error" : undefined}
          ref={(el) => {
            if (nameError && !firstErrorRef.current) {
              firstErrorRef.current = el;
            }
          }}
        />
        <FieldError id="contact-name-error" message={nameError} />
      </div>

      <div data-contact-field="" className="flex flex-col">
        <label htmlFor="contact-email" className="sr-only">
          {contactCopy.fields.email}
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          placeholder={contactCopy.fields.email}
          autoComplete="email"
          className={inputBaseClass}
          style={inputStyle}
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? "contact-email-error" : undefined}
          ref={(el) => {
            if (emailError && !nameError && !firstErrorRef.current) {
              firstErrorRef.current = el;
            }
          }}
        />
        <FieldError id="contact-email-error" message={emailError} />
      </div>

      <div data-contact-field="" className="flex flex-col">
        <label htmlFor="contact-message" className="sr-only">
          {contactCopy.fields.message}
        </label>
        <textarea
          id="contact-message"
          name="message"
          placeholder={contactCopy.fields.message}
          rows={4}
          className={`${inputBaseClass} min-h-[120px] resize-y`}
          style={inputStyle}
          aria-invalid={Boolean(messageError)}
          aria-describedby={messageError ? "contact-message-error" : undefined}
          ref={(el) => {
            if (
              messageError &&
              !nameError &&
              !emailError &&
              !firstErrorRef.current
            ) {
              firstErrorRef.current = el;
            }
          }}
        />
        <FieldError id="contact-message-error" message={messageError} />
      </div>

      <div
        aria-hidden="true"
        className="absolute -left-[9999px] w-px h-px overflow-hidden"
      >
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      {state.status === "networkError" && (
        <p role="alert" className="text-[14px]" style={{ color: "#E8A098" }}>
          Something went sideways. Try again, or email{" "}
          <a
            href={`mailto:${contactCopy.mailtoAddress}`}
            className="underline"
          >
            {contactCopy.mailtoAddress}
          </a>{" "}
          directly.
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
