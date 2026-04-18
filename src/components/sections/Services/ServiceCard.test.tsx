import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ServiceCard } from "./ServiceCard";

describe("<ServiceCard />", () => {
  const entry = {
    id: "ui-ux" as const,
    title: "UI / UX DESIGN",
    body: "Design that behaves. Every click predictable, every edge considered.",
  };

  it("renders title and body copy", () => {
    const { getByText } = render(<ServiceCard entry={entry} index={0} />);
    expect(getByText("UI / UX DESIGN")).toBeInTheDocument();
    expect(
      getByText("Design that behaves. Every click predictable, every edge considered."),
    ).toBeInTheDocument();
  });

  it("tags the root as an article with list-item role and data hooks", () => {
    const { container } = render(<ServiceCard entry={entry} index={0} />);
    const root = container.querySelector("article") as HTMLElement;
    expect(root.getAttribute("role")).toBe("listitem");
    expect(root.getAttribute("data-services-card")).toBe("");
    expect(root.getAttribute("data-card-id")).toBe("ui-ux");
  });

  it("renders an aria-hidden arc SVG with a quarter-circle path and dot", () => {
    const { container } = render(<ServiceCard entry={entry} index={0} />);
    const svg = container.querySelector("svg[aria-hidden='true']") as SVGElement;
    expect(svg).toBeTruthy();
    expect(svg.querySelector("path")).toBeTruthy();
    expect(svg.querySelector("circle")).toBeTruthy();
  });

  it("renders an aria-hidden sweep element", () => {
    const { container } = render(<ServiceCard entry={entry} index={0} />);
    const sweep = container.querySelector('[data-services-sweep]') as HTMLElement;
    expect(sweep).toBeTruthy();
    expect(sweep.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders the title as an h3", () => {
    const { container } = render(<ServiceCard entry={entry} index={0} />);
    const h3 = container.querySelector("h3");
    expect(h3?.textContent).toBe("UI / UX DESIGN");
  });
});
