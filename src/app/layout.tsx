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
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dan George Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dan George — Premium Web Studio",
    description: "Custom design, development, and brand strategy. Built to stand out.",
    images: ["/og-image.png"],
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
