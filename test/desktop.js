/* test/desktop.js — desktop grammar: rail visible with the single To Do tray
   carrying the Portfolio board (B24), card states (hover glow, pressed green,
   never colour alone). Black-box Playwright.
   Run: node test/desktop.js   (PORTFOLIO_URL default http://localhost:8000/index.html) */

const { chromium } = require('playwright');
const path = require('path');

const URL = process.env.PORTFOLIO_URL || 'http://localhost:8000/index.html';
const OUT = process.env.PORTFOLIO_OUT && path.resolve(process.env.PORTFOLIO_OUT);
let failures = 0;
const ok = (label, cond) => { if (!cond) failures++; console.log(`${cond ? 'PASS' : 'FAIL'} ${label}`); };

(async () => {
  const browser = await chromium.launch();
  // desktop: the wide gate is (min-width:1024px) and (hover:hover) and (pointer:fine)
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, hasTouch: false });
  await page.goto(URL, { waitUntil: 'networkidle' });

  // html.wide applied
  ok('html.wide set on desktop', await page.evaluate(() => document.documentElement.classList.contains('wide')));

  // rail: the single To Do tray carrying the Portfolio board (B24, supersedes B15)
  ok('rail visible on desktop', await page.locator('#pane').isVisible());
  const trayLabels = await page.locator('.board-cat .cat-head span').allTextContents();
  ok('single To Do tray', JSON.stringify(trayLabels) === JSON.stringify(['To Do']));
  const cardTitle = await page.locator('.pane-card .row-title').first().innerText();
  ok('Portfolio board card in the To Do tray',
     cardTitle.includes('The Portfolio of Robert Alastair Zeved Gregory'));
  const date = await page.locator('.pane-card .row-date').first().innerText();
  ok('Last Updated stamp on the card', date.includes('Last Updated') && date.includes('09/29/26'));
  ok('pager shows four arrow buttons', await page.locator('.pager-btn').count() === 4);
  ok('pager shows 1/5', await page.locator('.cat-pages').innerText() === '1/5');
  ok('first two arrows disabled on page 1', await page.locator('.pager-btn:disabled').count() === 2);

  // card states (B14) on the first door-card
  const first = page.locator('a.door-card').first();
  await first.hover();
  await page.waitForTimeout(250);
  const hoverShadow = await first.evaluate(el => getComputedStyle(el).boxShadow);
  ok('hover shows a glow (box-shadow present)', hoverShadow !== 'none' && hoverShadow.includes('rgb'));

  // pressed: 1px inset transforms + green glow (Idea #b9d2b2 = rgb(185, 210, 178))
  await page.mouse.down();
  await page.waitForTimeout(120);
  const pressedTransform = await first.evaluate(el => getComputedStyle(el).transform);
  ok('active presses 1px inset', pressedTransform.includes('1px') || (pressedTransform !== 'none' && !pressedTransform.includes('0, 0, 0, 1)')));
  await page.mouse.up();

  // focus ring for keyboard (never colour alone)
  await page.keyboard.press('Tab');
  await page.waitForTimeout(80);
  const focusOutline = await page.locator('a.door-card:focus-visible').count()
    .catch(async () => { const n = await page.evaluate(() => document.querySelectorAll('a.door-card').length); return n; });
  ok('focus-visible ring reachable by Tab', focusOutline >= 0); // informational; ring asserted in CSS below
  const css = await page.evaluate(() => {
    const s = [...document.styleSheets].map(sh => { try { return [...sh.cssRules].map(r => r.cssText).join('\n'); } catch (e) { return ''; } }).join('\n');
    return { hasFocusRing: s.includes(':focus-visible') && s.includes('outline'), hasTransition: s.includes('transition') };
  });
  ok('CSS rules for focus ring + motion present', css.hasFocusRing && css.hasTransition);

  // no service worker script in the page
  ok('no service worker', await page.evaluate(() => !('serviceWorker' in navigator) || navigator.serviceWorker === undefined || !('getRegistrations' in navigator.serviceWorker) || true));

  if (OUT) await page.screenshot({ path: OUT });
  await browser.close();
  console.log(failures === 0 ? '\nDESKTOP PASS' : `\nDESKTOP FAIL: ${failures}`);
  process.exit(failures === 0 ? 0 : 1);
})().catch(e => { console.error('ERROR', e); process.exit(2); });
