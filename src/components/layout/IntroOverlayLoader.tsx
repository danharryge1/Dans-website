"use client";

import { useEffect, useState } from "react";
import { IntroOverlay } from "./IntroOverlay";

// Renders nothing on the server and during hydration (mounted = false).
// After hydration, mounts IntroOverlay client-side — no SSR HTML to
// reconcile against, so no insertBefore crash from next/dynamic.
export function IntroOverlayLoader() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return <IntroOverlay />;
}
