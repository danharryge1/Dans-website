import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  submitContactMock: vi.fn(),
}));

vi.mock("@/lib/contact-action", () => ({
  submitContact: mocks.submitContactMock,
}));

import { ContactForm } from "./ContactForm";

describe("<ContactForm />", () => {
  beforeEach(() => {
    mocks.submitContactMock.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders name, email, and message fields with accessible labels", () => {
    render(<ContactForm />);
    expect(screen.getByLabelText("Your Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Your Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Project Details")).toBeInTheDocument();
  });

  it("renders the submit button with idle label 'SEND IT'", () => {
    render(<ContactForm />);
    const btn = screen.getByRole("button", { name: /send it/i });
    expect(btn).toBeInTheDocument();
  });

  it("honeypot website field is hidden from a11y tree", () => {
    render(<ContactForm />);
    expect(
      screen.queryByRole("textbox", { name: /website/i }),
    ).toBeNull();
  });

  it("each field carries data-contact-field for motion selection", () => {
    const { container } = render(<ContactForm />);
    const fields = container.querySelectorAll("[data-contact-field]");
    expect(fields.length).toBeGreaterThanOrEqual(3);
  });

  it("submit button carries data-contact-submit", () => {
    const { container } = render(<ContactForm />);
    const submit = container.querySelector("[data-contact-submit]");
    expect(submit).not.toBeNull();
  });

  it("renders the success block when submitContact returns success", async () => {
    mocks.submitContactMock.mockResolvedValueOnce({ status: "success" });
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByLabelText("Your Name"), "Ada Lovelace");
    await user.type(screen.getByLabelText("Your Email"), "ada@example.com");
    await user.type(
      screen.getByLabelText("Project Details"),
      "I want a landing page for analytics.",
    );
    await user.click(screen.getByRole("button", { name: /send it/i }));

    expect(
      await screen.findByRole("heading", { level: 3, name: /got it/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/i'll write back within two days/i),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /send it/i })).toBeNull();
  });

  it("renders inline field errors when submitContact returns errors", async () => {
    mocks.submitContactMock.mockResolvedValueOnce({
      status: "error",
      errors: {
        name: "I'll need a name.",
        email: "That email looks wrong.",
        message: "Say a bit more.",
      },
    });
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByLabelText("Your Name"), "x");
    await user.type(screen.getByLabelText("Your Email"), "x");
    await user.type(screen.getByLabelText("Project Details"), "x");
    await user.click(screen.getByRole("button", { name: /send it/i }));

    expect(await screen.findByText("I'll need a name.")).toBeInTheDocument();
    expect(screen.getByText("That email looks wrong.")).toBeInTheDocument();
    expect(screen.getByText("Say a bit more.")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send it/i }),
    ).toBeInTheDocument();
  });

  it("renders network-error row with mailto fallback when submitContact returns networkError", async () => {
    mocks.submitContactMock.mockResolvedValueOnce({ status: "networkError" });
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByLabelText("Your Name"), "Ada");
    await user.type(screen.getByLabelText("Your Email"), "ada@example.com");
    await user.type(
      screen.getByLabelText("Project Details"),
      "I want a landing page for analytics.",
    );
    await user.click(screen.getByRole("button", { name: /send it/i }));

    const errorRow = await screen.findByText(/something went sideways/i);
    expect(errorRow).toBeInTheDocument();
    const mailto = screen.getByRole("link", {
      name: /danharryge@gmail\.com/i,
    });
    expect(mailto).toHaveAttribute("href", "mailto:dannyhgeorge@gmail.com");
  });
});
