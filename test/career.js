/* test/career.js — the career page (issue #133, B47): three-way employer
   selector, B132 glow on the selected title card, split body with ruled bar,
   three-section parking lot with dividers, CTA back to razgregory.com, the
   sand/brown token ladder, and the plugin components in the body's left
   half (issue #154, B55 — desc cards render EMPTY on purpose). Single file,
   zero script, zero <link>. Black-box Playwright.
   Run: node test/career.js   (PORTFOLIO_URL default http://localhost:8000/career.html)
   Viewport note: the desktop run is at the page's own design canvas
   (REF_H ≈ 1104.55 → rs = 1), because the B55 component's geometry — like
   the band's literals above it — renders at the B46 scale (--rs). */

const { chromium } = require('playwright');

const URL = process.env.PORTFOLIO_URL || 'http://localhost:8000/career.html';
let failures = 0;
const ok = (label, cond) => { if (!cond) failures++; console.log(`${cond ? 'PASS' : 'FAIL'} ${label}`); };

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1110 } });
  await page.goto(URL, { waitUntil: 'networkidle' });

  // Single-file law: no scripts, no stylesheets, no deps
  ok('no <script> elements', await page.locator('script').count() === 0);
  ok('no external stylesheets or links', await page.locator('link').count() === 0);
  ok('no external network requests beyond the page itself', await page.evaluate(() => performance.getEntriesByType('resource')
    .every(r => r.name.startsWith('data:') || r.name.startsWith(location.origin))));

  // §1: three title cards, one per employer, in chronological order
  const names = await page.locator('.topband__card .topband__wordmark').allInnerTexts();
  ok('three employer cards', names.length === 3);
  ok('chronological order PNC Bank → PNC Private Bank → Brinker Capital',
    JSON.stringify(names) === JSON.stringify(['PNC Bank', 'PNC Private Bank', 'Brinker Capital']));

  // Cards hang over the header rule
  const hang = await page.evaluate(() => {
    const band = document.querySelector('.topband');
    const card = document.querySelector('.topband__card');
    return card.getBoundingClientRect().bottom > band.getBoundingClientRect().bottom - 1;
  });
  ok('title cards hang over the header line', hang);

  // B49 (issue #139): the band, cards and lot render at the landing page's
  // conventions — B46's height-anchored scale (rs = vh/1104.55), B31's card
  // box, the lot's two-row-shelf floor. At 1440×900, rs = 0.81455.
  const b49 = await page.evaluate(() => {
    const band = document.querySelector('.topband').getBoundingClientRect();
    const card = document.querySelector('.topband__card');
    const r = card.getBoundingClientRect();
    const cs = getComputedStyle(card);
    const lot = document.querySelector('.parking-lot').getBoundingClientRect();
    const rs = innerHeight / 1104.55;
    const wm = getComputedStyle(card.querySelector('.topband__wordmark'));
    return { bandH: band.height, hang: r.bottom - band.bottom, font: wm.fontSize,
             borderTop: cs.borderTopWidth, radius: cs.borderBottomLeftRadius,
             cardW: r.width, lotH: lot.height, rs };
  });
  ok('band renders at the landing height-anchored scale: rule-y = 67.38 × vh/1104.55 (B46/B49)',
    Math.abs(b49.bandH - 67.38 * b49.rs) < 1);
  ok('card hangs 29 × rs over the rule (B31/B49)',
    Math.abs(b49.hang - 29 * b49.rs) < 1);
  ok('card type is the 20px logical rung: wordmark font-size = 20 × rs (B31/B49)',
    Math.abs(parseFloat(b49.font) - 20 * b49.rs) < 0.5);
  ok('card is the B31 box: border-top 0, radius only on the bottom corners, content-sized',
    // content-sized hug: ~111px at 1440×900; <300 is a sanity bound against
    // regression to the old full-width grid cell (~440px)
    b49.borderTop === '0px' && parseFloat(b49.radius) > 0 && b49.cardW < 300);
  ok('lot is floored at the rescaled two-row shelf: 134.76 × rs (B46/B73/B49)',
    b49.lotH >= 134.76 * b49.rs - 1);

  // Default selection: PNC Bank, wearing the B132 glow (one token, soft bloom)
  await page.waitForTimeout(300);   // let the 200ms box-shadow transition settle
  const glow = await page.evaluate(() => {
    const card = document.querySelector('.topband__card');
    const s = getComputedStyle(card);
    return { borderColor: s.borderColor, shadow: s.boxShadow };
  });
  ok('default selection is PNC Bank',
    await page.locator('#employer-pnc-bank').isChecked());
  ok('selected card glows: border-color + 0 0 8px 0 bloom, one token',
    glow.borderColor === 'rgb(125, 99, 64)' &&
    glow.shadow === 'rgb(125, 99, 64) 0px 0px 8px 0px');

  // Unselected cards carry no glow
  const unselectedGlow = await page.evaluate(() =>
    getComputedStyle(document.querySelectorAll('.topband__card')[1]).boxShadow);
  ok('unselected cards carry no bloom', !unselectedGlow.includes('rgb(125, 99, 64)'));

  // §2: the body is split by a ruled bar; content swaps with the selection
  ok('a .split__rule bar divides the body',
    await page.locator('.split__rule').first().isVisible());
  ok('default body is PNC Bank',
    await page.locator('.employer--pnc-bank').isVisible() &&
    !(await page.locator('.employer--pnc-private').isVisible()) &&
    !(await page.locator('.employer--brinker').isVisible()));

  await page.locator('.topband__card-hit[for="employer-pnc-private"]').click();
  ok('selecting PNC Private Bank swaps the body',
    await page.locator('.employer--pnc-private').isVisible() &&
    !(await page.locator('.employer--pnc-bank').isVisible()));
  ok('PNC Private Bank body shows its own role titles as gm-title cards',
    /client service associate/i.test(await page.locator('#role-pnc-private').innerText()));
  await page.waitForTimeout(300);
  ok('the glow moved to the newly selected card',
  await page.evaluate(() => {
    const shadows = [...document.querySelectorAll('.topband__card')]
      .map(c => getComputedStyle(c).boxShadow);
    return shadows[1].includes('rgb(125, 99, 64)') && !shadows[0].includes('rgb(125, 99, 64)');
  }));

  // B55 (issue #154) rewrites the blank-slot assertions deliberately: the
  // description cards now render EMPTY ON PURPOSE (B55 owner override of the
  // omit-empty rule), so the subject is the plugin components themselves.
  // (1) each shown tab renders exactly the right number of components with
  // the exact titles + years from the issue body, verbatim; (2) every desc
  // card is empty and min-height ≥ 116px; (3) tab isolation; (4) no CTA, no
  // selector row; (5) plates contained in the left half.
  const ROLES = {
    'employer-pnc-bank': [
      ['Branch Sales & Service Representative', '2017-2018'],
      ['Branch Sales & Service Associate', '2018-2019'],
      ['Branch Banker', '2019-2020'],
    ],
    'employer-pnc-private': [
      ['Client Service Associate', '2020-2021'],
      ['Portfolio & Trust Administrator', '2021-2022'],
    ],
    'employer-brinker': [
      ['Trader', '2022-2023'],
      ['Portfolio Specialist', '2023'],
      ['Sr. Portfolio Specialist', '2023-2025'],
    ],
  };
  for (const [tab, roles] of Object.entries(ROLES)) {
    await page.locator(`.topband__card-hit[for="${tab}"]`).click();
    await page.waitForTimeout(150);
    const sel = `.${tab.replace('employer-', 'employer--')}`;
    const got = await page.evaluate(s => {
      const section = document.querySelector(s);
      return [...section.querySelectorAll('.gregorian-mode')].map(p => [
        p.querySelector('.gm-title').textContent.trim(),
        p.querySelector('.gm-uc').textContent.trim(),
      ]);
    }, sel);
    ok(`${tab}: ${roles.length} components with the issue's exact titles+years`,
      JSON.stringify(got) === JSON.stringify(roles));
    ok(`${tab}: desc cards empty, visible, min-height ≥ 116px (B55)`,
      await page.evaluate(s =>
        [...document.querySelector(s).querySelectorAll('.gm-desc')].every(d =>
          d.innerText.trim() === '' && d.getBoundingClientRect().height > 0 &&
          parseFloat(getComputedStyle(d).minHeight) >= 116), sel));
    ok(`${tab}: components isolated to their tab`,
      await page.evaluate(s =>
        [...document.querySelectorAll('section.employer')]
          .filter(sec => !sec.matches(s))
          .flatMap(sec => [...sec.querySelectorAll('.gregorian-mode')])
          .every(p => p.getBoundingClientRect().height === 0), sel));
    ok(`${tab}: plates equally sized (equal flex cells)`,
      await page.evaluate(s => {
        const hs = [...document.querySelector(s).querySelectorAll('.gregorian-mode')]
          .map(p => p.getBoundingClientRect().height);
        return hs.length > 0 && Math.max(...hs) - Math.min(...hs) < 1;
      }, sel));
    ok(`${tab}: plates contained in the left half — right edge < the rule (B55)`,
      await page.evaluate(s => {
        const section = document.querySelector(s);
        const ruleLeft = section.querySelector('.split__rule').getBoundingClientRect().left;
        return [...section.querySelectorAll('.gregorian-mode')]
          .every(p => p.getBoundingClientRect().right < ruleLeft);
      }, sel));
  }
  // back to the default tab for the rest of the suite
  await page.locator('.topband__card-hit[for="employer-pnc-bank"]').click();
  ok('no .gm-cta and no item selector row anywhere (B55)',
    await page.locator('.gm-cta').count() === 0 &&
    await page.evaluate(() =>
      !document.querySelector('[name="plugin-select"], .plugins__radio, .plugins__tab')));
  ok('each employer body still carries its gm-title cards and slot comments for the owner\'s fill passes',
    await page.evaluate(() =>
      [...document.querySelectorAll('section.employer')].every(s =>
        !!s.querySelector('.gm-title') && s.innerHTML.includes('SLOT:'))));

  // §3: the footer is the parking-lot grammar, three sections, two dividers
  ok('footer has three content sections',
    await page.locator('.parking-lot__facts').count() === 2 &&
    await page.locator('.parking-lot .cta').count() === 1);
  ok('two divider bars separate the three sections',
    await page.locator('.parking-lot__divider').count() === 2);
  ok('dividers are 1px wide and 3/4 of the section length', await page.evaluate(() => {
    const d = document.querySelector('.parking-lot__divider');
    const bar = parseFloat(getComputedStyle(d, '::before').height);
    const lot = document.querySelector('.parking-lot').getBoundingClientRect();
    return getComputedStyle(d, '::before').width === '1px' &&
      Math.abs(bar - 0.75 * (lot.height - 24)) < 6;
  }));
  ok('the CTA reads "Learn More about Rob" and links back to razgregory.com',
    (await page.locator('.parking-lot .cta').innerText()).trim() === 'Learn More about Rob' &&
    (await page.locator('.parking-lot .cta').getAttribute('href')) === 'https://razgregory.com/');
  ok('footer blurb and contact slots ship empty', await page.evaluate(() =>
    [...document.querySelectorAll('.parking-lot__facts')].every(f => f.innerText.trim() === '')));

  // §4: the sand/brown ladder re-hues TheBoards' token roles
  const tokens = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    return {
      deep: cs.getPropertyValue('--deep').trim(),
      card: cs.getPropertyValue('--card').trim(),
      frame: cs.getPropertyValue('--frame').trim(),
      note: cs.getPropertyValue('--note').trim(),
      glow: cs.getPropertyValue('--glow-sand').trim(),
    };
  });
  ok('the ladder is sand/brown, not the To-Do blue', tokens.deep === '#12100a' &&
    tokens.card === '#241c0f' && tokens.frame === '#9a7c52' && tokens.note === '#e8d9b0');
  const lum = hex => {
    const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  ok('luminance ladder holds: card one step above deep, glow one rung below frame (B132 rule)',
    lum(tokens.card) > lum(tokens.deep) && lum(tokens.card) / lum(tokens.deep) < 4 &&
    lum(tokens.glow) < lum(tokens.frame));

  // ≤743px: the shown employer stacks — halves full-width, the rule
  // horizontal (the mobile split law; the wrapper-less grid is the trap)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(200);
  ok('at 390px the shown employer stacks: full-width halves, horizontal rule, no overflow',
    await page.evaluate(() => {
      const shown = [...document.querySelectorAll('section.employer')]
        .find(s => s.getBoundingClientRect().height > 0);
      const half = shown.querySelector('.split__gallery').getBoundingClientRect();
      const rule = shown.querySelector('.split__rule').getBoundingClientRect();
      const overflow = document.documentElement.scrollWidth > document.documentElement.clientWidth;
      return half.width > 300 && rule.height <= 2 && rule.width < half.width && !overflow;
    }));
  // a11y: the selector is a named radio group; one off-canvas h1, equal wordmarks
  await page.setViewportSize({ width: 1440, height: 1110 });
  ok('the selector is a named radio group and headings do not encode selection',
    await page.evaluate(() =>
      document.querySelector('[role="radiogroup"]')?.getAttribute('aria-label') === 'Choose an employer' &&
      document.querySelectorAll('h1').length === 1 &&
      document.querySelector('h1').classList.contains('visually-hidden') &&
      document.querySelectorAll('h2.topband__wordmark').length === 3));
  ok('transitions collapse under prefers-reduced-motion', await page.evaluate(() => {
    const sheet = [...document.styleSheets].find(s => s.ownerNode && !s.href);
    return [...sheet.cssRules].some(r => r.media && r.media.mediaText.includes('prefers-reduced-motion'));
  }));

  await browser.close();
  console.log(failures === 0 ? '\nAll career checks passed.' : `\n${failures} failure(s).`);
  process.exit(failures === 0 ? 0 : 1);
})();
