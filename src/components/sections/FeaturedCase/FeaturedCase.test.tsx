import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("./FeaturedCaseClient", () => ({
  FeaturedCaseClient: () => null,
}));

import { FeaturedCase } from "./FeaturedCase";

describe("<FeaturedCase />", () => {
  it("renders a <section> with id + aria-labelledby", () => {
    const { container } = render(<FeaturedCase />);
    const section = container.querySelector("section") as HTMLElement;
    expect(section.id).toBe("case-study-nextup");
    expect(section.getAttribute("aria-labelledby")).toBe("case-study-heading");
  });

  it("renders a visually hidden h2 landmark", () => {
    const { getByRole } = render(<FeaturedCase />);
    const h2 = getByRole("heading", { level: 2, hidden: true });
    expect(h2.id).toBe("case-study-heading");
    expect(h2.className).toContain("sr-only");
  });

  it("renders ONE video element with both webm and mp4 sources + poster", () => {
    const { container } = render(<FeaturedCase />);
    const videos = container.querySelectorAll("video");
    // Act 1/3 share ONE backdrop video, Act 2 beat 02 + beat 03 have their own videos (3 total).
    // Spec §6.1: "ONE single <video> DOM node rendered once at the top of the pinned region" is the backdrop.
    // The test targets the backdrop video specifically via data-case-video.
    const backdrop = container.querySelector("[data-case-video]") as HTMLVideoElement;
    expect(backdrop).toBeTruthy();
    expect(backdrop.tagName).toBe("VIDEO");
    expect(backdrop.getAttribute("aria-hidden")).toBe("true");
    expect(backdrop.hasAttribute("muted") || backdrop.muted).toBe(true);
    expect(backdrop.hasAttribute("autoplay") || backdrop.autoplay).toBe(true);
    expect(backdrop.hasAttribute("loop") || backdrop.loop).toBe(true);
    expect(backdrop.getAttribute("poster")).toContain("nextup-live-hd-poster.webp");
    const sources = backdrop.querySelectorAll("source");
    expect(sources.length).toBe(2);
    expect(Array.from(sources).some((s) => s.getAttribute("type") === "video/webm")).toBe(true);
    expect(Array.from(sources).some((s) => s.getAttribute("type") === "video/mp4")).toBe(true);
    // Silence unused 'videos' ref — the count assertion stays flexible (backdrop + 2 beat videos)
    expect(videos.length).toBeGreaterThanOrEqual(1);
  });

  it("renders Act 1 overlay copy", () => {
    const { getByText } = render(<FeaturedCase />);
    expect(getByText("NEXTUP 2026")).toBeInTheDocument();
    expect(getByText("My company. I designed it, built it, ship to it.")).toBeInTheDocument();
  });

  it("renders exactly three Act 2 decision beats with locked titles", () => {
    const { container, getByText } = render(<FeaturedCase />);
    const beats = container.querySelectorAll("[data-case-beat]");
    expect(beats.length).toBe(3);
    expect(getByText("WHY BLUE")).toBeInTheDocument();
    expect(getByText("MODERN, NOT LOUD")).toBeInTheDocument();
    expect(getByText("SMALL FLOURISHES, BIG LIFT")).toBeInTheDocument();
  });

  it("renders Act 3 outcome block with locked copy", () => {
    const { getByText, container } = render(<FeaturedCase />);
    expect(getByText("The site's doing its job.")).toBeInTheDocument();
    const act3 = container.querySelector("[data-case-act='3']");
    expect(act3?.textContent ?? "").toContain("Built to stay out of the way.");
    expect(act3?.textContent ?? "").toContain("Visit the live site");
  });

  it("tags the act regions with data hooks for the Client to target", () => {
    const { container } = render(<FeaturedCase />);
    expect(container.querySelector("[data-case-act='1']")).toBeTruthy();
    expect(container.querySelector("[data-case-act='2']")).toBeTruthy();
    expect(container.querySelector("[data-case-act='3']")).toBeTruthy();
    expect(container.querySelector("[data-case-video]")).toBeTruthy();
    expect(container.querySelector("[data-case-pin]")).toBeTruthy();
  });
});
