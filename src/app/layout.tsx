import type { Metadata } from "next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { SeamRevealClient } from "@/components/layout/SeamRevealClient";
import { BackgroundCanvas } from "@/components/layout/BackgroundCanvas";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import "./globals.css";

export const metadata: Metadata = {
  title: "DanGeorge.studio",
  description: "Premium freelance web development — every pixel considered.",
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
        <script dangerouslySetInnerHTML={{ __html: `try{if(sessionStorage.getItem('intro-visited'))sessionStorage.setItem('intro-quick','1');}catch(e){}` }} />
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
      </body>
    </html>
  );
}
