import { describe, expect, it } from "vitest";
import { contactCopy } from "./contact.data";

describe("contact.data", () => {
  it("exports the locked headline", () => {
    expect(contactCopy.headline).toBe("TELL ME WHAT YOU WANT");
  });

  it("paragraph is exactly two non-empty lines", () => {
    expect(contactCopy.paragraph).toHaveLength(2);
    for (const line of contactCopy.paragraph) {
      expect(line.length).toBeGreaterThan(0);
    }
  });

  it("paragraph second line contains the Process echo phrase", () => {
    expect(contactCopy.paragraph[1]).toContain(
      "I come back with the shape of it",
    );
  });

  it("has three field labels (name, email, message)", () => {
    expect(contactCopy.fields.name).toBe("Your Name");
    expect(contactCopy.fields.email).toBe("Your Email");
    expect(contactCopy.fields.message).toBe("Project Details");
  });

  it("submit button has idle + pending labels", () => {
    expect(contactCopy.submit.idle).toBe("SEND IT");
    expect(contactCopy.submit.pending).toBe("SENDING");
  });

  it("success block has a heading + body", () => {
    expect(contactCopy.success.heading).toBe("Got it.");
    expect(contactCopy.success.body).toBe(
      "I'll write back within two days.",
    );
  });

  it("error strings are fully defined", () => {
    expect(contactCopy.errors.nameRequired).toBe("I'll need a name.");
    expect(contactCopy.errors.emailInvalid).toBe("That email looks wrong.");
    expect(contactCopy.errors.messageTooShort).toBe("Say a bit more.");
    expect(contactCopy.errors.tooLong).toBe("Tighten it up.");
    expect(contactCopy.errors.network).toBe(
      "Something went sideways. Try again, or email dannyhgeorge@gmail.com directly.",
    );
  });

  it("mailto fallback email is exactly 'dannyhgeorge@gmail.com'", () => {
    expect(contactCopy.mailtoAddress).toBe("dannyhgeorge@gmail.com");
  });

  it("contains no em dash, en dash, or hyphen in any user-facing string (site-wide copy rule)", () => {
    const dashPattern = /[\u2014\u2013\u002D]/;
    const allStrings = [
      contactCopy.headline,
      ...contactCopy.paragraph,
      contactCopy.fields.name,
      contactCopy.fields.email,
      contactCopy.fields.message,
      contactCopy.submit.idle,
      contactCopy.submit.pending,
      contactCopy.success.heading,
      contactCopy.success.body,
      ...Object.values(contactCopy.errors),
    ];
    for (const s of allStrings) {
      expect(dashPattern.test(s), `Dash found in: ${s}`).toBe(false);
    }
  });

  it("contains no Unicode smart quotes (typography consistency)", () => {
    const smartQuotes = /[\u2018\u2019\u201C\u201D]/;
    const allStrings = [
      contactCopy.headline,
      ...contactCopy.paragraph,
      contactCopy.fields.name,
      contactCopy.fields.email,
      contactCopy.fields.message,
      contactCopy.submit.idle,
      contactCopy.submit.pending,
      contactCopy.success.heading,
      contactCopy.success.body,
      ...Object.values(contactCopy.errors),
    ];
    for (const s of allStrings) {
      expect(smartQuotes.test(s), `Smart quote found in: ${s}`).toBe(false);
    }
  });
});
