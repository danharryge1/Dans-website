export type ServiceEntry = {
  readonly id: "ui-ux" | "custom-dev" | "brand";
  readonly title: string;
  readonly body: string;
  readonly deliverables: readonly string[];
};

export const SERVICES = [
  {
    id: "ui-ux",
    title: "UI / UX DESIGN",
    body: "Design that behaves. Every click predictable, every edge considered.",
    deliverables: [
      "Wireframes and interactive prototypes",
      "Full component design system",
      "Responsive across every breakpoint",
      "Interaction and animation specs",
      "Accessibility audit built in",
    ],
  },
  {
    id: "custom-dev",
    title: "CUSTOM DEVELOPMENT",
    body: "Purpose-built. Not a theme you customised until it almost fit.",
    deliverables: [
      "Next.js or chosen stack build",
      "CMS integration if needed",
      "Performance optimised from day one",
      "Full TypeScript codebase",
      "Deployed and configured on Vercel",
    ],
  },
  {
    id: "brand",
    title: "BRAND STRATEGY",
    body: "A voice that's yours. Visuals that prove it.",
    deliverables: [
      "Brand positioning and messaging",
      "Logo and visual identity",
      "Colour and typography system",
      "Brand guidelines document",
      "Applied to all key touchpoints",
    ],
  },
] as const satisfies readonly ServiceEntry[];
