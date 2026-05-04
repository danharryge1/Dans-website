import { chromium } from "playwright";
import fs from "node:fs";

const OUT = "tmp/verify-act1";
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

const pinTop = await page.evaluate(() => {
  const pin = document.querySelector("[data-case-pin]");
  return pin ? pin.getBoundingClientRect().top + window.scrollY : 0;
});

// Beat 1 peak — around timeline position 0.25 of the 500% pinned range = 1.25vh past pin start
await page.evaluate((y) => window.scrollTo(0, y + window.innerHeight * 1.4), pinTop);
await page.waitForTimeout(1000);
await page.screenshot({ path: `${OUT}/09-beat1.png`, fullPage: false });
await browser.close();
console.log("[done] beat1 capture");
