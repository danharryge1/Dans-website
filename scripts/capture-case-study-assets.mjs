// scripts/capture-case-study-assets.mjs
import { chromium } from "playwright";
import { mkdir, unlink } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { join, dirname, resolve } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const sharp = require(resolve(__dirname, "../node_modules/sharp"));

const OUT = "public/assets/case-study/nextup";
const TMP = "tmp/case-study-capture";
await mkdir(OUT, { recursive: true });
await mkdir(TMP, { recursive: true });

const browser = await chromium.launch({ headless: false });

async function captureStill() {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  await page.goto("https://nextupco.com", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1500);
  const pngPath = join(OUT, "beat-01-hero-crop.png");
  await page.screenshot({
    path: pngPath,
    clip: { x: 360, y: 180, width: 720, height: 540 },
    type: "png",
  });
  // Convert PNG to real webp using sharp (ffmpeg 8.x dropped native webp encoder)
  await sharp(pngPath)
    .webp({ quality: 75 })
    .toFile(join(OUT, "beat-01-hero-crop.webp"));
  await unlink(pngPath).catch(() => {});
  await page.close();
}

async function captureClip({ name, durationMs, scrollScript }) {
  const context = await browser.newContext({
    viewport: { width: 720, height: 540 },
    deviceScaleFactor: 1,
    recordVideo: { dir: TMP, size: { width: 720, height: 540 } },
  });
  const page = await context.newPage();
  await page.goto("https://nextupco.com", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(500);

  await scrollScript(page);
  await page.waitForTimeout(durationMs);
  const videoHandle = page.video();
  await context.close();

  if (!videoHandle) throw new Error("No video handle for " + name);
  const rawPath = await videoHandle.path();

  const mp4 = join(OUT, `${name}.mp4`);
  const webm = join(OUT, `${name}.webm`);
  const poster = join(OUT, `${name}-poster.webp`);
  const posterPng = join(TMP, `${name}-poster.png`);

  execFileSync("ffmpeg", [
    "-y", "-i", rawPath,
    "-c:v", "libx264", "-crf", "28", "-preset", "slow",
    "-an", "-movflags", "+faststart",
    mp4,
  ]);
  execFileSync("ffmpeg", [
    "-y", "-i", rawPath,
    "-c:v", "libvpx-vp9", "-crf", "34", "-b:v", "0",
    "-an",
    webm,
  ]);
  // Extract poster as PNG then convert to webp via sharp (ffmpeg 8.x has no webp encoder)
  execFileSync("ffmpeg", [
    "-y", "-ss", "1.5", "-i", rawPath,
    "-frames:v", "1",
    posterPng,
  ]);
  await sharp(posterPng)
    .webp({ quality: 75 })
    .toFile(poster);
  await unlink(posterPng).catch(() => {});

  await unlink(rawPath).catch(() => {});
}

await captureStill();

await captureClip({
  name: "beat-02-scroll",
  durationMs: 5200,
  scrollScript: async (page) => {
    await page.evaluate(() => {
      let y = 0;
      const step = () => {
        y += 5;
        window.scrollTo(0, y);
        if (y < 900) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  },
});

await captureClip({
  name: "beat-03-magnetic",
  durationMs: 3200,
  scrollScript: async (page) => {
    const btn = await page.locator("a,button").filter({ hasText: /get|start|contact|book/i }).first();
    if (await btn.count() > 0) {
      const box = await btn.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2 + 30, box.y + box.height / 2);
        await page.waitForTimeout(300);
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 30 });
        await page.waitForTimeout(500);
        await page.mouse.move(box.x + box.width / 2 - 30, box.y + box.height / 2 + 20, { steps: 30 });
        await page.waitForTimeout(500);
      }
    }
  },
});

await browser.close();
console.log("Assets captured to", OUT);
