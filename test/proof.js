/* proof.js — capture the shipped page at desktop + mobile for visual review. */
const { chromium } = require('playwright');
const path = require('path');
const URL = process.env.PORTFOLIO_URL || 'http://127.0.0.1:8391/index.html';
const OUT = process.env.PROOF_DIR || '/tmp/portfolio-proof';

(async () => {
  const browser = await chromium.launch();
  const shots = [
    ['desktop-1440x900.png', 1440, 900],
    ['desktop-1920x1080.png', 1920, 1080],
    ['mobile-390x844.png', 390, 844],
  ];
  for (const [name, w, h] of shots) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, hasTouch: false });
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(OUT, name) });
    // report geometry for the record
    const g = await page.evaluate(() => {
      const b = document.querySelector('#board').getBoundingClientRect();
      const t = document.querySelector('#anchor-title').getBoundingClientRect();
      const cards = [...document.querySelectorAll('a.door-card')].map(a => {
        const r = a.getBoundingClientRect();
        return [a.textContent.trim(), Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)];
      });
      return { board: [b.x, b.y, b.width, b.height], title: [Math.round(t.x), Math.round(t.y), Math.round(t.width), Math.round(t.height)], cards };
    });
    console.log(name, JSON.stringify(g));
    await page.close();
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
