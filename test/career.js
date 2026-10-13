/* test/career.js — the career page (issue #133, B47): three employer cards,
   the monochrome token ladder (B73), the plugin components (B56/B64/B76), and
   — B98 (issue #257, superseding B92's coverflow fan) — the 3D RING of all 8
   role components, since B95 (issue #250) spanning the WHOLE body.
   One role radio group drives the centred card via CSS :has; the ← / →
   labels step one role per click with wrap-around; the employer cards jump
   to each employer's LAST role (B95) and glow two-way with the centred
   card's employer; the 8 components render at one standardized size (B95).
   The ring: 8 cards 45° apart, the front card the nearest object, every
   card inside the body (the ring closes behind itself), darker with
   distance, side cards showing titles only, a light pool in place of B94's
   card glow, the arrows below the front card, ~500ms rotation, snap under
   reduced motion. B74 still bounds the page to one viewport with
   the description card as the only scroll container; B76 still renders the
   agentic-plugins source geometry scaled uniformly by the plate's own width.
   Single file, zero script, zero <link>. Black-box Playwright.
   Run: node test/career.js   (PORTFOLIO_URL default http://localhost:8000/career.html)
   Viewport note: the desktop run is at the page's own design canvas
   (REF_H ≈ 1104.55 → rs ≈ 1), because the band's literals render at the B46
   scale (--rs). The carousel's card geometry scales by the plate's own width
   (container queries), so its assertions are computed from the measured plate
   width. */

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
  ok('no stylesheets or off-origin links — only the B63 favicon links',
    await page.locator('link').evaluateAll(ls => ls.every(l =>
      ['icon', 'apple-touch-icon', 'shortcut icon'].includes(l.rel) &&
      l.href.startsWith(location.origin))));
  ok('no external network requests beyond the page itself', await page.evaluate(() => performance.getEntriesByType('resource')
    .every(r => r.name.startsWith('data:') || r.name.startsWith(location.origin))));

  // §1: three employer cards, chronological order
  const names = await page.locator('.topband__card .topband__wordmark').allInnerTexts();
  ok('three employer cards', names.length === 3);
  ok('chronological order PNC Bank → PNC Private Bank → Brinker Capital',
    JSON.stringify(names) === JSON.stringify(['PNC Bank', 'PNC Private Bank', 'Brinker Capital']));

  // B87 (issue #218): each employer card carries its employment dates as an
  // italic subscript oneliner.
  const b87dates = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('.topband__card')];
    return {
      dates: cards.map(c => c.querySelector('.topband__oneliner').textContent.trim()),
      italic: cards.every(c => getComputedStyle(c.querySelector('.topband__oneliner')).fontStyle === 'italic'),
    };
  });
  ok('B87 — the three employer cards carry their dates in an italic subscript',
    JSON.stringify(b87dates.dates) === JSON.stringify(['2017-2020', '2020-2022', '2022-Present']) &&
    b87dates.italic);

  // Cards hang over the header rule
  const hang = await page.evaluate(() => {
    const band = document.querySelector('.topband');
    const card = document.querySelector('.topband__card');
    return card.getBoundingClientRect().bottom > band.getBoundingClientRect().bottom - 1;
  });
  ok('employer cards hang over the header line', hang);

  // B49 (issue #139): the band, cards and lot render at the landing conventions.
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
  ok('card is the B31 box: border-top 0, radius only on the bottom corners, hug width bounded (issue #195, B79)',
    b49.borderTop === '0px' && parseFloat(b49.radius) > 0 && b49.cardW < 300);
  ok('lot is floored at the rescaled two-row shelf: 134.76 × rs (B46/B73/B49)',
    b49.lotH >= 134.76 * b49.rs - 1);

  // issue #195 (B79): the three employer cards render at one shared size, equally spaced.
  const m195 = () => page.evaluate(() => {
    const rs = [...document.querySelectorAll('.topband__card')].map(c => c.getBoundingClientRect());
    return { w: rs.map(r => r.width), h: rs.map(r => r.height),
             gaps: [rs[1].left - rs[0].right, rs[2].left - rs[1].right] };
  });
  const shared195 = m => m.w.every(w => Math.abs(w - m.w[0]) < 0.5) &&
    m.h.every(h => Math.abs(h - m.h[0]) < 0.5);
  const equalGaps195 = m => Math.abs(m.gaps[0] - m.gaps[1]) < 0.5;
  const base195 = await m195();
  ok('all three employer cards render at one shared size (issue #195, B79)',
    shared195(base195));
  ok('the three employer cards are equally spaced apart (issue #195, B79)',
    equalGaps195(base195));

  // ---- B92 (issue #230) → B98 (issue #257): the 3D role ring ---- //

  // Structure: one radio group of 8, one slot per role, all in the left half.
  ok('the role ring is one named radio group of 8 (aria-label "Choose a role")',
    await page.evaluate(() => {
      const grp = document.querySelector('.carousel[role="radiogroup"]');
      const rs = [...document.querySelectorAll('.carousel__radio')];
      return grp &&
        grp.getAttribute('aria-label') === 'Choose a role' &&
        rs.length === 8 &&
        new Set(rs.map(r => r.name)).size === 1 && rs[0].name === 'role';
    }));
  ok('8 slots, one per role', await page.locator('.carousel__slot').count() === 8);
  ok('default selection is the first role (role-1)',
    await page.locator('#role-1').isChecked());

  // The centred card is the checked radio's slot, at zero rotation.
  // B98: a slot's ring angle is read off its computed transform (the
  // rotateY's cosine is the matrix's m11); the front card sits at 0°.
  // The turn is a 500ms transition; wait for it to land rather than trust a
  // fixed sleep (a loaded runner can still be mid-turn at 600ms).
  const centered = async () => { await page.waitForFunction(() =>
    [...document.querySelectorAll('.carousel__slot')]
      .some(s => Math.abs(new DOMMatrix(getComputedStyle(s).transform).m11 - 1) < 1e-3),
    null, { timeout: 5000 });
    return centeredNow(); };
  const centeredNow = () => page.evaluate(() => {
    const slot = [...document.querySelectorAll('.carousel__slot')]
      .find(s => Math.abs(new DOMMatrix(getComputedStyle(s).transform).m11 - 1) < 1e-3);
    return {
      title: slot.querySelector('.gm-title').childNodes[0].textContent.trim(),
      year: slot.querySelector('.gm-uc').textContent.trim(),
      role: slot.dataset.role,
    };
  });
  const firstCenter = await centered();
  ok('the centred card is the default role: "Branch Sales & Service Representative" (2017-2018)',
    firstCenter.role === '1' && firstCenter.title === 'Branch Sales & Service Representative' &&
    firstCenter.year === '2017-2018');

  // B98 (issue #257): the ring. Eight cards, 45° apart; the front card is
  // the nearest object; the camera sits above; flatter than B92's 800px.
  const ring = await page.evaluate(() => {
    const car = document.querySelector('.carousel');
    const cs = getComputedStyle(car);
    const slots = [...document.querySelectorAll('.carousel__slot')];
    const front = slots.find(s => s.dataset.role === '1');
    const angles = slots.map(s => {
      const m = new DOMMatrix(getComputedStyle(s).transform);
      return Math.round(Math.acos(Math.max(-1, Math.min(1, m.m11))) * 180 / Math.PI);
    }).sort((x, y) => x - y);
    // Every card's nearest corner, in the ring's own z (front plane = 0).
    const nearZ = slots.map(s => {
      const m = new DOMMatrix(getComputedStyle(s).transform);
      const w = s.offsetWidth / 2;
      return Math.max(m.transformPoint(new DOMPoint(-w, 0, 0)).z,
                      m.transformPoint(new DOMPoint(w, 0, 0)).z);
    });
    return {
      angles,
      perspective: parseFloat(cs.perspective),
      cardW: front.offsetWidth,
      originY: cs.perspectiveOrigin.split(' ')[1],
      frontZ: nearZ[0],
      othersBehind: nearZ.slice(1).every(z => z < -1),
      // Projected height of each card's nearest edge: H · P / (P − z).
      frontTallest: nearZ.slice(1).every(z => {
        const P = parseFloat(cs.perspective);
        return front.offsetHeight * P / (P - z) < front.offsetHeight - 1;
      }),
      backBrightness: getComputedStyle(slots[4]).filter,
      frontBrightness: getComputedStyle(front).filter,
      backOpacity: parseFloat(getComputedStyle(slots[4]).opacity),
    };
  });
  ok('B98 — 8 cards stand in one ring, 45° apart (0, 45×2, 90×2, 135×2, 180)',
    JSON.stringify(ring.angles) === JSON.stringify([0, 45, 45, 90, 90, 135, 135, 180]));
  ok('B98 — the front card is the nearest object: every other card sits behind its plane',
    Math.abs(ring.frontZ) < 1 && ring.othersBehind);
  ok('B98 — the front card is the tallest card on screen (each nearest edge, projected)', ring.frontTallest);
  ok('B98 — flatter than B92\'s 800px, proportional to the card (3.6 card widths)',
    ring.perspective > 800 && Math.abs(ring.perspective - ring.cardW * 3.6) < 2);
  ok('B98 — the camera sits above the ring (perspective-origin above the stage)',
    parseFloat(ring.originY) < 0);
  ok('B98 — cards darken with distance; the rearmost is see-through',
    ring.frontBrightness === 'brightness(1)' &&
    parseFloat(ring.backBrightness.replace(/[^\d.]/g, '')) < 0.2 &&
    ring.backOpacity < 0.5);
  ok('B98 — the whole ring stays inside the body: no card leaves the page',
    await page.evaluate(() => {
      const c = document.querySelector('.clip').getBoundingClientRect();
      return [...document.querySelectorAll('.carousel__slot')].every(s => {
        const r = s.getBoundingClientRect();
        return r.left >= c.left - 1 && r.right <= c.right + 1;
      });
    }));
  ok('the ring\'s transitions are ~500ms (ruled)', await page.evaluate(() =>
    getComputedStyle(document.querySelector('.carousel__slot')).transitionDuration
      .split(',').every(d => d.trim() === '0.5s')));
  ok('B98 — side cards show titles only; the front card\'s description reads',
    await page.evaluate(() => {
      const d = r => getComputedStyle(document.querySelector(`.carousel__slot[data-role="${r}"] .gm-desc`)).color;
      return d('1') !== 'rgba(0, 0, 0, 0)' && d('3') === 'rgba(0, 0, 0, 0)' && d('8') === 'rgba(0, 0, 0, 0)';
    }));
  ok('B98 — an empty role shows the quiet "Description coming soon" placeholder',
    await page.evaluate(() => {
      const d = document.querySelector('.carousel__slot[data-role="1"] .gm-desc');
      const b = getComputedStyle(d, '::before');
      return d.matches(':empty') && b.content === '"Description coming soon"' && b.fontStyle === 'italic';
    }));
  ok('B98 — the arrows sit below the front card, previous left of next, nothing over them',
    await page.evaluate(() => {
      const vis = d => [...document.querySelectorAll(`.carousel__nav--${d} .carousel__nav-hit`)]
        .find(l => getComputedStyle(l).display !== 'none');
      const p = vis('prev'), n = vis('next');
      const pr = p.getBoundingClientRect(), nr = n.getBoundingClientRect();
      const back = document.querySelector('.carousel__slot[data-role="1"] .gm-back').getBoundingClientRect();
      const top = el => { const r = el.getBoundingClientRect();
        return document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2) === el; };
      return !p.closest('.carousel') && pr.right <= nr.left && pr.top >= back.bottom - 1 && top(p) && top(n);
    }));
  ok('B98 — the light pool sits outside the 3D context, and no card carries B94\'s glow',
    await page.evaluate(() => {
      const pool = document.querySelector('.carousel__pool');
      return pool && !pool.closest('.carousel') &&
        getComputedStyle(pool).backgroundImage.startsWith('radial-gradient') &&
        [...document.querySelectorAll('.gm-back')].every(k => !getComputedStyle(k).boxShadow.includes('103, 103, 103'));
    }));
  ok('B98 — the pool dips on each turn: every role names its own copy of the dip',
    await page.evaluate(() => getComputedStyle(document.querySelector('.carousel__pool')).animationName === 'pool-dip-1'));

  // Navigation: the ← / → labels step one role per click with wrap-around.
  const clickNav = dir => page.evaluate(d => {
    const vis = [...document.querySelectorAll(`.carousel__nav--${d} .carousel__nav-hit`)]
      .find(l => getComputedStyle(l).display !== 'none');
    if (vis) vis.click();
    return vis ? vis.getAttribute('for') : null;
  }, dir);
  ok('the next arrow targets the successor of the checked role',
    (await clickNav('next')) === 'role-2');
  await page.waitForTimeout(600);
  ok('clicking next centres the second role',
    (await centered()).title === 'Branch Sales & Service Associate');

  // Wrap: select the last role, then next wraps to the first.
  await page.evaluate(() => document.getElementById('role-8').click());
  await page.waitForTimeout(600);
  ok('selecting role-8 centres "Sr. Portfolio Specialist"',
    (await centered()).role === '8');
  const nextAfter8 = await page.evaluate(() => {
    const vis = [...document.querySelectorAll('.carousel__nav--next .carousel__nav-hit')]
      .find(l => getComputedStyle(l).display !== 'none');
    return vis && vis.getAttribute('for');
  });
  ok('the next arrow wraps from role-8 back to role-1', nextAfter8 === 'role-1');
  await clickNav('next');
  await page.waitForTimeout(600);
  ok('clicking next at the last role wraps to the first',
    (await centered()).role === '1');

  // B95 (issue #250): the body is one full-width cell — the divider bar and
  // the empty right half are gone, and the carousel spans the whole body.
  ok('B95 — no .split__rule divider, no .split__copy right half (full-width body)',
    (await page.locator('.split__rule').count()) === 0 &&
    (await page.locator('.split__copy').count()) === 0 &&
    (await page.evaluate(() => {
      const car = document.querySelector('.carousel');
      const clip = document.querySelector('.clip');
      return Math.abs(car.getBoundingClientRect().width - clip.getBoundingClientRect().width) < 2;
    })));

  // B95 (issue #250): the employer cards spin the carousel to each
  // employer's LAST role (superseding B92's first-role jumps).
  await page.locator('.topband__card-hit[for="role-3"]').click();
  await page.waitForTimeout(600);
  ok('the PNC Bank card spins the carousel to "Branch Banker" (role-3, its last)',
    (await centered()).role === '3' && (await centered()).title === 'Branch Banker');
  await page.locator('.topband__card-hit[for="role-5"]').click();
  await page.waitForTimeout(600);
  ok('the PNC Private Bank card spins the carousel to "Portfolio & Trust Administrator" (role-5, its last)',
    (await centered()).role === '5' && (await centered()).title === 'Portfolio & Trust Administrator');
  await page.locator('.topband__card-hit[for="role-8"]').click();
  await page.waitForTimeout(600);
  ok('the Brinker Capital card spins the carousel to "Sr. Portfolio Specialist" (role-8, its last)',
    (await centered()).role === '8' && (await centered()).title === 'Sr. Portfolio Specialist');

  // B95 (issue #250): two-way glow — the title card whose employer owns the
  // centred role carries the selected glow (TheBoards' `B132` border-color +
  // 0 0 8px 0 bloom, reintroduced), the other two do not.
  const glowMap = await (async () => {
    const out = [];
    for (let role = 1; role <= 8; role++) {
      await page.evaluate(r => document.getElementById('role-' + r).click(), role);
      await page.waitForTimeout(350);   // past the card's 200ms box-shadow transition
      const glow = await page.evaluate(() => {
        const o = {};
        for (const e of ['pnc-bank', 'pnc-private-bank', 'brinker-capital']) {
          o[e] = getComputedStyle(document.querySelector('.topband__card[data-employer="' + e + '"]')).boxShadow.includes('103, 103, 103');
        }
        return o;
      });
      out.push(role + ':' + Object.keys(glow).find(e => glow[e]));
    }
    return out;
  })();
  ok('B95 — the two-way title-card glow tracks the centred role\'s employer',
    JSON.stringify(glowMap) === JSON.stringify([
      '1:pnc-bank', '2:pnc-bank', '3:pnc-bank',
      '4:pnc-private-bank', '5:pnc-private-bank',
      '6:brinker-capital', '7:brinker-capital', '8:brinker-capital']));

  // B64 (issue #176): three desc cards carry the owner's copy verbatim; the rest stay empty.
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
  const titlesYears = [
    ['Branch Sales & Service Representative', '2017-2018'],
    ['Branch Sales & Service Associate', '2018-2019'],
    ['Branch Banker', '2019-2020'],
    ['Client Service Associate', '2020-2021'],
    ['Portfolio & Trust Administrator', '2021-2022'],
    ['Trader', '2022-2023'],
    ['Portfolio Specialist', '2023'],
    ['Sr. Portfolio Specialist', '2023-2025'],
  ];
  ok('the 8 slots carry the exact role titles + years, in ring order', await page.evaluate(want => {
    const rows = [...document.querySelectorAll('.carousel__slot')].map((s, i) => {
      const t = s.querySelector('.gm-title').childNodes[0].textContent.trim();
      const y = s.querySelector('.gm-uc').textContent.trim();
      return [t, y];
    });
    return JSON.stringify(rows) === JSON.stringify(want);
  }, titlesYears));
  ok('three desc cards render the owner\'s copy verbatim; the other five stay empty', await page.evaluate(copy => {
    const nrm = x => x.replace(/\s+/g, ' ').trim();
    const slots = [...document.querySelectorAll('.carousel__slot')];
    let filled = 0, empty = 0, wrong = 0;
    for (const s of slots) {
      const t = s.querySelector('.gm-title').childNodes[0].textContent.trim();
      const d = nrm(s.querySelector('.gm-desc').innerText);
      if (copy[t]) { filled++; if (d !== nrm(copy[t].join(' '))) wrong++; }
      else { empty++; if (d !== '') wrong++; }
    }
    return filled === 3 && empty === 5 && wrong === 0;
  }, B64_COPY));

  // B87 (issue #218): each role's year is nested inside its title card.
  ok('B87 — each of the 8 role years is nested inside its title card',
    await page.evaluate(() =>
      document.querySelectorAll('.gm-title .gm-uc').length === 8 &&
      [...document.querySelectorAll('.gm-uc')].every(u => !!u.closest('.gm-title'))));

  // B95 (issue #250): uniform components — all 8 plates render at one
  // standardized size (the desc and title cards at one uniform footprint),
  // scaled together by the slot's single --u; only the longest copy
  // (role 8, the issue's stated exception) scrolls.
  const b95uniform = await page.evaluate(() => {
    const rows = [...document.querySelectorAll('.carousel__slot')].map(s => {
      const gm = s.querySelector('.gregorian-mode');
      const d = s.querySelector('.gm-desc');
      const t = s.querySelector('.gm-title');
      return { plateW: gm.clientWidth, plateH: gm.offsetHeight,
               descW: d.clientWidth, descH: d.offsetHeight, titleH: t.offsetHeight,
               scrollable: d.scrollHeight > d.clientHeight + 1 };
    });
    return {
      onePlate: rows.every(r => r.plateW === rows[0].plateW && r.plateH === rows[0].plateH),
      oneDesc: rows.every(r => r.descW === rows[0].descW && r.descH === rows[0].descH),
      oneTitle: rows.every(r => r.titleH === rows[0].titleH),
      scrollRoles: rows.filter(r => r.scrollable).length,
    };
  });
  ok('B95 — all 8 components render at one standardized plate size',
    b95uniform.onePlate && b95uniform.oneTitle && b95uniform.oneDesc);
  ok('B95 — only the longest copy (role 8) scrolls inside the uniform desc card',
    b95uniform.scrollRoles === 1);

  // B76 (issue #194) geometry, on a filled card (role-8, "Sr. Portfolio Specialist").
  const b76 = await (async () => {
    await page.evaluate(() => document.getElementById('role-8').click());
    await page.waitForTimeout(600);
    return page.evaluate(() => {
      const r = e => e.getBoundingClientRect();
      const slot = [...document.querySelectorAll('.carousel__slot')]
        .find(s => s.dataset.role === '8');
      const plate = slot.querySelector('.gregorian-mode');
      const d = plate.querySelector('.gm-desc');
      const t2 = plate.querySelector('.gm-title');
      const k = plate.querySelector('.gm-back');
      const de = document.documentElement;
      return {
        plateW: r(plate).width,
        titleFS: parseFloat(getComputedStyle(t2).fontSize),
        descFS: parseFloat(getComputedStyle(d).fontSize),
        yearFS: parseFloat(getComputedStyle(plate.querySelector('.gm-uc')).fontSize),
        straddle: r(t2).top < r(k).top && r(k).top < r(t2).bottom,
        descWider: r(d).width > r(k).width,
        descWithin: r(d).bottom <= r(k).bottom + 1,
        backPast: r(k).bottom - r(d).bottom,
        gap: r(d).top > r(t2).bottom,
        overflowY: getComputedStyle(d).overflowY,
        pageScrolls: de.scrollHeight > de.clientHeight + 1,
      };
    });
  })();
  ok('B76 — type renders at the source ratios with the 11px readable floor',
    Math.abs(b76.titleFS - Math.max(28 * b76.plateW / 830, 11)) < 0.6 &&
    Math.abs(b76.descFS - Math.max(20 * b76.plateW / 830, 11)) < 0.6 &&
    Math.abs(b76.yearFS - Math.max(14 * b76.plateW / 830, 11)) < 0.6);
  ok('B76 — the title card straddles the back card\'s top edge, with a gap to the desc card',
    b76.straddle && b76.gap);
  ok('B76 — the desc card is wider than the back card, which extends vertically past it',
    b76.descWider && b76.descWithin &&
    Math.abs(b76.backPast - 112 * b76.plateW / 830) < 3);
  ok('B76 — a filled desc card always shows the styled in-card bar (overflow-y: scroll)',
    b76.overflowY === 'scroll');
  ok('B98 — the turn re-names the pool\'s dip (role 8 centred → pool-dip-8)',
    await page.evaluate(() => getComputedStyle(document.querySelector('.carousel__pool')).animationName === 'pool-dip-8'));
  ok('B93 — the component base is transparent (the --deep back plate is gone)',
    await page.evaluate(() =>
      getComputedStyle(document.querySelector('.carousel__slot[data-role="8"] .gregorian-mode')).backgroundColor === 'rgba(0, 0, 0, 0)'));
  ok('B74 — the page fits one viewport (no page scroll)', !b76.pageScrolls);
  ok('no .gm-cta anywhere', await page.locator('.gm-cta').count() === 0);

  // reset to the default for the remaining (footer/token/a11y) checks
  await page.evaluate(() => document.getElementById('role-1').click());
  await page.waitForTimeout(300);

  // §3/§4 footer + tokens (unchanged by the carousel ruling)
  ok('footer has two content sections with one CTA',
    await page.locator('.parking-lot__facts').count() === 2 &&
    await page.locator('.parking-lot .cta').count() === 1);
  ok('one divider bar remains (B65: the second is removed)',
    await page.locator('.parking-lot__divider').count() === 1);
  ok('the tools line renders the owner\'s copy on one line, five short bars between tokens (B65)',
    await page.evaluate(() => {
      const t = document.querySelector('.parking-lot__tools');
      const tokens = [...t.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).filter(Boolean);
      const bars = [...t.querySelectorAll('.parking-lot__tools-bar')];
      return JSON.stringify(tokens) === JSON.stringify(['Orion Technology', 'Factset', 'Morningstar', 'Docupace', 'BPM', 'Salesforce']) &&
        bars.length === 5 && t.getBoundingClientRect().height < 3 * parseFloat(getComputedStyle(t).fontSize);
    }));
  ok('the education line renders the owner\'s copy beneath the tools line (B77)',
    await page.evaluate(() => {
      const lines = [...document.querySelectorAll('.parking-lot__facts .parking-lot__tools')];
      if (lines.length !== 2) return false;
      const t = lines[1];
      const tokens = [...t.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).filter(Boolean);
      const above = lines[0].getBoundingClientRect();
      const self = t.getBoundingClientRect();
      return JSON.stringify(tokens) === JSON.stringify(['Maryville University of St. Louis', 'B.S. Accounting', '2021', 'Magna cum laude']) &&
        self.top >= above.bottom - 1;
    }));
  ok('the CTA reads "Learn More about Rob" and links back to razgregory.com',
    (await page.locator('.parking-lot .cta').innerText()).trim() === 'Learn More about Rob' &&
    (await page.locator('.parking-lot .cta').getAttribute('href')) === 'https://razgregory.com/');

  // §4: the B73 monochrome ladder (unchanged)
  const tokens = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    return { deep: cs.getPropertyValue('--deep').trim(), card: cs.getPropertyValue('--card').trim(),
             frame: cs.getPropertyValue('--frame').trim(), note: cs.getPropertyValue('--note').trim(),
             glow: cs.getPropertyValue('--glow-gray').trim() };
  });
  ok('the ladder is monochrome gray, at the landing palette luminance rungs',
    tokens.deep === '#080808' && tokens.card === '#151515' && tokens.frame === '#8c8c8c' && tokens.note === '#cbcbcb');
  const lum = hex => {
    const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  ok('luminance ladder holds: card one step above deep, glow one rung below frame (TheBoards `B132` rule)',
    lum(tokens.card) > lum(tokens.deep) && lum(tokens.card) / lum(tokens.deep) < 4 &&
    lum(tokens.glow) < lum(tokens.frame));

  // a11y + reduced motion
  ok('one off-canvas h1; three h2 wordmarks; the role ring is the named radio group',
    await page.evaluate(() =>
      document.querySelectorAll('h1').length === 1 &&
      document.querySelector('h1').classList.contains('visually-hidden') &&
      document.querySelectorAll('h2.topband__wordmark').length === 3 &&
      document.querySelector('.carousel[role="radiogroup"]')?.getAttribute('aria-label') === 'Choose a role'));
  ok('transitions collapse under prefers-reduced-motion', await page.evaluate(() => {
    const sheet = [...document.styleSheets].find(s => s.ownerNode && !s.href);
    return [...sheet.cssRules].some(r => r.media && r.media.mediaText.includes('prefers-reduced-motion'));
  }));

  // B98 (issue #257): on a phone the ring is the same ring, scaled down —
  // the B95 clip wrapper collapsed to 0px tall here before.
  const phone = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await phone.goto(URL, { waitUntil: 'networkidle' });
  ok('B98 — at 390px the ring renders (non-zero height) and every card stays on the page',
    await phone.evaluate(() => {
      const c = document.querySelector('.clip').getBoundingClientRect();
      const slots = [...document.querySelectorAll('.carousel__slot')];
      return c.height > 200 && slots.every(s => {
        const r = s.getBoundingClientRect();
        return r.left >= -1 && r.right <= innerWidth + 1;
      });
    }));
  ok('B98 — at 390px the front card is the nearest and the arrows sit below it',
    await phone.evaluate(() => {
      const back = document.querySelector('.carousel__slot[data-role="1"] .gm-back').getBoundingClientRect();
      const n = [...document.querySelectorAll('.carousel__nav--next .carousel__nav-hit')]
        .find(l => getComputedStyle(l).display !== 'none').getBoundingClientRect();
      return n.top >= back.bottom - 1 && n.height > 0;
    }));

  await browser.close();
  console.log(failures === 0 ? '\nAll career checks passed.' : `\n${failures} failure(s).`);
  process.exit(failures === 0 ? 0 : 1);
})();