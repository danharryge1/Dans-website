import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

await page.evaluate(() => {
  const el = document.getElementById("process");
  if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
});
await page.waitForTimeout(2000);

const info = await page.evaluate(() => {
  const dots = Array.from(document.querySelectorAll("[data-process-dot]"));
  return dots.map((d) => {
    const cs = window.getComputedStyle(d);
    return {
      left: cs.left,
      top: cs.top,
      transform: cs.transform,
      width: cs.width,
      height: cs.height,
      className: d.className,
      inlineStyle: d.getAttribute("style"),
    };
  });
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
