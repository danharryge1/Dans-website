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
    body: "Interfaces that earn their keep. Every state deliberate, every pixel justified.",
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
    body: "Handcrafted, not templated. Built for your stack, not the next client's.",
    deliverables: [
      "Built from scratch, not a template",
      "Update your content without a developer",
      "Fast on every device and connection",
      "Clean code any developer can pick up",
      "Live on the web, ready to go",
    ],
  },
  {
    id: "brand",
    title: "BRAND STRATEGY",
    body: "An identity that owns the room. Consistent from logo to last touchpoint.",
    deliverables: [
      "Brand positioning and messaging",
      "Logo and visual identity",
      "Colour and typography system",
      "Brand guidelines document",
      "Applied to all key touchpoints",
    ],
  },
] as const satisfies readonly ServiceEntry[];
