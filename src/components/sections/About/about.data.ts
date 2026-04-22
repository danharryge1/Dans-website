export type AboutFact = {
  readonly id: string;
  readonly label: string;
  readonly caption: string;
};

export const about = {
  eyebrow: "WHO I AM",
  name: "DAN GEORGE",
  subtitle: "One person. Every decision.",
  paragraphs: [
    "I started building websites because I thought most of them were terrible. I still do. The difference is now I fix it. Design, code, copy, the 200ms on a button press. All of it. One person.",
    "When you commission a project you get me from the first call to the final deploy. Not a brief passed to a junior. Not a template tweaked to fit. Something built from scratch to be exactly what you need and nothing you don't.",
  ],
  facts: [
    { id: "since", label: "SINCE 2019", caption: "building on the web" },
    { id: "scope", label: "END TO END", caption: "design through deployment" },
    { id: "solo", label: "ONE PERSON", caption: "every decision mine" },
  ] satisfies readonly AboutFact[],
  closing: "THE SITE IS THE PITCH.",
  cta: { label: "START A PROJECT", href: "/#contact" },
} as const;
