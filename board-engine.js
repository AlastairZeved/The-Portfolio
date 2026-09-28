/* board-engine.js — the shared board engine (issue 0001).
   Every later page loads this; none of them redefines any of it.
   Authority: UIUX.md §2.2.2, §2.8, §3, §3.1, §3.2, §4, §4.3, §4.6, §11, §13.1.
   This is a read-only portfolio: the note action row (§4.5), drag and size
   affordances, the clock glyph on cards, the board-level tab row and all OS
   window furniture are deliberately NOT built (issue §7, owner ruling 1).
   No fixed-pitch face exists in this build (owner ruling 2026-09-27): the five
   ASCII-art notes render in Montserrat Alternates and read ragged — intended. */
(function (global) {
  'use strict';

  /* ---- Constants from the authority documents ---- */

  var REFERENCE_SHEET = { w: 900, h: 1000 }; // §3: the reference sheet — NOT the live logical sheet
  var RAIL_W = 300;                          // §3: offX, the desktop rail
  var NOTE_MIN_W = 132;                      // §4.5
  var LOT_ROW_MIN = 44;                      // §3.2 row floor
  var LOT_PAD_TOP = 34;                      // §3.2: 34 + max(2*44, Σrows)
  var BAND_PAD_TOP = 14;                     // §3.1: rule-y = 14 + max(2,lines)*19.5 + 8
  var BAND_LINE = 19.5;
  var BAND_PAD_BOT = 8;

  // A record with no category reads as a Note board (§2.2.2, the `unsorted` bucket)
  var LADDER_OF = { todo: 'todo', idea: 'idea', note: 'note', learning: 'learning', unsorted: 'note' };

  /* ---- §3 + §11 The scale law ----
     renderScale = min(vh/1000, (vw-300)/900); LOGICAL_W = (vw-300)/renderScale;
     LOGICAL_H = vh/renderScale; floor: neither logical dimension below 900x1000.
     k = min(LOGICAL_W/rw, LOGICAL_H/rh) — one uniform ratio for x, y AND size,
     anchored top-left. At 2560x1440: renderScale=1.44, LOGICAL_W≈1569.4, k≈0.9955. */
  function computeFit(vw, vh, rw, rh) {
    var renderScale = Math.min(vh / REFERENCE_SHEET.h, (vw - RAIL_W) / REFERENCE_SHEET.w);
    var logicalW = (vw - RAIL_W) / renderScale;
    var logicalH = vh / renderScale;
    // Floor: neither logical dimension below 900x1000 (§3)
    if (logicalW < REFERENCE_SHEET.w) logicalW = REFERENCE_SHEET.w;
    if (logicalH < REFERENCE_SHEET.h) logicalH = REFERENCE_SHEET.h;
    var k = Math.min(logicalW / rw, logicalH / rh); // §11 similarity transform (B64)
    return { renderScale: renderScale, logicalW: logicalW, logicalH: logicalH, k: k };
  }

  /* ---- Category helper ---- */
  function catOf(board) { return LADDER_OF[board.category] || 'note'; }

  /* ---- §3.1 Band height from the formula ---- */
  function bandHeight(textA, textB) {
    // lines = the taller of the two zones' wrapped line counts; floor of 2 lines.
    var lines = Math.max(2, countLines(textA), countLines(textB));
    return BAND_PAD_TOP + lines * BAND_LINE + BAND_PAD_BOT;
  }
  // Conservative wrap estimate: hard lines, each wrapped at ~38 chars per 100px zone column
  function countLines(text) {
    if (!text) return 0;
    var n = 0;
    String(text).split('\n').forEach(function (line) {
      n += Math.max(1, Math.ceil(line.length / 38));
    });
    return n;
  }

  /* ---- Render the desktop rail (§13.1 B78: To Do / Notes / Learning / Ideas) ---- */
  function renderRail(boards) {
    var slots = {};
    document.querySelectorAll('.rail-cards').forEach(function (el) {
      slots[el.getAttribute('data-slot')] = el;
      el.innerHTML = '';
    });
    boards.forEach(function (b) {
      var slot = slots[catOf(b)];
      if (!slot) return;
      var a = document.createElement('a');
      a.className = 'rail-card';
      a.href = '#';
      a.textContent = b.title || '(untitled board)';
      a.setAttribute('data-board-id', b.id);
      slot.appendChild(a);
    });
  }

  /* ---- Render one board into #board ---- */
  function renderBoard(board, root) {
    root.setAttribute('data-cat', catOf(board));
    var rw = board.notes.length ? board.notes[0].rw : REFERENCE_SHEET.w;
    var rh = board.notes.length ? board.notes[0].rh : REFERENCE_SHEET.h;
    root.style.width = rw + 'px';
    root.style.height = rh + 'px';
    root.setAttribute('data-rw', rw);
    root.setAttribute('data-rh', rh);

    renderBand(board, root);
    renderNotes(board, root, rw);
    renderLinks(board, root);
    renderLot(board, root, rh);
  }

  /* ---- §3.1 The band: title compartment, zones, rule, tab ---- */
  function renderBand(board, root) {
    var titleEl = root.querySelector('#board-title');
    titleEl.textContent = board.title || '';
    root.querySelector('#zone-components').textContent = board.components || '';
    root.querySelector('#zone-requirements').textContent = board.requirements || '';
    var h = bandHeight(board.components, board.requirements);
    root.querySelector('#band').style.height = h + 'px';
  }

  /* ---- §4 Notes ---- */
  function renderNotes(board, root, rw) {
    var mount = root.querySelector('#notes');
    mount.innerHTML = '';
    board.notes.forEach(function (n, i) {
      if (!n.text) return; // §4: no empty frame ever exists — transparent before the first character
      // A note carrying a `link` property renders as an <a>, following the
      // rail-card precedent (renderRail): the site is read-only (no drag
      // conflict) and an anchor is keyboard-reachable where an onclick div
      // is not. className stays 'note' so every existing rule applies, plus
      // the marker class 'note--link' for the clicked state (issue #24).
      var el = document.createElement(n.link ? 'a' : 'div');
      el.className = 'note';
      if (n.link) {
        el.classList.add('note--link');
        el.href = n.link;
        el.target = '_blank';                 // opens in a new tab
        el.rel = 'noopener noreferrer';       // never leak the opener
      }
      el.setAttribute('data-idx', String(i));
      el.textContent = n.text;
      el.style.left = n.x + 'px';
      el.style.top = n.y + 'px';
      el.style.transform = 'scale(' + n.scale + ')';
      // Wrap cap at the sheet's right edge (§4, B39), never below NOTE_MIN_W
      var maxW = Math.max(NOTE_MIN_W, rw - n.x - 12);
      el.style.maxWidth = maxW + 'px';
      if (n.state === 'complete') el.classList.add('note--complete'); // §4.3 struck, not hidden
      if (n.highlighted === true) el.classList.add('note--highlight');
      if (n.title) {
        var t = document.createElement('span');
        t.className = 'note-title';
        t.textContent = n.title;
        el.appendChild(t);
      }
      mount.appendChild(el);
      // Issue #24: the clicked state PERSISTS after activation ("once the
      // card is clicked/tapped") — the marker class is added from the click
      // handler, not from :active, which only exists while the pointer is
      // down. Wired after mount, engine-side, so both boot paths (SPA and
      // static) inherit it with the render.
      if (n.link) {
        el.addEventListener('click', function () {
          el.classList.add('is-clicked');
        });
      }
    });
  }

  /* ---- §4.6 Links: 1px --frame hairlines between plain note centres ---- */
  // Endpoints are board-logical note centres measured off the laid-out notes
  // (their offsetWidth/Height are logical px — the scale(k) transform is paint-only).
  //
  // §4.6 first-load defect: with `font-display: swap` the notes are laid out in
  // the fallback face on the synchronous pass, then re-wrap wider when
  // Montserrat Alternates arrives — the drawn endpoints would stay where the
  // fallback put them (up to ~16 logical px off). Fix at the single root cause:
  // draw immediately (so the board is never blank), then re-measure and redraw
  // once document.fonts settles. Covers every page through this one call path;
  // no per-page workaround.
  function renderLinks(board, root) {
    var svg = root.querySelector('#link-layer');
    var notes = root.querySelector('#notes');

    function measureAndDraw() {
      svg.innerHTML = '';
      if (!board.links || !board.links.length) return;
      var byId = {};
      Array.prototype.forEach.call(notes.children, function (el) {
        var n = board.notes[Number(el.getAttribute('data-idx'))];
        if (n) byId[n.id] = {
          cx: n.x + (el.offsetWidth * n.scale) / 2,
          cy: n.y + (el.offsetHeight * n.scale) / 2
        };
      });
      board.links.forEach(function (link) {
        var a = byId[link.a], b = byId[link.b];
        if (!a || !b) return; // orphan links are reported by the self-check, not drawn
        var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', a.cx); line.setAttribute('y1', a.cy);
        line.setAttribute('x2', b.cx); line.setAttribute('y2', b.cy);
        line.setAttribute('vector-effect', 'non-scaling-stroke'); // §4.6: crisp 1px at any scale
        svg.appendChild(line);
      });
    }

    measureAndDraw();
    // Redraw with the real face's metrics once fonts are in. Guarded: older
    // engines without the Font Loading API just keep the fallback measurements.
    if (document.fonts && document.fonts.ready && document.fonts.status !== 'loaded') {
      document.fonts.ready.then(measureAndDraw);
    }
  }

  /* ---- §3.2 Parking Lot: measured height, two-row floor, half-sheet ceiling ---- */
  function renderLot(board, root, rh) {
    var items = root.querySelector('#lot-items');
    items.innerHTML = '';
    (board.parkingLot || []).forEach(function (item) {
      var el = document.createElement('div');
      el.className = 'lot-item';
      el.textContent = item.text;
      if (item.state === 'complete') el.classList.add('lot-item--complete'); // §4.3 on the water
      items.appendChild(el);
    });
    // §3.2 measurement, extracted so the same document.fonts pass that
    // re-measures renderLinks' endpoints (§4.6) can re-run it: row heights
    // read here are laid out in the `font-display: swap` fallback face on
    // the synchronous pass and re-wrap when Montserrat Alternates arrives.
    function measureAndDraw() {
      var sum = 0;
      Array.prototype.forEach.call(items.children, function (row) {
        // (a) strip before measuring (issue #6): the input to this pass must
        // never be this pass's own previous output. Reading offsetHeight
        // immediately after the clear forces a reflow, so `h` is the row's
        // NATURAL height under the current face — the settled pass can move
        // the measurement down as well as up. The pin is then re-written from
        // that clean read, preserving §3.2's reserve so nothing reflows under
        // the reader.
        row.style.minHeight = '';
        var h = Math.max(LOT_ROW_MIN, row.offsetHeight);
        row.style.minHeight = h + 'px';
        sum += h;
      });
      var h = LOT_PAD_TOP + Math.max(2 * LOT_ROW_MIN, sum);
      var ceiling = Math.ceil(0.5 * rh);
      if (h > ceiling) h = ceiling; // §3.2: a runaway lot cannot swallow the canvas
      root.querySelector('#lot').style.height = h + 'px';
    }

    measureAndDraw();
    // Guard identical to renderLinks': older engines without the Font
    // Loading API just keep the fallback measurements.
    if (document.fonts && document.fonts.ready && document.fonts.status !== 'loaded') {
      document.fonts.ready.then(measureAndDraw);
    }
    // Keep the action-row plane above the lot's top edge? No — this is a read-only
    // portfolio: no board-action row is built (owner ruling 1).
  }

  /* ---- §11 Apply the fit: ONE uniform transform, anchored top-left ---- */
  function fit(root) {
    var vw = window.innerWidth, vh = window.innerHeight;
    var rw = Number(root.getAttribute('data-rw'));
    var rh = Number(root.getAttribute('data-rh'));
    var f = computeFit(vw, vh, rw, rh);
    // The paint scale is the COMPOSITE: k maps the logical sheet to the stored
    // canvas, renderScale maps the stored canvas to the stage. §3 divides
    // LOGICAL_W by renderScale precisely so renderScale is the logical→device
    // mapping — both factors belong in the one uniform transform. Applied alone,
    // k leaves 691px dead right and 445px dead bottom at 2560x1440.
    var paintScale = f.k * f.renderScale;
    root.style.transform = 'scale(' + paintScale + ')';
    root.setAttribute('data-k', f.k);                 // §11 figure, reported as-is
    root.setAttribute('data-render-scale', f.renderScale); // §3 factor itself
    root.setAttribute('data-paint-scale', paintScale);     // the composite paint scale
    return f;
  }

  /* ---- Public API ---- */
  global.BoardEngine = {
    computeFit: computeFit,
    catOf: catOf,
    bandHeight: bandHeight,
    renderRail: renderRail,
    renderBoard: renderBoard,
    fit: fit
  };
})(window);
