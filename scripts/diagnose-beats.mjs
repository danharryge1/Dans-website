#!/usr/bin/env node
// Render localhost homepage, scroll to pinned case study, capture DOM states of beats.
import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();
await page.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(1500);

// Inspect each beat's rendered dimensions
const report = await page.evaluate(() => {
  const beats = Array.from(document.querySelectorAll('[data-case-beat]'));
  const out = beats.map((b, i) => {
    const rect = b.getBoundingClientRect();
    const media = b.querySelector(':scope > div:nth-child(2) > div') || b.querySelector(':scope > div > div:nth-child(2)');
    const mediaAspect = b.querySelector('[class*="aspect"]') || b.querySelectorAll('div')[3];
    const mediaRect = mediaAspect ? mediaAspect.getBoundingClientRect() : null;
    const imgs = Array.from(b.querySelectorAll('img')).map((img) => ({
      src: img.getAttribute('src')?.slice(-60),
      w: img.clientWidth,
      h: img.clientHeight,
      complete: img.complete,
      naturalW: img.naturalWidth,
    }));
    const vids = Array.from(b.querySelectorAll('video')).map((v) => ({
      sources: Array.from(v.querySelectorAll('source')).map((s) => s.src.slice(-40)),
      w: v.clientWidth,
      h: v.clientHeight,
    }));
    const firstDiv = b.firstElementChild;
    return {
      index: i,
      beatRect: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
      firstChild: firstDiv ? firstDiv.className.slice(0, 100) : null,
      mediaAspect: mediaRect ? `${Math.round(mediaRect.width)}x${Math.round(mediaRect.height)}` : null,
      imgs,
      vids,
      innerHTML: b.innerHTML.length,
    };
  });
  return out;
});
console.log(JSON.stringify(report, null, 2));

await ctx.close();
await browser.close();
