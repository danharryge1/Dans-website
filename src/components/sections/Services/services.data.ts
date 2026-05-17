export type ServiceEntry = {
  readonly id: "website-build" | "seo-maintenance" | "ai-addons";
  readonly title: string;
  readonly body: string;
  readonly deliverables: readonly string[];
};

export const SERVICES = [
  {
    id: "website-build",
    title: "WEBSITE BUILD",
    body: "Handcrafted, not templated. Live on your domain in 5 days.",
    deliverables: [
      "Built from scratch, not a theme",
      "Mobile-first, fast on every connection",
      "Optimised to show up on Google",
      "One point of contact throughout",
      "Live in 5 days. From £299.",
    ],
  },
  {
    id: "seo-maintenance",
    title: "SEO & MAINTENANCE",
    body: "Keep the site earning. Hosting, updates, and search performance included.",
    deliverables: [
      "Vercel hosting and domain management",
      "Monthly content updates",
      "Performance and uptime monitoring",
      "Basic SEO monitoring",
      "Email support within 24 hours",
    ],
  },
  {
    id: "ai-addons",
    title: "ADD-ONS",
    body: "More services stack on top once the site is earning.",
    deliverables: [
      "AI chatbot for your website",
      "Monthly blog posts",
      "Review generation system",
      "Missed call text-back",
      "Appointment booking automation",
    ],
  },
] as const satisfies readonly ServiceEntry[];
