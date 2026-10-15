# UIUX.md — The-Portfolio

**Status:** current rendering authority. `PRD.md` says what the site *is*;
this says what it *looks like* and how it behaves under the hand and the
cursor. Where the two disagree about rendering, **this document wins**.

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

The governing design law and register are stated in PRD §1 and PRD §1.1.

- **Never colour alone.** Every state distinguished by colour is also
  distinguished by geometry, position or texture. The click is a 1px inset
  (geometry) *and* a glow shift (colour). Focus is a ring, not a tint.
- **Elevation means "temporary, above the page."** Shadow is reserved for
  transient interaction states — hover glow, pressed inset. **Resting cards
  carry no shadow.** They are *on* the page, not floating over it.

**Rulings:** B1.

### §1.1 The register

The emotional register is specified once in PRD §1.1.

**Rulings:** B1.

---

## §2 Design tokens

### §2.1 One binding

This site wears exactly one binding: **To-Do blue**. The ladder does not
rotate. Values below are the To-Do ladder's, quoted as shipped in TheBoards
(`TheBoards' UIUX.md §2.2`), re-verified at the rung's relative luminance.

**Rulings:** B1.

### §2.2 The surface ladder

| Token | Value | What it is | Rel. luminance |
|---|---|---|---|
| `--deep` | `#020812` | the canvas — the deepest surface on the page | 0.0023 |
| `--chrome` | `#020812` | the room behind the page — the board's ground and any summoned surface | 0.0023 |
| `--card` | `#08152c` | the title compartment, sitting just above the deep | 0.0077 |
| `--water-top` | `#34697f` | the water's lightest stop | 0.1237 |
| `--water-mid` | `#255265` | the water's middle stop | 0.0737 |
| `--water-bot` | `#163646` | the water's darkest stop | 0.0325 |
| `--frame` | `#698ebf` | the board's linework blue and both full-width rules | 0.2611 |
| `--note` | `#a0d4da` | the door-card — the lit thing on the deep | 0.5962 |
| `--danger` | `#E2A08C` | the single warm hue, carried from TheBoards; no destructive action is drawn | 0.4320 |

**Rulings:** B1.

### §2.3 Ink

| Token | Value | Bound on |
|---|---|---|
| `--ink-light` | `#f4f5f1` | `--deep`, `--card`, `--water`, `--chrome` |
| `--ink-dark` | `#031019` | `--note` |

Verified contrast, each at the worst extreme of its range:

| Ground | Ink | Ratio | Level |
|---|---|---|---|
| `--deep` `#020812` | `--ink-light` | **18.33:1** | AAA |
| `--card` `#08152c` | `--ink-light` | **16.62:1** | AAA |
| water, lightest stop `--water-top` `#34697f` | `--ink-light` | **5.52:1** | AA |
| water, darkest stop `--water-bot` `#163646` | `--ink-light` | **11.62:1** | AAA |
| `--note` `#a0d4da` | `--ink-dark` | **11.84:1** | AAA |

**The crossover and the forbidden band carry from TheBoards, verbatim:**

> Below `L = 0.1788` a ground takes `--ink-light`; above it, `--ink-dark`.
> **No text-bearing surface may have a relative luminance between 0.163 and
> 0.196** — there is no ink in the palette that works there.

**Rulings:** B1.

### §2.4 Accents (blue family)

The hover glow uses the existing blue `--accent-page` `#6d9cb0`; no new
token or colour is introduced. It renders as
`0 0 32px 4px rgb(var(--glow-blue) / 0.9)`, with no second shadow layer.
The bloom is the elevation.

| Token | Value | Role |
|---|---|---|
| `--accent-page` | `#6d9cb0` | the existing blue used for the hover glow |
| `--glow-blue` | `109 156 176` | `--accent-page` RGB channels |

**Rulings:** B14, B25.

### §2.5 The click-state green

On **active** (pressed), the glow uses the Idea ladder's `--note` green
`#b9d2b2` (`--glow-green`) with the same `0 0 32px 4px` / `0.9` bloom as
hover. The card sinks **1px** and drops the elevation layer.

**Rulings:** B14, B29.

### §2.6 Elevation

```css
--elevation: 0 2px 8px rgb(0 0 0 / 0.45);   /* career / Plants & Rocks CTA shadow; not used by landing door-cards */
```

**Resting door-cards take no shadow** (§1).

**Rulings:** B49, B50.

### §2.7 Edges, rules and hairlines

> **A surface's edge is drawn in that surface's own ink.**

- The title compartment separates from the deep by `--frame` border —
  **edge-carried** (fill ratio ~1.10:1 deliberately quiet; `--frame` clears
  5.39:1 on it).
- The water field (band top, Parking Lot bottom) meets the deep at its
  darkest stop, and the full-width `--frame` rule carries that seam
  (5.95:1 on the deep, 3.77:1 on the water's darkest stop).
- The door-card's 2px `--ink-dark` border is what separates overlapping cards
  (their fills are the same colour — 1.00:1). Overlap is allowed; the ink-dark
  border is load-bearing legibility, not chrome.
- Hairlines, where a separator is needed: that surface's ink at
  `rgb(var(--ink-a) / 0.4)`, clearing 3:1 on its ground.

**Rulings:** B40.

### §2.8 Radius grammar

TheBoards' grammar, carried whole: **near-square**. The door-card radius is
`symmetric 3px`; the title compartment hangs beneath its rule with bottom-only
corners (`border-radius: 0 0 3px 3px`).

**Rulings:** B40.

### §2.9 Type

**Montserrat Alternates**, self-hosted, **no CDN** — the same face as
TheBoards. Three weights shipped: 400, 600, 800, Latin-subset woff2,
`font-display: swap`. May be embedded as a data URI to keep the single-file
law (PRD §3.3).

**Rulings:** B23.

### §2.10 Favicons

The favicon is the **owner's portrait**: a blonde guy, hair short with a
**fauxhawk**, wearing **glasses**, eyes **brown** — drawn flat on the To-Do
deep tile (`--deep` `#020812`) inside the `--frame` `#698ebf` rounded-square
ring, at §2's own tokens (the skin and blonde are illustration values). The
portrait uses the owner's specified subject. Shipped at **TheBoards' own
convention**: `favicon.ico` (16/32/48) + `icons/` — `favicon-16/32/48.png`,
`apple-touch-icon-192.png`, `icon-192.png`, `icon-512.png` — linked on
**every page** in the repo (`index.html`, `career.html`,
`plantsandrocks.html`, `monstera-storybook.html`). No PWA manifest — the
site refuses one (B13); the larger `icon-*` sizes ride the set for bookmark
and OS use, unlinked to any manifest.

**Rulings:** B63.

---

## §3 The page

### §3.1 The scene

One bounded sheet, no calendar rail, All Boards rail, or hero. The sheet is
the **whole viewport** — `#board` spans edge to edge with explicit
`left: 0; top: 0` and JS-set logical width/height. Nothing sits beside it
(B27). A single render scale (B30) uses a fixed logical coordinate space
behind a uniform `transform: scale()` (`transform-origin: 0 0`), so on narrow
viewports the
**whole scene shrinks as one** — the authored door-card geometry stands and
scales; nothing reflows, nothing clips. Logical width/height are set in JS
(`vw/rs` × `vh/rs`) so the scaled sheet always fills the viewport edge to
edge. Reading top to bottom: the **band** (water)
with the **title compartment** overhanging its rule, the **deep** through the
middle where the **door-cards** sit in the free board space, and the **Parking
Lot** (water) closing the foot.

Everything is visible at once: one viewport, no internal scrolling. The one
render scale keeps `scrollWidth <= innerWidth` at **every** width. The scale
is **uncapped** and **height-anchored on landscape**:

```
landscape (vw >= vh):  rs = min(vh / REF_H, vw / lw_min)
portrait  (vw <  vh):  rs = min(vw / REF_W, vh / REF_H)   — B30's down-scale
```

where `lw_min` is the measured minimum logical width,
`max(doorCardW / (1 − left%))` over the door-cards. The width floor binds on
square-ish landscape windows when the height anchor alone would clip the
cards; at ordinary landscape aspect ratios the floor is inert.

The authored scene uses `REF_W×REF_H = 2560/z × 1440/z`, where
`z = 1.3037` and the resulting dimensions are approximately
`1963.64 × 1104.55`. Landscape is height-anchored; portrait uses the stated
`min()` formula. The band renders at 6.1% of viewport height on landscape.
The sheet fills the viewport at every size without reflow or clipping.

**Rulings:** B27, B30, B42, B43, B44, B46.

### §3.2 The band and the title compartment

The title compartment uses the same title-card structure as TheBoards:
overhangs the full-width `--frame` rule, has bottom-only corners, is centred,
and is **not a link or control**; it has no `role`, `tabindex`, or caret.

The band sizes to its tallest zone with a two-line floor. At 16.57px/1.3,
`rule-y = 15.46 + max(2, lines) × 21.54 + 8.84`, yielding **67.38px** at
the floor and **88.92px** at three lines. Band literals render at ×1.10455.
The 14.36px / 400 label hangs below the rule and reserves no height above it.

The title compartment occludes the rule and overhangs by **29px**. Its
`min-height` is `calc(var(--rule-y) + 29px)` and its padding is
`calc(var(--band-top) + 8px) 16px 16px`; it grows downward with a long title.
The band grows beneath it.

Its two lines are **"The Digital Garden of"** at **13.33px / 400 / 1.2** and
**"Robert Alastair Zeved Gregory"** at **20px / 600**. The first is the
reduced secondary rung; the title uses the larger rung. The compartment hugs
the title text with 16px padding, remains centred, and does not exceed the
sheet minus the side gutters.

**Rulings:** B17, B31, B46, B61, B72.

### §3.3 The regions

| Region | Render |
|---|---|
| Title | the compartment above (§3.2) |
| Components | two lines: **"Under Construction: Career content, Plants in Rocks content."** / **"Planned future work: Add landing pages"**, at **16.57px/400** in `--ink`, anchored at `--band-top` |
| Requirements | **"Click the note cards to launch my various pages and work across the web."**, at **16.57px/400** in `--ink`, left-anchored one `--gutter` beyond the title card's right border and hanging from the region top at `--band-top` |
| Parking Lot | the water field closes the sheet; its height follows measured content from the two-row floor; it holds the contact form (§6) |

There is **no All Boards rail**; the sheet takes its width.

**Rulings:** B27, B39, B46, B54, B71, B85.

### §3.4 The door-cards live in the board space

The door-cards sit **in the free board space** — the empty canvas between
the regions — at the positions the owner's wireframe illustrates (B2). The
wireframe is committed as an **illustrative reference only**:
[`docs/proofs/wireframe-illustration-2026-09-29.png`](proofs/wireframe-illustration-2026-09-29.png)
— it is not law; where the wireframe and this document disagree, this
document wins. The cards do **not** live inside Components, Requirements, or
the Parking Lot. The current placement authority is the owner's issue #189
drawing: every card's authored `left/top %` follows that drawing (B78). The
**Philly Plant Dads** note sits at **left 59.5% / top 64.3%** (B80). These
placements are the only authored card geometry; cards are content-sized
(§4), with no authored px width or height (B45).

At narrow widths, the authored `left/top %` never changes; the whole sheet
scales so every card stays inside the sheet, without clipping or horizontal
overflow at 320–1023px. At every viewport size, the #189 arrangement has no
overlapping cards and no obscured link lines, except the line behind Career
from Software & AI to Community.

**Rulings:** B2, B30, B43, B45, B78, B80.

---

## §4 The door-card component

A door-card is a **real anchor** — `<a target="_blank"
rel="noopener noreferrer">` — not a scripted button. It renders as a TheBoards
note: `--note` fill, **2px border in the note's own ink** (`--ink-dark`),
3px radius, and `--ink-dark` text. Cards are draggable and resizable for the
visitor's entertainment only; positions are not persisted (B7, B40).

**Font and size.** Note text is 17px / 1.4 / 400 and scales only with its
card. The Philly Plant Dads label is 11.4px in its one-line Spotify-sized
box; its line box remains 17 × 1.4 = 23.8px. Cards are content-sized, with
`width: max-content`, a 132px minimum, and height following wrapped text.
Their width is capped at the sheet's right edge, divided by the card's own
scale; `--card-max-w` is recalculated after drag or scale changes. (B45, B60,
B80, B84.)

**Rest scale.** Per-card values: **2.33** community, **2.18** career, **1.86**
writing, **1.78** software-ai, **2.26** plants-rocks, **1.70** music, **1.01**
apple-music, **1.19** spotify, **1.06** linkedin, **1.24** zeved-boards,
**1.19** agentic-plugins, **0.98** plants-poles, **1.02** plants-in-rocks,
and **1.19** philly-plant-dads. (B78, B80.)

**Resize.** Dragging the corner scales the card uniformly from its top-left
origin. The scale has a **0.5** floor and a ceiling at the first point the
card reaches **one-fifth of the viewport** in either dimension. After a scale
change, the footprint is refitted inside the sheet and its links recompute.
The 132px minimum width is an unscaled logical size. (B21, B45, B51, B84.)

**Gesture and handle.** A drag or resize that moves past the shared **4px**
threshold opens no link; a press that does not move still opens the anchor,
including a tap on the handle. The handle's grab box is **28×28**, anchored
**2px outside** the card's outer corner; the visible grip sits **9px** inside
the box's bottom-right corner. Pointer positions are converted to logical
coordinates by dividing by the render scale `rs`. (B3, B30, B41, B42.)

**Rulings:** B3, B7, B21, B30, B40, B41, B42, B45, B51, B60, B78, B80, B84.

### §4.1 States

| State | Render | Geometry partner (never colour alone) |
|---|---|---|
| **rest** | note surface, border in the note's own ink (`var(--ink)`), no glow, no underline | — the ink border itself is the resting edge |
| **hover** | blue bloom: `--accent-page` `#6d9cb0` at `0 0 32px 4px` / `0.9`; no second shadow layer | the bloom is the elevation |
| **active (pressed)** | green bloom: `--glow-green` `#b9d2b2` at `0 0 32px 4px` / `0.9`; no elevation layer | **1px inset** — the card presses into the page |
| **focus-visible** | a focus ring in the surface's ink (never a tint) | the ring is the geometry; keyboard users are never left to colour alone |
| **rest-only note** (Music and the four B55 sub-cards) | note surface, ink border, no hover, click, or focus ring; it is not a link or control and still drags/resizes | — nothing blooms and nothing moves |

Transitions use TheBoards' closed motion set: short, quiet, no bounce.

**Rulings:** B7, B14, B25, B26, B29, B55.

### §4.2 The doors

| Card | Destination (all `target="_blank"`) | Status |
|---|---|---|
| Community | `https://earp-street-park.netlify.app` | live |
| Career | `https://razgregory.com/career` | live — the employer-selector career page (B34, UIUX §10) |
| Writing | `https://substack.com/@theaboveaveragerob` | live |
| Software & AI | `https://alastairzeved.com` | live |
| Plants & Rocks | `https://razgregory.com/plantsandrocks` | live — the dual-page-reader Plants & Rocks page (B48, UIUX §11) |
| LinkedIn | `https://www.linkedin.com/in/robertagregory` | live (B34) |
| Apple Music | `https://music.apple.com/us/artist/aboveaveragerob/1815357064` | live (B26) |
| Spotify | `https://open.spotify.com/artist/5R4lXpHs3OObGTFxdltrxZ` | live (B26 — the link the Music card carried) |
| Philly Plant Dads | `https://www.instagram.com/philly_plant_dads` | live (B80) |

**Rulings:** B26, B34, B48, B78, B80.

### §4.3 Note links

The following authored pairs are joined by links:

Music ↔ Writing · Software & AI ↔ Community · Software & AI ↔ Writing ·
Plants & Rocks ↔ Community · Plants & Rocks ↔ Writing · Software & AI ↔ Music ·
Music ↔ Apple Music · Music ↔ Spotify · Career ↔ LinkedIn ·
Software & AI ↔ Zeved Boards · Software & AI ↔ Agentic Plugins ·
Plants & Rocks ↔ Plants on Poles · Plants & Rocks ↔ Plants in Rocks ·
Plants & Rocks ↔ Philly Plant Dads.

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

The line style follows TheBoards' `UIUX §4.6` / TheBoards' `B91`.

**Rulings:** B28, B34, B55, B80.

---

## §5 Motion

The site's closed set of quiet transitions is inherited from TheBoards'
grammar: hover glow ~120–200ms ease-out; pressed inset ~80ms. No keyframes
that loop, entrance animations, or staggered reveals are permitted except those
explicitly listed below; nothing animates on load except by an explicit
page-specific ruling. If a new motion cannot name its job in one sentence it
is costume and comes out.

| Page | Motion | Ruling |
|---|---|---|
| Career (`career.html`) | the light pool dims once on load; the role ring turns once on load; `gm-marquee` glimmers on the front card only | B98, B101, B102; no arrival or glimmer under `prefers-reduced-motion` |

**Rulings:** B98, B101, B102.

---

## §6 The contact form (Parking Lot)

A Formspree form with fields and protections per the owner's ruling (B6):

| Field | Required |
|---|---|
| Name | no |
| Email | no |
| Message | **yes** |

**Rulings:** B6.

### §6.1 Spatial layout

The form renders left-anchored:

- **Name** and **Email** sit **stacked vertically** at the **left wall**,
  directly under the "Parking Lot" header, each at **half the Message
  field's width**. As a fluid grid, the left track is one half of the Message
  track (`1fr` vs `2fr` of the form's own width), so the pair always reads
  as half-size beside it.
- **Message** sits to their immediate right, anchored to the Name/Email right
  edges. The form's tracks are
  `1fr 2fr` (B62); the textarea flexes to make room for the inline Send button.
- The **Send** button (UIUX §6's `button[type="submit"]` grammar)
  sits **inline, to the right of the Message textarea** on the same row (B83,
  issue #210): its bottom edge is flush with the textarea's bottom and its
  right edge at the form's right — the bottom-right corner — and the Message
  textarea narrows to make room (it flexes to fill the rest of its `2fr`
  track). The "✱ required — protected by reCAPTCHA" note stays under the
  Message field, left-anchored.
- The Message textarea has a **98px `min-height`** and remains vertically
  resizable.
- The form occupies the **right half** of the Parking Lot beside the owner's
  copy in the left half, separated by the vertical divider.
- The **lot's height follows its measured contents**, with **180px** as the
  no-JS fallback. It measures rendered rows, floors at the
  **rescaled two-row shelf** (TheBoards' 122-shelf × 1.10455 = **134.76px**,
  including the header and 34px `LOT_HEAD` chrome), and caps at half the
  logical sheet:

  `lot-h = min(max(134.76, 34 + Σ rowHeight), ⌈0.5 × logical-h⌉)`, the section
  bottom-anchored so it grows **upward** past the shelf floor, with
  `#lot-items` clips past the half-sheet ceiling.

- **Captcha:** Formspree's reCAPTCHA — on by default, runs on Formspree's
  side; it adds no third-party script to the page. Never add a second
  captcha.
- **Honeypot:** the standard `_gotcha` field — `type="text"`, visually
  hidden via CSS, **not** `type="hidden"`.
- **Referrer policy:** the site must never send `Referrer-Policy:
  no-referrer` or `same-origin` — Formspree files every submission as spam
  when the referrer is missing, which would silently brick the form.
- The form is the page's **only** network call (PRD §3.4).

**Rulings:** B20, B46, B62, B83, B84.

### §6.2 The footer's 50/50 split

The Parking Lot is split **50/50** by a vertical divider.

- **Left half:** two lines with no gap: "Welcome to Rob's digital garden."
  and the second line ending in *curiouser and curiouser.* The copy is
  **16.57px / 1.5 / 400** in `--ink`; the footer bar's size and height remain
  unchanged.
- **Divider:** 1px wide and **3/4** of the section's inner height, centred;
  its colour is `color-mix(in srgb, var(--frame) 45%, transparent)`. The
  `#lot-rule` is solid `var(--frame)`.
- **Right half:** the contact form (§6.1), with `1fr 2fr` tracks.
- **≤743px:** copy above, horizontal divider at 3/4 width, form below.
- The lot height follows §6.1's measured-content rule.

**Rulings:** B62, B68, B86.

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

**Rulings:** B3, B6, B26, B27.

---

## §8 What pins this document

| What is pinned | By |
|---|---|
| §2's tokens, ratios, crossover | `test/tokens.js` — recomputed from shipped hexes |
| security headers and shipped-script contract | `test/security.js` |
| DECISIONS.md entry numbering | `test/records.js` |
| ruling citations, token/contrast rows and append-only ledger | `test/docket.js` |
| card states, region layout, the full-viewport sheet, no rail in the DOM | `test/mobile.js`, `test/desktop.js` |
| the note links — their pairs, their 1px `--frame` line, their centres | the per-authored-pair mechanism: `test/desktop.js` [L1]–[L14]; `test/mobile.js` pins the endpoints at scale < 1 |
| one render scale: no clipping + no overflow at every width (320–1023) | `test/mobile.js` — `every door-card fully inside the sheet`, `no horizontal overflow`, `no vertical overflow` |
| the band / title-card / lot laws (B46): height-anchored landscape scale, ×1.10455 rescale, 29px overhang, B31's (band-top+8) 16px 16px box, rescaled lot shelf, lot clip | `test/scaling.js` (every viewport) |
| card drag + scale-based resize (B45: own scale floored 0.5, ceilinged at B51's one-fifth-of-viewport bound, content-sized floor NOTE_MIN_W 132) + the B78 drawing rest scales and placements per card (B80 for philly-plant-dads, seated by the owner's words), link still opens a new tab — run at desktop (scale 1) **and** at 390×844 (scale < 1: the gesture is pinned in the logical space) | `test/movable_resizable.js` |
| releasing a resize navigates nothing; a tap on the handle still opens the door (B41) | `test/movable_resizable.js` |
| no service worker | PRD §3, `DECISIONS.md` B13 — and the deliberate absence of `test/sw-update.js` |
| the career page: employer-card shared size/equal gaps, oneliner dates and selection glow; eight-role ring and uniform components; last-role jumps; one-viewport layout, component geometry and in-card scroll; monochrome tokens; filled and blank slots; two-way footer and centred CTA; reduced-motion, touch and glass-legibility behavior | `test/career.js` |
| the Plants & Rocks page: selector mechanics and `--frame` glow; storybook iframe and empty rocks reader; two-section lot; B58 Download (live on poles, inert on rocks) and B82 Back-to-the-Garden anchors (live on both tabs); idea-green tokens; single-file page and B50 landing-convention band/card/lot | `test/plantsandrocks.js` |

---

## §9 Shared sub-page conventions

The career and Plants & Rocks pages share the landing page's band, title-card,
and Parking Lot grammar at each page's CSS `--rs` scale (B49, B50). The
pure-CSS scale is height-anchored on landscape (`dvh / 1104.55`) and uses
`min(vw / 1440, dvh / 1104.55)` on portrait; the plain `vh` declarations
provide the fallback. The band uses the landing water construction (radial
foot at `118% 76% / 50% 24%`, three-stop ladder, 0.05 dither) over `--deep`,
closed by a 1px `--frame` rule at `--rule-y` (`67.38 × --rs`). Title cards
use B31's content-sized, top-anchored box: `border-top: 0`, bottom-only
corners, `(band-top + 8px) 16px 16px` padding, 20px type (page name 600,
oneliner 400), and a `rule-y + 29px` overhang. The Parking Lot uses the
landing water gradient and 1px `--frame`-mix top rule; its two-row shelf is a
`min-height` of `134.76 × --rs`, with content growing beyond it. Divider bars
are 3/4 of the section's inner length. Each page retains its own palette and
page-specific structure. At ≤743px, each keeps its shipped mobile reflow.

**Rulings:** B31, B46, B49, B50.

---

## §10 The career page

`career.html` is razgregory.com's employer-selector career page. It is a
static single file — all CSS inline, the typeface embedded as a data URI,
**no script**. The employer timeline and role carousel are CSS radio groups
driven by `:has`.

**Rulings:** B47.

### §10.1 Tokens — the monochrome binding

TheBoards' token ladder is re-derived as a pure neutral gray scale at the
landing palette's relative-luminance rungs. The token relationships are
preserved role for role.

| Token | Hex | Role | Relative luminance |
|---|---|---|---|
| `--deep` | `#080808` | page canvas | 0.0023 |
| `--card` | `#151515` | band and card fill | 0.0077 |
| `--frame` | `#8c8c8c` | borders and full-width rules | 0.2611 |
| `--note` | `#cbcbcb` | brightest ink on the deep | 0.5962 |
| `--water-top` | `#636363` | gradient ladder, header band | 0.1237 |
| `--water-mid` | `#4d4d4d` | gradient ladder mid stop | 0.0737 |
| `--water-bot` | `#333333` | gradient ladder foot | 0.0325 |
| `--ink-light` | `#f4f5f1` | light ink pole | — |
| `--ink-dim` | `rgb(244 245 241 / 0.55)` | unselected-card ink | — |
| `--glow-gray` | `#676767` | selected-card glow | 0.1356 |
| `--moon-a` | `148 163 189` | cool moonlight channels | 0.36 |

`--water-bot-a` is `51 51 51`, the channels of `--water-bot`.
`--glow-gray-a` is `103 103 103`, the channels of `--glow-gray`.

**Rulings:** B73, B81, B99.
**Agent-derived:** `--water-bot-a` and `--glow-gray-a` reuse their source
colors' RGB channels; the luminance figures are the corresponding token
measurements.

### §10.2 Regions

- **Header (employer timeline):** the band and title-card geometry follow
  §9. PNC Bank, PNC Private Bank and Brinker Capital appear left to right. Their title cards
  share one size, hug the widest employer label, and have equal gaps. Each
  carries its tenure as the italic `13.33px × --rs` date line. Unselected
  cards are dim and italic; the employer of the centred role uses the
  `--glow-gray` border and `0 0 8px 0` bloom. PNC Bank is selected by default.
  The page's sole `h1` ("Career") is visually hidden.
- **Body (per-employer detail):** one full-width role carousel in the body
  content area, bounded by an `overflow: clip` wrapper. The `.carousel` is
  the `Choose a role` radio group; its eight role components form the ring
  described in §10.5. Employer cards jump to their employer's last role and
  show a two-way selected glow for the employer of the centred role. The
  carousel is CSS-only. The body uses `padding: 1.5rem clamp(1.5rem, 5vw,
  4rem)` above 743px and zero inline padding at or below 743px. The page stays
  within one viewport; the filled description card is its only scroll
  container. Components use the source geometry scaled uniformly to the
  plate width; filled descriptions size to their content, while the empty
  placeholder uses the ruled floor. The card has a 2.1px `--ink` border and a
  keyboard focus ring.
- **Footer:** the Parking Lot convention follows §9, split 50/50. The left
  half carries the tools line "Orion Technology \| Factset \| Morningstar \|
  Docupace \| BPM \| Salesforce" and education line "Maryville University of
  St. Louis \| B.S. Accounting \| 2021 \| Magna cum laude", with short divider
  bars between items. A full divider bar separates them from the right-half CTA,
  "Learn More about Rob", linked to `https://razgregory.com/`. The facts render
  at `0.85rem`; the section gap is `2rem` above 743px and `1rem` at or below
  743px. The CTA keeps `min-height: 50px`, `padding: 2px 21px`, 14px/600 type,
  and a 3px radius, along with its resting, hover and focus
  shadows: resting `var(--elevation), 0 0 6px 0 var(--frame), 0 0 18px 2px
  rgb(var(--glow-gray-a) / 0.55)`; hover `var(--elevation), 0 0 12px 2px
  var(--frame), 0 0 24px 4px var(--frame)`; focus `var(--elevation), 0 0
  12px 2px var(--frame), 0 0 0 4px var(--deep)`. The region grows with its
  content beyond its floor.

**Rulings:** B31, B46, B49, B56, B61, B65, B73, B74, B76, B77, B79, B87, B88, B95, B98, B100, B102, B105.
The CSS `:has` selectors connect the checked role to its employer card and
the displayed ring state.

### §10.3 Blank slots

The three filled role descriptions are Branch Banker, Portfolio & Trust
Administrator, and Sr. Portfolio Specialist. The other five role descriptions
display "Description coming soon" in their cards. The unfilled
professional-blurb and contact-info footer slots render nothing. Other empty
blocks have no styled container, heading, filler text or marker.

**Rulings:** B47, B56, B64, B98, B105.
**Agent-derived:** the empty role-description placeholder is confined to
`.gm-desc`; the other unfilled slots remain absent from the rendered page.

### §10.4 The role coverflow carousel

This heading remains as a citation target. The current closed-ring carousel
is specified in §10.5.

**Rulings:** B92, B98.
**Agent-derived:** —

### §10.5 The role ring

The eight role components stand in one closed ring, 45° apart, turning around
a vertical axis. The checked role is the front card. One uniform unit scales
every component together against the `.clip` container. The cards are
transparent outside their own three plates; their description cards use the
smoked-glass treatment in §10.6.

| Value | Current rendering |
|---|---|
| Cards | All eight; one front card, the others fan behind it. |
| Card size | One standardized size and height for all roles. |
| Position | The front card is at z = 0; every other card's nearest edge is behind it. |
| Ring radius | `1.6 × --ring-w` desktop; `1.25 × --ring-w` at ≤743px. |
| Perspective | `3.6 × --ring-w`; camera origin `50% -12%`. |
| Depth and opacity | Depth brightness follows `0.12 + 0.88·c⁴`, where `c = (1 + cos a) / 2`; back-card opacity is `clamp(0.4, 1 + 0.85·cos a, 1)`. |
| Side-card text | Description text is transparent except on the front card and fades during a turn. |
| Turn | One role per click, wrapping at either end; ~500ms on `--ease`. CSS-only; some wrap and employer jumps turn the long way. |
| Reduced motion | Ring turns snap to the selected role. |
| Arrows | Outside the 3D context below the front card; previous on the left, next on the right. |
| Employer jumps | PNC Bank → role 3; PNC Private Bank → role 5; Brinker Capital → role 8. The employer card for the centred role glows. |
| Edges | The ring's projected span is clipped within the body. |
| Mobile | Same ring, full-bleed body; `.clip` is `96vw` high and the ring scales against it. |
| Empty roles | "Description coming soon" in italic light ink at 0.6 opacity. |

The checked role starts at role 1. On load, the ring makes one full turn over
about two seconds and settles on role 1 (§10.6). The employer cards act as
role-jump labels.

**Rulings:** B92, B93, B95, B98, B101.
**Agent-derived:** angle, spread and depth literals implement the ruled ring
relationships. The ring uses the checked role radio and CSS `:has` selectors;
the component scales uniformly through `--u`.

### §10.6 Quiet wonder

The ring's motion and light answer interaction while the gray page remains
quiet. Values below describe the current rendering.

| Area | Current rendering |
|---|---|
| Light pool (B99) | Cool moonlight behind the front card, outside the 3D context. Existing `--moon-a` channels; pool alphas `0.15 / 0.09 / 0.03 / 0` at `0 / 30 / 60 / 90%`, over `2.4 × 1.7` card widths. It dims to `0.45` at the midpoint of a 500ms turn, once on load. |
| Floor light (B99) | Ellipse `46% × 7%` at 79%, alpha `0.12 → 0.04 → 0`. |
| Click any card | Each visible side card has a label hit-area for its role radio; the front card's hit-area is hidden. |
| Hover: side card | Brightness increases by `0.2`; the card rises by `0.025 × --ring-w` without moving in front of the centre card. |
| Hover: employer card | `0 0 32px 4px` × `--rs` in `--glow-gray-a` at 0.9; 200ms shadow, filter and transform transitions. |
| Arrows | `2.5rem` square box; `0.85rem` chevron with 3px top/left strokes; light ink with `drop-shadow(0 0 4px)`. Hover nudge 3px; active scale 0.85 over 80ms. |
| Grounding | Per-slot `::before`, at `bottom: 62u`; `640 × 56u` radial black `0.85 → 0.45 → 0`. |
| Description card (B100) | `--card` fill at 78%, `--ink-light` text, `--frame` rim at 35%, moonlit top edge at 0.6 and inset line at 0.22; thumb `--frame`. The placeholder uses `--ink-light` at 0.6. The text-over-glass contrast is asserted by `test/career.js`. |
| Glimmer (B102) | `gm-marquee` on the checked/front card only, on `.gm-title` and `.gm-back` pseudo-elements. |
| Ambient | Static desaturated film grain on the page canvas; it never moves. |
| Footer | The CTA carries a resting `0 0 18px 2px` glow at 0.55 and a 2px hover lift; tools and education lines use `--ink-dim`. Transitions are 200ms. |
| Reduced motion | No arrival turn, glimmer, side-card rise, arrow hover nudge or arrow press scale, or CTA hover lift. The CTA's 2px active translation remains. Light, glass, shadows, grain and hover brightening remain. |
| Touch | Hover effects are limited to hover-capable devices; tapping a visible side card turns the ring. |

**Rulings:** B99, B100, B101, B102, B103, B105, B107.
**Agent-derived:** the pool dip keyframes are named per role so selecting a
role restarts the dip; the ambient grain is an SVG filter embedded in the CSS.

---

## §11 The Plants & Rocks page

`plantsandrocks.html` is razgregory.com's dual-page-reader page. It is a
static single file — all CSS inline, the typeface embedded as a data URI,
**no script** — built on `career.html` (§10) as the structural template: the
same `.topband` / `.topband__card` / `.topband__wordmark` /
`.topband__oneliner` / `.topband__tab` / `.topband__card-hit` /
`.parking-lot` / `.parking-lot__divider` / `.cta` grammar and the same CSS
`:has` radio mechanism.

**Rulings:** B48.

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

The selected-card glow uses `--frame` `#52997f` for its border and
`0 0 8px 0` bloom. Unselected text uses
`--ink-dim: rgb(244 245 241 / 0.55)`; the disabled Download control uses
0.55 opacity.

**Rulings:** B48, B50.

### §11.2 Regions

- **Header (two-page selector):** the shared band and title-card grammar is
  specified in §9 and re-tokened to the idea-green palette. The two cards are
  "Plants on Poles" (default checked) and "Plants in Rocks"; each carries
  its oneliner — "Monstera Division and Moss Pole Guide" / "Planting in
  Semi-Hydroponics With Pon" — in the `.topband__oneliner` slot. Unselected
  cards dim and italicize; the selected card uses the `--frame` glow. The
  header is `role="radiogroup"` (`aria-label="Choose a page"`); the page's
  one `h1` ("Plants & Rocks") is visually hidden.
- **Body (dual-page reader):** selection swaps between two reader containers,
  one per radio, driven by `:has`. The **Plants on Poles** reader embeds
  `monstera-storybook.html` in an
  `<iframe src="monstera-storybook.html" title="Monstera Division and Moss
  Pole Introduction">`; the storybook handles its own paging and ships without
  a top header band. The iframe fills the body region edge-to-edge (`width:
  100%`, no side gaps, `border: 0`) and sits below the title-card overhang,
  with `29 × --rs` plus `8 × --rs` clearance; this collapses to zero on
  mobile. The **Plants in Rocks** reader is an empty container with no styled
  content, placeholder, chevrons, or split furniture.
- **Footer (two sections):** the shared Parking Lot convention is in §9.
  This page has one divider bar. The **"Back to the Garden"**
  `.cta` links to `https://razgregory.com/` in the same tab and is live on
  both tabs. The **Download** `.cta` uses the career control's grammar with
  `background: var(--card)`, `color: var(--ink-light)`, and
  `box-shadow: var(--elevation), 0 0 6px 0 var(--frame)`; it is live on the
  Plants on Poles tab for `Flattened-Monstera-Division.pdf` via `download`.
  On Plants in Rocks it is inert with `opacity: 0.55`,
  `cursor: not-allowed`, and `pointer-events: none`. That state applies only
  to the Download anchor; Back to the Garden remains live on both tabs.

Transitions collapse under `prefers-reduced-motion: reduce`.

**Rulings:** B31, B46, B48, B49, B50, B57, B58, B82.

### §11.3 Blank slots

The Plants in Rocks reader is empty: no content, placeholder, images,
chevrons, or split furniture. The page carries non-rendering `SLOT` comments
for future fills; no copy is invented.

**Rulings:** B48, B57.
