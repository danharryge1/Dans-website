import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);

// Scroll the pinned case study all the way through so Act 3 is fully active
const pinH = await page.evaluate(() => {
  const pin = document.querySelector("[data-case-pin]");
  return pin ? pin.getBoundingClientRect().top + window.scrollY : 0;
});
// scroll nearly all the way through the 500vh scroll range
await page.evaluate((pinTop) => window.scrollTo(0, pinTop + window.innerHeight * 4.8), pinH);
await page.waitForTimeout(1500);

await page.screenshot({ path: "tmp/act3-current.png", fullPage: false });

// Inspect computed styles of Act 3 elements
const info = await page.evaluate(() => {
  const act3 = document.querySelector('[data-case-act="3"]');
  const gradient = document.querySelector("[data-case-gradient]");
  if (!act3 || !gradient) return { err: "missing" };
  const g = window.getComputedStyle(gradient);
  const a = window.getComputedStyle(act3);
  return {
    gradientOpacity: g.opacity,
    gradientBackground: g.background.slice(0, 200),
    act3Opacity: a.opacity,
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
console.log("[screenshot] tmp/act3-current.png");
