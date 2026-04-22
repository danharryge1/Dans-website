"use client";

import { useEffect } from "react";

export function PageInit() {
  useEffect(() => {
    document.documentElement.classList.add("intro-ready");
    document.getElementById("intro-paint-block")?.remove();
  }, []);
  return null;
}
