import { chromium } from "playwright";
import fs from "node:fs";

const OUT = "tmp/verify-act1";
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
page.on("pageerror", (err) => console.log("[pageerror]", err.message));
page.on("console", (msg) => {
  if (msg.type() === "error") console.log("[console.error]", msg.text());
});
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

await page.screenshot({ path: `${OUT}/01-hero-initial.png`, fullPage: false });
const seam0 = await page.evaluate(() =>
  getComputedStyle(document.getElementById("hero")).getPropertyValue("--seam-x"),
);
console.log("[hero] initial seam-x =", seam0.trim());

const pinTop = await page.evaluate(() => {
  const pin = document.querySelector("[data-case-pin]");
  return pin ? pin.getBoundingClientRect().top + window.scrollY : 0;
});
await page.evaluate((y) => window.scrollTo(0, y), pinTop);
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/02-act1-default.png`, fullPage: false });

const bg = await page.evaluate(() => {
  const noVideo = !document.querySelector("[data-case-video]");
  const bgEl = document.querySelector("[data-case-bg-default]");
  const draftBtn = Array.from(document.querySelectorAll("button")).find((b) =>
    (b.textContent || "").trim().includes("DRAFT"),
  );
  const realityBtn = Array.from(document.querySelectorAll("button")).find(
    (b) => (b.textContent || "").trim().includes("REALITY"),
  );
  return {
    noVideo,
    hasDefaultBg: !!bgEl,
    bgHasGradient: bgEl ? (bgEl.style.background || "").includes("gradient") : false,
    draftRect: draftBtn?.getBoundingClientRect().toJSON() ?? null,
    realityRect: realityBtn?.getBoundingClientRect().toJSON() ?? null,
  };
});
console.log("[act1] bg/buttons:", bg);

// Click DRAFT via getByRole
const draft = page.getByRole("button", { name: /DRAFT/ });
await draft.click();
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/03-act1-draft.png`, fullPage: false });

// Click REALITY
const reality = page.getByRole("button", { name: /REALITY/ });
await reality.click();
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/04-act1-reality.png`, fullPage: false });

// Click close (×)
const close = page.getByRole("button", { name: /Return to default backdrop/ });
await close.click();
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/05-act1-closed.png`, fullPage: false });

// Click DRAFT then scroll out — state should auto reset
await draft.click();
await page.waitForTimeout(400);
await page.evaluate((y) => window.scrollTo(0, y + window.innerHeight * 2.5), pinTop);
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}/06-scrolled-into-act2.png`, fullPage: false });

// Act 3
await page.evaluate((y) => window.scrollTo(0, y + window.innerHeight * 4.8), pinTop);
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}/07-act3.png`, fullPage: false });

// Scroll back to Act 1
await page.evaluate((y) => window.scrollTo(0, y), pinTop);
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}/08-act1-after-return.png`, fullPage: false });

await browser.close();
console.log("[done] screenshots in", OUT);
