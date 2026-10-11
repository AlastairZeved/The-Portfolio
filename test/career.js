/* test/career.js — the career page (issue #133, B47): three-way employer
   selector, the B132 glow on the selected title card, split body with ruled bar,
   two-section parking lot with one divider, the B65 tools line and the B77
   education line beneath it (issue #193), CTA back
   to razgregory.com, the monochrome token ladder (B73), and the plugin components
   in the body's left half (issue #154, B56 — desc cards render EMPTY on
   purpose except the three B64 fills of issue #176). B81 (issue #212) rebuilds
   the left half as the Agentic Plugins page's stage + item-selector band — one
   role's component presented at a time, the role title cards with the full glow
   (glimmer, hover, press, checked/dim-italic) and the .gm-back breathing bloom.
   B74 (issue #186) still bounds the page to one viewport with the description
   card as the only scroll container, and B76 (issue #194) still renders the
   agentic-plugins source geometry scaled uniformly by the plate's own width
   (title card straddling the back card's top edge, desc card wider than the
   back card and ending within its span, type at the source ratios with an 11px
   readable floor, long titles wrap, a filled card's styled bar always visible).
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
  // issue #195 (B79) deliberately rewrites the old "content-sized" wording:
  // the law is now ONE SHARED SIZE across the three cards (asserted below
  // from the measured rects), not a per-card content hug. The < 300 sanity
  // bound stays — it guards regression to the old full-width grid cell
  // (~440px).
  ok('card is the B31 box: border-top 0, radius only on the bottom corners, hug width bounded under the grid cell (issue #195, B79 rewrite)',
    b49.borderTop === '0px' && parseFloat(b49.radius) > 0 && b49.cardW < 300);
  ok('lot is floored at the rescaled two-row shelf: 134.76 × rs (B46/B73/B49)',
    b49.lotH >= 134.76 * b49.rs - 1);

  // issue #195 (B79): the three title cards render at one shared size —
  // each hugs the widest of the three labels ("PNC Private Bank") — and the
  // two gaps between them are equal. Numbers computed from the measured
  // rects (the B49 measurement block's spirit); the shared width is the
  // widest label's own content hug, so the B31 hug-the-text box grammar
  // stands and no width is invented.
  const m195 = () => page.evaluate(() => {
    const rs = [...document.querySelectorAll('.topband__card')].map(c => c.getBoundingClientRect());
    return { w: rs.map(r => r.width), h: rs.map(r => r.height),
             gaps: [rs[1].left - rs[0].right, rs[2].left - rs[1].right] };
  });
  const shared195 = m => m.w.every(w => Math.abs(w - m.w[0]) < 0.5) &&
    m.h.every(h => Math.abs(h - m.h[0]) < 0.5);
  const equalGaps195 = m => Math.abs(m.gaps[0] - m.gaps[1]) < 0.5;
  const base195 = await m195();
  ok('all three title cards render at one shared size (issue #195, B79)',
    shared195(base195));
  ok('the three title cards are equally spaced apart (issue #195, B79)',
    equalGaps195(base195));

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
  // issue #195 (B79): the shared size and equal gaps hold across a selection
  // change — the two unselected wordmarks render italic (the dim-italic
  // state) and the boxes stay identical.
  const pick195 = await m195();
  ok('the shared card size holds after a selection change (issue #195, B79)',
    shared195(pick195));
  ok('the gaps stay equal after a selection change (issue #195, B79)',
    equalGaps195(pick195));

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
  // B81 (issue #212) rewrites this loop deliberately: the left half is now a
  // stage + item-selector band, not a B66 left-to-right row. Each employer's
  // band shows exactly its role cards; the default role is checked and its
  // component is the one shown in the stage; clicking a role card swaps it;
  // desc cards — B64 copy where filled, empty otherwise; the shown component
  // renders B76's source geometry. (The old assertions — plate count and
  // even spacing in a row — are gone with the row.)
  for (const [tab, roles] of Object.entries(ROLES)) {
    await page.locator(`.topband__card-hit[for="${tab}"]`).click();
    await page.waitForTimeout(300);
    const sel = `.${tab.replace('employer-', 'employer--')}`;
    const base = tab.replace('employer-', 'role-');   // role-pnc-bank, …
    const band = await page.evaluate(s => {
      const pane = document.querySelector(s).querySelector('.plugins__pane');
      return [...pane.querySelectorAll('.plugins__tab')].map(t => t.textContent.trim());
    }, sel);
    ok(`${tab}: the band shows exactly its ${roles.length} role title cards`,
      JSON.stringify(band) === JSON.stringify(roles.map(r => r[0])));
    ok(`${tab}: the band is a named radio group (aria-label "Choose a role")`,
      await page.evaluate(s =>
        document.querySelector(s).querySelector('.plugins__pane')
          ?.getAttribute('aria-label') === 'Choose a role', sel));

    for (let i = 0; i < roles.length; i++) {
      const rid = `${base}-${i + 1}`;
      await page.evaluate(id => document.getElementById(id).click(), rid);
      await page.waitForTimeout(200);
      const shown = await page.evaluate(({ s, b64 }) => {
        const p = [...document.querySelector(s).querySelectorAll('.plugin')]
          .find(x => x.getBoundingClientRect().height > 0);
        const t = p.querySelector('.gm-title').textContent.trim();
        const y = p.querySelector('.gm-uc').textContent.trim();
        const d = p.querySelector('.gm-desc');
        const nrm = x => x.replace(/\s+/g, ' ').trim();
        const filled = b64[t];
        return {
          title: t, year: y,
          descIs: nrm(d.innerText),
          descWant: filled ? nrm(filled.join(' ')) : '',
          descOverflow: getComputedStyle(d).overflowY,
          visibleCount: [...document.querySelector(s).querySelectorAll('.plugin')]
            .filter(x => x.getBoundingClientRect().height > 0).length,
        };
      }, { s: sel, b64: B64_COPY });
      ok(`${tab}: role ${i + 1} clicks through to "${roles[i][0]}" (${roles[i][1]}), exactly one component shown`,
        shown.title === roles[i][0] && shown.year === roles[i][1] && shown.visibleCount === 1);
      ok(`${tab}: role ${i + 1} desc card — B64 copy verbatim where filled, empty otherwise${shown.descWant ? ', the filled card scrolls' : ', the empty card stays bare'}`,
        shown.descIs === shown.descWant &&
        (shown.descWant ? shown.descOverflow === 'scroll' : shown.descOverflow !== 'scroll'));
    }
  }
  // B74 (issue #186): above the breakpoint the page is ONE viewport — it does
  // not scroll — and every component caps at half the left half's own height;
  // the row is centred in the half and the description card is the page's only
  // scroll container. Deliberate new assertions for the ruling.
  // B74 (issue #186; left-half cap restated by B81, issue #212): above the
  // breakpoint the page is ONE viewport — it does not scroll — and the single
  // shown component caps at the stage's height (the stage fills the half above
  // the band); the description card is the page's only scroll container.
  for (const tab of ['employer-pnc-bank', 'employer-pnc-private', 'employer-brinker']) {
    await page.locator(`.topband__card-hit[for="${tab}"]`).click();
    await page.waitForTimeout(300);
    const sel = `.${tab.replace('employer-', 'employer--')}`;
    ok(`${tab}: B74 — the page fits one viewport, no page scroll at the design canvas`,
      await page.evaluate(() => {
        const de = document.documentElement;
        return de.scrollHeight <= de.clientHeight + 1 && de.scrollWidth <= de.clientWidth + 1;
      }));
    ok(`${tab}: B74/B81 — the stage bounds its one shown component (no component escapes the half)`,
      await page.evaluate(s => {
        const shown = document.querySelector(s);
        const stage = shown.querySelector('.plugins__stage').getBoundingClientRect();
        const plate = [...shown.querySelectorAll('.plugin')]
          .find(p => p.getBoundingClientRect().height > 0)
          .querySelector('.gregorian-mode').getBoundingClientRect();
        return plate.height <= stage.height + 1 && plate.width <= stage.width + 1;
      }, sel));
    ok(`${tab}: B74 — the shown description card stays inside its component (the cap never cuts the card)`,
      await page.evaluate(s => {
        const shown = document.querySelector(s);
        const p = [...shown.querySelectorAll('.plugin')]
          .find(x => x.getBoundingClientRect().height > 0)
          .querySelector('.gregorian-mode');
        const d = p.querySelector('.gm-desc').getBoundingClientRect();
        const plate = p.getBoundingClientRect();
        return d.bottom <= plate.bottom + 1 && d.top >= plate.top - 1;
      }, sel));
  }
  await page.locator('.topband__card-hit[for="employer-brinker"]').click();
  await page.waitForTimeout(300);
  // issue #195 (B79): the shared size and equal gaps hold with Brinker
  // selected too (the other two wordmarks italic).
  const brk195 = await m195();
  ok('the shared card size holds with Brinker selected (issue #195, B79)',
    shared195(brk195));
  ok('the gaps stay equal with Brinker selected (issue #195, B79)',
    equalGaps195(brk195));
  ok('B74 — the overflowing description scrolls inside its own card, never the page (Brinker, Sr. Portfolio Specialist)',
    await page.evaluate(() => {
      const plate = [...document.querySelectorAll('.employer--brinker .plugin')]
        .find(x => x.getBoundingClientRect().height > 0).querySelector('.gregorian-mode');
      const d = plate.querySelector('.gm-desc');
      const de = document.documentElement;
      // B81: at the design canvas the one-across component is large enough that
      // the filled desc does not overflow; the ALWAYS-present styled bar
      // (overflow-y: scroll) still reads, the card stays inside the plate, and
      // the page never scrolls. The actual overflow scroll is asserted at a
      // short viewport in the B76 block below.
      return getComputedStyle(d).overflowY === 'scroll' &&
        d.getBoundingClientRect().bottom <= plate.getBoundingClientRect().bottom + 1 &&
        de.scrollHeight <= de.clientHeight + 1;
    }));

  // B76 (issue #194) geometry, restated by B81 (issue #212): the component
  // still renders the agentic-plugins SOURCE geometry scaled uniformly by its
  // own width (container queries, 1 source px = plate-width/830), but there is
  // now ONE component per employer in the stage at the stage's full width —
  // the B76 "two-across bigger than three-across" row-count law is superseded
  // (every role renders at the one-across stage width). The type ratios, the
  // straddle, the wider desc card, the back-card overhang, the 11px floor,
  // long-title wrap and the always-visible filled-card bar all stand; B81 also
  // adds the breathing presentation bloom on the back card.
  // (Headless Chromium force-enables overlay scrollbars, so the bar's painted
  // width is verified in a real browser — see the PR; the styling contract and
  // the scroll behaviour are asserted here.)
  const b76 = async (vp, tab = 'employer-brinker', roleId = 'role-brinker-3') => {
    const pg = await browser.newPage({ viewport: vp });
    await pg.goto(URL, { waitUntil: 'networkidle' });
    await pg.locator(`.topband__card-hit[for="${tab}"]`).click();
    await pg.waitForTimeout(300);
    await pg.evaluate(id => document.getElementById(id).click(), roleId);
    await pg.waitForTimeout(300);
    const out = await pg.evaluate(t => {
      const r = e => e.getBoundingClientRect();
      const plate = [...document.querySelectorAll(`.employer--${t.slice(9)} .plugin`)]
        .find(x => x.getBoundingClientRect().height > 0).querySelector('.gregorian-mode');
      const emptyPlate = [...document.querySelectorAll(`.employer--${t.slice(9)} .plugin`)]
        .map(x => x.querySelector('.gregorian-mode'))
        .find(p => p.querySelector('.gm-desc').innerText.trim() === '');
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
        backPast: r(k).bottom - r(d).bottom,   // the back card extends past the desc card (B76)
        gap: r(d).top > r(t2).bottom,
        overflowY: getComputedStyle(d).overflowY,
        emptyOverflowY: getComputedStyle(emptyPlate.querySelector('.gm-desc')).overflowY,
        sbWidth: getComputedStyle(d, '::-webkit-scrollbar').width,
        sbThumb: getComputedStyle(d, '::-webkit-scrollbar-thumb').backgroundColor,
        sbTrack: getComputedStyle(d, '::-webkit-scrollbar-track').backgroundColor,
        backAnim: getComputedStyle(k).animationName,
        scrolls: d.scrollHeight > d.clientHeight + 1,
        descInPlate: r(d).bottom <= r(plate).bottom + 1 && r(d).top >= r(plate).top - 1,
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
  ok('B76 — the title card straddles the back card\'s top edge, with a gap to the desc card below it',
    canvasB76.straddle && canvasB76.gap);
  ok('B76 — the desc card is wider than the back card, which extends vertically past it (the source\'s 112px strip below the card)',
    canvasB76.descWider && canvasB76.descWithin &&
    Math.abs(canvasB76.backPast - 112 * canvasB76.plateW / 830) < 2);
  ok('B76 — a filled desc card ALWAYS shows the styled in-card bar (6px, the card\'s own ink, transparent track)',
    canvasB76.overflowY === 'scroll' && canvasB76.sbWidth === '6px' &&
    canvasB76.sbThumb === 'rgb(8, 8, 8)' && canvasB76.sbTrack === 'rgba(0, 0, 0, 0)');
  ok('B76 — the empty desc card stays bare (no scroll region, as the owner ruled)',
    canvasB76.emptyOverflowY !== 'scroll');
  ok('B81 — the presented component\'s back card carries the breathing bloom (gm-breathe)',
    canvasB76.backAnim === 'gm-breathe');
  ok('B76/B81 — the design canvas fits one viewport, the desc card stays inside its component',
    !canvasB76.pageScrolls && canvasB76.descInPlate);
  // B74 scroll law at a short (but non-deferred) viewport: the stage is short
  // enough that the filled description overflows and scrolls inside its own
  // card — the page never scrolls, and the desc stays within its component.
  const shortDetail = await b76({ width: 744, height: 600 }, 'employer-brinker', 'role-brinker-3');
  ok('B74 — at 744×600 the overflowing description scrolls inside its own card, never the page',
    shortDetail.scrolls && shortDetail.overflowY === 'scroll' &&
    shortDetail.descInPlate && !shortDetail.pageScrolls);
  // Short/landscape viewports: the page still fits one viewport (no scroll),
  // and the 11px floor keeps the type readable where the ratios would shrink
  // it away. The "nothing is clipped" half of these two checks is DEFERRED:
  // with the footer's second line (B77, issue #193) the bar grows in windows
  // this short, and the owner ruled 2026-10-09 that mobile is its own issue.
  const shortB76 = await b76({ width: 744, height: 400 });
  ok('B76 — 744×400: the page still fits one viewport and the type holds its 11px floor (clip check deferred, owner 2026-10-09)',
    !shortB76.pageScrolls &&
    shortB76.titleFS >= 11 && shortB76.descFS >= 11 && shortB76.yearFS >= 11);
  const landB76 = await b76({ width: 844, height: 390 });
  ok('B76 — 844×390 (landscape phone): the page still fits one viewport (clip check deferred, owner 2026-10-09)',
    !landB76.pageScrolls);

  // back to the default tab for the rest of the suite
  await page.locator('.topband__card-hit[for="employer-pnc-bank"]').click();
  await page.waitForTimeout(300);
  ok('no .gm-cta anywhere; the B81 item selector band ships its role radios + title cards (supersedes B56\'s no-selector clause)',
    await page.locator('.gm-cta').count() === 0 &&
    await page.evaluate(() =>
      document.querySelectorAll('.plugins__radio').length === 8 &&
      document.querySelectorAll('.plugins__tab').length === 8 &&
      document.querySelectorAll('.plugins__pane').length === 3));
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
  // B77 (issue #193): the owner's second line sits beneath the tools line,
  // its straight bars rendered as the SAME short bars as the top line
  ok('the education line renders the owner\'s copy beneath the tools line, three short bars between tokens (B77)',
    await page.evaluate(() => {
      const lines = [...document.querySelectorAll('.parking-lot__facts .parking-lot__tools')];
      if (lines.length !== 2) return false;
      const t = lines[1];
      const tokens = [...t.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).filter(Boolean);
      const bars = [...t.querySelectorAll('.parking-lot__tools-bar')];
      const above = lines[0].getBoundingClientRect();
      const self = t.getBoundingClientRect();
      return JSON.stringify(tokens) === JSON.stringify(['Maryville University of St. Louis', 'B.S. Accounting', '2021', 'Magna cum laude']) &&
        bars.length === 3 &&
        self.top >= above.bottom - 1 &&
        self.top - above.bottom < 3 * parseFloat(getComputedStyle(t).fontSize);
    }));
  ok('the education line\'s bars are identical to the top line\'s short bars — same width, height, palette (B77)',
    await page.evaluate(() => {
      const lines = [...document.querySelectorAll('.parking-lot__facts .parking-lot__tools')];
      if (lines.length !== 2) return false;
      const a = getComputedStyle(lines[0].querySelector('.parking-lot__tools-bar'));
      const b = getComputedStyle(lines[1].querySelector('.parking-lot__tools-bar'));
      return a.width === b.width && a.height === b.height &&
        a.backgroundColor === b.backgroundColor;
    }));
  ok('the CTA reads "Learn More about Rob" and links back to razgregory.com',
    (await page.locator('.parking-lot .cta').innerText()).trim() === 'Learn More about Rob' &&
    (await page.locator('.parking-lot .cta').getAttribute('href')) === 'https://razgregory.com/');
  ok('the footer right half (contact slot) still ships empty; left half carries the two owner lines (B65, B77)',
    await page.evaluate(() => {
      const [left, right] = document.querySelectorAll('.parking-lot__facts');
      const rightOwn = [...right.childNodes]
        .filter(n => n.nodeType === 3)
        .map(n => n.textContent.trim()).join('');
      return rightOwn === '' &&
        left.querySelectorAll('.parking-lot__tools').length === 2;
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
  // issue #195 (B79): the stacked cards share one width at the mobile type
  // rung too (the sizer inherits the 1.1rem wordmark).
  ok('the stacked title cards share one width at 390px (issue #195, B79)',
    await page.evaluate(() => {
      const ws = [...document.querySelectorAll('.topband__card')].map(c => c.getBoundingClientRect().width);
      return ws.every(w => Math.abs(w - ws[0]) < 0.5);
    }));
  ok('the stacked title cards are equally spaced at 390px (issue #195, B79)',
    await page.evaluate(() => {
      const rs = [...document.querySelectorAll('.topband__card')].map(c => c.getBoundingClientRect());
      const gaps = [rs[1].top - rs[0].bottom, rs[2].top - rs[1].bottom];
      return Math.abs(gaps[0] - gaps[1]) < 0.5;
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
