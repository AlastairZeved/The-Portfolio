/* test/career.js — the career page (issue #133, B47): three-way employer
   selector, B132 glow on the selected title card, split body with ruled bar,
   two-section parking lot with one divider, the B65 tools line and the B77
   education line beneath it (issue #193), CTA back
   to razgregory.com, the monochrome token ladder (B73), and — since B81
   (issue #212) — the left half's agentic-plugins item selector design: a
   STAGE presenting the one band-selected role's plugin component (B56/B76
   internals: source geometry, 11px floor, long-title wrap, the always-
   visible styled in-card bar on filled desc cards, empty cards bare) with
   the title-card selector BAND beneath it (one card per role, role name +
   the year subscript, most-recent default, per-employer radio group, hover glow
   + glimmer in --frame, the presented component's cards unglimmered).
   B74's one-viewport render stands: the page never scrolls, the
   description card the only scroll container. B81's SECOND correction
   (owner, PR #213 review, 2026-10-11: "Agentic-plugins positions its item
   selector just above the footer and makes use of all of the width and
   vertical height"): the stage + band column owns the half's FULL box —
   the stage flexes from the COLUMN TOP, the band PINNED AT THE COLUMN
   BOTTOM just above the footer (the source pane's position) — B74's
   half-cap and centring die.
   Single file, zero script, zero <link>. Black-box Playwright.
   Run: node test/career.js   (PORTFOLIO_URL default http://localhost:8000/career.html)
   Viewport note: the desktop run is at the page's own design canvas
   (REF_H ≈ 1104.55 → rs = 1), because the band's literals render at the
   B46 scale (--rs); the component literals scale by the plate's own
   width (container queries), so their assertions are computed from the
   measured plate width. */

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
  // ---- B81 (issue #212): the left half's item selector band + stage.
  // Deliberate rewrite of the B56/B64/B66/B76 body pins: the plates no
  // longer read left-to-right across the half — one is PRESENTED on the
  // stage, the rest launch from the band beneath it. Pinned: per-employer
  // radio band (one group per employer under the unchanged header
  // selector), band cards reading role name + year subscript in
  // chronological order, default = the MOST RECENT role's card, the
  // selected/unselected card states, the stage presenting exactly one
  // component whose title/year match the checked card, band card clicks
  // swapping the presented component, B64 copy verbatim on the filled
  // cards (read while presented), tab isolation, and the desc-card
  // empty/filled discipline carried from B56/B64.
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
  const EMPLOYERS = {
    'employer-pnc-bank': {
      group: 'pnc-bank-role', aria: 'Choose a PNC Bank role', mostRecent: 'pnc-banker',
      roles: [
        ['pnc-rep', 'Branch Sales & Service Representative', '2017-2018'],
        ['pnc-associate', 'Branch Sales & Service Associate', '2018-2019'],
        ['pnc-banker', 'Branch Banker', '2019-2020'],
      ],
    },
    'employer-pnc-private': {
      group: 'pnc-private-role', aria: 'Choose a PNC Private Bank role', mostRecent: 'ppb-pta',
      roles: [
        ['ppb-csa', 'Client Service Associate', '2020-2021'],
        ['ppb-pta', 'Portfolio & Trust Administrator', '2021-2022'],
      ],
    },
    'employer-brinker': {
      group: 'brinker-role', aria: 'Choose a Brinker Capital role', mostRecent: 'brinker-sr-specialist',
      roles: [
        ['brinker-trader', 'Trader', '2022-2023'],
        ['brinker-specialist', 'Portfolio Specialist', '2023'],
        ['brinker-sr-specialist', 'Sr. Portfolio Specialist', '2023-2025'],
      ],
    },
  };
  const stageOf = sel => `${sel} .career__stage`;
  const bandOf = sel => `${sel} .career__band`;
  for (const [tab, E] of Object.entries(EMPLOYERS)) {
    await page.locator(`.topband__card-hit[for="${tab}"]`).click();
    await page.waitForTimeout(300);
    const sel = `.${tab.replace('employer-', 'employer--')}`;
    // the band: a named per-employer radio group with one card per role
    const band = await page.evaluate(({ sel, E }) => {
      const b = document.querySelector(sel + ' .career__band');
      const radios = [...b.querySelectorAll('.career__radio')];
      const cards = [...b.querySelectorAll('.career__tab')].map(l => ({
        name: l.childNodes.length ? l.childNodes[0].textContent.trim() : '',
        year: l.querySelector('.career__tab-year').textContent.trim(),
        color: getComputedStyle(l).color,
        italic: getComputedStyle(l).fontStyle,
        bg: getComputedStyle(l).backgroundColor,
        rect: l.getBoundingClientRect().toJSON(),
      }));
      return {
        role: b.getAttribute('role'), aria: b.getAttribute('aria-label'),
        group: radios[0].name, radioCount: radios.length, cardCount: cards.length,
        checkedId: b.querySelector('.career__radio:checked')?.id, cards,
      };
    }, { sel, E });
    ok(`${tab}: the band is a named per-employer radio group (one group per employer, B81)`,
      band.role === 'radiogroup' && band.aria === E.aria && band.group === E.group &&
      band.radioCount === E.roles.length && band.cardCount === E.roles.length);
    ok(`${tab}: band cards read the role name + the year subscript, chronological (B81)`,
      JSON.stringify(band.cards.map(c => [c.name, c.year])) ===
        JSON.stringify(E.roles.map(r => [r[1], r[2]])));
    ok(`${tab}: default presented role is the MOST RECENT one's card (B81)`,
      band.checkedId === E.mostRecent);
    // the stage presents exactly one component — the checked card's role
    const stage = await page.evaluate(({ sel, E }) => {
      const st = document.querySelector(sel + ' .career__stage');
      const roles = [...document.querySelector(sel).querySelectorAll('.role')];
      const visible = roles.filter(w => getComputedStyle(w).display === 'block');
      const plate = visible[0].querySelector('.gregorian-mode');
      const r = e => e.getBoundingClientRect();
      return {
        visibleCount: visible.length,
        title: plate.querySelector('.gm-title').textContent.trim(),
        year: plate.querySelector('.gm-uc').textContent.trim(),
        plateW: r(plate).width, stageW: r(st).width, stageH: r(st).height,
        plateTop: r(plate).top, stageTop: r(st).top,
        plateLeft: r(plate).left, stageLeft: r(st).left,
        plateRight: r(plate).right, stageRight: r(st).right,
        plateBottom: r(plate).bottom, stageBottom: r(st).bottom,
        insideStage: r(plate).right <= r(st).right + 1 && r(plate).bottom <= r(st).bottom + 1 &&
          r(plate).top >= r(st).top - 1 && r(plate).left >= r(st).left - 1,
        pluginH: parseFloat(getComputedStyle(visible[0]).getPropertyValue('--plugin-h')),
      };
    }, { sel, E });
    ok(`${tab}: the stage presents EXACTLY ONE component — the checked card's role (B81)`,
      stage.visibleCount === 1 &&
      stage.title === E.roles.find(r => r[0] === band.checkedId)[1] &&
      stage.year === E.roles.find(r => r[0] === band.checkedId)[2]);
    ok(`${tab}: the presented plate stays inside the stage, top-anchored (B81)`,
      stage.insideStage && Math.abs(stage.plateTop - stage.stageTop) < 1);
    // the plate's width follows the source's min-ratio law: min(the stage's
    // width, 830px × the stage's height over the role's measured --plugin-h)
    ok(`${tab}: the plate scales by the stage's min-ratio law over the 830px source design (B81)`,
      Math.abs(stage.plateW - Math.min(stage.stageW, 830 * stage.stageH / stage.pluginH)) < 2);
    // selected/unselected card states (the source's .plugins__tab grammar)
    ok(`${tab}: unselected cards are dim + italic, the checked card is ink-light (B81)`,
      band.cards.filter((_, i) => E.roles[i][0] !== band.checkedId)
        .every(c => c.color === 'rgba(244, 245, 241, 0.55)' && c.italic === 'italic' && c.bg === 'rgb(21, 21, 21)') &&
      band.cards[E.roles.findIndex(r => r[0] === band.checkedId)].color === 'rgb(244, 245, 241)' &&
      band.cards[E.roles.findIndex(r => r[0] === band.checkedId)].italic === 'normal');
    // band cards equal width, evenly spaced (the source's equal flex cells)
    const ws = band.cards.map(c => c.rect.width);
    ok(`${tab}: the band's cards are equal flex cells across the row (B81)`,
      ws.every(w => Math.abs(w - ws[0]) < 0.5) &&
      band.cards.slice(1).every((c, i) => Math.abs(c.rect.left - band.cards[i].rect.right - 8) < 2));
    // clicking a band card swaps the presented component
    const other = E.roles.find(r => r[0] !== band.checkedId);
    await page.locator(`label[for="${other[0]}"]`).click();
    await page.waitForTimeout(300);
    const swapped = await page.evaluate(({ sel }) => {
      const shown = [...document.querySelector(sel).querySelectorAll('.role')]
        .filter(w => getComputedStyle(w).display === 'block');
      const plate = shown[0].querySelector('.gregorian-mode');
      return {
        count: shown.length,
        title: plate.querySelector('.gm-title').textContent.trim(),
        year: plate.querySelector('.gm-uc').textContent.trim(),
        checked: document.querySelector(sel + ' .career__band .career__radio:checked').id,
      };
    }, { sel });
    ok(`${tab}: clicking a band card launches its role — the stage presents it (B81)`,
      swapped.count === 1 && swapped.checked === other[0] &&
      swapped.title === other[1] && swapped.year === other[2]);
    // B64 copy verbatim, read while the role is presented; the empty
    // cards stay empty (B56's override), each at the B56 116u floor.
    for (const [rid, name, year] of E.roles) {
      const filled = B64_COPY[name];
      if (!filled) continue;
      await page.locator(`label[for="${rid}"]`).click();
      await page.waitForTimeout(200);
      ok(`${tab}/${name}: the B64 copy renders verbatim in the presented desc card (B64)`,
        await page.evaluate(({ sel, filled }) => {
          const nrm = t => t.replace(/\s+/g, ' ').trim();
          const shown = [...document.querySelector(sel).querySelectorAll('.role')]
            .filter(w => getComputedStyle(w).display === 'block');
          const d = shown[0].querySelector('.gm-desc');
          return nrm(d.innerText) === nrm(filled.join(' ')) && d.getBoundingClientRect().height > 0;
        }, { sel, filled }));
    }
    // tab isolation: the other employers' sections render nothing
    ok(`${tab}: components isolated to their tab (B56)`,
      await page.evaluate(s =>
        [...document.querySelectorAll('section.employer')]
          .filter(sec => !sec.matches(s))
          .every(sec => sec.getBoundingClientRect().height === 0), sel));
  }

  // ---- B74 (issue #186), as it stands under B81 + the issue #213 review's
  // second correction: above the breakpoint the page is ONE viewport — it
  // does not scroll — and the STAGE + BAND COLUMN OWNS THE HALF'S FULL BOX
  // (all the width, top of the column to its bottom — the owner, PR #213
  // review, 2026-10-11: "Agentic-plugins positions its item selector just
  // above the footer and makes use of all of the width and vertical
  // height"): the STAGE takes ALL the column height above the band
  // (flex: 1, from the COLUMN TOP — career has no boards carousel, so the
  // source's boards-plate-top stage offset does not port) and the BAND is
  // PINNED AT THE COLUMN BOTTOM, just above the footer, its 1.25rem bottom
  // margin floating the gutter above the column's bottom edge (the source
  // pane's own position). B74's half-cap and vertical centring die here
  // (deliberate rewrite); its one-viewport render stands, the plate never
  // overflows the stage (max-height caps it) and the description card
  // remains the page's only scroll container. ----
  for (const tab of ['employer-pnc-bank', 'employer-pnc-private', 'employer-brinker']) {
    await page.locator(`.topband__card-hit[for="${tab}"]`).click();
    await page.waitForTimeout(300);
    const sel = `.${tab.replace('employer-', 'employer--')}`;
    ok(`${tab}: B74 — the page fits one viewport, no page scroll at the design canvas`,
      await page.evaluate(() => {
        const de = document.documentElement;
        return de.scrollHeight <= de.clientHeight + 1 && de.scrollWidth <= de.clientWidth + 1;
      }));
    ok(`${tab}: B81/#213 2nd correction — the stage + band column owns the half's FULL box: the gallery fills the employer row (B74's half-cap dead), the stage runs from the column top, the band pinned at the column bottom just above the footer, the half no scroll container`,
      await page.evaluate(s => {
        const shown = document.querySelector(s);
        const gal = shown.querySelector('.split__gallery');
        const st = shown.querySelector('.career__stage').getBoundingClientRect();
        const b = shown.querySelector('.career__band').getBoundingClientRect();
        const g = gal.getBoundingClientRect();
        const sec = shown.getBoundingClientRect();       // the 1fr grid row
        const footer = document.querySelector('.parking-lot').getBoundingClientRect();
        const bm = parseFloat(getComputedStyle(shown.querySelector('.career__band')).marginBottom);
        return Math.abs(g.top - sec.top) < 1 &&          // full column: top edge of the employer row
          Math.abs(g.height - sec.height) < 2 &&          // full vertical height (not B74's half)
          Math.abs(g.left - sec.left) < 1 &&              // from the column's own left edge (full width)
          Math.abs(st.width - g.width) < 1 &&             // the stage spans the column's width
          Math.abs(b.width - g.width) < 1 &&              // the band spans it too
          Math.abs(st.top - g.top) < 1 &&                 // the stage from the column top
          b.top >= st.bottom - 1 &&                      // the band beneath the stage
          Math.abs(g.bottom - b.bottom - bm) < 2 &&      // pinned: its bottom margin above the column bottom
          b.bottom < footer.top - 1 &&                  // just above the footer
          gal.scrollHeight <= gal.clientHeight + 1;      // the half is not a scroll container
      }, sel));
    ok(`${tab}: B81 — the band sits beneath the stage; the stage presents one plate inside it`,
      await page.evaluate(s => {
        const shown = document.querySelector(s);
        const st = shown.querySelector('.career__stage').getBoundingClientRect();
        const b = shown.querySelector('.career__band').getBoundingClientRect();
        const plates = [...shown.querySelectorAll('.role')]
          .filter(w => w.getBoundingClientRect().height > 0);
        const p = plates[0].querySelector('.gregorian-mode').getBoundingClientRect();
        return b.top >= st.bottom - 1 && plates.length === 1 &&
          p.right <= st.right + 1 && p.bottom <= st.bottom + 1 && p.top >= st.top - 1;
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
  // issue #195 (B79): the shared size and equal gaps hold with Brinker
  // selected too (the other two wordmarks italic).
  const brk195 = await m195();
  ok('the shared card size holds with Brinker selected (issue #195, B79)',
    shared195(brk195));
  ok('the gaps stay equal with Brinker selected (issue #195, B79)',
    equalGaps195(brk195));
  ok('B81/#213 — the full-column stage holds the Brinker plate: the filled desc card renders INSIDE the plate at the design canvas (the old half-cap overflow premise is dead), nothing past the plate, the page never scrolls',
    await page.evaluate(() => {
      const shown = [...document.querySelectorAll('section.employer--brinker .role')]
        .filter(w => getComputedStyle(w).display === 'block');
      const plate = shown[0].querySelector('.gregorian-mode');
      const d = plate.querySelector('.gm-desc');
      const de = document.documentElement;
      return getComputedStyle(d).overflowY === 'scroll' &&   // the filled card keeps the styled in-card bar
        d.getBoundingClientRect().bottom <= plate.getBoundingClientRect().bottom + 1 &&
        de.scrollHeight <= de.clientHeight + 1;
    }));
  // Where a viewport's stage cap does force the copy past the desc card
  // (measured at 1024×768 after the #213 re-pin), it scrolls INSIDE its own
  // card — never past the plate, never the page.
  {
    const pg = await browser.newPage({ viewport: { width: 1024, height: 768 } });
    await pg.goto(URL, { waitUntil: 'networkidle' });
    await pg.locator('.topband__card-hit[for="employer-brinker"]').click();
    await pg.waitForTimeout(300);
    ok('B74 — where the copy overflows (1024×768) the description scrolls inside its own card, never past the plate, never the page (Brinker, Sr. Portfolio Specialist)',
      await pg.evaluate(() => {
        const shown = [...document.querySelectorAll('section.employer--brinker .role')]
          .filter(w => getComputedStyle(w).display === 'block');
        const plate = shown[0].querySelector('.gregorian-mode');
        const d = plate.querySelector('.gm-desc');
        const de = document.documentElement;
        return d.scrollHeight > d.clientHeight + 1 &&
          getComputedStyle(d).overflowY === 'scroll' &&
          d.getBoundingClientRect().bottom <= plate.getBoundingClientRect().bottom + 1 &&
          de.scrollHeight <= de.clientHeight + 1;
      }));
    await pg.close();
  }

  // ---- B76's surviving geometry + B81's stage mechanics, at several
  // viewports: the presented component renders the agentic-plugins SOURCE
  // geometry (title card straddling the back card's top edge with a gap to
  // the desc card, desc card wider than the back card with the back card
  // extending vertically past it by 112u — an invariant of the flow layout
  // that holds under the stage's cap too), the type at the source ratios
  // with the 11px floor, the styled in-card bar always visible on filled
  // cards and bare on empty ones, and the plate scaled by the stage's
  // min-ratio law (B81 — the deliberate rewrite of B76's plate-row pins).
  // (Headless Chromium force-enables overlay scrollbars, so the bar's
  // painted width is verified in a real browser — see the PR; the styling
  // contract and the scroll behaviour are asserted here.) ----
  const b81 = async (vp, tab = 'employer-brinker', clickLabel = null) => {
    const pg = await browser.newPage({ viewport: vp });
    await pg.goto(URL, { waitUntil: 'networkidle' });
    await pg.locator(`.topband__card-hit[for="${tab}"]`).click();
    await pg.waitForTimeout(300);
    if (clickLabel) { await pg.locator(`label[for="${clickLabel}"]`).click(); await pg.waitForTimeout(300); }
    const out = await pg.evaluate(t => {
      const r = e => e.getBoundingClientRect();
      const shown = [...document.querySelectorAll(`.employer--${t.slice(9)} .role`)];
      // the presented role is the one whose radio drives :has — read by
      // display, not by rect: at the deferred short viewports the stage
      // collapses and every rect reads 0 (see the short-window pins below).
      const roleEl = shown.find(w => getComputedStyle(w).display === 'block');
      const plate = roleEl.querySelector('.gregorian-mode');
      const stage = document.querySelector(`.employer--${t.slice(9)} .career__stage`);
      const emptyRole = [...shown].find(w => !w.querySelector('.gm-desc').textContent.trim());
      const d = plate.querySelector('.gm-desc');
      const t2 = plate.querySelector('.gm-title'), k = plate.querySelector('.gm-back');
      const de = document.documentElement;
      return {
        plateW: r(plate).width, stageW: r(stage).width, stageH: r(stage).height,
        bandH: r(document.querySelector('.employer--' + t.slice(9) + ' .career__band')).height,
        pluginH: parseFloat(getComputedStyle(roleEl).getPropertyValue('--plugin-h')),
        titleFS: parseFloat(getComputedStyle(t2).fontSize),
        descFS: parseFloat(getComputedStyle(d).fontSize),
        yearFS: parseFloat(getComputedStyle(plate.querySelector('.gm-uc')).fontSize),
        straddle: r(t2).top < r(k).top && r(k).top < r(t2).bottom,
        descWider: r(d).width > r(k).width,
        backPast: r(k).bottom - r(d).bottom,
        gap: r(d).top > r(t2).bottom,
        overflowY: getComputedStyle(d).overflowY,
        emptyOverflowY: emptyRole ? getComputedStyle(emptyRole.querySelector('.gm-desc')).overflowY : 'n/a',
        sbWidth: getComputedStyle(d, '::-webkit-scrollbar').width,
        sbThumb: getComputedStyle(d, '::-webkit-scrollbar-thumb').backgroundColor,
        sbTrack: getComputedStyle(d, '::-webkit-scrollbar-track').backgroundColor,
        scrolls: d.scrollHeight > d.clientHeight + 1,
        centred: Math.abs((r(plate).left - r(stage).left) - (r(stage).right - r(plate).right)) < 1,
        topAnchored: Math.abs(r(plate).top - r(stage).top) < 1,
        nothingClipped: ['.gm-title', '.gm-uc', '.gm-desc'].every(s2 => {
          const e = plate.querySelector(s2);
          return !e || r(e).bottom <= r(plate).bottom + 1;
        }),
        pageScrolls: de.scrollHeight > de.clientHeight + 1,
      };
    }, tab);
    await pg.close();
    return out;
  };
  const canvasB81 = await b81({ width: 1440, height: 1110 });
  ok('B76 — the type renders at the source ratios with the 11px readable floor (design canvas)',
    Math.abs(canvasB81.titleFS - Math.max(28 * canvasB81.plateW / 830, 11)) < 0.6 &&
    Math.abs(canvasB81.descFS - Math.max(20 * canvasB81.plateW / 830, 11)) < 0.6 &&
    Math.abs(canvasB81.yearFS - Math.max(14 * canvasB81.plateW / 830, 11)) < 0.6);
  ok('B76 — the title card straddles the back card\x27s top edge, with a gap to the desc card below it',
    canvasB81.straddle && canvasB81.gap);
  ok('B76 — the desc card is wider than the back card, which extends vertically past it (the source\u2019s 112px strip below the card)',
    canvasB81.descWider &&
    Math.abs(canvasB81.backPast - 112 * canvasB81.plateW / 830) < 2);
  ok('B81 — the plate follows the stage\x27s min-ratio law: width = min(stage width, 830 × stage height / --plugin-h), top-anchored, centred (design canvas)',
    Math.abs(canvasB81.plateW - Math.min(canvasB81.stageW, 830 * canvasB81.stageH / canvasB81.pluginH)) < 2 &&
    canvasB81.topAnchored && (canvasB81.plateW >= canvasB81.stageW - 2 || canvasB81.centred));
  ok('B76 — a filled desc card ALWAYS shows the styled in-card bar (6px, the card\x27s own ink, transparent track)',
    canvasB81.overflowY === 'scroll' && canvasB81.sbWidth === '6px' &&
    canvasB81.sbThumb === 'rgb(8, 8, 8)' && canvasB81.sbTrack === 'rgba(0, 0, 0, 0)');
  ok('B76 — an empty desc card stays bare (no scroll region, as the owner ruled)',
    canvasB81.emptyOverflowY !== 'scroll');
  ok('B76/B74 — the page fits one viewport and nothing is clipped (design canvas)',
    !canvasB81.pageScrolls && canvasB81.nothingClipped);
  // B81 + the issue #213 review supersede the old "band height
  // differentiates the plate" pin: the band is now the source's FIXED
  // clamp(3.4rem, 10cqw, 5.5rem) — identical for every employer, never
  // content-driven — so every employer's stage takes the same column and
  // each plate obeys the same min-ratio law (2560×1440).
  const wide3B81 = await b81({ width: 2560, height: 1440 }, 'employer-pnc-bank');
  const wide2B81 = await b81({ width: 2560, height: 1440 }, 'employer-pnc-private');
  ok('B81/#213 — the band renders at the same fixed clamp height for every employer (never content-driven) and each plate obeys the stage min-ratio law (2560×1440; deliberate rewrite of the band-differentiates plate pin)',
    Math.abs(wide3B81.bandH - wide2B81.bandH) < 0.5 &&
    Math.abs(wide3B81.stageH - wide2B81.stageH) < 0.5 &&
    [wide2B81, wide3B81].every(x =>
      Math.abs(x.plateW - Math.min(x.stageW, 830 * x.stageH / x.pluginH)) < 2));
  const midB81 = await b81({ width: 1024, height: 768 });
  ok('B81 — the min-ratio law holds at 1024×768 too',
    Math.abs(midB81.plateW - Math.min(midB81.stageW, 830 * midB81.stageH / midB81.pluginH)) < 2 &&
    !midB81.pageScrolls);
  // Short/landscape viewports: the page still fits one viewport (no
  // scroll) and the type holds its 11px floor. The "nothing is clipped"
  // half of these checks stays DEFERRED exactly as B76's suite had it:
  // with the footer's second line (B77) these windows are the owner's
  // deferred short-viewport class (chat, 2026-10-09: "Mobile viewports
  // are an entirely separate issue that will be resolved with their own
  // work at a future date."), and under B81 the band takes its height
  // before the stage does — the same deferred class, not a new ruling.
  const shortB81 = await b81({ width: 744, height: 400 });
  ok('B76 — 744×400: the page still fits one viewport and the type holds its 11px floor (clip check deferred, owner 2026-10-09)',
    !shortB81.pageScrolls &&
    shortB81.titleFS >= 11 && shortB81.descFS >= 11 && shortB81.yearFS >= 11);
  const landB81 = await b81({ width: 844, height: 390 });
  ok('B76 — 844×390 (landscape phone): the page still fits one viewport (clip check deferred, owner 2026-10-09)',
    !landB81.pageScrolls);

  // ---- B81 band-card glow + glimmer + pane tokens ----
  // The hover glow lives behind the (hover: hover) guard — asserted from
  // the stylesheet (as the reduced-motion pin is), not by synthesizing a
  // hover. The glimmer is the band cards' ALONE: the presented
  // component's title/back cards carry none (the source repo's B26).
  ok('B81 — the band-card hover glow is the source\x27s two-layer --frame bloom under the hover guard',
    await page.evaluate(() => {
      const sheet = [...document.styleSheets].find(s => s.ownerNode && !s.href);
      const walk = rules => rules.flatMap(r =>
        r.cssRules && r.cssRules.length ? [r, ...walk([...r.cssRules])] : [r]);
      const rules = walk([...sheet.cssRules]);
      const hoverMedia = rules.filter(r => r.media && r.media.mediaText.includes('(hover: hover)'));
      const glowRule = rules.find(r => !r.media && r.selectorText === '.career__tab:hover');
      const bs = glowRule ? glowRule.style.boxShadow : '';
      return !!glowRule && /12px 2px var\(--frame\)/.test(bs) &&
        /24px 4px var\(--frame\)/.test(bs) && hoverMedia.length > 0;
    }));
  ok('B81 — the band cards glimmer on the 6s gm-marquee clock; the presented component\x27s title/back cards do not (B26)',
    await page.evaluate(() => {
      const band = document.querySelector('.career__band .career__tab');
      const glow = getComputedStyle(band, '::after');
      const shown = [...document.querySelectorAll('.role')]
        .find(w => getComputedStyle(w).display === 'block');
      const plate = shown.querySelector('.gregorian-mode');
      const titleAfter = getComputedStyle(plate.querySelector('.gm-title'), '::after');
      const backAfter = getComputedStyle(plate.querySelector('.gm-back'), '::after');
      return glow.animationName === 'gm-marquee' && glow.animationDuration === '6s' &&
        titleAfter.animationName === 'none' && backAfter.animationName === 'none';
    }));
  ok('B81 — the presented back card breathes on the 10s gm-breathe clock (the presentation glow)',
    await page.evaluate(() => {
      const shown = [...document.querySelectorAll('.role')]
        .find(w => getComputedStyle(w).display === 'block');
      const cs = getComputedStyle(shown.querySelector('.gregorian-mode .gm-back'));
      return cs.animationName === 'gm-breathe' && cs.animationDuration === '10s' &&
        cs.boxShadow.includes('240px');
    }));
  ok('B81/#213 — the band pane is the source\u2019s note card (2.1px --frame border, the water fill, the elevation) at the source\u2019s FIXED selector height clamp(3.4rem, 10cqw, 5.5rem) — never content-driven',
    await page.evaluate(() => {
      const sec = [...document.querySelectorAll('section.employer')]
        .find(x => getComputedStyle(x).display !== 'none');
      const b = sec.querySelector('.career__band');
      const cs = getComputedStyle(b);
      const gal = sec.querySelector('.split__gallery');
      const galW = gal.getBoundingClientRect().width;
      const clampH = Math.min(Math.max(3.4 * 16, 0.10 * galW), 5.5 * 16);
      return parseFloat(cs.borderTopWidth) > 1.9 && parseFloat(cs.borderTopWidth) < 2.2 &&
        cs.borderTopColor === 'rgb(140, 140, 140)' &&
        cs.borderRadius === '3px' &&
        cs.backgroundImage.includes('radial-gradient') && cs.backgroundImage.includes('linear-gradient') &&
        cs.boxShadow.includes('rgba(0, 0, 0, 0.45)') &&
        Math.abs(parseFloat(cs.height) - clampH) < 1 &&
        cs.minHeight === 'auto';
    }));
  // issue #213: the cards' type/padding are agent-derived under B33/B40 to
  // fit the fixed clamp — the name wraps AT MOST TWO LINES inside its card
  // (nothing clipped, the longest word never past the cell) with the year
  // subscript beneath. Deliberate rewrite: the 20 × --rs card-type pin and
  // the (band-top + 8 × --rs)/--card-pad padding pin are superseded.
  ok('B81/#213 — the band names wrap ≤ 2 lines inside their cards with the year beneath (type agent-derived under B33/B40 to fit the clamp)',
    await page.evaluate(() => {
      const bands = [...document.querySelectorAll('.career__band')]
        .filter(b => b.getBoundingClientRect().height > 0);
      const measure = c => {
        const range = document.createRange();
        const tn = [...c.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());
        if (!tn) return false;
        range.selectNodeContents(tn);
        const lines = [...range.getClientRects()];
        if (!lines.length) return false;
        const y = c.querySelector('.career__tab-year').getBoundingClientRect();
        const box = c.getBoundingClientRect();
        return lines.length <= 2 &&
          lines.every(l => l.right <= box.right + 0.5 && l.left >= box.left - 0.5) &&
          y.top >= lines[lines.length - 1].bottom - 1 &&
          y.right <= box.right + 0.5;
      };
      return bands.length === 1 &&
        bands.every(b => [...b.querySelectorAll('.career__tab')].every(measure));
    }));

  // back to the default tab for the rest of the suite
  await page.locator('.topband__card-hit[for="employer-pnc-bank"]').click();
  ok('no .gm-cta anywhere, and no plugins-page selector — the career band is the page\x27s own (B56/B81 rewrite)',
    await page.locator('.gm-cta').count() === 0 &&
    await page.evaluate(() =>
      !document.querySelector('[name="plugin-select"], .plugins__radio, .plugins__tab, .plugins__pane, .plugins__stage')));
  ok('each employer body still carries its gm-title cards and slot comments for the owner\x27s fill passes',
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
  // B81 at mobile + the issue #213 review: the stage + band column stays
  // (one presented component, the band beneath it) in the shipped readable
  // literals — the clamp returns as the pane's FLOOR below the breakpoint
  // and the stacked cards grow it content-driven, the name keeping the
  // 11px readable-floor rung (deliberate rewrite: the 1.1rem header-card
  // name rung clipped "Representative" past its ~95px cell; agent-derived
  // under B33/B40) — and the page keeps scrolling below the breakpoint
  // (B74's mobile answer).
  ok('at 390px the stage still presents one component with the band beneath it, the band content-driven above its clamp floor, the name at the 11px rung, the page scrolling (B81/B74 mobile, #213)',
    await page.evaluate(() => {
      const shown = [...document.querySelectorAll('section.employer')]
        .find(s => s.getBoundingClientRect().height > 0);
      const st = shown.querySelector('.career__stage').getBoundingClientRect();
      const band = shown.querySelector('.career__band');
      const b = band.getBoundingClientRect();
      const plates = [...shown.querySelectorAll('.role')]
        .filter(w => w.getBoundingClientRect().height > 0);
      const tab = shown.querySelector('.career__tab');
      const year = tab.querySelector('.career__tab-year');
      return b.top >= st.bottom - 1 && plates.length === 1 &&
        getComputedStyle(band).minHeight === '54.4px' && b.height > 54.4 + 1 &&
        getComputedStyle(tab).fontSize === '11px' &&
        getComputedStyle(year).fontSize === '9px' &&
        document.documentElement.scrollHeight > document.documentElement.clientHeight + 1;
    }));
  // a11y: the selector is a named radio group; one off-canvas h1, equal wordmarks
  await page.setViewportSize({ width: 1440, height: 1110 });
  ok('the selector is a named radio group and headings do not encode selection',
    await page.evaluate(() =>
      document.querySelector('[role="radiogroup"]')?.getAttribute('aria-label') === 'Choose an employer' &&
      document.querySelectorAll('h1').length === 1 &&
      document.querySelector('h1').classList.contains('visually-hidden') &&
      document.querySelectorAll('h2.topband__wordmark').length === 3));
  ok('the band selectors are named per-employer radio groups (B81)',
    await page.evaluate(() =>
      [...document.querySelectorAll('.career__band')].length === 3 &&
      [...document.querySelectorAll('.career__band')].every(b =>
        b.getAttribute('role') === 'radiogroup' && /^Choose a /.test(b.getAttribute('aria-label')))));
  ok('transitions collapse under prefers-reduced-motion', await page.evaluate(() => {
    const sheet = [...document.styleSheets].find(s => s.ownerNode && !s.href);
    return [...sheet.cssRules].some(r => r.media && r.media.mediaText.includes('prefers-reduced-motion'));
  }));

  await browser.close();
  console.log(failures === 0 ? '\nAll career checks passed.' : `\n${failures} failure(s).`);
  process.exit(failures === 0 ? 0 : 1);
})();