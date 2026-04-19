#!/usr/bin/env node
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT_DIR = "docs/verification/2026-04-19-contact";
mkdirSync(OUT_DIR, { recursive: true });

const URL_BASE = process.env.URL_BASE ?? "http://localhost:3000";

const VIEWPORTS = {
  desktop: { width: 1920, height: 1080 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 812, deviceScaleFactor: 2 },
};

async function scrollToContact(page, fraction) {
  await page.evaluate((frac) => {
    const el = document.getElementById("contact");
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const absoluteTop = rect.top + window.scrollY;
    const viewportH = window.innerHeight;
    const targetScroll = absoluteTop - viewportH * (1 - frac);
    window.scrollTo(0, Math.max(0, targetScroll));
  }, fraction);
  await page.waitForTimeout(800);
}

async function capture(browser, viewportName, opts = {}) {
  const context = await browser.newContext({
    viewport: VIEWPORTS[viewportName],
    deviceScaleFactor: VIEWPORTS[viewportName].deviceScaleFactor ?? 1,
    reducedMotion: opts.reducedMotion ? "reduce" : "no-preference",
  });
  const page = await context.newPage();
  await page.goto(URL_BASE, { waitUntil: "networkidle" });

  const suffix = opts.reducedMotion ? "-reduced-motion" : "";

  if (opts.reducedMotion) {
    await scrollToContact(page, 0.5);
    await page.screenshot({
      path: join(OUT_DIR, `${viewportName}${suffix}.png`),
      fullPage: false,
    });
  } else {
    await scrollToContact(page, 0.1);
    await page.screenshot({
      path: join(OUT_DIR, `${viewportName}-01-pre-reveal.png`),
      fullPage: false,
    });

    await scrollToContact(page, 0.5);
    await page.screenshot({
      path: join(OUT_DIR, `${viewportName}-02-mid-reveal.png`),
      fullPage: false,
    });

    await scrollToContact(page, 0.95);
    await page.screenshot({
      path: join(OUT_DIR, `${viewportName}-03-post-reveal.png`),
      fullPage: false,
    });
  }

  await context.close();
}

async function captureSuccessState(browser) {
  const context = await browser.newContext({
    viewport: VIEWPORTS.desktop,
  });
  const page = await context.newPage();

  await page.route("**/api/contact", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    });
  });

  await page.goto(URL_BASE, { waitUntil: "networkidle" });
  await scrollToContact(page, 0.5);

  await page.fill('input[name="name"]', "Ada Lovelace");
  await page.fill('input[name="email"]', "ada@example.com");
  await page.fill(
    'textarea[name="message"]',
    "I want a premium landing page for my new analytics product. Timeline: 6 weeks.",
  );

  await page.click('button[type="submit"]');
  await page.waitForSelector('div[role="status"] h3', { timeout: 5000 });
  await page.waitForFunction(
    () => {
      const h = document.querySelector('div[role="status"] h3');
      return h && h.textContent && h.textContent.trim() === "Got it.";
    },
    { timeout: 5000 },
  );
  await page.waitForTimeout(400);

  await page.screenshot({
    path: join(OUT_DIR, "desktop-04-success.png"),
    fullPage: false,
  });

  await context.close();
}

async function main() {
  const browser = await chromium.launch({
    args: ["--autoplay-policy=no-user-gesture-required"],
  });

  for (const vp of ["desktop", "tablet", "mobile"]) {
    console.log(`Capturing ${vp}...`);
    await capture(browser, vp);
  }
  console.log("Capturing desktop reduced-motion...");
  await capture(browser, "desktop", { reducedMotion: true });

  console.log("Capturing desktop success state...");
  await captureSuccessState(browser);

  await browser.close();
  console.log("Done. Output:", OUT_DIR);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
