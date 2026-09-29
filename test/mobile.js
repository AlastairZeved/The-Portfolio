/* test/mobile.js — mobile render + six new-tab door-cards + form (black-box, Playwright).
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

  // title card, B17 text
  const title = await page.locator('#anchor-title').innerText();
  ok('title card line 1 "The Portfolio of"', title.includes('The Portfolio of'));
  ok('title card line 2 name', title.includes('Robert Alastair Zeved Gregory'));

  // six door-cards, each a real new-tab anchor
  const cards = await page.locator('a.door-card').count();
  ok('six door-cards', cards === 6);
  const hrefs = await page.locator('a.door-card').evaluateAll(as => as.map(a => [a.textContent.trim(), a.href, a.target, a.rel]));
  const expected = [
    ['Community', 'https://earp-street-park.netlify.app/'],
    ['Professional', 'https://razgregory.com/career'],
    ['Writing', 'https://substack.com/@theaboveaveragerob'],
    ['Software & AI', 'https://alastairzeved.com/'],
    ['Plants & Rocks', 'https://razgregory.com/plantsandrocks'],
    ['Music', 'https://open.spotify.com/artist/5R4lXpHs3OObGTFxdltrxZ'],
  ];
  for (const [name, url] of expected) {
    const hit = hrefs.find(([n]) => n === name);
    ok(`${name} links to ${url}`, hit && hit[1] === url && hit[2] === '_blank' && hit[3].includes('noopener'));
  }

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
