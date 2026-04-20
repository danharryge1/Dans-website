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
        {/* Runs synchronously before first paint — prevents the hero flashing
            through before the intro portal mounts. */}
        {/* If intro already seen this session, add .intro-ready immediately so
            body::before paint-block is not applied — site paints normally. */}
        <script dangerouslySetInnerHTML={{ __html: `try{if(sessionStorage.getItem('intro-seen'))document.documentElement.classList.add('intro-ready');}catch(e){}` }} />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
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
