import { describe, expect, it } from "vitest";
import { about } from "./about.data";

describe("about.data", () => {
  it("has a non-empty name, eyebrow, subtitle, and closing", () => {
    expect(about.name.length).toBeGreaterThan(0);
    expect(about.eyebrow.length).toBeGreaterThan(0);
    expect(about.subtitle.length).toBeGreaterThan(0);
    expect(about.closing.length).toBeGreaterThan(0);
  });

  it("exports exactly two paragraphs", () => {
    expect(about.paragraphs).toHaveLength(2);
  });

  it("exports exactly three facts", () => {
    expect(about.facts).toHaveLength(3);
  });

  it("facts have unique ids", () => {
    const ids = about.facts.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every fact has non-empty id, label, caption", () => {
    for (const f of about.facts) {
      expect(f.id.length).toBeGreaterThan(0);
      expect(f.label.length).toBeGreaterThan(0);
      expect(f.caption.length).toBeGreaterThan(0);
    }
  });

  it("contains no em dashes, en dashes, or hyphens in any copy (site-wide rule)", () => {
    const DASH_RE = /[—–-]/;
    expect(DASH_RE.test(about.name)).toBe(false);
    expect(DASH_RE.test(about.eyebrow)).toBe(false);
    expect(DASH_RE.test(about.subtitle)).toBe(false);
    expect(DASH_RE.test(about.closing)).toBe(false);
    for (const p of about.paragraphs) {
      expect(DASH_RE.test(p)).toBe(false);
    }
    for (const f of about.facts) {
      expect(DASH_RE.test(f.label)).toBe(false);
      expect(DASH_RE.test(f.caption)).toBe(false);
    }
  });

  it("cta has a non-empty label and href", () => {
    expect(about.cta.label.length).toBeGreaterThan(0);
    expect(about.cta.href.length).toBeGreaterThan(0);
  });
});
