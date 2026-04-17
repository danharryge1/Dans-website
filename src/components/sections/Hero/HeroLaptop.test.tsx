import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroLaptop } from "./HeroLaptop";

describe("<HeroLaptop />", () => {
  it("renders children inside the screen slot", () => {
    render(
      <HeroLaptop>
        <div data-testid="slot-content">hello</div>
      </HeroLaptop>,
    );
    expect(screen.getByTestId("slot-content")).toBeInTheDocument();
  });

  it("exposes data-hero-laptop on the outer element", () => {
    const { container } = render(
      <HeroLaptop>
        <span />
      </HeroLaptop>,
    );
    expect(
      container.querySelector("[data-hero-laptop]"),
    ).not.toBeNull();
  });

  it("uses laptop-tilt and laptop-perspective tokens in its style", () => {
    const { container } = render(
      <HeroLaptop>
        <span />
      </HeroLaptop>,
    );
    expect(container.innerHTML).toContain("--laptop-tilt-x");
    expect(container.innerHTML).toContain("--laptop-tilt-z");
    expect(container.innerHTML).toContain("--laptop-perspective");
  });
});
