/* test/movable_resizable.js — bug #58 regression: door-cards must be
   draggable, resizable via the corner handle, clamped to a 1/5-viewport max
   and a legible minimum, with each card's link still opening in a new tab.

   Since issue #87 (B30) the sheet renders through ONE uniform scale, so this
   scenario runs at two widths in one pass:
     desktop 1440x900 — scale = vh/REF_H, height-anchored (issue #121/B44:
     uncapped; issue #128/B46: height-anchored on landscape) < 1 on this
                        the drawing's own space is 2560/z × 1440/z, z = 1.3037,
                        so 1440×900 renders scaled, un-capped), and
     narrow  390x844  — scale < 1: every pointer reading must be converted into
                        the board's LOGICAL space. A dragged card tracks the
                        pointer 1:1 on screen (physical dx/dy unchanged), the
                        corner resize changes the card's own scale: floored at
                        TheBoards' 0.5 (B45) and CEILINGED at the issue
                        #142/B50 one-fifth-of-the-viewport bound — one uniform
                        scale, the card stops at the first axis reaching 1/5
                        of the viewport, superseding the old 2.0 MAX_SCALE.
                        The NOTE_MIN_W 132 floor is an unscaled logical size
                        that scales with the sheet.
   The style.left values are asserted in LOGICAL px directly, so a
   regression that reads clientX/clientY against card geometry again (the
   issue #87 review finding) fails here at 390x844.

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

const DRAG_X = 180, DRAG_Y = 150;   // physical px the pointer travels (6 moves of +30/+25)
const MIN_SCALE = 0.5;   // TheBoards' note-scale floor (B45); the ceiling is per-card (B50)

/* one scenario, run once per viewport; rs is the render scale the page reports */
async function runScenario(page, tag, width, height) {
  await page.setViewportSize({ width, height });
  await page.goto(URL, { waitUntil: 'networkidle' });

  const rs = await page.evaluate(() =>
    parseFloat(getComputedStyle(document.querySelector('#board')).getPropertyValue('--rs')) || 1);
  /* issue #121 (B44): the one scale is uncapped — the sheet renders the #112
     drawing at every viewport, down AND up. issue #128 (B46): the law is
     HEIGHT-ANCHORED on landscape (rs = vh/REF_H, TheBoards' desktop frame
     law) and min(vw/REF_W, vh/REF_H) in portrait; B44's single-min() clause
     is superseded for landscape viewports only. */
  const REF_W = 2560 / 1.3037, REF_H = 1440 / 1.3037;
  const expectRs = (width >= height) ? height / REF_H : Math.min(width / REF_W, height / REF_H);
  ok(`${tag}: render scale is height-anchored on landscape (vh/REF_H), min() in portrait (B46) = ${expectRs.toFixed(3)} (rs=${rs.toFixed(3)})`,
     Math.abs(rs - expectRs) < 1e-6);

  // --- issue #94: the native HTML5 anchor drag is suppressed on door-cards ---
  // A real press-and-move on an <a href> would otherwise fire the browser's
  // own `dragstart` and take the pointer flow away from the drag gesture — the
  // ghost wanders and the card never moves. Every .door-card and its
  // .resize-handle (a span inside the anchor) must report the drag suppressed.
  const unsuppressed = await page.evaluate(() => {
    const bad = [];
    let checked = 0;
    document.querySelectorAll('.door-card').forEach(card => {
      const targets = [card];
      const h = card.querySelector('.resize-handle');
      if (h) targets.push(h);
      targets.forEach(t => {
        checked++;
        const ev = new DragEvent('dragstart', { bubbles: true, cancelable: true });
        t.dispatchEvent(ev);
        if (!ev.defaultPrevented)
          bad.push(t.closest('.door-card').getAttribute('data-id') + (t === card ? '' : '.handle'));
      });
    });
    return { bad, checked };
  });
  ok(`${tag}: door-card dragstart is suppressed (${unsuppressed.bad.length === 0 ? `all ${unsuppressed.checked} card/handle targets` : 'NOT: ' + unsuppressed.bad.join(', ')})`,
     unsuppressed.bad.length === 0);

  // --- DRAG: the card must track the pointer 1:1 on screen ---
  const drag = await page.evaluate(({ dx, dy }) => {
    const board = document.querySelector('#board');
    const c = document.querySelector('a.door-card');
    const br = board.getBoundingClientRect();
    const cr = c.getBoundingClientRect();
    const sx = cr.left + cr.width / 2, sy = cr.top + cr.height / 2;
    const before = { x: cr.left, y: cr.top };
    const rs = parseFloat(getComputedStyle(board).getPropertyValue('--rs')) || 1;
    // where the card sits in the board's logical space when it is grabbed
    const start = { x: (cr.left - br.left) / rs, y: (cr.top - br.top) / rs };
    const send = (type, x, y) => c.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y }));
    send('pointerdown', sx, sy);
    for (let i = 1; i <= 6; i++) send('pointermove', sx + i * (dx / 6), sy + i * (dy / 6));
    send('pointerup', sx + dx, sy + dy);
    const after = c.getBoundingClientRect();
    return {
      dx: after.x - before.x, dy: after.y - before.y,
      styleLeft: parseFloat(c.style.left), styleTop: parseFloat(c.style.top),
      wantLeft: start.x + dx / rs, wantTop: start.y + dy / rs
    };
  }, { dx: DRAG_X, dy: DRAG_Y });
  ok(`${tag}: drag moves the card 1:1 with the pointer (moved ${drag.dx.toFixed(1)},${drag.dy.toFixed(1)})`,
     Math.abs(drag.dx - DRAG_X) < 3 && Math.abs(drag.dy - DRAG_Y) < 3);
  // the write lands in the board's LOGICAL space (physical px ÷ scale) — the
  // issue #87 defect wrote the physical delta straight into style.left
  ok(`${tag}: drag writes the logical offset (style.left ${drag.styleLeft.toFixed(1)}, want ${drag.wantLeft.toFixed(1)}; style.top ${drag.styleTop.toFixed(1)}, want ${drag.wantTop.toFixed(1)})`,
     Math.abs(drag.styleLeft - drag.wantLeft) < 1 && Math.abs(drag.styleTop - drag.wantTop) < 1);

  // --- RESIZE, B45 (issue #126): the corner gesture is TheBoards' scale-based
  // resize — the drag changes the card's own scale, floored at 0.5 (TheBoards
  // state.js MIN_SCALE) and ceilinged at the issue #142/B50 one-fifth-of-the-
  // viewport bound: one uniform scale, the card stops at the first axis that
  // reaches 0.2 × the board's logical dimensions (the board fills the
  // viewport, so board-logical == viewport). The old fixed MAX_SCALE 2.0 and
  // the old B21 1/5-viewport w/h ceiling are superseded by this per-card
  // ceiling; the 132x80 unscaled floor still stands.
  const grown = await page.evaluate(async () => {
    const board = document.querySelector('#board');
    const c = document.querySelector('a.door-card');
    const handle = c.querySelector('.resize-handle');
    const hb = handle.getBoundingClientRect();
    const sx = hb.right, sy = hb.bottom;
    const send = (type, x, y) => handle.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y }));
    send('pointerdown', sx, sy);
    for (let i = 1; i <= 20; i++) send('pointermove', sx + i * 40, sy + i * 30); // drag far
    send('pointerup', sx + 800, sy + 600);
    await new Promise(r => setTimeout(r, 200));   // let the 80ms transform transition settle
    const a = c.getBoundingClientRect();
    const rs = parseFloat(getComputedStyle(board).getPropertyValue('--rs')) || 1;
    const s = parseFloat(c.style.getPropertyValue('--card-scale'));
    // the expected ceiling, from the page's OWN values (B30: layout px are
    // logical px; offsetWidth/offsetHeight are unscaled under the transform)
    return { w: a.width, scale: s, unscaledW: c.offsetWidth, unscaledH: c.offsetHeight,
             boardW: board.offsetWidth, boardH: board.offsetHeight, rs };
  });
  const wantMax = Math.min(0.2 * grown.boardW / grown.unscaledW, 0.2 * grown.boardH / grown.unscaledH);
  ok(`${tag}: resize scale capped at the 1/5-viewport ceiling (issue #142/B50, got ${grown.scale}, want ${wantMax})`,
     Math.abs(grown.scale - wantMax) < 1e-9);
  ok(`${tag}: a ceiling-scaled card renders at unscaled × ceiling × rs (got ${grown.w.toFixed(1)}, want ${(grown.unscaledW * wantMax * grown.rs).toFixed(1)})`,
     Math.abs(grown.w - grown.unscaledW * wantMax * grown.rs) < 1.5);

  // --- RESIZE floor, B45: the scale floors at MIN_SCALE 0.5 — the card's
  // unscaled content width stays >= NOTE_MIN_W 132 (the CSS min-width), so
  // the smallest rendered card is 132 × 0.5 = 66 logical px wide. TheBoards'
  // resize is distance-to-origin based, so the shrink gesture pulls the
  // pointer TOWARD the card's top-left origin. Reload first so the gesture
  // starts from the authored scale 1 (the previous gesture left 2.0 behind;
  // the page holds no state across a reload, B7).
  await page.goto(URL, { waitUntil: 'networkidle' });
  const shrunk = await page.evaluate(async () => {
    const board = document.querySelector('#board');
    const c = document.querySelector('a.door-card');
    const handle = c.querySelector('.resize-handle');
    const hb = handle.getBoundingClientRect();
    const sx = hb.right, sy = hb.bottom;
    // the card's physical top-left origin (transform-origin: top left, scale 1)
    const cr = c.getBoundingClientRect();
    const ox = cr.left, oy = cr.top;
    const send = (type, x, y) => handle.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y }));
    send('pointerdown', sx, sy);
    // pull the pointer to 1/8 of the origin→grab distance: f = 0.125
    const tx = ox + 0.125 * (sx - ox), ty = oy + 0.125 * (sy - oy);
    for (let i = 1; i <= 6; i++) {
      const f = i / 6;
      send('pointermove', sx + (tx - sx) * f, sy + (ty - sy) * f);
    }
    send('pointerup', tx, ty);
    await new Promise(r => setTimeout(r, 200));   // let the 80ms transform transition settle
    const a = c.getBoundingClientRect();
    const rs = parseFloat(getComputedStyle(board).getPropertyValue('--rs')) || 1;
    const s = parseFloat(c.style.getPropertyValue('--card-scale'));
    return { w: a.width, scale: s, unscaledW: c.offsetWidth, rs };
  });
  ok(`${tag}: resize scale floored at MIN_SCALE 0.5 (got ${shrunk.scale})`, Math.abs(shrunk.scale - 0.5) < 1e-9);
  ok(`${tag}: the min card keeps its 132px NOTE_MIN_W unscaled width (got ${shrunk.unscaledW})`, shrunk.unscaledW >= 132 - 0.5);
  ok(`${tag}: min card renders at unscaled × 0.5 × rs (got ${shrunk.w.toFixed(1)}, want ${(shrunk.unscaledW * 0.5 * shrunk.rs).toFixed(1)})`,
     Math.abs(shrunk.w - shrunk.unscaledW * 0.5 * shrunk.rs) < 1.5);

  // --- issue #109: releasing a RESIZE must not navigate. The handle is a span
  // inside the <a>, so before the fix the release fired the anchor's own click
  // and opened the door mid-gesture.
  // REAL MOUSE, not synthetic pointer events: this suite dispatches synthetic
  // events for GEOMETRY (a real drag coalesces pointermove here), but click
  // semantics are only trustworthy through a real press-move-release — which is
  // exactly how the bug reproduces. Assert on the tab count, like the B3 check.
  await page.goto(URL, { waitUntil: 'networkidle' });
  // issue #112 (B43) authored the first door-card 310px wide. B45 removed
  // the w/h ceiling entirely (scale-based resize); B50 (issue #142) sets the
  // per-card 1/5-viewport ceiling in its place, so the proof still runs on
  // the Spotify door, far from the sheet edges.
  const resizeCard = page.locator('[data-id="spotify"]');
  const resizeBox = await resizeCard.boundingBox();
  const handleBox = await resizeCard.locator('.resize-handle').boundingBox();
  const pagesBeforeResize = (await page.context().pages()).length;
  await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
  await page.mouse.down();
  for (let i = 1; i <= 8; i++) await page.mouse.move(handleBox.x + i * 10, handleBox.y + i * 8);
  await page.mouse.up();
  await page.waitForTimeout(1500);
  const grownWidth = (await resizeCard.boundingBox()).width;
  ok(`${tag}: the resize itself still works (real mouse, ${resizeBox.width.toFixed(0)} -> ${grownWidth.toFixed(1)})`, grownWidth > resizeBox.width);
  const pagesResize = (await page.context().pages()).length;
  ok(`${tag}: releasing a resize opens nothing (issue #109)`, pagesResize === pagesBeforeResize);
  for (const p of pagesResize > pagesBeforeResize ? page.context().pages() : []) {
    if (p !== page) await p.close();
  }

  // --- B3 preserved: a TAP on the handle that never moved is still a click.
  // The 4px threshold is shared with the drag, so a tap on the corner must
  // still open the door rather than being eaten by the gesture guard.
  await page.goto(URL, { waitUntil: 'networkidle' });
  const tapTarget = page.locator('a.door-card').first().locator('.resize-handle');
  const pagesBeforeTap = (await page.context().pages()).length;
  await tapTarget.click();
  await page.waitForTimeout(1500);
  const pagesTap = page.context().pages();
  ok(`${tag}: a tap on the resize handle (no movement) still opens the door`, pagesTap.length === pagesBeforeTap + 1);
  for (const p of pagesTap) if (p !== page) await p.close();

  // --- Link still opens in a new tab on a plain click (B3) ---
  // Reload so no drag-suppression handler is pending (a real browser drag
  // emits a click that consumes the {once} guard; synthetic pointer events
  // do not, so a fresh page isolates the link behavior).
  await page.goto(URL, { waitUntil: 'networkidle' });
  const freshCard = page.locator('a.door-card').first();
  const beforePages = (await page.context().pages()).length;
  const bb = await freshCard.boundingBox();
  // B45: the cards are content-sized now, at mobile widths only a few
  // physical px tall — a +10px offset lands OUTSIDE the card. Click its
  // centre, like every other real-mouse proof in this suite.
  await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2);
  await page.waitForTimeout(1500);
  const pages = page.context().pages();
  ok(`${tag}: card link still opens in a new tab`, pages.length === beforePages + 1);
  for (const p of pages) if (p !== page) await p.close();   // leave the next pass clean
}

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage({ viewport: { width: 1440, height: 900 }, hasTouch: false });

  await runScenario(page, 'desktop', 1440, 900);   // rs = 1 — the desktop pin
  await runScenario(page, 'mobile', 390, 844);     // rs < 1 — the issue #87 scale

  if (OUT) await page.screenshot({ path: OUT });
  await browser.close();
  console.log(failures === 0 ? '\nMOVABLE_RESIZABLE PASS' : `\nMOVABLE_RESIZABLE FAIL: ${failures}`);
  process.exit(failures === 0 ? 0 : 1);
})().catch(e => { console.error('ERROR', e); process.exit(2); });
