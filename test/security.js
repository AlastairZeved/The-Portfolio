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

// Every page and script the site ships. Keep in step with the Netlify deploy.
const SHIPPED_HTML = ['index.html', 'career.html', 'plantsandrocks.html', 'monstera-storybook.html'];
const SHIPPED_JS = ['app.js', 'monstera-storybook.js'];

// [1] _headers — the CSP the Netlify deploy actually sends.
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
for (const directive of [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "form-action https://formspree.io",
  "base-uri 'none'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
]) {
  ok(`root CSP declares ${directive}`, rootCsp.split(';').map(s => s.trim()).includes(directive));
}
ok("no CSP in any block loosens script-src with 'unsafe-inline' or 'unsafe-eval'",
  !/script-src[^;]*'unsafe-(inline|eval)'/.test(headers));
ok('no Referrer-Policy header is set (AGENTS.md §4: Formspree needs the referrer)',
  !/^\s*Referrer-Policy:/mi.test(headers));
const sbCsp = ((blocks['/monstera-storybook.html'] || []).find(h => /^Content-Security-Policy:/i.test(h)) || '');
ok("the storybook block allows self-framing only (frame-ancestors 'self', B57)",
  /frame-ancestors 'self'(;|$)/.test(sbCsp));

// [2] Markup — the policy is satisfiable by the shipped HTML.
console.log('\n[2] Shipped HTML — the markup honours the policy');
const inlineScripts = [], handlers = [];
for (const f of SHIPPED_HTML) {
  const html = read(f);
  for (const m of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>/gi)) inlineScripts.push(`${f}: ${m[0]}`);
  // Attribute-position handlers only: whitespace, then on<name>=, inside a tag.
  for (const m of html.matchAll(/<[^>]*\s(on[a-z]+)\s*=/gi)) handlers.push(`${f}: ${m[1]}=`);
}
ok('zero inline <script> blocks in shipped HTML', inlineScripts.length === 0, inlineScripts.join(' | '));
ok('zero on*= event-handler attributes in shipped HTML', handlers.length === 0, handlers.join(' | '));

// [3] Shipped JS — no eval surface.
console.log('\n[3] Shipped JS — no eval surface');
const offenders = [];
for (const file of SHIPPED_JS) {
  // Strip comments first: prose may name eval() without calling it.
  const text = read(file).replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/[^\n]*/gm, '$1');
  for (const m of text.matchAll(/\beval\s*\(|new\s+Function\s*\(|setTimeout\s*\(\s*["'`]|setInterval\s*\(\s*["'`]/g)) {
    offenders.push(`${file}: ${m[0]}`);
  }
}
ok('no eval(), new Function(), or string-form timers in shipped JS', offenders.length === 0, offenders.join(' | '));

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
