import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

// Capture initial viewport
await page.screenshot({ path: "tmp/hero-initial.png", fullPage: false });

const info = await page.evaluate(() => {
  const hero = document.getElementById("hero");
  const laptop = document.querySelector("[data-hero-laptop]") || document.querySelector("[data-hero-laptop-container]");
  const chip = document.querySelector('[data-case-act="1"] .absolute.right-12');
  const act1 = document.querySelector('[data-case-act="1"]');
  const pin = document.querySelector("[data-case-pin]");
  return {
    winW: window.innerWidth,
    winH: window.innerHeight,
    heroRect: hero ? (() => { const r = hero.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; })() : null,
    heroBottom: hero ? hero.getBoundingClientRect().bottom : null,
    laptopRect: laptop ? (() => { const r = laptop.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; })() : null,
    pinRect: pin ? (() => { const r = pin.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; })() : null,
  };
});
console.log(JSON.stringify(info, null, 2));

await browser.close();
console.log("[screenshot] tmp/hero-initial.png");
