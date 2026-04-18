import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Process } from "./Process";

describe("<Process />", () => {
  it("renders <section id='process' aria-labelledby='process-heading'>", () => {
    const { container } = render(<Process />);
    const section = container.querySelector("section");
    expect(section).not.toBeNull();
    expect(section).toHaveAttribute("id", "process");
    expect(section).toHaveAttribute("aria-labelledby", "process-heading");
  });

  it("renders <h2 id='process-heading'> with text 'THE PROCESS'", () => {
    const { container } = render(<Process />);
    const heading = container.querySelector("#process-heading");
    expect(heading).not.toBeNull();
    expect(heading?.tagName).toBe("H2");
    expect(heading?.textContent).toBe("THE PROCESS");
  });

  it("renders one bookend rule (top)", () => {
    const { container } = render(<Process />);
    const bookends = container.querySelectorAll("[data-process-bookend]");
    expect(bookends).toHaveLength(1);
  });

  it("renders exactly three phase blocks in data order", () => {
    const { container } = render(<Process />);
    const blocks = container.querySelectorAll("[data-process-block]");
    expect(blocks).toHaveLength(3);
    expect(blocks[0]).toHaveAttribute("data-phase-number", "01");
    expect(blocks[1]).toHaveAttribute("data-phase-number", "02");
    expect(blocks[2]).toHaveAttribute("data-phase-number", "03");
  });

  it("renders the GoldThread overlay", () => {
    const { container } = render(<Process />);
    const thread = container.querySelector("[data-process-thread-container]");
    expect(thread).not.toBeNull();
  });
});
