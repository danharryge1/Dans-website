import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Philosophy } from "./Philosophy";

describe("<Philosophy />", () => {
  it("renders a section with id='philosophy' and aria-labelledby='philosophy-heading'", () => {
    const { container } = render(<Philosophy />);
    const section = container.querySelector("section#philosophy") as HTMLElement;
    expect(section).not.toBeNull();
    expect(section.getAttribute("aria-labelledby")).toBe("philosophy-heading");
  });

  it("renders an h2 with id='philosophy-heading' and text 'OUR PHILOSOPHY'", () => {
    const { container } = render(<Philosophy />);
    const h2 = container.querySelector("h2#philosophy-heading") as HTMLElement;
    expect(h2).not.toBeNull();
    expect(h2.textContent).toBe("OUR PHILOSOPHY");
  });

  it("marks the eyebrow with data-philosophy-eyebrow (JS hook for entrance motion)", () => {
    const { container } = render(<Philosophy />);
    const eyebrow = container.querySelector("[data-philosophy-eyebrow]");
    expect(eyebrow).not.toBeNull();
    expect(eyebrow?.tagName).toBe("H2");
  });

  it("renders exactly three BeliefBlock articles", () => {
    const { container } = render(<Philosophy />);
    const blocks = container.querySelectorAll("[data-philosophy-block]");
    expect(blocks.length).toBe(3);
  });

  it("renders the first belief at scale 'xl' and the other two at scale 'lg'", () => {
    const { container } = render(<Philosophy />);
    const blocks = Array.from(
      container.querySelectorAll<HTMLElement>("[data-philosophy-block]"),
    );
    expect(blocks[0].getAttribute("data-scale")).toBe("xl");
    expect(blocks[1].getAttribute("data-scale")).toBe("lg");
    expect(blocks[2].getAttribute("data-scale")).toBe("lg");
  });

  it("renders exactly two static bookend rules marked with data-philosophy-bookend", () => {
    const { container } = render(<Philosophy />);
    const bookends = container.querySelectorAll("[data-philosophy-bookend]");
    expect(bookends.length).toBe(2);
    bookends.forEach((el) => {
      expect(el.getAttribute("aria-hidden")).toBe("true");
      expect(el.tagName).toBe("SPAN");
    });
  });
});
