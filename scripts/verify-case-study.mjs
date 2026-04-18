import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const OUT = "docs/verification/2026-04-18-case-study";
await mkdir(OUT, { recursive: true });

const viewports = [
  { name: "desktop", width: 1920, height: 1080 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 375, height: 812 },
];

async function runViewport(browser, vp) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  await page.goto("http://localhost:3000", { waitUntil: "load" });
  await page.waitForTimeout(1500);
  await page.waitForSelector("#case-study-nextup");

  const caseTop = await page.evaluate(() => {
    const el = document.getElementById("case-study-nextup");
    return el ? el.getBoundingClientRect().top + window.scrollY : 0;
  });

  const positions = {
    "01-pre-pin":   caseTop - vp.height * 0.5,
    "02-act-1":     caseTop + 50,
    "03-beat-01":   caseTop + vp.height * 1.0,
    "04-beat-02":   caseTop + vp.height * 2.0,
    "05-beat-03":   caseTop + vp.height * 3.0,
    "06-act-3":     caseTop + vp.height * 4.3,
    "07-selected":  caseTop + vp.height * 5.2,
  };

  for (const [name, y] of Object.entries(positions)) {
    await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), y);
    await page.waitForTimeout(700);
    await page.screenshot({
      path: join(OUT, `${vp.name}-${name}.png`),
      fullPage: false,
    });
  }

  await context.close();
}

async function runReducedMotion(browser) {
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("http://localhost:3000", { waitUntil: "load" });
  await page.waitForTimeout(1500);
  await page.waitForSelector("#case-study-nextup");
  const caseTop = await page.evaluate(() =>
    document.getElementById("case-study-nextup").getBoundingClientRect().top + window.scrollY,
  );
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), caseTop + 200);
  await page.waitForTimeout(400);
  await page.screenshot({ path: join(OUT, "desktop-reduced-motion.png"), fullPage: false });
  await context.close();
}

const browser = await chromium.launch({ headless: true });
for (const vp of viewports) {
  await runViewport(browser, vp);
}
await runReducedMotion(browser);
await browser.close();
console.log("Case study verification complete.");
