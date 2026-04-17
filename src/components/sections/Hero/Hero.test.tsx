import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Hero.test.tsx tests structural composition only — not client-side animation.
// Mock HeroClient so real GSAP/Lenis/ScrollTrigger never run in this suite.
vi.mock("./HeroClient", () => ({ HeroClient: () => null }));

import { Hero } from "./Hero";

describe("<Hero />", () => {
  it("renders an <h1> with the locked headline copy", () => {
    render(<Hero />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent("THE WEB, EARNED.");
    expect(h1.id).toBe("hero-heading");
  });

  it("renders the sub copy", () => {
    render(<Hero />);
    expect(
      screen.getByText("Where ideas become interfaces."),
    ).toBeInTheDocument();
  });

  it("renders the NextUp caption", () => {
    render(<Hero />);
    expect(screen.getByText(/case study 01.*nextup co\./i)).toBeInTheDocument();
  });

  it("is a <section> with aria-labelledby pointing at the heading", () => {
    const { container } = render(<Hero />);
    const section = container.querySelector("section#hero")!;
    expect(section.getAttribute("aria-labelledby")).toBe("hero-heading");
  });

  it("renders the laptop draft image", () => {
    render(<Hero />);
    expect(
      screen.getByAltText("NextUp Co. homepage, pre-redesign"),
    ).toBeInTheDocument();
  });

  it("renders the scroll hint by default", () => {
    const { container } = render(<Hero />);
    expect(
      container.querySelector("[data-hero-scroll-hint]"),
    ).not.toBeNull();
  });
});
