#!/usr/bin/env node
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const URL = process.env.URL ?? "http://localhost:3000";
const VP = { width: 1920, height: 1080 };
const OUT = "/tmp/diagnose-case-study";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: VP, deviceScaleFactor: 1 });
const page = await ctx.newPage();

await page.goto(URL, { waitUntil: "load" });
await page.waitForTimeout(1500);

const caseTop = await page.evaluate(() => {
  const el = document.getElementById("case-study-nextup");
  return el ? el.getBoundingClientRect().top + window.scrollY : null;
});
console.log("caseTop =", caseTop);

const positions = [
  { name: "07-selected", y: 1080 * 5.2 },
];

for (const { name, y } of positions) {
  const scrollY = caseTop + y;
  await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), scrollY);
  await page.waitForTimeout(400);

  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false });

  // Probe a 20-column strip across the viewport at y=540
  const strip = await page.evaluate(() => {
    const results = [];
    for (let x = 60; x < 1920; x += 60) {
      const el = document.elementFromPoint(x, 540);
      if (!el) { results.push({ x, tag: null }); continue; }
      const r = el.getBoundingClientRect();
      const cs = window.getComputedStyle(el);
      results.push({
        x,
        tag: el.tagName,
        id: el.id || null,
        cls: (el.className?.toString?.() ?? "").slice(0, 120),
        bg: cs.backgroundColor,
        opacity: cs.opacity,
        zIndex: cs.zIndex,
        position: cs.position,
        rect: { top: r.top, left: r.left, right: r.right, bottom: r.bottom },
      });
    }
    return results;
  });

  console.log("\n=== " + name + " strip at y=540 ===");
  for (const s of strip) {
    const loc = s.rect ? `[${Math.round(s.rect.left)}..${Math.round(s.rect.right)}]` : "";
    console.log(`x=${s.x.toString().padStart(4)} ${s.tag} z=${s.zIndex} op=${s.opacity} bg=${s.bg} cls="${s.cls.slice(0,60)}" ${loc}`);
  }

  // Find every element whose bounding box intersects viewport AND has right > 1500
  const rightEdgeElts = await page.evaluate(() => {
    const all = document.querySelectorAll("*");
    const found = [];
    for (const el of all) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.top >= 1080 || r.bottom <= 0) continue;
      if (r.right < 1500) continue;
      const cs = window.getComputedStyle(el);
      if (cs.opacity === "0" || cs.visibility === "hidden" || cs.display === "none") continue;
      found.push({
        tag: el.tagName,
        id: el.id || null,
        cls: (el.className?.toString?.() ?? "").slice(0, 100),
        rect: { top: r.top, left: r.left, right: r.right, bottom: r.bottom, w: r.width, h: r.height },
        bg: cs.backgroundColor,
        zIndex: cs.zIndex,
        position: cs.position,
      });
    }
    return found;
  });

  console.log("\n=== " + name + " elements overlapping right-edge column (x>1500) ===");
  for (const e of rightEdgeElts) {
    console.log(`${e.tag}#${e.id ?? ""} z=${e.zIndex} pos=${e.position} bg=${e.bg} rect=[${Math.round(e.rect.left)},${Math.round(e.rect.top)} → ${Math.round(e.rect.right)},${Math.round(e.rect.bottom)}] cls="${e.cls.slice(0,80)}"`);
  }
}

await browser.close();
