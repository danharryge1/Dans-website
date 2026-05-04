import pkg from "/Users/dangeorge/.nvm/versions/node/v25.6.1/lib/node_modules/@playwright/cli/node_modules/playwright/index.js";
const { chromium } = pkg;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

const stops = [0, 900, 1500, 1800, 2200, 2600, 3500, 5000, 7000, 8000, 10000, 11500, 12000, 12200];
for (const y of stops) {
  await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y);
  await page.waitForTimeout(400);
  const state = await page.evaluate(() => ({
    scrollY: window.scrollY,
    maxScroll: document.documentElement.scrollHeight - window.innerHeight,
    visibleId: (() => {
      const elems = document.elementsFromPoint(window.innerWidth/2, window.innerHeight/2);
      const section = elems.find(el => el.tagName === 'SECTION' || el.id);
      return section ? `${section.tagName}#${section.id || '(no id)'}` : null;
    })(),
  }));
  await page.screenshot({ path: `/tmp/scroll-y${y}.png`, fullPage: false });
  console.log(`y=${y} => actual=${state.scrollY}/${state.maxScroll} center=${state.visibleId}`);
}

await browser.close();
