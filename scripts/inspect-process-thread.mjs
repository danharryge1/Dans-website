import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

// Scroll to process section
await page.evaluate(() => {
  const el = document.getElementById("process");
  if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
});
await page.waitForTimeout(1500);

const info = await page.evaluate(() => {
  const thread = document.querySelector("[data-process-thread]");
  const container = document.querySelector("[data-process-thread-container]");
  const dots = Array.from(document.querySelectorAll("[data-process-dot]"));
  const numerals = Array.from(document.querySelectorAll("[data-process-numeral]"));
  const blocks = Array.from(document.querySelectorAll("[data-process-block]"));
  const rect = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), centerX: Math.round(r.x + r.width / 2), centerY: Math.round(r.y + r.height / 2) };
  };
  return {
    thread: rect(thread),
    container: rect(container),
    dots: dots.map(rect),
    numerals: numerals.map(rect),
    blockRects: blocks.map(rect),
  };
});

console.log(JSON.stringify(info, null, 2));

await page.screenshot({ path: "tmp/process-thread.png", fullPage: false });
console.log("[screenshot] tmp/process-thread.png");

await browser.close();
