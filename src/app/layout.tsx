import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { SeamRevealClient } from "@/components/layout/SeamRevealClient";
import { BackgroundCanvas } from "@/components/layout/BackgroundCanvas";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://dangeorge.studio"),
  title: {
    default: "Dan George — Premium Web Studio",
    template: "%s | Dan George",
  },
  description:
    "Premium freelance web studio. Custom design, development, and brand strategy — every pixel considered, every interaction earned.",
  keywords: ["web design", "web development", "freelance", "Next.js", "brand strategy", "UI UX", "premium studio"],
  authors: [{ name: "Dan George", url: "https://dangeorge.studio" }],
  creator: "Dan George",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://dangeorge.studio",
    siteName: "Dan George Studio",
    title: "Dan George — Premium Web Studio",
    description:
      "Custom design, development, and brand strategy. Built to stand out.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dan George — Premium Web Studio",
    description: "Custom design, development, and brand strategy. Built to stand out.",
    creator: "@dangeorge",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/Comico-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/PermanentMarker-Regular.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        {/* Hero background video — preload so mobile has it buffered before
            the intro overlay dismisses. Mobile browsers ignore preload="auto"
            on the video element itself; this hint fires at the HTML level. */}
        <link rel="preload" href="/assets/hero/hero-bg.mp4" as="video" type="video/mp4" />
        {/* Paint block: covers the page from the very first byte until the
            intro is dismissed. Styled here (not in globals.css) so it survives
            Tailwind's compiler without modification. */}
        <style dangerouslySetInnerHTML={{ __html: `
          #intro-paint-block{position:fixed;inset:0;background:#070d0b;z-index:9998;pointer-events:none;}
          html.intro-ready #intro-paint-block{display:none;}
        ` }} />
        {/* Runs synchronously before first paint. For returning visitors
            (intro-seen in sessionStorage), adds intro-ready immediately so the
            paint block div is hidden before any paint. */}
        {/* intro-visited persists through refreshes (sessionStorage).
            If set, show quick-enter screen instead of full typewriter.
            intro-ready is never added here — intro always shows on load. */}
        <script dangerouslySetInnerHTML={{ __html: `try{history.scrollRestoration='manual';if(sessionStorage.getItem('intro-visited'))sessionStorage.setItem('intro-quick','1');}catch(e){}` }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": "https://dangeorge.studio/#person",
                  "name": "Dan George",
                  "url": "https://dangeorge.studio",
                  "jobTitle": "Web Designer & Developer",
                  "description": "Freelance web designer and developer. Custom design, development, and brand strategy — every pixel considered.",
                  "email": "danharryge1@gmail.com",
                  "sameAs": ["https://github.com/danharryge1"],
                },
                {
                  "@type": "ProfessionalService",
                  "@id": "https://dangeorge.studio/#business",
                  "name": "Dan George Studio",
                  "url": "https://dangeorge.studio",
                  "description": "Premium freelance web studio. Custom design, development, and brand strategy.",
                  "founder": { "@id": "https://dangeorge.studio/#person" },
                  "serviceType": ["Web Design", "Web Development", "Brand Strategy"],
                  "areaServed": "GB",
                  "priceRange": "££££",
                },
                {
                  "@type": "WebSite",
                  "@id": "https://dangeorge.studio/#website",
                  "url": "https://dangeorge.studio",
                  "name": "Dan George Studio",
                  "publisher": { "@id": "https://dangeorge.studio/#person" },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {/* SSR'd paint blocker — visible from first byte, hidden once intro-ready. */}
        <div id="intro-paint-block" aria-hidden="true" />
        <ScrollProgress />
        <BackgroundCanvas />
        <Nav />
        <SeamRevealClient />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
