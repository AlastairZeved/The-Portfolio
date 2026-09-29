# PRD.md — The Portfolio

What the site is, who it is for, and what it refuses. `UIUX.md` says what it
renders and wins on rendering; `docs/DECISIONS.md` holds the rulings of
record. This document answers the "why".

## What this is

Robert A. Gregory's portfolio — five boards from the *Zeved Boards* app,
rendered read-only on the web from one shared engine, built to the app's own
written design contract. Live at <https://razgregory.netlify.app>.

## Who it is for

Visitors — recruiters, collaborators, the curious — who navigate the boards
and can do nothing else, and the owner, who publishes deliberately. The site
is a well to look into, not a surface to work on: the one interactive element
is the parking-lot contact form, and that is a form field, not a board note
(#9).

## Principles

1. **Read-only is the product.** Visitors navigate; nothing is editable. The
   app's editing chrome — note toolbar, trash, clock, New board,
   Export/Import, Collapse, drag and resize — is deliberately not built.
2. **The reference is the spec.** TheBoards' implementation and the owner's
   wireframes are the arbiter of every rendering question. Values are
   measured from the reference, never sampled from screenshots and never
   invented.
3. **No invented design.** Every element, property, declaration, colour,
   border, weight and state traces to a ruling in `docs/DECISIONS.md`, an
   issue, or the reference implementation. Anything else is a defect by
   construction.
4. **Offline-first, dependency-free.** No framework, no build step, no
   bundler, no CDN. Fonts are self-hosted. The site is a folder you can
   serve.
5. **Publishing is deliberate.** `main` is the working branch and publishes
   nothing; the site changes only when a `main` → `deploy` pull request is
   merged on purpose.

## Scope statement

Read-only rendering of the five boards, on desktop fine-pointer viewports
≥1024px wide. Touch and sub-desktop viewports are **out of scope** — the
README's open decision, carried here as a scope statement per issue #49.

## Out of scope

Every refusal argued, with its citation. An entry without a citation is a
preference, not a refusal — and preferences lose to rulings.

| Refusal | Why | Citations |
|---|---|---|
| **Invented design** — any element, property, declaration, colour, border, weight or state not named in a ruling, an issue, or the reference implementation | Every invention incident shipped a defect the owner had to catch by eye: an invented permanent resting ring, an invented top border on the band title, an invented 219px title card against the wireframe's 455px, two sections merged into one, an All Boards menu that did not match the wireframe | #35/#36, #31/#33, #28/#29, #17/#20, #43/#47, #49 |
| **Editing chrome** — note toolbar, trash, clock, New board, Export/Import, Collapse, drag, resize, any board editing | Read-only portfolio. The one interactive element is the contact form's textarea — a form field, not a board note | #9 |
| **Frameworks, build steps, bundlers, CDNs** | The site is vanilla HTML/CSS/JS, served as a folder; a dependency is a liability the design does not need | PR #2, PR #15 |
| **Remote fonts** | Fonts are self-hosted (`assets/fonts/`, three weights of Montserrat Alternates); offline-first is product law. Held pending owner ratification as a `B<n>` entry (#49) | PR #2 |
| **Monospace on the ASCII-art notes** | The five ASCII column-art notes render ragged in Montserrat Alternates by design; a monospace face there is a regression, not a fix. Held pending owner ratification as a `B<n>` entry (#49) | #9 |
| **Light theme, theme switch** | Dark-only. The design has one identity; a theme is a question, and the site asks nothing of the visitor | #49; `UIUX.md` §2.1 (TheBoards' DECISIONS.md B16 retired) |
| **A fifth board type (Calendar)** | Four token ladders only — TODO, IDEA, NOTE, LEARNING. Calendar is TheBoards'-only | #49 |
| **Touch and sub-desktop support** | Scoped to fine-pointer ≥1024px; the rail staying 300px at a 390px viewport is an open decision, not a defect | #49 |
| **Auto-publish on push** | Publishing is a `main` → `deploy` pull request merged on purpose; both branches are protected by the "published branches" rule so the merge stays deliberate | PR #26, PR #34, PR #38, PR #40, PR #42, PR #48 |
| **Server-side features beyond the contact form** | The form stays Formspree at its ruled endpoint; there is no backend and no account surface | #9 |
