export type Belief = {
  readonly id: string;
  readonly headline: string;
  readonly body: string;
  readonly scale?: "lg" | "xl";
};

export const beliefs = [
  {
    id: "proof-not-ceiling",
    headline: "If I can do this for myself, imagine what I'd do for you.",
    body: "NextUp, the case study above, is my own company. I built the site, the brand, the product. It's proof of capability, not the ceiling of it.",
    scale: "xl",
  },
  {
    id: "one-person-every-decision",
    headline: "One person. Every decision.",
    body: "I don't outsource the taste. Typography, motion, copy, the 200ms on a button press. Those are mine. The standard is \"would I ship this on my own site?\" That standard doesn't loosen when the logo on the brief changes.",
    scale: "lg",
  },
  {
    id: "fast-enough",
    headline: "Fast enough that you don't notice.",
    body: "Most sites feel slow the second you scroll. Mine don't. Speed isn't a perk. It's the line between \"premium\" and \"pretending.\"",
    scale: "lg",
  },
] as const satisfies readonly Belief[];
