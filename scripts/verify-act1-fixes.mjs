import { chromium } from "playwright";
import fs from "node:fs";
fs.mkdirSync("tmp", { recursive: true });
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
const pinTop = await page.evaluate(() => {
  const pin = document.querySelector("[data-case-pin]");
  return pin ? pin.getBoundingClientRect().top + window.scrollY : 0;
});
await page.evaluate((y) => window.scrollTo(0, y), pinTop);
await page.waitForTimeout(800);
await page.screenshot({ path: "tmp/act1-green.png", fullPage: false });
// mobile
await browser.close();

const browser2 = await chromium.launch({ headless: true });
const ctx2 = await browser2.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const page2 = await ctx2.newPage();
await page2.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page2.waitForTimeout(1500);
const pinTop2 = await page2.evaluate(() => {
  const pin = document.querySelector("[data-case-pin]");
  return pin ? pin.getBoundingClientRect().top + window.scrollY : 0;
});
await page2.evaluate((y) => window.scrollTo(0, y), pinTop2);
await page2.waitForTimeout(800);
await page2.screenshot({ path: "tmp/act1-green-mobile.png", fullPage: false });
await browser2.close();
console.log("done");
