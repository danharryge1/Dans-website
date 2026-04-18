import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT_DIR = "docs/verification/2026-04-18-philosophy";
mkdirSync(OUT_DIR, { recursive: true });

const VIEWPORTS = [
  { name: "desktop", width: 1920, height: 1080, dpr: 2 },
  { name: "tablet", width: 768, height: 1024, dpr: 2 },
  { name: "mobile", width: 375, height: 812, dpr: 2 },
];

async function captureScrollPositions(page, viewport) {
  // Find the Philosophy section's top offset.
  const philosophyTop = await page.evaluate(() => {
    const el = document.getElementById("philosophy");
    return el ? el.getBoundingClientRect().top + window.scrollY : 0;
  });

  const positions = [
    { label: "01-pre-reveal", scrollY: philosophyTop - viewport.height * 0.5 },
    { label: "02-mid-reveal", scrollY: philosophyTop + viewport.height * 0.5 },
    { label: "03-post-reveal", scrollY: philosophyTop + viewport.height * 1.4 },
  ];

  for (const pos of positions) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.max(0, pos.scrollY));
    await page.waitForTimeout(900); // let ScrollTriggers fire + tweens settle
    const filename = `${viewport.name}-${pos.label}.png`;
    await page.screenshot({ path: join(OUT_DIR, filename), fullPage: false });
    console.log(`captured ${filename}`);
  }
}

async function run() {
  const browser = await chromium.launch({
    headless: true,
    args: ["--autoplay-policy=no-user-gesture-required"],
  });

  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: viewport.dpr,
    });
    const page = await context.newPage();
    await page.goto("http://localhost:3000", { waitUntil: "load" });
    await page.waitForTimeout(1500); // initial settle

    await captureScrollPositions(page, viewport);

    await context.close();
  }

  // Reduced-motion capture on desktop only.
  const rmContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
  });
  const rmPage = await rmContext.newPage();
  await rmPage.goto("http://localhost:3000", { waitUntil: "load" });
  await rmPage.waitForTimeout(1500);
  const philosophyTop = await rmPage.evaluate(() => {
    const el = document.getElementById("philosophy");
    return el ? el.getBoundingClientRect().top + window.scrollY : 0;
  });
  await rmPage.evaluate(
    (y) => window.scrollTo(0, y),
    Math.max(0, philosophyTop),
  );
  await rmPage.waitForTimeout(900);
  await rmPage.screenshot({
    path: join(OUT_DIR, "desktop-reduced-motion.png"),
    fullPage: false,
  });
  console.log("captured desktop-reduced-motion.png");

  await browser.close();
  console.log(`\nAll captures written to ${OUT_DIR}/`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
