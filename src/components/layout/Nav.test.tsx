import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn().mockReturnValue("/"),
}));

import { Nav } from "./Nav";

describe("<Nav /> — links", () => {
  it("renders 4 named links", () => {
    render(<Nav />);
    ["SERVICES", "WORK", "WHO I AM", "CONTACT"].forEach((label) => {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    });
  });

  it("renders as a <nav> landmark positioned fixed to top", () => {
    const { container } = render(<Nav />);
    const nav = container.querySelector("nav")!;
    expect(nav.className).toContain("fixed");
    expect(nav.className).toContain("top-0");
  });
});

describe("<Nav /> — mobile overlay", () => {
  it("shows a hamburger button on mobile that opens the overlay", () => {
    render(<Nav />);
    const btn = screen.getByRole("button", { name: /open menu/i });
    expect(btn).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.click(btn);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog.querySelectorAll("a[href]")).toHaveLength(6);
  });

  it("close button inside the overlay dismisses it", () => {
    render(<Nav />);
    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    fireEvent.click(screen.getByRole("button", { name: /close menu/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("<Nav /> — scroll state", () => {
  const originalScrollY = Object.getOwnPropertyDescriptor(window, "scrollY");

  beforeEach(() => {
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true, writable: true });
  });

  afterEach(() => {
    if (originalScrollY) Object.defineProperty(window, "scrollY", originalScrollY);
  });

  it("starts without the scrolled class", () => {
    const { container } = render(<Nav />);
    expect(container.querySelector("nav")!.getAttribute("data-scrolled")).toBe("false");
  });

  it("applies data-scrolled=\"true\" once scrollY > 100", () => {
    const { container } = render(<Nav />);
    act(() => {
      Object.defineProperty(window, "scrollY", { value: 150, configurable: true, writable: true });
      window.dispatchEvent(new Event("scroll"));
    });
    expect(container.querySelector("nav")!.getAttribute("data-scrolled")).toBe("true");
  });
});

describe("<Nav /> — active link on /about", () => {
  it("marks WHO I AM as aria-current when pathname is /about", async () => {
    const { usePathname } = await import("next/navigation");
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/about");

    const { container } = render(<Nav />);
    const whoLink = Array.from(container.querySelectorAll("nav ul a")).find(
      (a) => a.textContent?.trim() === "WHO I AM",
    );
    expect(whoLink?.getAttribute("aria-current")).toBe("page");

    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/");
  });
});
