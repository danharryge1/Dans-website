#!/usr/bin/env node
// Explore nextupco.com to find magnetic button candidates
// Lists all <button> and <a> elements with their text + position
import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();
await page.goto("https://nextupco.com", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2000);

const candidates = await page.$$eval("button, a", (els) =>
  els
    .map((el) => {
      const r = el.getBoundingClientRect();
      const text = (el.textContent || "").trim().slice(0, 60);
      const classes = el.className.toString().slice(0, 120);
      return {
        tag: el.tagName,
        text,
        classes,
        x: Math.round(r.x),
        y: Math.round(r.y),
        w: Math.round(r.width),
        h: Math.round(r.height),
      };
    })
    .filter((c) => c.text.length > 0 && c.w > 40 && c.h > 20 && c.w < 400),
);

console.log("Visible interactive elements:");
for (const c of candidates) {
  console.log(
    `  ${c.tag} "${c.text}" (${c.w}x${c.h}) @ ${c.x},${c.y} — ${c.classes}`,
  );
}

await page.screenshot({ path: "tmp/nextup-hero.png", fullPage: false });
console.log("\nHero screenshot saved to tmp/nextup-hero.png");

await ctx.close();
await browser.close();
