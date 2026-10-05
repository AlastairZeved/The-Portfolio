/* test/parity_boards.js — issue #128 (B46): the header (band), the title card
   and the Parking Lot size by TheBoards' own convention. RENDERED
   side-by-side measurement: the portfolio and the local TheBoards checkout
   are served together, loaded at the same viewports, and each board's
   band rule-y, title-card overhang and lot height are measured live and
   compared — both must sit at the same rule-y when their bands hold the same
   measured line count, both must overhang the band by exactly 22px, and both
   must size the lot by the same measured-content law from the two-row floor.
   Run: node test/parity_boards.js
   Env: PORTFOLIO_URL (default http://localhost:8000/index.html),
        BOARDS_DIR (default the local AlastairZeved/TheBoards checkout). */

const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const URL = process.env.PORTFOLIO_URL || 'http://localhost:8000/index.html';
const BOARDS_DIR = process.env.BOARDS_DIR ||
  path.join(os.homedir(), 'Documents/Strombolis-workshop/TheBoards/TheBoards');

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
    srv.listen(0, '127.0.0.1', () => resolve(srv));
  });
}

/* One live measurement pass over a loaded page: the same quantities on both
   boards, each in its own logical px (the values are published/set as
   board-logical, and minHeight/padding arrive physical ÷ rs). */
async function measure(page) {
  return page.evaluate(() => {
    const board = document.getElementById('board');
    const cs = board => getComputedStyle(board);
    const rs = parseFloat(cs(board).getPropertyValue('--rs')) || 1;
    let lines = 2;
    for (const n of document.querySelectorAll('.band-zone .anchor'))
      lines = Math.max(lines, Math.round(n.scrollHeight / 19.5));
    const card = document.getElementById('anchor-title');
    return {
      ruleY: parseFloat(cs(board).getPropertyValue('--rule-y')),
      lines,
      bandTop: cs(board).getPropertyValue('--band-top').trim(),
      cardMinH: parseFloat(getComputedStyle(card).minHeight),   // logical px (var space unscaled)
      cardPad: getComputedStyle(card).padding,
      cardBottomLogical: (card.getBoundingClientRect().bottom - board.getBoundingClientRect().top) / rs,
      lotH: parseFloat(cs(board).getPropertyValue('--lot-h')),
      lotSum: [...document.getElementById('lot-items').querySelectorAll(':scope > *')]
        .reduce((s, n) => s + n.offsetHeight, 0),
      logicalH: board.offsetHeight,
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
  const BOARDS_URL = `http://127.0.0.1:${port}/index.html`;

  const browser = await chromium.launch();
  const VIEWPORTS = [[1920, 1080], [1440, 900], [1280, 720], [768, 900]];
  for (const [w, h] of VIEWPORTS) {
    const tag = `${w}x${h}`;
    const pf = await browser.newPage({ viewport: { width: w, height: h } });
    const tb = await browser.newPage({ viewport: { width: w, height: h } });
    await pf.goto(URL, { waitUntil: 'networkidle' });
    await pf.waitForTimeout(200);
    await tb.goto(BOARDS_URL, { waitUntil: 'networkidle' });
    await tb.waitForTimeout(400);           // TheBoards' own layout pass
    const p = await measure(pf);
    const b = await measure(tb);

    ok(`${tag}: both bands size by the same law — rule-y = 14 + max(2, lines)×19.5 + 8`,
      Math.abs(p.ruleY - Math.round(14 + p.lines * 19.5 + 8)) < 0.5 &&
      Math.abs(b.ruleY - Math.round(14 + b.lines * 19.5 + 8)) < 0.5,
      `portfolio ${p.ruleY} (lines ${p.lines}) vs TheBoards ${b.ruleY} (lines ${b.lines})`);
    ok(`${tag}: both bands sit at 14px band-top`,
      p.bandTop === '14px' && b.bandTop === '14px');
    ok(`${tag}: equal band content renders equal band height (portfolio ${p.ruleY} = TheBoards ${b.ruleY})`,
      p.lines === b.lines ? Math.abs(p.ruleY - b.ruleY) < 0.5 : true,
      `lines ${p.lines} vs ${b.lines}`);
    ok(`${tag}: both title cards overhang the rule by exactly 22px (min-height rule-y + 22)`,
      Math.abs(p.cardMinH - (p.ruleY + 22)) < 0.5 && Math.abs(b.cardMinH - (b.ruleY + 22)) < 0.5,
      `portfolio ${p.cardMinH} vs ${p.ruleY + 22}; TheBoards ${b.cardMinH} vs ${b.ruleY + 22}`);
    ok(`${tag}: both title cards carry TheBoards' (band-top+6) 12 12 box and occlude the rule`,
      p.cardPad === '20px 12px 12px' && b.cardPad === '20px 12px 12px' &&
      p.cardBottomLogical >= p.ruleY + 21 && b.cardBottomLogical >= b.ruleY + 21,
      `pad ${p.cardPad} / ${b.cardPad}`);
    ok(`${tag}: both lots size by the same measured-content law from the two-row floor`,
      Math.abs(p.lotH - Math.min(34 + Math.max(88, Math.round(p.lotSum)), Math.round(p.logicalH * 0.5))) < 0.5 &&
      Math.abs(b.lotH - Math.min(34 + Math.max(88, Math.round(b.lotSum)), Math.round(b.logicalH * 0.5))) < 0.5,
      `portfolio lot ${p.lotH} (Σ ${p.lotSum}) vs TheBoards lot ${b.lotH} (Σ ${b.lotSum})`);
    ok(`${tag}: both lots clip past the half-sheet ceiling`,
      p.lotClip === 'hidden' && b.lotClip === 'hidden');
    await pf.close(); await tb.close();
  }
  await browser.close();
  srv.close();
  console.log(`\nPARITY PASS=${pass} FAIL=${fail}`);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('ERROR', e); process.exit(2); });
