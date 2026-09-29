/* test/tokens.js — design contract: UIUX §2 recomputed from shipped index.html hexes.
   No browser. Reads the single shipped file, asserts every token the record states.
   Run: node test/tokens.js */

const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

function token(name) {
  const m = html.match(new RegExp(`--${name}:\\s*([^;]+);`));
  if (!m) throw new Error(`missing --${name} in index.html`);
  return m[1].trim();
}

function lum(hex) {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
  const f = c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrast(a, b) {
  const la = lum(a), lb = lum(b);
  const hi = Math.max(la, lb), lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

let failures = 0;
function check(label, actual, expected, tol = 0.0002) {
  const ok = Math.abs(actual - expected) <= tol;
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${label}: got ${actual.toFixed(4)}, want ${expected.toFixed(4)}`);
}

// §2.2 ladder, To-Do binding (rel. luminance)
check('--deep luminance', lum(token('deep')), 0.0023);
check('--card luminance', lum(token('card')), 0.0077);
check('--water-top luminance', lum(token('water-top')), 0.1237);
check('--water-bot luminance', lum(token('water-bot')), 0.0325);
check('--frame luminance', lum(token('frame')), 0.2611);
check('--note luminance', lum(token('note')), 0.5962);

// §2.3 ink contrast, each at its worst extreme
check('deep/ink-light 18.33', contrast(token('deep'), token('ink-light')), 18.33, 0.05);
check('card/ink-light 16.62', contrast(token('card'), token('ink-light')), 16.62, 0.05);
check('water-top/ink-light 5.52', contrast(token('water-top'), token('ink-light')), 5.52, 0.05);
check('water-bot/ink-light 11.62', contrast(token('water-bot'), token('ink-light')), 11.62, 0.05);
check('note/ink-dark 11.84', contrast(token('note'), token('ink-dark')), 11.84, 0.05);

// §2.4/§2.5 card-state bindings present as rgb channels
const blue = token('glow-blue').split(/\s+/).map(Number);
const green = token('glow-green').split(/\s+/).map(Number);
if (blue.join(',') !== '105,142,191') { failures++; console.log('FAIL --glow-blue is not #698ebf channels'); }
else console.log('PASS --glow-blue = #698ebf (105 142 191)');
if (green.join(',') !== '185,210,178') { failures++; console.log('FAIL --glow-green is not Idea #b9d2b2 channels'); }
else console.log('PASS --glow-green = Idea --note #b9d2b2 (185 210 178)');

// one file: no external CSS/JS service worker
if (html.includes('serviceWorker') || html.includes('sw.js')) { failures++; console.log('FAIL: service worker present'); }
else console.log('PASS: no service worker (B13)');
if (/<link[^>]+rel=["']stylesheet/.test(html) || /<script[^>]+src=/.test(html)) { failures++; console.log('FAIL: external css/js file'); }
else console.log('PASS: single file, inline css/js (B12)');

console.log(failures === 0 ? '\nTOKENS PASS' : `\nTOKENS FAIL: ${failures}`);
process.exit(failures === 0 ? 0 : 1);
