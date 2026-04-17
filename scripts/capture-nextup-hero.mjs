#!/usr/bin/env node
// One-shot capture of nextupco.com's hero viewport to a webm.
// Usage: node scripts/capture-nextup-hero.mjs
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

const OUT_DIR = "public/assets/hero";
const WEBM_RAW = `${OUT_DIR}/_raw-nextup.webm`;

mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(dirname(WEBM_RAW), { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1120, height: 700 },
  deviceScaleFactor: 2,
  recordVideo: { dir: OUT_DIR, size: { width: 1120, height: 700 } },
});
const page = await ctx.newPage();
await page.goto("https://nextupco.com", { waitUntil: "networkidle" });
// Let the hero animations settle, then record ~6s of life.
await page.waitForTimeout(6000);
await page.close();
await ctx.close();
await browser.close();

// Playwright writes a randomly-named webm into OUT_DIR. Rename the newest file to _raw.
import { readdirSync, renameSync, statSync } from "node:fs";
const files = readdirSync(OUT_DIR)
  .filter((f) => f.endsWith(".webm") && !f.startsWith("_raw"))
  .map((f) => ({ f, t: statSync(`${OUT_DIR}/${f}`).mtimeMs }))
  .sort((a, b) => b.t - a.t);
if (files.length === 0) {
  console.error("No webm produced.");
  process.exit(1);
}
renameSync(`${OUT_DIR}/${files[0].f}`, WEBM_RAW);
console.log(`Raw capture: ${WEBM_RAW}`);
