/* test/mobile.js — mobile render + eight new-tab door-cards + form + the one
   render scale (no clip, no overflow, link endpoints under the scale) and the
   thirteen note links (B28, B55) (black-box, Playwright).
   Run: node test/mobile.js   (BOARDS_URL default http://localhost:8000/index.html) */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const URL = process.env.PORTFOLIO_URL || 'http://localhost:8000/index.html';
const OUT = process.env.PORTFOLIO_OUT && path.resolve(process.env.PORTFOLIO_OUT);
let failures = 0;
const ok = (label, cond) => { if (!cond) failures++; console.log(`${cond ? 'PASS' : 'FAIL'} ${label}`); };

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(URL, { waitUntil: 'networkidle' });

  // title card, B17/B19 text
  const title = await page.locator('#anchor-title').innerText();
  ok('title card line 1 "The Portfolio of"', title.includes('The Portfolio of'));
  ok('title card line 2 name', title.includes('Robert Alastair Zeved Gregory'));

  // title card, B17 text; B19's hug-the-text borders; B61's two-rung type
  // (issue #170: the eyebrow renders on TheBoards' reduced secondary rung —
  // 13.33px/400 — under the 20px/600 title rung; supersedes the single-size
  // clause of B19 for this line)
  const titleSizes = await page.locator('#anchor-title .title-eyebrow, #anchor-title .title-pinned')
    .evaluateAll(els => els.map(el => getComputedStyle(el)));
  ok('title card two rungs: eyebrow reduced 13.33px/400, name 20px/600 (issue #170/B61)',
    titleSizes.length === 2 &&
    titleSizes[0].fontSize === '13.33px' && titleSizes[0].fontWeight === '400' &&
    titleSizes[1].fontSize === '20px' && titleSizes[1].fontWeight === '600');
  const titleBox = await page.locator('#anchor-title').boundingBox();
  // B19: borders close in on the text — card width = widest line + horizontal padding + borders.
  // The whole sheet renders through one scale (issue #87, B30): rect widths from
  // getBoundingClientRect() are scaled, but the authored padding/border px are logical.
  // Divide pad/bdr by the render scale so both sides compare in physical (scaled) px.
  const hug = await page.evaluate(() => {
    const card = document.querySelector('#anchor-title');
    const rs = parseFloat(getComputedStyle(document.querySelector('#board')).getPropertyValue('--rs') || '1');
    const padX = parseFloat(getComputedStyle(card).paddingLeft) + parseFloat(getComputedStyle(card).paddingRight);
    const bdrX = parseFloat(getComputedStyle(card).borderLeftWidth) + parseFloat(getComputedStyle(card).borderRightWidth);
    const widest = Math.max(...[...card.querySelectorAll('.title-eyebrow, .title-pinned')]
      .map(el => el.getBoundingClientRect().width));
    return Math.abs(card.getBoundingClientRect().width - (widest + (padX + bdrX) * rs));
  });
  ok('title card borders hug text', titleBox && hug < 2);
  ok('title card stays centred', titleBox && Math.abs((titleBox.x + titleBox.width / 2) - 390 / 2) < 2);

  // no door-card clips left or right, and no horizontal overflow (issue #87, B30) —
  // the one render scale keeps every authored card inside the shrunk sheet
  const fit = await page.evaluate(() => {
    const vw = window.innerWidth;
    const cards = [...document.querySelectorAll('.door-card')].map(a => {
      const r = a.getBoundingClientRect();
      return r.left >= -0.5 && r.right <= vw + 0.5;
    });
    const sw = document.documentElement.scrollWidth;
    const sh = document.documentElement.scrollHeight;
    const vh = window.innerHeight;
    return { allInside: cards.every(Boolean), noHOverflow: sw <= vw + 1, noVOverflow: sh <= vh + 1 };
  });
  ok('every door-card fully inside the sheet (no clipping)', fit.allInside);
  ok('no horizontal overflow (scrollWidth <= innerWidth)', fit.noHOverflow);
  ok('no vertical overflow (scrollHeight <= innerHeight)', fit.noVOverflow);

  // the thirteen note links (B28, B55) hold their endpoints under the same scale: the
  // layer's user units are the board's LOGICAL px, so every line must land on
  // the LOGICAL centre of the two cards it joins — measured rects are physical,
  // divided by rs here exactly as index.html's toLogical does (issue #87, B30)
  const linkFit = await page.evaluate(() => {
    const board = document.querySelector('#board');
    const rs = parseFloat(getComputedStyle(board).getPropertyValue('--rs')) || 1;
    const br = board.getBoundingClientRect();
    const centre = el => {
      const r = el.getBoundingClientRect();
      return [(r.left - br.left + r.width / 2) / rs, (r.top - br.top + r.height / 2) / rs];
    };
    return [...document.querySelectorAll('#link-layer line')].map(l => {
      const a = board.querySelector('[data-id="' + l.getAttribute('data-from') + '"]');
      const b = board.querySelector('[data-id="' + l.getAttribute('data-to') + '"]');
      if (!a || !b) return Infinity;
      const ca = centre(a), cb = centre(b);
      return Math.max(Math.abs(+l.getAttribute('x1') - ca[0]), Math.abs(+l.getAttribute('y1') - ca[1]),
                      Math.abs(+l.getAttribute('x2') - cb[0]), Math.abs(+l.getAttribute('y2') - cb[1]));
    });
  });
  ok('all thirteen links land on their card centres at scale < 1', linkFit.length === 13 && linkFit.every(d => d < 1));

  // eight door-cards, each a real new-tab anchor (B26); the Music card and
  // the four B55 sub cards (issue #146) are plain notes
  const cards = await page.locator('a.door-card').count();
  ok('eight door-cards', cards === 8);
  const hrefs = await page.locator('a.door-card').evaluateAll(as => as.map(a => [a.textContent.trim(), a.href, a.target, a.rel]));
  const expected = [
    ['Community', 'https://earp-street-park.netlify.app/'],
    ['Career', 'https://razgregory.com/career'],
    ['Writing', 'https://substack.com/@theaboveaveragerob'],
    ['Software & AI', 'https://alastairzeved.com/'],
    ['Plants & Rocks', 'https://razgregory.com/plantsandrocks'],
    ['LinkedIn', 'https://www.linkedin.com/in/robertagregory'],
    ['Apple Music', 'https://music.apple.com/us/artist/aboveaveragerob/1815357064'],
    ['Spotify', 'https://open.spotify.com/artist/5R4lXpHs3OObGTFxdltrxZ'],
  ];
  for (const [name, url] of expected) {
    const hit = hrefs.find(([n]) => n === name);
    ok(`${name} links to ${url}`, hit && hit[1] === url && hit[2] === '_blank' && hit[3].includes('noopener'));
  }

  // the Music card is a rest-only note, not a link (B26); B55 (issue #146)
  // adds four more non-link note sub cards, so five div.door-card.note-card
  // exist now and Music remains the first
  const musicNotes = page.locator('div.door-card.note-card');
  ok('Music card is a non-link note (first of five notes — B26, B55)', await musicNotes.count() === 5
    && (await musicNotes.first().innerText()).trim().split('\n')[0].trim() === 'Music');
  ok('the four B55 sub cards are non-link notes too', await musicNotes.evaluateAll(els =>
    ['Zeved Boards', 'Agentic Plugins', 'Plants on Poles', 'Plants in Rocks'].every((t, i) =>
      els[i + 1] && els[i + 1].innerText.trim().split('\n')[0].trim() === t && !els[i + 1].hasAttribute('href'))));
  ok('Music note has no href', await musicNotes.first().evaluate(el => !el.hasAttribute('href')));
  ok('Music note carries no hover/click shadow', await musicNotes.first().evaluate(el =>
    getComputedStyle(el).boxShadow === 'none'));
  ok('Music note still drags and resizes like any note (B7)', await musicNotes.first().evaluate(el => {
    const h = el.querySelector('.resize-handle');
    return getComputedStyle(el).pointerEvents !== 'none' && !!h && getComputedStyle(h).display !== 'none';
  }));

  // no All Boards rail anywhere (issue #71: removed entirely, both grammars)
  const railNodes = await page.locator('#pane').count();
  ok('no All Boards rail in the DOM', railNodes === 0);
  const boardBox = await page.locator('#board').boundingBox();
  ok('board spans the full viewport width', boardBox && Math.abs(boardBox.x) < 1 && Math.abs(boardBox.width - 390) < 1);

  // form present with three fields, required message + honeypot (B6)
  const formAction = await page.locator('#contact-form').getAttribute('action');
  ok('form posts to the ruled Formspree endpoint', formAction === 'https://formspree.io/f/xppwbrga');
  ok('Name field present', await page.locator('#cf-name').count() === 1);
  ok('Email field present', await page.locator('#cf-email').count() === 1);
  ok('Message required', await page.locator('#cf-message').evaluate(el => el.required));
  ok('_gotcha honeypot present', await page.locator('input[name="_gotcha"]').count() === 1);

  // empty regions: furniture only (band labels), no content
  ok('Components zone label', (await page.locator('#zone-components .band-label').innerText()) === 'Components');
  ok('Requirements zone label', (await page.locator('#zone-requirements .band-label').innerText()) === 'Requirements');

  if (OUT) await page.screenshot({ path: OUT });
  await browser.close();
  console.log(failures === 0 ? '\nMOBILE PASS' : `\nMOBILE FAIL: ${failures}`);
  process.exit(failures === 0 ? 0 : 1);
})().catch(e => { console.error('ERROR', e); process.exit(2); });
