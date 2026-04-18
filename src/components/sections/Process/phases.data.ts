export type Phase = {
  readonly id: string;
  readonly number: "01" | "02" | "03";
  readonly title: string;
  readonly body: string;
};

export const phases = [
  {
    id: "brief",
    number: "01",
    title: "THE BRIEF",
    body: "You tell me what you want. I read between the lines. I come back with the shape of it: three directions, none of them safe.",
  },
  {
    id: "build",
    number: "02",
    title: "THE BUILD",
    body: "We pick a direction. Could be one, could be a mix. I make it real: typography, motion, copy, every pixel. The floor is this site. Yours goes higher.",
  },
  {
    id: "ship",
    number: "03",
    title: "THE SHIP",
    body: "You see it live before anyone else. When it's right, we push it to your domain.",
  },
] as const satisfies readonly Phase[];
