/* test/plantsandrocks.js — the Plants & Rocks page (issue #134, B48):
   two-page selector over the band rule, B132 glow mechanism on the selected
   card, the poles reader rendering the shipped monstera-storybook.html
   iframe (issue #156, B57 — deliberate rewrite of the blank-body pin) while
   the rocks reader stays empty, two-section parking lot with one divider, a
   rendered-but-disabled Download button, and the literal TheBoards
   idea-board green palette (byte-exact, NOT a re-hue). Single file, zero
   script on plantsandrocks.html itself, zero <link>.
   Black-box Playwright, career.js's harness.
   Run: node test/plantsandrocks.js   (PORTFOLIO_URL default http://localhost:8000/plantsandrocks.html) */

const { chromium } = require('playwright');

const URL = process.env.PORTFOLIO_URL || 'http://localhost:8000/plantsandrocks.html';
let failures = 0;
const ok = (label, cond) => { if (!cond) failures++; console.log(`${cond ? 'PASS' : 'FAIL'} ${label}`); };

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(URL, { waitUntil: 'networkidle' });

  // Single-file law: no scripts, no stylesheets, no deps
  ok('no <script> elements', await page.locator('script').count() === 0);
  ok('no external stylesheets or links', await page.locator('link').count() === 0);
  ok('no external network requests beyond the page itself', await page.evaluate(() => performance.getEntriesByType('resource')
    .every(r => r.name.startsWith('data:') || r.name.startsWith(location.origin))));

  // §1: two title cards, one per page, over the band rule
  const names = await page.locator('.topband__card .topband__wordmark').allInnerTexts();
  ok('two page cards', names.length === 2);
  ok('cards are "Plants on Poles" and "Plants in Rocks"',
    JSON.stringify(names) === JSON.stringify(['Plants on Poles', 'Plants in Rocks']));

  // The owner's oneliner copy (B48, verbatim) — these slots are NOT blank
  const oneliners = await page.locator('.topband__card .topband__oneliner').allInnerTexts();
  ok('the owner\'s oneliner copy renders verbatim',
    JSON.stringify(oneliners) === JSON.stringify(
      ['Monstera Division and Moss Pole Guide', 'Planting in Semi-Hydroponics With Pon']));

  // Cards hang over the header rule
  const hang = await page.evaluate(() => {
    const band = document.querySelector('.topband');
    const card = document.querySelector('.topband__card');
    return card.getBoundingClientRect().bottom > band.getBoundingClientRect().bottom;
  });
  ok('title cards hang over the header line', hang);

  // B50 (issue #140): the band, cards and lot render at B49's landing-page
  // conventions — B46's height-anchored scale (rs = vh/1104.55), B31's card
  // box, the lot's two-row-shelf floor — re-tokened to the idea-green block.
  // (Deliberate rewrite: the old pin asserted the -14px margin mechanism.)
  const b50 = await page.evaluate(() => {
    const band = document.querySelector('.topband').getBoundingClientRect();
    const card = document.querySelector('.topband__card');
    const r = card.getBoundingClientRect();
    const cs = getComputedStyle(card);
    const lot = document.querySelector('.parking-lot').getBoundingClientRect();
    const rs = innerHeight / 1104.55;
    return { bandH: band.height, hang: r.bottom - band.bottom, font: cs.fontSize,
             borderTop: cs.borderTopWidth, radius: cs.borderBottomLeftRadius,
             cardW: r.width, lotH: lot.height, rs };
  });
  ok('band renders at the landing height-anchored scale: rule-y = 67.38 × vh/1104.55 (B46/B50)',
    Math.abs(b50.bandH - 67.38 * b50.rs) < 1);
  ok('card hangs 29 × rs over the rule (B31/B50)',
    Math.abs(b50.hang - 29 * b50.rs) < 1);
  ok('card type is the 20px logical rung: font-size = 20 × rs (B31/B50)',
    Math.abs(parseFloat(b50.font) - 20 * b50.rs) < 0.5);
  ok('card is the B31 box: border-top 0, radius only on the bottom corners, content-sized',
    // content-sized hug: ~250px at 1440×900 (the B48 oneliner copy is long);
    // <400 is a sanity bound against regression to the old full-width cell (~690px)
    b50.borderTop === '0px' && parseFloat(b50.radius) > 0 && b50.cardW < 400);
  ok('lot is floored at the rescaled two-row shelf: 134.76 × rs (B46/B73/B50)',
    b50.lotH >= 134.76 * b50.rs - 1);

  // Default selection: Plants on Poles, wearing the glow (one token, soft bloom)
  await page.waitForTimeout(300);   // let the 200ms box-shadow transition settle
  const glow = await page.evaluate(() => {
    const card = document.querySelector('.topband__card');
    const s = getComputedStyle(card);
    return { borderColor: s.borderColor, shadow: s.boxShadow };
  });
  ok('default selection is Plants on Poles',
    await page.locator('#page-poles').isChecked());
  ok('selected card glows: border-color + 0 0 8px 0 bloom, one token (--frame #52997f)',
    glow.borderColor === 'rgb(82, 153, 127)' &&
    glow.shadow === 'rgb(82, 153, 127) 0px 0px 8px 0px');

  // Unselected cards carry no glow
  const unselectedGlow = await page.evaluate(() =>
    getComputedStyle(document.querySelectorAll('.topband__card')[1]).boxShadow);
  ok('unselected cards carry no bloom', !unselectedGlow.includes('rgb(82, 153, 127)'));

  // §2: the readers (B57, issue #156 — deliberate rewrite of B48's
  // blank-body pin): the Plants on Poles reader renders the shipped
  // monstera-storybook.html in an iframe filling the body edge-to-edge;
  // the Plants in Rocks reader stays empty.
  ok('the poles reader renders the storybook iframe: src, title, fills the width',
    await page.evaluate(() => {
      const reader = document.querySelector('.reader--poles');
      const ifr = reader && reader.querySelector('iframe');
      if (!ifr) return false;
      const r = ifr.getBoundingClientRect();
      const rr = reader.getBoundingClientRect();
      return ifr.getAttribute('src') === 'monstera-storybook.html' &&
        ifr.getAttribute('title') === 'Monstera Division and Moss Pole Introduction' &&
        getComputedStyle(ifr).borderWidth === '0px' &&
        Math.abs(r.width - innerWidth) < 1 &&
        Math.abs(rr.width - innerWidth) < 1;
    }));
  ok('the storybook iframe actually loads its document (non-zero content height)',
    await page.evaluate(() =>
      document.querySelector('.reader--poles iframe').contentDocument &&
      document.querySelector('.reader--poles iframe').contentDocument.body.scrollHeight > 0));
  ok('the storybook iframe sits below the title-card overhang (no overlap)',
    await page.evaluate(() => {
      const ifr = document.querySelector('.reader--poles iframe').getBoundingClientRect();
      const card = document.querySelector('.topband__card').getBoundingClientRect();
      return ifr.top >= card.bottom - 1;
    }));
  ok('the rocks reader stays a bare empty container',
    await page.evaluate(() => {
      const reader = document.querySelector('.reader--rocks');
      return reader.innerText.trim() === '' &&
        reader.children.length === 0 &&
        reader.querySelector('img, iframe, h2, h3, p, span') === null;
    }));

  await page.locator('.topband__card-hit[for="page-rocks"]').click();
  ok('selecting Plants in Rocks swaps the selection (body swaps between the two reader containers)',
    await page.locator('#page-rocks').isChecked() &&
    !(await page.locator('#page-poles').isChecked()));
  await page.waitForTimeout(300);
  ok('the glow moved to the newly selected card',
  await page.evaluate(() => {
    const shadows = [...document.querySelectorAll('.topband__card')]
      .map(c => getComputedStyle(c).boxShadow);
    return shadows[1].includes('rgb(82, 153, 127)') && !shadows[0].includes('rgb(82, 153, 127)');
  }));
  ok('after the swap the rocks reader renders and the poles reader is hidden',
    await page.evaluate(() => {
      const rocks = document.querySelector('.reader--rocks');
      const poles = document.querySelector('.reader--poles');
      return rocks.getBoundingClientRect().height > 0 &&
        rocks.children.length === 0 && rocks.innerText.trim() === '' &&
        getComputedStyle(poles).display === 'none';
    }));

  // §3: the footer is the parking-lot grammar, two sections, one divider
  ok('footer has two sections and one divider bar',
    await page.locator('.parking-lot__facts').count() === 2 &&
    await page.locator('.parking-lot__divider').count() === 1);
  ok('the divider is 1px wide and 3/4 of the section length', await page.evaluate(() => {
    const d = document.querySelector('.parking-lot__divider');
    const bar = parseFloat(getComputedStyle(d, '::before').height);
    const lot = document.querySelector('.parking-lot').getBoundingClientRect();
    return getComputedStyle(d, '::before').width === '1px' &&
      Math.abs(bar - 0.75 * (lot.height - 24)) < 6;
  }));
  ok('the left footer section renders nothing (measures zero)',
    await page.evaluate(() => {
      const f = document.querySelector('.parking-lot__facts');
      return f.innerText.trim() === '' && f.getBoundingClientRect().height === 0;
    }));

  // The Download button: rendered but DISABLED (B48, owner ruling)
  const cta = page.locator('.parking-lot .cta');
  ok('the Download button renders', (await cta.innerText()).trim() === 'Download' && await cta.count() === 1);
  ok('the Download button is disabled: aria-disabled + disabled + dimmed, no handler',
    (await cta.getAttribute('aria-disabled')) === 'true' &&
    (await cta.getAttribute('disabled')) !== null &&
    (await cta.getAttribute('onclick')) === null);
  ok('the Download button is dimmed at 0.55 and cannot hover-bloom', await page.evaluate(() => {
    const b = document.querySelector('.parking-lot .cta');
    const s = getComputedStyle(b);
    const sheet = [...document.styleSheets].find(sh => sh.ownerNode && !sh.href);
    let hover = null;
    for (const r of sheet.cssRules) {
      const inner = r.selectorText ? [r] : [...(r.cssRules || [])];
      hover = inner.find(x => x.selectorText && x.selectorText.includes('.cta') && x.selectorText.includes(':hover'));
      if (hover) break;
    }
    return s.opacity === '0.55' && s.cursor === 'not-allowed' &&
      hover && hover.selectorText.includes(':not([disabled])');
  }));

  // §4: the palette is the LITERAL idea-board green block (byte-exact)
  const tokens = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    return {
      deep: cs.getPropertyValue('--deep').trim(),
      card: cs.getPropertyValue('--card').trim(),
      waterTop: cs.getPropertyValue('--water-top').trim(),
      waterMid: cs.getPropertyValue('--water-mid').trim(),
      waterBot: cs.getPropertyValue('--water-bot').trim(),
      waterBotA: cs.getPropertyValue('--water-bot-a').trim(),
      frame: cs.getPropertyValue('--frame').trim(),
      note: cs.getPropertyValue('--note').trim(),
      inkLight: cs.getPropertyValue('--ink-light').trim(),
      inkDark: cs.getPropertyValue('--ink-dark').trim(),
    };
  });
  ok('the palette is the literal idea-board green block (byte-exact, not a re-hue)',
    tokens.deep === '#000a06' && tokens.card === '#001a0e' &&
    tokens.waterTop === '#486b49' && tokens.waterMid === '#345439' &&
    tokens.waterBot === '#1f3825' && tokens.waterBotA === '31 56 37' &&
    tokens.frame === '#52997f' && tokens.note === '#b9d2b2');
  ok('the ink neutrals come from TheBoards :root verbatim',
    tokens.inkLight === '#f4f5f1' && tokens.inkDark === '#031019');

  // ≤743px: the band stacks to one column, the lot stacks
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(200);
  ok('at 390px the band stacks to one column and the lot stacks, no overflow',
    await page.evaluate(() => {
      const band = getComputedStyle(document.querySelector('.topband')).gridTemplateColumns;
      const overflow = document.documentElement.scrollWidth > document.documentElement.clientWidth;
      return !band.includes(' ') && !overflow;
    }));
  ok('at 390px the poles reader still renders the storybook iframe full-width, below the cards',
    await (async () => {
      // re-select Plants on Poles: the swap step above left Plants in Rocks checked
      await page.locator('.topband__card-hit[for="page-poles"]').click();
      await page.waitForTimeout(200);
      return page.evaluate(() => {
        const ifr = document.querySelector('.reader--poles iframe');
        if (!ifr) return false;
        const r = ifr.getBoundingClientRect();
        const card = document.querySelector('.topband__card').getBoundingClientRect();
        return Math.abs(r.width - innerWidth) < 1 && r.top >= card.bottom - 1;
      });
    })());

  // a11y: the selector is a named radio group; one off-canvas h1
  await page.setViewportSize({ width: 1440, height: 900 });
  ok('the selector is a named radio group and headings do not encode selection',
    await page.evaluate(() =>
      document.querySelector('[role="radiogroup"]')?.getAttribute('aria-label') === 'Choose a page' &&
      document.querySelectorAll('h1').length === 1 &&
      document.querySelector('h1').classList.contains('visually-hidden') &&
      document.querySelector('h1').innerText.trim() === 'Plants & Rocks' &&
      document.querySelectorAll('h2.topband__wordmark').length === 2));
  ok('transitions collapse under prefers-reduced-motion', await page.evaluate(() => {
    const sheet = [...document.styleSheets].find(s => s.ownerNode && !s.href);
    return [...sheet.cssRules].some(r => r.media && r.media.mediaText.includes('prefers-reduced-motion'));
  }));

  await browser.close();
  console.log(failures === 0 ? '\nAll plantsandrocks checks passed.' : `\n${failures} failure(s).`);
  process.exit(failures === 0 ? 0 : 1);
})();
