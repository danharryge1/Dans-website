export type ProjectEntry = {
  id: string;
  title: string;
  year: number;
  descriptor: string;
  thumbnailSrc: string;
  thumbnailAlt: string;
  featured: boolean;
};

export const PROJECTS = [
  {
    id: "nextup",
    title: "NEXTUP",
    year: 2026,
    descriptor: "Trust-first website for a modern service company.",
    thumbnailSrc: "/assets/hero/nextup-live-poster.webp",
    thumbnailAlt: "NextUp — live homepage",
    featured: true,
  },
] as const satisfies readonly ProjectEntry[];
