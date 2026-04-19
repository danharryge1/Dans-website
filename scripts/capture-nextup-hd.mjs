#!/usr/bin/env node
// Recaptures nextup-live at 1920×1200, encodes two variants:
//   nextup-live.mp4 / .webm / -poster.webp       → 1120×700 (hero laptop)
//   nextup-live-hd.mp4 / .webm / -hd-poster.webp → 1920×1200 (case study Act 1 backdrop)
// Usage: node scripts/capture-nextup-hd.mjs
import { chromium } from "playwright";
import { mkdir, unlink } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { readdir, stat } from "node:fs/promises";
import { dirname, resolve, join } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const sharp = require(resolve(__dirname, "../node_modules/sharp"));

const OUT = "public/assets/hero";
const TMP = "tmp/nextup-hd-capture";
await mkdir(OUT, { recursive: true });
await mkdir(TMP, { recursive: true });

const W = 1920;
const H = 1200;
const RECORD_MS = 6000;

console.log(`[capture] launching chromium at ${W}x${H}…`);
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: W, height: H },
  deviceScaleFactor: 1,
  recordVideo: { dir: TMP, size: { width: W, height: H } },
});
const page = await ctx.newPage();
await page.goto("https://nextupco.com", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(1200);
await page.waitForTimeout(RECORD_MS);
await page.close();
await ctx.close();
await browser.close();

const files = (await readdir(TMP))
  .filter((f) => f.endsWith(".webm"))
  .map(async (f) => ({ f, t: (await stat(join(TMP, f))).mtimeMs }));
const resolved = (await Promise.all(files)).sort((a, b) => b.t - a.t);
if (resolved.length === 0) {
  console.error("No webm produced.");
  process.exit(1);
}
const rawPath = join(TMP, resolved[0].f);
console.log(`[capture] raw: ${rawPath}`);

async function encode({ name, width, height, mp4Crf, webmCrf }) {
  const mp4 = join(OUT, `${name}.mp4`);
  const webm = join(OUT, `${name}.webm`);
  const posterPng = join(TMP, `${name}-poster.png`);
  const posterWebp = join(OUT, `${name}-poster.webp`);

  console.log(`[encode] ${name}.mp4`);
  execFileSync("ffmpeg", [
    "-y", "-i", rawPath,
    "-vf", `scale=${width}:${height}:flags=lanczos`,
    "-c:v", "libx264", "-crf", String(mp4Crf), "-preset", "slow",
    "-an", "-movflags", "+faststart", "-pix_fmt", "yuv420p",
    mp4,
  ]);
  console.log(`[encode] ${name}.webm`);
  execFileSync("ffmpeg", [
    "-y", "-i", rawPath,
    "-vf", `scale=${width}:${height}:flags=lanczos`,
    "-c:v", "libvpx-vp9", "-crf", String(webmCrf), "-b:v", "0",
    "-an",
    webm,
  ]);
  console.log(`[encode] ${name}-poster.webp`);
  execFileSync("ffmpeg", [
    "-y", "-ss", "1.5", "-i", rawPath,
    "-vf", `scale=${width}:${height}:flags=lanczos`,
    "-frames:v", "1",
    posterPng,
  ]);
  await sharp(posterPng).webp({ quality: 80 }).toFile(posterWebp);
  await unlink(posterPng).catch(() => {});
}

await encode({ name: "nextup-live", width: 1120, height: 700, mp4Crf: 26, webmCrf: 32 });
await encode({ name: "nextup-live-hd", width: 1920, height: 1200, mp4Crf: 24, webmCrf: 30 });

await unlink(rawPath).catch(() => {});
console.log("[done] encoded both variants into", OUT);
