import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Use vi.hoisted so these are available inside the hoisted vi.mock factories.
const {
  createMock,
  contextMock,
  setMock,
  toMock,
  registerPluginMock,
  revertMock,
} = vi.hoisted(() => ({
  createMock: vi.fn(),
  contextMock: vi.fn(),
  setMock: vi.fn(),
  toMock: vi.fn(),
  registerPluginMock: vi.fn(),
  revertMock: vi.fn(),
}));

vi.mock("gsap", () => ({
  default: {
    registerPlugin: registerPluginMock,
    context: (fn: () => void) => {
      contextMock(fn);
      fn();
      return { revert: revertMock };
    },
    set: setMock,
    to: toMock,
  },
}));

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {
    create: createMock,
  },
}));

import { PhilosophyClient } from "./PhilosophyClient";

function mountWithBlocks() {
  document.body.innerHTML = `
    <section id="philosophy">
      <h2 data-philosophy-eyebrow>OUR PHILOSOPHY</h2>
      <article data-philosophy-block data-scale="xl">
        <h3>One</h3>
        <span data-philosophy-rule></span>
        <p>body one</p>
      </article>
      <article data-philosophy-block data-scale="lg">
        <h3>Two</h3>
        <span data-philosophy-rule></span>
        <p>body two</p>
      </article>
      <article data-philosophy-block data-scale="lg">
        <h3>Three</h3>
        <span data-philosophy-rule></span>
        <p>body three</p>
      </article>
    </section>
  `;
}

describe("<PhilosophyClient />", () => {
  beforeEach(() => {
    createMock.mockClear();
    contextMock.mockClear();
    setMock.mockClear();
    toMock.mockClear();
    registerPluginMock.mockClear();
    revertMock.mockClear();
    document.body.innerHTML = "";
  });

  afterEach(() => {
    cleanup();
  });

  it("returns null (renders no DOM)", () => {
    mountWithBlocks();
    const { container } = render(<PhilosophyClient />);
    expect(container.innerHTML).toBe("");
  });

  it("does nothing when prefers-reduced-motion matches", () => {
    mountWithBlocks();
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;

    render(<PhilosophyClient />);

    expect(contextMock).not.toHaveBeenCalled();
    expect(createMock).not.toHaveBeenCalled();

    window.matchMedia = originalMatchMedia;
  });

  it("creates four ScrollTriggers (one per block + one for eyebrow) when motion is allowed", () => {
    mountWithBlocks();
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;

    render(<PhilosophyClient />);

    expect(contextMock).toHaveBeenCalledTimes(1);
    expect(createMock).toHaveBeenCalledTimes(4);

    window.matchMedia = originalMatchMedia;
  });

  it("calls ctx.revert on unmount when motion ran", () => {
    mountWithBlocks();
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;

    const { unmount } = render(<PhilosophyClient />);
    unmount();
    expect(revertMock).toHaveBeenCalledTimes(1);

    window.matchMedia = originalMatchMedia;
  });
});
