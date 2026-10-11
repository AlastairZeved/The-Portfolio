
/* ---- The one render scale (issue #87, B30; #121, B44; #128, B46) ----
   The sheet is a fixed reference scene (REF_W × REF_H) rendered through a
   single uniform transform: scale(). The scale law is HEIGHT-ANCHORED ON
   LANDSCAPE (issue #128, B46 — TheBoards' own desktop frame law, geometry.js
   computeFrame `renderScale = min(vh/1000, (vw − panes)/900)`, ported): on a
   landscape screen rs = vh/REF_H, so the band — whose literals are fixed
   logical px — renders at the same fraction of the viewport height at every
   landscape size, exactly as TheBoards' band renders 61/1000 = 6.1% of vh.
   Portrait keeps B30's down-scale min(vw/REF_W, vh/REF_H), the only way the
   wide drawing fits a narrow screen. This supersedes B44's min() formula
   clause for landscape viewports only (B46). Above and below the reference
   space the sheet scales as one: the authored geometry stands, nothing
   reflows, nothing clips (issue #121, B44). Logical width/height are set so
   the scaled sheet always fills the viewport edge to edge. (TheBoards
   AGENTS.md architecture point 1; LOGICAL_W/H and --rs/--logical-w/h.) */
(function () {
  var board = document.getElementById('board');
  /* The reference space is the owner's issue #112 drawing's own coordinate
     space (B43: the 2560×1440 screenshot, measured through the calibration
     z = 1.3037 — 2560/z × 1440/z). The B43 authored geometry (left/top % and
     px width/height) is exact in THIS space, so rendering the scene here and
     scaling it uniformly reproduces the drawing at every viewport (issue
     #121, B44). The old 1080×600 constants predate the #112 geometry rebuild
     and clipped that geometry's spacing at widths the cap held the scale at. */
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
    var rs = (vw >= vh) ? (vh / REF_H) : Math.min(vw / REF_W, vh / REF_H);
    if (vw >= vh) {
      var rsPrev = parseFloat(getComputedStyle(board).getPropertyValue('--rs')) || 1;
      var lwMin = 0;
      document.querySelectorAll('.door-card').forEach(function (card) {
        var left = parseFloat(card.style.left) || 0;          // authored percentage (B45)
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
         no-overlap law. Extend the measured width floor above (same
         agent-derived provenance as B46's lw_min, per the B33/B43 pattern)
         with the pairwise gap term: for every pair of cards whose rendered
         vertical ranges overlap, the left card's right edge must clear the
         right card's left edge — lw >= aW / (bLeft% − aLeft%). The logical
         height (vh/rs) grows as the floor widens the sheet, so the % tops
         spread and vertical overlaps only shrink: re-measure until the floor
         is stable (it converges monotonically). */
      for (var pass = 0; pass < 60; pass++) {
        var lh = vh / rs;
        var need = lwMin;
        var geo = [];
        document.querySelectorAll('.door-card').forEach(function (card) {
          var lp = parseFloat(card.style.left) || 0, tp = parseFloat(card.style.top) || 0;
          var s = parseFloat(card.style.getPropertyValue('--card-scale')) || 1;
          geo.push({ lp: lp, tp: tp, w: card.offsetWidth * s, h: card.offsetHeight * s });
        });
        for (var i = 0; i < geo.length; i++) for (var j = i + 1; j < geo.length; j++) {
          var A = geo[i], B = geo[j];
          if (A.lp > B.lp) { var T = A; A = B; B = T; }
          var dLeft = (B.lp - A.lp) / 100;   // left/top are authored in % (B45)
          if (dLeft <= 0) continue;
          var aTop = (A.tp / 100) * lh, bTop = (B.tp / 100) * lh;   // top is authored in % (B45)
          if (aTop + A.h <= bTop || bTop + B.h <= aTop) continue;   // vertically clear
          /* +4: the resize-handle ring sits 4px past the card's right border
             (issue #108's grab area) and must not reach the neighbour either */
          var w = (A.w + 4) / dLeft;
          if (w > need) need = w;
        }
        if (need <= lwMin + 0.5) break;
        lwMin = need;
        rs = Math.min(rs, vw / lwMin);
      }
      if (lwMin > 0) rs = Math.min(rs, vw / lwMin);
    }
    board.style.setProperty('--rs', rs);
    board.style.setProperty('--logical-w', (vw / rs) + 'px');
    board.style.setProperty('--logical-h', (vh / rs) + 'px');
    // issue #107: the Requirements zone anchors to the title card's actual
    // right border (the card hugs its text, B19 — the slot calc leaves dead
    // space). The card's rendered right edge / rs = logical px, + one gutter.
    var title = document.getElementById('anchor-title');
    var gutter = parseFloat(getComputedStyle(board).getPropertyValue('--gutter')) || 16;
    board.style.setProperty('--req-left', (title.getBoundingClientRect().right / rs + gutter) + 'px');
  }
  frame();
  window.addEventListener('resize', frame);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(frame);
})();

/* ---- Issue #128 (B46): the band and the Parking Lot are TheBoards' sections,
   sized by their MEASURED contents from a floor — TheBoards' own law ported
   (geometry.js bandRuleY / lotH; constants state.js), with the band literals
   RESCALED ×1.10455 (issue #128, B46): TheBoards' literals live in its
   1000-tall logical frame; this board's logical space is the issue #112
   drawing's 1104.55-tall frame, so every TheBoards band literal maps through
   k = 1104.55/1000 = 1.10455 — with the height-anchored landscape scale law
   above, the band then renders at EXACTLY TheBoards' physical size on every
   landscape screen (54.9px rule at 1440×900 = 6.1% of vh, both boards).

   The band: rule-y = 15.46 + max(2, lines) × 21.54 + 8.84 — band-top, the
   tallest zone's line count at 16.57px/1.3, and the gap to the rule (67.38
   at the two-line floor, 88.92 at three). The Parking Lot: measured from its
   content from the rescaled two-row shelf (TheBoards B73), bottom-anchored so
   it grows UPWARD, ceiling half the sheet with #lot-items clipping past it.
   B18's fixed 180px --lot-h is superseded as a mechanism — fallback only.
   The lot's 34px head and 8px base literal are kept UNSCALED (TheBoards'
   chrome is not part of the rescale; noted per the B33 provenance pattern).
   All px here are board-logical (B30): the sheet is never reflowed, so the
   line counts and row heights are scale-stable. */
(function () {
  var board = document.getElementById('board');
  var BAND_TOP = 15.46, BAND_LINE = 21.54, BAND_GAP = 8.84;             // state.js × 1.10455
  var LOT_HEAD = 34, LOT_SHELF = 134.76, LOT_MAX_FRAC = 0.5;            // 34 unscaled; 122-shelf × 1.10455
  function bandRuleY() {
    var lines = 2;                       // the two-line floor
    document.querySelectorAll('.band-zone .anchor').forEach(function (node) {
      // scrollHeight is content only (the band anchor carries no padding), so
      // it reads as whole line boxes; min-height 44 keeps the floor's answer 2.
      lines = Math.max(lines, Math.round(node.scrollHeight / BAND_LINE));
    });
    return Math.round(BAND_TOP + lines * BAND_LINE + BAND_GAP);
  }
  function lotH() {
    var sum = 0;
    var items = document.getElementById('lot-items');
    if (items) items.querySelectorAll(':scope > *').forEach(function (node) {
      sum += node.offsetHeight;
    });
    // The rescaled two-row shelf (122 × k = 134.76, header included) is the
    // floor; measured content grows it; half the logical sheet caps it.
    return Math.min(Math.max(LOT_SHELF, LOT_HEAD + Math.round(sum)),
                    Math.ceil(board.offsetHeight * LOT_MAX_FRAC));
  }
  function updateBoardGeometry() {
    board.style.setProperty('--rule-y', bandRuleY() + 'px');
    board.style.setProperty('--lot-h', lotH() + 'px');
  }
  updateBoardGeometry();
  window.addEventListener('resize', updateBoardGeometry);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(updateBoardGeometry);
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
   note geometry). At desktop widths the scale is 1 and nothing changes. */
(function () {
  var board = document.getElementById('board');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.door-card'));
  var drag = null, resizing = null;

  // The scale the transform itself consumes is the single source of truth —
  // read it, never keep a copy that could drift from what is rendered.
  function renderScale() {
    var rs = parseFloat(getComputedStyle(board).getPropertyValue('--rs'));
    return (isFinite(rs) && rs > 0) ? rs : 1;
  }
  function toLogical(px) { return px / renderScale(); }

  /* ---- B45 (issue #126): TheBoards' note sizing + scale mechanics, ported ----
     TheBoards state.js: NOTE_MIN_W = 132, MIN_SCALE = 0.5 (MAX_SCALE 2.0
     superseded by B51 — see gestureScale).
     The card's own scale factor (a uniform transform: scale, origin top
     left) is the ONLY text/size scaling: the font is a fixed 17px/1.4 and
     the transform scales the card. This replaces the old height-driven
     --card-fs updater (B40, superseded by B45). */
  var MIN_SCALE = 0.5;                    // TheBoards state.js MIN_SCALE
  var NOTE_MIN_W = 132;                   // TheBoards state.js NOTE_MIN_W

  function cardScale(card) {
    var s = parseFloat(card.style.getPropertyValue('--card-scale'));
    return (isFinite(s) && s > 0) ? s : 1;
  }
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
     sheet, recompute the links (B91 — a scaled card's links track its new
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

  /* ---- The link layer (UIUX §4.3, B28): fourteen straight 1px --frame lines
     between card centres, one per pair authored in the markup. The pairing
     is authored; the geometry is computed, so a line stays true while a
     card is dragged or resized (TheBoards' link idiom, UIUX §4.6 / B91 —
     endpoints are plain board-logical centres, recomputed on every path
     that moves a note). The SVG's user units ARE the board's logical px, so
     a measured rect — which is physical — is converted with toLogical()
     before it is written: under the one render scale (B30) an unconverted
     centre would place the line at 1/rs of the card's distance from the
     board's origin. */
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
  // owner's placements, B43 — the only inline geometry left). The cap is
  // logical px like every authored size: it scales with the sheet (B30).
  layoutAllCards();
  // the percentage-authored layout re-scales with the viewport: recompute
  window.addEventListener('resize', drawLinks);
  window.addEventListener('resize', layoutAllCards);
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
    if (handle) {
      // B45: the corner gesture is TheBoards' frame-drag scale resize
      // (interactions.js startResize) — scale from the pointer's distance
      // to the card's fixed top-left origin. All readings in logical px.
      // .resizing suppresses the transform transition so the scale applies
      // instantly, as TheBoards' does (see the CSS note).
      card.classList.add('resizing');
      var ox = toLogical(cr.left - rect.left), oy = toLogical(cr.top - rect.top);
      var gpx = toLogical(e.clientX - rect.left), gpy = toLogical(e.clientY - rect.top);
      resizing = {
        card: card,
        startX: e.clientX, startY: e.clientY,          // physical, for the 4px moved test (B41)
        originX: ox, originY: oy,
        grabDist: Math.hypot(gpx - ox, gpy - oy) || 1,
        startScale: cardScale(card),
        moved: false
      };
    } else if (e.target === card || card.contains(e.target)) {
      // don't hijack the link's own click; only move on real drag
      drag = { card: card, startX: e.clientX, startY: e.clientY, left: toLogical(cr.left - rect.left), top: toLogical(cr.top - rect.top), moved: false };
    }
  });

  /* TheBoards interactions.js gestureScale: the clamp bounds admit the start
     value, so a scale outside [MIN_SCALE, ceiling] never snaps at gesture
     start — yet it can always be scaled back into the authored range.
     issue #142 / B51: the fixed MAX_SCALE 2.0 ceiling is superseded by a
     per-card ceiling derived from the 1/5-viewport bound — one uniform
     scale, so the card stops at the FIRST axis reaching one fifth of the
     viewport. The board's layout px ARE the logical px (B30), and a
     transform's offsetWidth/offsetHeight read the UNSCALED content, so the
     ceiling is min(0.2·boardW / unscaledW, 0.2·boardH / unscaledH). It is
     computed fresh on every move: growing the card rewraps its unscaled
     size, which moves the ceiling with it. */
  function gestureScale(start, f, ceiling) {
    return Math.min(Math.max(start * f, Math.min(MIN_SCALE, start)), Math.max(ceiling, start));
  }

  window.addEventListener('pointermove', function (e) {
    if (!drag && !resizing) return;
    var rs = renderScale();
    if (resizing) {
      var r = resizing;
      var radx = e.clientX - r.startX, rady = e.clientY - r.startY;   // physical
      if (Math.abs(radx) + Math.abs(rady) > 4) r.moved = true;       // 4 physical px — same gesture as the drag (B41)
      // TheBoards updateResize: scale from the pointer's distance to the
      // card's top-left origin, in the board's logical space (÷ rs, B30).
      var rect = board.getBoundingClientRect();
      var d = Math.hypot(toLogical(e.clientX - rect.left) - r.originX,
                         toLogical(e.clientY - rect.top) - r.originY);
      // issue #142 / B51: the ceiling is per-card and per-axis — see
      // gestureScale. offsetWidth/offsetHeight read unscaled (B30: layout
      // px are logical px; the scale is a transform).
      var ceiling = Math.min(0.2 * board.offsetWidth / r.card.offsetWidth,
                             0.2 * board.offsetHeight / r.card.offsetHeight);
      // guard as in renderScale()/cardScale(): if the card measures 0 or
      // non-finite on an axis, don't let that axis' ratio poison the min —
      // fall back to the other axis so the ceiling is never Infinity.
      if (!(r.card.offsetWidth > 0)) ceiling = 0.2 * board.offsetHeight / r.card.offsetHeight;
      if (!(r.card.offsetHeight > 0)) ceiling = 0.2 * board.offsetWidth / r.card.offsetWidth;
      applyCardScale(r.card, gestureScale(r.startScale, d / r.grabDist, ceiling));
      // drawLinks is applyCardScale's own tail — no second call here.
    } else {
      var d = drag;
      var adx = e.clientX - d.startX, ady = e.clientY - d.startY;   // physical
      if (Math.abs(adx) + Math.abs(ady) > 4) d.moved = true;        // 4 physical px — the same gesture as before the scale
      if (d.moved) {
        // the card tracks the pointer 1:1 on screen: logical + physical/scale
        d.card.style.left = (d.left + adx / rs) + 'px';
        d.card.style.top = (d.top + ady / rs) + 'px';
        applyCardMaxW(d.card);   // B45: the cap follows the card's new left edge
        // the moved card drags its links with it (UIUX §4.3)
        drawLinks();
      }
    }
  });

  function endDrag() {
    // A gesture that MOVED is not a click and must never navigate (issue #109).
    // The resize handle is a span inside the <a>, so releasing a resize fires
    // the anchor's own click and navigates away mid-gesture — the resize branch
    // carries the same `moved` flag the drag branch already had, so both
    // gestures route through one guard and one test.
    // A press that never crossed the 4px threshold is still a click and must
    // still open the door (B3) — including a tap squarely on the handle.
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
