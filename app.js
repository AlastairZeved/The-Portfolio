
/* ---- The one render scale (issue #87, B30; #121, B44; #128, B46) ----
   The sheet is a fixed reference scene (REF_W × REF_H) rendered through a
   single uniform transform: scale(). The scale law is HEIGHT-ANCHORED ON
   LANDSCAPE (issue #128, B46 — TheBoards' own desktop frame law, geometry.js
   computeFrame `renderScale = min(vh/1000, (vw − panes)/900)`, ported): on a
   landscape screen rs = vh/REF_H, so the band — whose literals are fixed
   logical px — renders at the same fraction of the viewport height at every
   landscape size, exactly as TheBoards' band renders 61/1000 = 6.1% of vh.
   Portrait keeps B30's down-scale min(vw/REF_W, vh/REF_H), the only way the
   wide drawing fits a narrow screen. Above and below the reference
   space the sheet scales as one: the authored geometry stands, nothing
   reflows, nothing clips (issue #121, B44). Logical width/height are set so
   the scaled sheet always fills the viewport edge to edge. (TheBoards
   AGENTS.md architecture point 1; LOGICAL_W/H and --rs/--logical-w/h.) */
function renderScale(board) {
  var rs = parseFloat(getComputedStyle(board).getPropertyValue('--rs'));
  return (isFinite(rs) && rs > 0) ? rs : 1;
}

function cardScale(card) {
  var scale = parseFloat(card.style.getPropertyValue('--card-scale'));
  return (isFinite(scale) && scale > 0) ? scale : 1;
}

(function () {
  var board = document.getElementById('board');
  var MAX_LAYOUT_PASSES = 60;
  var CONVERGENCE_TOLERANCE = 0.5;
  var RESIZE_HANDLE_OVERHANG = 4;
  /* The reference space is the owner's issue #112 drawing's own coordinate
     space (B43: the 2560×1440 screenshot, measured through the calibration
     z = 1.3037 — 2560/z × 1440/z). The B43 authored geometry (left/top %)
     is exact in THIS space, so rendering the scene here and
     scaling it uniformly reproduces the drawing at every viewport (issue
     #121, B44). */
  var REF_W = 2560 / 1.3037;   // 1963.64 — the #112 drawing's own logical width
  var REF_H = 1440 / 1.3037;   // 1104.55 — the #112 drawing's own logical height
  function frame() {
    var vw = window.innerWidth, vh = window.innerHeight;
    /* issue #128 (B46): height-anchored landscape — TheBoards' desktop frame
       law ported. Portrait keeps B30's min() down-scale. The height anchor is
       then floored by the content's own measured minimum width (B42's
       "measured, never a constant" law): a door-card is placed by a percentage
       left and content-sized in logical px, so on a near-square landscape
       window the height anchor alone compresses the logical width below the
       cards' right edges and the sheet would clip (~4px at 800×800, the
       branch's own edge-probe finding). lw_min = max(cardW / (1 − left%)) is
       the narrowest logical width at which no door-card overflows; it only
       binds at square-ish aspects and leaves every ordinary screen untouched. */
    var landscape = vw >= vh;
    var rs = landscape ? (vh / REF_H) : Math.min(vw / REF_W, vh / REF_H);
    if (landscape) {
      var rsPrev = renderScale(board);
      var lwMin = 0;
      var geo = [];
      document.querySelectorAll('.door-card').forEach(function (card) {
        var left = parseFloat(card.style.left) || 0;          // authored percentage (B45)
        var top = parseFloat(card.style.top) || 0;
        var scale = cardScale(card);
        geo.push({ lp: left, tp: top, s: scale, w: card.offsetWidth * scale, h: card.offsetHeight * scale });
        if (left >= 100) return;
        /* the card's rightmost content in logical px — its own box PLUS any
           child that sticks out of it (the resize handle sits 2px past the
           right border), measured from the live rects; rect deltas ÷ rs are
           board-logical and stable across scales (B30). */
        var cr = card.getBoundingClientRect();
        var rightLogical = cr.width / rsPrev;
        card.querySelectorAll('*').forEach(function (child) {
          var r2 = child.getBoundingClientRect();
          var over = (r2.right - cr.left) / rsPrev;
          if (over > rightLogical) rightLogical = over;
        });
        lwMin = Math.max(lwMin, rightLogical / (1 - left / 100));
      });
      /* B52 (issue #138): the cards' drawing rest scales widen the cards, so
         at square-ish landscape aspects the pure height anchor compresses the
         % horizontal spread until two cards OVERLAP — breaking B44's
         no-overlap law. Extend the measured width floor above with the pairwise
         gap term: for every pair of cards whose rendered
         vertical ranges overlap, the left card's right edge must clear the
         right card's left edge — lw >= aW / (bLeft% − aLeft%). The logical
         height (vh/rs) grows as the floor widens the sheet, so the % tops
         spread and vertical overlaps only shrink: re-measure until the floor
         is stable (it converges monotonically). */
      for (var pass = 0; pass < MAX_LAYOUT_PASSES; pass++) {
        var lh = vh / rs;
        var need = lwMin;
        for (var i = 0; i < geo.length; i++) for (var j = i + 1; j < geo.length; j++) {
          var A = geo[i], B = geo[j];
          if (A.lp > B.lp) { var T = A; A = B; B = T; }
          var dLeft = (B.lp - A.lp) / 100;   // left/top are authored in % (B45)
          if (dLeft <= 0) continue;
          var aTop = (A.tp / 100) * lh, bTop = (B.tp / 100) * lh;   // top is authored in % (B45)
          if (aTop + A.h <= bTop || bTop + B.h <= aTop) continue;   // vertically clear
          /* The resize-handle ring's grab box extends 4px past the card's
             padding-box right edge (right: -4px, inside the 2px border). It is
             a child of the scaled card, so its board-logical overhang is
             4 × that card's --card-scale; keep the whole grab area clear of
             the neighbour too (issue #253, preserving B44's no-overlap law). */
          var w = (A.w + RESIZE_HANDLE_OVERHANG * A.s) / dLeft;
          if (w > need) need = w;
        }
        if (need <= lwMin + CONVERGENCE_TOLERANCE) break;
        lwMin = need;
        rs = Math.min(rs, vw / lwMin);
      }
      if (lwMin > 0) rs = Math.min(rs, vw / lwMin);
    }
    board.style.setProperty('--rs', rs);
    board.style.setProperty('--logical-w', (vw / rs) + 'px');
    board.style.setProperty('--logical-h', (vh / rs) + 'px');
    // issue #309 (B114): the Requirements zone follows the title card by CSS
    // layout — the band is a flex row — so nothing here measures the card.
  }
  frame();
  window.addEventListener('resize', frame);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(frame);
})();

/* ---- Entertainment only: drag to move, corner to resize (B7) ----
   No persistence. Nothing is saved; reload restores the authored layout.

   The sheet renders through ONE uniform scale (B30), so pointer input arrives
   in PHYSICAL px while a card's inline left/top is authored in the board's
   LOGICAL space (B45: the % left/top placements are the only authored
   geometry — cards are content-sized with their own scale factor). Every
   pointer reading is therefore converted with
   toLogical() before it touches card geometry — the same rule TheBoards states
   for itself (TheBoards AGENTS.md architecture point 1; geometry.js toLogical
   divides by the render scale: never read clientX/clientY directly against
   note geometry). */
(function () {
  var board = document.getElementById('board');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.door-card'));
  var drag = null, resizing = null;

  // Pointer and rendered geometry meet in the sheet's logical coordinates.
  function toLogical(px, scale) {
    return px / (scale === undefined ? renderScale(board) : scale);
  }

  /* B45 (issue #126): the card's own scale transforms its text and size
     uniformly. The default font is 17px/1.4; `.fit-to-spotify` uses 11.4px (B80). */
  var MIN_SCALE = 0.5;                    // TheBoards state.js MIN_SCALE
  var NOTE_MIN_W = 132;                   // TheBoards state.js NOTE_MIN_W; B21's legible floor
  var MOVE_THRESHOLD = 4;                 // B41: physical px before a gesture moves
  var MAX_VIEW_FRAC = 0.2;                // issue #142 / B51: one fifth of the viewport

  /* TheBoards geometry.js noteMaxW: the cap is the distance from the card's
     left edge to the sheet's right edge, divided by the card's own scale,
     floored at NOTE_MIN_W. The board's layout px ARE the logical px (B30),
     so offsetLeft/offsetWidth read logical values directly. */
  function applyCardMaxW(card) {
    var lw = board.offsetWidth;
    var cap = Math.max(NOTE_MIN_W, (lw - card.offsetLeft) / cardScale(card));
    card.style.setProperty('--card-max-w', cap + 'px');
  }
  function layoutAllCards() { cards.forEach(applyCardMaxW); }
  /* TheBoards interactions.js applyNoteScale (shared tail of pinch and the
     desktop frame-drag resize): apply the scale, re-derive the cap (a scale
     change rewraps the unscaled width), re-clamp the footprint into the
     sheet, recompute the links (TheBoards' `B91` — a scaled card's links track its new
     centre). The min/max-of-the-same-pair clamp is TheBoards' inverted
     constraint for a folded scale that outgrows the sheet. */
  function applyCardScale(card, scale) {
    card.style.setProperty('--card-scale', scale);
    applyCardMaxW(card);
    var lw = board.offsetWidth, lh = board.offsetHeight;
    var footW = card.offsetWidth * scale, footH = card.offsetHeight * scale;
    var x = Math.min(Math.max(card.offsetLeft, Math.min(0, lw - footW)), Math.max(0, lw - footW));
    var y = Math.min(Math.max(card.offsetTop, Math.min(0, lh - footH)), Math.max(0, lh - footH));
    card.style.left = x + 'px';
    card.style.top = y + 'px';
    drawLinks();
  }

  /* Link endpoints for the authored pairs in #link-layer (UIUX §4.3, B28). */
  var linkLayer = document.getElementById('link-layer');
  var links = linkLayer ? Array.prototype.slice.call(linkLayer.querySelectorAll('line')) : [];

  function centreOf(card, boardRect) {
    var r = card.getBoundingClientRect();
    return {
      x: toLogical(r.left - boardRect.left + r.width / 2),
      y: toLogical(r.top - boardRect.top + r.height / 2)
    };
  }

  function drawLinks() {
    if (!links.length) return;
    var rect = board.getBoundingClientRect();
    links.forEach(function (line) {
      var a = board.querySelector('[data-id="' + line.getAttribute('data-from') + '"]');
      var b = board.querySelector('[data-id="' + line.getAttribute('data-to') + '"]');
      if (!a || !b) return;
      var ca = centreOf(a, rect), cb = centreOf(b, rect);
      line.setAttribute('x1', ca.x);
      line.setAttribute('y1', ca.y);
      line.setAttribute('x2', cb.x);
      line.setAttribute('y2', cb.y);
    });
  }

  // B45: seed each card's content-width cap from its authored left/top (the
  // owner's placements, B78 (+B80) — the only inline geometry left). The cap is
  // logical px like every authored size: it scales with the sheet (B30).
  layoutAllCards();
  // B109: on resize, lay out cards before redrawing the note links.
  window.addEventListener('resize', function () {
    layoutAllCards();
    drawLinks();
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () {
    layoutAllCards();
    drawLinks();
  });

  // When a card's transform transition settles (B45: the 80ms scale easing
  // can still be in flight after a gesture ends), the settled box differs
  // from the one drawLinks measured mid-flight (B28) — recompute once.
  board.addEventListener('transitionend', function (e) {
    if (e.target.classList && e.target.classList.contains('door-card') &&
        e.propertyName === 'transform') drawLinks();
  });

  // issue #94 — native anchor drag must not steal the gesture. The door-cards
  // are real <a href> anchors, so a real press-and-move would otherwise fire
  // the browser's own HTML5 drag: `dragstart` fires, the pointer flow cancels,
  // and the drag ghost wanders while the card never moves. TheBoards' cards
  // are divs, so this suppression is the one piece this page must add. It is
  // scoped to the door-cards ONLY — never the whole page — and lives entirely
  // here: there is no `draggable` attribute anywhere and no preventDefault on
  // pointerdown (that would kill the :active click glow, B29).
  board.addEventListener('dragstart', function (e) {
    if (e.target.closest('.door-card')) e.preventDefault();
  });

  // TheBoards' pointer idiom (attachBoardCardGestures): the grabbed card takes
  // over the pointer stream so a drag still tracks even when the pointer
  // leaves the card's own bounds. A browser rejects an unknown pointerId — a
  // synthetic PointerEvent (as the regression suite and dragstart assertions
  // dispatch) carries no active pointer — so a throw here is benign: the
  // window-level pointermove/up listeners plus the dragstart suppression above
  // carry the gesture either way.
  function capturePointer(card, e) {
    try { card.setPointerCapture(e.pointerId); } catch (_) { /* no active pointer */ }
  }

  board.addEventListener('pointerdown', function (e) {
    var handle = e.target.closest('.resize-handle');
    var card = e.target.closest('.door-card');
    if (!card) return;
    capturePointer(card, e);
    var rect = board.getBoundingClientRect();
    var cr = card.getBoundingClientRect();
    var scale = renderScale(board);
    var left = toLogical(cr.left - rect.left, scale), top = toLogical(cr.top - rect.top, scale);
    if (handle) {
      // B45: the corner gesture is TheBoards' frame-drag scale resize
      // (interactions.js startResize) — scale from the pointer's distance
      // to the card's fixed top-left origin. All readings in logical px.
      // .resizing suppresses the transform transition so the scale applies
      // instantly, as TheBoards' does (see the CSS note).
      card.classList.add('resizing');
      var gpx = toLogical(e.clientX - rect.left, scale), gpy = toLogical(e.clientY - rect.top, scale);
      resizing = {
        card: card,
        startX: e.clientX, startY: e.clientY,          // physical, for the 4px moved test (B41)
        originX: left, originY: top,
        grabDist: Math.hypot(gpx - left, gpy - top) || 1,
        startScale: cardScale(card),
        moved: false
      };
    } else {
      // don't hijack the link's own click; only move on real drag
      drag = { card: card, startX: e.clientX, startY: e.clientY, left: left, top: top, moved: false };
    }
  });

  /* TheBoards interactions.js gestureScale: the clamp bounds admit the start
     value, so a scale outside [MIN_SCALE, ceiling] never snaps at gesture
     start — yet it can always be scaled back into the authored range.
     issue #142 / B51: a per-card ceiling derived from the 1/5-viewport
     bound — one uniform scale, so the card stops at the FIRST axis reaching
     one fifth of the viewport. A transform's offsetWidth/offsetHeight read
     the UNSCALED content (B30), so the ceiling is
     min(0.2·boardW / unscaledW, 0.2·boardH / unscaledH). It is computed
     fresh on every move: growing the card rewraps its unscaled size, which
     moves the ceiling with it. */
  function gestureScale(start, f, ceiling) {
    return Math.min(Math.max(start * f, Math.min(MIN_SCALE, start)), Math.max(ceiling, start));
  }

  window.addEventListener('pointermove', function (e) {
    if (!drag && !resizing) return;
    var scale = renderScale(board);
    if (resizing) {
      var r = resizing;
      var radx = e.clientX - r.startX, rady = e.clientY - r.startY;   // physical
      if (Math.abs(radx) + Math.abs(rady) > MOVE_THRESHOLD) r.moved = true;
      // TheBoards updateResize: scale from the pointer's distance to the
      // card's top-left origin, in the board's logical space (÷ rs, B30).
      var rect = board.getBoundingClientRect();
      var distance = Math.hypot(toLogical(e.clientX - rect.left, scale) - r.originX,
                                toLogical(e.clientY - rect.top, scale) - r.originY);
      // issue #142 / B51: the ceiling is per-card and per-axis — see gestureScale.
      var widthCeiling = MAX_VIEW_FRAC * board.offsetWidth / r.card.offsetWidth;
      var heightCeiling = MAX_VIEW_FRAC * board.offsetHeight / r.card.offsetHeight;
      // guard as in renderScale()/cardScale(): if the card measures 0 or
      // non-finite on an axis, don't let that axis' ratio poison the min —
      // fall back to the other axis so the ceiling is never Infinity.
      if (!(r.card.offsetWidth > 0)) widthCeiling = heightCeiling;
      if (!(r.card.offsetHeight > 0)) heightCeiling = widthCeiling;
      var ceiling = Math.min(widthCeiling, heightCeiling);
      applyCardScale(r.card, gestureScale(r.startScale, distance / r.grabDist, ceiling));
      // drawLinks is applyCardScale's own tail — no second call here.
    } else {
      var adx = e.clientX - drag.startX, ady = e.clientY - drag.startY;   // physical
      if (Math.abs(adx) + Math.abs(ady) > MOVE_THRESHOLD) drag.moved = true;
      if (drag.moved) {
        // the card tracks the pointer 1:1 on screen: logical + physical/scale
        drag.card.style.left = (drag.left + toLogical(adx, scale)) + 'px';
        drag.card.style.top = (drag.top + toLogical(ady, scale)) + 'px';
        applyCardMaxW(drag.card);   // B45: the cap follows the card's new left edge
        // the moved card drags its links with it (UIUX §4.3)
        drawLinks();
      }
    }
  });

  function endDrag() {
    // A gesture past MOVE_THRESHOLD is not a click (B41); a press under it still opens the door (B3).
    var gesture = (drag && drag.moved) ? drag : (resizing && resizing.moved ? resizing : null);
    if (gesture) {
      gesture.card.addEventListener('click', function (e) { e.preventDefault(); }, { once: true, capture: true });
    }
    drag = null;
    if (resizing) {
      // the gesture is over: hand the transition back (any still-settling
      // scale change then recomputes the links via the transitionend hook)
      resizing.card.classList.remove('resizing');
    }
    resizing = null;
  }
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);
})();
