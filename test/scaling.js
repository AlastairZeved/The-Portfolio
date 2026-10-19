/* test/scaling.js — issue #121 (B44): the board scales to ANY viewport size.
   Also pins the B46 band / title-card / lot laws from UIUX §3.2 literals
   (issue #221, B89: folded in from the removed cross-repo parity_boards.js).
   The scene renders the owner's issue #112 drawing (B43 geometry in the
   drawing's own reference space, 2560/z × 1440/z, z = 1.3037) through one
   uniform scale, down AND up. At every desktop viewport the render must show:
   no overlapping note cards, no obscured link lines, the sheet filling the
   viewport edge to edge, and every card at its authored size × the scale.
   Mobile viewports are out of scope (#121); two narrow widths are included
   only to prove the B30 down-scale still holds. */

const { chromium } = require('playwright');

const BASE_URL = process.env.PORTFOLIO_BASE_URL || 'http://localhost:8000/';
const URL = new globalThis.URL('index.html', BASE_URL.endsWith('/') ? BASE_URL : BASE_URL + '/').href;
const Z = 1.3037;
const REF_W = 2560 / Z, REF_H = 1440 / Z;

const VIEWPORTS = [
  [1080, 600], [1280, 700], [1366, 768], [1440, 750], [1440, 900], [1600, 850],
  [1920, 1080], [1920, 700], [1920, 640], [2560, 1000], [2560, 620], [2560, 1440],
  [800, 800], [640, 640], [1080, 1080],   // square-ish landscape: B46's width floor binds here (issue #128 edge-probe finding) and below ~1.66:1 generally, 16:10 included (B117)
  [768, 900], [390, 844],
];

let pass = 0, fail = 0;
function ok(label, cond, details = '') {
  if (cond) { pass++; console.log('PASS ' + label); }
  else { fail++; console.log('FAIL ' + label + (details ? ' :: ' + details : '')); }
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const [w, h] of VIEWPORTS) {
    const tag = `${w}x${h}`;
    await page.setViewportSize({ width: w, height: h });
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(250);

    const r = await page.evaluate(async ({ REF_W, REF_H }) => {
      const board = document.getElementById('board');
      const br = board.getBoundingClientRect();
      const rs = parseFloat(getComputedStyle(board).getPropertyValue('--rs')) || 1;
      const cards = [...document.querySelectorAll('.door-card')].map(c => {
        const b = c.getBoundingClientRect();
        const s = parseFloat(c.style.getPropertyValue('--card-scale')) || 1;
        return { id: c.getAttribute('data-id'), l: b.left, t: b.top, r: b.right, b: b.bottom, w: b.width, h: b.height,
          s, lp: parseFloat(c.style.left) || 0, tp: parseFloat(c.style.top) || 0,
          unscaledW: c.offsetWidth, unscaledH: c.offsetHeight };
      });
      const overlaps = [];
      for (let i = 0; i < cards.length; i++)
        for (let j = i + 1; j < cards.length; j++) {
          const a = cards[i], b = cards[j];
          if (Math.min(a.r, b.r) - Math.max(a.l, b.l) > 0 &&
              Math.min(a.b, b.b) - Math.max(a.t, b.t) > 0)
            overlaps.push(a.id + '×' + b.id);
        }
      // every link endpoint on its card's centre (logical space, B30 ÷ rs)
      const layer = document.getElementById('link-layer');
      const lines = [...layer.querySelectorAll('line')].map(ln => {
        const a = board.querySelector('[data-id="' + ln.dataset.from + '"]');
        const b = board.querySelector('[data-id="' + ln.dataset.to + '"]');
        const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
        const cA = [(ra.left - br.left + ra.width / 2) / rs, (ra.top - br.top + ra.height / 2) / rs];
        const cB = [(rb.left - br.left + rb.width / 2) / rs, (rb.top - br.top + rb.height / 2) / rs];
        const d = Math.max(
          Math.abs(+ln.getAttribute('x1') - cA[0]), Math.abs(+ln.getAttribute('y1') - cA[1]),
          Math.abs(+ln.getAttribute('x2') - cB[0]), Math.abs(+ln.getAttribute('y2') - cB[1]));
        return { from: ln.dataset.from, to: ln.dataset.to, d };
      });
      // no link line runs behind a card that is not its own endpoint — bar
      // B78's ONE owner-ruled exception (issue #189): the owner's drawing
      // runs Software & AI ↔ Community behind Career exactly as the owner's
      // own screenshot shows it, and the owner ruled that arrangement stands
      // ("Execute the drawing exactly as-is"), superseding the
      // no-obscured-line expectation of issue #121 (B44) for this pair.
      // Keyed direction-agnostically on the sorted pair.
      const obscured = [];
      const OWNER_HIDDEN = { 'community-software-ai': 'career' };
      for (const lnEl of layer.querySelectorAll('line')) {
        const x1 = +lnEl.getAttribute('x1'), y1 = +lnEl.getAttribute('y1');
        const x2 = +lnEl.getAttribute('x2'), y2 = +lnEl.getAttribute('y2');
        const pairKey = [lnEl.dataset.from, lnEl.dataset.to].sort().join('-');
        for (const c of cards) {
          if (c.id === lnEl.dataset.from || c.id === lnEl.dataset.to) continue;
          if (OWNER_HIDDEN[pairKey] === c.id) continue;   // B78
          for (let k = 1; k < 20; k++) {
            const f = k / 20;
            const x = (x1 + (x2 - x1) * f) * rs + br.left;
            const y = (y1 + (y2 - y1) * f) * rs + br.top;
            if (x > c.l && x < c.r && y > c.t && y < c.b) { obscured.push(lnEl.dataset.from + '-' + lnEl.dataset.to + ' by ' + c.id); break; }
          }
        }
      }
      // B45 (issue #126): cards are content-sized — physical box = the unscaled
      // layout box × the card's own scale × rs (uniform, no reflow), floored at
      // TheBoards' NOTE_MIN_W 132 logical px (× the card's scale, × rs).
      const dims = cards.map(c => {
        return { id: c.id, s: c.s, rs,
                 devW: Math.abs(c.w - c.unscaledW * c.s * rs),
                 devH: Math.abs(c.h - c.unscaledH * c.s * rs),
                 logicalW: c.unscaledW * c.s };
      });
      // issue #128 (B46): the band, the title card and the Parking Lot size by
      // TheBoards' own laws — band literals RESCALED ×1.10455 (k = 1104.55/1000,
      // TheBoards' 1000-tall frame mapped into the drawing's 1104.55-tall space).
      // issue #308 (B113): the page no longer measures them — CSS lays the band
      // out and the lot's height is B20's 180px — so the three values this used
      // to read off custom properties (--rule-y, --lot-h, the title card's
      // min-height) are read off the RENDERED boxes instead, in logical px. The
      // laws asserted below are unchanged; only where the number comes from moved.
      const k = 1104.55 / 1000;
      const bandRuleY = () => {
        let lines = 2;
        for (const n of document.querySelectorAll('.band-zone .anchor')) {
          // the anchor carries --band-gap as padding-bottom, so subtract it to
          // get the line boxes the band's height is counted from.
          const pad = parseFloat(getComputedStyle(n).paddingBottom) || 0;
          lines = Math.max(lines, Math.round((n.scrollHeight - pad) / (19.5 * k)));
        }
        return 15.46 + lines * 21.54 + 8.84;
      };
      const ruleY = document.getElementById('band').getBoundingClientRect().height / rs;
      const bandTop = getComputedStyle(document.getElementById('band-fill')).getPropertyValue('--band-top');
      const card = document.getElementById('anchor-title');
      const cardMinH = card.getBoundingClientRect().height / rs;      // logical px: the sheet is scaled by rs
      const cardPad = getComputedStyle(card).padding;
      const lotH = () => {
        const items = document.getElementById('lot-items');
        let sum = 0;
        for (const n of items.querySelectorAll(':scope > *')) sum += n.offsetHeight;
        // the rescaled two-row shelf 122 × k = 134.76 floors the lot (B46);
        // the 34px LOT_HEAD chrome is unscaled; cap half the logical sheet.
        return Math.min(Math.max(122 * k, 34 + Math.round(sum)),
                        Math.ceil(board.offsetHeight * 0.5));
      };
      const lotHval = document.getElementById('lot').getBoundingClientRect().height / rs;
      const lotItemsClip = getComputedStyle(document.getElementById('lot-items')).overflow;
      let lwMin = Math.max(...[...document.querySelectorAll('.door-card')].map(c => {
        const left = parseFloat(c.style.left) || 0;
        if (left >= 100) return 0;
        const cr = c.getBoundingClientRect();
        let rightLogical = cr.width / rs;
        for (const child of c.querySelectorAll('*')) {
          const over = (child.getBoundingClientRect().right - cr.left) / rs;
          if (over > rightLogical) rightLogical = over;
        }
        return rightLogical / (1 - left / 100);
      }));
      /* B52 (issue #138): the drawing rest scales widen the cards, so at
         square-ish landscape aspects the width floor also carries the
         pairwise gap term (B44's no-overlap law): for every pair whose vertical ranges
         overlap, the left card's right edge AND scaled resize-handle overhang
         must clear the right card's left edge — lw >= (aW + 4 × aScale) /
         (bLeft% − aLeft%). The logical height (vh/rs) grows with the floor,
         spreading the % tops, so the page re-measures until stable; re-derive
         the same way here. Issue #253 pins the handle's child scale. */
      const geo = cards.map(c => ({
        lp: c.lp, tp: c.tp, s: c.s,
        w: c.unscaledW * c.s, h: c.unscaledH * c.s
      }));
      for (let pass = 0; pass < 60; pass++) {
        const lh = innerHeight / (innerWidth >= innerHeight
                                        ? Math.min(innerHeight / REF_H, innerWidth / lwMin)
                                        : Math.min(innerWidth / REF_W, innerHeight / REF_H));
        let need = lwMin;
        for (let i = 0; i < geo.length; i++)
          for (let j = i + 1; j < geo.length; j++) {
            let A = geo[i], B = geo[j];
            if (A.lp > B.lp) { const T = A; A = B; B = T; }
            const dLeft = (B.lp - A.lp) / 100;
            if (dLeft <= 0) continue;
            const aTop = (A.tp / 100) * lh, bTop = (B.tp / 100) * lh;
            if (aTop + A.h <= bTop || bTop + B.h <= aTop) continue;
            need = Math.max(need, (A.w + 4 * A.s) / dLeft);
          }
        if (need <= lwMin + 0.5) break;
        lwMin = need;
      }
      const rulePx = document.getElementById('band-rule').getBoundingClientRect().top - br.top;
      const labelFont = getComputedStyle(document.querySelector('.band-label')).fontSize;
      /* issue #326 (B118): every band label's weight, so UIUX §3.2 and the
         render cannot drift apart again. */
      const labelWeights = [...document.querySelectorAll('.band-label')].map(l => getComputedStyle(l).fontWeight);
      /* issue #309 (B114): the band is a flex row — Components, the title
         card, Requirements — so the Requirements zone's left edge is the
         card's rendered right border plus one --gutter (issue #107, B39) and
         the card is centred by the equal zones. Read both off the rendered
         boxes in logical px; nothing declares them. */
      const cardRect = card.getBoundingClientRect();
      const reqRect = document.querySelector('#zone-requirements .anchor').getBoundingClientRect();
      const gutter = parseFloat(getComputedStyle(board).getPropertyValue('--gutter')) || 0;
      const reqGap = (reqRect.left - cardRect.right) / rs;
      const cardCentreDev = ((cardRect.left + cardRect.right) / 2 - (br.left + br.width / 2)) / rs;
      // The Components zone keeps its door-column edge, --card-l − --card-gap
      // (B113, kept by B115), so its tab never moves with the title: re-derive
      // the edge from the :root tokens on the logical sheet width (B30 — the
      // board's layout px are the logical px) and read the rendered box.
      const cardGap = parseFloat(getComputedStyle(board).getPropertyValue('--card-gap')) || 0;
      const lw = board.offsetWidth;
      const cardWTok = Math.min(0.377778 * lw, lw - 2 * (gutter + 100 + cardGap));
      const compRightExpected = (lw - cardWTok) / 2 - cardGap;
      const compRight = (document.getElementById('zone-components').getBoundingClientRect().right - br.left) / rs;
      return {
        rs, lwMin, boardRect: [br.left, br.top, br.width, br.height],
        vw: innerWidth, vh: innerHeight,
        scrollW: document.documentElement.scrollWidth, scrollH: document.documentElement.scrollHeight,
        overlaps, obscured: obscured,
        lineMaxDev: Math.max(...lines.map(l => l.d)),
        dims,
        band: { rulePx, labelFont, labelWeights, expectedRuleY: bandRuleY(), ruleY, bandTop, cardMinH, cardPad, lotH: lotH(), lotHval, lotItemsClip,
                cardBottomLogical: (card.getBoundingClientRect().bottom - br.top) / rs,
                reqGap, gutter, cardCentreDev, compRight, compRightExpected }
      };
    }, { REF_W, REF_H });

    ok(`${tag}: the sheet fills the viewport edge to edge, no overflow`,
      r.boardRect[2] + 0.5 >= r.vw && r.boardRect[3] + 0.5 >= r.vh &&
      r.scrollW <= r.vw + 1 && r.scrollH <= r.vh + 1);
    ok(`${tag}: the scale is height-anchored on landscape (rs = min(vh/REF_H, vw/lw_min)), min() in portrait (B46, issue #128)`,
      Math.abs(r.rs - (r.vw >= r.vh ? Math.min(r.vh / REF_H, r.vw / r.lwMin)
                                    : Math.min(r.vw / REF_W, r.vh / REF_H))) < 1e-6,
      JSON.stringify({ rs: r.rs, lwMin: r.lwMin, viewport: [r.vw, r.vh] }));
    ok(`${tag}: no overlapping note cards`, r.overlaps.length === 0, JSON.stringify(r.overlaps));
    ok(`${tag}: no link line obscured behind a card (bar B78's owner-ruled pair)`, r.obscured.length === 0);
    ok(`${tag}: every link endpoint on its card centre (≤0.6 logical px)`, r.lineMaxDev < 0.6);
    ok(`${tag}: cards render content-sized × own scale × rs (uniform, no reflow)`,
      r.dims.every(d => d.devW < 1 && d.devH < 1));
    ok(`${tag}: every card floored at NOTE_MIN_W 132 logical px (× own scale)`,
      r.dims.every(d => d.logicalW >= 132 * d.s - 0.5));
    // issue #128 (B46): the band / title card / lot follow TheBoards' laws
    /* issue #308 (B113): ruleY is now the band's RENDERED box, not a declared
       custom property, so it carries Chromium's 1/64px layout unit — 67.38
       renders as 67.375. 0.01 is the slack that allows and nothing more. */
    ok(`${tag}: band rule-y = 15.46 + max(2, lines) × 21.54 + 8.84 (TheBoards' \`B47\`/\`B76\` × 1.10455)`,
      Math.abs(r.band.ruleY - r.band.expectedRuleY) < 0.01, JSON.stringify(r.band));
    ok(`${tag}: band-top is 15.46 = 14 × 1.10455 (TheBoards state.js × k)`, r.band.bandTop.trim() === '15.46px');
    ok(`${tag}: title card rendered height = rule-y + 29 (B31 STANDS — B46, owner ruling 3; B114: no min-height, the row stretches it)`,
      Math.abs(r.band.cardMinH - (r.band.ruleY + 29)) < 0.5);
    ok(`${tag}: title card box = B31's (band-top+8) 16px 16px padding, occluding the rule`,
      r.band.cardPad === `${23.46.toFixed(2)}px 16px 16px` && r.band.cardBottomLogical >= r.band.ruleY + 28);
    // issue #309 (B114): the row places the zones; nothing measures the card.
    ok(`${tag}: Requirements line starts one --gutter past the title card's rendered right border (issue #107, B39)`,
      Math.abs(r.band.reqGap - r.band.gutter) < 0.5, `gap ${r.band.reqGap} vs gutter ${r.band.gutter}`);
    ok(`${tag}: title card centred on the sheet by the row's balance item (B31, B115)`,
      Math.abs(r.band.cardCentreDev) < 0.5, `centre off by ${r.band.cardCentreDev} logical px`);
    ok(`${tag}: Components zone keeps its door-column edge, right = --card-l − --card-gap (B113 kept by B115)`,
      Math.abs(r.band.compRight - r.band.compRightExpected) < 0.5, `right ${r.band.compRight} vs ${r.band.compRightExpected}`);
    ok(`${tag}: lot-h = min(max(134.76 shelf, 34 + Σ rows), ⌈half the sheet⌉) (TheBoards' \`B73\` × k)`,
      Math.abs(r.band.lotHval - r.band.lotH) < 0.5, `lot-h ${r.band.lotHval} vs expected ${r.band.lotH}`);
    ok(`${tag}: band rule renders at rule-y × rs physical px (UIUX §3.2; 6.1% of vh per UIUX §3.1 at floor-inert sizes)`,
      Math.abs(r.band.rulePx - r.band.ruleY * r.rs) < 1, `rule ${r.band.rulePx} vs ${r.band.ruleY * r.rs}`);
    ok(`${tag}: band label font-size is 14.36px (UIUX §3.2; B46: TheBoards' \`B54\` 13px × k)`,
      r.band.labelFont === '14.36px', r.band.labelFont);
    ok(`${tag}: both band labels render at font-weight 600 (UIUX §3.2; B118: TheBoards' \`UIUX §3.1\` 13px/600)`,
      r.band.labelWeights.length === 2 && r.band.labelWeights.every(w => w === '600'), r.band.labelWeights.join(','));
    ok(`${tag}: #lot-items clips past the lot ceiling`, r.band.lotItemsClip === 'hidden');
  }
  await browser.close();
  console.log(fail === 0 ? '\nSCALING PASS' : `\nSCALING FAIL: ${fail}`);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('ERROR', e); process.exit(2); });