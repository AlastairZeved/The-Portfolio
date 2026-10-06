/* The ruling file's numbering contract, falsifiable (AGENTS.md, record law —
 * B11, governing issue #51; ported to this repo per issue #149 from
 * AlastairZeved/TheBoards' test/records.js, the owner-designated reference):
 * `docs/DECISIONS.md` is append-only and its `### B<n>` headings are the
 * citation space every other document cites by number. A duplicate number or
 * an out-of-order append sends every reader of the second entry to the first,
 * so it fails the build.
 *
 * Node-only, no browser, no dependencies — same shape as test/tokens.js.
 *
 * Run: node test/records.js
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

const RECORD = 'docs/DECISIONS.md';
let text = '';
try { text = fs.readFileSync(path.join(ROOT, RECORD), 'utf8'); } catch (e) { /* asserted below */ }


console.log(`\n[0] ${RECORD} exists and is readable`);
ok('the record file exists', text !== '', 'could not read ' + RECORD);

// The heading space: `### B<n>.` at column 0. The number is the citation.
// SUPERSEDED headings (e.g. "### B5. The title card (SUPERSEDED by B17)")
// are still `### B<n>` headings and still count — append-only means they stay.
const headings = [...text.matchAll(/^### B(\d+)\./gm)].map(m => Number(m[1]));

console.log(`\n[1] ${RECORD} — ${headings.length} headings, one number each`);
{
  const seen = new Map();
  const dupes = [];
  for (const n of headings) {
    if (seen.has(n)) dupes.push('B' + n);
    seen.set(n, true);
  }
  ok('no `### B<n>` number is used twice', dupes.length === 0, dupes.join(', '));
}

console.log('\n[2] The headings ascend — the file is append-only, so the number only grows');
{
  const breaks = headings
    .map((n, i) => (i && n <= headings[i - 1] ? `B${headings[i - 1]} → B${n}` : null))
    .filter(Boolean);
  ok('the headings are numerically ascending', breaks.length === 0, breaks.join(', '));
}

console.log(`\n=== records: ${pass} passed, ${fail} failed ===`);
process.exit(fail ? 1 : 0);