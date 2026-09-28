# Issue 0001 — Board engine: fixed-scale board, four token ladders, shared chrome

**Status:** closed
**Filed:** 2026-09-27 by Hermes (orchestrator)
**Repo:** `~/.hermes/Strombolis-Workshop/robert-gregory-portfolio-website/site` (local, no remote)
**Read-only source material (already committed, do not modify):** `assets/`, `UIUX.md`
**Authority:** `UIUX.md` is the rendering authority. Cite sections by number. A hex
value printed in §2.2.2 is copied, never sampled from a PNG.

---

## 1. Scope

Build the shared board engine. Every later card imports this; **none of them
redefine any of it.** Deliver:

- Four token ladders as CSS custom properties, from §2.2.2 (table below).
- The note component per §4.
- Scale-to-fit per §3 + §11.
- The SVG connector layer per §4.6.
- The band + header tab (§3.1), sidebar, Parking Lot (§3.2).
- Hover glow (owner ruling 2).
- One runnable self-check that asserts the data counts.

**Write boundary:** this repo only. Do not write anywhere else on disk. Do not
modify `assets/` or `UIUX.md`. Do not create additional boards, do not build
pages 2–5, do not add routing.

## 2. Token ladders — §2.2.2, luminance held constant across all four

| Group | `--deep` | `--card` | `--frame` | `--note` |
|---|---|---|---|---|
| TODO | `#020812` | `#08152c` | `#698ebf` | `#a0d4da` |
| IDEA | `#000a06` | `#001a0e` | `#52997f` | `#b9d2b2` |
| NOTE | `#0c0512` | `#1e0f28` | `#9d80b9` | `#cec6ed` |
| LEARNING | `#11040b` | `#260e12` | `#b57a9b` | `#e6c2c9` |

Water gradient per ladder (§2.8), `waterTop` / `waterMid` / `waterBot`:
- TODO `#34697f` / `#255265` / `#163646`
- IDEA `#486b49` / `#345439` / `#1f3825`
- NOTE `#6d5b83` / `#534769` / `#382e47`
- LEARNING `#855562` / `#6a414c` / `#472a35`

Fixed, does not rotate: `--chrome #020812` · `--ink-dark #031019` ·
`--ink-light #f4f5f1` · `--accent-page #6d9cb0` · `--accent-restore #b6dee2` ·
`--accent-copy #698ebf` · `--danger #e2a08c` · `--highlight #f2d64b`
(B71 — highlight is fixed across ALL ladders, it does not rotate).

## 3. The scale law — READ THIS, THE HANDOFF GOT IT WRONG

**The logical sheet is NOT a fixed 900×1000.** §3 states the 900×1000 figure is
the *reference* sheet — "what band and lot proportions are derived against and
what the export draws, **distinct from the live viewport-derived dimensions**."

Live, for a fine pointer ≥1024px (§3, verbatim):

```
LOGICAL_W = (vw - 300) / renderScale
LOGICAL_H = vh / renderScale
renderScale = min(vh / 1000, (vw - 300) / 900)
offX = 300        (the rail)
floor: neither logical dimension below 900x1000
```

At the wireframes' 2560×1440 this yields `renderScale = 1.44`,
`LOGICAL_W ≈ 1569.4`, `LOGICAL_H = 1000`. Every note in the export carries
`rw = 1576.6634522661525`, `rh = 1000` — that is the board's logical canvas, so
§11's `k = min(LOGICAL_W/rw, LOGICAL_H/rh)` evaluates to **≈0.9955 at 2560×1440**
and the board fills the frame.

**The single uniform `transform: scale(k)` applies to x, y AND size, anchored
top-left, never centred (§11, ruled B64).** Slack falls right and bottom as open
canvas. §3: the board **never pans and never zooms.** Do not add pan, zoom,
pinch, or a viewport resize listener that re-lays-out anything — the same `k`
handles it. Connector lines ride the same transform, so they cannot detach.

If you implement a fixed 900×1000 sheet, `k = 0.57` and the whole composition
shrinks into a corner. That is the defect this section exists to prevent.

## 4. The note — §4

`width: max-content` · `min-width: NOTE_MIN_W (132)` · wrap-capped at the sheet's
right edge · `font-size: 17px` · `line-height: 1.4` · `padding: 10px 12px` ·
`border: 2px solid` · `border-radius: 3px` · `text-align: center` ·
`transform-origin: top left` · **no shadow** · `white-space: pre-wrap`
(§4: measured sans trailing spaces, because pre-wrap hangs them).

`rw`/`rh` in the export are the **board canvas**, not per-card size. Card size is
derived at render time and is not in the export. The sizing rule is written down
above — do not measure pixels off a PNG.

Note states:
- `state: "complete"` → scratch-out, **struck, not hidden** (§4.3).
- `highlighted: true` → `--highlight` fill.
- `title` → the small label tag above the card.

## 5. Fonts — self-hosted, already committed

`assets/fonts/MontserratAlternates-{400,600,800}.woff2`. §13.1: **no CDN**,
offline-first is product law. Declare all three via `@font-face`.

**There is no monospace face in this build (owner ruling, 2026-09-27).** Five
notes on the AI-inference board contain ASCII column art that reads ragged in a
proportional face. That is correct and intended. Render them in Montserrat
Alternates like every other note. Do **not** introduce a monospace stack, do not
add a webfont, do not "fix" the column alignment. It is not a bug.

## 6. Chrome to BUILD

- Sidebar, with the four group labels **To Do / Notes / Learning / Ideas** (§13.1
  B78), each group filled with its own ladder.
- The band and the header tab (§3.1): the tab hangs **below** the rule at
  `top: 100%`, `width: max-content`, `padding: 2px 6px`,
  `border-radius: 0 0 3px 3px`, fills `--frame`, ink rebinds to `--ink-dark` via
  `.on-light` at **5.70:1**, at 13px/600, centred in its zone, rules run full
  width.
- Parking Lot as a **section**, not a box (§3.2).
- The SVG connector layer (§4.6): 1px `--frame`,
  `vector-effect: non-scaling-stroke`, `pointer-events: none`, `z-index: 1`
  beneath notes at `z-index: 2`, endpoints at plain note centres.

## 7. Chrome to STRIP — owner ruling 1, "not editable"

This is a read-only portfolio. The following appear in the reference PNGs and
must NOT be built: the note action toolbar (§4.5 — Complete/Restore, Highlight,
Copy, Delete), trash-can icons on cards, the `reminder: true` clock icon,
"New board", Export, Import, Collapse, and all drag/resize affordances.
Keyboard edit bindings (§12) are equally out of scope.

**Also strip, owner ruling 2026-09-27:** the vertical `CALENDAR BOARD · 5A 2026`
strip on the right edge, and all OS window furniture (title bar, system tray,
taskbar). All app chrome.

## 8. Hover glow — owner ruling 2, "a hover glow for visual status of
clickability"

A glow in the rung's own `--frame` hue, as a `box-shadow`. **The exact spread
and blur values are the implementer's to choose.** Two constraints, both from
§12, which is non-negotiable:

- "Never colour alone" (§1) — the glow must also read as a **shape/edge**
  change, not only a hue shift, so it survives a greyscale check and any colour
  vision. A visible ring is the easy way to get this.
- Target is **WCAG 2.2 AA**. The glow is a NEW element and carries this
  automatically — measure it, do not assert it.

State the chosen values and the reason in your completion metadata so QA can
judge them.

## 9. Self-check — MUST ship, and MUST machine-test

Parse `assets/content-of-boards.json` and assert, for **every** board (not a
sample):

| Assertion | Expected |
|---|---|
| total notes | **74** |
| total links | **44** |
| total parking-lot entries | **4** |
| orphan links (endpoint id not a note or lot entry on that board) | **0** |

These four numbers are verified against the file at
`sha256 506cbc1431e2fbce…` and are the contract.

Leave ONE runnable check behind — an assert-based `selfcheck()` or one small
`test_*.py` — that fails loudly if the logic breaks. No framework, no fixtures.

Declare in completion metadata anything you did **not** machine-test. A claim
you did not test is a defect in the report, not a caveat.

## 10. Acceptance

- [ ] Four ladders present, hex values byte-identical to §2.2.2 above.
- [ ] `k` derived from the live viewport per §3 — at 2560×1440, `k ≈ 0.9955`
      and the board fills the frame. Print the computed `k` in your report.
- [ ] Every note renders with `white-space: pre-wrap`; no monospace anywhere.
- [ ] Connectors ride the transform; `non-scaling-stroke` set.
- [ ] Strip-list of §7 absent from the DOM — assert it, do not eyeball it.
- [ ] Self-check green: 74 / 44 / 4 / 0.
- [ ] `completion_contract: local-only`. **NOTHING DEPLOYED. No domain, no
      remote, no push to any live host.**
- [ ] Kill any server you spawn before completing.

## 11. References

- `UIUX.md` §2.2.2 tokens · §2.8 water · §3 geometry · §3.1 band/tab ·
  §3.2 parking lot · §4 note · §4.3 complete · §4.6 connectors · §11 scale to
  fit · §12 accessibility · §13.1 fonts and group names.
- Wireframes (2560×1440): `../Portfolio-wireframes/*.png`. **Calibration of one
  dimension is never a style spec** — use them to check proportion and
  placement, never to sample a colour or measure a note.

---

## CLOSED — 2026-09-28, merge gate (Cleaner card t_d4bed8a7)

**Audit trail — both verdicts recorded:**

1. **QA FAIL** (card t_9c51430c) against `7e84a78`, the first implementation
   committed directly to `master` instead of a feature branch — no branch
   existed to merge. Three measured defects:
   - board painted ~69% of frame width, ~691px dead space right / ~445px bottom
     (composite scale missing from `fit()`);
   - note frame border contrast 1.48:1, below the §3.1-style 3:1 floor
     (border ink not rebound to `--ink-dark`);
   - scratch-out coverage 34.6% of the note box, below the ≥90% floor of §4.3.
2. **Fix** on feature branch `fix-0001-render-and-contrast`
   (`b1a0cd8` composite paint scale `paintScale = k × renderScale` +
   `data-paint-scale`; note frame ink rebind to `var(--ink-dark)`; strike
   cross-hatch widened to three unioned families; self-check extended with the
   three new machine-tested numbers). Follow-up `da8bf5f` renamed the composite
   to `paintScale`/`data-paint-scale` and documented strike measurement.
3. **Re-QA PASS** (card t_1e0f86b4), measured in a fresh headless Chromium at
   2560×1440: painted board 2259.99×1433.41 in a 2260×1440 stage, 100.0% width
   fill, 0.01px right / 6.59px bottom dead space, single uniform top-left
   transform, no pan/zoom; note frame 11.835–12.214:1 by decoded pixels across
   all four ladders (floor 3:1), note text undisturbed at 11.84:1; interior
   strike coverage 94.98% against the 90% floor. Standing note: §4.3 rests on
   one complete note in the export — the smallest — so coverage is a single
   data point at the least favourable size.
4. **Merge** — `3361c72` merges `fix-0001-render-and-contrast` into `master`
   (local-only, `git remote -v` empty, nothing pushed, no deploy).
5. **Post-merge self-check re-run on `master` at `3361c72`:** SELF-CHECK GREEN —
   74 notes / 44 links / 4 lot entries / 0 orphans; ladders byte-identical;
   strip-list and monospace absent; scale law holds. New numbers:
   `renderScale=1.4400`, `k=0.9954`, **composite paint scale k×renderScale =
   1.433407**, painted 2260.0×1433.4 (stage 2260×1440); **note frame
   --ink-dark on --note = 11.84:1 on all four ladders** (todo / idea / note /
   learning, floor 3:1); **strike coverage (geometric model of 3 families) =
   95.2%** (floor 90%). Exit code 0.

---

## CLOSED — 2026-09-28, full build (final gate, Cleaner card t_9e9a748e)

The engine closure above covers only the engine phase. This section records the
**complete build** — five pages, assembly, and the final gate — with every
verdict in order, both FAILs included. `master` final = `6f6ac07`.

### Audit trail, in order

| Gate | Verdict |
|---|---|
| Engine impl `t_b99fe1e4` @ `7e84a78` | **FAIL** — 3 measured defects (§ above) |
| Engine QA `t_9c51430c` | FAIL, correctly |
| Engine Cleaner `t_3fa03b8a` | gate correctly **shut**, no merge |
| Engine fix `t_09f86f42` | `b1a0cd8` + `da8bf5f` |
| Engine re-QA `t_1e0f86b4` | **PASS** — 94.98% strike coverage |
| Engine Cleaner `t_d4bed8a7` | merged `3361c72` |
| 5 page cards + landing | merged; one page lost and rebuilt (see below) |
| Assembly `t_ec4ab93a` | `039d405` |
| Final QA `t_bb976873` | **FAIL** — §4.6 endpoints off on first load |
| Fix `t_b6deb519` | `6f6ac07`, root cause in `renderLinks()` |
| re-QA `t_bec3f649` | **PASS** — 118/118 endpoints on, 0 off, max delta 0.0042 |

### The second FAIL — §4.6 font race (final QA t_bb976873, fixed in 6f6ac07)

`renderLinks()` measured note `offsetWidth` in the same synchronous pass as the
note append, reading the `font-display: swap` fallback face; the real
Montserrat Alternates then re-wrapped the notes wider and the drawn connector
endpoints stayed behind. Measured on first load: **28 of 30** endpoints off, up
to **16.25px** behind. Fix in `renderLinks()`: draw immediately, then
re-measure and redraw once `document.fonts.ready` settles — one root-cause fix
covering all six pages. After fix: **0 of 118 endpoints off**, max delta
0.0042. `test_board_selfcheck.py` now machine-asserts the guard (fonts.ready
re-measure present inside `renderLinks`, wired to the same measure-and-draw
pass) — a check that exists but is not wired to the criterion is not a gate.

### The lost page and the two orchestrator errors

The Portfolio Project Ideas page (`t_3b092945`) was destroyed mid-write when
its branch and worktree were deleted by a concurrent cleanup that the
orchestrator had authorised. Two errors, both the orchestrator's, and both are recorded here because the
build record is only useful if it names the real cause:

1. **Duplicated dispatch.** When the corrected Cleaner completed, the three
   original page cards auto-promoted. The orchestrator did not check, and
   created three *replacement* cards for pages already being built — two
   workers per page in one shared working tree, for several minutes. The
   duplicates were stopped by comment before either wrote a page file.
2. **A destructive instruction issued into a live tree.** The orchestrator told
   the stranded-page card to delete a junk branch alias as part of its merge
   step, while three workers were live in the same repository. That deletion
   removed a *live* worker's branch and worktree, and its in-progress page was
   lost — unrecoverable: no dangling commits, no stash, no surviving copy on
   disk. **The authorisation was the orchestrator's; the worker was following
   the instruction it was given.**

The root condition underneath both: `workspace_kind: dir` gives one shared
*working tree*, not one shared *repo* — git state was never isolated between
cards. The recovery was to freeze all workers, commit each page on its own
branch, and land everything in one controlled pass with the orchestrator
holding merge authority.

Rebuilt cleanly as `t_7530fde6` → commit `472ca4b` (13 notes, 10 links, 1
parking-lot entry, IDEA ladder, verified in headless Chromium at 2560×1440).
The original card was closed SUPERSEDED, not re-attempted.

### Final gate verification (this card, 2026-09-28, on `master` = `6f6ac07`)

- `python3 test_board_selfcheck.py`: **SELF-CHECK GREEN, exit 0** — 74 notes /
  44 links / 4 lot entries / 0 orphans; ladders byte-identical; strip-list and
  monospace absent; `renderScale=1.4400`, `k=0.9954`, composite paint scale
  1.433407, painted 2260.0×1433.4 (stage 2260×1440); note frame 11.84:1 on all
  four ladders; strike coverage 95.2%; §4.6 fonts.ready re-measure asserted.
- `git remote -v`: **empty**. Nothing pushed, no domain, no Netlify, no GitHub
  Pages, no deploy — owner instruction held across the entire build.
- Repo clean: no untracked files, no stray `node_modules` (gitignored, absent),
  no scratch dirs, no orphan branches (only `master`).
- Working tree on `master`, clean.

### Open owner decision (correctly unresolved — not a defect)

**The 300px rail at a 390px viewport.** §12 says the rail hides off-desktop;
this build is scoped to fine-pointer ≥1024px and touch is out by owner ruling
1. Two QA passes flagged it and both declined to rule. It is the owner's call.

### Deployment status

**Nothing is deployed. `completion_contract: local-only` held.** To preview
locally (owner runs this; the gate spawns and kills its own server):

    cd ~/.hermes/Strombolis-Workshop/robert-gregory-portfolio-website/site
    python3 -m http.server 8634 --bind 127.0.0.1

then open http://127.0.0.1:8634/. To stop: Ctrl+C, or
`pkill -f "http.server 8634"`.
