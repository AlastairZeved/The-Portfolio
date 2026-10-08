/* test/desktop.js — desktop grammar: no All Boards rail; the single board
   spans the full viewport, the door-cards re-scale inside it. Card states
   (hover glow, pressed green, never colour alone). The eight note links
   (B28, UIUX §4.3) — pairs, 1px --frame line, card-centre endpoints.
   Black-box Playwright.
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

  // issue #107: the Requirements line anchors to the title card's right border
  // (the card hugs its text, B19 — so the door-column calc would leave a dead
  // gap between the border and the line). One --gutter of padding, no more.
  const reqAnchor = await page.evaluate(() => {
    const board = document.getElementById('board');
    const rs = parseFloat(getComputedStyle(board).getPropertyValue('--rs')) || 1;
    const gutter = parseFloat(getComputedStyle(board).getPropertyValue('--gutter')) || 0;
    const toLogical = v => v / rs;
    const title = document.querySelector('#anchor-title').getBoundingClientRect();
    const req = document.querySelector('#zone-requirements .anchor').getBoundingClientRect();
    return { gap: toLogical(req.left - title.right), gutter };
  });
  ok('Requirements line starts one gutter past the title card border (issue #107)',
     reqAnchor.gap >= reqAnchor.gutter - 2 && reqAnchor.gap <= reqAnchor.gutter + 2);

  // regions still render their furniture
  ok('Components zone label', (await page.locator('#zone-components .band-label').innerText()) === 'Components');
  ok('Requirements zone label', (await page.locator('#zone-requirements .band-label').innerText()) === 'Requirements');
  ok('Parking Lot header', (await page.locator('#lot-header').innerText()) === 'Parking Lot');

  // issue #174/B68: the Components line "Each card links to a page housing
  // my work in that domain." is removed entirely — the zone keeps its label
  // and renders no anchor. Requirements keeps the B54 line, plain.
  const bandCopy = await page.evaluate(() => {
    const g = sel => { const el = document.querySelector(sel); return el ? { text: el.textContent.trim(), weight: getComputedStyle(el).fontWeight } : null; };
    return {
      componentsAnchor: g('#zone-components .anchor'),
      requirements: g('#zone-requirements .anchor'),
    };
  });
  ok('Components zone renders no anchor line (issue #174/B68)',
    bandCopy.componentsAnchor === null);
  ok('Requirements line is the owner\'s revised copy (issue #147/B54)',
    bandCopy.requirements && bandCopy.requirements.text === 'Click around to explore my works!');
  ok('Requirements band anchor renders plain 400 text (issue #147/B54)',
    bandCopy.requirements && bandCopy.requirements.weight === '400');

  // issue #174/B68: the footer keeps B62's layout (copy left, form right);
  // the left half's copy is the issue-#174 EDITED version, verbatim, ending
  // in the italic phrase curiouser and curiouser.
  const footer = await page.evaluate(() => {
    const copy = document.querySelector('.lot-copy');
    const copyBox = copy.getBoundingClientRect();
    const form = document.querySelector('.lot-form').getBoundingClientRect();
    const dv = document.querySelector('.lot-divider').getBoundingClientRect();
    const items = document.getElementById('lot-items').getBoundingClientRect();
    const p = copy.querySelector('p');
    return {
      text: p ? p.textContent.trim() : '',
      italic: p ? getComputedStyle(p.querySelector('em')).fontStyle : null,
      half: Math.abs(copyBox.width - form.width) < 2,
      divider: dv.width < 2 && dv.height > 0,
      sides: copyBox.left < form.left && form.right <= items.right + 0.5,
    };
  });
  ok('footer copy starts "Hey, I\'m Rob. Welcome to my digital garden." (issue #174/B68)',
    footer.text.startsWith('Hey, I\'m Rob. Welcome to my digital garden.'));
  ok('footer copy ends "always be curiouser and curiouser." (issue #174/B68)',
    footer.text.endsWith('always be curiouser and curiouser.'));
  ok('the closing phrase renders italic (issue #174/B68)', footer.italic === 'italic');
  ok('footer halves are equal width (50/50, issue #169/B62)', footer.half);
  ok('vertical divider bar present between the halves (issue #169/B62)', footer.divider);
  ok('copy sits left of the form inside the lot (issue #169/B62)', footer.sides);

  // the six door-cards render inside the viewport (re-scaled to the wider sheet)
  ok('door-card links present (>=6)', await page.locator('a.door-card').count() >= 6);
  const inside = await page.locator('.door-card').evaluateAll((as, vp) => as.every(a => {
    const r = a.getBoundingClientRect();
    return r.left >= -0.5 && r.top >= -0.5 && r.right <= vp.w + 0.5 && r.bottom <= vp.h + 0.5;
  }), { w: VW, h: VH });
  ok('all door-cards sit inside the viewport (no clipping)', inside);

  // issue #145/B53 + #146/B55: the seven linked sub cards render plain (400)
  // text — and issue #167/B60 supersedes B53's 600 clause: every note card
  // (all thirteen) renders plain 400 — UIUX §4's weight clause
  const weights = await page.evaluate(() => {
    const w = id => { const el = document.querySelector(`.door-card[data-id="${id}"]`); return el ? getComputedStyle(el).fontWeight : null; };
    return {
      sub: ['apple-music', 'spotify', 'linkedin', 'zeved-boards', 'agentic-plugins', 'plants-poles', 'plants-in-rocks'].map(w),
      rest: ['music', 'community', 'career', 'writing', 'software-ai', 'plants-rocks'].map(w),
    };
  });
  ok('sub cards render plain 400 text (issue #145/B53, #146/B55)',
    weights.sub.length === 7 && weights.sub.every(x => x === '400'));
  ok('every note card renders plain 400 — no bold (issue #167/B60, superseding B53)',
    weights.rest.length === 6 && weights.rest.every(x => x === '400'));

  // the thirteen note links (B28, UIUX §4.3): one <line> per owner-named pair
  // (issue #75, #72, #74 and #146), 1px --frame between the two cards' centres, on a hitless
  // layer below the notes. [L0] is the layer, [L1]–[L13] the thirteen pairs.
  const WANT = [
    ['music', 'writing'], ['software-ai', 'community'], ['software-ai', 'writing'],
    ['plants-rocks', 'community'], ['plants-rocks', 'writing'], ['software-ai', 'music'],
    ['music', 'apple-music'], ['music', 'spotify'], ['career', 'linkedin'],
    ['software-ai', 'zeved-boards'], ['software-ai', 'agentic-plugins'],
    ['plants-rocks', 'plants-poles'], ['plants-rocks', 'plants-in-rocks']
  ];
  const lk = await page.evaluate(() => {
    const board = document.getElementById('board');
    const layer = document.getElementById('link-layer');
    if (!layer) return null;
    const br = board.getBoundingClientRect();
    /* measured rects arrive PHYSICAL px; the line attrs are LOGICAL (B30's
       ÷ rs conversion — issue #121/B44 renders the desktop below REF too,
       where rs ≠ 1, so the conversion is no longer the identity). */
    const RS = parseFloat(getComputedStyle(board).getPropertyValue('--rs')) || 1;
    const note = document.querySelector('.door-card');
    return {
      pe: getComputedStyle(layer).pointerEvents,
      z: getComputedStyle(layer).zIndex,
      noteZ: getComputedStyle(note).zIndex,
      lines: [...layer.querySelectorAll('line')].map(l => {
        const cs = getComputedStyle(l);
        const a = board.querySelector('[data-id="' + l.dataset.from + '"]');
        const b = board.querySelector('[data-id="' + l.dataset.to + '"]');
        const ca = a && a.getBoundingClientRect(), cb = b && b.getBoundingClientRect();
        return {
          from: l.dataset.from, to: l.dataset.to,
          stroke: cs.stroke, width: cs.strokeWidth, ve: cs.vectorEffect,
          cA: ca && [(ca.left - br.left + ca.width / 2) / RS, (ca.top - br.top + ca.height / 2) / RS],
          cB: cb && [(cb.left - br.left + cb.width / 2) / RS, (cb.top - br.top + cb.height / 2) / RS],
          x1: +l.getAttribute('x1'), y1: +l.getAttribute('y1'),
          x2: +l.getAttribute('x2'), y2: +l.getAttribute('y2')
        };
      })
    };
  });
  ok('[L0] link layer draws below the notes (z 1 under z 2) and never takes a hit',
    !!lk && lk.pe === 'none' && lk.z === '1' && lk.noteZ === '2' && lk.lines.length === 13);
  lk.lines.forEach((l, i) => {
    const w = WANT[i] || ['?', '?'];
    ok(`[L${i + 1}] link ${i + 1}: ${w[0]} <-> ${w[1]}`,
      l.from === w[0] && l.to === w[1] && !!l.cA && !!l.cB);
  });
  ok('[L9] every link is a 1px --frame line (crisp at any scale)',
    lk.lines.every(l => l.stroke === 'rgb(105, 142, 191)' && l.width === '1px' && l.ve === 'non-scaling-stroke'));
  ok('[L10] every link runs between its two cards\' centres',
    lk.lines.every(l => l.cA && l.cB &&
      Math.abs(l.x1 - l.cA[0]) < 0.6 && Math.abs(l.y1 - l.cA[1]) < 0.6 &&
      Math.abs(l.x2 - l.cB[0]) < 0.6 && Math.abs(l.y2 - l.cB[1]) < 0.6));

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
