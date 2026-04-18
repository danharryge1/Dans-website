/* eslint-disable @typescript-eslint/no-explicit-any */
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const {
  scrollTriggerCreate,
  gsapContextRevert,
  gsapSetSpy,
  gsapToSpy,
  timelineFromToSpy,
  timelineAddLabelSpy,
} = vi.hoisted(() => ({
  scrollTriggerCreate: vi.fn(),
  gsapContextRevert: vi.fn(),
  gsapSetSpy: vi.fn(),
  gsapToSpy: vi.fn(),
  timelineFromToSpy: vi.fn(),
  timelineAddLabelSpy: vi.fn(),
}));

function makeTimeline() {
  const tl: any = {
    to: (...args: any[]) => {
      gsapToSpy(...args);
      return tl;
    },
    fromTo: (...args: any[]) => {
      timelineFromToSpy(...args);
      return tl;
    },
    addLabel: (...args: any[]) => {
      timelineAddLabelSpy(...args);
      return tl;
    },
    add: (fn: () => void) => {
      if (typeof fn === "function") fn();
      return tl;
    },
    set: (...args: any[]) => {
      gsapSetSpy(...args);
      return tl;
    },
    kill: vi.fn(),
  };
  return tl;
}

vi.mock("gsap", () => {
  const gsap = {
    registerPlugin: vi.fn(),
    set: gsapSetSpy,
    to: gsapToSpy,
    timeline: (opts: any) => {
      if (opts?.scrollTrigger) {
        scrollTriggerCreate(opts.scrollTrigger);
      }
      return makeTimeline();
    },
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
      return { kill: vi.fn() };
    },
    getAll: () => [],
    refresh: vi.fn(),
  },
}));

function Harness() {
  return (
    <section id="case-study-nextup">
      <div data-case-pin>
        <video data-case-video />
        <div data-case-act="1" />
        <div data-case-act="2">
          <div data-case-beat="" data-beat-index={0} />
          <div data-case-beat="" data-beat-index={1} />
          <div data-case-beat="" data-beat-index={2} />
        </div>
        <div data-case-act="3" />
      </div>
    </section>
  );
}

describe("<FeaturedCaseClient /> — desktop, motion OK", () => {
  beforeEach(() => {
    scrollTriggerCreate.mockReset();
    gsapContextRevert.mockReset();
    gsapSetSpy.mockReset();
    gsapToSpy.mockReset();
    timelineFromToSpy.mockReset();
    timelineAddLabelSpy.mockReset();

    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: query.includes("min-width"),
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

  it("creates exactly one ScrollTrigger with pin + scrub on the pin element", async () => {
    const { FeaturedCaseClient } = await import("./FeaturedCaseClient");
    render(
      <>
        <Harness />
        <FeaturedCaseClient />
      </>,
    );
    expect(scrollTriggerCreate).toHaveBeenCalledTimes(1);
    const [opts] = scrollTriggerCreate.mock.calls[0];
    expect(opts.pin).toBe(true);
    expect(opts.scrub).toBe(0.5);
    expect(opts.end).toBe("+=500%");
  });

  it("sets Act 2 to position: absolute on mount so beats overlay", async () => {
    const { FeaturedCaseClient } = await import("./FeaturedCaseClient");
    render(
      <>
        <Harness />
        <FeaturedCaseClient />
      </>,
    );
    const calls = gsapSetSpy.mock.calls;
    const setsAct2Absolute = calls.some(([target, vars]) => {
      const el = Array.isArray(target) ? target[0] : target;
      return (
        (el as HTMLElement)?.dataset?.caseAct === "2" &&
        (vars as any).position === "absolute"
      );
    });
    expect(setsAct2Absolute).toBe(true);
  });

  it("adds timeline labels for each beat", async () => {
    const { FeaturedCaseClient } = await import("./FeaturedCaseClient");
    render(
      <>
        <Harness />
        <FeaturedCaseClient />
      </>,
    );
    const labels = timelineAddLabelSpy.mock.calls.map((c) => c[0]);
    expect(labels).toContain("beat-01");
    expect(labels).toContain("beat-02");
    expect(labels).toContain("beat-03");
  });

  it("reverts gsap context on unmount", async () => {
    const { FeaturedCaseClient } = await import("./FeaturedCaseClient");
    const { unmount } = render(
      <>
        <Harness />
        <FeaturedCaseClient />
      </>,
    );
    unmount();
    expect(gsapContextRevert).toHaveBeenCalled();
  });
});

describe("<FeaturedCaseClient /> — reduced motion", () => {
  beforeEach(() => {
    scrollTriggerCreate.mockReset();
    gsapContextRevert.mockReset();
    gsapSetSpy.mockReset();

    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: query.includes("reduced"),
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

  it("does not create a ScrollTrigger when reduced-motion is requested", async () => {
    const { FeaturedCaseClient } = await import("./FeaturedCaseClient");
    render(
      <>
        <Harness />
        <FeaturedCaseClient />
      </>,
    );
    expect(scrollTriggerCreate).not.toHaveBeenCalled();
  });
});

describe("<FeaturedCaseClient /> — mobile", () => {
  beforeEach(() => {
    scrollTriggerCreate.mockReset();

    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: false,
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

  it("does not create a ScrollTrigger on mobile viewports", async () => {
    const { FeaturedCaseClient } = await import("./FeaturedCaseClient");
    render(
      <>
        <Harness />
        <FeaturedCaseClient />
      </>,
    );
    expect(scrollTriggerCreate).not.toHaveBeenCalled();
  });
});
