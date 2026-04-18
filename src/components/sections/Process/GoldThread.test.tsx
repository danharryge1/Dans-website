import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GoldThread } from "./GoldThread";

describe("<GoldThread />", () => {
  it("renders a container with data-process-thread-container", () => {
    const { container } = render(<GoldThread />);
    const threadContainer = container.querySelector(
      "[data-process-thread-container]",
    );
    expect(threadContainer).not.toBeNull();
  });

  it("renders one thread line child with data-process-thread", () => {
    const { container } = render(<GoldThread />);
    const lines = container.querySelectorAll("[data-process-thread]");
    expect(lines).toHaveLength(1);
  });

  it("renders three dots with data-process-dot values '1', '2', '3'", () => {
    const { container } = render(<GoldThread />);
    const dots = container.querySelectorAll("[data-process-dot]");
    expect(dots).toHaveLength(3);
    expect(dots[0]).toHaveAttribute("data-process-dot", "1");
    expect(dots[1]).toHaveAttribute("data-process-dot", "2");
    expect(dots[2]).toHaveAttribute("data-process-dot", "3");
  });

  it("the container and all thread elements are aria-hidden", () => {
    const { container } = render(<GoldThread />);
    const threadContainer = container.querySelector(
      "[data-process-thread-container]",
    );
    expect(threadContainer).toHaveAttribute("aria-hidden", "true");

    const line = container.querySelector("[data-process-thread]");
    expect(line).toHaveAttribute("aria-hidden", "true");

    const dots = container.querySelectorAll("[data-process-dot]");
    for (const dot of dots) {
      expect(dot).toHaveAttribute("aria-hidden", "true");
    }
  });
});
