import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroScrollHint } from "./HeroScrollHint";

describe("<HeroScrollHint />", () => {
  it("renders the label text", () => {
    render(<HeroScrollHint />);
    expect(screen.getByText(/scroll to reveal/i)).toBeInTheDocument();
  });

  it("is aria-hidden (decorative)", () => {
    const { container } = render(<HeroScrollHint />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.getAttribute("aria-hidden")).toBe("true");
  });

  it("carries data-hero-scroll-hint so HeroClient can target it", () => {
    const { container } = render(<HeroScrollHint />);
    expect(
      container.querySelector("[data-hero-scroll-hint]"),
    ).not.toBeNull();
  });

  it("renders a chevron glyph", () => {
    const { container } = render(<HeroScrollHint />);
    const html = container.innerHTML;
    expect(html.includes("⌄") || html.includes("<svg")).toBe(true);
  });
});
