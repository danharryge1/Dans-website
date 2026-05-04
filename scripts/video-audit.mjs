import pkg from "/Users/dangeorge/.nvm/versions/node/v25.6.1/lib/node_modules/@playwright/cli/node_modules/playwright/index.js";
const { chromium } = pkg;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);

// Scroll to every section, ensure all videos play and no controls/play UI
const sections = ['hero', 'services', 'case-study-nextup', 'selected-works', 'contact'];
for (const id of sections) {
  await page.evaluate((sid) => {
    const el = document.getElementById(sid);
    el?.scrollIntoView({ behavior: 'instant', block: 'start' });
  }, id);
  await page.waitForTimeout(800);
}
// Scroll through case-study pin stops
for (const y of [2600, 4000, 5500, 7000]) {
  await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y);
  await page.waitForTimeout(500);
}
// Back to top
await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
await page.waitForTimeout(1000);

const videos = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('video')).map(v => {
    const src = v.querySelector('source')?.src || v.src || '';
    return {
      src: src.substring(src.lastIndexOf('/') + 1),
      paused: v.paused,
      muted: v.muted,
      autoplay: v.autoplay,
      loop: v.loop,
      playsInline: v.playsInline,
      controls: v.controls,
      currentTime: v.currentTime.toFixed(2),
      readyState: v.readyState,
    };
  });
});
console.log('=== VIDEO STATE ACROSS ALL SECTIONS ===');
videos.forEach(v => console.log(JSON.stringify(v)));

await browser.close();
