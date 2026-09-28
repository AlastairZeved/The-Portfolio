# The Portfolio

Robert A. Gregory's portfolio — five boards rendered from a single shared
engine, built to his own working app's written design contract.

**Status: built and verified. Not deployed. No domain chosen.**

## What this is

Five boards from the *Zeved Boards* app, rendered read-only on the web:

| Page | Board | Notes | Links | Lot |
|---|---|---|---|---|
| `index.html` | The Life of Robert Gregory (landing) | 24 | 15 | 1 |
| `todays-to-do.html` | Today's To Do | 9 | 7 | 0 |
| `portfolio-project-ideas.html` | Portfolio Project Ideas | 13 | 10 | 1 |
| `how-does-ai-inference-math-work.html` | How does AI inference math work? | 15 | 7 | 0 |
| `public-space-mini-grant.html` | Public Space Mini Grant | 13 | 5 | 2 |
| | **Total** | **74** | **44** | **4** |

`index.html` boots the landing board and swaps boards from the sidebar with a
260ms crossfade and no history push. The five static pages remain as deep links.

**Read-only.** Visitors navigate; nothing is editable. The app's editing chrome
— note toolbar, trash, clock, New board, Export/Import, Collapse, drag and
resize — is deliberately not built.

## Run it locally

No build step, no bundler, no framework, no CDN. Serve the folder:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Then open <http://127.0.0.1:8000/>. To stop: `Ctrl+C`, or
`pkill -f "http.server 8000"`.

Verify the data contract at any time:

```bash
python3 test_board_selfcheck.py     # expects 74 / 44 / 4 / 0
```

## How it's built

One engine, five thin pages.

- **`engine.css`** — the design contract as CSS. Four token ladders (TODO, IDEA,
  NOTE, LEARNING) whose hex values are byte-identical to the app's `UIUX.md`
  §2.2.2, plus the note component (§4), band and header tab (§3.1), Parking Lot
  (§3.2), connector layer (§4.6) and the hover glow.
- **`board-engine.js`** — scale-to-fit (§3 + §11), rail, and note/link/lot
  rendering. Exports a small API; the pages call it and redefine nothing.
- **`assembly.js` / `assembly.css`** — the sidebar crossfade, the deep-link rail,
  and the contact form.
- **Pages** are 82–90 lines each: they mount the engine and hand it a board.

`UIUX.md` is the rendering authority. Cite sections by number; a hex value it
prints is copied, never sampled from a screenshot.

### The scale law, stated once

§3's 900×1000 is the **reference** sheet, not the live one. The live logical
sheet is viewport-derived:

```
renderScale = min(vh/1000, (vw - 300)/900)
k           = min(LOGICAL_W/rw, LOGICAL_H/rh)      # §11 similarity transform
paintScale  = k * renderScale                       # what actually paints
```

At 2560×1440: `renderScale 1.44`, `k 0.9954`, `paintScale 1.4334`, and the board
paints 2260×1433 into a 2260×1440 stage. One uniform `transform: scale()`, anchored
top-left. The board never pans and never zooms.

### Two rulings worth knowing before editing

- **No monospace, anywhere.** Five notes on the AI-inference board are ASCII
  column art. They render in Montserrat Alternates with ragged columns, and that
  is intended — the wireframes are exact and show them that way. A monospace
  face on those five is a regression, not a fix.
- **Fonts are self-hosted** (`assets/fonts/`, three weights of Montserrat
  Alternates). No CDN: offline-first is product law.

## The contact form

The landing board's parking-lot entry is a real `<form>` posting to Formspree
(`https://formspree.io/f/mbglkalb`), delivering to robertazgregory@gmail.com.
It has a real associated `<label>` and a `name` on every field. Verified live —
HTTP 200, `{"ok":true}`.

## Verification

Every number below was measured in headless Chromium at 2560×1440, not asserted:

- 74 notes / 44 connectors / 4 parking-lot entries / 0 orphan links
- 28/28 token hex values byte-identical to §2.2.2
- `k = 0.9954213387699626`, `paintScale = 1.4334067278287461`
- note frame 11.84:1, note text 11.84:1, band tab 5.70:1, hover glow 5.95:1 (WCAG 2.2 AA)
- scratch-out coverage 94.98% of the strike's paint area
- 118/118 connector endpoints on their note centres on first load

### Known limits

- **§4.3 scratch-out coverage rests on one note** — the smallest in the export.
  A single data point at the least favourable size.
- **The rail stays 300px at a 390px viewport**, squeezing the board to ~90px.
  §12 says the rail hides off-desktop, but this build is scoped to fine-pointer
  ≥1024px and touch is out of scope. Open decision, not a defect.

## Deployment

**Not deployed. No domain chosen, and none is assumed here.** No Netlify, no
GitHub Pages, no CI. The repo is set up so a first deploy is a hosting choice
rather than a code change.

## Build record

`docs/issues/0001-board-engine.md` carries the full audit trail — every gate,
**both FAILs included**, the measured before/after for each defect, the one page
that was lost and rebuilt, and the two orchestrator errors that lost it. A build
record listing only successes misrepresents how the build went.

Source data: `assets/content-of-boards.json`, exported from the app, 5 boards /
74 notes / 44 links / 4 parking-lot entries / 0 orphans.
