import pkg from "/Users/dangeorge/.nvm/versions/node/v25.6.1/lib/node_modules/@playwright/cli/node_modules/playwright/index.js";
const { chromium } = pkg;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

// Dig into services section
const svc = await page.evaluate(() => {
  const el = document.getElementById('services');
  if (!el) return 'not found';
  const cards = Array.from(el.querySelectorAll('[class*="card"], .grid > *, article, li'));
  return {
    outerHTML: el.outerHTML.substring(0, 500),
    childrenCount: el.children.length,
    cards: cards.length,
    tagName: el.tagName,
  };
});
console.log('Services section:');
console.log(svc);

// Services' actual content at visual top
await page.evaluate(() => window.scrollTo(0, 1800));
await page.waitForTimeout(500);
await page.screenshot({ path: '/tmp/services-view.png', fullPage: false });
console.log('Screenshot saved /tmp/services-view.png');

await browser.close();
