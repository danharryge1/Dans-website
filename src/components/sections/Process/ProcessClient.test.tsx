import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createMock: vi.fn(),
  contextMock: vi.fn(),
  setMock: vi.fn(),
  toMock: vi.fn(),
  registerPluginMock: vi.fn(),
  revertMock: vi.fn(),
  observeMock: vi.fn(),
  disconnectMock: vi.fn(),
}));

vi.mock("gsap", () => ({
  default: {
    registerPlugin: mocks.registerPluginMock,
    context: (fn: () => void) => {
      mocks.contextMock(fn);
      fn();
      return { revert: mocks.revertMock };
    },
    set: mocks.setMock,
    to: mocks.toMock,
  },
}));

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {
    create: mocks.createMock,
  },
}));

import { ProcessClient } from "./ProcessClient";

class ResizeObserverStub {
  constructor(_cb: ResizeObserverCallback) {}
  observe = mocks.observeMock;
  unobserve = vi.fn();
  disconnect = mocks.disconnectMock;
}

function mountProcessDOM() {
  document.body.innerHTML = `
    <section id="process">
      <div class="inner">
        <span data-process-bookend></span>
        <h2 id="process-heading" data-process-eyebrow>THE PROCESS</h2>
        <article data-process-block data-phase-number="01">
          <span data-process-numeral>01</span>
          <h3>THE BRIEF</h3>
          <p>body 1</p>
        </article>
        <article data-process-block data-phase-number="02">
          <span data-process-numeral>02</span>
          <h3>THE BUILD</h3>
          <p>body 2</p>
        </article>
        <article data-process-block data-phase-number="03">
          <span data-process-numeral>03</span>
          <h3>THE SHIP</h3>
          <p>body 3</p>
        </article>
        <div data-process-thread-container>
          <span data-process-thread></span>
          <span data-process-dot="1"></span>
          <span data-process-dot="2"></span>
          <span data-process-dot="3"></span>
        </div>
      </div>
    </section>
  `;
}

describe("<ProcessClient />", () => {
  beforeEach(() => {
    Object.values(mocks).forEach((m) => m.mockClear?.());
    document.body.innerHTML = "";
    (globalThis as unknown as { ResizeObserver: typeof ResizeObserverStub }).ResizeObserver = ResizeObserverStub;
  });

  afterEach(() => {
    cleanup();
  });

  it("returns null (renders no DOM)", () => {
    mountProcessDOM();
    const { container } = render(<ProcessClient />);
    expect(container.innerHTML).toBe("");
  });

  it("does nothing when prefers-reduced-motion matches", () => {
    mountProcessDOM();
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;

    render(<ProcessClient />);

    expect(mocks.contextMock).not.toHaveBeenCalled();
    expect(mocks.createMock).not.toHaveBeenCalled();
    expect(mocks.observeMock).not.toHaveBeenCalled();

    window.matchMedia = originalMatchMedia;
  });

  it("creates five ScrollTriggers when motion is allowed (1 thread scrub + 3 blocks + 1 eyebrow)", () => {
    mountProcessDOM();
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;

    render(<ProcessClient />);

    expect(mocks.contextMock).toHaveBeenCalledTimes(1);
    expect(mocks.createMock).toHaveBeenCalledTimes(5);

    window.matchMedia = originalMatchMedia;
  });

  it("installs a ResizeObserver on the section when motion is allowed", () => {
    mountProcessDOM();
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;

    render(<ProcessClient />);

    expect(mocks.observeMock).toHaveBeenCalledTimes(1);

    window.matchMedia = originalMatchMedia;
  });

  it("calls ctx.revert and ResizeObserver.disconnect on unmount", () => {
    mountProcessDOM();
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;

    const { unmount } = render(<ProcessClient />);
    unmount();
    expect(mocks.revertMock).toHaveBeenCalledTimes(1);
    expect(mocks.disconnectMock).toHaveBeenCalledTimes(1);

    window.matchMedia = originalMatchMedia;
  });
});
