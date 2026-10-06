# The Portfolio of Robert Alastair Zeved Gregory

The central hub for Robert A. Gregory's scattered pseudonyms and websites —
one page, built literally on TheBoards as the template. A static, single-file
HTML page that wears TheBoards' own design system and is itself a functional
advertisement for it: six door-cards in the free board space, each a real
link opening in a new tab, and a contact form in the Parking Lot.

## Records

Agents: read [AGENTS.md](AGENTS.md) first. The three governing records
outrank code comments:

| File | Answers | Wins on | Cited as |
|---|---|---|---|
| [docs/PRD.md](docs/PRD.md) | what the site is, who for, why | product intent | `PRD §x` |
| [docs/UIUX.md](docs/UIUX.md) | what it renders, and in what values | **rendering** | `UIUX §x` |
| [docs/DECISIONS.md](docs/DECISIONS.md) | every owner ruling, in order | the later ruling wins | `B ` |

Grep `DECISIONS.md` first — a prior ruling has likely already answered your
question. The governing issue of record is
[#51](https://github.com/AlastairZeved/The-Portfolio/issues/51).

## The site

- **Title card:** "The Portfolio of" / "Robert Alastair Zeved Gregory" — two
  lines (B17, superseding B5), the same title card as TheBoards, never a link.
- **Six doors**, all new tab:
  | Card | Dest |
  |---|---|
  | Community | earp-street-park.netlify.app |
  | Professional | razgregory.com/career — the employer-selector career page (B47) |
  | Writing | substack.com/@theaboveaveragerob |
  | Software & AI | alastairzeved.com |
  | Plants & Rocks | razgregory.com/plantsandrocks (stub) |
  | Music | open.spotify.com/artist/5R4lXpHs3OObGTFxdltrxZ |
- **Parking Lot:** Formspree contact form — Name (optional), Email
  (optional), Message (required).
- **One binding:** the To-Do blue of TheBoards' design ladder. No calendar
  rail, no All Boards rail, no hero, no service worker. The sheet fills the
  whole viewport (#71, B27) and renders through **one render scale** (B30,
  issue #87): on narrow viewports the whole scene shrinks as one, so the
  door-cards never clip and nothing overflows the one viewport.

## How to use

Open `index.html` in a browser, or:

```
python3 -m http.server 8000   # then visit http://localhost:8000
```

It is a static page. There is no backend, no build, no package manager, no
state — notes drag and resize for delight, nothing persists.

## Tests

```
npm install playwright   # onto NODE_PATH; not committed
node test/tokens.js      # design contract: UIUX §2 recomputed from shipped hexes
node test/mobile.js      # touch + band/lot geometry + card states at mobile widths
node test/desktop.js     # desktop grammar: full-viewport sheet, no rail, card link semantics
node test/career.js      # the career page (issue #133/B47): employer selector, glow, split, three-section lot
```

There is deliberately no `test/sw-update.js` — the site ships no service
worker (B13).

## Contributing

Questions and proposals go to the GitHub issues — that is where design
questions are settled: a ruling made on an issue describes itself in the
issue thread and lands in `docs/DECISIONS.md` with a `Source:` line.

Pull requests are accepted. Requirements:

- **Behavior changes resolve against the governing records.** A PR that
  changes card, layout, region, form, or link behavior without a `B ` entry
  will be asked to add one.
- **All three test suites must pass**, and a change that pins what a suite
  asserts rewrites that assertion deliberately — say so in the commit
  message.
- **No invented design values.** A diff hunk introducing a token, hex, ratio,
  px, ms, or state absent from `UIUX.md` is a FAIL.

## Deployment

Netlify production = the `deploy` branch (B16); `main` publishes by
deliberate promotion to `deploy`. Docs-only changes do not redeploy.

## License

© Robert A. Gregory. The name of the site, the design (derived from Zeved
Boards), and the governing records remain the work of their author.
