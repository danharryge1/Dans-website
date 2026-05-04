import pkg from "/Users/dangeorge/.nvm/versions/node/v25.6.1/lib/node_modules/@playwright/cli/node_modules/playwright/index.js";
const { chromium } = pkg;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
page.on('console', msg => {
  if (msg.type() === 'error') errors.push(msg.text());
});

await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

// 1. Document height and section positions
const layout = await page.evaluate(() => {
  const docHeight = document.documentElement.scrollHeight;
  const viewH = window.innerHeight;
  const sections = {};
  ['hero', 'services', 'case-study-nextup', 'selected-works', 'contact', 'philosophy'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const rect = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      sections[id] = {
        top: rect.top + window.scrollY,
        bottom: rect.bottom + window.scrollY,
        height: rect.height,
        position: cs.position,
      };
    } else {
      sections[id] = 'NOT FOUND';
    }
  });
  return { docHeight, viewH, sections };
});

console.log('=== LAYOUT ON MOUNT ===');
console.log('Doc height:', layout.docHeight, 'Viewport:', layout.viewH);
console.log('Sections:');
for (const [id, info] of Object.entries(layout.sections)) {
  console.log(` ${id}:`, typeof info === 'string' ? info : `top=${info.top.toFixed(0)} height=${info.height.toFixed(0)} pos=${info.position}`);
}

// 2. Wait for intro to complete
await page.waitForTimeout(2500);

const layoutAfter = await page.evaluate(() => {
  return {
    docHeight: document.documentElement.scrollHeight,
    heroTop: document.getElementById('hero')?.getBoundingClientRect().top + window.scrollY,
    seamX: getComputedStyle(document.getElementById('hero')).getPropertyValue('--seam-x').trim(),
  };
});
console.log('\n=== AFTER 2.5s (intro complete) ===');
console.log('Doc height:', layoutAfter.docHeight, '(delta:', layoutAfter.docHeight - layout.docHeight, ')');
console.log('Seam x:', layoutAfter.seamX);

// 3. Check all videos playing
const videos = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('video')).map(v => {
    const src = v.querySelector('source')?.src || v.src || '';
    return {
      src: src.substring(src.lastIndexOf('/') + 1),
      paused: v.paused,
      currentTime: v.currentTime.toFixed(2),
      readyState: v.readyState,
      visible: v.offsetParent !== null,
    };
  });
});
console.log('\n=== VIDEOS ===');
videos.forEach(v => console.log(` ${v.src}: paused=${v.paused} t=${v.currentTime}s ready=${v.readyState} visible=${v.visible}`));

// 4. ScrollTriggers list
const sts = await page.evaluate(() => {
  if (!window.ScrollTrigger) return 'ScrollTrigger not on window';
  return window.ScrollTrigger.getAll().map(st => ({
    trigger: st.trigger?.tagName + (st.trigger?.id ? '#' + st.trigger.id : '') + (st.trigger?.dataset ? (' ' + Object.keys(st.trigger.dataset).map(k => 'data-' + k).join(' ')) : ''),
    start: st.start,
    end: st.end,
    pin: !!st.pin,
    progress: st.progress.toFixed(2),
  }));
});
console.log('\n=== SCROLLTRIGGERS ===');
if (typeof sts === 'string') console.log(sts);
else sts.forEach(s => console.log(` ${s.trigger} start=${s.start} end=${s.end} pin=${s.pin} progress=${s.progress}`));

// 5. Scroll through and log positions where things feel wrong
console.log('\n=== SCROLL WALK ===');
const stops = [0, 500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000];
for (const y of stops) {
  await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y);
  await page.waitForTimeout(200);
  const cur = await page.evaluate(() => {
    const services = document.getElementById('services');
    const caseStudy = document.getElementById('case-study-nextup');
    const contact = document.getElementById('contact');
    return {
      scrollY: window.scrollY,
      maxScroll: document.documentElement.scrollHeight - window.innerHeight,
      services: services ? services.getBoundingClientRect().top : null,
      caseStudy: caseStudy ? caseStudy.getBoundingClientRect().top : null,
      contact: contact ? contact.getBoundingClientRect().top : null,
    };
  });
  console.log(` y=${cur.scrollY}/${cur.maxScroll} svc.top=${cur.services?.toFixed(0)} case.top=${cur.caseStudy?.toFixed(0)} contact.top=${cur.contact?.toFixed(0)}`);
}

console.log('\n=== CONSOLE ERRORS ===');
errors.forEach(e => console.log(' ERR:', e));

await browser.close();
