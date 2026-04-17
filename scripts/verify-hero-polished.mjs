#!/usr/bin/env node
// Task 12 re-capture: 1920 viewport at 0/40/100% scroll AFTER the pin-and-scrub
// runway fix. Runs against whatever is serving localhost:3000 — dev or prod.
// Writes to docs/verification/2026-04-18-hero/ with a `-polished` suffix so
// originals remain intact for before/after comparison.

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const URL = 'http://localhost:3000';
const OUT_DIR = resolve(process.cwd(), 'docs/verification/2026-04-18-hero');

const VIEWPORT = { w: 1920, h: 1080 };
const SCROLLS = [0, 40, 100];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({
      viewport: { width: VIEWPORT.w, height: VIEWPORT.h },
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
      await sleep(800); // scrub + pin settle

      const out = resolve(OUT_DIR, `${VIEWPORT.w}-${scroll}-polished.png`);
      await page.screenshot({ path: out, fullPage: false });
      console.log(`  captured ${VIEWPORT.w}x${VIEWPORT.h} @ ${scroll}% -> ${out}`);
    }
    await context.close();
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
