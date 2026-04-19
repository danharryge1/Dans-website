#!/usr/bin/env node
// Captures three still frames from the nextupco.com hero for Beat 03 collage:
//   beat-03-rest.webp   — button at rest, clean pose
//   beat-03-glow.webp   — cursor on button, magnetic offset + glow
//   beat-03-bg.webp     — animated background blobs behind the button
// Usage: node scripts/capture-beat-03-tiles.mjs
import { chromium } from "playwright";
import { mkdir, unlink } from "node:fs/promises";
import { resolve, dirname, join } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const sharp = require(resolve(__dirname, "../node_modules/sharp"));

const OUT = "public/assets/case-study/nextup";
const TMP = "tmp/beat-03";
await mkdir(OUT, { recursive: true });
await mkdir(TMP, { recursive: true });

const W = 1440;
const H = 900;
const DSF = 2;

console.log(`[capture] launching chromium ${W}x${H} @${DSF}x…`);
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: W, height: H },
  deviceScaleFactor: DSF,
});
const page = await ctx.newPage();
await page.goto("https://nextupco.com", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(1500);

// Dismiss hover state before rest capture
await page.mouse.move(20, 20);
await page.waitForTimeout(500);

// Find the "Book a Free Call" primary button
const btn = await page.$('a.btn.btn-primary.btn-lg');
if (!btn) {
  console.error("Could not find primary CTA. Trying fallback…");
  await page.screenshot({ path: join(TMP, "debug-full.png"), fullPage: false });
  process.exit(1);
}
const box = await btn.boundingBox();
if (!box) {
  console.error("Could not measure button.");
  process.exit(1);
}
console.log(`[btn] box ${Math.round(box.x)},${Math.round(box.y)} ${Math.round(box.width)}x${Math.round(box.height)}`);

// Rest tile — tight crop around button, cursor off screen
const restClip = {
  x: Math.max(0, box.x - 90),
  y: Math.max(0, box.y - 65),
  width: Math.min(W, box.width + 180),
  height: Math.min(H, box.height + 130),
};
const restTmp = join(TMP, "rest.png");
await page.screenshot({ path: restTmp, clip: restClip });
console.log("[rest] captured");

// Glow tile — hover on button, allow magnetic motion to settle
await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.5, { steps: 20 });
await page.waitForTimeout(450);
const glowClip = { ...restClip };
const glowTmp = join(TMP, "glow.png");
await page.screenshot({ path: glowTmp, clip: glowClip });
console.log("[glow] captured");

// Animated background tile — move cursor through the hero blobs
await page.mouse.move(W * 0.35, H * 0.35, { steps: 15 });
await page.waitForTimeout(200);
await page.mouse.move(W * 0.6, H * 0.55, { steps: 15 });
await page.waitForTimeout(200);
// Slightly wider crop to show blob atmosphere
const bgClip = {
  x: Math.max(0, box.x - 230),
  y: Math.max(0, box.y - 320),
  width: Math.min(W, box.width + 460),
  height: Math.min(H, box.height + 280),
};
// Re-hover on button for the background-with-button moment
await page.mouse.move(box.x + box.width / 2 + 8, box.y + box.height / 2 + 4, { steps: 10 });
await page.waitForTimeout(300);
const bgTmp = join(TMP, "bg.png");
await page.screenshot({ path: bgTmp, clip: bgClip });
console.log("[bg] captured");

await ctx.close();
await browser.close();

// Encode each to webp at quality 82 (good premium quality, still compressed)
async function encode(srcPng, dstWebp, targetWidth) {
  await sharp(srcPng)
    .resize({ width: targetWidth, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(dstWebp);
  await unlink(srcPng).catch(() => {});
  console.log(`[encode] ${dstWebp}`);
}

await encode(restTmp, join(OUT, "beat-03-rest.webp"), 720);
await encode(glowTmp, join(OUT, "beat-03-glow.webp"), 720);
await encode(bgTmp, join(OUT, "beat-03-bg.webp"), 960);

console.log("[done] beat-03 tiles written to", OUT);
