import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { About } from "./About";

describe("<About />", () => {
  it("renders a section with id='about' and aria-labelledby='about-heading'", () => {
    const { container } = render(<About />);
    const section = container.querySelector("section#about") as HTMLElement;
    expect(section).not.toBeNull();
    expect(section.getAttribute("aria-labelledby")).toBe("about-heading");
  });

  it("renders an h1 with id='about-heading' containing the name", () => {
    const { container } = render(<About />);
    const h1 = container.querySelector("h1#about-heading") as HTMLElement;
    expect(h1).not.toBeNull();
    expect(h1.textContent).toBe("DAN GEORGE");
  });

  it("marks eyebrow with data-about-eyebrow for GSAP hook", () => {
    const { container } = render(<About />);
    const el = container.querySelector("[data-about-eyebrow]");
    expect(el).not.toBeNull();
    expect(el?.textContent).toBe("WHO I AM");
  });

  it("marks name with data-about-name for GSAP hook", () => {
    const { container } = render(<About />);
    expect(container.querySelector("[data-about-name]")).not.toBeNull();
  });

  it("marks subtitle with data-about-subtitle for GSAP hook", () => {
    const { container } = render(<About />);
    expect(container.querySelector("[data-about-subtitle]")).not.toBeNull();
  });

  it("renders exactly two data-about-para elements", () => {
    const { container } = render(<About />);
    const paras = container.querySelectorAll("[data-about-para]");
    expect(paras.length).toBe(2);
  });

  it("renders exactly three data-about-fact elements", () => {
    const { container } = render(<About />);
    const facts = container.querySelectorAll("[data-about-fact]");
    expect(facts.length).toBe(3);
  });

  it("marks closing with data-about-closing for GSAP hook", () => {
    const { container } = render(<About />);
    const el = container.querySelector("[data-about-closing]");
    expect(el).not.toBeNull();
    expect(el?.textContent).toContain("THE SITE IS THE PITCH");
  });

  it("renders a CTA link marked data-about-cta", () => {
    const { container } = render(<About />);
    const ctaWrapper = container.querySelector("[data-about-cta]");
    expect(ctaWrapper).not.toBeNull();
    const ctaLink = ctaWrapper?.querySelector("a");
    expect(ctaLink).not.toBeNull();
    expect(ctaLink?.textContent?.trim()).toContain("START A PROJECT");
  });
});
