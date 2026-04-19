import { describe, expect, it } from "vitest";
import {
  contactInputSchema,
  formatFieldErrors,
} from "./contact-schema";

const validPayload = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "I want a landing page for my new analytics product.",
  website: "",
};

describe("contactInputSchema", () => {
  it("accepts a valid payload", () => {
    const result = contactInputSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = contactInputSchema.safeParse({
      ...validPayload,
      name: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = formatFieldErrors(result.error);
      expect(errors.name).toBe("I'll need a name.");
    }
  });

  it("rejects name longer than 80 chars", () => {
    const result = contactInputSchema.safeParse({
      ...validPayload,
      name: "x".repeat(81),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = formatFieldErrors(result.error);
      expect(errors.name).toBe("Tighten it up.");
    }
  });

  it("rejects invalid email", () => {
    const result = contactInputSchema.safeParse({
      ...validPayload,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = formatFieldErrors(result.error);
      expect(errors.email).toBe("That email looks wrong.");
    }
  });

  it("rejects empty email", () => {
    const result = contactInputSchema.safeParse({
      ...validPayload,
      email: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = formatFieldErrors(result.error);
      expect(errors.email).toBe("That email looks wrong.");
    }
  });

  it("rejects message shorter than 15 chars", () => {
    const result = contactInputSchema.safeParse({
      ...validPayload,
      message: "hi",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = formatFieldErrors(result.error);
      expect(errors.message).toBe("Say a bit more.");
    }
  });

  it("accepts message exactly 15 chars", () => {
    const result = contactInputSchema.safeParse({
      ...validPayload,
      message: "x".repeat(15),
    });
    expect(result.success).toBe(true);
  });

  it("rejects message longer than 2000 chars", () => {
    const result = contactInputSchema.safeParse({
      ...validPayload,
      message: "x".repeat(2001),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = formatFieldErrors(result.error);
      expect(errors.message).toBe("Tighten it up.");
    }
  });

  it("rejects non-empty honeypot (website)", () => {
    const result = contactInputSchema.safeParse({
      ...validPayload,
      website: "bot-filled-this",
    });
    expect(result.success).toBe(false);
  });

  it("treats whitespace-only name as empty", () => {
    const result = contactInputSchema.safeParse({
      ...validPayload,
      name: "   ",
    });
    expect(result.success).toBe(false);
  });

  it("error messages contain no dashes or hyphens", () => {
    const dashPattern = /[\u2014\u2013\u002D]/;
    const badPayload = {
      name: "",
      email: "",
      message: "",
      website: "",
    };
    const result = contactInputSchema.safeParse(badPayload);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = formatFieldErrors(result.error);
      for (const msg of Object.values(errors)) {
        expect(dashPattern.test(msg)).toBe(false);
      }
    }
  });
});
