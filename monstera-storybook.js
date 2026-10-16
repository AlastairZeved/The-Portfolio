
const PAGES=Array.from(document.querySelectorAll("#page-assets img"), function (image) {
  return image.getAttribute("src");
});
var stage = document.getElementById('stage');
var btnPrev = document.getElementById('prev');
var btnNext = document.getElementById('next');
var NONE = -1;
var spreads = [], idx = 0, busy = false, cur = null, flipId = 0;
var mq = window.matchMedia('(min-width: 768px)');
var pendingCleanup = null;
document.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'visible' && pendingCleanup) pendingCleanup();
});

/* book model (1-indexed pages p1..pN = PAGES[0..PAGES.length-1]):
   closed: right half holds the cover; each turn flips a sheet left,
   revealing the next right page and laying the sheet's back as the next left page. */
function build() {
  spreads = [];
  if (mq.matches) {
    spreads.push([NONE, 0]);                    // closed book — cover alone, right half
    // Page 0 is the cover; pair the rest in order, leaving an empty half if
    // PAGES has an even count.
    for (var i = 1; i < PAGES.length; i += 2) {
      spreads.push([i, i + 1 < PAGES.length ? i + 1 : NONE]);
    }
  } else {
    for (var j = 0; j < PAGES.length; j++) spreads.push([j]);
  }
  idx = Math.min(idx, spreads.length - 1);
}
function pageImg(page) {
  var im = document.createElement('img'); im.src = PAGES[page]; im.alt = ''; im.loading = 'lazy';
  return im;
}
function makeSpread(s, cls) {
  var d = document.createElement('div');
  d.className = 'spread' + (cls ? ' ' + cls : '');
  if (s.length === 1) {
    var h = document.createElement('div'); h.className = 'half';
    h.appendChild(pageImg(s[0])); d.appendChild(h);
  } else {
    for (var k = 0; k < 2; k++) {
      var h2 = document.createElement('div'); h2.className = 'half';
      if (s[k] !== NONE) h2.appendChild(pageImg(s[k]));
      d.appendChild(h2);
    }
  }
  return d;
}
function faceImg(page) {
  var f = document.createElement('div'); f.className = 'face';
  f.appendChild(pageImg(page));
  return f;
}
function syncButtons() {
  btnPrev.disabled = idx === 0;
  btnNext.disabled = idx === spreads.length - 1;
}
function flip(dir) {
  if (busy || !cur) return;
  var n = idx + dir;
  if (n < 0 || n >= spreads.length) return;
  busy = true;
  var ownFlip = ++flipId;
  var from = spreads[idx], to = spreads[n];
  idx = n;
  var top = cur;                                        // the settled spread plays the upper layer
  top.classList.add('top');
  var base = makeSpread(to);
  stage.insertBefore(base, top);                        // beneath it
  // the sheet being turned: right page (forward) or left page (backward)
  var fi = (from.length === 2) ? (dir > 0 ? 1 : 0) : 0;
  var srcImg = top.children[fi].querySelector('img');
  var backPage = (dir > 0) ? to[0] : (to.length === 2 ? to[1] : to[0]);
  var r = srcImg.getBoundingClientRect(), s = stage.getBoundingClientRect();
  var turn = document.createElement('div');
  turn.className = 'turn ' + (dir > 0 ? 'next' : 'prev');
  turn.style.left = (r.left - s.left) + 'px';
  turn.style.top = (r.top - s.top) + 'px';
  turn.style.width = r.width + 'px';
  turn.style.height = r.height + 'px';
  turn.appendChild(faceImg(from[fi]));                          // front = the page being turned
  var back = faceImg(backPage); back.className += ' back';      // its underside
  turn.appendChild(back);
  turn.appendChild(document.createElement('div')).className = 'curl';
  stage.appendChild(turn);
  srcImg.style.visibility = 'hidden';                           // the sheet replaces it
  var ended = false, fallback;
  function cleanup() {
    if (ended || ownFlip !== flipId) return;
    ended = true;
    if (pendingCleanup === cleanup) pendingCleanup = null;
    clearTimeout(fallback);
    if (turn.parentNode) stage.removeChild(turn);
    if (top.parentNode) stage.removeChild(top);
    busy = false; cur = base;
  }
  pendingCleanup = cleanup;
  turn.addEventListener('animationend', cleanup, { once: true });
  fallback = setTimeout(cleanup, 1900); // safety net if animationend never fires
  syncButtons();
}
btnPrev.addEventListener('click', function () { flip(-1); });
btnNext.addEventListener('click', function () { flip(1); });
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') flip(1);
  if (e.key === 'ArrowLeft') flip(-1);
});
function show() {
  if (cur) stage.removeChild(cur);
  var d = makeSpread(spreads[idx]); stage.appendChild(d); cur = d;
  syncButtons();
}
function rebuild() {
  ++flipId;
  pendingCleanup = null;
  build();
  stage.innerHTML = ''; cur = null; busy = false;
  show();
}
var builtTwo = mq.matches;
function onMode() {
  if (mq.matches !== builtTwo) { builtTwo = mq.matches; rebuild(); }
}
/* Rebuild only when the media-query breakpoint flips; window resize would
   repeat the same check on every resize event. */
mq.addEventListener ? mq.addEventListener('change', onMode) : mq.addListener(onMode);
build(); show();
