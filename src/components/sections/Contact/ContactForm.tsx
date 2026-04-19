"use client";

import { AnimatePresence, motion } from "motion/react";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitContact, type ContactState } from "@/lib/contact-action";
import { MagneticButton } from "@/lib/motion/MagneticButton";
import { contactCopy } from "./contact.data";

const BUDGET_OPTIONS = ["Under £5k", "£5k to £15k", "£15k to £30k", "£30k+"] as const;

const initialState: ContactState = { status: "idle" };

const STEP_LABELS = ["Your name", "Your email", "The details"];

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "60px" : "-60px",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? "-60px" : "60px",
    opacity: 0,
    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] as [number, number, number, number] },
  }),
};

function SubmitButton() {
  const { pending } = useFormStatus();
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

export function ContactForm() {
  const [state, formAction] = useActionState(submitContact, initialState);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [budget, setBudget] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, [step]);

  useEffect(() => {
    if (state.status === "error") {
      const errors = state.errors;
      if (errors.name) { setStep(0); setNameError(errors.name); }
      else if (errors.email) { setStep(1); setEmailError(errors.email); }
    }
  }, [state]);

  if (state.status === "success") {
    return <SuccessBlock />;
  }

  const advance = (toStep: number) => {
    if (toStep === 1 && !name.trim()) {
      setNameError("I'll need a name.");
      return;
    }
    if (toStep === 2 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("That email looks wrong.");
      return;
    }
    setDir(toStep > step ? 1 : -1);
    setStep(toStep);
  };

  const inputBase =
    "w-full rounded-xl border-2 bg-transparent px-4 py-3.5 text-[16px] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--gold-accent)]/30";
  const inputStyle = {
    borderColor: "var(--border-input)",
    color: "var(--text-primary)",
    fontFamily: "var(--font-marker)",
  };

  const stepContent = [
    // Step 0 — name
    <div key="step-0" className="space-y-4">
      <label
        htmlFor="contact-name"
        className="block text-[22px] md:text-[26px] leading-[1.2]"
        style={{ fontFamily: "var(--font-comico)", color: "var(--text-primary)" }}
      >
        What's your name?
      </label>
      <input
        id="contact-name"
        name="name-display"
        type="text"
        placeholder="Your Name"
        autoComplete="name"
        value={name}
        onChange={(e) => { setName(e.target.value); setNameError(""); }}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); advance(1); } }}
        className={inputBase}
        style={inputStyle}
        ref={(el) => { inputRef.current = el; }}
      />
      {nameError && (
        <p className="text-[14px]" style={{ color: "#E8A098", fontFamily: "var(--font-marker)" }}>
          {nameError}
        </p>
      )}
      <button
        type="button"
        onClick={() => advance(1)}
        className="mt-2 flex items-center gap-2 text-[15px] uppercase tracking-[0.08em] transition-opacity hover:opacity-70"
        style={{ fontFamily: "var(--font-marker)", color: "var(--gold-accent)" }}
      >
        Next <span aria-hidden="true">→</span>
      </button>
    </div>,

    // Step 1 — email
    <div key="step-1" className="space-y-4">
      <label
        htmlFor="contact-email"
        className="block text-[22px] md:text-[26px] leading-[1.2]"
        style={{ fontFamily: "var(--font-comico)", color: "var(--text-primary)" }}
      >
        And your email?
      </label>
      <input
        id="contact-email"
        name="email-display"
        type="email"
        placeholder="Your Email"
        autoComplete="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); advance(2); } }}
        className={inputBase}
        style={inputStyle}
        ref={(el) => { inputRef.current = el; }}
      />
      {emailError && (
        <p className="text-[14px]" style={{ color: "#E8A098", fontFamily: "var(--font-marker)" }}>
          {emailError}
        </p>
      )}
      <div className="flex items-center gap-5 mt-2">
        <button
          type="button"
          onClick={() => advance(0)}
          className="text-[15px] uppercase tracking-[0.08em] transition-opacity hover:opacity-70"
          style={{ fontFamily: "var(--font-marker)", color: "var(--text-secondary)" }}
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={() => advance(2)}
          className="flex items-center gap-2 text-[15px] uppercase tracking-[0.08em] transition-opacity hover:opacity-70"
          style={{ fontFamily: "var(--font-marker)", color: "var(--gold-accent)" }}
        >
          Next <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>,

    // Step 2 — project details + budget
    <div key="step-2" className="space-y-5">
      <label
        htmlFor="contact-message"
        className="block text-[22px] md:text-[26px] leading-[1.2]"
        style={{ fontFamily: "var(--font-comico)", color: "var(--text-primary)" }}
      >
        Tell me about it.
      </label>
      <textarea
        id="contact-message"
        name="message-display"
        placeholder="What are you building?"
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className={`${inputBase} min-h-[120px] resize-none`}
        style={inputStyle}
        ref={(el) => { inputRef.current = el; }}
      />

      <div>
        <p
          className="mb-3 text-[12px] uppercase tracking-[0.12em]"
          style={{ fontFamily: "var(--font-marker)", color: "var(--text-secondary)" }}
        >
          Budget range
        </p>
        <div className="flex flex-wrap gap-2">
          {BUDGET_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setBudget(budget === opt ? "" : opt)}
              className="rounded-full border px-4 py-1.5 text-[13px] transition-all duration-200"
              style={{
                fontFamily: "var(--font-marker)",
                borderColor: budget === opt ? "var(--gold-accent)" : "var(--border-input)",
                color: budget === opt ? "var(--gold-accent)" : "var(--text-secondary)",
                background: budget === opt ? "rgba(200,165,92,0.1)" : "transparent",
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-5 pt-1">
        <button
          type="button"
          onClick={() => advance(1)}
          className="text-[15px] uppercase tracking-[0.08em] transition-opacity hover:opacity-70"
          style={{ fontFamily: "var(--font-marker)", color: "var(--text-secondary)" }}
        >
          ← Back
        </button>
        <div className="flex-1">
          <SubmitButton />
        </div>
      </div>
    </div>,
  ];

  return (
    <form action={formAction} noValidate>
      {/* Hidden real inputs — submitted to server action */}
      <input type="hidden" name="name" value={name} />
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="message" value={`${message}${budget ? `\n\nBudget: ${budget}` : ""}`} />
      <input type="hidden" name="website" value="" />

      {/* Step progress dots */}
      <div className="flex items-center gap-2 mb-7" aria-hidden="true">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === step ? "24px" : "8px",
                backgroundColor: i <= step ? "var(--gold-accent)" : "var(--border-input)",
                opacity: i === step ? 1 : 0.5,
              }}
            />
          </div>
        ))}
      </div>

      {/* Animated step content */}
      <div className="relative overflow-hidden min-h-[280px]">
        <AnimatePresence custom={dir} mode="popLayout">
          <motion.div
            key={step}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {stepContent[step]}
          </motion.div>
        </AnimatePresence>
      </div>

      {state.status === "networkError" && (
        <p role="alert" className="mt-4 text-[14px]" style={{ color: "#E8A098", fontFamily: "var(--font-marker)" }}>
          Something went sideways. Try again, or email{" "}
          <a href={`mailto:${contactCopy.mailtoAddress}`} className="underline">
            {contactCopy.mailtoAddress}
          </a>{" "}
          directly.
        </p>
      )}
    </form>
  );
}
