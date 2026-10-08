# UIUX.md — The-Portfolio

**Status:** v1, written from the owner's rulings of 2026-09-29 (governing
issue: [The-Portfolio #51](https://github.com/AlastairZeved/The-Portfolio/issues/51)).
This is the **rendering authority** — the document `index.html` and every
review resolves rendering against. `PRD.md` says what the site *is*; this
says what it *looks like* and how it behaves under the hand and the cursor.
Where the two disagree about a rendering decision, **this document wins**.

**Scope and provenance.** This document carries the design system of
TheBoards in full for the surfaces this site draws, quoted as values here —
it is self-contained by design, never a pinned fork of TheBoards' records,
never synced from them, never stale alongside them (owner's derived-document
ruling). External citations to TheBoards' own record (`TheBoards'
DECISIONS.md B58`, etc.) are historical provenance only, not load-bearing:
every value this page needs is printed below. A diff that changes a hex,
ratio, px, ms, or state without an owner ruling is a FAIL.

---

## §1 Governing law

> **If you have to think about the interface, it failed.
> Every pixel earns its place.**

And its corollary:

> **Identity comes from structure — frame, surface tone — never costume.**

Two consequences hold throughout, without exception:

- **Never colour alone.** Every state distinguished by colour is also
  distinguished by geometry, position or texture. The click is a 1px inset
  (geometry) *and* a glow shift (colour). Focus is a ring, not a tint.
- **Elevation means "temporary, above the page."** Shadow is reserved for
  transient interaction states — hover glow, pressed inset. **Resting cards
  carry no shadow.** They are *on* the page, not floating over it.

### §1.1 The register

TheBoards' register, carried whole: **peaceful fondness — calm water at
depth and at dusk.** Dark palette, deliberately. The page reads top to bottom
as one scene — water closing each end of the sheet, the deep between — and
the door-cards are the lit things on the deep. This does not license
decoration.

---

## §2 Design tokens

### §2.1 One binding

TheBoards rotates its ladder by board type; **this site wears exactly one
binding: the To-Do blue** (owner ruling, `DECISIONS.md` B1 — a portfolio is
one scene, not five board types). The ladder does not rotate here. Values
below are the To-Do ladder's, quoted as shipped in TheBoards
(`TheBoards' UIUX.md §2.2`), re-verified at the rung's relative luminance.

### §2.2 The surface ladder

| Token | Value | What it is | Rel. luminance |
|---|---|---|---|
| `--deep` | `#020812` | the canvas — the deepest surface on the page | 0.0023 |
| `--chrome` | `#020812` | the room behind the page — the board's ground and any summoned surface | 0.0023 |
| `--card` | `#08152c` | the title compartment, sitting just above the deep | 0.0077 |
| `--water` | `#34697f` → `#255265` → `#163646` | the water, as a field — closing both ends of the sheet | 0.1237 … 0.0325 |
| `--frame` | `#698ebf` | the card's border and both full-width rules | 0.2611 |
| `--note` | `#a0d4da` | the door-card — the lit thing on the deep | 0.5962 |
| `--danger` | `#E2A08C` | the single warm hue, carried from TheBoards; no destructive action is drawn in v1 | 0.4000 (approx.) |

### §2.3 Ink

| Token | Value | Bound on |
|---|---|---|
| `--ink-light` | `#f4f5f1` | `--deep`, `--card`, `--water`, `--chrome` |
| `--ink-dark` | `#031019` | `--note` |

Verified contrast, each at the worst extreme of its range:

| Ground | Ink | Ratio | Level |
|---|---|---|---|
| `--deep` `#020812` | light | **18.33:1** | AAA |
| `--card` `#08152c` | light | **16.62:1** | AAA |
| `--water`, lightest stop `#34697f` | light | **5.52:1** | AA |
| `--water`, darkest stop `#163646` | light | **11.62:1** | AAA |
| `--note` `#a0d4da` | dark | **11.84:1** | AAA |

**The crossover and the forbidden band carry from TheBoards, verbatim:**

> Below `L = 0.1788` a ground takes `--ink-light`; above it, `--ink-dark`.
> **No text-bearing surface may have a relative luminance between 0.163 and
> 0.196** — there is no ink in the palette that works there.

### §2.4 Accents (blue family)

The hover glow is drawn with an **existing** blue token — no new token, no
new colour (owner ruling, `DECISIONS.md` B14). The binding is **hover glow =
`--accent-page` `#6d9cb0`** — the water's hue and the brighter of the two
existing blues (0.3016 against `--frame`'s 0.2611; 6.72:1 against 5.95:1 on
`--chrome`) — settled by the owner's issue #67 (`DECISIONS.md` B25). The same
blue is the binding the governing issue names as the hover alternative. The v1
member, `--frame` `#698ebf`, stands below as superseded history.

| Token | Value | Role |
|---|---|---|
| `--accent-page` (hover glow) | `#6d9cb0` | the hover glow's blue, blooming on hover — the brighter existing blue on `--chrome` (B25) |
| `--frame` (superseded member) | `#698ebf` | the v1 hover-glow blue, superseded by #67 (B25); still the page's linework blue where it is drawn |

The bloom's rendering values (`index.html`):

```css
--glow-blue: 109 156 176;                        /* = --accent-page #6d9cb0 */
.door-card:hover { box-shadow: 0 0 32px 4px rgb(var(--glow-blue) / 0.9); }
```

Measured on the shipped page over `--chrome` (0.0023): 25.8× the ground at
4px from the card's edge, 18.0× at 8px, 11.4× at 12px, 4.3× at 20px — a ≥3×
band 23px wide, against the v1 state's 7px. The bloom is the elevation; **no
second shadow layer on hover** (§2.6).

### §2.5 The click-state green

On **active** (pressed), the glow shifts to a light **"go" green pulled from
the Idea boards' colour family** — no new colour, no new token (owner ruling,
`DECISIONS.md` B14). The member is **the Idea ladder's `--note` rung,
`#b9d2b2`**, the lightest green the Idea family ships (`TheBoards'
UIUX.md §2.2.2`) — **ruled final** by the owner (`DECISIONS.md` B29, issue
#78): *"Confirm the glow green. There is no 'pending' status for a rule. It's
final once written, not debated once written."*

**Follow-up ruling (owner chat, 2026-09-29):** the press takes the hover's
full bloom geometry (`0 0 32px 4px` / `0.9`) in the green channels
(`--glow-green` #b9d2b2), with the elevation layer dropped — so the press
holds the bloom while the card sinks 1px, instead of contracting it.

### §2.6 Elevation

```css
--elevation: 0 2px 8px rgb(0 0 0 / 0.45);   /* pressed, transient only — hover's elevation is the bloom, §2.4 */
```

**Resting door-cards take no shadow** (§1).

### §2.7 Edges, rules and hairlines

> **A surface's edge is drawn in that surface's own ink.**

- The title compartment separates from the deep by `--frame` border —
  **edge-carried** (fill ratio ~1.10:1 deliberately quiet; `--frame` clears
  5.39:1 on it).
- The water field (band top, Parking Lot bottom) meets the deep at its
  darkest stop, and the full-width `--frame` rule carries that seam
  (5.95:1 on the deep, 3.77:1 on the water's darkest stop).
- The door-card's 2px `--frame` border is what separates overlapping cards
  (their fills are the same colour — 1.00:1). Overlap is allowed; the frame
  is load-bearing legibility, not chrome.
- Hairlines, where a separator is needed: that surface's ink at
  `rgb(var(--ink-a) / 0.4)`, clearing 3:1 on its ground.

### §2.8 Radius grammar

TheBoards' grammar, carried whole: **near-square**. The door-card radius is
`symmetric 3px`; the title compartment hangs beneath its rule with bottom-only
corners (`border-radius: 0 0 3px 3px`).

### §2.9 Type

**Montserrat Alternates**, self-hosted, **no CDN** — the same face as
TheBoards. Three weights shipped: 400, 600, 800, Latin-subset woff2,
`font-display: swap`. May be embedded as a data URI to keep the single-file
law (`PRD §3.3`).

### §2.10 Favicons (B63, issue #168)

The favicon is the **owner's portrait**: a blonde guy, hair short with a
**fauxhawk**, wearing **glasses**, eyes **brown** — drawn flat on the To-Do
deep tile (`--deep` `#020812`) inside the `--frame` `#698ebf` rounded-square
ring, at §2's own tokens (no new hex: skin/blonde are the portrait's own
illustration values, agent-derived per the `B33` pattern — the owner ruled
the subject, the drawing implements it). Shipped at **TheBoards' own
convention**: `favicon.ico` (16/32/48) + `icons/` — `favicon-16/32/48.png`,
`apple-touch-icon-192.png`, `icon-192.png`, `icon-512.png` — linked on
**every page** in the repo (`index.html`, `career.html`,
`plantsandrocks.html`, `monstera-storybook.html`). No PWA manifest — the
site refuses one (B13); the larger `icon-*` sizes ride the set for bookmark
and OS use, unlinked to any manifest.

---

## §3 The page

### §3.1 The scene

One bounded sheet, no calendar rail, no All Boards rail, no hero (owner
rulings). The sheet is the **whole viewport** — `#board` spans edge to edge
(no longer `inset:0`, but explicit `left:0; top:0` + JS-set logical
width/height, B30), with nothing beside it (#71), rendered through **one
render scale** (B30,
issue #87): a fixed logical coordinate space behind a single uniform
`transform: scale()` (`transform-origin: 0 0`), so on narrow viewports the
**whole scene shrinks as one** — the authored door-card geometry stands and
scales; nothing reflows, nothing clips. Logical width/height are set in JS
(`vw/rs` × `vh/rs`) so the scaled sheet always fills the viewport edge to
edge. Reading top to bottom: the **band** (water)
with the **title compartment** overhanging its rule, the **deep** through the
middle where the **door-cards** sit in the free board space, and the **Parking
Lot** (water) closing the foot.

Everything is visible at once: one viewport, no internal scrolling. The one
render scale keeps `scrollWidth <= innerWidth` at **every** width. The scale
is **uncapped** (`B44`, issue #121) and **height-anchored on landscape**
(`B46`, issue #128 — TheBoards' own desktop frame law, `geometry.js`
`computeFrame`, ported):

```
landscape (vw >= vh):  rs = min(vh / REF_H, vw / lw_min)
portrait  (vw <  vh):  rs = min(vw / REF_W, vh / REF_H)   — B30's down-scale
```

where `lw_min` is the content's own **measured** minimum logical width —
`max(doorCardW / (1 − left%))` over the door-cards (B42's "measured, never a
constant" law; agent-derived, `B46`). The width floor binds only on
square-ish landscape windows, where the pure height anchor would compress the
logical width below the cards' right edges and clip the sheet (~4px at
800×800); at every ordinary aspect the height term is smaller and the floor
is inert.

over the issue #112 drawing's own reference space (`REF_W×REF_H` = 2560/z ×
1440/z, z = 1.3037 ≈ 1963.64×1104.55, `B43`). On landscape the height term
binds by law, so the band — fixed logical literals — renders at the same
fraction of the viewport height at every landscape size (6.1% of vh, exactly
as TheBoards renders it); portrait keeps B30's `min()`, the only way the wide
drawing fits a narrow screen. This supersedes B44's single-`min()` formula
clause for landscape viewports only (`B46`). The sheet renders the drawing at
**every** viewport size, nothing reflows and nothing clips at either end.

### §3.2 The band and the title compartment

The title compartment is the same title card as TheBoards (owner ruling):
overhangs the band's rule (`--frame`, full-width `left: 0; right: 0`),
bottom corners only, centred, **not a link, not a control** (no `role`, no
`tabindex`, no caret).

**The band sizes to its tallest zone, from a two-line floor** (B46, issue
#128 — TheBoards' own law, `TheBoards' UIUX §3.1` / B47/B76, with the band
literals **rescaled ×1.10455**: TheBoards' literals live in its 1000-tall
logical frame and this board's space is the issue #112 drawing's
1104.55-tall frame, so every literal maps through
k = 1104.55/1000 = 1.10455; numbers agent-derived per the `B33` pattern;
`bandRuleY` in `index.html`):

```
rule-y = 15.46 + max(2, lines) × 21.54 + 8.84
       = 67.38px at the floor, 88.92px at three lines
```

`lines` is the tallest band zone's line count at 16.57px/1.3 (`band-top`
15.46, line 21.54, gap 8.84 — TheBoards `state.js` 14/19.5/8 × k). The label
term is gone from the budget: the header hangs below the rule as a tab
(`.band-label` 14.36px — TheBoards B54's 13px × k), so it reserves no height
above it.

**The title compartment is untouched: B31 stands** (`B46`, owner ruling 3).
It occludes the rule and overhangs it by **29px**:
`min-height: calc(var(--rule-y) + 29px)`, so a long title grows it downward;
its box is B31's own, `padding: calc(var(--band-top) + 8px) 16px 16px`. The
rescaled band grows beneath the box; the box grows around it.

Its two lines, in order (B17, superseding B5; sizes per B31, amended by B61):

1. **"The Portfolio of"** — the reduced secondary rung: **13.33px / 400**,
   `line-height: 1.2` (B61, issue #170: TheBoards' title-card convention
   `#anchor-title .title-date` — 10px/400 under a 15px/600 title, a 2/3
   ratio — scaled to this page's 20px title rung, 20 × 2/3; agent-derived
   arithmetic per the `B33` pattern).
2. **"Robert Alastair Zeved Gregory"** — the title rung: 20px / **600**.

The compartment's two lines render at **two rungs** (B61, issue #170 —
superseding the one-size clause of B19 for the eyebrow line only; B31's 20px
title rung stands). Its width hugs
the title text: the `--frame` left/right borders close in on the text with
comfortable padding (`16px`), the card stays centred, and the interior never
exceeds the sheet minus the side gutters.

### §3.3 The regions

| Region | Render |
|---|---|
| Title | the compartment above (§3.2) |
| Components | the line **"Each card links to a page housing my work in that domain."** (B38's line, copy per B54), **16.57px/400 `--ink`** (15px × 1.10455, `B46`; weight plain per `B54`), hanging from the region top at `--band-top` |
| Requirements | the line **"Click around to explore my works!"** (B37's line, copy per B54), **16.57px/400 `--ink`** (15px × 1.10455, `B46`; weight plain per `B54`), **left-anchored at the title card's right border + one `--gutter`** (B39), hanging from the region top at `--band-top` |
| Parking Lot | water field closing the sheet; sized by its measured contents from the two-row floor (§3.2's own law mirrored at the foot, B46); holds the contact form (§6) |

There is **no All Boards rail** — it is removed from the DOM and the layout
(#71, B27); the sheet takes its width.

### §3.4 The door-cards live in the board space

The door-cards sit **in the free board space** — the empty canvas between
the regions — at the positions the owner's wireframe illustrates (owner
ruling, `B2`: "the empty space is literally FOR those cards"). The wireframe
is committed as an **illustrative reference only**:
[`docs/proofs/wireframe-illustration-2026-09-29.png`](proofs/wireframe-illustration-2026-09-29.png)
— it is not law; where the wireframe and this document disagree, this
document wins. The cards do **not** live inside Components, Requirements, or
the Parking Lot. The current placement authority is the owner's issue #112
drawing (`B43`): every card's authored `left/top %` is an agent-derived
measurement of that screenshot, labelled as such in `B43`. Since `B45`
(issue #126) the placements are the **only** authored card geometry — the
cards are content-sized (§4), no px width/height is authored.

On narrow viewports the cards shrink with the board as a whole through the
**one render scale** (§3.1, B30): their authored `left/top %` is never
re-authored — the whole sheet scales, so every card
stays fully inside the sheet edge to edge (no left/right clipping, no
horizontal overflow) at 320–1023px. Since `B44` (issue #121) the scale is
uncapped, so desktop viewports render the drawing geometry scaled too — at
**every** viewport size the sheet shows the #112 drawing (`B43`), no note
cards overlapping and no link line obscured.

---

## §4 The door-card component

A door-card is a **real anchor** — `<a target="_blank"
rel="noopener noreferrer">` — not a scripted button. It renders as a TheBoards
note: `--note` fill, **2px border in the note's own ink** (`--ink-dark` on
this surface — the reference border is the note's ink, not `--frame`; the
border is what makes the 3px radius read near-square, TheBoards' own demo:
"See how this card has a border and is different? The corners are not as
rounded at all" — `B40`), 3px radius, `--ink-dark` text, draggable and
resizable for the visitor's entertainment only (no persistence, no state —
`B7`).

**Font and sizing are TheBoards' own note mechanics** (`B45`, issue #126,
superseding `B40`'s height-driven text law and `B43`'s authored fixed boxes
as a sizing mechanism; the `left/top %` placements remain the owner's
drawing authority, `B43`):

- **Font:** 17px, `line-height: 1.4` — TheBoards `styles.css` §4
  `.note-text` — **fixed**. The card's own scale factor is the only thing
  that sizes the text: it rides a uniform `transform: scale()` on the card,
  `transform-origin: top left` (TheBoards `styles.css` §4 `.note`), so text
  grows and shrinks with the card, never independently of it. No
  `--card-fs`; the height-driven updater is gone. **Weight:** **400, every
  note card** (`B60`, issue #167 — no note card renders bold; supersedes
  `B53`'s "the six board cards keep 600" clause and subsumes `B53`/`B55`'s
  sub-card 400).
- **Sizing:** cards are **content-sized** — `width: max-content`,
  `min-width: 132px` (= TheBoards' `NOTE_MIN_W`, `state.js` / `styles.css`
  `.note-text`, TheBoards `UIUX §4.5`, `B84`), `height` following the
  wrapped text. The width is **capped at the sheet's right edge**: the cap
  is the distance from the card's left edge to the sheet's right edge,
  divided by the card's own scale, floored at `NOTE_MIN_W` — TheBoards
  `geometry.js` `noteMaxW` ported verbatim (`--card-max-w`, set per card in
  JS, re-derived when the card is dragged or its scale changes).
- **Rest scale (B52, issue #138):** each card's rest scale is its **drawing
  scale of record** — the owner's attached visual sizes every card —
  shipped inline per card: **2.25** community, **2.21** career, **1.35**
  writing, **1.79** software-ai, **1.96** plants-rocks, **1.70** music,
  **0.78** apple-music, **0.79** spotify, **0.81** linkedin. The six board
  cards render above 1 (large display type), the sub cards below 1
  (small chips), exactly as the visual sizes them; the gesture still moves
  the scale from there under the floor and ceiling above, unchanged. The
  values are agent-derived from the visual (the `B33`/`B43` provenance
  pattern) — drawing footprint at 2560×1440 ÷ 1.3037 ÷ the card's measured
  unscaled content width. `B55` (issue #146) adds four more sub cards at **0.78** each —
  **zeved-boards**, **agentic-plugins**, **plants-poles**,
  **plants-in-rocks** — inside the sub-card band the owner set for them
  (~0.78–0.81); no drawing sizes these four, so the band's smallest scale
  of record stands.
- **Resize:** the corner gesture acts as **TheBoards' scale-based resize**
  (`interactions.js` frame-drag resize): the drag changes the card's own
  scale — the pointer's distance to the card's fixed top-left origin,
  divided by its distance at grab — floored at `MIN_SCALE` **0.5**
  (`state.js`) and **ceilinged by `B51` (issue #142): one-fifth of the
  viewport**, as a single uniform-scale bound — the gesture stops at the
  scale at which the card first reaches 1/5 of the viewport width or
  height, whichever binds first. TheBoards' `MAX_SCALE` 2.0 is superseded
  as a ceiling wherever it would stop a card below that bound. This
  supersedes `B21`'s independent width/height corner bounds (the `132×80`
  floor and the 1/5-viewport ceiling) for the gesture — `B21`'s one-fifth
  ceiling survives as `B51`'s uniform-scale bound; the legibility figure
  itself survives only as `NOTE_MIN_W`'s 132 unscaled width. The clamped footprint
  is re-fitted into the sheet after a scale change (TheBoards
  `applyNoteScale`'s re-clamp, including its inverted min/max idiom for a
  footprint that outgrows the sheet), and the links recompute (§4.3).

> **Provenance (`B45`):** the mechanism above is the owner's ruling —
> "every single note card should match TheBoards note font and card sizing
> mechanics. All of them." The *port specifics* are agent-derived
> implementations of it, per the `B33`/`B43` provenance pattern: the
> `--card-scale` / `--card-max-w` CSS custom properties and their JS
> updaters, the scale computed from pointer distance to the top-left
> origin (TheBoards' own `startResize` idiom), and the footprint re-clamp.
> The 0.5 floor and the 132px floor are TheBoards' own values
> (`state.js`), not agent inventions; the one-fifth-of-viewport ceiling is
> the owner's (`B51`, issue #142), and the per-card ceiling arithmetic is
> agent-derived per the `B33`/`B43` pattern. The per-card **rest scales**
> are likewise agent-derived, transcribing the owner's issue #138 visual
> (`B52`).

**A gesture is never a click** (`B41`, issue #109): the corner resize handle is
a `<span>` **inside** the card's `<a>`, so a pointer release over it fires the
anchor's own click and navigates away mid-resize. Any gesture that moved — drag
*or* resize, past the same 4px threshold both share — opens nothing; a press
that never moved is still a click and still opens the door in a new tab (`B3`),
including a tap squarely on the handle. The 4px threshold and the single shared
guard are agent-derived (B41 provenance).

**The handle's hit area is bigger than its glyph** (`B42`, issue #108): the
corner handle's box is a **28×28** grab target anchored **2px outside** the
card's outer corner, so the whole bottom-right corner resizes and a **2px
padding ring extends beyond the note itself**. The visible grip is unchanged —
it is pinned 9px inside the box's bottom-right corner, exactly where it already
sat, so the box grew around it and the mark did not move. The size and the 2px
ring are an **agent-derived implementation** of the owner's "expand the resize
button's clickable area with correct padding" words (`B42` provenance), never
owner-set numbers.

Both the gesture and the geometry are read in the board's **logical
coordinate space** (§3.1, `B30`): a card's `left/top` is authored in
logical px (as a `%` of the sheet), so pointer input (`clientX`/`clientY`,
physical) is converted with `÷ rs` before it touches card geometry — the
same rule the scale cites (TheBoards AGENTS.md architecture point 1;
`toLogical` divides by the render scale). A dragged card therefore tracks
the pointer 1:1 on screen at every scale, and the scale-based resize
computes its distances in the same logical space (TheBoards'
`updateResize` reads `toLogical(e.clientX, e.clientY)`). The `NOTE_MIN_W`
132 floor is an unscaled logical size that scales with the sheet — it is
never re-authored and never a fixed physical px.

### §4.1 States

| State | Render | Geometry partner (never colour alone) |
|---|---|---|
| **rest** | note surface, border in the note's own ink (`var(--ink)`), no glow, no underline | — the ink border itself is the resting edge |
| **hover** | blue bloom: `--accent-page` `#6d9cb0` at `0 0 32px 4px` / `0.9` — no second shadow layer (B14 hover member, settled by #67 → B25) | the bloom *is* the elevation — a temporary lifting, permitted by §1 |
|| **active (pressed)** | green bloom: `--glow-green` #b9d2b2 at `0 0 32px 4px` / `0.9` — no elevation layer (matches hover geometry, #67 follow-up ruling) | **1px inset** — the card presses into the page |
| **focus-visible** | a focus ring in the surface's ink (never a tint) | the ring is the geometry; keyboard users are never left to colour alone |
| **rest-only note** (the Music card) | note surface, ink border, **no hover, no click, no focus ring** — it is not a link and not a control (B26); it still drags and resizes like any note (B7) | — nothing blooms and nothing moves; the note only sits |

Transitions between states use TheBoards' closed motion set — short, quiet,
no bounce; nothing moves on its own after the interaction ends.

### §4.2 The doors

| Card | Destination (all `target="_blank"`) | Status |
|---|---|---|
| Community | `https://earp-street-park.netlify.app` | live |
| Professional | `https://razgregory.com/career` | live — the employer-selector career page (B47, `UIUX §10`) |
| Writing | `https://substack.com/@theaboveaveragerob` | live |
| Software & AI | `https://alastairzeved.com` | live |
| Plants & Rocks | `https://razgregory.com/plantsandrocks` | live — the dual-page-reader Plants & Rocks page (B48, `UIUX §11`) |
| Apple Music | `https://music.apple.com/us/artist/aboveaveragerob/1815357064` | live (B26) |
| Spotify | `https://open.spotify.com/artist/5R4lXpHs3OObGTFxdltrxZ` | live (B26 — the link the Music card carried) |

The **Music** card is not a door (§4.1, B26): it is the plain parent note the
**Apple Music** and **Spotify** doors hang under. The two music doors sit
**below the Music card as a mirrored pair** — Apple Music lower-left, Spotify
lower-right — at the placement the owner's screenshot gives (issue #72).

### §4.3 Note links (B28)

The note cards are joined by **links** — one per pair the owner authors. The
original eight pairs (issue #75's six plus #72's two — the Music note to the
Apple Music and Spotify notes below it) are:

Music ↔ Writing · Software & AI ↔ Community · Software & AI ↔ Writing ·
Plants & Rocks ↔ Community · Plants & Rocks ↔ Writing · Software & AI ↔ Music ·
Music ↔ Apple Music · Music ↔ Spotify. `B55` (issue #146) adds four more —
Software & AI ↔ Zeved Boards · Software & AI ↔ Agentic Plugins ·
Plants & Rocks ↔ Plants on Poles · Plants & Rocks ↔ Plants in Rocks.

A link is the card-to-card relationship drawn as the board's own linework:
a thin straight line between two cards' **centres**, no label, no arrowhead.

**The line.** 1px in **`--frame` `#698ebf`** — the page's linework blue
(§2.2), the same blue as the full-width rules and the card borders, so a link
introduces **no colour**. Held to a crisp 1px at any render scale by
`vector-effect: non-scaling-stroke`. **No fill, no cap decoration, no marker.**

**Where it sits.** One `<svg id="link-layer">` in `#board` space —
`position: absolute; inset: 0`, `z-index: 1`: **below the notes** (the
door-cards are `z-index: 2`) and **above the board furniture**, with DOM order
after the furniture. It is `pointer-events: none` — it never takes a hit,
because a link is a line, not a control.

**Endpoints.** Card centres, computed from live geometry and recomputed
whenever a card moves — drag, resize, or a window resize that re-scales the
percentage-authored layout — so a line follows the card it joins. Only the
**pairing** is authored: every card carries a `data-id`, every line carries
`data-from` / `data-to` — the mechanism, not a fixed count, is authoritative,
so a line exists for every authored pair, one 1px `--frame` line named by its
`data-id` (`test/desktop.js` pins the pairs).

**Provenance.** The idiom is TheBoards' note-link rendering, ported verbatim
(TheBoards' `UIUX §4.6` / `B91`); the pairs are the owner's (issue #75 and
#72). No value above is invented, and no card's geometry, links or states
change.

---

## §5 Motion

A closed set of quiet transitions inherited from TheBoards' grammar: hover
glow ~120–200ms ease-out; pressed inset ~80ms; no keyframes that loop, no
entrance animations, no staggered reveals. **Nothing animates on load.** If a
new motion cannot name its job in one sentence it is costume and comes out.

---

## §6 The contact form (Parking Lot)

A Formspree form with fields and protections per the owner's ruling (B6):

| Field | Required |
|---|---|
| Name | no |
| Email | no |
| Message | **yes** |

### §6.1 Spatial layout (B20)

The form's userspace, per the owner's ruling `B20`, renders left-anchored:

- **Name** and **Email** sit **stacked vertically** at the **left wall**,
  directly under the "Parking Lot" header, each at **half their original
  width** (the pre-fix three-equal-fields width halved). As a fluid grid the
  left track is one half of the Message track (`1fr` vs `2fr` of the form's
  own width — B62's fr-unit restatement of B20's 1:2 ratio), so the pair
  always reads as half-size beside it.
- **Message** sits to their immediate right, anchored to the Name/Email right
  edges, its **size unchanged** from the pre-fix layout (the full Message
  track, `30%`).
- The **Send** button and the "✱ required — protected by reCAPTCHA" note sit
  under the Message field, also left-anchored.
- The **right side of the pane is deliberately empty** — free space lives
  free; it is never filled.
- The **lot's height follows its measured contents** (B46, issue #128 —
  superseding B20's fixed `180px` as a mechanism, which stands only as the
  no-JS fallback): TheBoards' own law, `TheBoards' UIUX §3.2` / B73, ported
  as `lotH` in `index.html` — measure the rendered rows, floor at the
  **rescaled two-row shelf** (TheBoards' 122-shelf × 1.10455 = **134.76px**,
  header included; the 34px `LOT_HEAD` chrome is kept unscaled, agent-derived
  per the `B33` pattern), cap at half the logical sheet:

  `lot-h = min(max(134.76, 34 + Σ rowHeight), ⌈0.5 × logical-h⌉)`, the section
  bottom-anchored so it grows **upward** past the shelf floor, with
  `#lot-items` clipping past the half-sheet ceiling. (B20's stacked-pair
  arrangement above is unchanged.)

- **Captcha:** Formspree's reCAPTCHA — on by default, runs on Formspree's
  side; it adds no third-party script to the page. Never add a second
  captcha.
- **Honeypot:** the standard `_gotcha` field — `type="text"`, visually
  hidden via CSS, **not** `type="hidden"`.
- **Referrer policy:** the site must never send `Referrer-Policy:
  no-referrer` or `same-origin` — Formspree files every submission as spam
  when the referrer is missing, which would silently brick the form.
- The form is the page's **only** network call (§3.4, PRD).

### §6.2 The footer's 50/50 split (B62, issue #169)

The Parking Lot splits **50/50**, closed by a **vertical divider bar**:

- **Left half:** the owner's copy, verbatim from issue #169, ending in the
  italic phrase *Curiouser and curiouser.* — rendered **13px / 1.5 / 400**
  in `--ink` (agent-derived: the lot's own reading-text rung, between the
  11px labels and the 14px inputs, per the `B33` pattern).
- **Divider:** the divider grammar career.html ships (`.parking-lot__divider`
  — 1px wide, **3/4** of the section's inner height, centred), re-tokened to
  this page's To-Do blue: `color-mix(in srgb, var(--frame) 45%, transparent)`
  — the same mix the `#lot-rule` already renders.
- **Right half:** the contact form (§6/§6.1 stand), now spanning the right
  half; its tracks are `1fr 2fr` so it **scales with any viewport** (the
  issue's "scaled up and down to fit them all").
- **≤743px** (the repo's mobile breakpoint, career.html's block): the halves
  **stack** — copy above, divider horizontal (3/4 width), form below.
- The lot's height still follows §6.1's measured-content law; B20's
  "the right side of the pane stays empty" clause is **superseded** — the
  right half is the form's.

---

## §7 Accessibility

- Every door is a real link: keyboard-focusable, announced by its
  visible name, `target="_blank"` with `rel="noopener noreferrer"`. The
  **Music** note is not a door and is not a control (B26).
- Focus is a visible ring (§4.1), never a tint alone.
- The title compartment is not a control and must not be announced as one.
- Form fields carry labels; the Message field is `required` and announced so.
- Text contrast holds to §2.3's table on every surface it lands on.
- There is **no rail** to announce: the All Boards pane is gone (#71, B27), so
  no tray group, pager, or category label reaches AT at all.

---

## §8 What pins this document

| What is pinned | By |
|---|---|
| §2's tokens, ratios, crossover | `test/tokens.js` — recomputed from shipped hexes |
| card states, region layout, the full-viewport sheet, no rail in the DOM | `test/mobile.js`, `test/desktop.js` |
| the note links — their pairs, their 1px `--frame` line, their centres | the per-authored-pair mechanism: `test/desktop.js` [L1]–[L8]; `test/mobile.js` pins the endpoints at scale < 1 |
| one render scale: no clipping + no overflow at every width (320–1023) | `test/mobile.js` — `every door-card fully inside the sheet`, `no horizontal overflow`, `no vertical overflow` |
| the band / title-card / lot laws (B46): height-anchored landscape scale, ×1.10455 rescale, 29px overhang, B31's (band-top+8) 16px 16px box, rescaled lot shelf, lot clip | `test/scaling.js` (every viewport) and `test/parity_boards.js` — rendered side-by-side against the local TheBoards checkout at identical viewports |
| card drag + scale-based resize (B45: own scale floored 0.5, ceilinged at B51's one-fifth-of-viewport bound, content-sized floor NOTE_MIN_W 132) + the B52 drawing rest scales per card, link still opens a new tab — run at desktop (scale 1) **and** at 390×844 (scale < 1: the gesture is pinned in the logical space) | `test/movable_resizable.js` |
| releasing a resize navigates nothing; a tap on the handle still opens the door (`B41`) | `test/movable_resizable.js` |
| no service worker | `PRD §3`, `DECISIONS.md` B13 — and the deliberate absence of `test/sw-update.js` |
| the career page (B47): employer selector, B132 glow, split body, three-section lot, sand/brown ladder, empty blocks omitted; the B49 landing-convention band/card/lot render | `test/career.js` |
| the plantsandrocks page (B48): two-page selector, --frame glow, blank reader body, two-section lot, the B58 Download (PDF anchor), literal idea-green ladder, the B50 landing-convention band/card/lot render | `test/plantsandrocks.js` |

---

## §9 Cross-reference

| Citation | Here |
|---|---|
| `UIUX §1` — governing law | §1 |
| `UIUX §2` — tokens, ladder, ink | §2 |
| `UIUX §3` — the page, regions | §3 |
| `UIUX §4` — the door-card, states, doors | §4 |
| `UIUX §6` — the contact form | §6 |
| `UIUX §7` — accessibility | §7 |
| `UIUX §10` — the career page | §10 |
| `UIUX §11` — the Plants & Rocks page | §11 |

The codebase's `UIUX §x` citations resolve to their own numbers here.

---

## §10 The career page (issue #133, B47)

`career.html` is razgregory.com's employer-selector career page. It is a
static single file — all CSS inline, the typeface embedded as a data URI,
**no script**: the employer selector is a three-way radio group driven by CSS
`:has`, the landing reference's own mechanism.

### §10.1 Tokens — the sand/brown binding

TheBoards' token ladder re-hued to sand + deep brown (B47); the ladder's
luminance relationships are preserved role for role:

| Token | Hex | Role |
|---|---|---|
| `--deep` | `#12100a` | page canvas, darkest surface — deep brown, TheBoards `--deep` role |
| `--card` | `#241c0f` | band/card fill, one step above the deep |
| `--frame` | `#9a7c52` | card borders + all full-width rules — the deep's hue lifted |
| `--note` | `#e8d9b0` | brightest ink on the deep — light sand |
| `--water-top` | `#7a5c38` | gradient ladder, header band |
| `--water-mid` | `#5c4429` | gradient ladder mid stop |
| `--water-bot` | `#3a2c1a` | gradient ladder foot |
| `--ink-light` | `#f4f5f1` | light ink pole |
| `--ink-dim` | `rgb(244 245 241 / 0.55)` | unselected-card ink |
| `--glow-sand` | `#7d6340` | selected-card bloom — `--frame` one rung down (B132's rung rule) |

The final hexes are the owner's sign-off (issue #133 blank slot 9); the
**relationships** above — card above deep, note brightest on the deep, glow
one rung below frame — are the law.

*(B56, issue #154: the ported component's `.gm-title` carries the source's
800-weight type. The page's font set gains the **800 face** —
`MontserratAlternates-800.woff2` from the source repo, embedded as a data
URI like the existing 400/600 faces — so the title weight is served, not
browser-synthesized. The desc card's 300 weight has no face in the source
either; it renders synthesized there and here, unchanged.)*

### §10.2 Regions

*(Band, card and footer rendering law amended by B49, issue #139: the career
page's header band, title cards and footer render at the landing page's
conventions — B46's height-anchored scale, B31's title-card box, the lot's
two-row-shelf floor — re-tokened to the sand/brown binding. The scale is a
pure-CSS custom property `--rs` (`vh/1104.55` landscape, `min(vw/1440,
vh/1104.55)` portrait) since the page ships no script; every band literal
renders as `L × --rs`.)*

- **Header (employer timeline):** the landing page's band grammar — the
  water (radial foot + three-stop ladder + 0.05 dither) over the deep,
  closed by the 1px `--frame` rule at `--rule-y` (`67.38 × --rs`, the
  rescaled two-line floor) — with three title cards, PNC Bank, PNC Private
  Bank, Brinker Capital, left→right chronological. Each card is the landing
  title card's B31 box grammar verbatim: content-sized, top-anchored,
  `border-top: 0`, radius only on the bottom corners, `(band-top + 8px)
  16px 16px` padding, both lines at the 20px logical type (employer name
  600, oneliner slot 400), `min-height: rule-y + 29px` hanging over the
  rule. Unselected cards are dim + italic (§4's unselected grammar); the
  selected card wears the B132 glow verbatim:
  `border-color: var(--glow-sand); box-shadow: 0 0 8px 0 var(--glow-sand);`
  and no other state. Default selection: PNC Bank. The header is the
  selector's `role="radiogroup"` (`aria-label="Choose an employer"`); the
  page's one `h1` ("Career") is visually hidden so no wordmark encodes
  selection state in the heading outline.
- **Body (per-employer detail):** the shown employer is the split grid —
  `1fr 1px 1fr` with a 2rem gutter, the ruled bar `--frame` at 33.333% of a
  definite row track, the landing page's `.split`/`.split__rule` verbatim.
  At ≤743px the shown employer stacks (`flex-direction: column`), the rule
  running horizontal at 33.333% width. Transitions collapse under
  `prefers-reduced-motion: reduce`.
  Left half *(amended by B56, issue #154; re-arranged by B66, issue #173)*:
  the employer's roles as **plugin components** — the Agentic Plugins page's
  `.gregorian-mode` class set ported verbatim in structure (water back card
  `.gm-back`, uppercase title card `.gm-title`, the italic lowered year
  subscript in the `.gm-uc` grammar, description card `.gm-desc`), re-hued
  to this page's own sand/brown tokens (§10.1) with `--ink` on the sand
  cards reusing `--deep` `#12100a`. One component per role, in **one row
  reading left to right** (B66: chronological, oldest leftmost; the half
  scrolls vertically when the row needs more height; at ≤743px the shipped
  readable reflow stacks the plates again), equally sized and evenly spaced
  with comfortable padding between each to fit the space, contained within
  the left half. The component's "Github" CTA is not ported. The description
  cards carried **B56's explicit override** of the omit-empty rule (empty
  until the owner's fill passes); *(amended by B64, issue #176)* three now
  render the **owner's copy verbatim, three paragraphs per card** — Sr.
  Portfolio Specialist (Brinker), Portfolio & Trust Administrator (PNC
  Private Bank) and Branch Banker (PNC Bank) — as the component's single
  desc-card element with `<br><br>` paragraph breaks; every other desc
  card stays empty (B56), each with min-height for 2–3 sentences at the
  component's own 20px/32px desc type. Plate geometry is agent-derived
  under the B33 provenance pattern, as re-ruled by B66: each plate is an
  equal flex cell of the left-to-right row (two plates split it half/half),
  desc min-height `3 × 32px + 2 × 10px = 116px`, row padding the page's
  existing 1.25rem gutter value.
  *(Amended by B64: with the copy filled, the B56 equal flex cells
  (`flex: 1 1 0`) clamped every plate to the empty state's height — the
  699px filled card overflowed its cell onto the footer, which the
  no-overlap law forbids; the plates then sized to their content. That
  content-sizing now renders in B66's left-to-right row: `flex: 1 1 0`
  equalizes the plates' widths, the vertical size is the content, and the
  half scrolls when the row needs more height. The empty-state equal-cell
  rendering was the placeholder geometry; the owner's equal-sizing words
  were ruled for the empty state and the filled state sizes to content.)*
  Right half: "Accomplishments" and "Learnings/Skills" (section name
  pending, issue #133 slot 6) render only once filled.
- **Footer *(amended by B65, issue #177)*** the landing page's
  `.parking-lot` grammar — water gradient over `--deep`, 1px
  `--frame`-mix top rule, same padding — floored at the rescaled two-row
  shelf (`134.76 × --rs`, B49: the landing lot's floor, taken statically;
  content grows past it), split **two ways**: the **tools line** left —
  the owner's copy "Orion Technology | Factset | Morningstar | Docupace |
  BPM | Salesforce" rendered on one line, its straight slashes as **short
  divider bars** (1px wide, the divider's own `--frame`-mix color, `0.875em` tall —
  agent-derived per B33/B40: the owner ruled shorter + visually distinct,
  same palette) — then **one** full divider bar (1px, 3/4 of the section's
  inner length, vertically centred), then the `.cta` "Learn More about
  Rob" → `https://razgregory.com/`. *(B65 supersedes §3's three-way
  split: the second divider bar is removed.)* The professional-blurb
  (blank #7) and contact-info (blank #8) slot comments keep their halves;
  the empty slots render nothing (B47). The tools line renders on one line
  wherever the bar's width allows and wraps rather than overflows where it
  doesn't (B65, wrap-only-when-needed — no-overlap law).

### §10.3 Blank slots

Nine slots await the owner's targeted fill passes (issue #133 §5): employment
dates, exact role titles, role blurbs, role notes, accomplishments, learnings
(×3 employers), the footer professional blurb, the footer contact info, and
the final palette hexes. **Owner ruling (2026-10-05): empty blocks are
omitted from the rendered page entirely until content exists** — no empty
styled container, no section heading, no filler text, no "coming soon"
marker. The slot structure lives in the markup as non-rendering `SLOT`
comments (and the footer's three-section frame, whose empty `<p>` slots
measure zero height and carry no text) so a targeted fill makes each block
appear; until then the page invents no copy.

*(Amended by B56, issue #154: the left half's role-title and dates slots
ship as the components' `.gm-title` and `.gm-uc` year subscript, with the
exact strings the owner's issue #154 lists; the blurb/notes slot structure
is carried by the components' empty `.gm-desc` cards, which render empty
per B56's explicit override. The omit-empty rule stands unchanged for the
right half and the footer.)*

*(Amended by B64, issue #176: three desc cards — Sr. Portfolio
Specialist, Portfolio & Trust Administrator, Branch Banker — now render
the owner's copy verbatim; every other desc card stays empty under B56.
Amended by B65, issue #177: the footer's left half carries the owner's
one-line tools list; the blurb (#7) and contact (#8) slots remain
unfilled and render nothing.)*

**Pinned by:** `test/career.js` — selector mechanics, the B132 glow, the
split, the two-way lot (B65), the ladder tokens, and the omit-empty-block
discipline.

---

## §11 The Plants & Rocks page (issue #134, B48; conventions fixed by B50)

*(Band, card and footer rendering law amended by B50, issue #140: this
page's header band, title cards and footer render at B49's landing-page
conventions — B46's height-anchored scale as the pure-CSS `--rs` port, B31's
title-card box, the lot's two-row-shelf floor — re-tokened to the idea-green
binding. The body reader law is amended by B57, issue #156: the Plants on
Poles reader renders the shipped `monstera-storybook.html` document in an
iframe.)*

`plantsandrocks.html` is razgregory.com's dual-page-reader page. It is a
static single file — all CSS inline, the typeface embedded as a data URI,
**no script** — built on `career.html` (§10) as the structural template: the
same `.topband` / `.topband__card` / `.topband__wordmark` /
`.topband__oneliner` / `.topband__tab` / `.topband__card-hit` /
`.parking-lot` / `.parking-lot__divider` / `.cta` grammar and the same CSS
`:has` radio mechanism.

### §11.1 Tokens — the literal idea-board green binding

TheBoards' **idea-board token block** (`#board[data-cat="idea"]`),
transcribed **byte-exact** — NOT a re-hue (issue #134 §4):

| Token | Hex | Role |
|---|---|---|
| `--deep` | `#000a06` | idea `--deep` — page canvas |
| `--card` | `#001a0e` | idea `--card` — band/card fill |
| `--water-top` | `#486b49` | idea `--water-top` — gradient ladder, header band |
| `--water-mid` | `#345439` | idea `--water-mid` — gradient ladder mid stop |
| `--water-bot` | `#1f3825` | idea `--water-bot` — gradient ladder foot |
| `--water-bot-a` | `31 56 37` | idea `--water-bot-a` (rgb channels) |
| `--frame` | `#52997f` | idea `--frame` — borders, rules, AND the selected-card glow token |
| `--note` | `#b9d2b2` | idea `--note` — brightest ink on the deep |

Ink and tokens the green block does not redefine come from TheBoards'
`:root` verbatim: `--ink-light` `#f4f5f1`, `--ink-dark` `#031019`,
`--ink: var(--ink-light)`.

**Agent-derived (B33/B40 provenance pattern):** the selected-card glow token
is **`--frame` `#52997f` itself** (`border-color: var(--frame); box-shadow:
0 0 8px 0 var(--frame)`) — the career mechanism's glow geometry with an
existing shipped value; inventing a new "one rung down" hex would be a
design-value invention. `--ink-dim: rgb(244 245 241 / 0.55)` (career.html's
shipped dim value) and the disabled button's 0.55 alpha are reused shipped
values, not new numbers.

### §11.2 Regions

- **Header (two-page selector):** B49's band grammar — the landing's water
  (radial foot + three-stop ladder + 0.05 dither) over the deep, closed by
  the 1px `--frame` rule at `--rule-y` (`67.38 × --rs`) — with **two** title
  cards, "Plants on Poles" (default checked) and "Plants in Rocks". Both
  cards are the B31 box verbatim at `--rs`: content-sized, top-anchored,
  `border-top: 0`, bottom-only radius, `(band-top + 8px) 16px 16px` padding,
  both lines at the 20px logical type (page name 600, oneliner 400),
  `min-height: rule-y + 29px` hanging over the rule. Each card carries its
  owner-authored oneliner — "Monstera Division and Moss Pole Guide" /
  "Planting in Semi-Hydroponics With Pon" — in the `.topband__oneliner` slot
  (these slots are NOT blank). Unselected cards dim + italic (§10's
  grammar); the selected card wears the B48 glow with `--frame` as the
  token. The header is `role="radiogroup"` (`aria-label="Choose a page"`);
  the page's one `h1` ("Plants & Rocks") is visually hidden.
- **Body (dual-page reader; the poles reader renders the storybook
  document per B57):** selection swaps between two reader containers (one
  per radio) driven by `:has`. The **Plants on Poles** reader renders the
  shipped second file `monstera-storybook.html` in an
  `<iframe src="monstera-storybook.html" title="Monstera Division and Moss
  Pole Introduction">` — the self-contained dual/single-page storybook whose
  own pager handles paging (it is `overflow: hidden`; the storybook ships
  **without its top header band** — the empty 56px `#band` strip was removed
  at the owner's direction, 2026-10-06, per B57); the iframe fills the
  body region between header and footer edge-to-edge (width 100%, no side
  gaps, `border: 0`) and sits below the title-card overhang (B31's
  `29 × --rs` hang plus the card's `8 × --rs` top offset as clearance, so
  the storybook's top does not overlap the cards; the clearance collapses
  to zero in the mobile block, where the cards no longer overhang). The
  **Plants in Rocks** reader is still a bare empty container — no styled
  content, no placeholder images, no text, no chevrons, no split furniture
  (B57 keeps B48's blank-reader discipline for that container only).
- **Footer (two sections):** the `.parking-lot` grammar — water gradient
  over `--deep`, 1px `--frame`-mix top rule, career.html's exact
  linear-gradient construction with the idea-green water tokens — floored at
  the rescaled two-row shelf (`134.76 × --rs`, B50: the landing lot's floor,
  taken statically; content grows past it), split **two** ways with **one**
  divider bar of 3/4 of the section's inner
  length, vertically centred. Left section: reserved, renders nothing
  (comment only, measures zero) — permanently empty. Right section: the
  **Download** `.cta` — career's `.cta` grammar re-tokened to the green
  palette (`background: var(--card); color: var(--ink-light); box-shadow:
  var(--elevation), 0 0 6px 0 var(--frame)`; `--elevation` and `--ease` are
  career's values verbatim) — **live on the Plants on Poles tab as an
  anchor serving the shipped `Flattened-Monstera-Division.pdf` via the
  `download` attribute (B58, issue #157)**; on the Plants in Rocks tab it
  renders inert and dimmed via CSS `:has` (`opacity: 0.55`,
  `cursor: not-allowed`, `pointer-events: none` — B48's shipped dim value,
  reused; the inert state is CSS-only, the page has no script).

At ≤743px the band stacks to one column and the lot stacks (career.html's
media pattern); transitions collapse under `prefers-reduced-motion: reduce`.

### §11.3 Blank slots

The Plants on Poles reader body is **filled as of B57** (issue #156): it
renders the shipped `monstera-storybook.html` document in an iframe. What
still awaits the owner's fill passes — the Plants in Rocks reader
implementation (B57 keeps B48's blank-reader discipline for that
container). The Download target is **filled as of B58** (issue #157): the
control serves the shipped `Flattened-Monstera-Division.pdf` (repo root)
via the `download` attribute, live on the Plants on Poles tab only. The
footer's left section is **permanently empty** by spec (not a pending fill).
The slot structure lives in the markup as non-rendering `SLOT` comments so a
targeted fill lands in place; the page invents no copy.

**Pinned by:** `test/plantsandrocks.js` — selector mechanics, the `--frame`
glow, the poles reader's storybook iframe and the empty rocks reader (B57),
the two-section lot, the B58 Download (PDF anchor, live on the poles tab,
inert on the rocks tab), the literal idea-green tokens,
the single-file law, and the B50 landing-convention band/card/lot render.
