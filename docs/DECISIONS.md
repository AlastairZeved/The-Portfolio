# DECISIONS.md — The-Portfolio

Where `PRD.md` / `UIUX.md` make a decision, it is followed exactly. This file
records every owner ruling — each resolved against the **product principles
in PRD §1** (one page, one scene · a card is a door · the medium is the
message · zero cognitive tax · play is permitted, work is not faked) and the
**governing design law in UIUX §1** (if you have to think about the
interface, it failed; every pixel earns its place).

> **This file is law, and law is stated by the owner, never authored by an
> agent.** Every entry below carries a `Source:` line quoting the owner's
> statement verbatim, per the record law (governing issue
> [The-Portfolio #51](https://github.com/AlastairZeved/The-Portfolio/issues/51)).
> An entry without a source line is not law — it is an agent invention and
> any QA pass may delete it on sight.
>
> **Append only.** An entry is superseded by a later ruling, never edited
> away.

---

### B1. One scene, one ladder binding: To-Do blue
The portfolio is one scene, not five board types — the whole site wears the
To-Do binding of TheBoards' design ladder. No hue rotation, no `[data-cat]`
rebinding; the page's `:root` is the only scope.

**Source:** owner's answer to the grill, 2026-09-29, issue #51 — "To-Do blue (the default scene, what TheBoards shows at rest)."

### B2. The door-cards live in the free board space
The six door-cards sit in the board's empty canvas — never inside the
Components, Requirements, or Parking Lot regions. The empty space is *for*
the cards.

**Source:** owner's answer to the grill, 2026-09-29, issue #51 — "They go in the board space, all the empty space, like in the screenshot you dunce. they don't go in components or requirements or the parking lot. the empty space is literally FOR those cards."

### B3. The six door-cards; every link opens in a new tab
Community → `earp-street-park.netlify.app`; Professional →
`razgregory.com/career`; Writing → `https://substack.com/@theaboveaveragerob`;
Software & AI → `alastairzeved.com`; Plants & Rocks →
`razgregory.com/plantsandrocks`; Music → **Spotify**
`https://open.spotify.com/artist/5R4lXpHs3OObGTFxdltrxZ`. Each is a real
`<a target="_blank" rel="noopener noreferrer">`.

**Source:** owner's answer to the grill, 2026-09-29, issue #51 — "(Community
(earp-street-park.netlify.app), Professional (razgregory.com/career), Writing
(https://substack.com/@theaboveaveragerob), Software & AI
(alastairzeved.com), Plants & Rocks (razgregory.com/plantsandrocks), Music
(https://music.apple.com/us/artist/aboveaveragerob/1815357064). Every link
opens in a new tab.)" — and the mid-session correction, same issue: "the
Music link should not be a link to apple music, it should be spotify -
@url:https://open.spotify.com/artist/5R4lXpHs3OObGTFxdltrxZ". The Spotify URL
supersedes the Apple Music URL.

### B4. razgregory.com sub-pages are stubbed
The Professional and Plants & Rocks cards link to stubs; the sub-pages
themselves are built only after the landing page is finished.

**Source:** owner's answer to the grill, 2026-09-29, issue #51 — "For the
razgregory.com sub pages, they just need to be stubbed for now - we build
those only after the landing page is finished."

### B5. The title card (SUPERSEDED by B17)
"The Life of Robert Alastair Zeved Gregory" — "the life of" first line,
"Robert Alastair Zeved Gregory" second line. Same title card as TheBoards;
not a link, not a control. **Superseded by B17** ("The Portfolio of" /
"Robert Alastair Zeved Gregory"), issue #51, 2026-09-29.

**Source:** owner's answer to the grill, 2026-09-29, issue #51 — "The title
card is 'The Life of Robert Alastair Zeved Gregory' where 'the life of' is
the first line and then 'Robert Alastair Zeved Gregory' is the second line of
the title. The title card is not a clickable card, it literally is the same
title card as TheBoards."

### B6. The Parking Lot's contact form
A Formspree form: Name (optional), Email (optional), Message (required),
with proper captcha and bot protections (reCAPTCHA on by default at
Formspree plus the `_gotcha` honeypot; `UIUX §6`).

**Source:** owner's answer to the grill, 2026-09-29, issue #51 — "The parking
lot gets a Formspree form as a contact me that asks for Name (optional),
email (optional), and message (required) with proper captcha and bot
protections."

### B7. Static advertisement — the site is not the app
No import/export, no "new Boards", no note-card button row. Notes remain
resizable and draggable for the visitor's entertainment only — not functional
purpose.

**Source:** owner's answer to the grill, 2026-09-29, issue #51 — "This should
be a functional advertisement for TheBoards, just static (no import/export,
no 'new Boards', no note card button row for editing notes. Notes remain
resizeable and dragable (but that's literally just for user entertainment,
not functional purpose)."

### B8. All design tokens are TheBoards' tokens, unchanged
No new tokens in v1. The full ladder, ink pair, accents, radius grammar and
typeface carry from TheBoards verbatim (`UIUX §2`, `UIUX §2.8`, `UIUX §2.9`).

**Source:** owner's answer to the grill, 2026-09-29, issue #51 — "All design
tokens are the same for now.. We may add more later if new functions pop up
needing them, but everything is the literal exact same right now."

### B9. Refusals: TheBoards' plus four
The site refuses everything TheBoards refuses (accounts, sync, sharing, tags,
folders, search, filters, rich text, images, snapping, reminders, due dates,
an infinite canvas, settings, a theme switch) **plus**: no blog/CMS, no
analytics, no comments, no newsletter signup.

**Source:** owner's answer to the grill, 2026-09-29, issue #51 — "Same plus:
no blog/CMS, no analytics, no comments, no newsletter signup."

### B10. Governing law: TheBoards' law, unchanged
"If you have to think about the interface, it failed. Every pixel earns its
place." plus "Identity from structure, never costume."

**Source:** owner's answer to the grill, 2026-09-29, issue #51 — "Same
governing law as TheBoards."

### B11. The record law is identical to TheBoards'
Agents never author DECISIONS.md entries; they transcribe owner statements
with `Source:` lines. An unsourced entry is deletable invention.

**Source:** owner's answer to the grill, 2026-09-29, issue #51 — "Yes,
identical rule" (to TheBoards' AGENTS.md record law).

### B12. One file: index.html, all CSS and JS inline
The whole build is a single HTML page, exactly as TheBoards is a page — but
one file, not a module tree.

**Source:** owner's answer to the grill, 2026-09-29, issue #51 — "Single
index.html with inline CSS/JS (truly one file)."

### B13. No service worker — a static page
No service worker, no PWA, no offline caching. Therefore the sw-update test
suite (whose subject is the SW `CACHE` string) is deliberately not carried;
the other three suites are.

**Source:** owner's answer to the grill, 2026-09-29, issue #51 — "No service
worker — just a static page." (and, on the suites: "Yes, identical to
TheBoards" — reconciled: the sw-update suite has no subject in a repo with no
service worker.)

### B14. Door-card hover and click states (new, beyond TheBoards)
Hover: a **blue glow** appears, drawn from the existing blue tokens — never a
new colour or token. Click (pressed): the card presses **1px inset** and the
glow shifts to a light **"go" green** pulled from the Idea boards' colour
family — never a new colour or token. Member bindings **confirmed by the
owner**: hover glow = `--frame` `#698ebf`; click green = Idea `--note`
`#b9d2b2` (`UIUX §2.4`/`§2.5`).

**Source:** owner's answer to the grill, 2026-09-29, issue #51 — "Hover -
blue glow appears (from the existing blue design tokens already established,
not a new one). Click = pressed 1px inset + glow shifts to a light 'go' green
on click (pull from the idea boards color family, don't invent a new color or
design token)." — bindings confirmed on issue #51, 2026-09-29: "Confirm both:
hover = --frame #698ebf, click = Idea --note #b9d2b2."

### B15. The All Boards rail: empty categories, not scoped
The rail shows the four board categories (To Do, Notes, Learning, Ideas) with
no boards in them. Its contents are a future problem; it is not scoped until
the landing page is done.

**Source:** owner's answer to the grill, 2026-09-29, issue #51 — "The rail
has empty board categories right now: all four categories still exist there
just aren't any boards in them yet. That's a future problem, not a right now
problem. The rail doesn't get scoped until you can manage to get the landing
page done correctly since you fucked it up so horribly last time."

### B16. Deployment: deploy-branch topology
[Netlify production = the `deploy` branch](https://github.com/AlastairZeved/The-Portfolio/tree/deploy);
`main` publishes by deliberate promotion to `deploy`. Repository root is the
publish root.

**Source:** owner's answer to the grill, 2026-09-29, issue #51 — "The
deploy-branch topology (Netlify production = deploy branch)."

### B17. Title card text: "The Portfolio of Robert Alastair Zeved Gregory"
The title card reads — line 1: **"The Portfolio of"** (secondary rung,
10px); line 2: **"Robert Alastair Zeved Gregory"** (title rung, 15px/600).
Same title-card component as TheBoards; not a link, not a control.
**Supersedes B5.**

**Source:** owner's answer to the grill, 2026-09-29, issue #51 — "a title card
that reads 'The Portfolio of Robert Alastair Zeved Gregory' with 'The
Portfolio of' being the top line and my name as the second line of the
title. ... this is a change from the previous 'The Life of...' and we are
replacing the term 'life' with 'Portfolio'." — and the owner's confirmation,
same issue: "Yes, B5 superseded — new title is law."

### B18. The All Boards rail: To Do holds the Portfolio board
The To Do category of the All Boards rail holds the portfolio's landing-page
board — **"The Portfolio of Robert Alastair Zeved Gregory"** — as a filled
board card in the To-Do blue family (`--card` ground, `--frame` edge, `--ink`
text, 3px radius). It sits in the "To Do" category (`issue #60`). This
supersedes B15 **for the To Do category only**: Notes, Learning, and Ideas
remain empty until separately scoped.

**Source:** owner's issue #60, 2026-09-29 — "The Portfolio of Robert Alastair
Zeved Gregory is a board without a home ... the landing page board belongs in
the 'To Do' boards section of the rail. Add it."

---

## The build (issue #53)

The landing page is built from these rulings in one single-file
`index.html`. The rail shows four empty categories (B15); Components and
Requirements render furniture only (PRD §2.6); the six door-cards sit in the
free board space (B2, B3); the Parking Lot holds the Formspree form, action
`https://formspree.io/f/xppwbrga` (B6); card states per B14. Two on-brand
under-construction stubs (`career.html`, `plantsandrocks.html`) are built in
this repo for the deferred razgregory.com destinations (B4).
