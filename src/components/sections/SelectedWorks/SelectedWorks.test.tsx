import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SelectedWorks } from "./SelectedWorks";

describe("<SelectedWorks />", () => {
  it("renders a <section> with the expected id and aria-labelledby", () => {
    const { container } = render(<SelectedWorks />);
    const section = container.querySelector("section") as HTMLElement;
    expect(section.id).toBe("selected-works");
    expect(section.getAttribute("aria-labelledby")).toBe("selected-works-heading");
  });

  it("renders the locked heading text as h2", () => {
    const { getByRole } = render(<SelectedWorks />);
    const h2 = getByRole("heading", { level: 2 });
    expect(h2.id).toBe("selected-works-heading");
    expect(h2.textContent).toBe("SELECTED WORKS");
  });

  it("renders one WorkCard for NextUp plus the placeholder", () => {
    const { container, getByText } = render(<SelectedWorks />);
    const realCards = container.querySelectorAll("[data-work-card]");
    const placeholders = container.querySelectorAll("[data-work-card-placeholder]");
    expect(realCards.length).toBe(1);
    expect(placeholders.length).toBe(1);
    expect(getByText("NEXTUP")).toBeInTheDocument();
    expect(getByText("ON DECK →")).toBeInTheDocument();
  });

  it("renders the cards inside a scroll-snapping row", () => {
    const { container } = render(<SelectedWorks />);
    const row = container.querySelector("[data-works-row]") as HTMLElement;
    expect(row).toBeTruthy();
    expect(row.className).toContain("flex");
  });
});
