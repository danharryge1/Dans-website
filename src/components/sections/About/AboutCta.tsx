"use client";

import { MagneticButton } from "@/lib/motion/MagneticButton";

export function AboutCta({ label, href }: { label: string; href: string }) {
  return (
    <MagneticButton href={href} variant="outline">
      {label}
    </MagneticButton>
  );
}
