"use client";

import dynamic from "next/dynamic";

const IntroOverlay = dynamic(
  () => import("./IntroOverlay").then((m) => m.IntroOverlay),
  { ssr: false },
);

export function IntroOverlayLoader() {
  return <IntroOverlay />;
}
