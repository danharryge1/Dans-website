import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BeliefBlock } from "./BeliefBlock";

const entry = {
  id: "sample",
  headline: "Headline text.",
  body: "Body text.",
  scale: "lg" as const,
};

describe("<BeliefBlock />", () => {
  it("tags the root as article with data-philosophy-block", () => {
    const { container } = render(<BeliefBlock belief={entry} />);
    const root = container.querySelector("article") as HTMLElement;
    expect(root).not.toBeNull();
    expect(root.getAttribute("data-philosophy-block")).toBe("");
  });

  it("renders the headline as h3", () => {
    const { container } = render(<BeliefBlock belief={entry} />);
    const h3 = container.querySelector("h3");
    expect(h3?.textContent).toBe("Headline text.");
  });

  it("renders the body as p", () => {
    const { getByText } = render(<BeliefBlock belief={entry} />);
    expect(getByText("Body text.").tagName).toBe("P");
  });

  it("renders a gold-rule span with data-philosophy-rule and aria-hidden", () => {
    const { container } = render(<BeliefBlock belief={entry} />);
    const rule = container.querySelector("[data-philosophy-rule]") as HTMLElement;
    expect(rule).not.toBeNull();
    expect(rule.getAttribute("aria-hidden")).toBe("true");
    expect(rule.tagName).toBe("SPAN");
  });

  it("applies data-scale='lg' when scale is 'lg'", () => {
    const { container } = render(<BeliefBlock belief={entry} />);
    const root = container.querySelector("article") as HTMLElement;
    expect(root.getAttribute("data-scale")).toBe("lg");
  });

  it("applies data-scale='xl' when scale is 'xl'", () => {
    const xlEntry = { ...entry, scale: "xl" as const };
    const { container } = render(<BeliefBlock belief={xlEntry} />);
    const root = container.querySelector("article") as HTMLElement;
    expect(root.getAttribute("data-scale")).toBe("xl");
  });

  it("defaults data-scale to 'lg' when scale is undefined", () => {
    const bare = { id: "bare", headline: "h", body: "b" };
    const { container } = render(<BeliefBlock belief={bare} />);
    const root = container.querySelector("article") as HTMLElement;
    expect(root.getAttribute("data-scale")).toBe("lg");
  });
});
