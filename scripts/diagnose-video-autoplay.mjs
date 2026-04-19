#!/usr/bin/env node
import { chromium } from "playwright";

const URL = "http://localhost:3000";
const VP = { width: 1920, height: 1080 };

const browser = await chromium.launch({
  headless: true,
  args: ["--autoplay-policy=no-user-gesture-required"],
});
const ctx = await browser.newContext({ viewport: VP, deviceScaleFactor: 1 });
const page = await ctx.newPage();

await page.goto(URL, { waitUntil: "load" });
await page.waitForTimeout(2500);

const videoState = await page.evaluate(() => {
  const v = document.querySelector("[data-case-video]");
  return {
    paused: v.paused,
    currentTime: v.currentTime,
    readyState: v.readyState,
    error: v.error?.message ?? null,
  };
});
console.log("With autoplay enabled:", JSON.stringify(videoState, null, 2));

await page.evaluate(() => {
  const el = document.getElementById("case-study-nextup");
  const top = el.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: top + 1080 * 5.2, behavior: "instant" });
});
await page.waitForTimeout(500);

await page.screenshot({ path: "/tmp/diagnose-case-study/07-selected-autoplay-on.png", fullPage: false });
await browser.close();
console.log("saved /tmp/diagnose-case-study/07-selected-autoplay-on.png");
