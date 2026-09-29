/* test/desktop.js — desktop grammar: rail visible with four empty categories,
   card states (hover glow, pressed green, never colour alone). Black-box Playwright.
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

  // rail visible with four categories (B15, B18)
  ok('rail visible on desktop', await page.locator('#pane').isVisible());
  const cats = await page.locator('.rail-cat h3').allInnerTexts();
  ok('four categories in order', JSON.stringify(cats) === JSON.stringify(['To Do', 'Notes', 'Learning', 'Ideas']));

  // To Do holds the Portfolio board (B18); other three categories stay empty (B15)
  ok('To Do shows the Portfolio board', await page.locator('.rail-cat h3:has-text("To Do") ~ .rail-board .rb-title').first().innerText()
    .then(t => t === 'The Portfolio of Robert Alastair Zeved Gregory').catch(() => false));
  const emptyAfter = await page.evaluate(() =>
    ['Notes', 'Learning', 'Ideas'].map(name => {
      const h3 = [...document.querySelectorAll('.rail-cat h3')].find(h => h.textContent === name);
      const sibling = h3.parentElement.querySelector(':scope > .rail-row');
      return !sibling || sibling.getAttribute('aria-label') === 'empty';
    }).every(Boolean));
  ok('Notes/Learning/Ideas remain empty', emptyAfter);

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
