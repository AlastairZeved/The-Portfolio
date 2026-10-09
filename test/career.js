/* test/career.js — the career page (issue #133, B47): three-way employer
   selector, B132 glow on the selected title card, split body with ruled bar,
   two-section parking lot with one divider and the B65 tools line, CTA back
   to razgregory.com, the monochrome token ladder (B73), and the plugin components
   in the body's left half (issue #154, B56 — desc cards render EMPTY on
   purpose except the three B64 fills of issue #176); above the breakpoint
   B74 (issue #186) bounds them — one viewport, the component capped at half
   the left half's own height, the description card the only scroll container —
   and B76 (issue #194) renders the agentic-plugins source geometry scaled
   uniformly by the plate's own width (title card straddling the back card's
   top edge, desc card wider than the back card and ending within its span,
   type at the source ratios with an 11px readable floor, long titles wrap,
   a filled card's styled bar always visible).
   Single file,
   zero script, zero <link>. Black-box Playwright.
   Run: node test/career.js   (PORTFOLIO_URL default http://localhost:8000/career.html)
   Viewport note: the desktop run is at the page's own design canvas
   (REF_H ≈ 1104.55 → rs = 1), because the band's literals render at the
   B46 scale (--rs); the B76 component literals scale by the plate's own
   width instead (container queries), so their assertions are computed from
   the measured plate width. */

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
  // issue #168/B63: favicons ship as same-origin <link rel="icon"> on every
  // page — the single-file law forbids stylesheets and off-origin refs, not
  // the site's own favicon links (the resource-origin guard below still
  // holds that line; this assertion rewrite is deliberate).
  ok('no stylesheets or off-origin links — only the B63 favicon links',
    await page.locator('link').evaluateAll(ls => ls.every(l =>
      ['icon', 'apple-touch-icon', 'shortcut icon'].includes(l.rel) &&
      l.href.startsWith(location.origin))));
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
    glow.borderColor === 'rgb(103, 103, 103)' &&
    glow.shadow === 'rgb(103, 103, 103) 0px 0px 8px 0px');

  // Unselected cards carry no glow
  const unselectedGlow = await page.evaluate(() =>
    getComputedStyle(document.querySelectorAll('.topband__card')[1]).boxShadow);
  ok('unselected cards carry no bloom', !unselectedGlow.includes('rgb(103, 103, 103)'));

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
    return shadows[1].includes('rgb(103, 103, 103)') && !shadows[0].includes('rgb(103, 103, 103)');
  }));

  // B64 (issue #176) rewrites the desc-card assertions deliberately: three
  // desc cards now carry the owner's copy verbatim (B64), the rest stay
  // EMPTY ON PURPOSE (B56 owner override of the omit-empty rule). The
  // subject is the plugin components themselves: (1) each shown tab renders
  // exactly the right number of components with the exact titles + years
  // from the issue body, verbatim; (2) each filled desc card renders the
  // issue's copy (whitespace-normalized) and the others render empty, all
  // visible at the B56 min-height; (3) tab isolation; (4) no CTA, no
  // selector row; (5) plates contained in the left half.
  const B64_COPY = {
    'Branch Banker': [
      'Completed the PNC Leadership Development Program, a high-performer program focused on preparing associates for advancement into specialized financial roles.',
      'Deployed across the PDSJ region to onboard and coach Branch Relationship Managers on multi-channel client-book development.',
      'Consistently outperformed branch sales goals while maintaining exceptional client service.',
    ],
    'Portfolio & Trust Administrator': [
      'Managed end-to-end account setup, funding, and servicing for complex irrevocable trust portfolios within a highly regulated environment.',
      'Served as a primary point of contact for trust officers, legal counsel, and beneficiaries, coordinating across stakeholders to resolve complex account and servicing requirements.',
      'Translated client and operational requirements into practical solutions while balancing service quality, underlying data, and regulatory constraints.',
    ],
    'Sr. Portfolio Specialist': [
      'Manage daily trade execution across client liquidity needs, portfolio re-allocations, and new business for the firm’s $12B UHNW Wealth Management UMA products.',
      'Mapped, documented, and trained the end-to-end trading workflows for new UMA product offerings and SRM platform migrations while maintaining SLA performance without client or business disruption.',
      'Architected the Brinker Trading PowerBI dashboard 0->1, partnering with a developer, to monitor daily trading volume and metrics previously siloed in vendor databases to develop actionable KPI metrics, automated alerts, and data visualizations using the 3-30-300 framework.',
    ],
  };
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
    await page.waitForTimeout(300);
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
    ok(`${tab}: desc cards — B64 copy verbatim where filled, the empty placeholder at ≥ 116 × plate-width/830 (B56/B64/B74, scaled per B76)`,
      await page.evaluate(({ s, b64 }) => {
        const nrm = t => t.replace(/\s+/g, ' ').trim();
        return [...document.querySelector(s).querySelectorAll('.gregorian-mode')].every(p => {
          const d = p.querySelector('.gm-desc');
          const filled = b64[p.querySelector('.gm-title').textContent.trim()];
          const want = filled ? filled.join(' ') : '';
          // B74 deliberate rewrite: the B56 floor now renders as the empty
          // placeholder's flex basis, not a min-height — so the floor is
          // asserted on the empty card's rendered box, in the B76 scale unit
          // (116 source px of the 830px design × the plate's own width).
          const u = p.getBoundingClientRect().width / 830;
          return nrm(d.innerText) === nrm(want) && d.getBoundingClientRect().height > 0 &&
            (filled || d.getBoundingClientRect().height >= 116 * u - 1);
        });
      }, { s: sel, b64: B64_COPY }));
    ok(`${tab}: components isolated to their tab`,
      await page.evaluate(s =>
        [...document.querySelectorAll('section.employer')]
          .filter(sec => !sec.matches(s))
          .flatMap(sec => [...sec.querySelectorAll('.gregorian-mode')])
          .every(p => p.getBoundingClientRect().height === 0), sel));
    ok(`${tab}: plates evenly spaced in the B66 left-to-right row, contained in the half, content fits (B56/B66 as amended by B64)`,
      await page.evaluate(s => {
        const nrm = Math.min(innerHeight / 1104.55, innerWidth / 1440);
        const plates = [...document.querySelector(s).querySelectorAll('.gregorian-mode')];
        if (!plates.length) return false;
        const rects = plates.map(p => p.getBoundingClientRect());
        const gap = 20 * nrm; // 1.25rem at rs
        // B66: the plates read left to right — chronological order leftmost,
        // horizontal gutter between neighbours, one row (equal tops).
        const spaced = rects.slice(1).every((r, i) =>
          Math.abs((r.left - rects[i].right) - gap) < 3) &&
          rects.slice(1).every((r, i) => r.left > rects[i].right) &&
          rects.slice(1).every(r => Math.abs(r.top - rects[0].top) < 3);
        const half = document.querySelector(s).querySelector('.split__gallery').getBoundingClientRect();
        const ruleLeft = document.querySelector(s).querySelector('.split__rule').getBoundingClientRect().left;
        const contained = rects.every(r => r.right < ruleLeft && r.left >= half.left - 1);
        const fits = plates.every(p =>
          p.querySelector('.gm-desc').getBoundingClientRect().bottom <=
          p.getBoundingClientRect().bottom + 1);
        return spaced && contained && fits;
      }, sel));
  }
  // B74 (issue #186): above the breakpoint the page is ONE viewport — it does
  // not scroll — and every component caps at half the left half's own height;
  // the row is centred in the half and the description card is the page's only
  // scroll container. Deliberate new assertions for the ruling.
  for (const tab of ['employer-pnc-bank', 'employer-pnc-private', 'employer-brinker']) {
    await page.locator(`.topband__card-hit[for="${tab}"]`).click();
    await page.waitForTimeout(300);
    const sel = `.${tab.replace('employer-', 'employer--')}`;
    ok(`${tab}: B74 — the page fits one viewport, no page scroll at the design canvas`,
      await page.evaluate(() => {
        const de = document.documentElement;
        return de.scrollHeight <= de.clientHeight + 1 && de.scrollWidth <= de.clientWidth + 1;
      }));
    ok(`${tab}: B74 — every component caps at half the left half's own height; the half is not a scroll container`,
      await page.evaluate(s => {
        const shown = document.querySelector(s);
        const half = shown.querySelector('.split__gallery');
        const cap = shown.getBoundingClientRect().height / 2;
        return [...shown.querySelectorAll('.gregorian-mode')]
          .every(p => p.getBoundingClientRect().height <= cap + 1) &&
          half.scrollHeight <= half.clientHeight + 1;
      }, sel));
    ok(`${tab}: B74 — the row is vertically centred in the left half`,
      await page.evaluate(s => {
        const shown = document.querySelector(s);
        const gal = shown.querySelector('.split__gallery').getBoundingClientRect();
        const emp = shown.getBoundingClientRect();
        return Math.abs((gal.top - emp.top) - (emp.bottom - gal.bottom)) < 2;
      }, sel));
    ok(`${tab}: B74 — every description card stays inside its component (the cap never cuts the card)`,
      await page.evaluate(s => {
        const shown = document.querySelector(s);
        return [...shown.querySelectorAll('.gregorian-mode')].every(p => {
          const d = p.querySelector('.gm-desc').getBoundingClientRect();
          const plate = p.getBoundingClientRect();
          return d.bottom <= plate.bottom + 1 && d.top >= plate.top - 1;
        });
      }, sel));
  }
  await page.locator('.topband__card-hit[for="employer-brinker"]').click();
  await page.waitForTimeout(300);
  ok('B74 — the overflowing description scrolls inside its own card, never the page (Brinker, Sr. Portfolio Specialist)',
    await page.evaluate(() => {
      const plate = [...document.querySelectorAll('.employer--brinker .gregorian-mode')]
        .find(p => /Sr\. Portfolio Specialist/.test(p.querySelector('.gm-title').textContent));
      const d = plate.querySelector('.gm-desc');
      const de = document.documentElement;
      return d.scrollHeight > d.clientHeight + 1 &&
        getComputedStyle(d).overflowY === 'scroll' &&
        d.getBoundingClientRect().bottom <= plate.getBoundingClientRect().bottom + 1 &&
        de.scrollHeight <= de.clientHeight + 1;
    }));

  // B76 (issue #194): the components render the agentic-plugins SOURCE
  // geometry, scaled uniformly by each plate's own width (container
  // queries): the title card straddles the back card\x27s top edge with a gap
  // to the desc card, the desc card is wider than the back card and ends
  // within its vertical span, the type renders at the source ratios (title
  // 28, year 14, desc 20 per 830px plate) with the owner's 11px readable
  // floor, long titles wrap, and a FILLED desc card always shows the styled
  // in-card bar while the empty placeholder stays bare.
  // (Headless Chromium force-enables overlay scrollbars, so the bar's painted
  // width is verified in a real browser — see the PR; the styling contract and
  // the scroll behaviour are asserted here.)
  const b76 = async (vp, tab = 'employer-brinker') => {
    const pg = await browser.newPage({ viewport: vp });
    await pg.goto(URL, { waitUntil: 'networkidle' });
    await pg.locator(`.topband__card-hit[for="${tab}"]`).click();
    await pg.waitForTimeout(300);
    const out = await pg.evaluate(t => {
      const r = e => e.getBoundingClientRect();
      const plates = [...document.querySelectorAll(`.employer--${t.slice(9)} .gregorian-mode`)];
      const plate = plates[plates.length - 1];   // the filled desc card (B64)
      const emptyPlate = plates[0];
      const d = plate.querySelector('.gm-desc');
      const t2 = plate.querySelector('.gm-title'), k = plate.querySelector('.gm-back');
      const de = document.documentElement;
      return {
        plateW: r(plate).width,
        titleFS: parseFloat(getComputedStyle(t2).fontSize),
        descFS: parseFloat(getComputedStyle(d).fontSize),
        yearFS: parseFloat(getComputedStyle(plate.querySelector('.gm-uc')).fontSize),
        straddle: r(t2).top < r(k).top && r(k).top < r(t2).bottom,
        descWider: r(d).width > r(k).width,
        descWithin: r(d).bottom <= r(k).bottom + 1,
        backPast: r(k).bottom - r(d).bottom,   // the back card extends past the desc card (B76 correction)
        gap: r(d).top > r(t2).bottom,
        overflowY: getComputedStyle(d).overflowY,
        emptyOverflowY: getComputedStyle(emptyPlate.querySelector('.gm-desc')).overflowY,
        sbWidth: getComputedStyle(d, '::-webkit-scrollbar').width,
        sbThumb: getComputedStyle(d, '::-webkit-scrollbar-thumb').backgroundColor,
        sbTrack: getComputedStyle(d, '::-webkit-scrollbar-track').backgroundColor,
        scrolls: d.scrollHeight > d.clientHeight + 1,
        nothingClipped: plates.every(pl =>
          ['.gm-title', '.gm-uc', '.gm-desc'].every(s => {
            const e = pl.querySelector(s);
            return !e || e.getBoundingClientRect().bottom <= r(pl).bottom + 1;
          })),
        pageScrolls: de.scrollHeight > de.clientHeight + 1,
      };
    }, tab);
    await pg.close();
    return out;
  };
  const canvasB76 = await b76({ width: 1440, height: 1110 });
  ok('B76 — the type renders at the source ratios with the 11px readable floor (design canvas)',
    Math.abs(canvasB76.titleFS - Math.max(28 * canvasB76.plateW / 830, 11)) < 0.6 &&
    Math.abs(canvasB76.descFS - Math.max(20 * canvasB76.plateW / 830, 11)) < 0.6 &&
    Math.abs(canvasB76.yearFS - Math.max(14 * canvasB76.plateW / 830, 11)) < 0.6);
  ok('B76 — the title card straddles the back card\x27s top edge, with a gap to the desc card below it',
    canvasB76.straddle && canvasB76.gap);
  ok('B76 — the desc card is wider than the back card, which extends vertically past it (the source\u2019s 112px strip below the card)',
    canvasB76.descWider && canvasB76.descWithin &&
    Math.abs(canvasB76.backPast - 112 * canvasB76.plateW / 830) < 2);
  ok('B76 — a filled desc card ALWAYS shows the styled in-card bar (6px, the card\x27s own ink, transparent track)',
    canvasB76.overflowY === 'scroll' && canvasB76.sbWidth === '6px' &&
    canvasB76.sbThumb === 'rgb(8, 8, 8)' && canvasB76.sbTrack === 'rgba(0, 0, 0, 0)');
  ok('B76 — the empty desc card stays bare (no scroll region, as the owner ruled)',
    canvasB76.emptyOverflowY !== 'scroll');
  ok('B76 — the page fits one viewport and no component is clipped (design canvas)',
    !canvasB76.pageScrolls && canvasB76.nothingClipped);
  // Plate-relative scaling: the two-across employer (PNC Private Bank) renders
  // larger plates — and therefore larger type — than the three-across rows at
  // the same viewport, wherever the 11px floor does not bind (2560×1440).
  const wide3B76 = await b76({ width: 2560, height: 1440 }, 'employer-brinker');
  const wide2B76 = await b76({ width: 2560, height: 1440 }, 'employer-pnc-private');
  ok('B76 — plate-relative: the two-across row renders bigger components and type than the three-across row (2560×1440)',
    wide2B76.plateW > wide3B76.plateW && wide2B76.descFS > wide3B76.descFS &&
    Math.abs(wide2B76.descFS - Math.max(20 * wide2B76.plateW / 830, 11)) < 0.6 &&
    Math.abs(wide3B76.descFS - Math.max(20 * wide3B76.plateW / 830, 11)) < 0.6);
  // Short/landscape viewports: the law is absolute (one viewport, nothing
  // cut), and the 11px floor keeps the type readable where the ratios would
  // shrink it away.
  const shortB76 = await b76({ width: 744, height: 400 });
  ok('B76 — 744×400: the page still fits one viewport, nothing is clipped, and the type holds its 11px floor',
    !shortB76.pageScrolls && shortB76.nothingClipped &&
    shortB76.titleFS >= 11 && shortB76.descFS >= 11 && shortB76.yearFS >= 11);
  const landB76 = await b76({ width: 844, height: 390 });
  ok('B76 — 844×390 (landscape phone): the page still fits one viewport and no component is clipped',
    !landB76.pageScrolls && landB76.nothingClipped);

  // back to the default tab for the rest of the suite
  await page.locator('.topband__card-hit[for="employer-pnc-bank"]').click();
  ok('no .gm-cta and no item selector row anywhere (B56)',
    await page.locator('.gm-cta').count() === 0 &&
    await page.evaluate(() =>
      !document.querySelector('[name="plugin-select"], .plugins__radio, .plugins__tab')));
  ok('each employer body still carries its gm-title cards and slot comments for the owner\'s fill passes',
    await page.evaluate(() =>
      [...document.querySelectorAll('section.employer')].every(s =>
        !!s.querySelector('.gm-title') && s.innerHTML.includes('SLOT:'))));

  // §3 (B65, issue #177): the footer is the parking-lot grammar, two
  // sections, one divider — the owner's tools line left, the CTA right
  ok('footer has two content sections with one CTA',
    await page.locator('.parking-lot__facts').count() === 2 &&
    await page.locator('.parking-lot .cta').count() === 1);
  ok('one divider bar remains (B65: the second is removed)',
    await page.locator('.parking-lot__divider').count() === 1);
  ok('the divider bar is 1px wide and 3/4 of the section length', await page.evaluate(() => {
    const d = document.querySelector('.parking-lot__divider');
    const bar = parseFloat(getComputedStyle(d, '::before').height);
    const lot = document.querySelector('.parking-lot').getBoundingClientRect();
    return getComputedStyle(d, '::before').width === '1px' &&
      Math.abs(bar - 0.75 * (lot.height - 24)) < 6;
  }));
  ok('the tools line renders the owner\'s copy on one line, five short bars between tokens (B65)',
    await page.evaluate(() => {
      const t = document.querySelector('.parking-lot__tools');
      const tokens = [...t.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).filter(Boolean);
      const bars = [...t.querySelectorAll('.parking-lot__tools-bar')];
      const cs = getComputedStyle(t);
      return JSON.stringify(tokens) === JSON.stringify(['Orion Technology', 'Factset', 'Morningstar', 'Docupace', 'BPM', 'Salesforce']) &&
        bars.length === 5 &&
        t.getBoundingClientRect().height < 3 * parseFloat(cs.fontSize);
    }));
  ok('the short bars are 1px, markedly shorter than the footer divider, same palette (B65)',
    await page.evaluate(() => {
      const bar = getComputedStyle(document.querySelector('.parking-lot__tools-bar'));
      const d = document.querySelector('.parking-lot__divider');
      const full = getComputedStyle(d, '::before');
      const barH = parseFloat(bar.height);
      const fullH = parseFloat(full.height);
      return bar.width === '1px' && full.width === '1px' &&
        barH < fullH / 4 &&
        bar.backgroundColor === full.backgroundColor;
    }));
  ok('the CTA reads "Learn More about Rob" and links back to razgregory.com',
    (await page.locator('.parking-lot .cta').innerText()).trim() === 'Learn More about Rob' &&
    (await page.locator('.parking-lot .cta').getAttribute('href')) === 'https://razgregory.com/');
  ok('footer right half (contact slot) still ships empty; left half carries only the tools line (B65)',
    await page.evaluate(() => {
      const [left, right] = document.querySelectorAll('.parking-lot__facts');
      const rightOwn = [...right.childNodes]
        .filter(n => n.nodeType === 3)
        .map(n => n.textContent.trim()).join('');
      return rightOwn === '' && left.querySelector('.parking-lot__tools') !== null;
    }));

  // B65 mid-band: the tools line wraps rather than overflowing where the
  // one-line rendering cannot fit (744px–~1000px)
  const mid = await browser.newPage({ viewport: { width: 800, height: 1110 } });
  await mid.goto(URL, { waitUntil: 'networkidle' });
  ok('no footer overflow at 800px — the tools line wraps, the CTA stays inside the lot (B65)',
    await mid.evaluate(() => {
      const lot = document.querySelector('.parking-lot');
      const edge = lot.getBoundingClientRect().right;
      return lot.scrollWidth <= lot.clientWidth + 1 &&
        [...lot.querySelectorAll('*')].every(el =>
          el.getBoundingClientRect().right <= edge + 1);
    }));
  await mid.close();

  // §4: the B73 monochrome ladder re-derives TheBoards' token roles as a
  // pure neutral gray scale at the landing palette's luminance rungs
  // (issue #190; deliberate rewrite of the B47 sand/brown pins)
  const tokens = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    return {
      deep: cs.getPropertyValue('--deep').trim(),
      card: cs.getPropertyValue('--card').trim(),
      frame: cs.getPropertyValue('--frame').trim(),
      note: cs.getPropertyValue('--note').trim(),
      glow: cs.getPropertyValue('--glow-gray').trim(),
    };
  });
  ok('the ladder is monochrome gray, at the landing palette luminance rungs', tokens.deep === '#080808' &&
    tokens.card === '#151515' && tokens.frame === '#8c8c8c' && tokens.note === '#cbcbcb');
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
