import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Stub ServicesClient — client-only lifecycle is tested separately.
vi.mock("./ServicesClient", () => ({
  ServicesClient: () => null,
}));

import { Services } from "./Services";

describe("<Services />", () => {
  it("renders a <section> with the expected id and aria-labelledby", () => {
    const { container } = render(<Services />);
    const section = container.querySelector("section") as HTMLElement;
    expect(section.id).toBe("services");
    expect(section.getAttribute("aria-labelledby")).toBe("services-heading");
  });

  it("renders the locked heading text", () => {
    const { getByRole } = render(<Services />);
    const h2 = getByRole("heading", { level: 2 });
    expect(h2.id).toBe("services-heading");
    expect(h2.textContent).toBe("TAILORED DIGITAL SOLUTIONS");
  });

  it("renders a grid marked as a list with three listitems", () => {
    const { container } = render(<Services />);
    const list = container.querySelector('[role="list"]') as HTMLElement;
    expect(list).toBeTruthy();
    const items = list.querySelectorAll('[role="listitem"]');
    expect(items.length).toBe(3);
  });

  it("renders all three locked card titles", () => {
    const { getByText } = render(<Services />);
    expect(getByText("UI / UX DESIGN")).toBeInTheDocument();
    expect(getByText("CUSTOM DEVELOPMENT")).toBeInTheDocument();
    expect(getByText("BRAND STRATEGY")).toBeInTheDocument();
  });
});
