import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("./FeaturedCaseClient", () => ({
  FeaturedCaseClient: () => null,
}));

import { FeaturedCase } from "./FeaturedCase";

describe("<FeaturedCase />", () => {
  it("renders a <section> with id + aria-labelledby", () => {
    const { container } = render(<FeaturedCase />);
    const section = container.querySelector("section") as HTMLElement;
    expect(section.id).toBe("case-study-nextup");
    expect(section.getAttribute("aria-labelledby")).toBe("case-study-heading");
  });

  it("renders a visually hidden h2 landmark", () => {
    const { getByRole } = render(<FeaturedCase />);
    const h2 = getByRole("heading", { level: 2, hidden: true });
    expect(h2.id).toBe("case-study-heading");
    expect(h2.className).toContain("sr-only");
  });

  it("renders a default backdrop gradient instead of a video", () => {
    const { container } = render(<FeaturedCase />);
    // Backdrop video has been replaced with a static gradient layer.
    expect(container.querySelector("[data-case-video]")).toBeNull();
    const bg = container.querySelector("[data-case-bg-default]") as HTMLElement;
    expect(bg).toBeTruthy();
    expect(bg.getAttribute("aria-hidden")).toBe("true");
    expect(bg.style.background).toContain("gradient");
  });

  it("renders Act 1 overlay copy", () => {
    const { getByText } = render(<FeaturedCase />);
    expect(getByText("NEXTUP 2026")).toBeInTheDocument();
    expect(getByText("My company. I designed it, built it, ship to it.")).toBeInTheDocument();
  });

  it("renders exactly three Act 2 decision beats with locked titles", () => {
    const { container, getByText } = render(<FeaturedCase />);
    const beats = container.querySelectorAll("[data-case-beat]");
    expect(beats.length).toBe(3);
    expect(getByText("WHY BLUE")).toBeInTheDocument();
    expect(getByText("MODERN, NOT LOUD")).toBeInTheDocument();
    expect(getByText("SMALL FLOURISHES, BIG LIFT")).toBeInTheDocument();
  });

  it("renders Act 3 outcome block with locked copy", () => {
    const { getByText, container } = render(<FeaturedCase />);
    expect(getByText("The site's doing its job.")).toBeInTheDocument();
    const act3 = container.querySelector("[data-case-act='3']");
    expect(act3?.textContent ?? "").toContain("Built to stay out of the way.");
    expect(act3?.textContent ?? "").toContain("Visit the live site");
  });

  it("tags the act regions with data hooks for the Client to target", () => {
    const { container } = render(<FeaturedCase />);
    expect(container.querySelector("[data-case-act='1']")).toBeTruthy();
    expect(container.querySelector("[data-case-act='2']")).toBeTruthy();
    expect(container.querySelector("[data-case-act='3']")).toBeTruthy();
    expect(container.querySelector("[data-case-bg-default]")).toBeTruthy();
    expect(container.querySelector("[data-case-pin]")).toBeTruthy();
  });
});
