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
| `--chrome` | `#020812` | the room behind the page — the rail's ground and any summoned surface | 0.0023 |
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
blue is the rail's primary fill — the **New board** button and the enabled
pager pair (B24) — and the binding the governing issue names as the hover
alternative. The v1 member, `--frame` `#698ebf`, stands below as superseded
history.

| Token | Value | Role |
|---|---|---|
| `--accent-page` (hover glow) | `#6d9cb0` | the hover glow's blue, blooming on hover — the brighter existing blue on `--chrome` (B25) |
| `--accent-page` (rail fill) | `#6d9cb0` | the rail's primary fill — the New board button and the enabled pager buttons (B24) |
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
`DECISIONS.md` B14). The member transcribed in v1: **the Idea ladder's `--note`
rung, `#b9d2b2`**, the lightest green the Idea family ships (`TheBoards'
UIUX.md §2.2.2`). This binding is **ruled final** (owner chat, 2026-09-29,
issue #78).

**Follow-up ruling (owner chat, 2026-09-29):** the press takes the hover's
full bloom geometry (`0 0 32px 4px` / `0.9`) in the green channels
(`--glow-green` #b9d2b2), with the elevation layer dropped — so the press
holds the bloom while the card sinks 1px, instead of contracting it.

### §2.6 Elevation

```css
--elevation: 0 2px 8px rgb(0 0 0 / 0.45);   /* pressed, transient only — hover's elevation is the bloom, §2.4 */
```

**Resting door-cards take no shadow** (§1). The rail is embedded in the page
and takes an inset treatment, not a float shadow.

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
corners (`border-radius: 0 0 3px 3px`); the rail's To Do tray takes the tray's
6px radius (TheBoards §10.5) and its board card the 3px hand.

### §2.9 Type

**Montserrat Alternates**, self-hosted, **no CDN** — the same face as
TheBoards. Three weights shipped: 400, 600, 800, Latin-subset woff2,
`font-display: swap`. May be embedded as a data URI to keep the single-file
law (`PRD §3.3`).

---

## §3 The page

### §3.1 The scene

One bounded sheet, no calendar rail, no hero (owner rulings). Reading top to
bottom: the **band** (water) with the **title compartment** overhanging its
rule, the **deep** through the middle where the **door-cards** sit in the
free board space, and the **Parking Lot** (water) closing the foot. The
**All Boards rail** sits beside the sheet (desktop), grounded in `--chrome`.

Everything is visible at once: one viewport, no internal scrolling. If the
sheet is full, it is full — that boundary is the point.

### §3.2 The band and the title compartment

The title compartment is the same title card as TheBoards (owner ruling):
overhangs the band's rule (`--frame`, full-width `left: 0; right: 0`),
bottom corners only, centred, **not a link, not a control** (no `role`, no
`tabindex`, no caret).

Its two lines, in order (B17, superseding B5; sizes and width per B19,
superseding the B17 sizes):

1. **"The Portfolio of"** — same size as the name: 15px, `line-height: 1.2`.
2. **"Robert Alastair Zeved Gregory"** — the title rung: 15px / **600**.

The compartment's two lines render at **one font size** (15px). Its width hugs
the title text: the `--frame` left/right borders close in on the text with
comfortable padding (`18px`), the card stays centred, and the interior never
exceeds the sheet minus the side gutters.

### §3.3 The regions

| Region | Render |
|---|---|
| Title | the compartment above (§3.2) |
| Components | TheBoards region, furniture present, contents **not yet ruled** — do not invent (PRD §2.6) |
| Requirements | TheBoards region, furniture present, contents **not yet ruled** — do not invent (PRD §2.6) |
| Parking Lot | water field closing the sheet; holds the contact form (§6) |
| All Boards rail | `--chrome`-grounded side rail, the single **To Do tray** — TheBoards' `.board-cat` construction carrying the Portfolio board card, the New board control and the pager `< ‹ 1/5 › »` (B24) |

### §3.4 The door-cards live in the board space

The six door-cards sit **in the free board space** — the empty canvas between
the regions — at the positions the owner's wireframe illustrates (owner
ruling, `B2`: "the empty space is literally FOR those cards"). The wireframe
is committed as an **illustrative reference only**:
[`docs/proofs/wireframe-illustration-2026-09-29.png`](proofs/wireframe-illustration-2026-09-29.png)
— it is not law; where the wireframe and this document disagree, this
document wins. The cards do **not** live inside Components, Requirements, or
the Parking Lot.

---

## §4 The door-card component

A door-card is a **real anchor** — `<a target="_blank"
rel="noopener noreferrer">` — not a scripted button. It renders as a TheBoards
note: `--note` fill, 2px border in the **note's own ink** (`var(--ink)`,
dark on this surface — the shipped `.note-text` border; the reference border
is ink, not `--frame`), 3px radius, `--ink-dark` text, draggable and
resizable for the visitor's entertainment only (no persistence, no state —
`B7`).

**Resize constraints** (issue #58, `B21`): a card may be dragged anywhere on
the sheet, and resized by its corner handle only between a **legible floor**
and a **one-fifth-of-viewport ceiling** — never below `132×80` (enough room
for ~3 lines of the 17px title) and never above `1/5` of the viewport width,
`1/5` of the viewport height. The floor and ceiling are independent per axis;
on a narrow viewport where `1/5` width falls below the legible floor, the
legible floor wins (a card smaller than legible is never produced).

### §4.1 States

| State | Render | Geometry partner (never colour alone) |
|---|---|---|
| **rest** | note surface, border in the note's own ink (`var(--ink)`), no glow, no underline | — the ink border itself is the resting edge |
| **hover** | blue bloom: `--accent-page` `#6d9cb0` at `0 0 32px 4px` / `0.9` — no second shadow layer (B14 hover member, settled by #67 → B25) | the bloom *is* the elevation — a temporary lifting, permitted by §1 |
|| **active (pressed)** | green bloom: `--glow-green` #b9d2b2 at `0 0 32px 4px` / `0.9` — no elevation layer (matches hover geometry, #67 follow-up ruling) | **1px inset** — the card presses into the page |
| **focus-visible** | a focus ring in the surface's ink (never a tint) | the ring is the geometry; keyboard users are never left to colour alone |

Transitions between states use TheBoards' closed motion set — short, quiet,
no bounce; nothing moves on its own after the interaction ends.

### §4.2 The six doors

| Card | Destination (all `target="_blank"`) | Status |
|---|---|---|
| Community | `https://earp-street-park.netlify.app` | live |
| Professional | `https://razgregory.com/career` | **stub** (built after the landing page, B4) |
| Writing | `https://substack.com/@theaboveaveragerob` | live |
| Software & AI | `https://alastairzeved.com` | live |
| Plants & Rocks | `https://razgregory.com/plantsandrocks` | **stub** (built after the landing page, B4) |
| Music | `https://open.spotify.com/artist/5R4lXpHs3OObGTFxdltrxZ` | live (owner's correction: Spotify, not Apple Music) |

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
- The pane's `--lot-h` grows to `180px` so the stacked pair fits
  comfortably (from `122px` when the three fields sat side by side).

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

- Every door-card is a real link: keyboard-focusable, announced by its
  visible name, `target="_blank"` with `rel="noopener noreferrer"`.
- Focus is a visible ring (§4.1), never a tint alone.
- The title compartment is not a control and must not be announced as one.
- Form fields carry labels; the Message field is `required` and announced so.
- Text contrast holds to §2.3's table on every surface it lands on.
- The rail's single To Do tray announces as one group — `aria-label="To Do,
  page 1 of 5"` — with the visual head and pager-state spans `aria-hidden` so
  AT hears each section once, not twice (the B63/B42 pattern from TheBoards).

---

## §8 What pins this document

| What is pinned | By |
|---|---|
| §2's tokens, ratios, crossover | `test/tokens.js` — recomputed from shipped hexes |
| card states, region layout, rail presence | `test/mobile.js`, `test/desktop.js` |
| the single To Do rail tray (B24) | `test/desktop.js` |
| card drag + resize floor/ceiling, link still opens a new tab | `test/movable_resizable.js` |
| no service worker | `PRD §3`, `DECISIONS.md` B13 — and the deliberate absence of `test/sw-update.js` |

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

The codebase's `UIUX §x` citations resolve to their own numbers here.
