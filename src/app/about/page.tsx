import type { Metadata } from "next";
import { About } from "@/components/sections/About";
import { PageInit } from "@/components/layout/PageInit";

export const metadata: Metadata = {
  title: "About — DanGeorge.studio",
  description:
    "One person. Every decision. Dan George builds premium websites from scratch — no templates, no juniors, no shortcuts.",
};

export default function AboutPage() {
  return (
    <>
      <PageInit />
      <About />
    </>
  );
}
