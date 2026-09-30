/* test/mobile.js — mobile render + eight new-tab door-cards + form (black-box, Playwright).
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

  // title card, B19: single font size and borders hug the text
  const titleSizes = await page.locator('#anchor-title .title-eyebrow, #anchor-title .title-pinned')
    .evaluateAll(els => els.map(el => getComputedStyle(el).fontSize));
  ok('title card single font size (both lines equal)', titleSizes.length === 2 && titleSizes[0] === titleSizes[1] && !!titleSizes[0]);
  const titleBox = await page.locator('#anchor-title').boundingBox();
  // B19: borders close in on the text — card width = widest line + horizontal padding + borders
  const hug = await page.evaluate(() => {
    const card = document.querySelector('#anchor-title');
    const padX = parseFloat(getComputedStyle(card).paddingLeft) + parseFloat(getComputedStyle(card).paddingRight);
    const bdrX = parseFloat(getComputedStyle(card).borderLeftWidth) + parseFloat(getComputedStyle(card).borderRightWidth);
    const widest = Math.max(...[...card.querySelectorAll('.title-eyebrow, .title-pinned')]
      .map(el => el.getBoundingClientRect().width));
    return Math.abs(card.getBoundingClientRect().width - (widest + padX + bdrX));
  });
  ok('title card borders hug text', titleBox && hug < 2);
  ok('title card stays centred', titleBox && Math.abs((titleBox.x + titleBox.width / 2) - 390 / 2) < 2);

  // eight door-cards, each a real new-tab anchor (B26); the Music card is a plain note
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

  // the Music card is a rest-only note, not a link (B26)
  const musicNotes = page.locator('div.door-card.note-card');
  ok('Music card is a non-link note', await musicNotes.count() === 1
    && (await musicNotes.first().innerText()).trim().split('\n')[0].trim() === 'Music');
  ok('Music note has no href', await musicNotes.first().evaluate(el => !el.hasAttribute('href')));
  ok('Music note carries no hover/click shadow', await musicNotes.first().evaluate(el =>
    getComputedStyle(el).boxShadow === 'none'));
  ok('Music note still drags and resizes like any note (B7)', await musicNotes.first().evaluate(el => {
    const h = el.querySelector('.resize-handle');
    return getComputedStyle(el).pointerEvents !== 'none' && !!h && getComputedStyle(h).display !== 'none';
  }));

  // rail hidden on mobile (B15: wide only)
  const railVisible = await page.locator('#pane').isVisible();
  ok('rail hidden on mobile', !railVisible);

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
