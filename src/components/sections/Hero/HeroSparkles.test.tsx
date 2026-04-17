import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroSparkles } from "./HeroSparkles";

describe("<HeroSparkles />", () => {
  it("renders exactly 8 sparkle elements", () => {
    const { container } = render(<HeroSparkles />);
    expect(container.querySelectorAll("[data-hero-sparkle]").length).toBe(8);
  });

  it("each sparkle carries the aria-hidden + data attribute", () => {
    const { container } = render(<HeroSparkles />);
    const sparkles = container.querySelectorAll("[data-hero-sparkle]");
    sparkles.forEach((s) => {
      expect(s.getAttribute("aria-hidden")).toBe("true");
    });
  });

  it("sparkle colours reference --sparkle-core and --sparkle-halo tokens", () => {
    const { container } = render(<HeroSparkles />);
    expect(container.innerHTML).toContain("--sparkle-core");
    expect(container.innerHTML).toContain("--sparkle-halo");
  });

  it("is pointer-events-none and absolute-filled", () => {
    const { container } = render(<HeroSparkles />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("pointer-events-none");
    expect(root.className).toContain("absolute");
    expect(root.className).toContain("inset-0");
  });
});
