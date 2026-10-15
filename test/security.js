/* test/security.js — the shipped security contract, falsifiable (issue #222).
 *
 * The CSP ships as real HTTP headers from `_headers` (Netlify), per the
 * issue-#151 owner ruling (B59). AGENTS.md forbids inline scripts, on*=
 * handlers, and eval. Nothing else in CI reads `_headers`, so a loosened
 * directive or a reintroduced handler would pass CI green. This suite makes
 * those rules fail the build.
 *
 * Node-only, no browser, no dependencies — same shape as test/records.js
 * and test/tokens.js.
 *
 * Run: node test/security.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

let pass = 0, fail = 0;
const ok = (n, c, extra) => {
  c ? (pass++, console.log('  PASS ' + n))
    : (fail++, console.log('  FAIL ' + n + (extra ? ' :: ' + extra : '')));
};
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');


// [1] _headers — the CSP delivered by Netlify.
console.log('\n[1] _headers — the CSP delivered by Netlify');
const headers = read('_headers');
// Blocks: a path line at column 0, then indented header lines beneath it.
const blocks = {};
let current = null;
for (const raw of headers.split('\n')) {
  const line = raw.replace(/\s+$/, '');
  if (!line || line.startsWith('#')) continue;
  if (!/^\s/.test(line)) { current = line.trim(); blocks[current] = []; }
  else if (current) blocks[current].push(line.trim());
}
const rootHeaders = blocks['/*'] || [];
const rootCsp = (rootHeaders.find(h => /^Content-Security-Policy:/i.test(h)) || '').replace(/^Content-Security-Policy:\s*/i, '');
ok('the root block "/*" declares a Content-Security-Policy', rootCsp !== '');
const expected = [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "form-action https://formspree.io",
  "base-uri 'none'",
  "frame-src 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
];
const actual = rootCsp.split(';').map(s => s.trim()).filter(Boolean);
for (const d of expected) ok(`root CSP declares ${d}`, actual.includes(d));
// Exact set: any unlisted directive (e.g. connect-src *) is a loosening.
ok('root CSP has exactly the ruled directives and nothing else',
  actual.length === expected.length && actual.every(d => expected.includes(d)),
  'extra/missing: ' + actual.filter(d => !expected.includes(d)).concat(expected.filter(d => !actual.includes(d))).join(' | '));
ok("no wildcard source (*) anywhere in the CSP", !/(^|\s)\*(\s|;|$)/.test(rootCsp));
ok("no CSP in any block loosens script-src with 'unsafe-inline' or 'unsafe-eval'",
  !/script-src[^;]*'unsafe-(inline|eval)'/.test(headers));
ok('no Referrer-Policy header is set (AGENTS.md: Formspree needs the referrer)',
  !/^\s*Referrer-Policy:/mi.test(headers));
const sbCsp = ((blocks['/monstera-storybook.html'] || []).find(h => /^Content-Security-Policy:/i.test(h)) || '');
ok("the storybook block allows same-origin framing (frame-ancestors 'self', B57)",
  /frame-ancestors 'self'(;|$)/.test(sbCsp));
ok("the storybook block allows its blob worker (worker-src 'self' blob:', B57)",
  /worker-src 'self' blob:(;|$)/.test(sbCsp));

// Every shipped page and script, discovered from the repo root (not a hardcoded list).
const SHIPPED_HTML = fs.readdirSync(ROOT).filter(f => f.endsWith('.html')).sort();
const SHIPPED_JS = fs.readdirSync(ROOT).filter(f => f.endsWith('.js')).sort();

// [2] Markup — the policy is satisfiable by the shipped HTML.
console.log('\n[2] Shipped HTML — the markup honours the policy');
const inlineScripts = [], handlers = [];
// A tag: '<name' then attributes, where quoted values may contain '>' or '/'.
const TAG = /<[a-zA-Z][^\s/>]*(?:[\s/]+(?:[^>"'\s]|"[^"]*"|'[^']*')*)?>/g;
for (const f of SHIPPED_HTML) {
  const html = read(f);
  for (const m of html.matchAll(/<script\b[^>]*>/gi)) {
    if (!/\bsrc\s*=/i.test(m[0])) inlineScripts.push(`${f}: ${m[0]}`);
  }
  for (const m of html.matchAll(TAG)) {
    // Strip quoted values so an on*= inside a value is not counted as an attribute.
    const attrs = m[0].replace(/"[^"]*"|'[^']*'/g, '""');
    const h = attrs.match(/[\s/"'](on[a-z]+)\s*=/i);
    if (h) handlers.push(`${f}: ${h[1]}=`);
  }
}
ok('zero inline <script> blocks in shipped HTML', inlineScripts.length === 0, inlineScripts.join(' | '));
ok('zero on*= event-handler attributes in shipped HTML', handlers.length === 0, handlers.join(' | '));

// [3] Shipped JS — no eval surface.
console.log('\n[3] Shipped JS — no eval surface');
const offenders = [];
for (const file of SHIPPED_JS) {
  const raw = read(file);
  // String-form timers are checked on the raw source.
  for (const m of raw.matchAll(/\b(setTimeout|setInterval)\s*\(\s*["'`]/g)) offenders.push(`${file}: ${m[0]}`);
  // Remove string literals, then comments, so text like "//" inside a string cannot hide code.
  const code = raw
    .replace(/"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`/g, '""')
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:\\])\/\/[^\n]*/gm, '$1');
  // Any identifier named eval or Function used as a call, aliased or not.
  for (const m of code.matchAll(/\beval\b|\bFunction\s*\(/g)) offenders.push(`${file}: ${m[0]}`);
}
ok('no eval, Function(), or string-form timers in shipped JS (root-level, discovered)', offenders.length === 0, offenders.join(' | '));

// [4] Every script the HTML loads is a shipped, same-origin file.
console.log('\n[4] Script sources — external and same-origin');
for (const f of SHIPPED_HTML) {
  const srcs = [...read(f).matchAll(/<script\b[^>]*\bsrc="([^"]+)"/gi)].map(m => m[1]);
  for (const src of srcs) {
    ok(`${f} loads ${src} as a same-origin file`,
      !/^(https?:)?\/\//.test(src) && !src.startsWith('data:') && fs.existsSync(path.join(ROOT, src)));
  }
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
