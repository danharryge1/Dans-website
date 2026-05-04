import type { Metadata } from "next";
import { About } from "@/components/sections/About";
import { PageInit } from "@/components/layout/PageInit";

export const metadata: Metadata = {
  title: "About",
  description:
    "One person. Every decision. Dan George builds premium websites from scratch — no templates, no juniors, no shortcuts.",
  openGraph: {
    title: "About Dan George",
    description: "One person. Every decision. Premium websites built from scratch — no templates, no juniors, no shortcuts.",
    url: "https://dangeorge.studio/about",
  },
  twitter: {
    title: "About Dan George",
    description: "One person. Every decision. Premium websites built from scratch — no templates, no juniors, no shortcuts.",
  },
};

export default function AboutPage() {
  return (
    <>
      <PageInit />
      <About />
    </>
  );
}
