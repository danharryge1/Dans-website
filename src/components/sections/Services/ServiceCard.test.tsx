import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ServiceCard } from "./ServiceCard";

describe("<ServiceCard />", () => {
  const entry = {
    id: "ui-ux" as const,
    title: "UI / UX DESIGN",
    body: "Design that behaves. Every click predictable, every edge considered.",
    deliverables: ["Wireframes and interactive prototypes"],
  };

  it("renders title and body copy", () => {
    const { getByText } = render(<ServiceCard entry={entry} index={0} />);
    expect(getByText("UI / UX DESIGN")).toBeInTheDocument();
    expect(
      getByText("Design that behaves. Every click predictable, every edge considered."),
    ).toBeInTheDocument();
  });

  it("tags the root as an article with list-item role and data hooks", () => {
    const { container } = render(<ServiceCard entry={entry} index={2} />);
    const root = container.querySelector("article") as HTMLElement;
    expect(root.getAttribute("role")).toBe("listitem");
    expect(root.getAttribute("data-services-card")).toBe("");
    expect(root.getAttribute("data-card-id")).toBe("ui-ux");
    expect(root.getAttribute("data-card-index")).toBe("2");
  });

  it("renders an aria-hidden arc SVG with quarter-circle path + dot carrying GSAP hooks", () => {
    const { container } = render(<ServiceCard entry={entry} index={0} />);
    const svg = container.querySelector("svg[aria-hidden='true']") as SVGElement;
    expect(svg).toBeTruthy();
    expect(svg.querySelector("[data-services-arc-path]")).toBeTruthy();
    expect(svg.querySelector("[data-services-arc-dot]")).toBeTruthy();
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

describe("<ServiceCard /> — hover tilt", () => {
  const entry = {
    id: "ui-ux" as const,
    title: "UI / UX DESIGN",
    body: "Design that behaves. Every click predictable, every edge considered.",
    deliverables: ["Wireframes and interactive prototypes"],
  };

  beforeEach(() => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: !query.includes("coarse") && !query.includes("reduced"),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders without crashing on pointer-fine devices (tilt hook wired)", () => {
    const { container } = render(<ServiceCard entry={entry} index={0} />);
    const root = container.querySelector("article") as HTMLElement;
    expect(root).toBeTruthy();
    // Dispatching a pointermove should not throw — listener must be safely attached.
    expect(() => {
      root.dispatchEvent(new Event("pointermove"));
      root.dispatchEvent(new Event("pointerleave"));
    }).not.toThrow();
  });

  it("does not apply tilt transform on pointer-coarse (touch) devices", () => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: query.includes("coarse"),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    const { container } = render(<ServiceCard entry={entry} index={0} />);
    const root = container.querySelector("article") as HTMLElement;
    expect(root).toBeTruthy();
    // On coarse pointers, the component should not apply any tilt rotation.
    // Motion may emit `transform: none` as the baseline — that's acceptable;
    // what matters is there is no rotateX / rotateY in the transform string.
    const transform = root.style.transform || "";
    expect(transform).not.toMatch(/rotateX|rotateY/);
  });
});
