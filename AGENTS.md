# AGENTS.md

Guidance for any AI coding agent working in this repository (Hermes, Claude
Code, Codex, Cursor, …). Humans should read [README.md](README.md) and the
governing records instead.

## What this is

The-Portfolio — Robert A. Gregory's portfolio site and the central hub for his
scattered pseudonyms and websites. It is built **literally on TheBoards as the
template** (owner ruling, 2026-09-29): a landing page, `index.html`, and
three static sub-pages — `career.html` (B47), `plantsandrocks.html` (B48) and
the `monstera-storybook.html` document it frames (B57) — each with its CSS
inline and its JS in external .js files (issue #151, B59). **No calendar
rail**, no service worker, no backend, no build step, no package manager, no
dependencies.

The site is a **functional advertisement for TheBoards**: it wears TheBoards'
own design system (same tokens, same regions, same fonts) and behaves as a
static, non-persistent version of it. Six door-cards sit in the free board
space and are real links that open in a new tab. Notes remain draggable and
resizable — **entertainment only, not functional purpose**: nothing is
persisted, nothing is computed, the page holds no state.

Keep it that way. The site refuses: accounts, sync, sharing, tags, folders,
search, filters, rich text, images, snapping, reminders, a theme switch,
**and additionally** a blog/CMS, analytics, comments, and a newsletter signup
(owner ruling). Each refusal is argued in `docs/PRD.md`'s out-of-scope table.

## Read before you change anything

Three documents under `docs/` outrank code comments **and this file**:

| File | Answers | Wins on | Cited as |
|---|---|---|---|
| `docs/PRD.md` | what the site is, who it is for, why | product intent | `PRD §x` |
| `docs/UIUX.md` | what it renders, and in what values | **rendering** | `UIUX §x` |
| `docs/DECISIONS.md` | every owner ruling, in order | the later ruling wins | `B ` |

**Grep `DECISIONS.md` first.** A prior ruling may already answer your
question — often to forbid exactly what you are about to do. A PR that changes
gesture, layout, card, region, or link behavior without a `B ` entry will be
asked to add one.

**Cite with the document prefix** (`UIUX §3`, not bare `§3`) — the numbering
spaces overlap between records.

**Quote TheBoards' numbers; never cite them bare.** TheBoards' record uses
the same `B` prefix and the same `UIUX §` numbering as this one. A bare
`B91` or `UIUX §4.6` in this repository means *this* repository's ruling or
heading — and when that number does not exist yet, it will the day the
ledger reaches it, and silently point at the wrong ruling. Write TheBoards'
numbers in a code span with the owner named: TheBoards' `B91`, TheBoards'
`UIUX §4.6`.

`UIUX.md` is the rendering authority: every hex, contrast ratio, size, radius,
duration, threshold, and state lives there and nowhere else. **Do not invent
design values. The owner rules what is not already ruled.** A diff hunk that
introduces a token, hex, ratio, px, ms, or state absent from `UIUX.md` is a
QA FAIL — delete it and ask, or add the ruling with the owner's source.

## Commands

Serve and open:
```
python3 -m http.server 8000   # then visit http://localhost:8000
```

Run the regression suite (dev-only; same black-box Playwright style as
TheBoards; whole files only, each is one linear scenario). These are exactly
the suites `.github/workflows/ci.yml` runs, in CI's order:
```
npm install playwright        # onto NODE_PATH; not committed, no package.json
node test/tokens.js           # design contract: UIUX §2 recomputed from shipped hexes (no browser)
node test/security.js         # _headers CSP, zero on*= handlers, zero eval in shipped JS (no browser)
node test/records.js          # DECISIONS.md B<n> numbering: no duplicate, ascending (no browser)
node test/docket.js           # the docket's witness: every cite resolves, UIUX token/contrast rows match the CSS, no ledger entry edited (no browser)
node test/career.js           # the career page (issue #133/B47): employer selector, glow, split, three-section lot
node test/desktop.js          # desktop grammar: full-viewport sheet, no rail, card link semantics, PDF-free (no export here)
node test/mobile.js           # touch + band/lot geometry + card states at mobile widths
node test/movable_resizable.js  # note drag/resize behavior
node test/plantsandrocks.js   # the plants-and-rocks page
node test/proof.js            # captures desktop + mobile screenshots for visual review
node test/scaling.js          # issue #121/B44: the board scales to ANY viewport — no overlaps, no obscured links (B44's own suite; one owner-ruled exception, B78); since B46 also pins the band/title-card/lot laws
```
The former cross-repo `test/parity_boards.js` (issue #128/B46) was removed; its
geometry pins live in `test/scaling.js` (B89, issue #221).

There is **no `test/sw-update.js`** — the site ships **no service worker**
(owner ruling, `DECISIONS.md` B13), and that suite's entire subject (the SW
`CACHE` string) does not exist here. Do not add it. Do not add a service
worker.

Env overrides (read by the tests): `PORTFOLIO_BASE_URL` (default
`http://localhost:8000/`; each suite appends its own page),
`PORTFOLIO_OUT` (screenshot directory for `mobile.js`, `desktop.js`,
`movable_resizable.js`), `PROOF_DIR` (output directory for `proof.js`,
default `/tmp/portfolio-proof`). There is no lint/build/typecheck command — the project has
none.

## Architecture: facts that explain most of `index.html`

1. **One page.** The CSS is inline in `index.html`; the JS ships as
   external .js files (`app.js`, and `monstera-storybook.js` beside its
   page) per the issue-#151 owner ruling (B59), which supersedes the old
   "all JS inline, truly one file" clause of B12. Do not split it further
   into a module tree — additional shipped JS files are a FAIL without an
   owner ruling. The typeface (Montserrat Alternates, self-hosted,
   no CDN) may be embedded in the CSS as a data URI if the build requires it
   to stay single-file; that is the Earp-Street-Park precedent, not a new
   dependency.
2. **No persistence, no state.** The page renders its content as literals in
   the HTML. Note drag/resize is visual entertainment only: positions are not
   stored, nothing survives reload, there is no undo, no import/export, no
   "New Boards". Do not add storage, routing, or a data model.
3. **Door-cards are anchors, not buttons with scripts.** The six cards
   (Community, Professional, Writing, Software & AI, Plants & Rocks, Music)
   are real `<a>` elements with `target="_blank"` and
   `rel="noopener noreferrer"`, styled by the card component (`UIUX §4`).
   They live **in the free board space** — never inside the Components,
   Requirements, or Parking Lot regions (owner ruling, `DECISIONS.md` B2).
4. **The contact form is the one network call.** The Parking Lot holds a
   Formspree form: Name (optional), Email (optional), Message (required).
   Form protections and referrer requirements are specified in UIUX §6.1.
5. **One scene.** The site wears exactly ONE binding of TheBoards' design
   ladder: the To-Do blue (`UIUX §2.1`, owner ruling `DECISIONS.md` B1). The
   ladder does not rotate — a portfolio is not five board types.

## The Docket

This repository runs the Docket plugin (AlastairZeved/The-Docket), enabled
for every session by `.claude/settings.json`. It enforces the records above;
it adds no law of its own.

- **Before an edit** it prints the rulings cited near the lines you are about
  to change. Name the one you rely on.
- **When you stop** a judge reads your diff against `DECISIONS.md` and
  `UIUX.md` and can block the stop with the ruling, the line and the way
  out. Fix the code, or get the owner's ruling — never argue past it.
- **`test/docket.js`** is the Docket's checker, vendored; CI runs it.
  Never edit it by hand — re-vendor it from The-Docket (`docket vendor .`).
- **`/rule`** drafts a ruling and waits for the owner's `confirm`. The
  record law below still applies on top of it: the entry carries a
  `Source:` line quoting the owner verbatim.

## Shipping discipline

- Docs-only changes deliberately do not redeploy.
- Any `index.html` change resolves against the governing records first: state
  the `UIUX §x` / `B ` citation(s) the change implements in the PR body.
- A behavior change ships with its ruling: a new `B ` entry in
  `DECISIONS.md` (append-only — supersede, never edit away), plus the
  `UIUX.md`/`PRD.md` section edits it names, in the same PR.
- No service worker, so there is no `CACHE` bump. Do not invent one.

## Commits and PRs

- Subject: short, imperative, the outcome, with driving issue refs —
  `Make the Community card open Earp Street Park in a new tab (issue #24)`.
- All suites pass. A change that pins what a suite asserts rewrites that
  assertion deliberately — say so in the commit message.
- Work generally traces to a GitHub issue; check for one before assuming a
  change is unscoped.
- Security issues → GitHub Security Advisory, never a public issue.

## Never do (product law)

No accounts, sync, sharing, tags, folders, search, filters, rich text,
images, snapping, reminders, due dates, streaks, infinite canvas, settings,
theme switch, calendar rail, blog/CMS, analytics, comments, newsletter
signup, service worker, PWA manifest, backend, bundler, framework, or
`package.json`. Static pages (the landing page and the sub-pages B47, B48
and B57 rule in) with one Formspree form — nothing else. If a request collides with this list, the answer is a PRD amendment
and an owner ruling first, not code.

## Never do (record law — issue #51)

`docs/DECISIONS.md` is law, and law is stated by the owner, never authored by
an agent. Agents transcribe owner decisions; they do not make them. Every
entry in DECISIONS.md must carry a `Source:` line quoting the owner's
statement verbatim (issue, PR comment, or chat quote the owner confirmed)
with a link to it. An entry without a source line is not law — it is an agent
invention and any QA pass may delete it on sight. Agents never author, amend,
or supersede rulings except to transcribe an owner statement.
