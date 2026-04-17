import { render, cleanup } from "@testing-library/react";
import type { Mock } from "vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Use vi.hoisted so these are available inside the hoisted vi.mock factories.
const {
  mockScrollTriggerKill,
  mockContextRevert,
  mockLenisCtor,
  mockTickerAdd,
} = vi.hoisted(() => ({
  mockScrollTriggerKill: vi.fn(),
  mockContextRevert: vi.fn(),
  mockLenisCtor: vi.fn(),
  mockTickerAdd: vi.fn(),
}));

vi.mock("gsap", () => {
  const to = vi.fn(() => ({ kill: vi.fn() }));
  const context = vi.fn((fn: () => void) => {
    fn();
    return { revert: mockContextRevert };
  });
  const registerPlugin = vi.fn();
  const ticker = {
    add: mockTickerAdd,
    remove: vi.fn(),
    lagSmoothing: vi.fn(),
  };
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
  // Must be callable as a constructor (component uses `new Lenis()`),
  // so wrap the spy in a function that delegates to it.
  function MockLenis() {
    mockLenisCtor();
    return { on: vi.fn(), raf: vi.fn(), destroy: vi.fn() };
  }
  return { default: MockLenis };
});

import { HeroClient } from "./HeroClient";

// Shared IO spy state between the stub class and tests.
type IOCallback = (entries: Array<{ isIntersecting: boolean }>) => void;
let ioObserveSpy: Mock;
let ioDisconnectSpy: Mock;
let ioCtorSpy: Mock;
let lastIOCallback: IOCallback | null = null;

class FakeIntersectionObserver {
  constructor(cb: IOCallback) {
    ioCtorSpy(cb);
    lastIOCallback = cb;
  }
  observe(...args: unknown[]) {
    ioObserveSpy(...args);
  }
  disconnect() {
    ioDisconnectSpy();
  }
  unobserve() {}
  takeRecords() {
    return [];
  }
}

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

    ioObserveSpy = vi.fn();
    ioDisconnectSpy = vi.fn();
    ioCtorSpy = vi.fn();
    lastIOCallback = null;
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
  });

  afterEach(() => {
    cleanup();
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
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

  it("respects prefers-reduced-motion: reduce (skips Lenis and ticker)", () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as typeof window.matchMedia;

    render(<HeroClient />);

    // Reduced-motion branch must short-circuit before Lenis / ticker wiring.
    expect(mockLenisCtor).not.toHaveBeenCalled();
    expect(mockTickerAdd).not.toHaveBeenCalled();
  });

  it("on mobile: constructs an IntersectionObserver, observes #hero, disconnects on first intersection", () => {
    // Force the mobile branch: matchMedia returns false for min-width: 768px.
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as typeof window.matchMedia;

    render(<HeroClient />);

    expect(ioCtorSpy).toHaveBeenCalledTimes(1);
    const section = document.getElementById("hero");
    expect(ioObserveSpy).toHaveBeenCalledWith(section);

    // Simulate an intersecting entry — one-shot handler should disconnect.
    expect(lastIOCallback).toBeTypeOf("function");
    lastIOCallback?.([{ isIntersecting: true }]);
    expect(ioDisconnectSpy).toHaveBeenCalled();
  });
});
