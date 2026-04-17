import { render, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Use vi.hoisted so these are available inside the hoisted vi.mock factories.
const { mockScrollTriggerKill, mockContextRevert } = vi.hoisted(() => ({
  mockScrollTriggerKill: vi.fn(),
  mockContextRevert: vi.fn(),
}));

vi.mock("gsap", () => {
  const to = vi.fn(() => ({ kill: vi.fn() }));
  const context = vi.fn((fn: () => void) => {
    fn();
    return { revert: mockContextRevert };
  });
  const registerPlugin = vi.fn();
  const ticker = { add: vi.fn(), remove: vi.fn(), lagSmoothing: vi.fn() };
  return {
    default: {
      to,
      context,
      registerPlugin,
      ticker,
      timeline: vi.fn(() => ({ to, kill: vi.fn() })),
    },
    gsap: {
      to,
      context,
      registerPlugin,
      ticker,
      timeline: vi.fn(() => ({ to, kill: vi.fn() })),
    },
  };
});

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {
    update: vi.fn(),
    kill: mockScrollTriggerKill,
    getAll: vi.fn(() => []),
  },
}));

vi.mock("lenis", () => {
  function MockLenis() {
    return { on: vi.fn(), raf: vi.fn(), destroy: vi.fn() };
  }
  return { default: vi.fn().mockImplementation(MockLenis) };
});

import { HeroClient } from "./HeroClient";

describe("<HeroClient />", () => {
  beforeEach(() => {
    document.body.innerHTML = '<section id="hero"></section>';
    // default to desktop, motion-allowed
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("min-width: 768px"),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as typeof window.matchMedia;
  });

  afterEach(() => {
    cleanup();
    document.body.innerHTML = "";
    vi.clearAllMocks();
  });

  it("returns null (no visible output)", () => {
    const { container } = render(<HeroClient />);
    expect(container.innerHTML).toBe("");
  });

  it("does not throw when mounted with a #hero present in the DOM", () => {
    expect(() => render(<HeroClient />)).not.toThrow();
  });

  it("does not throw when #hero is absent (SSR-safe no-op)", () => {
    document.body.innerHTML = "";
    expect(() => render(<HeroClient />)).not.toThrow();
  });

  it("calls ctx.revert on unmount", () => {
    const { unmount } = render(<HeroClient />);
    unmount();
    expect(mockContextRevert).toHaveBeenCalled();
  });

  it("respects prefers-reduced-motion: reduce", () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as typeof window.matchMedia;
    expect(() => render(<HeroClient />)).not.toThrow();
  });
});
