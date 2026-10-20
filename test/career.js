/* test/career.js — the career page (issue #133, B47): three employer cards,
   the teal-and-amber token ladder (B121), the plugin components (B56/B64/B76), and
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
   reduced motion. Issue #261 polishes it for quiet wonder: a one-turn
   arrival on load, click any visible card to turn to it, hover answers on
   side cards / employer cards / arrows / CTA, contact shadows, an
   amber-lit pool (B121), a smoked-glass description card, the glimmer on the front
   card only, a static film grain, and reduced motion that drops motion but
   keeps the light. B74 still bounds the page to one viewport with
   the description card as the only scroll container; B76 still renders the
   agentic-plugins source geometry scaled uniformly by the plate's own width.
   Single file, zero script; only the B63 favicon links. Black-box Playwright.
   Run: node test/career.js   (PORTFOLIO_BASE_URL default http://localhost:8000/)
   Viewport note: the desktop run is at the page's own design canvas
   (REF_H ≈ 1104.55 → rs ≈ 1), because the band's literals render at the B46
   scale (--rs). The carousel's card geometry scales by the plate's own width
   (container queries), so its assertions are computed from the measured plate
   width. */

const { chromium } = require('playwright');

const BASE_URL = process.env.PORTFOLIO_BASE_URL || 'http://localhost:8000/';
const URL = new globalThis.URL('career.html', BASE_URL.endsWith('/') ? BASE_URL : BASE_URL + '/').href;
let failures = 0;
const ok = (label, cond, details = '') => { if (!cond) failures++; console.log(`${cond ? 'PASS' : 'FAIL'} ${label}${!cond && details ? ' :: ' + details : ''}`); };

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1110 } });
  await page.goto(URL, { waitUntil: 'networkidle' });
  // Issue #261: the ring makes one full turn on load. Read the arrival while
  // it runs, then let it land before any geometry is measured.
  const arrival = await page.evaluate(() => document.getAnimations()
    .filter(a => a.animationName === 'ring-arrive')
    .map(a => ({ dur: a.effect.getTiming().duration, iter: a.effect.getTiming().iterations,
                 target: a.effect.target.className })));
  const arrived = pg => pg.waitForFunction(() => document.getAnimations()
    .filter(a => a.animationName === 'ring-arrive').every(a => a.playState === 'finished'),
    null, { timeout: 8000 });
  await arrived(page);

  // Single-file law: no scripts, no stylesheets, no deps
  ok('no <script> elements', await page.locator('script').count() === 0);
  ok('no stylesheets or off-origin links — only the B63 favicon links',
    await page.locator('link').evaluateAll(ls => ls.every(l =>
      ['icon', 'apple-touch-icon', 'shortcut icon'].includes(l.rel) &&
      l.href.startsWith(location.origin))));
  ok('no external network requests beyond the page itself', await page.evaluate(() => performance.getEntriesByType('resource')
    .every(r => r.name.startsWith('data:') || r.name.startsWith(location.origin))));

  // issue #133 §1: three employer cards, chronological order
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
  // fixed sleep (a loaded runner can still be mid-turn at 600ms). Issue #331:
  // "landed" is no slot's transform still transitioning — the 8→1 wrap turns
  // the long way round (B98), so mid-turn slots sweep through 0° — and the
  // front card is read in that same evaluation, never in a second one.
  const centered = async () => (await page.waitForFunction(() => {
    const slots = [...document.querySelectorAll('.carousel__slot')];
    if (slots.some(s => s.getAnimations().some(a =>
      a.transitionProperty === 'transform' && a.playState === 'running'))) return null;
    const slot = slots.find(s => Math.abs(new DOMMatrix(getComputedStyle(s).transform).m11 - 1) < 1e-3);
    return slot && {
      title: slot.querySelector('.gm-title').childNodes[0].textContent.trim(),
      year: slot.querySelector('.gm-uc').textContent.trim(),
      role: slot.dataset.role,
    };
  }, null, { timeout: 5000 })).jsonValue();
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
  ok('B122 — B98\'s "Description coming soon" placeholder is gone: no desc card is empty or draws one',
    await page.evaluate(() => [...document.querySelectorAll('.gm-desc')].every(d =>
      !d.matches(':empty') && getComputedStyle(d, '::before').content === 'none')));
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
        [...document.querySelectorAll('.gm-back')].every(k => !getComputedStyle(k).boxShadow.includes('230, 168, 42'));
    }));
  ok('B98 — the pool dips on each turn: every role names its own copy of the dip',
    await page.evaluate(() => getComputedStyle(document.querySelector('.carousel__pool')).animationName === 'pool-dip-1'));

  // Issue #261: quiet wonder.
  ok('#261 — on load the ring makes ONE turn (~2s, once, every card together) and settles on role 1',
    arrival.length === 8 && arrival.every(a => a.dur === 2000 && a.iter === 1 && a.target === 'carousel__slot') &&
    await page.evaluate(() => [...document.querySelectorAll('.carousel__slot')]
      .every(s => getComputedStyle(s).getPropertyValue('--spin').trim() === '0deg')));
  ok('B121 — the light pool is lit amber (--glow-amber-a); B99\'s cool moonlight is gone',
    await page.evaluate(() => {
      const bg = getComputedStyle(document.querySelector('.carousel__pool')).backgroundImage;
      const root = getComputedStyle(document.documentElement);
      return root.getPropertyValue('--glow-amber-a').trim() === '230 168 42' && bg.includes('rgba(230, 168, 42') &&
        root.getPropertyValue('--moon-a').trim() === '';
    }));
  const glass = await page.evaluate(() => {
    const d = document.querySelector('.carousel__slot[data-role="1"] .gm-desc');
    const cs = getComputedStyle(d);
    const root = getComputedStyle(document.documentElement);
    return { bg: cs.backgroundColor, color: cs.color, top: cs.borderTopColor,
             water: root.getPropertyValue('--water-top').trim(), filter: cs.backdropFilter };
  });
  const rgba = c => { const n = c.match(/[\d.]+/g).map(Number);
    // color(srgb r g b / a) is 0..1; rgb()/rgba() is 0..255
    return c.startsWith('color(') ? { r: n[0] * 255, g: n[1] * 255, b: n[2] * 255, a: n[3] ?? 1 }
                                  : { r: n[0], g: n[1], b: n[2], a: n[3] ?? 1 }; };
  const relLum = ({ r, g, b }) => [r, g, b].map(v => v / 255)
    .map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
    .reduce((s, c, i) => s + c * [0.2126, 0.7152, 0.0722][i], 0);
  {
    const bg = rgba(glass.bg), ink = rgba(glass.color);
    const under = { r: parseInt(glass.water.slice(1, 3), 16), g: parseInt(glass.water.slice(3, 5), 16), b: parseInt(glass.water.slice(5, 7), 16) };
    const over = k => bg[k] * bg.a + under[k] * (1 - bg.a);   // the glass over the brightest thing behind it
    const comp = { r: over('r'), g: over('g'), b: over('b') };
    const ratio = (relLum(ink) + 0.05) / (relLum(comp) + 0.05);
    // B121: the glass fill is --card (0.033), so the darkness bound is 0.05, not B73's 0.02;
    // the lit top edge is amber, so red leads blue (it was the moonlight's blue)
    ok('#261 — the front card is smoked glass: translucent, no backdrop-filter, light ink, an amber-lit top edge',
      bg.a > 0.5 && bg.a < 0.95 && relLum(bg) < 0.05 && relLum(ink) > 0.8 &&
      (glass.filter === 'none' || !glass.filter) && rgba(glass.top).r > rgba(glass.top).b);
    ok(`#261 — glass legibility: light text over the glass over --water-top holds ≥ 7:1 (${ratio.toFixed(1)}:1)`,
      ratio >= 7);
  }
  ok('#261 — the glimmer runs on the front card only (2 sweeps: its title and back card)',
    await page.evaluate(() => {
      const on = [...document.querySelectorAll('.gm-title, .gm-back')]
        .filter(e => getComputedStyle(e, '::after').animationName === 'gm-marquee');
      return on.length === 2 && on.every(e => e.closest('.carousel__slot').dataset.role === '1');
    }));
  ok('#261 — contact shadows: every card casts a soft shadow on the floor',
    await page.evaluate(() => [...document.querySelectorAll('.carousel__slot')].every(s => {
      const b = getComputedStyle(s, '::before');
      return b.content === '""' && b.backgroundImage.startsWith('radial-gradient') && b.backgroundImage.includes('rgba(0, 0, 0');
    })));
  ok('#261 — a fine, static, desaturated film grain sits over the deep (B121: deep teal)',
    await page.evaluate(() => {
      const bi = getComputedStyle(document.body).backgroundImage;
      return bi.includes('feTurbulence') && bi.includes('saturate') &&
        getComputedStyle(document.body).backgroundColor === 'rgb(3, 53, 50)' &&
        !document.getAnimations().some(a => a.effect.target === document.body);
    }));
  ok('#261 — every card carries a label for its own role; the front card\'s is removed',
    await page.evaluate(() => [...document.querySelectorAll('.carousel__slot')].every(s => {
      const l = s.querySelector(':scope > .carousel__slot-hit');
      return l && l.htmlFor === `role-${s.dataset.role}` &&
        (getComputedStyle(l).display === 'none') === (s.dataset.role === '1');
    })));

  // Hover answers (a pointer that can hover), then a real click on a side card.
  const hitCenter = r => page.evaluate(n => {
    const b = document.querySelector(`.carousel__slot[data-role="${n}"] .carousel__slot-hit`).getBoundingClientRect();
    return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  }, r);
  const slotState = r => page.evaluate(n => {
    const s = document.querySelector(`.carousel__slot[data-role="${n}"]`);
    const m = new DOMMatrix(getComputedStyle(s).transform); const w = s.offsetWidth / 2;
    return { bright: parseFloat(getComputedStyle(s).filter.replace(/[^\d.]/g, '')),
             nearZ: Math.max(m.transformPoint(new DOMPoint(-w, 0, 0)).z, m.transformPoint(new DOMPoint(w, 0, 0)).z),
             y: m.m42 };
  }, r);
  const rest2 = await slotState('2');
  const p2 = await hitCenter('2');
  await page.mouse.move(p2.x, p2.y);
  await page.waitForTimeout(650);
  const hov2 = await slotState('2');
  ok('#261 — a pointed-at side card lifts out of the dark (brighter, risen) and stays behind the front card',
    hov2.bright > rest2.bright + 0.15 && hov2.y < rest2.y - 1 &&
    Math.abs(hov2.nearZ - rest2.nearZ) < 1 && hov2.nearZ < -1);
  await page.mouse.click(p2.x, p2.y);
  await page.waitForTimeout(650);
  ok('#261 — clicking a visible side card turns the ring to it (no script)',
    await page.locator('#role-2').isChecked() && (await centered()).role === '2');
  const p1 = await hitCenter('1');
  await page.mouse.click(p1.x, p1.y);
  await page.waitForTimeout(650);
  ok('#261 — clicking the card on the other side turns back to it', await page.locator('#role-1').isChecked());
  await page.mouse.move(5, 5);

  const emp = await page.evaluate(() => {
    const c = document.querySelector('.topband__card[data-employer="brinker-capital"]').getBoundingClientRect();
    return { x: c.x + c.width / 2, y: c.y + c.height / 2 };
  });
  await page.mouse.move(emp.x, emp.y);
  await page.waitForTimeout(350);
  ok('#261 — an unselected employer card answers hover with a soft bloom (the door-card geometry)',
    await page.evaluate(() => {
      const sh = getComputedStyle(document.querySelector('.topband__card[data-employer="brinker-capital"]')).boxShadow;
      const blur = parseFloat((sh.match(/\)\s+[-\d.]+px\s+[-\d.]+px\s+([\d.]+)px/) || [])[1]);
      return sh.includes('230, 168, 42') && blur > 20;
    }));
  const nextBox = await page.evaluate(() => {
    const l = [...document.querySelectorAll('.carousel__nav--next .carousel__nav-hit')].find(e => getComputedStyle(e).display !== 'none');
    const b = l.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  });
  const chev = () => page.evaluate(() => {
    const l = [...document.querySelectorAll('.carousel__nav--next .carousel__nav-hit')].find(e => getComputedStyle(e).display !== 'none');
    const cs = getComputedStyle(l, '::before'); return { color: cs.borderTopColor, x: new DOMMatrix(cs.transform).m41 };
  });
  const chevRest = await chev();
  await page.mouse.move(nextBox.x, nextBox.y);
  await page.waitForTimeout(300);
  const chevHov = await chev();
  ok('#261 — the next arrow brightens and nudges the way it points on hover',
    chevHov.color === 'rgb(244, 245, 241)' && chevHov.x > chevRest.x + 2);
  const cta = await page.locator('.parking-lot .cta').boundingBox();
  const ctaRest = await page.evaluate(() => getComputedStyle(document.querySelector('.cta')).boxShadow);
  await page.mouse.move(cta.x + cta.width / 2, cta.y + cta.height / 2);
  await page.waitForTimeout(300);
  ok('#261 — the CTA holds the light at rest and lifts on hover',
    ctaRest.includes('230, 168, 42') &&
    await page.evaluate(() => new DOMMatrix(getComputedStyle(document.querySelector('.cta')).transform).m42 < -1));
  ok('#261 — the tools and education lines sit a step quieter than the facts (--ink-dim)',
    await page.evaluate(() => [...document.querySelectorAll('.parking-lot__tools')]
      .every(t => getComputedStyle(t).color === 'rgba(244, 245, 241, 0.65)')));   // B121: --ink-dim 0.55 -> 0.65
  await page.mouse.move(5, 5);

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
  // Issue #329: every glowing card is recorded, so a second glow fails. The
  // pointer leaves the band first — the Brinker click above left it resting
  // there, and the #261 hover bloom shares the glow's 230,168,42. Each read
  // waits for the expected card's 200ms box-shadow transition to settle
  // rather than sleeping; a timeout falls through to the assertion, which
  // prints what it saw.
  const EMPLOYER_OF = ['pnc-bank', 'pnc-bank', 'pnc-bank', 'pnc-private-bank',
    'pnc-private-bank', 'brinker-capital', 'brinker-capital', 'brinker-capital'];
  await page.mouse.move(5, 5);
  const glowMap = await (async () => {
    const out = [];
    for (let role = 1; role <= 8; role++) {
      await page.evaluate(r => document.getElementById('role-' + r).click(), role);
      await page.waitForFunction(e => {
        const card = document.querySelector('.topband__card[data-employer="' + e + '"]');
        return card.getAnimations().length === 0 && getComputedStyle(card).boxShadow.includes('230, 168, 42');
      }, EMPLOYER_OF[role - 1], { timeout: 2000 }).catch(() => {});
      const glowing = await page.evaluate(() =>
        ['pnc-bank', 'pnc-private-bank', 'brinker-capital'].filter(e =>
          getComputedStyle(document.querySelector('.topband__card[data-employer="' + e + '"]')).boxShadow.includes('230, 168, 42')));
      out.push(role + ':' + glowing.join('+'));
    }
    return out;
  })();
  ok('B95 — the two-way title-card glow tracks the centred role\'s employer',
    JSON.stringify(glowMap) === JSON.stringify(EMPLOYER_OF.map((e, i) => (i + 1) + ':' + e)),
    JSON.stringify(glowMap));

  // B64 (issue #176) and B122 (issue #347): every desc card carries the owner's copy —
  // B64's three verbatim, B122's five with the four slips the owner chose to fix.
  const DESC_COPY = {
    'Branch Sales & Service Representative': [
      'Delivered a unique customer experience aimed at improving customer financial wellbeing and creating loyalty while increasing share of wallet.',
      'Identified sales opportunities through meaningful conversations while servicing customers, making appropriate referrals to branch staff.',
      'Ensured teller and branch daily operations and maintenance transactions are completed in an efficient and accurate manner.',
      'Supported proactive sales conversations through internal and outbound interactions with a defined sales process including service to sales, teller interactions, and effective lobby engagement.',
    ],
    'Branch Sales & Service Associate': [
      'Educated customers on options for managing financial transactions by leveraging technology, tools and resources, identifying banking opportunities during the customer interaction and referring to internal partners where appropriate.',
      'Built and developed client relationships through meaningful, value-adding conversations that uncover financial needs while solving complex issues through multichannel engagement, lobby engagement, external events, and business relationships.',
    ],
    'Client Service Associate': [
      'Supported the fiduciary team in day-to-day trust administration services.',
      'Provided exceptional client service and flawless execution on client requests, inquiries, and transaction needs for grantors, trustees, beneficiaries and interested parties.',
      'Acted as the escalation point for complex administration issues, collaborating with internal and external parties while ensuring compliance with all legal and fiduciary regulations, policies and procedures.',
    ],
    'Trader': [
      'Managed trading activity of routine operations for client accounts, such as liquidity, allocation changes, rebalancing, cash movement, etc. for SMA and UMA portfolios.',
      'Monitored assigned trading queues and portfolios for exceptions, model and allocation drift, illiquid assets, etc.',
      'Worked with developers to test and improve system enhancements and process changes.',
    ],
    'Portfolio Specialist': [
      'Developed exception monitoring tools and data models for ensuring portfolio adherence to client objectives and model allocations.',
    ],
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
  ok('all 8 desc cards render the owner\'s copy, one paragraph per <br><br> break', await page.evaluate(copy => {
    const nrm = x => x.replace(/\s+/g, ' ').trim();
    const slots = [...document.querySelectorAll('.carousel__slot')];
    let filled = 0, wrong = 0;
    for (const s of slots) {
      const t = s.querySelector('.gm-title').childNodes[0].textContent.trim();
      const d = s.querySelector('.gm-desc');
      if (copy[t]) {
        filled++;
        const text = html => { const t = document.createElement('div'); t.innerHTML = html; return nrm(t.textContent); };
        const paras = d.innerHTML.split('<br><br>').map(text);
        if (JSON.stringify(paras) !== JSON.stringify(copy[t].map(nrm))) wrong++;
      }
    }
    return filled === 8 && wrong === 0;
  }, DESC_COPY));

  // B87 (issue #218): each role's year is nested inside its title card.
  ok('B87 — each of the 8 role years is nested inside its title card',
    await page.evaluate(() =>
      document.querySelectorAll('.gm-title .gm-uc').length === 8 &&
      [...document.querySelectorAll('.gm-uc')].every(u => !!u.closest('.gm-title'))));

  // B95 (issue #250): uniform components — all 8 plates render at one
  // standardized size (the desc and title cards at one uniform footprint),
  // scaled together by the slot's single --u; only the longest copies
  // (roles 1 and 8, B95's stated exception; role 1 since B122) scroll.
  const b95uniform = await page.evaluate(() => {
    const rows = [...document.querySelectorAll('.carousel__slot')].map(s => {
      const gm = s.querySelector('.gregorian-mode');
      const d = s.querySelector('.gm-desc');
      const t = s.querySelector('.gm-title');
      return { plateW: gm.clientWidth, plateH: gm.offsetHeight,
               descW: d.clientWidth, descH: d.offsetHeight, titleH: t.offsetHeight,
               role: s.dataset.role, scrollable: d.scrollHeight > d.clientHeight + 1 };
    });
    return {
      onePlate: rows.every(r => r.plateW === rows[0].plateW && r.plateH === rows[0].plateH),
      oneDesc: rows.every(r => r.descW === rows[0].descW && r.descH === rows[0].descH),
      oneTitle: rows.every(r => r.titleH === rows[0].titleH),
      scrollRoles: rows.filter(r => r.scrollable).map(r => r.role).join(','),
    };
  });
  ok('B95 — all 8 components render at one standardized plate size',
    b95uniform.onePlate && b95uniform.oneTitle && b95uniform.oneDesc);
  ok('B95/B122 — only the longest copies (roles 1 and 8) scroll inside the uniform desc card',
    b95uniform.scrollRoles === '1,8', b95uniform.scrollRoles);

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

  // issue #133 §3 and UIUX §10: footer and tokens
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

  // UIUX §10.1: the B121 teal-and-amber ladder (supersedes B73's gray)
  const tokens = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    return { deep: cs.getPropertyValue('--deep').trim(), card: cs.getPropertyValue('--card').trim(),
             frame: cs.getPropertyValue('--frame').trim(), note: cs.getPropertyValue('--note').trim(),
             glow: cs.getPropertyValue('--glow-amber').trim(), gray: cs.getPropertyValue('--glow-gray').trim() };
  });
  ok('the ladder is deep teal lit by amber (B121); no value ships under the gray glow\'s name',
    tokens.deep === '#033532' && tokens.card === '#013a36' && tokens.frame === '#559791' &&
    tokens.note === '#eec57e' && tokens.glow === '#e6a82a' && tokens.gray === '');
  const lum = hex => {
    const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  ok('luminance ladder holds: card one step above deep; the amber glow is the light, above frame (B121)',
    lum(tokens.card) > lum(tokens.deep) && lum(tokens.card) / lum(tokens.deep) < 4 &&
    lum(tokens.glow) > lum(tokens.frame));
  // B121: --deep and --card rose, so the quiet text (--ink-dim) is read against its two grounds.
  const inkDim = rgba(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--ink-dim').trim()));
  const dimOver = ground => ({ r: inkDim.r * inkDim.a + ground.r * (1 - inkDim.a),
    g: inkDim.g * inkDim.a + ground.g * (1 - inkDim.a), b: inkDim.b * inkDim.a + ground.b * (1 - inkDim.a) });
  {
    const card = { r: parseInt(tokens.card.slice(1, 3), 16), g: parseInt(tokens.card.slice(3, 5), 16), b: parseInt(tokens.card.slice(5, 7), 16) };
    const ratio = (relLum(dimOver(card)) + 0.05) / (relLum(card) + 0.05);
    ok(`B121 — the unselected employers' dim ink on --card clears AA, ≥ 4.5:1 (${ratio.toFixed(2)}:1)`, ratio >= 4.5);
  }
  // The lot is a gradient, so its ground is read from the render: the lines are hidden, the
  // pixels under them sampled, and the dim ink is checked against the lightest of them.
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    // not reducedMotion: there every property runs a 0.01ms transition, and a capture can beat it
    const lot = await browser.newPage({ viewport: { width: w, height: h } });
    await lot.goto(URL, { waitUntil: 'networkidle' });
    const boxes = await lot.evaluate(() => [...document.querySelectorAll('.parking-lot__tools')]
      .map(t => { const r = t.getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; }));
    const png = (await lot.screenshot({ style: '.parking-lot__tools, .parking-lot__tools * { visibility: hidden !important; }' })).toString('base64');
    const grounds = await lot.evaluate(async ({ png, boxes }) => {
      const img = new Image(); img.src = 'data:image/png;base64,' + png; await img.decode();
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
      const x = c.getContext('2d'); x.drawImage(img, 0, 0);
      const out = [];
      for (const [bx, by, bw, bh] of boxes) for (const fy of [0.1, 0.5, 0.9]) for (const fx of [0.05, 0.5, 0.95]) {
        const d = x.getImageData(Math.round(bx + bw * fx), Math.round(by + bh * fy), 1, 1).data;
        out.push({ r: d[0], g: d[1], b: d[2] });
      }
      return out;
    }, { png, boxes });
    const ratios = grounds.map(gr => (relLum(dimOver(gr)) + 0.05) / (relLum(gr) + 0.05));
    const worst = Math.min(...ratios);
    ok(`B121 — at ${w}×${h} the footer's tools and education lines (--ink-dim) clear AA on the lot, ≥ 4.5:1 (${worst.toFixed(2)}:1)`,
      boxes.length === 2 && worst >= 4.5,
      JSON.stringify({ boxes: boxes.map(b => b.map(Math.round)), ground: grounds[ratios.indexOf(worst)] }));
    await lot.close();
  }

  // a11y + reduced motion
  ok('one off-canvas h1; three h2 wordmarks; the role ring is the named radio group',
    await page.evaluate(() =>
      document.querySelectorAll('h1').length === 1 &&
      document.querySelector('h1').classList.contains('visually-hidden') &&
      document.querySelectorAll('h2.topband__wordmark').length === 3 &&
      document.querySelector('.carousel[role="radiogroup"]')?.getAttribute('aria-label') === 'Choose a role'));
  await page.locator('#role-1').check({ force: true });
  ok('unselected employer cards use dim italic ink while the selected card stays regular',
    await page.evaluate(() => {
      const selected = getComputedStyle(document.querySelector('.topband__card[data-employer="pnc-bank"]'));
      const unselected = getComputedStyle(document.querySelector('.topband__card[data-employer="pnc-private-bank"]'));
      return selected.fontStyle === 'normal' && selected.color === 'rgb(244, 245, 241)' &&
        unselected.fontStyle === 'italic' && unselected.color === 'rgba(244, 245, 241, 0.65)';   // B121: --ink-dim 0.55 -> 0.65
    }));
  const normalCarouselMotion = await page.evaluate(() =>
    getComputedStyle(document.querySelector('.carousel__slot')).transitionDuration);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const reducedCarouselMotion = await page.evaluate(() =>
    getComputedStyle(document.querySelector('.carousel__slot')).transitionDuration);
  const transitionMs = value => value.split(',').map(part => {
    const n = parseFloat(part);
    return part.trim().endsWith('ms') ? n : n * 1000;
  });
  ok('reduced motion collapses carousel transitions to 0.01ms',
    Math.max(...transitionMs(normalCarouselMotion)) > 0.01 &&
    transitionMs(reducedCarouselMotion).every(ms => ms <= 0.01),
    `normal=${normalCarouselMotion}; reduced=${reducedCarouselMotion}`);

  // B98 (issue #257): on a phone the ring is the same ring, scaled down —
  // the B95 clip wrapper collapsed to 0px tall here before.
  const phone = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await phone.goto(URL, { waitUntil: 'networkidle' });
  await arrived(phone);
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

  // B120 (issue #259): where the slot is narrow enough that the title's type
  // sits on B76's 11px floor, the title card takes the description card's
  // width and grows to fit the longest title, so every title and year shows
  // in full and all 8 title cards keep one height (B95). Above the floor the
  // card keeps its 427u source width.
  const titleFit = pg => pg.evaluate(() => {
    const slots = [...document.querySelectorAll('.carousel__slot')];
    const rows = slots.map(s => {
      const t = s.querySelector('.gm-title');
      // drawn ink, not scrollHeight: above the floor the year may run into
      // the card's bottom padding, which cuts nothing
      const y = t.querySelector('.gm-uc').getBoundingClientRect();
      const inside = y.bottom <= t.getBoundingClientRect().bottom - t.clientTop;
      return { fits: t.scrollHeight <= t.clientHeight, inside, h: t.offsetHeight,
               w: t.offsetWidth, descW: s.querySelector('.gm-desc').offsetWidth,
               slotW: s.offsetWidth, title: t.childNodes[0].textContent.trim() };
    });
    const fit = getComputedStyle(document.querySelector('.gregorian-mode'))
      .getPropertyValue('--gm-fit').trim().replace(/^"|"$/g, '');
    return { rows, fit, floor: rows[0].slotW < 830 * 11 / 28 };
  });
  for (const [w, h] of [[390, 844], [320, 568], [744, 1000]]) {
    const pg = w === 390 ? phone : await browser.newPage({ viewport: { width: w, height: h } });
    if (pg !== phone) { await pg.goto(URL, { waitUntil: 'networkidle' }); await arrived(pg); }
    const f = await titleFit(pg);
    ok(`B120 — at ${w}×${h} the title type is on its 11px floor`, f.floor);
    ok(`B120 — at ${w}×${h} every role's full title and year show on its title card`,
      f.rows.every(r => r.fits && r.inside), JSON.stringify(f.rows.map(r => r.title + ':' + r.fits)));
    ok(`B120 — at ${w}×${h} all 8 title cards keep one height and take the desc card's width`,
      f.rows.every(r => r.h === f.rows[0].h && Math.abs(r.w - r.descW) <= 1),
      JSON.stringify(f.rows.map(r => [r.h, r.w, r.descW])));
    if (pg !== phone) await pg.close();
  }
  const desk = await titleFit(page);
  ok('B120 — the fit title is role 1\'s, the longest', desk.fit === desk.rows[0].title);
  ok('B120 — above the floor the title card keeps its 427u source width',
    !desk.floor && desk.rows.every(r => Math.abs(r.w - 427 * r.slotW / 830) <= 1));
  ok('B120 — above the floor every role\'s year still sits inside its title card',
    desk.rows.every(r => r.inside));

  // Issue #261: reduced motion drops motion only -- no arrival, no glimmer,
  // no hover rise -- while the light, glass, shadows and grain stay.
  const still = await browser.newPage({ viewport: { width: 1440, height: 1110 }, reducedMotion: 'reduce' });
  await still.goto(URL, { waitUntil: 'networkidle' });
  const rm = await still.evaluate(() => ({
    arrive: document.getAnimations().filter(a => a.animationName === 'ring-arrive').length,
    glimmer: [...document.querySelectorAll('.gm-title, .gm-back')].filter(e => getComputedStyle(e, '::after').content !== 'none').length,
    glass: getComputedStyle(document.querySelector('.gm-desc')).backgroundColor,
    grain: getComputedStyle(document.body).backgroundImage.includes('feTurbulence'),
    pool: getComputedStyle(document.querySelector('.carousel__pool')).backgroundImage.includes('230, 168, 42'),
    frontM11: new DOMMatrix(getComputedStyle(document.querySelector('.carousel__slot[data-role="1"]')).transform).m11,
  }));
  ok('#261 — reduced motion: no arrival turn and no glimmer; the ring is settled at once',
    rm.arrive === 0 && rm.glimmer === 0 && Math.abs(rm.frontM11 - 1) < 1e-3);
  ok('#261 — reduced motion keeps the light, the glass and the grain',
    rm.grain && rm.pool && rgba(rm.glass).a < 0.95);
  const s3 = await still.evaluate(() => {
    const b = document.querySelector('.carousel__slot[data-role="2"] .carousel__slot-hit').getBoundingClientRect();
    return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  });
  const y0 = await still.evaluate(() => new DOMMatrix(getComputedStyle(document.querySelector('.carousel__slot[data-role="2"]')).transform).m42);
  await still.mouse.move(s3.x, s3.y);
  await still.waitForTimeout(100);
  ok('#261 — reduced motion: a hovered side card brightens but does not rise',
    await still.evaluate(y => {
      const s = document.querySelector('.carousel__slot[data-role="2"]');
      return Math.abs(new DOMMatrix(getComputedStyle(s).transform).m42 - y) < 0.5 &&
        getComputedStyle(s).getPropertyValue('--lift').trim() === '1';
    }, y0));
  const nextHit = await still.evaluate(() => {
    const el = [...document.querySelectorAll('.carousel__nav--next .carousel__nav-hit')]
      .find(node => getComputedStyle(node).display !== 'none');
    const rect = el.getBoundingClientRect();
    return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
  });
  const nextArrow = () => still.evaluate(() => {
    const el = [...document.querySelectorAll('.carousel__nav--next .carousel__nav-hit')]
      .find(node => getComputedStyle(node).display !== 'none');
    const css = getComputedStyle(el, '::before');
    return { color: css.borderTopColor, transform: css.transform };
  });
  const arrowRest = await nextArrow();
  await still.mouse.move(nextHit.x, nextHit.y);
  await still.waitForTimeout(50);
  const arrowHover = await nextArrow();
  ok('#261 — reduced motion: the arrow brightens but its 3px hover nudge is removed',
    arrowHover.color === 'rgb(244, 245, 241)' && arrowHover.transform === arrowRest.transform);
  await still.mouse.down();
  const arrowPressed = await nextArrow();
  ok('#261 — reduced motion removes the arrow press scale',
    arrowPressed.transform === arrowHover.transform);
  await still.mouse.up();


  // Issue #261: phones get everything except hover; a tap turns the ring.
  const touch = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const tp = await touch.newPage();
  await tp.goto(URL, { waitUntil: 'networkidle' });
  await arrived(tp);
  const t2 = await tp.evaluate(() => {
    const b = document.querySelector('.carousel__slot[data-role="2"] .carousel__slot-hit').getBoundingClientRect();
    return { x: b.x + b.width / 2, y: b.y + b.height / 2, hover: matchMedia('(hover: hover)').matches };
  });
  await tp.tap('body', { position: { x: t2.x, y: t2.y } });
  await tp.waitForTimeout(650);
  ok('#261 — on a phone (no hover) tapping a side card turns the ring to it',
    !t2.hover && await tp.locator('#role-2').isChecked());

  await browser.close();
  console.log(failures === 0 ? '\nCAREER PASS' : `\nCAREER FAIL: ${failures}`);
  process.exit(failures === 0 ? 0 : 1);
})().catch(e => { console.error('ERROR', e); process.exit(2); });