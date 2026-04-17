import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PerspectiveGrid } from "./PerspectiveGrid";

describe("<PerspectiveGrid />", () => {
  it("renders as aria-hidden and pointer-events-none", () => {
    const { container } = render(<PerspectiveGrid />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.getAttribute("aria-hidden")).toBe("true");
    expect(root.className).toContain("pointer-events-none");
  });

  it("absolute-fills its parent", () => {
    const { container } = render(<PerspectiveGrid />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("absolute");
    expect(root.className).toContain("inset-0");
  });

  it("references --grid-line and --grid-glow tokens in its inline styles", () => {
    const { container } = render(<PerspectiveGrid />);
    const html = container.innerHTML;
    expect(html).toContain("--grid-line");
    expect(html).toContain("--grid-glow");
  });
});
