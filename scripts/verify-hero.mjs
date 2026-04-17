#!/usr/bin/env node
// Hero verification screenshots: 3 viewports × 3 scroll positions + 1 reduced-motion = 10 PNGs.
// Runs against `npm run dev` on http://localhost:3000. Writes to docs/verification/2026-04-18-hero/.

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const URL = 'http://localhost:3000';
const OUT_DIR = resolve(process.cwd(), 'docs/verification/2026-04-18-hero');

const VIEWPORTS = [
  { w: 1920, h: 1080 },
  { w: 768, h: 1024 },
  { w: 375, h: 812 },
];
const SCROLLS = [0, 40, 100];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  try {
    for (const { w, h } of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: w, height: h },
        deviceScaleFactor: 2,
      });
      const page = await context.newPage();
      await page.goto(URL, { waitUntil: 'networkidle' });
      await sleep(1200); // settle hero intro animations

      for (const scroll of SCROLLS) {
        await page.evaluate((pct) => {
          window.scrollTo({
            top: document.documentElement.scrollHeight * (pct / 100),
            behavior: 'instant',
          });
        }, scroll);
        await sleep(600); // scrub animation settle

        const out = resolve(OUT_DIR, `${w}-${scroll}.png`);
        await page.screenshot({ path: out, fullPage: false });
        console.log(`  captured ${w}x${h} @ ${scroll}% -> ${out}`);
      }
      await context.close();
    }

    // Reduced-motion pass at desktop
    const rmCtx = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 2,
      reducedMotion: 'reduce',
    });
    const rmPage = await rmCtx.newPage();
    await rmPage.goto(URL, { waitUntil: 'networkidle' });
    await sleep(2000);
    const rmOut = resolve(OUT_DIR, '1920-reduced-motion.png');
    await rmPage.screenshot({ path: rmOut, fullPage: false });
    console.log(`  captured reduced-motion -> ${rmOut}`);
    await rmCtx.close();
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
