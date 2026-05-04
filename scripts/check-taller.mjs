import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
// Try a taller viewport like MBP 16"
const ctx = await browser.newContext({ viewport: { width: 1728, height: 1117 } });
const page = await ctx.newPage();
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

const info = await page.evaluate(() => {
  const hero = document.getElementById("hero");
  const laptop = document.querySelector("[data-hero-laptop]");
  const headline = document.getElementById("hero-heading");
  const scrollHint = document.querySelector("[data-hero-scroll-hint]");
  const r = (el) => el ? (() => { const b = el.getBoundingClientRect(); return `${Math.round(b.x)},${Math.round(b.y)} ${Math.round(b.width)}x${Math.round(b.height)}`; })() : null;
  return { winH: window.innerHeight, hero: r(hero), laptop: r(laptop), headline: r(headline), scrollHint: r(scrollHint) };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
