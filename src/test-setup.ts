import "@testing-library/jest-dom/vitest";

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
