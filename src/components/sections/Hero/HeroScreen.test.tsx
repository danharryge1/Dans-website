import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroScreen } from "./HeroScreen";

const DEFAULT_PROPS = {
  draftSrc: "/assets/hero/nextup-old.webp",
  draftAlt: "NextUp Co. homepage, pre-redesign",
  videoMp4: "/assets/hero/nextup-live.mp4",
  videoWebm: "/assets/hero/nextup-live.webm",
  videoPoster: "/assets/hero/nextup-live-poster.webp",
};

describe("<HeroScreen />", () => {
  it("renders the draft image with correct src and alt", () => {
    render(<HeroScreen {...DEFAULT_PROPS} />);
    const img = screen.getByAltText(DEFAULT_PROPS.draftAlt) as HTMLImageElement;
    expect(img.src).toContain("nextup-old.webp");
  });

  it("renders a <video> with webm + mp4 sources in that order (webm first for VP9 savings)", () => {
    const { container } = render(<HeroScreen {...DEFAULT_PROPS} />);
    const video = container.querySelector("video") as HTMLVideoElement;
    expect(video).not.toBeNull();
    expect(video.getAttribute("poster")).toContain("nextup-live-poster.webp");
    expect(video.getAttribute("aria-hidden")).toBe("true");
    expect(video.hasAttribute("autoplay")).toBe(true);
    expect(video.muted).toBe(true);
    expect(video.hasAttribute("loop")).toBe(true);
    expect(video.hasAttribute("playsinline")).toBe(true);
    const sources = video.querySelectorAll("source");
    expect(sources[0].getAttribute("type")).toBe("video/webm");
    expect(sources[1].getAttribute("type")).toBe("video/mp4");
  });

  it("renders Draft and Reality side labels with the data attribute", () => {
    const { container } = render(<HeroScreen {...DEFAULT_PROPS} />);
    const labels = container.querySelectorAll("[data-hero-side-label]");
    expect(labels.length).toBe(2);
    const texts = Array.from(labels).map((l) => l.textContent);
    expect(texts).toContain("Draft");
    expect(texts).toContain("Reality");
  });

  it("renders a seam element at CSS var --seam-x", () => {
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

  it("provides a screen-reader sentence describing the transformation", () => {
    render(<HeroScreen {...DEFAULT_PROPS} />);
    expect(
      screen.getByText(/draft.*reality/i, { selector: ".sr-only" }),
    ).toBeInTheDocument();
  });
});
