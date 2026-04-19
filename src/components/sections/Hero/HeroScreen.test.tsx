import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroScreen } from "./HeroScreen";

const DEFAULT_PROPS = {
  leftVideoMp4: "/assets/hero/intro-bg.mp4",
  leftVideoPoster: "/assets/hero/intro-bg-poster.jpg",
  leftLabel: "Before",
  rightVideoMp4: "/assets/hero/nextup-v2.mp4",
  rightVideoPoster: "/assets/hero/nextup-v2-poster.jpg",
  rightLabel: "After",
};

describe("<HeroScreen />", () => {
  it("renders two <video> elements (left and right)", () => {
    const { container } = render(<HeroScreen {...DEFAULT_PROPS} />);
    const videos = container.querySelectorAll("video");
    expect(videos.length).toBe(2);
  });

  it("left video has correct poster and mp4 source", () => {
    const { container } = render(<HeroScreen {...DEFAULT_PROPS} />);
    const leftVideo = container.querySelector("[data-hero-draft] video") as HTMLVideoElement;
    expect(leftVideo).not.toBeNull();
    expect(leftVideo.getAttribute("poster")).toContain("intro-bg-poster.jpg");
    const source = leftVideo.querySelector("source");
    expect(source?.getAttribute("src")).toContain("intro-bg.mp4");
    expect(source?.getAttribute("type")).toBe("video/mp4");
  });

  it("right video has correct poster, is autoplaying, muted, looping", () => {
    const { container } = render(<HeroScreen {...DEFAULT_PROPS} />);
    const rightVideo = container.querySelector("[data-hero-reality] video") as HTMLVideoElement;
    expect(rightVideo).not.toBeNull();
    expect(rightVideo.getAttribute("poster")).toContain("nextup-v2-poster.jpg");
    expect(rightVideo.getAttribute("aria-hidden")).toBe("true");
    expect(rightVideo.hasAttribute("autoplay")).toBe(true);
    expect(rightVideo.muted).toBe(true);
    expect(rightVideo.hasAttribute("loop")).toBe(true);
    expect(rightVideo.hasAttribute("playsinline")).toBe(true);
  });

  it("renders Before and After side labels with the data attribute", () => {
    const { container } = render(<HeroScreen {...DEFAULT_PROPS} />);
    const labels = container.querySelectorAll("[data-hero-side-label]");
    expect(labels.length).toBe(2);
    const texts = Array.from(labels).map((l) => l.textContent);
    expect(texts).toContain("Before");
    expect(texts).toContain("After");
  });

  it("renders a seam element referencing --seam-x", () => {
    const { container } = render(<HeroScreen {...DEFAULT_PROPS} />);
    const seam = container.querySelector("[data-hero-seam]") as HTMLElement;
    expect(seam).not.toBeNull();
    expect(seam.getAttribute("style") ?? "").toContain("--seam-x");
  });

  it("reality side is clipped via clip-path referencing --seam-x", () => {
    const { container } = render(<HeroScreen {...DEFAULT_PROPS} />);
    const reality = container.querySelector("[data-hero-reality]") as HTMLElement;
    expect(reality).not.toBeNull();
    expect(reality.getAttribute("style") ?? "").toContain("--seam-x");
    expect(reality.getAttribute("style") ?? "").toContain("clip-path");
  });

  it("provides a screen-reader sentence describing the comparison", () => {
    render(<HeroScreen {...DEFAULT_PROPS} />);
    expect(
      screen.getByText(/compare.*before.*after|before.*after.*redesign/i, { selector: ".sr-only" }),
    ).toBeInTheDocument();
  });
});
