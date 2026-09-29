/* test/movable_resizable.js — bug #58 regression: door-cards must be
   draggable, resizable via the corner handle, clamped to a 1/5-viewport max
   and a legible minimum, with each card's link still opening in a new tab.

   Dispatch synthetic pointer events ON the target element so the card's own
   event handlers run with the correct e.target (a Playwright real-mouse drag
   coalesces pointermove events in this headless environment; real browsers
   stream them continuously). Run: node test/movable_resizable.js */
const { chromium } = require('playwright');
const path = require('path');

const URL = process.env.PORTFOLIO_URL || 'http://localhost:8000/index.html';
const OUT = process.env.PORTFOLIO_OUT && path.resolve(process.env.PORTFOLIO_OUT);
let failures = 0;
const ok = (label, cond) => { if (!cond) failures++; console.log(`${cond ? 'PASS' : 'FAIL'} ${label}`); };

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage({ viewport: { width: 1440, height: 900 }, hasTouch: false });
  await page.goto(URL, { waitUntil: 'networkidle' });

  const card = page.locator('a.door-card').first();

  // --- DRAG: move the card a known distance ---
  const drag = await page.evaluate(() => {
    const c = document.querySelector('a.door-card');
    const cr = c.getBoundingClientRect();
    const sx = cr.left + cr.width / 2, sy = cr.top + cr.height / 2;
    const before = { x: cr.left, y: cr.top };
    const send = (type, x, y) => c.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y }));
    send('pointerdown', sx, sy);
    for (let i = 1; i <= 6; i++) send('pointermove', sx + i * 30, sy + i * 25);
    send('pointerup', sx + 180, sy + 150);
    const after = c.getBoundingClientRect();
    return { dx: after.x - before.x, dy: after.y - before.y, expectDx: 180, expectDy: 150 };
  });
  ok(`drag moves card 1:1 (moved ${drag.dx},${drag.dy})`,
     Math.abs(drag.dx - drag.expectDx) < 3 && Math.abs(drag.dy - drag.expectDy) < 3);

  // --- RESIZE max: grow the card past the 1/5 viewport cap ---
  const grown = await page.evaluate(() => {
    const c = document.querySelector('a.door-card');
    const handle = c.querySelector('.resize-handle');
    const hb = handle.getBoundingClientRect();
    const sx = hb.right, sy = hb.bottom;
    const send = (type, x, y) => handle.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y }));
    send('pointerdown', sx, sy);
    for (let i = 1; i <= 20; i++) send('pointermove', sx + i * 40, sy + i * 30); // drag far
    send('pointerup', sx + 800, sy + 600);
    const a = c.getBoundingClientRect();
    return { w: a.width, h: a.height, vw: window.innerWidth, vh: window.innerHeight };
  });
  ok(`resize capped at 1/5 viewport width (got ${grown.w.toFixed(0)}, cap ${(grown.vw/5).toFixed(0)})`,
     grown.w <= grown.vw / 5 + 1);
  ok(`resize capped at 1/5 viewport height (got ${grown.h.toFixed(0)}, cap ${(grown.vh/5).toFixed(0)})`,
     grown.h <= grown.vh / 5 + 1);

  // --- RESIZE min: shrink the card below the legible floor ---
  const shrunk = await page.evaluate(() => {
    const c = document.querySelector('a.door-card');
    const handle = c.querySelector('.resize-handle');
    const hb = handle.getBoundingClientRect();
    const sx = hb.right, sy = hb.bottom;
    const send = (type, x, y) => handle.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y }));
    send('pointerdown', sx, sy);
    for (let i = 1; i <= 20; i++) send('pointermove', sx - i * 40, sy - i * 40); // drag far up-left
    send('pointerup', sx - 800, sy - 800);
    const a = c.getBoundingClientRect();
    return { w: a.width, h: a.height };
  });
  ok(`min width stays legible (got ${shrunk.w.toFixed(0)}, want >= 132)`, shrunk.w >= 132);
  ok(`min height stays legible (got ${shrunk.h.toFixed(0)}, want >= 80)`, shrunk.h >= 80);

  // --- Link still opens in a new tab on a plain click (B3) ---
  // Reload so no drag-suppression handler is pending (a real browser drag
  // emits a click that consumes the {once} guard; synthetic pointer events
  // do not, so a fresh page isolates the link behavior).
  await page.goto(URL, { waitUntil: 'networkidle' });
  const freshCard = page.locator('a.door-card').first();
  const beforePages = (await context.pages()).length;
  const bb = await freshCard.boundingBox();
  await page.mouse.click(bb.x + 10, bb.y + 10);
  await page.waitForTimeout(1500);
  const afterPages = (await context.pages()).length;
  ok('card link still opens in a new tab', afterPages === beforePages + 1);

  if (OUT) await page.screenshot({ path: OUT });
  await browser.close();
  console.log(failures === 0 ? '\nMOVABLE_RESIZABLE PASS' : `\nMOVABLE_RESIZABLE FAIL: ${failures}`);
  process.exit(failures === 0 ? 0 : 1);
})().catch(e => { console.error('ERROR', e); process.exit(2); });