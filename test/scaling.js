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

    const r = await page.evaluate(({ REF_W, REF_H }) => {
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
      // authored size × rs (uniform scale, no reflow)
      const firstCard = document.querySelector('.door-card');
      const aw = parseFloat(firstCard.style.width), ah = parseFloat(firstCard.style.height);
      const fb = firstCard.getBoundingClientRect();
      return {
        rs, boardRect: [br.left, br.top, br.width, br.height],
        vw: innerWidth, vh: innerHeight,
        scrollW: document.documentElement.scrollWidth, scrollH: document.documentElement.scrollHeight,
        overlaps, obscured: obscured,
        lineMaxDev: Math.max(...lines.map(l => l.d)),
        sizeDev: Math.max(Math.abs(fb.width - aw * rs), Math.abs(fb.height - ah * rs)),
      };
    }, { REF_W, REF_H });

    ok(`${tag}: the sheet fills the viewport edge to edge, no overflow`,
      r.boardRect[2] + 0.5 >= r.vw && r.boardRect[3] + 0.5 >= r.vh &&
      r.scrollW <= r.vw + 1 && r.scrollH <= r.vh + 1);
    ok(`${tag}: the scale is min(vw/REF_W, vh/REF_H) — one scale, down and up`,
      Math.abs(r.rs - Math.min(r.vw / REF_W, r.vh / REF_H)) < 1e-6);
    ok(`${tag}: no overlapping note cards`, r.overlaps.length === 0);
    ok(`${tag}: no link line obscured behind a card`, r.obscured.length === 0);
    ok(`${tag}: every link endpoint on its card centre (≤0.6 logical px)`, r.lineMaxDev < 0.6);
    ok(`${tag}: cards render at authored size × scale (uniform, no reflow)`, r.sizeDev < 1);
  }
  await browser.close();
  console.log(`\nSCALING PASS=${pass} FAIL=${fail}`);
  process.exit(fail ? 1 : 0);
})();