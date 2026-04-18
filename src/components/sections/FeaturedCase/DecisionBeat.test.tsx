import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DecisionBeat } from "./DecisionBeat";

describe("<DecisionBeat />", () => {
  it("renders numeral, title, body, and children", () => {
    const { getByText } = render(
      <DecisionBeat index={0} title="WHY BLUE" body="Trust is the moat.">
        <div data-testid="proof">proof content</div>
      </DecisionBeat>,
    );
    expect(getByText("01")).toBeInTheDocument();
    expect(getByText("WHY BLUE")).toBeInTheDocument();
    expect(getByText("Trust is the moat.")).toBeInTheDocument();
    expect(getByText("proof content")).toBeInTheDocument();
  });

  it("formats numeral zero-padded for index 1 → '02'", () => {
    const { getByText } = render(
      <DecisionBeat index={1} title="MODERN" body="Restraint over spectacle.">
        <div />
      </DecisionBeat>,
    );
    expect(getByText("02")).toBeInTheDocument();
  });

  it("tags the root with data-case-beat and data-beat-index", () => {
    const { container } = render(
      <DecisionBeat index={2} title="FLOURISHES" body="Small craft, big lift.">
        <div />
      </DecisionBeat>,
    );
    const root = container.querySelector("[data-case-beat]") as HTMLElement;
    expect(root).toBeTruthy();
    expect(root.getAttribute("data-beat-index")).toBe("2");
  });

  it("renders title as h3", () => {
    const { container } = render(
      <DecisionBeat index={0} title="WHY BLUE" body="Trust.">
        <div />
      </DecisionBeat>,
    );
    expect(container.querySelector("h3")?.textContent).toBe("WHY BLUE");
  });
});
