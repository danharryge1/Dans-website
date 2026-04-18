export type Belief = {
  readonly id: string;
  readonly headline: string;
  readonly body: string;
  readonly scale?: "lg" | "xl";
};

export const beliefs = [
  {
    id: "proof-not-ceiling",
    headline: "If I can do this for myself, imagine what I\u2019d do for you.",
    body: "NextUp, the case study above, is my own company. I built the site, the brand, the product. It\u2019s proof of capability, not the ceiling of it.",
    scale: "xl",
  },
  {
    id: "one-person-every-decision",
    headline: "One person. Every decision.",
    body: "I don\u2019t outsource the taste. Typography, motion, copy, the 200ms on a button press. Those are mine. The standard is \u201cwould I ship this on my own site?\u201d That standard doesn\u2019t loosen when the logo on the brief changes.",
    scale: "lg",
  },
  {
    id: "fast-enough",
    headline: "Fast enough that you don\u2019t notice.",
    body: "Most sites feel slow the second you scroll. Mine don\u2019t. Speed isn\u2019t a perk. It\u2019s the line between \u201cpremium\u201d and \u201cpretending.\u201d",
    scale: "lg",
  },
] as const satisfies readonly Belief[];
