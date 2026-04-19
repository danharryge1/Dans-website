import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Contact } from "./Contact";

describe("<Contact />", () => {
  it("renders a <section> with id='contact' and aria-labelledby", () => {
    const { container } = render(<Contact />);
    const section = container.querySelector("section");
    expect(section).toHaveAttribute("id", "contact");
    expect(section).toHaveAttribute("aria-labelledby", "contact-heading");
  });

  it("renders the headline as an <h2 id='contact-heading'>", () => {
    render(<Contact />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveAttribute("id", "contact-heading");
    expect(heading).toHaveTextContent("TELL ME WHAT YOU WANT");
  });

  it("renders the bookend rule (data-contact-bookend)", () => {
    const { container } = render(<Contact />);
    const bookend = container.querySelector("[data-contact-bookend]");
    expect(bookend).not.toBeNull();
  });

  it("renders the paragraph lines with data-contact-paragraph", () => {
    const { container } = render(<Contact />);
    const paragraph = container.querySelector("[data-contact-paragraph]");
    expect(paragraph).not.toBeNull();
    expect(paragraph?.textContent).toContain(
      "One person. A few projects at a time.",
    );
    expect(paragraph?.textContent).toContain("I come back with the shape of it");
  });

  it("renders the form (Name, Email, Message fields)", () => {
    render(<Contact />);
    expect(screen.getByLabelText("Your Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Your Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Project Details")).toBeInTheDocument();
  });
});
