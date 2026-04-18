import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PhaseBlock } from "./PhaseBlock";
import type { Phase } from "./phases.data";

const samplePhase: Phase = {
  id: "brief",
  number: "01",
  title: "THE BRIEF",
  body: "Sample body text for the brief phase.",
};

describe("<PhaseBlock />", () => {
  it("renders an <article> with data-process-block", () => {
    const { container } = render(<PhaseBlock phase={samplePhase} />);
    const article = container.querySelector("article");
    expect(article).not.toBeNull();
    expect(article).toHaveAttribute("data-process-block");
  });

  it("sets data-phase-number to the phase's number", () => {
    const { container } = render(<PhaseBlock phase={samplePhase} />);
    const article = container.querySelector("article");
    expect(article).toHaveAttribute("data-phase-number", "01");
  });

  it("renders a decorative numeral with aria-hidden='true' and data-process-numeral", () => {
    const { container } = render(<PhaseBlock phase={samplePhase} />);
    const numeral = container.querySelector("[data-process-numeral]");
    expect(numeral).not.toBeNull();
    expect(numeral).toHaveAttribute("aria-hidden", "true");
    expect(numeral?.textContent).toBe("01");
  });

  it("renders the title as an <h3>", () => {
    render(<PhaseBlock phase={samplePhase} />);
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveTextContent("THE BRIEF");
  });

  it("renders the body as a <p>", () => {
    const { container } = render(<PhaseBlock phase={samplePhase} />);
    const paragraph = container.querySelector("p");
    expect(paragraph).not.toBeNull();
    expect(paragraph?.textContent).toBe("Sample body text for the brief phase.");
  });
});
