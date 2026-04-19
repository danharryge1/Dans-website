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

import { ContactClient } from "./ContactClient";

class ResizeObserverStub {
  constructor(_cb: ResizeObserverCallback) {
    void _cb;
  }
  observe = mocks.observeMock;
  unobserve = vi.fn();
  disconnect = mocks.disconnectMock;
}

function mountContactDOM() {
  document.body.innerHTML = `
    <section id="contact">
      <div class="inner">
        <span data-contact-bookend></span>
        <h2 id="contact-heading" data-contact-headline>TELL ME WHAT YOU WANT</h2>
        <div data-contact-paragraph></div>
        <form>
          <div data-contact-field></div>
          <div data-contact-field></div>
          <div data-contact-field></div>
          <button data-contact-submit></button>
        </form>
        <div data-contact-thread-container>
          <span data-contact-thread></span>
        </div>
      </div>
    </section>
  `;
}

describe("<ContactClient />", () => {
  beforeEach(() => {
    Object.values(mocks).forEach((m) => m.mockClear?.());
    document.body.innerHTML = "";
    (
      globalThis as unknown as { ResizeObserver: typeof ResizeObserverStub }
    ).ResizeObserver = ResizeObserverStub;
  });

  afterEach(() => {
    cleanup();
  });

  it("returns null (renders no DOM)", () => {
    mountContactDOM();
    const { container } = render(<ContactClient />);
    expect(container.innerHTML).toBe("");
  });

  it("does nothing when prefers-reduced-motion matches", () => {
    mountContactDOM();
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;

    render(<ContactClient />);

    expect(mocks.contextMock).not.toHaveBeenCalled();
    expect(mocks.createMock).not.toHaveBeenCalled();
    expect(mocks.observeMock).not.toHaveBeenCalled();

    window.matchMedia = originalMatchMedia;
  });

  it("creates four ScrollTriggers when motion is allowed (1 thread scrub + 1 headline + 1 paragraph + 1 form stagger)", () => {
    mountContactDOM();
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;

    render(<ContactClient />);

    expect(mocks.contextMock).toHaveBeenCalledTimes(1);
    expect(mocks.createMock).toHaveBeenCalledTimes(4);

    window.matchMedia = originalMatchMedia;
  });

  it("installs a ResizeObserver on the section when motion is allowed", () => {
    mountContactDOM();
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;

    render(<ContactClient />);

    expect(mocks.observeMock).toHaveBeenCalledTimes(1);

    window.matchMedia = originalMatchMedia;
  });

  it("calls ctx.revert and ResizeObserver.disconnect on unmount", () => {
    mountContactDOM();
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;

    const { unmount } = render(<ContactClient />);
    unmount();
    expect(mocks.revertMock).toHaveBeenCalledTimes(1);
    expect(mocks.disconnectMock).toHaveBeenCalledTimes(1);

    window.matchMedia = originalMatchMedia;
  });
});
