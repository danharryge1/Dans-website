import { describe, expect, it } from "vitest";
import { beliefs } from "./beliefs.data";

describe("beliefs.data", () => {
  it("exports exactly three entries", () => {
    expect(beliefs).toHaveLength(3);
  });

  it("has unique ids", () => {
    const ids = beliefs.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every entry has non-empty id, headline, body", () => {
    for (const b of beliefs) {
      expect(b.id.length).toBeGreaterThan(0);
      expect(b.headline.length).toBeGreaterThan(0);
      expect(b.body.length).toBeGreaterThan(0);
    }
  });

  it("scale is undefined, 'lg', or 'xl'", () => {
    for (const b of beliefs) {
      expect(["lg", "xl", undefined]).toContain(b.scale);
    }
  });

  it("contains no em dashes, en dashes, or hyphens in headline or body (site-wide copy rule)", () => {
    const DASH_RE = /[\u2014\u2013\u002D]/;
    for (const b of beliefs) {
      expect(DASH_RE.test(b.headline)).toBe(false);
      expect(DASH_RE.test(b.body)).toBe(false);
    }
  });

  it("marks first belief as scale 'xl'", () => {
    expect(beliefs[0].scale).toBe("xl");
  });
});
