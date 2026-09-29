# AGENTS.md

Guidance for any AI coding agent working in this repository (Hermes, Claude
Code, Codex, Cursor, …). Humans should read [README.md](README.md) and the
governing records instead.

## What this is

The Portfolio — Robert A. Gregory's portfolio. Five boards from the *Zeved
Boards* app, rendered **read-only** on the web from one shared engine
(`engine.css`, `board-engine.js`, `assembly.js`/`assembly.css`). Vanilla
HTML/CSS/JS: **no framework, no build step, no bundler, no CDN, no package
manager.** Keep it that way — do not introduce one unless the owner
explicitly asks.

## Read before you change anything

Three documents outrank code comments **and this file**:

| File | Answers | Wins on | Cited as |
|---|---|---|---|
| `docs/PRD.md` | what the site is, who it is for, why | product intent | `PRD §x` |
| `UIUX.md` | what it renders, and in what values | **rendering** | `UIUX §x` |
| `docs/DECISIONS.md` | every owner ruling, in order | append-only; the later ruling wins | `B<n>` |

**Grep `docs/DECISIONS.md` first.** A prior ruling has very likely already
answered your question — often to forbid exactly what you're about to do (the
band title alone has been ruled on in B6, B9, and the incidents behind them:
#28/#29, #31/#33, #37/#41). A PR that changes rendering without a `B<n>`
entry will be asked to add one.

**Cite with the document prefix** (`UIUX §3.2`, not bare `§3.2`) — the
numbering spaces overlap between records.

`UIUX.md` is the rendering authority: every hex, contrast ratio, size,
radius, duration and threshold lives there and nowhere else. It is **this
repo's own document** (B2) — derived once from TheBoards' design system,
complete, and never synced to, pinned against, or diffed with TheBoards. Its
citations of TheBoards' record (`TheBoards' DECISIONS.md B<n>`, `TheBoards'
issue #n`, `TheBoards' <path>`) are external historical provenance, not
pointers into this repo. The design system's rendered references live in this
repo at `docs/proofs/` — read the render before re-deriving the design from
prose.

## Commands

Serve and open:

```bash
python3 -m http.server 8000 --bind 127.0.0.1   # then visit http://127.0.0.1:8000/
```

Run the self-check (rendered assertions in headless Chromium; expects
`TOTALS 72 43 4 0`):

```bash
python3 test_board_selfcheck.py
python3 test_board_selfcheck.py --prove-gates   # every mutation must go RED
```

There is no lint/build/typecheck command — the project has none.

## Never do (product law)

- **No invented design.** No element, property, declaration, colour, border,
  weight, or state not named in a ruling (`B<n>`), an issue, or the reference
  implementation. The invention incidents — #35/#36, #31/#33, #28/#29,
  #17/#20, #43/#47 — are why this file exists.
- **No editing chrome, ever.** Read-only means read-only: no note toolbar,
  trash, clock, New board, Export/Import, Collapse, drag, or resize. The one
  interactive element is the parking-lot contact form — a form field, not a
  board note (B3, #9).
- **No framework, no CDN, no build step.** Fonts stay self-hosted.
- **Dark-only; four ladders only** (TODO, IDEA, NOTE, LEARNING). Calendar is
  TheBoards'-only.
- The wireframe and the reference implementation win every rendering
  question.

Each refusal is argued in `docs/PRD.md`'s out-of-scope table. If a request
collides with this list, the answer is a PRD amendment and an owner ruling
first, not code.

## Never do (record law)

`docs/DECISIONS.md` is law, and law is stated by the owner, never authored by
an agent. Agents transcribe owner decisions; they do not make them. Every
entry must carry a `Source:` line quoting the owner's statement verbatim
(issue, PR comment, or chat quote the owner confirmed) with a link to it. An
entry without a source line is not law — it is an agent invention and any QA
pass may delete it on sight (convention adopted from TheBoards, its issue
#207). Agents never author, amend, or supersede rulings except to transcribe
an owner statement.

## Commits and PRs

- Both published branches (`main`, `deploy`) are protected by the "published
  branches" ruleset: a change reaches them only through a pull request from a
  side branch. Publishing is a `main` → `deploy` PR merged on purpose.
- Subject: short, imperative, the outcome, with driving issue refs.
- A design change ships with its ruling: a new `B<n>` entry in
  `docs/DECISIONS.md` (append-only — supersede, never edit away), plus the
  `UIUX.md`/`PRD.md` section edits it names, in the same PR.
- Reference the driving issue with `Refs #n` — never `closes`/`fixes`/
  `resolves`: closing the issue is the owner's call.
- `python3 test_board_selfcheck.py` passes. A change that pins what a gate
  asserts rewrites that assertion deliberately — say so in the commit
  message.
- Security issues → GitHub Security Advisory, never a public issue.
