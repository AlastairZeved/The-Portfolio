# PRD.md — The-Portfolio

**Status:** v1, written from the owner's rulings of 2026-09-29 (governing
issue: [The-Portfolio #51](https://github.com/AlastairZeved/The-Portfolio/issues/51)),
before the first build. The site does not exist yet; this document is the
specification it will be built against, not a reconstruction.

**How to read this with the other records.** `docs/DECISIONS.md` is the
binding, cumulative record of every owner ruling. Where this document and
`DECISIONS.md` disagree, **`DECISIONS.md` wins** — it is the later,
issue-tied ruling. This document exists to say what the site *is* and what it
is *for*, so that a new ruling has something to resolve against.

`docs/UIUX.md` is the third record and the **rendering authority**: it holds
every value the site draws with. This document holds positions; where a value
appears here it is quoted from `UIUX.md`, never authored here.

Sections are numbered so decisions can cite `PRD §x`.

---

## §1 Principles

Five product principles. Every ruling in `DECISIONS.md` resolves against
these.

1. **One page, one scene.** The site is a single bounded sheet — an HTML page
   like TheBoards, with no calendar rail. Everything reachable lives on that
   one sheet; there is nothing behind it.
2. **A card is a door.** Every door-card is a real link that opens in a new
   tab. Nothing that looks actionable is inert, and the one inert element
   (the title card) does not look actionable: it is the same title card as
   TheBoards.
3. **The medium is the message.** The site is built in TheBoards' own design
   language — the same tokens, the same regions, the same typeface — and is
   itself a working, static advertisement for TheBoards. Identity comes from
   structure, never costume.
4. **Zero cognitive tax.** The interface asks nothing: no menus, no settings,
   no onboarding, no state to interpret. If you have to think about the
   interface, it failed.
5. **Play is permitted; work is not faked.** Notes may be dragged and
   resized for the visitor's delight, but nothing persists, nothing syncs,
   nothing is computed. The staticness is the point.

And the governing design law, which `UIUX.md` implements:

> **If you have to think about the interface, it failed. Every pixel earns
> its place.**

### §1.1 Emotional identity

The five principles say what the site *does*. This says what it should *feel*
like, and it is equally binding.

**The register is TheBoards' register: peaceful fondness — calm water, at
depth and at dusk.** The palette is dark, and that is deliberate. Deep water
is peaceful; a bright white hub page is not. The page reads top to bottom as
one scene — water closing each end of the sheet, the deep between — and the
door-cards are the lit things on the deep, like the notes on a board (owner
ruling, `DECISIONS.md` B8: the site wears the To-Do ladder's one blue
binding).

This identity does **not** license decoration. Peace is produced by
restraint, depth and consistency, not by ornament.

### §1.2 Design principles, numbered

The five principles of §1, named for citation — `P1`…`P5` — each with the
violation that would break it:

| # | Principle | Example violation |
|---|---|---|
| P1 | **One page, one scene** | A second page, a calendar rail, a hero, a scroll-driven narrative, routing |
| P2 | **A card is a door** | A card that is not a link; a card that navigates the same tab; an inert element styled like a card |
| P3 | **The medium is the message** | A new token, new component, or stylization that TheBoards does not have — absent an owner ruling |
| P4 | **Zero cognitive tax** | Settings, menus, onboarding, a theme switch, an empty state that asks to be interpreted |
| P5 | **Play is permitted; work is not faked** | Persistence, import/export, a "new board" affordance, a note-card edit row, undo, any stored state |

### §1.3 What would feel wrong

If the site ships with any of these it has failed, regardless of technical
correctness:

- A **loading state, spinner or skeleton** anywhere.
- **Anything that congratulates the visitor.**
- A **settings screen.**
- The page feeling **bright, clinical, or like a SaaS landing page**.
- **Decoration that does no job.**
- Door-cards that **move themselves** — only the visitor may move them, and
  nothing moves on its own.
- An **empty region that looks broken.** A blank region is the correct state
  of a blank region.

### §1.4 North star

- **Feel:** peaceful fondness — a place you are glad to return to.
- **Imagery:** calm water at depth and at dusk. That is why the palette is
  dark. **The door-cards are the lit things on the deep.**
- **Personality:** quiet, exact, unhurried, uninterested in your attention.
- **What this does not license:** decoration.

### §1.5 Taste decisions

| Decision | Choice | Rationale |
|---|---|---|
| Theme | **Dark only.** One identity, no choice to make | P4 forbids the setting |
| The cards' colour | The brightest surface on the page (TheBoards' `--note` rung, To-Do binding) | They are the only things the visitor *uses* |
| Destructive colour | `--danger` is carried from TheBoards but the site has no destructive action | It is not drawn until a ruling gives it a job |
| Symbols | Drawn or text per TheBoards' own grammar; never a new mark invented here | P3 |
| Motion | A closed set of transitions from TheBoards; it does not grow | Nothing else has earned its place |

---

## §2 Users and scope

### §2.1 Who it is for

The owner's portfolio — the **central hub for his scattered pseudonyms and
websites all around the internet** (owner's words, governing issue #51).
Audience: visitors landing from anywhere in that scattered presence who should
find every door in one place. There is one page, and it is everyone's front
door.

### §2.2 In scope

A single static `index.html` (all CSS and JS inline, truly one file — owner
ruling, `DECISIONS.md` B12) that renders TheBoards' four regions — **Title,
Components, Requirements, Parking Lot** — plus the **All Boards rail**, with
six door-cards in the free board space linking out to the owner's sites, and a
Formspree contact form in the Parking Lot.

- **Title card:** "The Portfolio of" / "Robert Alastair Zeved Gregory" — two
  lines (B17, superseding B5), the same title card as TheBoards, not a link.
- **Six door-cards** (`DECISIONS.md` B3), each a real link opening in a new
  tab: Community, Professional, Writing, Software & AI, Plants & Rocks,
  Music.
- **Contact form** (`DECISIONS.md` B6): Name (optional), Email (optional),
  Message (required), with Formspree's captcha and bot protections.
- **Notes that drag and resize** — entertainment only, no persistence
  (`DECISIONS.md` B7).

### §2.3 Out of scope, and why

All of TheBoards' refusals carry, plus the portfolio's own. Each refusal is
argued here — boundedness is a feature of this site, not a gap.

| Not built | Reason |
|---|---|
| Accounts, sync, sharing, collaboration | There is no backend; adding one changes what the site is |
| Tags, folders, search, filters, auto-grouping | P2, P4 — the six cards are the whole index |
| Rich text, images, attachments, drawing | P5 — static is the point; and TheBoards refuses them too |
| A blog / CMS | Owner ruling (issue #51) — Writing is a door to Substack, not a feature here |
| Analytics / tracking | Owner ruling (issue #51) — this page asks for nothing and reports nothing |
| Comments | Owner ruling (issue #51) |
| Newsletter signup | Owner ruling (issue #51) |
| Snap, alignment guides, auto-layout | Notes overlap freely; the visitor places them, entertained |
| Due dates, reminders, streaks, recurring anything | TheBoards' refusal, carried; no calendar rail (owner ruling) |
| Infinite canvas, pan, zoom | Boundedness is the feature — one page you can see all of |
| A framework, bundler, package manager, dependency | One file, inline, no build (owner ruling) |
| Settings, preferences, a theme switch | P4 — one identity, no choice to make |
| A service worker, PWA manifest, offline caching | Owner ruling (issue #51): no service worker, just a static page |
| Import/export, a "New Boards" affordance, a note-card edit row, undo | Owner ruling (issue #51): the site is not the app; it advertises the app |

### §2.4 Success

The site succeeds if a visitor who lands on it can reach every one of the
owner's six doors in a single glance, understands without instruction that
each card is a door, and leaves with the sense that the page itself is
evidence of the tool it advertises. Everything else is secondary.

### §2.5 Deferred, with reason

| Deferred | Why it is not here |
|---|---|
| `razgregory.com/career` and `razgregory.com/plantsandrocks` destinations | Owner ruling (issue #51): "they just need to be stubbed for now — we build those only after the landing page is finished." The cards exist and link to stubs |
| All Boards rail content | Owner ruling (issue #51): the rail shows the four empty board categories — "a future problem, not a right now problem." The rail is not scoped until the landing page is done |

### §2.6 Not yet ruled — do not invent

The following were **not** ruled by the owner and therefore have **no law
yet**. Agents must not fill them by invention; they are open questions to be
resolved by ruling before or during the build:

- **The contents of the Components and Requirements regions.** The owner ruled
  the regions exist and that the door-cards do **not** live inside them (they
  live in the free board space, `B2`); he did not rule what the regions
  themselves hold. Until ruled, render the regions as TheBoards renders
  them — furniture present, contents absent (a blank region is the correct
  state of a blank region).
- **The exact hover/click treatment of the door-cards beyond the owner's
  words.** The family rule is ruled (`B14`); the two member bindings are
  transcribed in `UIUX.md §4` and are pending one-word confirmation on issue
  #51. Do not invent a third.

---

## §3 Platform

### §3.1 Devices

A plain static web page. One bounded sheet that scales to fit wide screens and
stacks into the same scene on narrow ones, mirroring TheBoards' own support.
No PWA, no offline story, no installability (owner ruling).

### §3.2 Hosting

The deploy-branch topology: **[Netlify production = the `deploy`
branch](https://github.com/AlastairZeved/The-Portfolio/tree/deploy)** (owner
ruling, `DECISIONS.md` B16); `main` is the source of truth and publishes by
deliberate promotion to `deploy`. The repository root is the publish root.

### §3.3 Dependencies

None. No frameworks, no bundler, no package manager, no runtime
dependencies, no service worker. The typeface (Montserrat Alternates) is
self-hosted, no CDN, per TheBoards' own dependency rule; if single-file purity
requires it, the font may be embedded as a data URI (the Earp-Street-Park
precedent, `AGENTS.md`).

### §3.4 Network calls

Exactly one: the contact form's POST to Formspree. Nothing else leaves the
page. (Formspree reCAPTCHA is on by default; the form uses the standard
`_gotcha` honeypot; and the site must never set a `no-referrer` /
`same-origin` referrer policy, which would make Formspree file every
submission as spam.)

---

## §4 The regions

1. **Title** — the title card: "The Portfolio of" / "Robert Alastair Zeved
   Gregory", two lines (B17), same title card as TheBoards, never a link (B5
   superseded).
2. **Components** — a TheBoards region, present in the scene (§2.6 —
   contents not yet ruled; open question).
3. **Requirements** — a TheBoards region, present in the scene (§2.6 —
   contents not yet ruled; open question).
4. **Parking Lot** — closes the sheet; holds the Formspree contact form
   (B6).
5. **All Boards rail** — present with the four board categories (To Do,
   Notes, Learning, Ideas), empty; contents not scoped (B15).

The six door-cards sit **in the free board space** — the empty canvas
between the regions — never inside Components, Requirements or the Parking
Lot (B2).

---

## §5 Behavior

- **Door-cards:** real anchors, `target="_blank"`, open the owner's sites in
  a new tab (B3). Rest / hover / active states per `UIUX.md §4` (B14).
- **Notes (for entertainment):** draggable and resizable on the canvas;
  positions are not stored; nothing persists on reload; no undo; no menu
  (B7).
- **Contact form:** Name (optional), Email (optional), Message (required);
  submits to Formspree with captcha and bot protections (B6).
- **Nothing else.** No capture, no completion, no scratch-out, no export, no
  boards list, no navigation. The OS back button has nothing to go back to.

---

## §6 Success is measured by

- All six doors reachable in one glance and one click each.
- Zero invented design values: every rendered token resolves in `UIUX.md`.
- The three suites (`test/tokens.js`, `test/mobile.js`, `test/desktop.js`)
  pass; there is deliberately no `sw-update.js` (no service worker, B13).
- The deployed `deploy` branch serves byte-identical content to `main` at
  the promoted sha.
