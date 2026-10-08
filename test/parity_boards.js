/* test/parity_boards.js — issue #128 (B46): the portfolio's band, title card
   and Parking Lot physically match TheBoards. RENDERED side-by-side
   measurement: the portfolio and the local TheBoards checkout are served
   together, loaded at the same LANDSCAPE viewports, and each board's PHYSICAL
   (getBoundingClientRect, screen px) geometry is compared. The boards use
   different logical frames — TheBoards' 1000-tall frame, the portfolio's
   1104.55-tall drawing space with the band literals rescaled ×1.10455 (B46) —
   so LOGICAL values must not be compared; the PHYSICAL render must:

     - the band rule renders at the same screen px on both boards (the
       height-anchored landscape scale law: portfolio 67.38 × vh/1104.55
       = TheBoards 61 × vh/1000 = 6.1% of vh at every landscape size);
     - each title card's physical height = its own (rule-y + overhang) × its
       own scale — the portfolio's B31 +29px overhang, TheBoards' B38 +22px —
       and the physical difference between the two cards is exactly the
       overhang difference (B31 stands; B46 did not touch the box);
     - the band label renders at the same screen px on both (14.36 ×
       vh/1104.55 = 13 × vh/1000);
     - each lot follows its own rescaled measured-content law from its
       rescaled two-row shelf (portfolio 134.76, TheBoards 122 — the same
       physical shelf), floored, half-sheet capped, bottom-anchored, clipping.

   Run: node test/parity_boards.js
   Env: PORTFOLIO_URL (default http://localhost:8000/index.html),
        BOARDS_DIR (default the local AlastairZeved/TheBoards checkout). */

const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const URL = process.env.PORTFOLIO_URL || 'http://localhost:8000/index.html';
const BOARDS_DIR = process.env.BOARDS_DIR ||
  '/home/aboveaveragerob/.hermes/cache/scratch/TheBoards';

const K = 1104.55 / 1000;           // B46's band-literal rescale factor

let pass = 0, fail = 0;
function ok(label, cond, extra) {
  if (cond) { pass++; console.log('PASS ' + label); }
  else { fail++; console.log('FAIL ' + label + (extra ? ' — ' + extra : '')); }
}

// a throwaway static server for the TheBoards checkout (ES modules need http)
function serve(dir) {
  return new Promise(resolve => {
    const srv = http.createServer((req, res) => {
      const p = path.join(dir, decodeURIComponent(req.url.split('?')[0]));
      fs.readFile(p, (err, data) => {
        if (err) { res.writeHead(404); res.end('nf'); return; }
        const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
                       '.json': 'application/json', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };
        res.writeHead(200, { 'content-type': mime[path.extname(p)] || 'application/octet-stream' });
        res.end(data);
      });
    });
    srv.listen(0, 'localhost', () => resolve(srv));
  });
}

/* One live measurement pass over a loaded page: PHYSICAL rendered geometry
   only (screen px, transform applied) plus the published logical vars. */
async function measure(page) {
  return page.evaluate(() => {
    const board = document.getElementById('board');
    const cs = getComputedStyle(board);
    const rs = parseFloat(cs.getPropertyValue('--rs')) || 1;
    const bTop = board.getBoundingClientRect().top;
    const rule = document.getElementById('band-rule').getBoundingClientRect();
    const card = document.getElementById('anchor-title').getBoundingClientRect();
    const label = document.querySelector('.band-label').getBoundingClientRect();
    const lot = document.getElementById('lot');
    const lotH = parseFloat(cs.getPropertyValue('--lot-h'));
    const ruleY = parseFloat(cs.getPropertyValue('--rule-y'));
    let sum = 0;
    for (const n of document.getElementById('lot-items').querySelectorAll(':scope > *'))
      sum += n.offsetHeight;
    return {
      vh: innerHeight,
      rs, ruleY, lotH, lotSum: sum,
      logicalH: board.offsetHeight,
      rulePx: rule.top - bTop,                                   // physical
      ruleH: rule.height,
      cardTopPx: card.top - bTop, cardH: card.height,            // physical
      labelH: label.height,                                      // physical
      lotBottomGap: innerHeight - lot.getBoundingClientRect().bottom,
      lotClip: getComputedStyle(document.getElementById('lot-items')).overflow,
    };
  });
}

(async () => {
  if (!fs.existsSync(path.join(BOARDS_DIR, 'index.html'))) {
    console.error('FAIL TheBoards checkout not found at ' + BOARDS_DIR + ' (set BOARDS_DIR)');
    process.exit(2);
  }
  const srv = await serve(BOARDS_DIR);
  const port = srv.address().port;
  const BOARDS_URL = `http://localhost:${port}/index.html`;

  const browser = await chromium.launch();
  // landscape only: TheBoards' mobile path (rs = 1) is a different layout,
  // and B46's scale law governs landscape screens.
  const VIEWPORTS = [[1440, 900], [1920, 1080], [2560, 1440]];
  for (const [w, h] of VIEWPORTS) {
    const tag = `${w}x${h}`;
    const pf = await browser.newPage({ viewport: { width: w, height: h } });
    const tb = await browser.newPage({ viewport: { width: w, height: h } });
    await pf.goto(URL, { waitUntil: 'networkidle' });
    await pf.waitForTimeout(300);
    await tb.goto(BOARDS_URL, { waitUntil: 'networkidle' });
    await tb.waitForTimeout(500);           // TheBoards' own layout pass
    const p = await measure(pf);
    const b = await measure(tb);

    /* B67 (issue #175): the owner's #175 drawing moves Zeved Boards to
       top:55% beside Software & AI (top:51.7%) with only a 9.1% horizontal
       gap, so B46's measured no-overlap floor (lw_min) binds at 1440×900 —
       the sheet must be wider than the pure height anchor allows and the
       whole scene, band included, renders at the floored scale. B46's own
       clause floors the height anchor by the content's measured minimum
       width, so where the floor binds the parity contract renders at the
       portfolio's OWN scale: the band literals (67.38 rule-y, 14.36 label)
       × the floored rs. Where the floor is inert, the physical parity with
       TheBoards holds as ruled and is asserted. */
    const REF_H = 1440 / 1.3037;
    const floored = Math.abs(p.rs - h / REF_H) > 1e-6;   // B46's floor bound first
    if (floored) {
      ok(`${tag}: band rule renders at the portfolio's own law at its floored scale — 67.38 × rs (${p.rs.toFixed(4)}; B46's measured no-overlap floor bound by the #175 drawing, B67)`,
        Math.abs(p.rulePx - p.ruleY * p.rs) < 1 &&
        Math.abs(p.ruleY - 67.38) < 0.5,
        `portfolio ${p.rulePx.toFixed(1)} vs ${(p.ruleY * p.rs).toFixed(1)}`);
      /* B46's floor rescales the sheet AS A WHOLE — no band literal moves
           logically. Assert the label's LOGICAL height equals its height at
           a floor-inert viewport (2560×1440: sheet 1963.64 ≥ the floor). */
      const pfRef = await browser.newPage({ viewport: { width: 2560, height: 1440 } });
      await pfRef.goto(URL, { waitUntil: 'networkidle' });
      await pfRef.waitForTimeout(300);
      const pref = await measure(pfRef);
      await pfRef.close();
      ok(`${tag}: the floor-inert reference viewport actually is floor-inert (rs = vh/REF_H at 2560×1440; B67's premise, asserted)`,
        Math.abs(pref.rs - 1440 / REF_H) < 1e-6,
        `reference rs ${pref.rs.toFixed(4)} vs ${(1440 / REF_H).toFixed(4)}`);
      ok(`${tag}: the floored sheet rescales as a whole — band label logical height unchanged (${pref.rs.toFixed(4)} floor-inert reference vs ${p.rs.toFixed(4)} floored; B67)`,
        Math.abs(p.labelH / p.rs - pref.labelH / pref.rs) < 0.5,
        `floored ${(p.labelH / p.rs).toFixed(2)} vs ${(pref.labelH / pref.rs).toFixed(2)}`);
    } else {
      ok(`${tag}: both bands render the rule at the same PHYSICAL px (6.1% of vh)`,
        Math.abs(p.rulePx - b.rulePx) < 1 && Math.abs(p.rulePx - 0.061 * p.vh) < 1.5,
        `portfolio ${p.rulePx.toFixed(1)} vs TheBoards ${b.rulePx.toFixed(1)} (target ${(0.061 * p.vh).toFixed(1)})`);
      ok(`${tag}: portfolio rule-y logical = 67.38 = 61 × 1.10455; TheBoards 61`,
        Math.abs(p.ruleY - 67.38) < 0.5 && Math.abs(b.ruleY - 61) < 0.5,
        `portfolio ${p.ruleY} TheBoards ${b.ruleY}`);
      ok(`${tag}: title card physical height = own (rule-y + overhang) × own scale — B31's +29 here, TheBoards' +22`,
        Math.abs(p.cardH - (p.ruleY + 29) * p.rs) < 1.5 &&
        Math.abs(b.cardH - (b.ruleY + 22) * b.rs) < 1.5,
        `portfolio ${p.cardH.toFixed(1)} vs ${(p.ruleY + 29) * p.rs} · TheBoards ${b.cardH.toFixed(1)} vs ${(b.ruleY + 22) * b.rs}`);
      ok(`${tag}: both title cards overhang their own rule physically (portfolio +29×rs, TheBoards +22×rs′)`,
        p.cardH > p.rulePx + 21 * p.rs && b.cardH > b.rulePx + 21 * b.rs,
        `portfolio card ${p.cardH.toFixed(1)} rule ${p.rulePx.toFixed(1)} · TheBoards card ${b.cardH.toFixed(1)} rule ${b.rulePx.toFixed(1)}`);
      ok(`${tag}: band labels render at the same PHYSICAL px`,
        Math.abs(p.labelH - b.labelH) < 1.2,
        `portfolio ${p.labelH.toFixed(1)} vs TheBoards ${b.labelH.toFixed(1)}`);
    }   // end floored/else — B67's note above
    ok(`${tag}: portfolio lot-h = min(max(134.76 shelf, 34 + Σ rows), ⌈half sheet⌉) — its own rescaled law`,
      Math.abs(p.lotH - Math.min(Math.max(122 * K, 34 + Math.round(p.lotSum)), Math.ceil(p.logicalH * 0.5))) < 0.5,
      `lot ${p.lotH} Σ ${p.lotSum}`);
    ok(`${tag}: TheBoards lot-h = min(max(122 shelf, 34 + Σ rows), half sheet) — its own law`,
      Math.abs(b.lotH - Math.min(Math.max(122, 34 + Math.round(b.lotSum)), Math.round(b.logicalH * 0.5))) < 0.5,
      `lot ${b.lotH} Σ ${b.lotSum}`);
    ok(`${tag}: both lots are bottom-anchored (flush to the viewport foot) and clip`,
      p.lotBottomGap < 1 && b.lotBottomGap < 1 &&
      p.lotClip === 'hidden' && b.lotClip === 'hidden',
      `gaps ${p.lotBottomGap.toFixed(1)}/${b.lotBottomGap.toFixed(1)}`);
    await pf.close(); await tb.close();
  }
  await browser.close();
  srv.close();
  console.log(`\nPARITY PASS=${pass} FAIL=${fail}`);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('ERROR', e); process.exit(2); });
