import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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

import { AboutClient } from "./AboutClient";

function mountWithAboutSection() {
  document.body.innerHTML = `
    <section id="about">
      <p data-about-eyebrow>WHO I AM</p>
      <h1 data-about-name>DAN GEORGE</h1>
      <p data-about-subtitle>One person. Every decision.</p>
      <p data-about-para>Paragraph one.</p>
      <p data-about-para>Paragraph two.</p>
      <div data-about-fact>Fact 1</div>
      <div data-about-fact>Fact 2</div>
      <div data-about-fact>Fact 3</div>
      <p data-about-closing>THE SITE IS THE PITCH.</p>
      <a data-about-cta href="#contact">START A PROJECT</a>
    </section>
  `;
}

describe("<AboutClient />", () => {
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
    mountWithAboutSection();
    const { container } = render(<AboutClient />);
    expect(container.innerHTML).toBe("");
  });

  it("does nothing when prefers-reduced-motion matches", () => {
    mountWithAboutSection();
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;

    render(<AboutClient />);

    expect(contextMock).not.toHaveBeenCalled();
    expect(createMock).not.toHaveBeenCalled();

    window.matchMedia = originalMatchMedia;
  });

  it("creates 6 ScrollTriggers when motion is allowed", () => {
    mountWithAboutSection();
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;

    render(<AboutClient />);

    // eyebrow + name+subtitle + para[0] + para[1] + facts-group + closing+cta
    expect(contextMock).toHaveBeenCalledTimes(1);
    expect(createMock).toHaveBeenCalledTimes(6);

    window.matchMedia = originalMatchMedia;
  });

  it("calls ctx.revert on unmount", () => {
    mountWithAboutSection();
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;

    const { unmount } = render(<AboutClient />);
    unmount();
    expect(revertMock).toHaveBeenCalledTimes(1);

    window.matchMedia = originalMatchMedia;
  });
});
