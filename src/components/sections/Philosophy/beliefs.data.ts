export type BeliefMedia =
  | {
      readonly kind: "image";
      readonly src: string;
      readonly alt: string;
    }
  | {
      readonly kind: "proof";
      readonly figure: string;
      readonly unit?: string;
      readonly caption: string;
    };

export type Belief = {
  readonly id: string;
  readonly headline: string;
  readonly body: string;
  readonly scale?: "lg" | "xl";
  readonly media?: BeliefMedia;
};

export const beliefs = [
  {
    id: "proof-not-ceiling",
    headline: "If I can do this for myself, imagine what I'd do for you.",
    body: "NextUp, the case study above, is my own company. I built the site, the brand, the product. It's proof of capability, not the ceiling of it.",
    scale: "xl",
    media: {
      kind: "image",
      src: "/assets/hero/nextup-live-poster.webp",
      alt: "NextUp live homepage.",
    },
  },
  {
    id: "one-person-every-decision",
    headline: "One person. Every decision.",
    body: "I don't outsource the taste. Typography, motion, copy, the 200ms on a button press. Those are mine. The standard is \"would I ship this on my own site?\" That standard doesn't loosen when the logo on the brief changes.",
    scale: "lg",
    media: {
      kind: "proof",
      figure: "1",
      caption: "solo operator. every decision mine.",
    },
  },
  {
    id: "fast-enough",
    headline: "Fast enough that you don't notice.",
    body: "Most sites feel slow the second you scroll. Mine don't. Speed isn't a perk. It's the line between \"premium\" and \"pretending.\"",
    scale: "lg",
    media: {
      kind: "proof",
      figure: "60",
      unit: "fps",
      caption: "floor, not ceiling.",
    },
  },
] as const satisfies readonly Belief[];
