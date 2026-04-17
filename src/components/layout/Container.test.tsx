import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Container } from "./Container";

describe("<Container />", () => {
  it("renders children", () => {
    render(<Container>hello</Container>);
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("applies max-width and gutter classes to the wrapper", () => {
    const { container } = render(<Container>x</Container>);
    const wrapper = container.firstElementChild!;
    expect(wrapper.className).toContain("max-w-[1400px]");
    expect(wrapper.className).toContain("mx-auto");
    expect(wrapper.className).toContain("px-6");
    expect(wrapper.className).toContain("md:px-10");
    expect(wrapper.className).toContain("lg:px-12");
  });

  it("passes through a custom className", () => {
    const { container } = render(<Container className="py-10">x</Container>);
    expect(container.firstElementChild!.className).toContain("py-10");
  });
});
