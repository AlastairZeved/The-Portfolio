/* test/scaling.js — issue #121 (B44): the board scales to ANY viewport size.
   The scene renders the owner's issue #112 drawing (B43 geometry in the
   drawing's own reference space, 2560/z × 1440/z, z = 1.3037) through one
   uniform scale, down AND up. At every desktop viewport the render must show:
   no overlapping note cards, no obscured link lines, the sheet filling the
   viewport edge to edge, and every card at its authored size × the scale.
   Mobile viewports are out of scope (#121); two narrow widths are included
   only to prove the B30 down-scale still holds. */

const { chromium } = require('playwright');

const URL = process.env.PORTFOLIO_URL || 'http://localhost:8000/index.html';
const Z = 1.3037;
const REF_W = 2560 / Z, REF_H = 1440 / Z;

const VIEWPORTS = [
  [1080, 600], [1280, 700], [1366, 768], [1440, 750], [1600, 850],
  [1920, 1080], [1920, 700], [1920, 640], [2560, 1000], [2560, 620],
  [800, 800], [640, 640], [1080, 1080],   // square-ish landscape: B46's width floor binds here (issue #128 edge-probe finding)
  [768, 900], [390, 844],
];

let pass = 0, fail = 0;
function ok(label, cond) {
  if (cond) { pass++; console.log('PASS ' + label); }
  else { fail++; console.log('FAIL ' + label); }
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
        return { id: c.getAttribute('data-id'), l: b.left, t: b.top, r: b.right, b: b.bottom, w: b.width, h: b.height };
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
      // no link line runs behind a card that is not its own endpoint
      const obscured = [];
      for (const lnEl of layer.querySelectorAll('line')) {
        const x1 = +lnEl.getAttribute('x1'), y1 = +lnEl.getAttribute('y1');
        const x2 = +lnEl.getAttribute('x2'), y2 = +lnEl.getAttribute('y2');
        for (const c of cards) {
          if (c.id === lnEl.dataset.from || c.id === lnEl.dataset.to) continue;
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
      const dims = [...document.querySelectorAll('.door-card')].map(c => {
        const s = parseFloat(c.style.getPropertyValue('--card-scale')) || 1;
        const b = c.getBoundingClientRect();
        return { id: c.getAttribute('data-id'), s, rs,
                 devW: Math.abs(b.width - c.offsetWidth * s * rs),
                 devH: Math.abs(b.height - c.offsetHeight * s * rs),
                 logicalW: c.offsetWidth * s };
      });
      // issue #128 (B46): the band, the title card and the Parking Lot size by
      // TheBoards' own laws — band literals RESCALED ×1.10455 (k = 1104.55/1000,
      // TheBoards' 1000-tall frame mapped into the drawing's 1104.55-tall space),
      // re-derived here from the same measurements the page's bandRuleY/lotH use.
      const k = 1104.55 / 1000;
      const bandRuleY = () => {
        let lines = 2;
        for (const n of document.querySelectorAll('.band-zone .anchor'))
          lines = Math.max(lines, Math.round(n.scrollHeight / (19.5 * k)));
        return Math.round(14 * k + lines * 19.5 * k + 8 * k);
      };
      const ruleY = parseFloat(getComputedStyle(board).getPropertyValue('--rule-y'));
      const bandTop = getComputedStyle(document.getElementById('band-fill')).getPropertyValue('--band-top');
      const card = document.getElementById('anchor-title');
      const cardMinH = parseFloat(getComputedStyle(card).minHeight);   // logical px: the var space is unscaled
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
      const lotHval = parseFloat(getComputedStyle(board).getPropertyValue('--lot-h'));
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
         pairwise gap term (B44's no-overlap law; same agent-derived
         provenance as B46's lw_min): for every pair whose vertical ranges
         overlap, the left card's right edge must clear the right card's
         left edge — lw >= (aW + handle ring) / (bLeft% − aLeft%). The
         logical height (vh/rs) grows with the floor, spreading the % tops,
         so the page re-measures until stable; re-derive the same way here. */
      const geo = [...document.querySelectorAll('.door-card')].map(c => ({
        lp: parseFloat(c.style.left) || 0, tp: parseFloat(c.style.top) || 0,
        s: parseFloat(c.style.getPropertyValue('--card-scale')) || 1,
        w: c.offsetWidth * (parseFloat(c.style.getPropertyValue('--card-scale')) || 1),
        h: c.offsetHeight * (parseFloat(c.style.getPropertyValue('--card-scale')) || 1)
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
            need = Math.max(need, (A.w + 4) / dLeft);
          }
        if (need <= lwMin + 0.5) break;
        lwMin = need;
      }
      return {
        rs, lwMin, boardRect: [br.left, br.top, br.width, br.height],
        vw: innerWidth, vh: innerHeight,
        scrollW: document.documentElement.scrollWidth, scrollH: document.documentElement.scrollHeight,
        overlaps, obscured: obscured,
        lineMaxDev: Math.max(...lines.map(l => l.d)),
        dims,
        band: { expectedRuleY: bandRuleY(), ruleY, bandTop, cardMinH, cardPad, lotH: lotH(), lotHval, lotItemsClip,
                cardBottomLogical: (card.getBoundingClientRect().bottom - br.top) / rs }
      };
    }, { REF_W, REF_H });

    ok(`${tag}: the sheet fills the viewport edge to edge, no overflow`,
      r.boardRect[2] + 0.5 >= r.vw && r.boardRect[3] + 0.5 >= r.vh &&
      r.scrollW <= r.vw + 1 && r.scrollH <= r.vh + 1);
    ok(`${tag}: the scale is height-anchored on landscape (rs = min(vh/REF_H, vw/lw_min)), min() in portrait (B46, issue #128)`,
      Math.abs(r.rs - (r.vw >= r.vh ? Math.min(r.vh / REF_H, r.vw / r.lwMin)
                                    : Math.min(r.vw / REF_W, r.vh / REF_H))) < 1e-6);
    ok(`${tag}: no overlapping note cards`, r.overlaps.length === 0);
    ok(`${tag}: no link line obscured behind a card`, r.obscured.length === 0);
    ok(`${tag}: every link endpoint on its card centre (≤0.6 logical px)`, r.lineMaxDev < 0.6);
    ok(`${tag}: cards render content-sized × own scale × rs (uniform, no reflow)`,
      r.dims.every(d => d.devW < 1 && d.devH < 1));
    ok(`${tag}: every card floored at NOTE_MIN_W 132 logical px (× own scale)`,
      r.dims.every(d => d.logicalW >= 132 * d.s - 0.5));
    // issue #128 (B46): the band / title card / lot follow TheBoards' laws
    ok(`${tag}: band rule-y = 15.46 + max(2, lines) × 21.54 + 8.84 (TheBoards B47/B76 × 1.10455)`,
      Math.abs(r.band.ruleY - r.band.expectedRuleY) < 0.5, JSON.stringify(r.band));
    ok(`${tag}: band-top is 15.46 = 14 × 1.10455 (TheBoards state.js × k)`, r.band.bandTop.trim() === '15.46px');
    ok(`${tag}: title card min-height = rule-y + 29 (B31 STANDS — B46, owner ruling 3)`,
      Math.abs(r.band.cardMinH - (r.band.ruleY + 29)) < 0.5);
    ok(`${tag}: title card box = B31's (band-top+8) 16px 16px padding, occluding the rule`,
      r.band.cardPad === `${23.46.toFixed(2)}px 16px 16px` && r.band.cardBottomLogical >= r.band.ruleY + 28);
    ok(`${tag}: lot-h = min(max(134.76 shelf, 34 + Σ rows), ⌈half the sheet⌉) (TheBoards B73 × k)`,
      Math.abs(r.band.lotHval - r.band.lotH) < 0.5, `lot-h ${r.band.lotHval} vs expected ${r.band.lotH}`);
    ok(`${tag}: #lot-items clips past the lot ceiling`, r.band.lotItemsClip === 'hidden');
  }
  await browser.close();
  console.log(`\nSCALING PASS=${pass} FAIL=${fail}`);
  process.exit(fail ? 1 : 0);
})();