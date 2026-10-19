/* test/desktop.js — desktop grammar: no All Boards rail; the single board
   spans the full viewport, the door-cards re-scale inside it. Card states
   (hover glow, pressed green, never colour alone). The sixteen note links
   (B28, UIUX §4.3) — pairs, 1px --frame line, card-centre endpoints.
   Black-box Playwright.
   Run: node test/desktop.js   (PORTFOLIO_BASE_URL default http://localhost:8000/) */

const { chromium } = require('playwright');
const path = require('path');

const BASE_URL = process.env.PORTFOLIO_BASE_URL || 'http://localhost:8000/';
const URL = new globalThis.URL('index.html', BASE_URL.endsWith('/') ? BASE_URL : BASE_URL + '/').href;
const OUT = process.env.PORTFOLIO_OUT && path.resolve(process.env.PORTFOLIO_OUT);
const VW = 1440, VH = 900;
let failures = 0;
const ok = (label, cond, details = '') => { if (!cond) failures++; console.log(`${cond ? 'PASS' : 'FAIL'} ${label}${!cond && details ? ' :: ' + details : ''}`); };

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

  // issue #107 (B39): the Requirements line starts one --gutter past the title
  // card's rendered right border (the card hugs its text, B19). Since issue
  // #309 (B114) the band row places it; nothing measures the card. One
  // --gutter of padding, no more.
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
  ok('contact-form note includes the required indicator and reCAPTCHA copy',
    (await page.locator('#form-note').innerText()) === '✱ required — protected by reCAPTCHA');

  // the Components zone renders its two-line copy (issue #208/B85); the
  // Requirements anchor renders its copy (issue #183/B71).
  const bandCopy = await page.evaluate(() => {
    const g = sel => { const el = document.querySelector(sel); return el ? { text: el.textContent.trim(), weight: getComputedStyle(el).fontWeight } : null; };
    return {
      componentsAnchor: g('#zone-components .anchor'),
      requirements: g('#zone-requirements .anchor'),
    };
  });
  ok('Components zone renders the issue-#208 two-line copy (issue #208/B85)',
    bandCopy.componentsAnchor !== null &&
    bandCopy.componentsAnchor.text === 'Under Construction: Career content, Plants in Rocks content.\nPlanned future work: Add landing pages');
  ok('Components zone renders its label and the two-line copy only (issue #208/B85)',
    (await page.locator('#zone-components').textContent()).replace(/\s+/g, ' ').trim() ===
    'Components Under Construction: Career content, Plants in Rocks content. Planned future work: Add landing pages');
  ok('Requirements line is the issue-#183 copy (issue #183/B71)',
    bandCopy.requirements &&
    bandCopy.requirements.text === 'Click the note cards to launch my various pages and work across the web.');
  ok('Requirements band anchor renders plain 400 text (issue #147/B54)',
    bandCopy.requirements && bandCopy.requirements.weight === '400');

  // issue #209/B86: the footer keeps B62's layout (copy left, form right);
  // the left half's copy is the issue-#209 text, verbatim — two lines (the
  // issue's line break) with no gap between them — line 1 replaced, line 2
  // kept, the closing phrase renders italic (spelled "curiouser" per the
  // owner's correction), and the copy scales to the 16.57px band-anchor
  // rung (weight 400, no bold; footer bar size and height unchanged).
  const LOT_COPY = "Welcome to Rob's digital garden. All it takes to flex one's curiosity is to ask a question, then keep asking questions and always strive to be curiouser and curiouser.";
  const footer = await page.evaluate(() => {
    const copy = document.querySelector('.lot-copy');
    const copyBox = copy.getBoundingClientRect();
    const form = document.querySelector('.lot-form').getBoundingClientRect();
    const dv = document.querySelector('.lot-divider').getBoundingClientRect();
    const items = document.getElementById('lot-items').getBoundingClientRect();
    const ps = [...copy.querySelectorAll('p')];
    const em = copy.querySelector('p em');
    const margins = ps.map(el => getComputedStyle(el).marginTop + '/' + getComputedStyle(el).marginBottom);
    return {
      text: ps.length ? ps.map(p => p.textContent).join(' ').replace(/\s+/g, ' ').trim() : null,
      paragraphs: ps.length,
      em,
      italic: em ? getComputedStyle(em).fontStyle : null,
      margins,
      copyFs: getComputedStyle(copy).fontSize,
      half: Math.abs(copyBox.width - form.width) < 2,
      divider: dv.width < 2 && dv.height > 0,
      sides: copyBox.left < form.left && form.right <= items.right + 0.5,
    };
  });
  ok('footer copy matches the issue-#209 copy of record verbatim (issue #209/B86)',
    footer.text !== null && footer.text === LOT_COPY);
  ok('footer copy renders two lines (issue #209/B86)', footer.paragraphs === 2);
  ok('the lines carry no gap between them (issue #209/B86)',
    footer.margins.every(m => m === '0px/0px'));
  ok('the italic phrase is present (issue #209/B86)', footer.em !== null);
  ok('the closing phrase renders italic (issue #209/B86)', footer.italic === 'italic');
  ok('the copy renders at the 16.57px band-anchor rung (issue #209/B86)', footer.copyFs === '16.57px');
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

  // issue #145/B53 + #146/B55: the linked sub cards render plain 400 text;
  // every note card (all fifteen) renders plain 400 (issue #167/B60, UIUX §4).
  const weights = await page.evaluate(() => {
    const w = id => { const el = document.querySelector(`.door-card[data-id="${id}"]`); return el ? getComputedStyle(el).fontWeight : null; };
    return {
      sub: ['apple-music', 'spotify', 'linkedin', 'zeved-boards', 'agentic-plugins', 'plants-poles', 'plants-in-rocks', 'philly-plant-dads'].map(w),
      rest: ['music', 'community', 'career', 'writing', 'software-ai', 'plants-rocks', 'wood'].map(w),
    };
  });
  ok('sub cards render plain 400 text (issue #145/B53, #146/B55, #196/B80)',
    weights.sub.length === 8 && weights.sub.every(x => x === '400'));
  ok('every note card renders plain 400 — no bold (issue #167/B60, superseding B53)',
    weights.rest.length === 7 && weights.rest.every(x => x === '400'));

  // the sixteen note links (B28, B32, B34, UIUX §4.3): one <line> per owner-named pair
  // (issue #75, #72, #74, #146, #196 and #313/B116), 1px --frame between the two cards' centres, on a hitless
  // layer below the notes. [L0] is the layer, [L1]–[L16] the sixteen pairs,
  // [L17]–[L20] the layer-wide line checks.
  const WANT = [
    ['music', 'writing'], ['software-ai', 'community'], ['software-ai', 'writing'],
    ['plants-rocks', 'community'], ['plants-rocks', 'writing'], ['software-ai', 'music'],
    ['music', 'apple-music'], ['music', 'spotify'], ['career', 'linkedin'],
    ['software-ai', 'zeved-boards'], ['software-ai', 'agentic-plugins'],
    ['plants-rocks', 'plants-poles'], ['plants-rocks', 'plants-in-rocks'],
    ['plants-rocks', 'philly-plant-dads'],
    ['wood', 'community'], ['wood', 'plants-rocks']
  ];
  const lk = await page.evaluate(() => {
    const board = document.getElementById('board');
    const layer = document.getElementById('link-layer');
    if (!layer) return null;
    const br = board.getBoundingClientRect();
    /* rs ≠ 1 at desktop sizes too (B44): measured rects are physical px;
       line attrs are logical px, so divide by rs. */
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
    !!lk && lk.pe === 'none' && lk.z === '1' && lk.noteZ === '2' && lk.lines.length === 16);
  lk.lines.forEach((l, i) => {
    const w = WANT[i] || ['?', '?'];
    ok(`[L${i + 1}] link ${i + 1}: ${w[0]} <-> ${w[1]}`,
      l.from === w[0] && l.to === w[1] && !!l.cA && !!l.cB);
  });
  ok('[L17] every link is a 1px --frame line (crisp at any scale)',
    lk.lines.every(l => l.stroke === 'rgb(105, 142, 191)' && l.width === '1px' && l.ve === 'non-scaling-stroke'));
  ok('[L18] every link runs between its two cards\' centres',
    lk.lines.every(l => l.cA && l.cB &&
      Math.abs(l.x1 - l.cA[0]) < 0.6 && Math.abs(l.y1 - l.cA[1]) < 0.6 &&
      Math.abs(l.x2 - l.cB[0]) < 0.6 && Math.abs(l.y2 - l.cB[1]) < 0.6));

  // issue #275: assert resize writes every card's new max-width before
  // drawLinks reads any card geometry; the order matters when a cap rewraps.
  await page.evaluate(() => {
    const events = { capWrites: 0, firstLineWriteAfter: null };
    const setProperty = CSSStyleDeclaration.prototype.setProperty;
    const setAttribute = Element.prototype.setAttribute;
    CSSStyleDeclaration.prototype.setProperty = function (name, ...args) {
      if (name === '--card-max-w') events.capWrites++;
      return setProperty.call(this, name, ...args);
    };
    Element.prototype.setAttribute = function (name, ...args) {
      if (this.tagName === 'line' && name === 'x1' && events.firstLineWriteAfter === null) {
        events.firstLineWriteAfter = events.capWrites;
      }
      return setAttribute.call(this, name, ...args);
    };
    window.__issue275ResizeEvents = events;
  });
  await page.setViewportSize({ width: 1024, height: VH });
  await page.waitForTimeout(100);
  const resizeEvents = await page.evaluate(() => window.__issue275ResizeEvents);
  ok('[L19] resize lays out every card before link geometry is read',
    resizeEvents.capWrites >= 6 && resizeEvents.firstLineWriteAfter === resizeEvents.capWrites);
  const resizedLinks = await page.evaluate(() => {
    const board = document.getElementById('board');
    const br = board.getBoundingClientRect();
    const rs = parseFloat(getComputedStyle(board).getPropertyValue('--rs')) || 1;
    return [...document.querySelectorAll('#link-layer line')].map(l => {
      const a = board.querySelector('[data-id="' + l.dataset.from + '"]').getBoundingClientRect();
      const b = board.querySelector('[data-id="' + l.dataset.to + '"]').getBoundingClientRect();
      return [
        +l.getAttribute('x1'), +l.getAttribute('y1'),
        (a.left - br.left + a.width / 2) / rs, (a.top - br.top + a.height / 2) / rs,
        +l.getAttribute('x2'), +l.getAttribute('y2'),
        (b.left - br.left + b.width / 2) / rs, (b.top - br.top + b.height / 2) / rs
      ];
    });
  });
  ok('[L20] resize re-lays out cards before redrawing all link endpoints',
    resizedLinks.length === 16 && resizedLinks.every(p =>
      Math.abs(p[0] - p[2]) < 0.6 && Math.abs(p[1] - p[3]) < 0.6 &&
      Math.abs(p[4] - p[6]) < 0.6 && Math.abs(p[5] - p[7]) < 0.6));

  // card states (B14) on the first door-card
  const first = page.locator('a.door-card').first();
  await first.hover();
  await page.waitForTimeout(250);
  const hoverShadow = await first.evaluate(el => getComputedStyle(el).boxShadow);
  ok('hover shows a glow (box-shadow present)', hoverShadow !== 'none' && hoverShadow.includes('rgb'));

  // pressed: 1px inset transforms + green glow (Idea #b9d2b2 = rgb(185, 210, 178))
  await page.mouse.down();
  await page.waitForTimeout(250);   // allow the active green glow to settle
  const pressedTransform = await first.evaluate(el => getComputedStyle(el).transform);
  ok('active presses 1px inset', pressedTransform.includes('1px') || (pressedTransform !== 'none' && !pressedTransform.includes('0, 0, 0, 1)')));
  const pressedShadow = await first.evaluate(el => getComputedStyle(el).boxShadow);
  ok('active state uses the Idea green glow', /rgba?\(185, 210, 178(?:,|\))/.test(pressedShadow), pressedShadow);
  await page.mouse.up();

  // focus ring for keyboard (never colour alone)
  await page.keyboard.press('Tab');
  await page.waitForTimeout(80);
  const focus = await page.evaluate(() => {
    const el = document.activeElement;
    const style = getComputedStyle(el);
    return { isDoor: el.matches('a.door-card'), outlineStyle: style.outlineStyle, outlineWidth: parseFloat(style.outlineWidth) };
  });
  ok('Tab focuses a door-card with a visible focus ring',
    focus.isDoor && focus.outlineStyle !== 'none' && focus.outlineWidth > 0,
    JSON.stringify(focus));

  // no service worker registrations (B13)
  ok('no service worker', await page.evaluate(async () => {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker || typeof navigator.serviceWorker.getRegistrations !== 'function') return true;
    return (await navigator.serviceWorker.getRegistrations()).length === 0;
  }));

  if (OUT) await page.screenshot({ path: path.join(OUT, 'desktop.png') });
  await browser.close();
  console.log(failures === 0 ? '\nDESKTOP PASS' : `\nDESKTOP FAIL: ${failures}`);
  process.exit(failures === 0 ? 0 : 1);
})().catch(e => { console.error('ERROR', e); process.exit(2); });
