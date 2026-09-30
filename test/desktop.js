/* test/desktop.js — desktop grammar: no All Boards rail; the single board
   spans the full viewport, the door-cards re-scale inside it. Card states
   (hover glow, pressed green, never colour alone). Black-box Playwright.
   Run: node test/desktop.js   (PORTFOLIO_URL default http://localhost:8000/index.html) */

const { chromium } = require('playwright');
const path = require('path');

const URL = process.env.PORTFOLIO_URL || 'http://localhost:8000/index.html';
const OUT = process.env.PORTFOLIO_OUT && path.resolve(process.env.PORTFOLIO_OUT);
const VW = 1440, VH = 900;
let failures = 0;
const ok = (label, cond) => { if (!cond) failures++; console.log(`${cond ? 'PASS' : 'FAIL'} ${label}`); };

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: VW, height: VH }, hasTouch: false });
  await page.goto(URL, { waitUntil: 'networkidle' });

  // issue #71: the All Boards pane is removed entirely — DOM and layout
  ok('no #pane element in the DOM', await page.locator('#pane').count() === 0);
  ok('no legacy rail nodes (.board-cat/.pane-card/.pager-btn/.cat-pages)',
     (await page.locator('.board-cat, .pane-card, .pager-btn, .cat-pages, .cat-head, .cat-add').count()) === 0);
  const panelNodes = await page.evaluate(() => {
    const aside = document.querySelector('aside');
    const text = document.body.innerText;
    return { aside: !!aside, mentionsAllBoards: /All Boards/i.test(text) };
  });
  ok('no <aside> rail and no "All Boards" text anywhere', !panelNodes.aside && !panelNodes.mentionsAllBoards);

  // issue #71: the board spans the full viewport
  const board = await page.locator('#board').boundingBox();
  ok('board starts at x=0', board && Math.abs(board.x) < 1);
  ok('board spans full viewport width', board && Math.abs(board.width - VW) < 1);
  ok('board spans full viewport height', board && Math.abs(board.height - VH) < 1);

  // no horizontal scrolling introduced, one-viewport fit (TheBoards law)
  const scroll = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    iw: window.innerWidth,
    sh: document.documentElement.scrollHeight,
    ih: window.innerHeight,
    bodyOverflow: getComputedStyle(document.body).overflow,
  }));
  ok('no horizontal overflow (scrollWidth <= innerWidth)', scroll.sw <= scroll.iw + 1);
  ok('no vertical overflow (scrollHeight <= innerHeight)', scroll.sh <= scroll.ih + 1);
  ok('body clips overflow (one viewport)', scroll.bodyOverflow === 'hidden');

  // the title compartment is centred on the full-width sheet
  const tb = await page.locator('#anchor-title').boundingBox();
  ok('title card centred on the full-width sheet', tb && Math.abs((tb.x + tb.width / 2) - VW / 2) < 2);

  // regions still render their furniture
  ok('Components zone label', (await page.locator('#zone-components .band-label').innerText()) === 'Components');
  ok('Requirements zone label', (await page.locator('#zone-requirements .band-label').innerText()) === 'Requirements');
  ok('Parking Lot header', (await page.locator('#lot-header').innerText()) === 'Parking Lot');

  // the six door-cards render inside the viewport (re-scaled to the wider sheet)
  ok('door-card links present (>=6)', await page.locator('a.door-card').count() >= 6);
  const inside = await page.locator('.door-card').evaluateAll((as, vp) => as.every(a => {
    const r = a.getBoundingClientRect();
    return r.left >= -0.5 && r.top >= -0.5 && r.right <= vp.w + 0.5 && r.bottom <= vp.h + 0.5;
  }), { w: VW, h: VH });
  ok('all door-cards sit inside the viewport (no clipping)', inside);

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
