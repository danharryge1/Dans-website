import { describe, expect, it } from "vitest";
import { phases } from "./phases.data";

describe("phases.data", () => {
  it("exports exactly three entries", () => {
    expect(phases).toHaveLength(3);
  });

  it("has unique ids", () => {
    const ids = phases.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("numbers are '01', '02', '03' in order", () => {
    expect(phases.map((p) => p.number)).toEqual(["01", "02", "03"]);
  });

  it("every entry has non-empty id, number, title, body", () => {
    for (const p of phases) {
      expect(p.id.length).toBeGreaterThan(0);
      expect(p.number.length).toBeGreaterThan(0);
      expect(p.title.length).toBeGreaterThan(0);
      expect(p.body.length).toBeGreaterThan(0);
    }
  });

  it("contains no em dash, en dash, or hyphen in title or body (site-wide copy rule)", () => {
    const dashPattern = /[\u2014\u2013\u002D]/;
    for (const p of phases) {
      expect(
        dashPattern.test(p.title),
        `Phase ${p.id} title contains a dash/hyphen: ${p.title}`,
      ).toBe(false);
      expect(
        dashPattern.test(p.body),
        `Phase ${p.id} body contains a dash/hyphen: ${p.body}`,
      ).toBe(false);
    }
  });

  it("contains no Unicode smart quotes in title or body (typography consistency)", () => {
    const smartQuotes = /[\u2018\u2019\u201C\u201D]/;
    for (const p of phases) {
      expect(smartQuotes.test(p.title)).toBe(false);
      expect(smartQuotes.test(p.body)).toBe(false);
    }
  });
});
