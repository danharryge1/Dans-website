import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const OUT = "docs/verification/2026-04-18-services";
await mkdir(OUT, { recursive: true });

const viewports = [
  { name: "desktop", width: 1920, height: 1080 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 375, height: 812 },
];

const SCROLL_POSITIONS = [
  { name: "01-entering" },
  { name: "02-mid-sweep" },
  { name: "03-revealed" },
];

async function runViewport(browser, vp) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForSelector("#services");

  const servicesTop = await page.evaluate(() => {
    const el = document.getElementById("services");
    return el ? el.getBoundingClientRect().top + window.scrollY : 0;
  });

  const viewportH = vp.height;

  const positions = [
    servicesTop - viewportH * 0.9,
    servicesTop - viewportH * 0.3,
    servicesTop + viewportH * 0.5,
  ];

  for (let i = 0; i < SCROLL_POSITIONS.length; i++) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), positions[i]);
    await page.waitForTimeout(700);
    await page.screenshot({
      path: join(OUT, `${vp.name}-${SCROLL_POSITIONS[i].name}.png`),
      fullPage: false,
    });
    console.log(`  saved ${vp.name}-${SCROLL_POSITIONS[i].name}.png`);
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
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForSelector("#services");
  const servicesTop = await page.evaluate(() => {
    const el = document.getElementById("services");
    return el ? el.getBoundingClientRect().top + window.scrollY : 0;
  });
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), servicesTop - 100);
  await page.waitForTimeout(400);
  await page.screenshot({
    path: join(OUT, "desktop-reduced-motion.png"),
    fullPage: false,
  });
  console.log("  saved desktop-reduced-motion.png");
  await context.close();
}

console.log("Launching Chromium…");
const browser = await chromium.launch({ headless: true });
for (const vp of viewports) {
  console.log(`\nViewport ${vp.name} (${vp.width}×${vp.height})`);
  await runViewport(browser, vp);
}
console.log("\nReduced-motion variant");
await runReducedMotion(browser);
await browser.close();
console.log("\nVerification complete — screenshots saved to", OUT);
