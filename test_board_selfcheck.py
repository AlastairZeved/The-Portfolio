#!/usr/bin/env python3
"""test_board_selfcheck.py — issue 0001 §9 acceptance gate, run with plain python3.

Parses EVERY board in assets/content-of-boards.json (no sampling) and asserts:
    total notes = 72 · total links = 43 · total lot entries = 4 · orphan links = 0
It also asserts the ladder hexes are byte-identical to issue §2 (§2.2.2), that
no monospace face exists anywhere in the engine, and that the §7 strip-list
chrome is absent from the built sources — asserted, not eyeballed.

README.md is also IN CONTRACT (issue #21): the per-board table is asserted
cell by cell against assets/content-of-boards.json and every prose count is
swept. docs/issues/0001-board-engine.md is explicitly OUT OF CONTRACT — the
dated acceptance record of a completed issue, whose quoted counts must never
be asserted.

Issue #5 finding 5 additionally asserts on RENDERED behaviour, not spelling:
the six pages are booted in headless Chromium over a loopback http.server and
the lot geometry, link endpoints, font face and chrome surface are asserted
on as computed by the browser. `python3 test_board_selfcheck.py --prove-gates`
re-runs the gate against four deliberate regressions and proves each fails.

No framework, no fixtures. Exit 0 on green, raise AssertionError loudly on red.
"""
import argparse
import asyncio
import functools
import hashlib
import http.server
import json
import math
import pathlib
import re
import socketserver
import sys
import threading
import time

ROOT = pathlib.Path(__file__).resolve().parent
DATA = ROOT / "assets" / "content-of-boards.json"

EXPECTED_SHA256 = "5ccb39a587bbb59a8205b0669e8948edaaa2bf57fa607b939f9ca431b0ddb255"

# §2.2.2 ladder, byte-identical (issue §2 was verified against source by the orchestrator)
LADDERS = {
    "todo":     {"deep": "#020812", "card": "#08152c", "frame": "#698ebf", "note": "#a0d4da",
                 "water-top": "#34697f", "water-mid": "#255265", "water-bot": "#163646"},
    "idea":     {"deep": "#000a06", "card": "#001a0e", "frame": "#52997f", "note": "#b9d2b2",
                 "water-top": "#486b49", "water-mid": "#345439", "water-bot": "#1f3825"},
    "note":     {"deep": "#0c0512", "card": "#1e0f28", "frame": "#9d80b9", "note": "#cec6ed",
                 "water-top": "#6d5b83", "water-mid": "#534769", "water-bot": "#382e47"},
    "learning": {"deep": "#11040b", "card": "#260e12", "frame": "#b57a9b", "note": "#e6c2c9",
                 "water-top": "#855562", "water-mid": "#6a414c", "water-bot": "#472a35"},
}
FIXED_TOKENS = {
    "chrome": "#020812", "ink-dark": "#031019", "ink-light": "#f4f5f1",
    "accent-page": "#6d9cb0", "accent-restore": "#b6dee2", "accent-copy": "#698ebf",
    "danger": "#e2a08c", "highlight": "#f2d64b",
}

# Owner ruling 1 (§7): chrome that must NOT be built. Searched in the built
# sources only (the data file legitimately contains words like "Delete").
#
# Superseding ruling (2026-09-29, docs/issues/0001-board-engine.md §7): the
# rail chrome mandated by issue #43's wireframe — "New board" pills, Export,
# Import, Collapse, plus the "All Boards" title — is INERT chrome, exempted
# for those four tokens in the rail context (assembly.js). The ponytail:
# this covers ONLY the rail's inert chrome. Upgrade path: if Rob later rules
# the whole §7 strip list retired, rewrite §7 wholesale (a new dated ruling),
# then delete STRIP_TOKENS and the §7 scans together.
STRIP_TOKENS = [
    "note-tb", "note-tb-btn", "reminder", "New board", "Export", "Import",
    "Collapse", "draggable", "resizer", "resize-frame", "resize handle",
    "taskbar", "system tray", "title bar",
    "CALENDAR BOARD", "5A 2026", "board-actions", "action-tab", "trash",
]
# Tokens whose strip assertion no longer applies to the rail chrome files
# (assembly.js + assembly.css, PR #44's files) per the 2026-09-29 §7
# superseding ruling. Every other token still scans every file; these four
# still scan every OTHER file.
# "title bar" appears in assembly.js only as prose describing the mandated
# "All Boards" title bar — the same exempted rail chrome.
RAIL_CHROME_TOKENS = ["New board", "Export", "Import", "Collapse", "title bar"]
RAIL_CHROME_FILES = ["assembly.js", "assembly.css"]
# Owner ruling 2026-09-27: no monospace face anywhere.
MONO_TOKENS = ["monospace", "mono,", "Courier", "Consolas", "Menlo", "JetBrains"]

# ---------------------------------------------------------------------------
# Issue #5 finding 5 — the RENDERED gate. Constants.
#
# The source guards above are a spelling scan: a rename passes them while the
# real surface still reaches the board, and they read only three of the eight
# files that can produce the surface (assembly.js and the five static pages
# were invisible — post-#7, assembly.js builds the rail the pages used to
# carry statically). The assertions at the bottom of main() boot all six
# pages in headless Chromium over a loopback http.server and assert on what
# the browser COMPUTES: §3.2 lot geometry on settled font metrics, §4.6 drawn
# endpoints vs live note centres, computed font-family faces, and a
# structural DOM scan for §7 strip-list chrome.
# ---------------------------------------------------------------------------

# The five static pages keyed on the export's stable board ids (mirrors the
# PAGES map in assembly.js; ids are stable, titles are not — issue #5 finding 2).
BROWSER_PAGES = [
    ("todays-to-do.html", "12d0f2de-6879-43da-ab74-11fdfd054692"),
    ("portfolio-project-ideas.html", "9e5526ca-9991-4743-9e3e-db65b1572361"),
    ("how-does-ai-inference-math-work.html", "b92ceff2-ff76-4280-bc39-9e430ccab19c"),
    ("public-space-mini-grant.html", "ba0c4910-e43e-40fc-886a-d3730c42c897"),
    ("the-life-of-robert-gregory.html", "fa246b33-d8c8-4ec2-9073-2915de0d5764"),
    # index.html boots the landing board in SPA mode (its own PAGES entry).
    ("index.html", "fa246b33-d8c8-4ec2-9073-2915de0d5764"),
]
LANDING_ID = "fa246b33-d8c8-4ec2-9073-2915de0d5764"

# page -> board id, used by the README gate (issue #21). BROWSER_PAGES holds SIX
# entries for FIVE boards: index.html and the-life-of-robert-gregory.html both
# resolve to LANDING_ID, so a naive zip of BROWSER_PAGES would assert six rows
# or trip on a "duplicate" id. The README table is keyed per BOARD (owner
# ruling): the landing board is represented ONCE, by index.html; the static
# twin is NOT a sixth board and a future worker must never "complete" the
# record by adding a sixth row for it.
PAGE_TO_BOARD = {}
for _page, _board_id in BROWSER_PAGES:
    PAGE_TO_BOARD[_page] = _board_id

VIEWPORT = (2560, 1440)   # the wireframes' §3 reference viewport
FONT_DELAY_MS = 250       # cold-load: font-display:swap's fallback phase is the
                          # condition §4.6 exists for; a slow font fetch makes
                          # the fallback pass real instead of cache-lucky.

# Exact text of the fonts.ready guard in board-engine.js. It appears twice
# (renderLinks, then renderLot); --prove-gates neuters the SECOND occurrence.
REMEASURE_GUARD = (
    "    if (document.fonts && document.fonts.ready && document.fonts.status !== 'loaded') {\n"
    "      document.fonts.ready.then(measureAndDraw);\n"
    "    }"
)

# Runs before any page script (add_init_script). Intercepts document.fonts.ready
# LAZILY — the promise must be captured at the ENGINE's first access (renderLinks,
# after the text render has started the font load), NOT at document start:
# Chromium creates the ready promise on access, and an early capture resolves at
# document-load-complete WITHOUT waiting for the swap font (measured t≈33ms,
# status 'loading', stale endpoints — exactly the §4.6 defect shape). The
# bridge is now pass-through: since the issue #6 fix, board-engine.js strips
# each row's min-height itself at the top of measureAndDraw, and this bridge
# must NOT pre-clear those pins — doing so hid the ratchet from the rendered
# gate (QA's PR #12 finding: a faithful ratchet installed under the bridge
# went GREEN because the bridge erased the pins it should have tripped over).
BRIDGE_JS = r"""
(() => {
  const fontSet = document.fonts;
  const realDesc = Object.getOwnPropertyDescriptor(
    Object.getPrototypeOf(fontSet), 'ready');
  let chained = null;
  Object.defineProperty(fontSet, 'ready', {
    configurable: true,
    get() {
      if (!chained) {
        chained = realDesc.get.call(fontSet);
      }
      return {
        then: (fn) => chained.then(fn),
        catch: (fn) => chained.catch(fn),
        finally: (fn) => chained.finally(fn),
      };
    },
  });
})();
"""

# Evaluated on every booted page after fonts settle (see collect_rendered).
PAGE_EVAL_JS = r"""
(boardId) => {
  const root = document.getElementById('board');
  const rh = Number(root.getAttribute('data-rh'));
  const rw = Number(root.getAttribute('data-rw'));
  const lot = document.getElementById('lot');
  const rows = [...document.querySelectorAll('#lot-items .lot-item')];

  // §3.2 model on the CURRENT (settled) layout, computed from the NATURAL row
  // heights (inline min-height zeroed, offsetHeight read back) — issue #6: a
  // model taken from the pinned rows would reward a ratchet that measures its
  // own write-back. rowNatural is now ASSERTED on, not just collected.
  const rowOffset = rows.map(r => r.offsetHeight);
  const rowMin = rows.map(r => parseFloat(getComputedStyle(r).minHeight) || 0);
  const rowNatural = rows.map(r => {
    const m = r.style.minHeight; r.style.minHeight = '0';
    const h = r.offsetHeight; r.style.minHeight = m; return h;
  });
  let sum = 0;
  for (const h of rowNatural) sum += Math.max(44, h);
  let expectedLot = 34 + Math.max(88, sum);
  const ceiling = Math.ceil(0.5 * rh);
  if (expectedLot > ceiling) expectedLot = ceiling;

  // §4.6: live settled note centres vs the drawn line endpoints.
  const board = (window.__boards || []).find(b => String(b.id) === String(boardId));
  const byId = {};
  document.querySelectorAll('#notes .note').forEach(el => {
    const n = board.notes[Number(el.getAttribute('data-idx'))];
    byId[n.id] = { cx: n.x + (el.offsetWidth * n.scale) / 2,
                   cy: n.y + (el.offsetHeight * n.scale) / 2 };
  });
  const expectedLines = (board.links || []).map(l => {
    const a = byId[l.a], b = byId[l.b];
    return a && b ? [a.cx, a.cy, b.cx, b.cy] : null;
  }).filter(Boolean);
  const drawn = [...document.querySelectorAll('#link-layer line')].map(l => [
    parseFloat(l.getAttribute('x1')), parseFloat(l.getAttribute('y1')),
    parseFloat(l.getAttribute('x2')), parseFloat(l.getAttribute('y2'))]);

  // Mono ruling: computed font-family of EVERY element (not source text).
  const monoRe = /\bmono\b|monospace|courier|consolas|menlo|jetbrains/i;
  const monoHits = [];
  document.querySelectorAll('*').forEach(el => {
    const f = getComputedStyle(el).fontFamily;
    if (monoRe.test(f)) monoHits.push(el.tagName + '.' + (el.getAttribute('class') || '') + ' -> ' + f);
  });

  // §7 chrome scan — STRUCTURAL, because data text legitimately carries
  // chrome words (the dataset renders "Mattress and Trash Cleanup"). Owned
  // data text (note text, lot text) is exempt; everything the ASSEMBLY or a
  // stray engine path could add is scanned: form controls outside the §12
  // contact form, chrome-named classes/ids, visible chrome words, inline
  // !important, and stylesheet !important outside the reduced-motion guard.
  const isDataOwned = el =>
    el.closest('.note') ||
    (el.closest('.lot-item') && !el.closest('#lot-contact-form'));
  // §7 superseding ruling (2026-09-29): the rail's inert chrome — the #rail
  // panel ("All Boards" title bar, group "New board" pills, "‹ Collapse") and
  // the #board-chrome Export/Import pair — is mandated as drawn and exempt
  // from this scan, scoped to those two containers ONLY. Chrome named
  // classes/ids and everything outside them still fail the scan.
  const isRailChrome = el => el.closest('#rail, #board-chrome');
  const stripAttrs = /note-tb|board-actions|action-tab|taskbar|resize-frame|resizer|draggable-resize/i;
  const stripWords = /\b(Export|Import|Collapse|reminder|taskbar|resizer|New board|note-tb|board-actions|action-tab|resize handle|system tray|title bar|CALENDAR BOARD)\b/;
  const chrome = [];
  document.querySelectorAll('button, input, select, textarea').forEach(el => {
    if (isRailChrome(el)) return;
    if (!el.closest('#lot-contact-form'))
      chrome.push('control: ' + el.tagName + (el.id ? '#' + el.id : ''));
  });
  document.querySelectorAll('[class], [id]').forEach(el => {
    const s = (el.getAttribute('class') || '') + ' ' + (el.getAttribute('id') || '');
    if (stripAttrs.test(s)) chrome.push('attr: ' + el.tagName + ' ' + s.trim());
  });
  document.querySelectorAll('*').forEach(el => {
    if (el.childElementCount) return;
    const t = el.textContent && el.textContent.trim();
    if (!t || isDataOwned(el) || isRailChrome(el)) return;
    if (stripWords.test(t))
      chrome.push('text: ' + el.tagName + ' ' + JSON.stringify(t.slice(0, 60)));
  });
  document.querySelectorAll('[style]').forEach(el => {
    if (/!important/.test(el.getAttribute('style')))
      chrome.push('inline !important: ' + el.tagName + ' ' + el.getAttribute('style').slice(0, 60));
  });
  const cssImportant = [];
  try {
    const walk = rules => { for (const r of rules) {
      if (r.cssRules) walk(r.cssRules);
      else if (/!important/.test(r.cssText) &&
               !(r.parentRule && r.parentRule.media &&
                 /prefers-reduced-motion/.test(r.parentRule.media.mediaText || '')))
        cssImportant.push(r.cssText.slice(0, 80));
    }};
    for (const sheet of document.styleSheets) walk(sheet.cssRules);
  } catch (e) { cssImportant.push('CSSOM error: ' + e.message); }

  return {
    fontsLoaded: document.fonts.status === 'loaded',
    montserratFaces: [...document.fonts]
      .filter(f => f.family === 'Montserrat Alternates')
      .map(f => f.status),
    rh, rw, ceiling,
    lotHeight: lot.offsetHeight, lotStyle: lot.style.height,
    expectedLot, rowOffset, rowMin, rowNatural,
    dataK: parseFloat(root.getAttribute('data-k')),
    dataRenderScale: parseFloat(root.getAttribute('data-render-scale')),
    dataPaintScale: parseFloat(root.getAttribute('data-paint-scale')),
    transform: root.style.transform,
    expectedLines, drawn,
    monoHits, chrome, cssImportant,
    formPresent: !!document.getElementById('lot-contact-form'),
    titleText: document.getElementById('board-title').textContent,
    // -- issue #28: the title CARD's rendered box, its bottom border, its
    //    overhang of the band rule, and its widest text line (for the
    //    box:text ratio that distinguishes a wider card from scaled text).
    bandTitle: (() => {
      const el = document.getElementById('board-title');
      const band = document.getElementById('band');
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const ctx = document.createElement('canvas').getContext('2d');
      ctx.font = cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
      const lines = el.textContent.split('\n').map(s => s.trim()).filter(Boolean);
      const comps = document.getElementById('zone-components');
      const reqs = document.getElementById('zone-requirements');
      return {
        x: r.x, y: r.y, w: r.width, h: r.height,
        cardBottom: r.bottom,
        bandBottom: band.getBoundingClientRect().bottom,
        cardH: el.offsetHeight, bandH: band.offsetHeight,
        bottomBorder: parseFloat(cs.borderBottomWidth),
        widest: lines.length ? Math.max(...lines.map(l => ctx.measureText(l).width)) : 0,
        // -- issue #31: the reference app's title-compartment declarations,
        //    as COMPUTED on the rendered card (TheBoards styles.css:476-498).
        textAlign: cs.textAlign,
        fontWeight: cs.fontWeight,
        borderTopWidth: cs.borderTopWidth,
        borderRadius: cs.borderRadius,
        padding: cs.padding,
        display: cs.display, flexDir: cs.flexDirection, justify: cs.justifyContent,
        compRight: comps ? comps.getBoundingClientRect().right : null,
        reqLeft: reqs ? reqs.getBoundingClientRect().left : null,
      };
    })(),
    // -- issue #37: the band's ZONE LAW as RENDERED — each zone's own box, its
    //    tab's box (centre = own zone's centre), and the requirements zone's
    //    first text line's ink box (left-anchored at the zone's edge).
    zoneLaw: (() => {
      const rect = (el) => { const b = el.getBoundingClientRect();
        return { left: b.left, right: b.right }; };
      const comps = document.getElementById('zone-components');
      const reqs = document.getElementById('zone-requirements');
      const compsH = document.getElementById('zone-components-header');
      const reqsH = document.getElementById('zone-requirements-header');
      let inkLeft = null;
      if (reqs && reqs.firstChild && reqs.textContent.trim()) {
        const rng = document.createRange();
        rng.selectNodeContents(reqs);
        const line = rng.getClientRects()[0];   // the first line's ink box
        if (line) inkLeft = line.left;
      }
      return {
        comps: comps ? rect(comps) : null,
        reqs: reqs ? rect(reqs) : null,
        compsTab: compsH ? rect(compsH) : null,
        reqsTab: reqsH ? rect(reqsH) : null,
        inkLeft, reqsText: reqs ? reqs.textContent.trim() : '',
      };
    })(),
    railGroups: document.querySelectorAll('#rail .rail-group').length,
    railCards: [...document.querySelectorAll('#rail .rail-card')].map(a => a.textContent.trim()),
    notesCount: document.querySelectorAll('#notes .note').length,
    // -- issue #24: the linked note, its href/target, the deleted note,
    //    and the persisted clicked-state hook, all as RENDERED facts.
    linkNote: (() => {
      const el = [...document.querySelectorAll('#notes .note')]
        .find(n => n.textContent.trim() === 'Community Life');
      if (!el) return null;
      // Issue #35: the resting shadow of the LINKED note and of an UNLINKED
      // neighbour — the two must be identical, so the link carries no ring of
      // its own at rest (no substitution allowed either: any resting
      // affordance shows up here as a non-`none` shadow/border pair).
      const notes_ = [...document.querySelectorAll('#notes .note')];
      const other = notes_.find(
        n => n.textContent.trim() !== 'Community Life' &&
             !n.classList.contains('note--link'));
      return { tag: el.tagName, href: el.getAttribute('href'),
               target: el.getAttribute('target'),
               rel: el.getAttribute('rel'),
               textDecorationLine: getComputedStyle(el).textDecorationLine,
               classes: el.className,
               restShadow: getComputedStyle(el).boxShadow,
               restBorderWidth: getComputedStyle(el).borderWidth,
               otherRestShadow: other ? getComputedStyle(other).boxShadow : null,
               otherRestBorderWidth: other ? getComputedStyle(other).borderWidth : null };
    })(),
    deletedNoteTexts: [...document.querySelectorAll('#notes .note')]
      .map(n => n.textContent.trim())
      .filter(t => t.includes('Earp Street Park')),
    clickedAfterSyntheticClick: (() => {
      const el = [...document.querySelectorAll('#notes .note')]
        .find(n => n.textContent.trim() === 'Community Life');
      if (!el) return false;
      el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      return el.classList.contains('is-clicked');
    })(),
  };
}
"""


class _QuietHandler(http.server.SimpleHTTPRequestHandler):
    """Same file server the suite's docs describe; silently, into the void."""

    def log_message(self, format, *args):  # noqa: A002 - stdlib signature
        pass


def _serve_loopback():
    """Serve ROOT on 127.0.0.1:<ephemeral> in a daemon thread."""
    handler = functools.partial(_QuietHandler, directory=str(ROOT))
    httpd = socketserver.ThreadingTCPServer(("127.0.0.1", 0), handler)
    httpd.daemon_threads = True
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


async def collect_rendered(engine_overrides=None):
    """Boot every page in BROWSER_PAGES and collect the rendered facts.

    engine_overrides maps a filename (e.g. board-engine.js) to replacement
    source: the request is fulfilled locally and the file is NOT touched on
    disk. Empty/None = run the real build. Raises AssertionError on the first
    red assertion; every launch is torn down in a finally.
    """
    from playwright.async_api import async_playwright  # already in the environment

    overrides = engine_overrides or {}
    httpd = _serve_loopback()
    port = httpd.server_address[1]
    results = {}
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            try:
                for page_name, board_id in BROWSER_PAGES:
                    context = await browser.new_context(
                        viewport={"width": VIEWPORT[0], "height": VIEWPORT[1]})
                    await context.add_init_script(BRIDGE_JS)

                    async def route_font(route):
                        await asyncio.sleep(FONT_DELAY_MS / 1000.0)
                        await route.continue_()

                    async def route_override(route):
                        name = pathlib.Path(route.request.url).name
                        if name in overrides:
                            ctype = "text/css" if name.endswith(".css") else "text/javascript"
                            await route.fulfill(status=200, content_type=ctype,
                                                body=overrides[name])
                        else:
                            await route.continue_()

                    if overrides:
                        await context.route("**/*", route_override)
                    await context.route("**/*.woff2", route_font)

                    page = await context.new_page()
                    try:
                        await page.goto(f"http://127.0.0.1:{port}/{page_name}")
                        await page.wait_for_function(
                            'document.fonts.status === "loaded"', timeout=15000)
                        # Two frames: let the fonts.ready re-measure paint before
                        # reading the settled geometry.
                        await page.evaluate(
                            "() => new Promise(r => requestAnimationFrame("
                            "() => requestAnimationFrame(r)))")
                        results[page_name] = await page.evaluate(PAGE_EVAL_JS, board_id)
                    finally:
                        await context.close()
            finally:
                await browser.close()
    finally:
        httpd.shutdown()
        httpd.server_close()
    return results


def _expected_title(board_title):
    """The board-title textContent a page should show, with assembly.js's
    display-only jammed-date split (MM/DD/YY onto its own line) applied."""
    m = re.search(r"\d{2}/\d{2}/\d{2}$", board_title or "")
    if not m:
        return board_title
    return board_title[: m.start()] + "\n" + m.group(0)


def _scale_model(rw, rh):
    """§3 + §11 fit at the wireframe viewport, exactly as board-engine.js."""
    ref_w, ref_h = 900, 1000
    rail_w = 300
    render_scale = min(VIEWPORT[1] / ref_h, (VIEWPORT[0] - rail_w) / ref_w)
    logical_w = max((VIEWPORT[0] - rail_w) / render_scale, ref_w)
    logical_h = max(VIEWPORT[1] / render_scale, ref_h)
    k = min(logical_w / rw, logical_h / rh)
    return render_scale, k


# ---------------------------------------------------------------------------
# Issue #32 — the surface sweep. The strip is an ASPECT condition, so the
# gate sweeps ≥24 viewport pairs spanning both directions (stage wider than
# the canvas aspect -> bare strip on the right; stage taller -> strip at the
# bottom), and at every pair asserts that the SURFACE fills the stage by
# construction: #surface is 100% of the stage, the band-fill's water and the
# lot-fill's water reach the stage's right edge, and the lot-fill reaches
# the stage's bottom edge, within 1px. Also asserts §11's k is unchanged at
# every pair (0.995421 at 2560x1440, exactly 1.0 at 3440x1440 — the
# reference's own arithmetic) and that the figure stays contained.
# ---------------------------------------------------------------------------
SWEEP_PAIRS = [
    # the five named criteria sizes...
    (1280, 720), (1600, 900), (1920, 1080), (2560, 1440), (3440, 1440),
    # ...the owner's reported window and the other aspect-crossing cases the
    # orchestrator's live measurements named...
    (2560, 1300), (2560, 1270), (2560, 1200), (2400, 1200),
    # ...and a spread across BOTH aspect directions: pairs whose stage is
    # wider than the canvas aspect (right strip) and pairs whose stage is
    # taller than it (bottom strip).
    (3840, 2160), (3840, 460), (3200, 1440), (3440, 900), (2560, 2160),
    (1920, 2160), (1920, 900), (1920, 1300), (1600, 2160), (1600, 460),
    (1280, 1300), (1280, 460), (1024, 768), (1024, 1300), (800, 1440),
    (800, 460), (640, 720), (640, 460),
]

SWEEP_EVAL_JS = r"""
() => {
  const rect = el => { const b = el.getBoundingClientRect();
    return {x: b.x, y: b.y, top: b.top, left: b.left, w: b.width, h: b.height,
            right: b.right, bottom: b.bottom}; };
  const stage = document.getElementById('stage');
  const surface = document.getElementById('surface');
  const bandFill = document.getElementById('band-fill');
  const lotFill = document.getElementById('lot-fill');
  const board = document.getElementById('board');
  const band = document.getElementById('band');
  const lot = document.getElementById('lot');
  // -- issue #37: the zones and the card, for the no-collision assertion
  //    (the narrow-band floor: the sections must never run into the card,
  //    at ANY viewport pair, however narrow).
  const zoneC = document.getElementById('zone-components');
  const zoneR = document.getElementById('zone-requirements');
  const bandTitle = document.getElementById('board-title');
  const notes = [...document.querySelectorAll('#notes .note')].map(n => {
    const b = n.getBoundingClientRect(); return {right: b.right, bottom: b.bottom};
  });
  return {
    vw: innerWidth, vh: innerHeight,
    stage: rect(stage), surface: rect(surface),
    bandFill: rect(bandFill), lotFill: rect(lotFill),
    board: rect(board), bandPainted: rect(band), lotPainted: rect(lot),
    dataK: parseFloat(board.getAttribute('data-k')),
    dataRw: parseFloat(board.getAttribute('data-rw')),
    dataRh: parseFloat(board.getAttribute('data-rh')),
    dataPaintScale: parseFloat(board.getAttribute('data-paint-scale')),
    zoneComps: rect(zoneC), zoneReqs: rect(zoneR), bandTitle: rect(bandTitle),
    notes,
  };
}
"""


async def collect_surface_sweep(engine_overrides=None):
    """Boot index.html once and sweep SWEEP_PAIRS, collecting coverage facts.

    One page load; each pair is a viewport resize (the engine's resize
    handler re-fits and re-paints the surface). Returns a list of dicts.
    """
    from playwright.async_api import async_playwright

    overrides = engine_overrides or {}
    httpd = _serve_loopback()
    port = httpd.server_address[1]
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            context = await browser.new_context(viewport={"width": SWEEP_PAIRS[0][0], "height": SWEEP_PAIRS[0][1]})
            try:
                await context.add_init_script(BRIDGE_JS)

                async def route_font(route):
                    await asyncio.sleep(FONT_DELAY_MS / 1000.0)
                    await route.continue_()

                async def route_override(route):
                    name = pathlib.Path(route.request.url).name
                    if name in overrides:
                        ctype = "text/css" if name.endswith(".css") else "text/javascript"
                        await route.fulfill(status=200, content_type=ctype,
                                            body=overrides[name])
                    else:
                        await route.continue_()

                if overrides:
                    await context.route("**/*", route_override)
                await context.route("**/*.woff2", route_font)
                page = await context.new_page()
                await page.goto(f"http://127.0.0.1:{port}/index.html")
                await page.wait_for_function(
                    'document.fonts.status === "loaded"', timeout=15000)
                results = []
                for vw, vh in SWEEP_PAIRS:
                    await page.set_viewport_size({"width": vw, "height": vh})
                    await page.evaluate(
                        "() => new Promise(r => requestAnimationFrame("
                        "() => requestAnimationFrame(r)))")
                    results.append(await page.evaluate(SWEEP_EVAL_JS))
            finally:
                await context.close()
                await browser.close()
    finally:
        httpd.shutdown()
        httpd.server_close()
    return results


def assert_surface_sweep(swept):
    """The sweep assertions themselves. Returns the per-pair strip table."""
    table = []
    for d in swept:
        vw, vh = d["vw"], d["vh"]
        st, su = d["stage"], d["surface"]
        bf, lf = d["bandFill"], d["lotFill"]
        label = f"{vw}x{vh}"
        # sanity: the stage really is (vw−300)×vh
        assert abs(st["w"] - (vw - 300)) < 1 and abs(st["h"] - vh) < 1, \
            f"{label}: stage box {st['w']:.1f}x{st['h']:.1f} != {(vw-300)}x{vh}"
        # THE LAW: the surface is 100% of the stage by construction —
        # (vw−300)×vh device px, the viewport-derived box (mechanism (a)).
        for axis, name in ((st["right"] - su["right"], "right"),
                           (st["bottom"] - su["bottom"], "bottom")):
            assert axis <= 1, (
                f"surface does not fill the stage at {label}: bare strip on "
                f"the {name} is {axis:.1f}px (surface {su['w']:.1f}x"
                f"{su['h']:.1f}, stage {st['w']:.1f}x{st['h']:.1f})")
        assert su["x"] <= st["x"] + 1 and su["y"] <= st["y"] + 1, \
            f"surface does not fill the stage at {label} (anchor off)"
        # the band's water and its rule reach the stage's right edge, and
        # the band-fill covers the band's own painted y-range
        assert bf["right"] >= st["right"] - 1 and bf["top"] <= st["top"] + 1 \
            and bf["bottom"] >= d["bandPainted"]["bottom"] - 1, (
            f"surface: the band-fill's water stops short of the stage's "
            f"right edge at {label}: fill spans x{bf['x']:.1f}..{bf['right']:.1f} "
            f"(stage {st['x']:.1f}..{st['right']:.1f}, strip "
            f"{max(0, st['right'] - bf['right']):.1f}px) and covers y"
            f"{bf['y']:.1f}..{bf['bottom']:.1f} vs the canvas band's painted "
            f"y{d['bandPainted']['y']:.1f}..{d['bandPainted']['bottom']:.1f}")
        # the lot's water reaches the stage's right AND bottom edge, from
        # the canvas lot's own painted top edge
        assert lf["right"] >= st["right"] - 1 and lf["bottom"] >= st["bottom"] - 1 \
            and lf["top"] <= d["lotPainted"]["top"] + 1, (
            f"surface: the lot-fill's water stops short at {label}: fill "
            f"right {lf['right']:.1f} vs stage {st['right']:.1f}, bottom "
            f"{lf['bottom']:.1f} vs stage {st['bottom']:.1f}")
        # the figure stays contained (§11/B64): notes never overflow the stage
        for n in d["notes"]:
            assert n["right"] <= st["right"] + 1 and n["bottom"] <= st["bottom"] + 1, \
                f"figure not contained at {label}: note overflows the stage"
        # -- issue #37: the narrow-band floor — the zones NEVER run into the
        #    card, at any viewport pair however narrow. The ported zone law is
        #    proportional to #band's own (constant 1576.66-logical) width, so
        #    this holds structurally; it is asserted here, not assumed.
        zc, zr, bt = d["zoneComps"], d["zoneReqs"], d["bandTitle"]
        assert zc["right"] <= bt["left"] + 0.5 and zr["left"] >= bt["right"] - 0.5, (
            f"zone law: at {label} the sections collide with the title card "
            f"(components right {zc['right']:.1f} vs card left {bt['left']:.1f}, "
            f"requirements left {zr['left']:.1f} vs card right {bt['right']:.1f}) "
            f"— the narrow-band floor is broken (issue #37)")
        # §11's k is UNCHANGED at every pair: the reference's own arithmetic
        render_scale, k = _scale_model_any(vw, vh, d["dataRw"], d["dataRh"])
        assert abs(d["dataK"] - k) < 1e-6, \
            f"{label}: data-k {d['dataK']} != §11 {k:.6f}"
        table.append((vw, vh, k, st["right"] - bf["right"], st["bottom"] - lf["bottom"]))

    # the two pinned k values, by name (the amendment's arithmetic)
    k2560 = next(k for vw, vh, k, *_ in table if (vw, vh) == (2560, 1440))
    k3440 = next(k for vw, vh, k, *_ in table if (vw, vh) == (3440, 1440))
    assert abs(k2560 - 0.995421) < 5e-5, \
        f"k at 2560x1440 moved to {k2560:.6f} (the unchanged invariant is 0.9954)"
    assert abs(k3440 - 1.0) < 1e-9, \
        f"k at 3440x1440 is {k3440:.6f}, not exactly 1.0 (the reference's min(2333/1576.66, 1000/1000))"
    worst_r = max(table, key=lambda t: t[3])
    worst_b = max(table, key=lambda t: t[4])
    return {"worst_right": worst_r, "worst_bottom": worst_b, "pairs": len(table)}


def _scale_model_any(vw, vh, rw, rh):
    """§3 + §11 fit at an arbitrary viewport, exactly as board-engine.js:
    renderScale = min(vh/1000, (vw−300)/900); LOGICAL_W = (vw−300)/renderScale;
    LOGICAL_H = vh/renderScale; floors 900×1000; k = min(LOGICAL_W/rw, LOGICAL_H/rh)."""
    ref_w, ref_h = 900, 1000
    rail_w = 300
    render_scale = min(vh / ref_h, (vw - rail_w) / ref_w)
    logical_w = max((vw - rail_w) / render_scale, ref_w)
    logical_h = max(vh / render_scale, ref_h)
    k = min(logical_w / rw, logical_h / rh)
    return render_scale, k


def _mutate_revert_surface(src):
    # Issue #32's regression: the surface is put back to the figure's box —
    # the whole paintSurface body is neutered (an early return before any
    # fill is positioned), so the fills stay at 0×0 and the band's water,
    # the rule and the lot's water stop at the canvas's painted edge again.
    # The SWEEP's coverage assertions must go RED, and for THAT reason.
    needle = "  function paintSurface(root, f) {\n    if (f) root.__fit = f;"
    assert src.count(needle) == 1, \
        "board-engine.js drifted: paintSurface is not where the proof expects"
    return src.replace(
        needle,
        "  function paintSurface(root, f) {\n"
        "    return; /* PROVE-GATE: the surface reverted to the figure's box */\n"
        "    if (f) root.__fit = f;")



def assert_rendered_behaviour(rendered):
    """The behavioural assertions themselves — one block per contract."""
    for page_name, board_id in BROWSER_PAGES:
        d = rendered[page_name]
        is_landing = board_id == LANDING_ID

        # -- boot sanity: the board mounted is the board this page owns ------
        data = json.loads(DATA.read_text())
        board = next(b for b in data["boards"] if b["id"] == board_id)
        assert d["titleText"] == _expected_title(board["title"]), \
            f"{page_name}: #board-title {d['titleText']!r} != expected {_expected_title(board['title'])!r}"
        assert d["fontsLoaded"], f"{page_name}: document.fonts never settled"
        # At least one face of the family must have ACTUALLY loaded (status
        # 'loaded', not 'error'/'unloaded') — otherwise the re-measures below
        # measured a fallback face and the gate would be lying. Per-face, not
        # fonts.check('16px …'): an unused weight legitimately unloads (e.g.
        # when a regression reroutes #board's text to another family).
        assert any(s == "loaded" for s in d["montserratFaces"]), \
            (f"{page_name}: Montserrat Alternates did not load "
             f"(faces: {d['montserratFaces']}) — the §4.6/§3.2 re-measures "
             f"would never fire")
        assert d["railGroups"] == 4 and len(d["railCards"]) >= 5, \
            f"{page_name}: rail scaffolding wrong ({d['railGroups']} groups, {len(d['railCards'])} cards)"

        # -- §3/§11 scale law, as COMPUTED by the engine ----------------------
        render_scale, k = _scale_model(d["rw"], d["rh"])
        assert abs(d["dataRenderScale"] - render_scale) < 1e-6, \
            f"{page_name}: data-render-scale {d['dataRenderScale']} != §3 {render_scale:.6f}"
        assert abs(d["dataK"] - k) < 1e-6, \
            f"{page_name}: data-k {d['dataK']} != §11 {k:.6f}"
        assert abs(d["dataPaintScale"] - k * render_scale) < 1e-6, \
            f"{page_name}: data-paint-scale {d['dataPaintScale']} != composite {k * render_scale:.6f}"
        # The transform readback is CSSOM-re-serialized (≈6 significant digits
        # in Blink) — compare at 1e-5, far below any real mixup (applying k
        # alone would be off by 0.44, not 3e-6).
        m_tr = re.fullmatch(r"scale\(([\d.]+)\)", d["transform"] or "")
        assert m_tr and abs(float(m_tr.group(1)) - d["dataPaintScale"]) < 1e-5, \
            f"{page_name}: transform {d['transform']!r} does not apply the composite paint scale"

        # -- §3.2 lot geometry on the SETTLED face ---------------------------
        # The lot height must equal the §3.2 model of the settled layout,
        # computed from the SETTLED NATURAL row heights (rowNatural), not from
        # the pinned rows. A ratchet that measures its own min-height
        # write-back cannot satisfy this by coincidence: its pinned rows read
        # the fallback-face heights, which the settled natural layout moves.
        # If renderLot's fonts.ready re-measure is removed/neutered, the lot
        # stays at its fallback-face measurement and this goes RED.
        assert d["lotStyle"] == f"{d['expectedLot']}px", \
            (f"{page_name}: lot height {d['lotStyle']} != §3.2 settled-natural "
             f"model {d['expectedLot']}px — renderLot's fonts.ready re-measure "
             f"is missing, neutered, or the #6 min-height ratchet re-masks it")
        # The pinned min-heights must equal max(44, settled NATURAL height):
        # the pin is written from a clean read, never from the pin itself.
        for i, (mn, nat) in enumerate(zip(d["rowMin"], d["rowNatural"])):
            assert mn == max(44, nat), (
                f"{page_name}: lot row {i} min-height {mn}px != settled "
                f"natural max(44, {nat})={max(44, nat)}px — the #6 min-height "
                f"ratchet is back (renderLot's re-measure reads its own "
                f"write-back instead of stripping before measuring)")

        # -- §4.6 endpoints drawn where the settled notes actually are --------
        assert len(d["drawn"]) == len(d["expectedLines"]), \
            (f"{page_name}: {len(d['drawn'])} lines drawn, "
             f"{len(d['expectedLines'])} links exist")
        worst = 0.0
        for j, (got, want) in enumerate(zip(d["drawn"], d["expectedLines"])):
            err = max(abs(a - b) for a, b in zip(got, want))
            worst = max(worst, err)
            assert err <= 0.5, (
                f"{page_name}: link {j} endpoint off by {err:.2f} logical px — "
                f"drawn {(got)} vs settled note centre {want} (the §4.6 "
                f"fonts.ready re-measure in renderLinks is missing or stale)")

        # -- mono ruling: computed faces --------------------------------------
        assert not d["monoHits"], \
            f"{page_name}: monospace computed font-family reached the DOM: {d['monoHits'][:4]}"

        # -- §7 chrome: none of it reaches the DOM ----------------------------
        assert not d["chrome"], f"{page_name}: strip-list chrome reached the DOM: {d['chrome'][:4]}"
        assert not d["cssImportant"], \
            (f"{page_name}: stylesheet !important outside the reduced-motion "
             f"guard: {d['cssImportant'][:3]}")

        # -- §12: the contact form mounts on the landing board, both modes ----
        assert d["formPresent"] == is_landing, (
            f"{page_name}: §12 contact form present={d['formPresent']} "
            f"(landing={is_landing}) — mountContactForm ran on the wrong pages")

        # -- issue #24: the linked note, its deletion, and its clicked state --
        # (a) "Community Life" renders as an <a> with target=_blank and the
        #     verified href, carrying the note--link marker class.
        if board_id == LANDING_ID:
            ln_ = d["linkNote"]
            assert ln_ is not None, (
                f"{page_name}: the 'Community Life' note did not render at all")
            assert ln_["tag"] == "A", (
                f"{page_name}: 'Community Life' rendered as <{ln_['tag']}>, "
                "not an <a> — the note link mechanism (issue #24) is missing or "
                "neutered (data 'link' property not honoured by renderNotes)")
            assert ln_["href"] == "https://earp-street-park.netlify.app/", (
                f"{page_name}: 'Community Life' href {ln_['href']!r} != the "
                "expected https://earp-street-park.netlify.app/")
            assert ln_["target"] == "_blank", (
                f"{page_name}: 'Community Life' target={ln_['target']!r} != '_blank' "
                "(the note must open in a new tab)")
            assert ln_["rel"] == "noopener noreferrer", (
                f"{page_name}: 'Community Life' rel={ln_['rel']!r} != 'noopener noreferrer'")
            assert "note--link" in (ln_["classes"] or "").split(), (
                f"{page_name}: 'Community Life' lacks the note--link marker class "
                f"(classes: {ln_['classes']!r})")
            # (d) the clicked state PERSISTS after activation: a synthetic click
            #     must add .is-clicked, and it must still be present afterwards.
            assert d["clickedAfterSyntheticClick"], (
                f"{page_name}: clicking 'Community Life' did not persist the "
                ".is-clicked state — the clicked glow would vanish on pointer-up "
                "and :active alone does not satisfy issue #24")
            # (g) issue #31: the note link carries the repo's own anchor
            #     treatment — the browser default underline is removed, exactly
            #     as .rail-card carries text-decoration: none.
            assert ln_["textDecorationLine"] == "none", (
                f"{page_name}: 'Community Life' computed text-decoration-line "
                f"{ln_['textDecorationLine']!r} != 'none' (issue #31 — the "
                f"browser default underline leaks through; the repo's own "
                f"anchor treatment removes it)")
            # (h) issue #35: NO resting ring. At rest the linked note's
            #     computed box-shadow must be none — identical to an unlinked
            #     note of the same category — and its border must be the plain
            #     .note frame, so no substitute resting affordance (border,
            #     outline via shadow, tint) has crept in. The hover ruling
            #     (.note:hover ring + halo) and the clicked state below stay.
            assert ln_["restShadow"] == "none" and ln_["restShadow"] == ln_["otherRestShadow"], (
                f"{page_name}: 'Community Life' wears a resting box-shadow "
                f"{ln_['restShadow']!r} (unlinked neighbour: "
                f"{ln_['otherRestShadow']!r}) — issue #35: the linked note "
                f"carries no ring of its own at rest, and no substitute "
                f"resting affordance may be added")
            assert ln_["restBorderWidth"] == ln_["otherRestBorderWidth"], (
                f"{page_name}: 'Community Life' resting border-width "
                f"{ln_['restBorderWidth']!r} != unlinked neighbour "
                f"{ln_['otherRestBorderWidth']!r} — a substituted resting "
                f"affordance (border instead of the removed ring) is the same "
                f"issue #35 defect in a new rule")
            # (e) the deleted note is gone from the RENDERED board.
            assert not d["deletedNoteTexts"], (
                f"{page_name}: 'The Earp Street Park project' still renders on the "
                f"board: {d['deletedNoteTexts'][:2]} — the deletion (issue #24) is "
                "incomplete")
            # (f) the deleted note's connector line is gone: drawn == expected at
            #     the new count is already asserted above; this pins the count.
            assert len(d["drawn"]) == 14, (
                f"{page_name}: {len(d['drawn'])} connector lines drawn on the "
                "landing board, expected 14 after the deletion of the Earp Street "
                "Park note and its single link")
        # -- issue #28: the title CARD is the designed compartment ------------
        # (a) its painted outer box measures 455±15 px (source number at the
        #     same stage width; 317 logical × the composite paint scale).
        tc = d["bandTitle"]
        assert abs(tc["w"] - 455) <= 15, (
            f"{page_name}: title card outer width {tc['w']:.1f}px != the "
            f"designed 455±15 painted px (issue #28) — the card is "
            f"shrink-wrapping its text instead of being the compartment")
        # (b) the box:text ratio pins that the BOX grew, not the TEXT: the
        #     source measures 2.92 on the landing board; scaling the text
        #     instead of the box collapses this toward 1.
        if is_landing:
            ratio = tc["w"] / tc["widest"]
            assert ratio >= 2.5, (
                f"{page_name}: title card:text ratio {ratio:.2f} < 2.5 (source "
                f"2.92) — the text was scaled instead of the card box (issue #28)")
        # (c) the card is a CLOSED box that overhangs the band rule (B38): a
        #     bottom border present on all four sides, and the card's bottom
        #     edge 22 logical px below the band's bottom edge (the rule).
        assert tc["bottomBorder"] >= 2 and (
            tc["cardH"] - tc["bandH"]) == 22 and tc["cardBottom"] > tc["bandBottom"], (
            f"{page_name}: title card does not overhang the band rule as a "
            f"closed box (issue #28 / B38): bottom border {tc['bottomBorder']}px, "
            f"card h {tc['cardH']} vs band h {tc['bandH']} (overhang "
            f"{tc['cardH'] - tc['bandH']} logical px, expected 22), "
            f"card bottom {tc['cardBottom']:.1f} vs band bottom {tc['bandBottom']:.1f}")
        # (d) the card stays centred in the centre channel between the zones.
        assert tc["compRight"] is not None and abs(
            ((tc["compRight"] + tc["reqLeft"]) / 2) - (tc["x"] + tc["w"] / 2)) <= 1.2, (
            f"{page_name}: title card not centred in the centre channel "
            f"(issue #16/#28)")
        # -- issue #31: the title compartment matches the reference app —
        #    computed text-align, weight, band furniture, and flex centring
        #    (TheBoards styles.css:476-498, read at da20843 on a 2560x1440
        #    Chromium: center / 600 / 20px 12px 12px / 0px top / 0 0 3px 3px /
        #    flex column centre).
        assert tc["textAlign"] == "center", (
            f"{page_name}: title text computed text-align "
            f"{tc['textAlign']!r} != 'center' (issue #31, the reference "
            f"centres the title text)")
        assert tc["fontWeight"] == "600", (
            f"{page_name}: title computed font-weight "
            f"{tc['fontWeight']!r} != '600' (issue #31, the reference sets 600)")
        assert tc["borderTopWidth"] == "0px", (
            f"{page_name}: title card computed border-top-width "
            f"{tc['borderTopWidth']!r} != '0px' (issue #31, the reference "
            f"opens the card onto the band above)")
        assert tc["borderRadius"] == "0px 0px 3px 3px", (
            f"{page_name}: title card computed border-radius "
            f"{tc['borderRadius']!r} != '0px 0px 3px 3px' (issue #31, the "
            f"reference rounds only the corners that exist)")
        assert tc["padding"] == "20px 12px 12px", (
            f"{page_name}: title card computed padding {tc['padding']!r} != "
            f"'20px 12px 12px' (issue #31, the reference's "
            f"calc(--band-top 14px + 6px) 12px 12px, hardcoded)")
        assert (tc["display"], tc["flexDir"], tc["justify"]) == (
            "flex", "column", "center"), (
            f"{page_name}: title card content not flex-centred "
            f"(display={tc['display']!r}, flexDir={tc['flexDir']!r}, "
            f"justify={tc['justify']!r}) — issue #31, the reference centres "
            f"the content in a column flex")
        # -- issue #37: the band's ZONE LAW (the reference's own geometry) ---
        #    Ported from TheBoards styles.css:462-465 + tokens 319-325: each
        #    section's edge sits exactly --card-gap (8 logical px) off the
        #    card's own edge, the section runs to the gutter on its outer
        #    side, and the requirements content is left-anchored at its
        #    section's edge — not floating ~110 painted px toward the middle.
        #    (Placed AFTER the card's own box assertions above: the zones are
        #    derived FROM the card, so a card-box regression must be reported
        #    as the card-box failure it is, not as a zone-gap failure.)
        zl = d["zoneLaw"]
        assert zl["comps"] and zl["reqs"], f"{page_name}: band zones missing"
        gap_expected = 8 * d["dataPaintScale"]      # painted = logical × paint scale
        card_left, card_right = tc["x"], tc["x"] + tc["w"]
        gap_components = card_left - zl["comps"]["right"]
        gap_requirements = zl["reqs"]["left"] - card_right
        assert abs(gap_components - gap_expected) <= 1.0, (
            f"{page_name}: the components section starts "
            f"{gap_components:.1f} painted px off the card's left edge, expected "
            f"the card-gap {gap_expected:.1f} painted px (= 8 logical × paint "
            f"scale, issue #37 / TheBoards styles.css:462-463)")
        assert abs(gap_requirements - gap_expected) <= 1.0, (
            f"{page_name}: the requirements section starts "
            f"{gap_requirements:.1f} painted px off the card's right edge, expected "
            f"the card-gap {gap_expected:.1f} painted px (= 8 logical × paint "
            f"scale, issue #37 / TheBoards styles.css:464-465)")
        # (b) the requirements content's INK starts at its zone's left edge:
        #     left-anchored, not centred. A re-centred zone leaves its first
        #     line's ink box indented from the edge and goes RED here. On the
        #     LANDING pages (the card's criterion); zones elsewhere may
        #     legitimately be empty (e.g. todays-to-do has no requirements).
        if is_landing:
            assert zl["reqsText"], f"{page_name}: the requirements zone rendered empty"
            assert zl["inkLeft"] is not None and abs(
                zl["inkLeft"] - zl["reqs"]["left"]) <= 1.0, (
                f"{page_name}: the requirements content's ink starts at "
                f"{zl['inkLeft']:.1f} but its zone's left edge is "
                f"{zl['reqs']['left']:.1f} — the content is not left-anchored to "
                f"its section's edge (issue #37)")
        # (c) each tab stays centred over its OWN zone (the #17 ruling).
        for label, tab, zone in (("components", zl["compsTab"], zl["comps"]),
                                 ("requirements", zl["reqsTab"], zl["reqs"])):
            tab_c = (tab["left"] + tab["right"]) / 2
            zone_c = (zone["left"] + zone["right"]) / 2
            assert abs(tab_c - zone_c) <= 1.0, (
                f"{page_name}: the {label} tab's centre {tab_c:.1f} is not its "
                f"own zone's centre {zone_c:.1f} (issue #37, the #17 ruling)")
        print(f"behaviour {page_name.ljust(38)} lot={d['lotHeight']:4} "
              f"k={d['dataK']:.4f} lines={len(d['drawn']):2} "
              f"mono=0 chrome=0 endpoint-drift={worst:.2f}px")


# --prove-gates: the three regressions the gate must catch, each fulfilled
# locally (no file on disk is modified), each expected to go RED.
def _mutate_neuter_lot_remeasure(src):
    # renderLot's guard is the SECOND occurrence of the exact guard text.
    first = src.find(REMEASURE_GUARD)
    second = src.find(REMEASURE_GUARD, first + 1)
    assert first != -1 and second != -1 and src.count(REMEASURE_GUARD) == 2, \
        "board-engine.js drifted: the two fonts.ready guards are not where the proof expects"
    return src[:second] + "    /* PROVE-GATE: renderLot re-measure removed */" + src[second + len(REMEASURE_GUARD):]


def _mutate_reinstate_lot_ratchet(src):
    # The issue #6 defect, faithfully reinstated on the FIXED source: the
    # document.fonts guard stays INTACT, but measureAndDraw stops stripping
    # the previous pass's write-back — so the settled re-measure reads its own
    # pinned rows and can only ever move the measurement up. This is the
    # behavioural regression the rendered gate must catch now that the gate
    # no longer pre-clears the pins.
    strip = "        row.style.minHeight = '';\n"
    assert src.count(strip) == 1, \
        "board-engine.js drifted: the strip-before-measure line is not unique"
    return src.replace(strip, "")


def _mutate_mono_face(src):
    # A monospace face back on a rendered surface (the 2026-09-27 regression).
    return src + "\n/* PROVE-GATE regression */ #board, #board * { font-family: 'Courier New', monospace; }\n"


def _mutate_assembly_strip_token(src):
    # The criterion's exact scenario: a banned token inside assembly.js — a
    # file the pre-finding-5 guards never read — reaching the RENDERED surface.
    return src + "\n/* PROVE-GATE regression */ document.body.style.setProperty('margin', '0', 'important');\n"


def _mutate_neuter_note_anchor(src):
    # Issue #24's regression shape: the data carries the `link` property but
    # renderNotes ignores it and renders every note as a div. The #24 rendered
    # assertion (tag == 'A') must go RED, and for THAT reason.
    anchor = "var el = document.createElement(n.link ? 'a' : 'div');"
    assert src.count(anchor) == 1, \
        "board-engine.js drifted: the note-anchor createElement is not where the proof expects"
    return src.replace(anchor, "var el = document.createElement('div');")


def _mutate_shrink_title_card(src):
    # Issue #28 regression A: the card reverts to shrink-wrapping its two text
    # lines instead of being the designed 317-logical-px compartment. The
    # rendered width assertion must go RED, and for THAT reason.
    needle = "  width: 317px;"
    assert src.count(needle) == 1, "issue #28 width rule drifted — mutate nothing"
    return src.replace(needle, "  min-width: 120px; max-width: 40%;")


def _mutate_open_title_card(src):
    # Issue #28 regression B: the bottom border is removed again — the card
    # stops being a closed box overhanging the rule. The rendered overhang
    # assertion (which requires the bottom border) must go RED, and for THAT
    # reason. (Updated for issue #31: the card now opens onto the band above —
    # border-top: 0, bottom corners only — so the mutated source keeps that
    # shape and strips the BOTTOM edge instead.)
    anchor = ("  border: 2px solid var(--frame);\n"
              "  border-top: 0;")
    assert src.count(anchor) == 1, "issue #31 border block drifted — mutate nothing"
    return src.replace(
        anchor,
        "  border: 2px solid var(--frame); border-bottom: none;\n"
        "  border-top: 0;")


def _mutate_uncentre_title_text(src):
    # Issue #31 regression A: the title text reverts to the browser's default
    # start alignment. The computed text-align assertion must go RED, and for
    # THAT reason.
    needle = "  text-align: center;              /* per reference (was start via default) */"
    assert src.count(needle) == 1, "issue #31 text-align rule drifted — mutate nothing"
    return src.replace(needle, "  text-align: start;")


def _mutate_rebold_title_text(src):
    # Issue #31 regression B: the title reverts to the pre-reference 800
    # weight. The computed font-weight assertion must go RED, and for THAT
    # reason.
    needle = "font-size: 15px; font-weight: 600; line-height: 1.3;  /* weight 600 per reference (was 800) */"
    assert src.count(needle) == 1, "issue #31 font-weight rule drifted — mutate nothing"
    return src.replace(needle, "font-size: 15px; font-weight: 800; line-height: 1.3;")


def _mutate_restore_top_border(src):
    # Issue #31 regression C: the pre-reference closed box comes back — a top
    # border re-separating the card from the band. The computed
    # border-top-width assertion must go RED, and for THAT reason.
    needle = "  border-top: 0;                   /* the card does not separate from the band above */"
    assert src.count(needle) == 1, "issue #31 border-top rule drifted — mutate nothing"
    return src.replace(needle, "  border-top: 2px solid var(--frame);")


def _mutate_underline_note(src):
    # Issue #31 regression D: the note link's decoration treatment is
    # forgotten and the browser default underline leaks back. The computed
    # text-decoration-line assertion must go RED, and for THAT reason.
    needle = ("  text-decoration: none;           /* the browser default underline "
              "goes — same treatment .rail-card carries (engine.css:102) */")
    assert src.count(needle) == 1, "issue #31 note-decoration rule drifted — mutate nothing"
    return src.replace(needle, "")


def _mutate_restore_note_ring(src):
    # Issue #35's exact defect, faithfully reinstated: the resting 1px --frame
    # ring back on .note--link. The rendered rest assertion (computed
    # box-shadow must be none, identical to an unlinked note) must go RED, and
    # for THAT reason — not via the hover/clicked states, which stay intact.
    needle = ".note--link {\n  cursor: pointer;\n"
    assert src.count(needle) == 1, \
        "issue #35 .note--link rule drifted — mutate nothing"
    return src.replace(needle, ".note--link {\n  cursor: pointer;\n  box-shadow: 0 0 0 1px var(--frame);   /* PROVE-GATE: the #35 resting ring, reinstated */\n")


def _mutate_drop_clicked_state(src):
    # Issue #24's persistence regression: the click handler that adds the
    # persisted .is-clicked marker is removed. The synthetic-click assertion
    # must go RED, and for THAT reason.
    marker = "el.classList.add('is-clicked');"
    assert src.count(marker) == 1, \
        "board-engine.js drifted: the is-clicked marker write is not where the proof expects"
    return src.replace(marker, "/* PROVE-GATE: clicked-state persistence removed */")


def _mutate_revert_zone_law(src):
    # Issue #37's exact regression, faithfully reinstated: the ported zone law
    # comes off and the old B76-per-section width rule returns — the sections
    # float ~76.5 logical px off the card again. The rendered card-gap
    # assertions must go RED, and for THAT reason.
    needle = ("#zone-components   { left: var(--gutter);\n"
              "                     right: calc(100% - var(--card-l) + var(--card-gap)); }\n"
              "#zone-requirements { left: calc(var(--card-l) + var(--card-w) + var(--card-gap));\n"
              "                     right: var(--gutter); text-align: left; }")
    assert src.count(needle) == 1, \
        "issue #37 zone rules drifted — mutate nothing"
    return src.replace(needle,
        "#zone-components { left: 16px; width: max(96px, calc(50% - 251px)); }\n"
        "#zone-requirements { right: 16px; width: max(96px, calc(50% - 251px)); text-align: left; }")


def _mutate_recentre_requirements(src):
    # Issue #37's forbidden fix: the requirements content re-centred inside its
    # zone. The rendered ink-anchoring assertion (ink at the zone's left edge)
    # must go RED, and for THAT reason — not via the gap assertions.
    needle = ("#zone-requirements { left: calc(var(--card-l) + var(--card-w) + var(--card-gap));\n"
              "                     right: var(--gutter); text-align: left; }")
    assert src.count(needle) == 1, \
        "issue #37 requirements rule drifted — mutate nothing"
    return src.replace("text-align: left; }", "text-align: center; }")


# ---------------------------------------------------------------------------
# Issue #21 — the README gate. README.md is IN CONTRACT.
#
# The README's per-board table once contradicted its own Total row for a whole
# issue cycle and the suite shipped green, because nothing here read README.md.
# The gate now asserts it against assets/content-of-boards.json:
#   - one row PER BOARD (not per page — see PAGE_TO_BOARD for the landing's
#     shared id), every non-title cell checked, plus the Total row;
#   - a prose sweep over the WHOLE README: every number matching a known count
#     shape must equal the expected value — not a sample of sentences.
#
# docs/issues/0001-board-engine.md is explicitly OUT OF CONTRACT (owner
# ruling): it is the dated acceptance record of a completed issue, and its
# quoted run output carries today's counts — asserting it would falsify
# history the moment a count legitimately moves. Its numbers are neither read
# nor asserted here.
# ---------------------------------------------------------------------------
README_PROSE_SHAPES = [
    # (regex, index into the totals quadruple). Ordered shapes only — a sweep
    # pinned to today's literal sentences would miss the next drifted sentence,
    # which is the entire point of this gate.
    (re.compile(r"(\d+)\s+notes\b"), 0),
    (re.compile(r"(\d+)\s+(?:links|connectors)\b"), 1),
    (re.compile(r"(\d+)\s+(?:parking-lot entries|lot entries)\b"), 2),
    (re.compile(r"(\d+)\s+(?:orphan links|orphans)\b"), 3),
]
README_PROSE_QUADRUPLE = re.compile(
    r"expects\s+(\d+)\s*/\s*(\d+)\s*/\s*(\d+)\s*/\s*(\d+)")
# ponytail: the (\d+)\s+notes shape also matches ruling-id prose ("Pre-B32
# notes carry no legacy branch" — UIUX.md:1403). Harmless while the sweep is
# README-only; do NOT widen the sweep to UIUX.md, and do NOT narrow the shape
# into something too specific to catch drift.


def assert_readme_counts(readme_text, per_board, page_to_board, totals):
    """Assert README.md's per-board table and prose counts against the JSON.

    Pure function: takes the README TEXT (read fresh from disk by the caller —
    no cached or embedded copy) and the per-board truth keyed by board id.
    Raises AssertionError naming the exact drift.

    per_board: {board_id: (notes, links, lot)}
    totals:    (total_notes, total_links, total_lot, orphan_links)
    """
    rows = []          # (page, board_title, [notes, links, lot])
    total_row = None   # [total_notes, total_links, total_lot]
    for line in readme_text.splitlines():
        if not line.startswith("|"):
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if cells[0] == "Page":                       # header row
            continue
        if all(set(c) <= set("-: ") for c in cells):  # separator row
            continue
        nums = [int(c.strip("*")) for c in cells if re.fullmatch(r"\*{0,2}\d+\*{0,2}", c)]
        if cells[1] == "**Total**":
            total_row = nums
            continue
        m = re.match(r"`([^`]+)`", cells[0])
        rows.append((m.group(1) if m else None, cells[1], nums))

    # Board coverage first: one row per board, no more, no fewer.
    total_notes, total_links, total_lot, orphans = totals
    assert len(rows) == len(per_board), (
        f"README table rows ({len(rows)}) != boards ({len(per_board)}) — "
        "a row was deleted, added, or the table drifted from the export")
    seen_boards = set()
    for page, _title, nums in rows:
        assert page in page_to_board, (
            f"README table page {page!r} maps to no known board — the row's "
            "page drifted or names a page that is not a board's page")
        board_id = page_to_board[page]
        assert board_id in per_board, (
            f"README table page {page!r} resolves to board {board_id!r}, "
            "which is not in the export")
        assert board_id not in seen_boards, (
            f"README table has two rows for board {board_id!r} "
            "(pages are not boards; the landing board is represented once)")
        seen_boards.add(board_id)
        expected = per_board[board_id]
        assert nums == list(expected), (
            f"README table cell mismatch for board {board_id!r} "
            f"(row {page!r}): {nums} != {list(expected)} (notes/links/lot)")
    missing = set(per_board) - seen_boards
    assert not missing, (
        f"README table does not list board(s) {sorted(missing)} — "
        "every board in the export must have exactly one row")

    assert total_row is not None, "README table has no Total row"
    assert total_row == [total_notes, total_links, total_lot], (
        f"README Total row {total_row} != computed totals "
        f"[{total_notes}, {total_links}, {total_lot}] — the table contradicts "
        "its own export (the exact #18/#21 defect shape)")

    # Prose sweep: EVERY captured number anywhere in the README must equal the
    # expected value — not a sample. The shapes are generic so the next
    # drifted sentence is caught wherever it lands.
    for pattern, idx in README_PROSE_SHAPES:
        for m in pattern.finditer(readme_text):
            got = int(m.group(1))
            assert got == totals[idx], (
                f"README prose count drift: '{m.group(0)}' says {got}, "
                f"expected {totals[idx]}")
    for m in README_PROSE_QUADRUPLE.finditer(readme_text):
        got = tuple(int(g) for g in m.groups())
        assert got == (total_notes, total_links, total_lot, orphans), (
            f"README prose quadruple drift: '{m.group(0)}' says "
            f"{got[0]}/{got[1]}/{got[2]}/{got[3]}, expected "
            f"{total_notes}/{total_links}/{total_lot}/{orphans}")


def _readme_truth():
    """Per-board (notes, links, lot) keyed by board id, plus the totals
    quadruple — derived from the JSON, never a second copy of the numbers
    (ruling: the README gate takes its expectations from main()'s computed
    totals; this helper is the same computation for --prove-gates, which runs
    before main's data loop)."""
    data = json.loads(DATA.read_text())
    per_board = {}
    tn = tl = tlo = o = 0
    for b in data["boards"]:
        notes, links, lot = b.get("notes", []), b.get("links", []), b.get("parkingLot", [])
        ids = {n["id"] for n in notes} | {e["id"] for e in lot}
        bo = sum(1 for l in links if l["a"] not in ids or l["b"] not in ids)
        per_board[b["id"]] = (len(notes), len(links), len(lot))
        tn += len(notes); tl += len(links); tlo += len(lot); o += bo
    return per_board, (tn, tl, tlo, o)


def prove_gates():
    variants = [
        ("renderLot's document.fonts re-measure removed from renderLot",
         {"board-engine.js": _mutate_neuter_lot_remeasure},
         r"renderLot's fonts\.ready re-measure"),
        ("monospace font-family reintroduced on a rendered surface",
         {"engine.css": _mutate_mono_face},
         r"monospace computed font-family"),
        ("strip-list token (!important) introduced in assembly.js",
         {"assembly.js": _mutate_assembly_strip_token},
         r"inline !important"),
        ("the #6 min-height ratchet reinstated in renderLot's measurement",
         {"board-engine.js": _mutate_reinstate_lot_ratchet},
         r"min-height ratchet"),
        ("the Community Life note anchor neutered (rendered as a div)",
         {"board-engine.js": _mutate_neuter_note_anchor},
         r"not an <a>"),
        ("the persisted clicked state removed from the note's click handler",
         {"board-engine.js": _mutate_drop_clicked_state},
         r"\.is-clicked"),
        ("issue #28 regression A: the title card reverts to shrink-wrapping "
         "its text (min-width/max-width, no 317px width)",
         {"engine.css": _mutate_shrink_title_card},
         r"title card outer width"),
        ("issue #28 regression B: the card's bottom border removed — the box "
         "no longer closes over the rule",
         {"engine.css": _mutate_open_title_card},
         r"overhang the band rule"),
        ("issue #31 regression A: the title text un-centred (back to start)",
         {"engine.css": _mutate_uncentre_title_text},
         r"computed text-align"),
        ("issue #31 regression B: the title re-bolded to 800",
         {"engine.css": _mutate_rebold_title_text},
         r"computed font-weight"),
        ("issue #31 regression C: the title card's top border restored",
         {"engine.css": _mutate_restore_top_border},
         r"computed border-top-width"),
        ("issue #31 regression D: the note link underlined again",
         {"engine.css": _mutate_underline_note},
         r"text-decoration-line"),
        ("issue #35 regression: the resting 1px --frame ring reinstated on "
         "the linked note",
         {"engine.css": _mutate_restore_note_ring},
         r"resting box-shadow"),
        ("issue #37 regression: the zone law reverted — the sections float "
         "~76.5 logical px off the card again (the old B76 width rule)",
         {"engine.css": _mutate_revert_zone_law},
         r"off the card's (left|right) edge"),
        ("issue #37 regression: the requirements content re-centred inside "
         "its zone (the forbidden 'fix')",
         {"engine.css": _mutate_recentre_requirements},
         r"not left-anchored"),
    ]
    for label, mutations, pattern in variants:
        # apply each mutation to the CURRENT file source: the override map
        # carries the mutated text, and nothing on disk changes.
        overrides = {fname: fn((ROOT / fname).read_text())
                     for fname, fn in mutations.items()}
        try:
            rendered = asyncio.run(collect_rendered(overrides))
            assert_rendered_behaviour(rendered)
        except AssertionError as e:
            if re.search(pattern, str(e)):
                print(f"GATE PROOF OK (RED as required): {label}\n    -> {e}")
            else:
                raise AssertionError(
                    f"gate proof for {label!r} failed with an UNRELATED error "
                    f"(the gate is broken, not the build): {e}") from e
        else:
            raise AssertionError(
                f"gate proof FAILED: {label!r} went GREEN — "
                f"the rendered gate cannot catch this regression")

    # --- issue #32: the surface variant rides the SWEEP, not the rendered
    # gate — the strip is an aspect condition, so the regression proves RED
    # across the viewport pairs (worst on the widest pair, not at 2560x1440).
    surface_variants = [
        ("issue #32: the surface reverted to the figure's box (paintSurface "
         "neutered — the band's water, the rule and the lot's water stop at "
         "the canvas's painted edge)",
         {"board-engine.js": _mutate_revert_surface},
         r"surface"),
    ]
    for label, mutations, pattern in surface_variants:
        overrides = {fname: fn((ROOT / fname).read_text())
                     for fname, fn in mutations.items()}
        try:
            swept = asyncio.run(collect_surface_sweep(overrides))
            assert_surface_sweep(swept)
        except AssertionError as e:
            if re.search(pattern, str(e)):
                print(f"GATE PROOF OK (RED as required): {label}\n    -> {e}")
            else:
                raise AssertionError(
                    f"gate proof for {label!r} failed with an UNRELATED error "
                    f"(the gate is broken, not the build): {e}") from e
        else:
            raise AssertionError(
                f"gate proof FAILED: {label!r} went GREEN — "
                f"the surface sweep cannot catch this regression")

    # --- in-process README variants (issue #21) ---
    # README cannot ride the engine-override path above: --prove-gates serves
    # mutated ENGINE files over the loopback http server, and README.md is
    # read from disk and asserted in process. Its four regressions are
    # therefore injected straight into the README text, and each variant is
    # expected to go RED for the RIGHT reason (same UNRELATED-error guard).
    readme = (ROOT / "README.md").read_text()
    per_board, totals = _readme_truth()
    readme_variants = [
        ("a stale non-total README table cell (the 22-vs-23 shape)",
         lambda r: r.replace("| 22 | 14 | 1 |", "| 23 | 14 | 1 |"),
         r"README table cell mismatch"),
        ("a deleted README table row",
         lambda r: "\n".join(l for l in r.splitlines()
                             if "`todays-to-do.html`" not in l) + "\n",
         r"README table rows"),
        ("a stale prose count in README.md",
         lambda r: r.replace("72 notes", "73 notes"),
         r"README prose"),
        ("a README row whose page maps to no board",
         lambda r: r.replace("`todays-to-do.html`", "`no-such-board.html`"),
         r"maps to no known board"),
    ]
    for label, mutate, pattern in readme_variants:
        mutated = mutate(readme)
        assert mutated != readme, \
            f"gate proof for {label!r} mutated nothing — the README drifted"
        try:
            assert_readme_counts(mutated, per_board, PAGE_TO_BOARD, totals)
        except AssertionError as e:
            if re.search(pattern, str(e)):
                print(f"GATE PROOF OK (RED as required): {label}\n    -> {e}")
            else:
                raise AssertionError(
                    f"gate proof for {label!r} failed with an UNRELATED error "
                    f"(the gate is broken, not the build): {e}") from e
        else:
            raise AssertionError(
                f"gate proof FAILED: {label!r} went GREEN — "
                f"the README check cannot catch this regression")


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def lum(hexs):
    r, g, b = (int(hexs[i:i+2], 16) / 255 for i in (1, 3, 5))
    f = lambda c: c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = f(r), f(g), f(b)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--prove-gates", action="store_true",
                    help="run the rendered gate against four deliberate "
                         "regressions and prove each goes RED, then exit.")
    args = ap.parse_args()
    if args.prove_gates:
        prove_gates()
        return

    # --- source integrity ---
    actual = sha256(DATA)
    assert actual == EXPECTED_SHA256, f"data file changed: {actual}"
    css = (ROOT / "engine.css").read_text()
    js = (ROOT / "board-engine.js").read_text()
    html = (ROOT / "index.html").read_text()

    # --- ladder hexes byte-identical ---
    for cat, rungs in LADDERS.items():
        block = re.search(r'#board\[data-cat="%s"\]\s*\{(.*?)\}' % cat, css, re.S)
        assert block, f"ladder scope missing for {cat}"
        for rung, hexv in rungs.items():
            assert f"--{rung}: {hexv}" in block.group(1), \
                f"{cat}.{rung} not byte-identical ({hexv})"
    for name, hexv in FIXED_TOKENS.items():
        assert re.search(rf"--{name}:\s*{hexv}\b", css), f"fixed token --{name} wrong"

    # --- no monospace anywhere (owner ruling 2026-09-27) ---
    # finding 5: the scan now covers every file that can produce the surface —
    # assembly.js, assembly.css and all six pages, not just the engine trio.
    # HTML comments are design prose that may legitimately name the ruling
    # ("the HANDOFF's monospace demand") — stripped before matching, only for
    # the pages; a token in live CSS/JS is always a violation.
    def _page_src(name):
        text = (ROOT / name).read_text()
        return re.sub(r"<!--.*?-->", "", text, flags=re.S)

    scanned = [("engine.css", css), ("board-engine.js", js), ("index.html", html)]
    scanned += [(n, _page_src(n)) for n in
                ["assembly.js", "assembly.css", "todays-to-do.html",
                 "portfolio-project-ideas.html", "how-does-ai-inference-math-work.html",
                 "public-space-mini-grant.html", "the-life-of-robert-gregory.html"]]
    for tok in MONO_TOKENS:
        for src_name, src in scanned:
            assert tok.lower() not in src.lower(), f"monospace token '{tok}' in {src_name}"

    # --- §7 strip-list absent from built sources ---
    # Word-boundary, case-sensitive: `!important` in CSS must not read as "Import".
    # finding 5: same widened file set as the mono scan above.
    # §7 superseding ruling (2026-09-29): the four rail-chrome tokens are
    # exempt in assembly.js only (the rail chrome file); everywhere else the
    # strip list still stands, token for token.
    for tok in STRIP_TOKENS:
        pat = re.compile(r"\b%s\b" % re.escape(tok))
        for src_name, src in scanned:
            if tok in RAIL_CHROME_TOKENS and src_name in RAIL_CHROME_FILES:
                continue
            assert not pat.search(src), f"strip-list chrome '{tok}' in {src_name}"

    # --- the data contract: parse EVERY board ---
    data = json.loads(DATA.read_text())
    boards = data["boards"]
    total_notes = total_links = total_lot = orphans = 0
    per_board = []
    per_board_by_id = {}
    for b in boards:
        notes = b.get("notes", [])
        links = b.get("links", [])
        lot = b.get("parkingLot", [])
        ids = {n["id"] for n in notes} | {e["id"] for e in lot}
        board_orphans = sum(1 for l in links if l["a"] not in ids or l["b"] not in ids)
        total_notes += len(notes)
        total_links += len(links)
        total_lot += len(lot)
        orphans += board_orphans
        per_board.append((b["title"][:32], len(notes), len(links), len(lot), board_orphans))
        per_board_by_id[b["id"]] = (len(notes), len(links), len(lot))

    print("board".ljust(34), "notes links lot orphan")
    for t, n, lk, lo, o in per_board:
        print(t.ljust(34), f"{n:5} {lk:5} {lo:3} {o:6}")
    print("-" * 60)
    print(f"TOTALS                             {total_notes:5} {total_links:5} {total_lot:3} {orphans:6}")

    assert total_notes == 72, f"total notes {total_notes} != 72"
    assert total_links == 43, f"total links {total_links} != 43"
    assert total_lot == 4, f"total lot entries {total_lot} != 4"
    assert orphans == 0, f"orphan links {orphans} != 0"

    # --- issue #21: README.md is in contract (table + prose) ---
    # One mechanism, one truth: the expected values are the JSON totals this
    # loop just computed and asserted against the literals above — no second
    # copy of the numbers. README.md itself is read fresh at runtime.
    assert_readme_counts((ROOT / "README.md").read_text(), per_board_by_id,
                         PAGE_TO_BOARD, (total_notes, total_links, total_lot, orphans))
    print(f"README gate: per-board table ({len(per_board_by_id)} rows, every "
          f"cell) + prose sweep asserted against the export")

    # --- §3 scale law, exercised at the wireframes' 2560x1440 ---
    rw, rh = 1576.6634522661525, 1000.0  # the export's board canvas, every note carries it
    vw, vh = 2560, 1440
    render_scale = min(vh / 1000, (vw - 300) / 900)
    logical_w = (vw - 300) / render_scale
    logical_h = vh / render_scale
    k = min(logical_w / rw, logical_h / rh)
    print(f"scale law @2560x1440: renderScale={render_scale:.4f} "
          f"LOGICAL_W={logical_w:.1f} LOGICAL_H={logical_h:.1f} k={k:.4f}")
    assert abs(render_scale - 1.44) < 1e-9, "renderScale != 1.44 at 2560x1440"
    assert abs(logical_h - 1000) < 1e-9, "LOGICAL_H != 1000 at 2560x1440"
    assert 0.9954 < k < 0.9956, f"k {k} not ≈0.9955 at 2560x1440"

    # --- FIX 1 (§3 + §11): the PAINT scale is the composite k × renderScale.
    # The engine must apply both factors in the one uniform transform and report
    # the composite separately (data-render-scale) while data-k keeps §11's k.
    composite = k * render_scale
    painted_w, painted_h = rw * composite, rh * composite
    print(f"composite paint scale @2560x1440: k*renderScale={composite:.6f} "
          f"painted={painted_w:.1f}x{painted_h:.1f} (stage 2260x1440)")
    assert abs(painted_w - (vw - 300)) < 1.0, \
        f"painted width {painted_w:.1f} does not fill the 2260px stage"
    assert re.search(r"k\s*\*\s*f\.renderScale", js), \
        "fit() does not multiply the composite k * renderScale"
    assert "data-paint-scale" in js, "composite paint scale not exposed as data-paint-scale"
    assert "data-render-scale" in js, "§3's renderScale factor not exposed as data-render-scale"
    assert "'data-k', f.k" in js, "data-k must keep reporting §11's k itself"

    # --- FIX 2 (§4 + §2.5 + §12): the note's 2px frame is rebound DARK ink on
    # the note surface — ≥3:1 non-text contrast on every ladder's --note fill,
    # and on the fixed --highlight fill (highlighted notes keep the same frame).
    # The engine.css declaration must bind --ink on .note, not rely on inheritance.
    assert re.search(r"\.note\s*\{[^}]*--ink:\s*var\(--ink-dark\)", css, re.S), \
        ".note does not rebind --ink to --ink-dark (frame falls on the wrong pole)"
    for cat, rungs in LADDERS.items():
        for surface, hexv in (("note", rungs["note"]), ("highlight", FIXED_TOKENS["highlight"])):
            ratio = (max(lum(FIXED_TOKENS["ink-dark"]), lum(hexv)) + 0.05) / \
                    (min(lum(FIXED_TOKENS["ink-dark"]), lum(hexv)) + 0.05)
            assert ratio >= 3.0, \
                f"note frame {cat} on --{surface}: {ratio:.2f}:1 below the 3:1 floor"
            if surface == "note":
                print(f"note frame {cat.ljust(9)} --ink-dark on --note: {ratio:.2f}:1 (≥3:1)")

    # --- FIX 3 (§4.3): strike coverage ≥90% of the strike's own paint area
    # (the ::after canvas = the note's padding box). Modelled geometrically from
    # the DECLARED gradients in engine.css (parsed, not hardcoded) — a pixel is
    # covered when any stroke family darkens it.
    # In-browser decoded-pixel diff of the dataset's single complete note
    # (Portfolio Project Ideas, 2026-09-28): 94.54% of the interior (padding-box)
    # pixels materially darkened — matches this model within 0.7pt. The note-BOX
    # figure (83.72%) is lower ONLY because the 2px frame ring is outside the
    # ::after's containing block and its ink equals the strike's ink (both
    # #031019), so the ring can never register in a before/after diff — a
    # measurement artifact of the denominator, not a coverage property. QA's
    # protocol should measure the overlay's paint area (suppress ::after, diff,
    # exclude the ring) or read the interior fraction; the box-level number on a
    # small note cannot mathematically reach 90% for ANY same-ink strike.
    strike_block = re.search(r"\.note--complete::after\s*\{(.*?)\}", css, re.S)
    assert strike_block, ".note--complete::after missing"
    families = re.findall(
        r"repeating-linear-gradient\((\d+(?:\.\d+)?)deg,\s*"
        r"rgb\(3 16 25 / 0\.62\) 0 (\d+(?:\.\d+)?)px,\s*transparent"
        r"\s+\d+(?:\.\d+)?px\s+(\d+(?:\.\d+)?)px\)",
        strike_block.group(1))
    assert len(families) >= 3, f"expected ≥3 stroke families, parsed {len(families)}"
    TILE_W, TILE_H, STEP = 63.0, 45.0, 0.25  # tile >> all periods; fine sampling
    covered = total = 0
    for gx in range(int(TILE_W / STEP)):
        for gy in range(int(TILE_H / STEP)):
            x, y = gx * STEP, gy * STEP
            hit = False
            for deg, stroke, period in families:
                t = math.radians(float(deg))
                # CSS gradient line: 0deg points up (screen y grows downward);
                # project the pixel onto the gradient direction, mod the period.
                proj = (x * math.sin(t) - y * math.cos(t)) % float(period)
                if proj < float(stroke):
                    hit = True
                    break
            covered += hit
            total += 1
    coverage = covered / total
    print(f"strike coverage (geometric model of {len(families)} families): "
          f"{coverage * 100:.1f}% (floor 90%)")
    assert coverage >= 0.90, f"strike coverage {coverage * 100:.1f}% below the 90% floor"

    # --- hover glow ring: measured, not asserted (§12). The 1px ring is drawn in
    # --frame on the --deep ground; non-text contrast must clear 3:1 per ladder.
    # (lum is defined above, in the FIX 2 block.)
    for cat, rungs in LADDERS.items():
        ratio = (max(lum(rungs["frame"]), lum(rungs["deep"])) + 0.05) / \
                (min(lum(rungs["frame"]), lum(rungs["deep"])) + 0.05)
        assert ratio >= 3.0, f"glow ring {cat}: {ratio:.2f}:1 below 3:1"
        print(f"glow ring {cat.ljust(9)} --frame on --deep: {ratio:.2f}:1 (≥3:1)")

    # --- issue #24: the --note-click token — a fixed token, a green, measured.
    # The clicked glow must be bound to a TOKEN in engine.css's fixed-token
    # block (a raw hex in a rule is a FAIL) and must clear the same ≥3:1
    # non-text floor against --deep on every ladder that the hover ring meets.
    m_tok = re.search(r"--note-click:\s*(#[0-9a-fA-F]{6})\b", css)
    assert m_tok, ("--note-click token missing from engine.css — the clicked "
                   "state must be a token, not a raw hex in a rule")
    note_click = m_tok.group(1)
    in_root = re.search(r":root\s*\{[^}]*--note-click:", css, re.S)
    assert in_root, "--note-click must live in :root's fixed-token block"
    for cat, rungs in LADDERS.items():
        ratio = (max(lum(note_click), lum(rungs["deep"])) + 0.05) / \
                (min(lum(note_click), lum(rungs["deep"])) + 0.05)
        assert ratio >= 3.0, \
            f"clicked glow {cat}: --note-click {note_click} at {ratio:.2f}:1 below 3:1 vs --deep"
        print(f"clicked glow {cat.ljust(9)} --note-click {note_click} on --deep: "
              f"{ratio:.2f}:1 (≥3:1)")
    # and the clicked rule must actually USE the token (not a raw hex)
    m_clicked = re.search(r"\.note--link\.is-clicked\s*\{(.*?)\}", css, re.S)
    assert m_clicked, ".note--link.is-clicked rule missing from engine.css"
    assert "var(--note-click)" in m_clicked.group(1), \
        ".note--link.is-clicked does not bind the glow to var(--note-click)"
    assert "0 0 0 2px" in m_clicked.group(1), \
        ("the clicked state's ring does not widen beyond the hover ring's 1px — "
         "§12: the state must have a shape/edge channel, not colour alone")

    # --- FIX 4 (§4.6): connector endpoints must be measured with the REAL face.
    # First-load defect: renderLinks() read offsetWidth in the same synchronous
    # pass as the note append, measuring the `font-display: swap` fallback; the
    # real Montserrat Alternates then re-wrapped the notes wider and the drawn
    # endpoints stayed behind (up to ~16 logical px). The fix lives in the
    # engine's renderLinks(): draw immediately, then re-measure and redraw once
    # document.fonts settles. Assert the guard exists INSIDE renderLinks, so a
    # refactor that drops the re-measure fails here loudly.
    m_links = re.search(r"function renderLinks\(board, root\) \{(.*?)\n  \}", js, re.S)
    assert m_links, "renderLinks() not found in board-engine.js"
    body = m_links.group(1)
    assert "document.fonts" in body and "document.fonts.ready" in body, \
        "renderLinks does not await document.fonts.ready before re-measuring endpoints (§4.6)"
    assert "measureAndDraw()" in body and body.count("measureAndDraw") >= 2, \
        "renderLinks must draw immediately AND re-measure/draw after fonts.ready"
    assert "fonts.ready.then(measureAndDraw)" in body, \
        "the fonts.ready redraw is not wired to the same measure-and-draw pass"

    # --- issue #5 finding 5: the RENDERED gate ------------------------------
    # Boot all six pages in headless Chromium and assert on what the browser
    # computes: §3.2 lot geometry on the settled face (renderLot's re-measure
    # proven live), §4.6 drawn endpoints, computed font faces, structural §7
    # chrome scan, §3/§11 fit attributes, §12 form mount.
    t_browser = time.perf_counter()
    rendered = asyncio.run(collect_rendered())
    assert_rendered_behaviour(rendered)
    print(f"rendered gate: 6 pages booted headless, "
          f"{time.perf_counter() - t_browser:.1f}s")

    # --- issue #32: the surface sweep — the strip is an ASPECT condition ----
    # One page load, ≥24 viewport pairs spanning BOTH aspect directions; at
    # every pair the surface must fill the stage within 1px on both axes and
    # §11's k must be unchanged.
    swept = asyncio.run(collect_surface_sweep())
    worst = assert_surface_sweep(swept)
    print(f"surface sweep: {len(SWEEP_PAIRS)} viewport pairs resized in one "
          f"page load")
    for d in swept:
        print(f"sweep {str(str(d['vw']) + 'x' + str(d['vh'])).ljust(12)} "
              f"k={d['dataK']:.6f} "
              f"strip_right={max(0, d['stage']['right'] - d['bandFill']['right']):6.2f} "
              f"strip_bottom={max(0, d['stage']['bottom'] - d['lotFill']['bottom']):6.2f}")
    print(f"surface sweep worst: right {worst['worst_right'][3]:.2f}px at "
          f"{worst['worst_right'][0]}x{worst['worst_right'][1]}; bottom "
          f"{worst['worst_bottom'][4]:.2f}px at "
          f"{worst['worst_bottom'][0]}x{worst['worst_bottom'][1]}")

    print("SELF-CHECK GREEN: 72 notes / 43 links / 4 lot entries / 0 orphans; "
          "README.md asserted (per-board table, every cell, prose sweep; docs/ "
          "explicitly out of contract); "
          "ladders byte-identical; strip-list and monospace absent; scale law holds; "
          "§4.6 fonts.ready re-measure present in renderLinks; "
          "rendered gate: §3.2 settled lot geometry, §4.6 settled endpoints, "
          "computed faces, §7 chrome, §12 form verified in-browser on all 6 pages.")


if __name__ == "__main__":
    try:
        main()
    except AssertionError as e:
        print(f"SELF-CHECK FAIL: {e}", file=sys.stderr)
        sys.exit(1)
