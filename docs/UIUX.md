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

Its two lines, in order (B17, superseding B5; sizes per B31):

1. **"The Portfolio of"** — same size as the name: 20px, `line-height: 1.2`.
2. **"Robert Alastair Zeved Gregory"** — the title rung: 20px / **600**.

The compartment's two lines render at **one font size** (20px). Its width hugs
the title text: the `--frame` left/right borders close in on the text with
comfortable padding (`16px`), the card stays centred, and the interior never
exceeds the sheet minus the side gutters.

### §3.3 The regions

| Region | Render |
|---|---|
| Title | the compartment above (§3.2) |
| Components | TheBoards region, furniture present, contents **not yet ruled** — do not invent (PRD §2.6) |
| Requirements | the line **"Click around, explore!"** (B37), **16.57px/600 `--ink`** (15px × 1.10455, `B46`), **left-anchored at the title card's right border + one `--gutter`** (B39), hanging from the region top at `--band-top` |
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
  `--card-fs`; the height-driven updater is gone.
- **Sizing:** cards are **content-sized** — `width: max-content`,
  `min-width: 132px` (= TheBoards' `NOTE_MIN_W`, `state.js` / `styles.css`
  `.note-text`, TheBoards `UIUX §4.5`, `B84`), `height` following the
  wrapped text. The width is **capped at the sheet's right edge**: the cap
  is the distance from the card's left edge to the sheet's right edge,
  divided by the card's own scale, floored at `NOTE_MIN_W` — TheBoards
  `geometry.js` `noteMaxW` ported verbatim (`--card-max-w`, set per card in
  JS, re-derived when the card is dragged or its scale changes).
- **Resize:** the corner gesture acts as **TheBoards' scale-based resize**
  (`interactions.js` frame-drag resize): the drag changes the card's own
  scale — the pointer's distance to the card's fixed top-left origin,
  divided by its distance at grab — clamped to TheBoards' note-scale band
  **[0.5, 2.0]** (`state.js` `MIN_SCALE`/`MAX_SCALE`). This supersedes
  `B21`'s independent width/height corner bounds (the `132×80` floor and
  the 1/5-viewport ceiling) for the gesture; the legibility figure itself
  survives only as `NOTE_MIN_W`'s 132 unscaled width. The clamped footprint
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
> The 0.5–2.0 band and the 132px floor are TheBoards' own values
> (`state.js`), not agent inventions.

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
| Plants & Rocks | `https://razgregory.com/plantsandrocks` | **stub** (built after the landing page, B4) |
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
Music ↔ Apple Music · Music ↔ Spotify.

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

### §6.1 Spatial layout (B18)

The form's userspace, per the owner's ruling `B18`, renders left-anchored:

- **Name** and **Email** sit **stacked vertically** at the **left wall**,
  directly under the "Parking Lot" header, each at **half their original
  width** (the pre-fix three-equal-fields width halved). As a fluid grid the
  left track is one half of the Message track (`15%` vs `30%` of the pane),
  so the pair always reads as half-size beside it.
- **Message** sits to their immediate right, anchored to the Name/Email right
  edges, its **size unchanged** from the pre-fix layout (the full Message
  track, `30%`).
- The **Send** button and the "✱ required — protected by reCAPTCHA" note sit
  under the Message field, also left-anchored.
- The **right side of the pane is deliberately empty** — free space lives
  free; it is never filled.
- The **lot's height follows its measured contents** (B46, issue #128 —
  superseding B18's fixed `180px` as a mechanism, which stands only as the
  no-JS fallback): TheBoards' own law, `TheBoards' UIUX §3.2` / B73, ported
  as `lotH` in `index.html` — measure the rendered rows, floor at the
  **rescaled two-row shelf** (TheBoards' 122-shelf × 1.10455 = **134.76px**,
  header included; the 34px `LOT_HEAD` chrome is kept unscaled, agent-derived
  per the `B33` pattern), cap at half the logical sheet:

  `lot-h = min(max(134.76, 34 + Σ rowHeight), ⌈0.5 × logical-h⌉)`, the section
  bottom-anchored so it grows **upward** past the shelf floor, with
  `#lot-items` clipping past the half-sheet ceiling. (B18's stacked-pair
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
| card drag + scale-based resize (B45: own scale clamped 0.5–2.0, content-sized floor NOTE_MIN_W 132), link still opens a new tab — run at desktop (scale 1) **and** at 390×844 (scale < 1: the gesture is pinned in the logical space) | `test/movable_resizable.js` |
| releasing a resize navigates nothing; a tap on the handle still opens the door (`B41`) | `test/movable_resizable.js` |
| no service worker | `PRD §3`, `DECISIONS.md` B13 — and the deliberate absence of `test/sw-update.js` |
| the career page (B47): employer selector, B132 glow, split body, three-section lot, sand/brown ladder, blank slots empty | `test/career.js` |

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

### §10.2 Regions

- **Header (employer timeline):** the landing page's `.topband` grammar with
  three title cards — PNC Bank, PNC Private Bank, Brinker Capital,
  left→right chronological. Each card hangs over the header's 1px `--frame`
  rule (`margin-bottom: -14px`). Unselected cards are dim + italic
  (§4's unselected grammar); the selected card wears the B132 glow verbatim:
  `border-color: var(--glow-sand); box-shadow: 0 0 8px 0 var(--glow-sand);`
  and no other state. Default selection: PNC Bank.
- **Body (per-employer detail):** the shown employer is the split grid —
  `1fr 1px 1fr` with a 2rem gutter, the ruled bar `--frame` at 33.333% of a
  definite row track, the landing page's `.split`/`.split__rule` verbatim.
  Left half: role heading box (2px `--frame` border), "Blurb about role",
  "Notes about role & responsibilities". Right half: "Accomplishments",
  "Learnings/Skills" (section name pending, issue #133 slot 6).
- **Footer (three sections):** the landing page's `.parking-lot` grammar —
  water gradient over `--deep`, 1px `--frame`-mix top rule, same padding —
  split three ways (professional blurb · contact info · the `.cta` "Learn
  More about Rob" → `https://razgregory.com/`), separated by 1px divider
  bars of 3/4 of the section's inner length, vertically centred.

### §10.3 Blank slots

Nine slots ship **empty but slotted** (issue #133 §5): employment dates,
exact role titles, role blurbs, role notes, accomplishments, learnings
(×3 employers), the footer professional blurb, the footer contact info, and
the final palette hexes. The owner fills them in targeted passes; the
structural build never invents copy.

**Pinned by:** `test/career.js` — selector mechanics, the B132 glow, the
split, the three-section lot, the ladder tokens, and the empty-slot
discipline.
