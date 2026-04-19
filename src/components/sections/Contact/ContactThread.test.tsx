import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContactThread } from "./ContactThread";

describe("<ContactThread />", () => {
  it("renders a container with data-contact-thread-container", () => {
    const { container } = render(<ContactThread />);
    const el = container.querySelector("[data-contact-thread-container]");
    expect(el).not.toBeNull();
  });

  it("container is aria-hidden and pointer-events-none", () => {
    const { container } = render(<ContactThread />);
    const el = container.querySelector("[data-contact-thread-container]");
    expect(el).toHaveAttribute("aria-hidden", "true");
    expect(el?.className).toMatch(/pointer-events-none/);
  });

  it("renders exactly one thread line with data-contact-thread", () => {
    const { container } = render(<ContactThread />);
    const lines = container.querySelectorAll("[data-contact-thread]");
    expect(lines).toHaveLength(1);
  });

  it("renders zero dots (no data-contact-dot)", () => {
    const { container } = render(<ContactThread />);
    const dots = container.querySelectorAll("[data-contact-dot]");
    expect(dots).toHaveLength(0);
  });

  it("thread line carries the initial scaleY(0) transform inline", () => {
    const { container } = render(<ContactThread />);
    const line = container.querySelector<HTMLElement>("[data-contact-thread]");
    expect(line?.style.transform).toBe("scaleY(0)");
  });
});
