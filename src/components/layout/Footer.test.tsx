import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer } from "./Footer";

describe("<Footer />", () => {
  it("renders the copyright with the current year", () => {
    const year = new Date().getFullYear();
    render(<Footer />);
    expect(
      screen.getByText(`© ${year} DanGeorge.studio. Every pixel considered.`),
    ).toBeInTheDocument();
  });

  it("is a <footer> landmark", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("uses the grid-line token for its top border", () => {
    const { container } = render(<Footer />);
    const el = container.querySelector("footer")!;
    // border colour is applied via inline style referencing the CSS var
    expect(el.getAttribute("style") ?? "").toContain("--grid-line");
  });
});
