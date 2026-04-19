#!/usr/bin/env node
import { chromium } from "playwright";

const URL = "http://localhost:3000";
const VP = { width: 1920, height: 1080 };

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: VP, deviceScaleFactor: 1 });
const page = await ctx.newPage();

page.on("console", (msg) => {
  const t = msg.type();
  if (t === "error" || t === "warning") console.log(`[page:${t}]`, msg.text());
});
page.on("pageerror", (err) => console.log("[pageerror]", err.message));
page.on("requestfailed", (req) => console.log("[reqfail]", req.url(), req.failure()?.errorText));

await page.goto(URL, { waitUntil: "load" });
await page.waitForTimeout(2000);

const videoState = await page.evaluate(() => {
  const v = document.querySelector("[data-case-video]");
  if (!v) return null;
  return {
    tagSrcs: [...v.querySelectorAll("source")].map((s) => ({ src: s.src, type: s.type })),
    poster: v.poster,
    currentSrc: v.currentSrc,
    readyState: v.readyState,
    networkState: v.networkState,
    paused: v.paused,
    ended: v.ended,
    currentTime: v.currentTime,
    duration: v.duration,
    videoWidth: v.videoWidth,
    videoHeight: v.videoHeight,
    error: v.error ? { code: v.error.code, message: v.error.message } : null,
    computed: {
      width: window.getComputedStyle(v).width,
      height: window.getComputedStyle(v).height,
      objectFit: window.getComputedStyle(v).objectFit,
      objectPosition: window.getComputedStyle(v).objectPosition,
    },
  };
});

console.log("VIDEO STATE:", JSON.stringify(videoState, null, 2));

// Also check for any image/element with white/near-white background
const whiteElts = await page.evaluate(() => {
  const found = [];
  const caseTop = document.getElementById("case-study-nextup").getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: caseTop + 1080 * 5.2, behavior: "instant" });
  return new Promise((resolve) => setTimeout(() => {
    const all = document.querySelectorAll("*");
    for (const el of all) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.top >= 1080 || r.bottom <= 0) continue;
      const cs = window.getComputedStyle(el);
      if (cs.opacity === "0" || cs.visibility === "hidden" || cs.display === "none") continue;
      const bg = cs.backgroundColor;
      // Parse rgb values — detect white-ish
      const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (!m) continue;
      const [r0, g0, b0, a = "1"] = [m[1], m[2], m[3], m[4]];
      const R = +r0, G = +g0, B = +b0, A = +a;
      if (A < 0.1) continue;
      if (R > 200 && G > 200 && B > 200) {
        found.push({
          tag: el.tagName,
          cls: (el.className?.toString?.() ?? "").slice(0, 80),
          bg,
          rect: { top: r.top, left: r.left, right: r.right, bottom: r.bottom, w: r.width, h: r.height },
        });
      }
    }
    resolve(found);
  }, 400));
});

console.log("\nWHITE-ish elements in viewport at 07-selected:");
for (const e of whiteElts) {
  console.log(`${e.tag} bg=${e.bg} rect=[${Math.round(e.rect.left)},${Math.round(e.rect.top)} → ${Math.round(e.rect.right)},${Math.round(e.rect.bottom)}] cls="${e.cls}"`);
}

await browser.close();
