import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WorkCard } from "./WorkCard";

describe("<WorkCard /> — real project", () => {
  const entry = {
    id: "nextup",
    title: "NEXTUP",
    year: 2026,
    descriptor: "Built on trust, for a modern service company.",
    thumbnailSrc: "/assets/hero/nextup-live-poster.webp",
    thumbnailAlt: "NextUp, live homepage",
  };

  it("renders the thumbnail with correct src + alt", () => {
    const { container } = render(<WorkCard entry={entry} />);
    const img = container.querySelector("img") as HTMLImageElement;
    expect(img.getAttribute("src")).toContain("nextup-live-poster.webp");
    expect(img.getAttribute("alt")).toBe("NextUp, live homepage");
  });

  it("renders the project title as an h3", () => {
    const { container } = render(<WorkCard entry={entry} />);
    const h3 = container.querySelector("h3");
    expect(h3?.textContent).toBe("NEXTUP");
  });

  it("renders the descriptor and year", () => {
    const { getByText } = render(<WorkCard entry={entry} />);
    expect(getByText("Built on trust, for a modern service company.")).toBeInTheDocument();
    expect(getByText("2026")).toBeInTheDocument();
  });

  it("tags the root as an article with data hooks", () => {
    const { container } = render(<WorkCard entry={entry} />);
    const root = container.querySelector("article") as HTMLElement;
    expect(root.getAttribute("data-work-card")).toBe("");
    expect(root.getAttribute("data-card-id")).toBe("nextup");
  });
});

describe("<WorkCard /> — placeholder", () => {
  it("renders a placeholder card with ON DECK label + dashed border marker", () => {
    const { container, getByText } = render(<WorkCard placeholder />);
    expect(getByText("ON DECK →")).toBeInTheDocument();
    expect(getByText("New project landing soon.")).toBeInTheDocument();

    const root = container.querySelector("article") as HTMLElement;
    expect(root.getAttribute("data-work-card-placeholder")).toBe("");
    expect(root.getAttribute("aria-label")).toBe("Placeholder, new project landing soon");
  });

  it("does not render an img or year when placeholder", () => {
    const { container } = render(<WorkCard placeholder />);
    expect(container.querySelector("img")).toBeNull();
  });
});
