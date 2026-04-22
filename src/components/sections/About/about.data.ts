export type AboutFact = {
  readonly id: string;
  readonly label: string;
  readonly caption: string;
};

export const about = {
  eyebrow: "WHO I AM",
  name: "DAN GEORGE",
  subtitle: "20. Wakefield. Liverpool.",
  paragraphs: [
    "I am a second year Applied Entrepreneurship student at Liverpool John Moores University. Before I started building sites for clients I was building them for myself. Events companies, ventures, ideas that needed a home on the internet. Building websites was never something I set out to do. It was the part I kept coming back to.",
    "The obsession got serious with NextUp, my student events company. I got so deep into the site I almost forgot I was supposed to be running the business. When I found myself caring that much about getting every detail exactly right, I knew this was the thing. Obsessive attention to detail is my biggest strength and my most time consuming flaw. I am fine with both.",
  ],
  facts: [
    { id: "age", label: "AGE 20", caption: "from Wakefield" },
    { id: "study", label: "LJMU", caption: "BSc Applied Entrepreneurship" },
    { id: "origin", label: "NEXTUP", caption: "the project that started it all" },
  ] satisfies readonly AboutFact[],
  closing: "THE SITE IS THE PITCH.",
  cta: { label: "START A PROJECT", href: "/#contact" },
} as const;
