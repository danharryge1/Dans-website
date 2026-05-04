import { chromium } from "playwright";
import fs from "node:fs";
fs.mkdirSync("tmp/scroll-anims", { recursive: true });

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
page.on("pageerror", (e) => console.log("[err]", e.message));
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

// Scroll to SelectedWorks to trigger stagger
const sw = await page.evaluate(() => {
  const s = document.getElementById("selected-works");
  return s ? s.getBoundingClientRect().top + window.scrollY - 200 : null;
});
if (sw != null) {
  await page.evaluate((y) => window.scrollTo(0, y), sw);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: "tmp/scroll-anims/selected-works.png", fullPage: false });
  const seamCount = await page.evaluate(() => document.querySelectorAll("[data-section-seam]").length);
  const cardOpacity = await page.evaluate(() => {
    const card = document.querySelector("[data-work-card]");
    return card ? parseFloat(getComputedStyle(card).opacity) : null;
  });
  console.log("[seams]", seamCount, "[card opacity after entry]", cardOpacity);
}

// Scroll deeper to check seam between Philosophy and SelectedWorks
await page.evaluate((y) => window.scrollTo(0, y + 600), sw ?? 0);
await page.waitForTimeout(800);
await page.screenshot({ path: "tmp/scroll-anims/seam-zone.png", fullPage: false });

await browser.close();
console.log("[done]");
