import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
const info = await page.evaluate(() => {
  const beat = document.querySelector('[data-case-beat][data-beat-index="0"]');
  if (!beat) return { err: "no beat" };
  const cs = window.getComputedStyle(beat);
  const kids = Array.from(beat.children).map((c) => {
    const r = c.getBoundingClientRect();
    return {
      cls: c.className.slice(0, 80),
      w: Math.round(r.width),
      h: Math.round(r.height),
    };
  });
  return {
    beat_w: Math.round(beat.getBoundingClientRect().width),
    beat_h: Math.round(beat.getBoundingClientRect().height),
    grid_template: cs.gridTemplateColumns,
    gap: cs.gap,
    display: cs.display,
    parentW: Math.round(beat.parentElement.getBoundingClientRect().width),
    parentDisplay: window.getComputedStyle(beat.parentElement).display,
    kids,
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
