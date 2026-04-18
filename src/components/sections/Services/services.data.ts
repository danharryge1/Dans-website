export type ServiceEntry = {
  readonly id: "ui-ux" | "custom-dev" | "brand";
  readonly title: string;
  readonly body: string;
};

export const SERVICES = [
  {
    id: "ui-ux",
    title: "UI / UX DESIGN",
    body: "Design that behaves. Every click predictable, every edge considered.",
  },
  {
    id: "custom-dev",
    title: "CUSTOM DEVELOPMENT",
    body: "Purpose-built. Not a theme you customised until it almost fit.",
  },
  {
    id: "brand",
    title: "BRAND STRATEGY",
    body: "A voice that's yours. Visuals that prove it.",
  },
] as const satisfies readonly ServiceEntry[];
