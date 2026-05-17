export type Phase = {
  readonly id: string;
  readonly number: "01" | "02" | "03";
  readonly title: string;
  readonly body: string;
  readonly note?: string;
};

export const phases = [
  {
    id: "brief",
    number: "01",
    title: "THE BRIEF",
    body: "You tell me what you want. I come back with a clear direction and a fixed price. No open-ended exploration.",
  },
  {
    id: "build",
    number: "02",
    title: "THE BUILD",
    body: "Design, build, and copy. Every pixel deliberate. The floor is this site. Yours is live inside 5 days.",
    note: "most sites are live within 5 days",
  },
  {
    id: "ship",
    number: "03",
    title: "THE SHIP",
    body: "You see it live before anyone else. When it's right, we push it to your domain.",
    note: "you don't pay the full amount unless you're happy",
  },
] as const satisfies readonly Phase[];
