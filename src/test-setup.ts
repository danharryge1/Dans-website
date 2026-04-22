import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement IntersectionObserver; provide a minimal stub so
// components that use it (e.g. FluidCanvas) don't throw.
if (typeof globalThis.IntersectionObserver === "undefined") {
  globalThis.IntersectionObserver = class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
    readonly root = null;
    readonly rootMargin = "";
    readonly thresholds = [];
  };
}

// jsdom doesn't implement ResizeObserver; provide a minimal stub so
// components that use it don't throw.
if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// jsdom doesn't implement window.matchMedia; provide a minimal stub so
// GSAP / ScrollTrigger and any component that reads media queries don't throw.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
});
