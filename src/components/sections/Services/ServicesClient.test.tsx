/* eslint-disable @typescript-eslint/no-explicit-any */
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const scrollTriggerCreate = vi.fn();
const scrollTriggerKill = vi.fn();
const gsapContextRevert = vi.fn();
const gsapSetSpy = vi.fn();
const gsapToSpy = vi.fn();

vi.mock("gsap", () => {
  const gsap = {
    registerPlugin: vi.fn(),
    set: gsapSetSpy,
    to: gsapToSpy,
    context: (fn: () => void) => {
      fn();
      return { revert: gsapContextRevert };
    },
  };
  return { default: gsap, gsap };
});

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {
    create: (opts: any) => {
      scrollTriggerCreate(opts);
      return { kill: scrollTriggerKill };
    },
    getAll: () => [],
  },
}));

function Harness() {
  return (
    <section id="services" aria-labelledby="services-heading">
      <h2 id="services-heading" data-services-heading>
        TAILORED DIGITAL SOLUTIONS
      </h2>
      <div data-services-grid>
        <article data-services-card data-card-id="ui-ux" data-card-index="0">
          <svg><path data-services-arc-path /><circle data-services-arc-dot /></svg>
        </article>
        <article data-services-card data-card-id="custom-dev" data-card-index="1">
          <svg><path data-services-arc-path /><circle data-services-arc-dot /></svg>
        </article>
        <article data-services-card data-card-id="brand" data-card-index="2">
          <svg><path data-services-arc-path /><circle data-services-arc-dot /></svg>
        </article>
      </div>
    </section>
  );
}

describe("<ServicesClient /> — desktop branch", () => {
  beforeEach(() => {
    scrollTriggerCreate.mockReset();
    scrollTriggerKill.mockReset();
    gsapContextRevert.mockReset();
    gsapSetSpy.mockReset();
    gsapToSpy.mockReset();

    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: query.includes("min-width"), // desktop=true, reduced-motion=false
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("creates one ScrollTrigger per card + one for the heading", async () => {
    const { ServicesClient } = await import("./ServicesClient");
    render(
      <>
        <Harness />
        <ServicesClient />
      </>,
    );
    expect(scrollTriggerCreate).toHaveBeenCalledTimes(4);
  });

  it("initialises every card with --sweep-x: 0 before wiring scroll", async () => {
    const { ServicesClient } = await import("./ServicesClient");
    render(
      <>
        <Harness />
        <ServicesClient />
      </>,
    );
    const calls = gsapSetSpy.mock.calls;
    const hasCardReset = calls.some(([target, vars]) => {
      const t = Array.isArray(target) ? target[0] : target;
      return (
        (t as HTMLElement)?.hasAttribute?.("data-services-card") === true &&
        (vars as any)["--sweep-x"] === 0
      );
    });
    expect(hasCardReset).toBe(true);
  });

  it("reverts gsap context on unmount", async () => {
    const { ServicesClient } = await import("./ServicesClient");
    const { unmount } = render(
      <>
        <Harness />
        <ServicesClient />
      </>,
    );
    unmount();
    expect(gsapContextRevert).toHaveBeenCalled();
  });
});
