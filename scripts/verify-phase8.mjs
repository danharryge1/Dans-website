import { chromium } from "playwright";
import fs from "node:fs";

const OUT = "tmp/verify-phase8";
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

// Scroll to Services
const services = await page.evaluate(() => {
  const el = document.querySelector("#services") || Array.from(document.querySelectorAll("section")).find((s) => s.textContent?.toLowerCase().includes("services"));
  return el ? el.getBoundingClientRect().top + window.scrollY : null;
});
if (services != null) {
  await page.evaluate((y) => window.scrollTo(0, y - 100), services);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/services.png`, fullPage: false });
  const stamped = await page.evaluate(() =>
    Array.from(document.querySelectorAll("[data-services-card]")).map((c) => c.getAttribute("data-reveal")),
  );
  console.log("[services] data-reveal:", stamped);
}

// Scroll to Philosophy
const phil = await page.evaluate(() => {
  const el = document.querySelector("[data-philosophy-block]")?.closest("section");
  return el ? el.getBoundingClientRect().top + window.scrollY : null;
});
if (phil != null) {
  await page.evaluate((y) => window.scrollTo(0, y - 100), phil);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/philosophy.png`, fullPage: false });
  const stamped = await page.evaluate(() =>
    Array.from(document.querySelectorAll("[data-philosophy-block]")).map((c) => c.getAttribute("data-reveal")),
  );
  console.log("[philosophy] data-reveal:", stamped);
}

// Scroll to Contact + check magnetic button
const contact = await page.evaluate(() => {
  const el = document.getElementById("contact");
  return el ? el.getBoundingClientRect().top + window.scrollY : null;
});
if (contact != null) {
  await page.evaluate((y) => window.scrollTo(0, y - 100), contact);
  await page.waitForTimeout(1200);
  const magBtn = await page.evaluate(() => {
    const btn = document.querySelector('[data-magnetic][data-magnetic-variant="solid"]');
    return btn
      ? {
          tag: btn.tagName,
          type: btn.getAttribute("type"),
          classes: btn.className,
          hasFill: !!btn.querySelector(".magb-fill"),
          hasInner: !!btn.querySelector(".magb-inner"),
        }
      : null;
  });
  console.log("[contact] MagneticButton:", magBtn);

  // Hover the submit button
  const handle = await page.$('[data-magnetic][data-magnetic-variant="solid"]');
  if (handle) {
    const box = await handle.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(400);
      await page.screenshot({ path: `${OUT}/contact-hover.png`, fullPage: false });
    }
  }
}

await browser.close();
console.log("[done] screenshots in", OUT);
