export type ProjectEntry = {
  readonly id: string;
  readonly title: string;
  readonly year: number;
  readonly descriptor: string;
  readonly thumbnailSrc: string;
  readonly thumbnailAlt: string;
  readonly featured: boolean;
};

export const PROJECTS = [
  {
    id: "nextup",
    title: "NEXTUP",
    year: 2026,
    descriptor: "Built on trust, for a modern service company.",
    thumbnailSrc: "/assets/hero/nextup-live-poster.webp",
    thumbnailAlt: "NextUp, live homepage",
    featured: true,
  },
] as const satisfies readonly ProjectEntry[];
