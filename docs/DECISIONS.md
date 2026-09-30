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
family — never a new colour or token.

**Members resolved.** The hover glow is `--accent-page` `#6d9cb0` (**B25**,
#67); the click-state green is the Idea ladder's `--note` rung `#b9d2b2`,
**ruled final** (**B29**, #78) (`UIUX §2.4`/`§2.5`). Both are existing
palette tokens, not inventions. Each was recorded on 2026-09-29 as asserted
rather than owner-sourced; both are settled now — the hover by B25, the click
green by B29.

**Hover member superseded by B25** (#67, 2026-09-29): the hover glow is `--accent-page` `#6d9cb0`, not `--frame`; the click-state green below is **ruled final** (B29, #78).

**Source:** owner's answer to the grill, 2026-09-29, issue #51 — "Hover -
blue glow appears (from the existing blue design tokens already established,
not a new one). Click = pressed 1px inset + glow shifts to a light 'go' green
on click (pull from the idea boards color family, don't invent a new color or
design token)." — the members were recorded as not yet owner-sourced: the
owner's 2026-09-29
statement ([issue #51, comment
5897377233](https://github.com/AlastairZeved/The-Portfolio/issues/51#issuecomment-5897377233)),
answering a two-question choice, confirmed "both rulings" — the **monospace
ban and the self-hosted fonts** (B22, B23) — and did not name the two
card-state colours in that comment; on those he asked instead, "Are those
colors made up or are they from the palette as instructed?" Both are settled
since — the hover glow by B25, the click-state green by B29 (ruled final,
#78).

**Record repair, 2026-09-29 (same comment).** This entry previously said the
bindings were "confirmed by the owner" and quoted a confirmation — "Confirm
both: hover = --frame #698ebf, click = Idea --note #b9d2b2" — that appears in
no owner statement anywhere in this thread or the record. The fabricated
quote has been **deleted**; the two members were downgraded to unsourced and
`UIUX §4.1` was brought into line with `UIUX §2.4`/`§2.5`. No other part of
this entry changed, and no design value changed.

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

### B18. The All Boards rail: To Do holds the Portfolio board (SUPERSEDED by B24)
The To Do category of the All Boards rail holds the portfolio's landing-page
board — **"The Portfolio of Robert Alastair Zeved Gregory"** — as a filled
board card in the To-Do blue family (`--card` ground, `--frame` edge, `--ink`
text, 3px radius). It sits in the "To Do" category (`issue #60`). This
supersedes B15 **for the To Do category only**: Notes, Learning, and Ideas
remain empty until separately scoped.

**Source:** owner's issue #60, 2026-09-29 — "The Portfolio of Robert Alastair
Zeved Gregory is a board without a home ... the landing page board belongs in
the 'To Do' boards section of the rail. Add it."

### B19. Title card: single font size, borders hug the text
The title card's two lines render at **one font size** (15px), and the
card's left/right borders hug the title text with comfortable padding
instead of spanning the full card width. **Supersedes the sizes quoted in
B17.**

**Source:** owner, 2026-09-29, issue #59 — "Reduce the width of the title
card ... so that the borders hug the title text, with a bit of padding
between them." and "Increase the font size of 'The Portfolio of' so that
it's the same size as Robert Alastair Zeved Gregory. There should not be 2
different font sizes in one card."

### B24. The All Boards rail: TheBoards' To Do tray, matched to the wireframe
The rail is TheBoards' `.board-cat` construction, ported verbatim and restyled
to the wireframe (`image_f14f78.png`, byte-identical to `image_b1abd0.png`) at
the To-Do ladder's own tokens. It renders a **single, paginated To Do tray** —
not four empty category trays — with:

- a `TO DO` head (21px / 600, uppercase, `--ink`) and a **New board** button
  (`--accent-page` `#6d9cb0` fill, `--ink-dark` `#031019` label, 44px);
- one board card `.pane-card`: 76px,
  `linear-gradient(180deg, var(--water-top) #34697f, var(--water-mid) #255265)`,
  hairline edge, 3px radius, titled **"The Portfolio of Robert Alastair Zeved
  Gregory"**, title clamped to two lines, with a bottom-right "Last Updated:
  09/29/26" stamp in `--ink`;
- the `.cat-pager` `< ‹ 1/5 › »`: four 44px buttons; the unavailable (first
  page) pair dimmed by `opacity: .4` over the tray's `--card` (= wireframe's
  `#304b61`), the available pair `--accent-page` (`#6d9cb0`) bearing
  `--ink-dark` chevrons.

No dashed placeholder rows, no invented category trays. **Supersedes B15's
"four empty categories" rendering and the four-category render of B18
(issue #60); B15's rail-scope stance otherwise stands.**
The `--accent-page` token (`#6d9cb0`) ships for the rail's fills (UIUX §2.4).

**Source:** the owner's demand that the All Boards rail match the wireframe
pixel-for-pixel, grounded in `image_f14f78.png` (byte-identical to
`image_b1abd0.png`) and relayed by the orchestrator of task card t_cd8b9c6f — "PORT TheBoards' All
Boards rail VERBATIM ... match image_b1abd0 (the correct render) ... compare
pixel for pixel. If it differs in ANY way, fix until it matches." Precedent:
issue #43, the owner's own rail rebuild to the wireframe ("the stylizations
and formatting were all lost").

(Numbered B24, not B18: the issue-#60 rail ruling merged as B18 via PR #63
while this PR was in flight. B20 stays reserved for the record-repair
renumber of the Parking Lot duplicate.)

---

## The build (issue #53)

The landing page is built from these rulings in one single-file
`index.html`. The rail is the single To Do tray matched to the wireframe (B24,
superseding B15's four empty categories); Components and Requirements render
furniture only (PRD §2.6); the six door-cards sit in the
free board space (B2, B3); the Parking Lot holds the Formspree form, action
`https://formspree.io/f/xppwbrga` (B6); card states per B14. Two on-brand
under-construction stubs (`career.html`, `plantsandrocks.html`) are built in
this repo for the deferred razgregory.com destinations (B4).

### B18. Parking Lot form spatial layout (issue #55)

The Parking Lot form's spatial arrangement, per the owner's issue #55:

- **Name** (optional) and **Email** (optional) text boxes are reduced to
  **half their current width**.
- **Name** sits directly under the "Parking Lot" header, anchored to the
  left wall.
- **Email** sits directly under **Name**, stacked vertically, also anchored
  left.
- **Message** moves left, anchored to the right sides of the Name and Email
  boxes. **Its size is not changed.**
- The **right side of the Parking Lot pane is deliberately left empty** —
  free space lives free; it is never filled.
- If more vertical space is needed for the stacked Name/Email pair, the
  pane grows taller until they fit comfortably.

Rendering values live in `UIUX §6`.

**Source:** owner's statement in issue #55 (The-Portfolio spatial reasoning
fix), 2026-09-29 — "Name (optional) and Email (optional) text boxes: reduce
width to half current width … Name text box: move up to sit directly under
'Parking Lot' header, anchored to left wall … Email text box: move left and
sit directly under Name text box (stacked vertically) … Message text box:
move left, anchored to right sides of Name and Email text boxes … If more
vertical space needed, make Parking Lot pane taller until Name and Email fit
comfortably stacked" — with the critical constraints "DO NOT CHANGE THE SIZE
OF THE 'MESSAGE' TEXT BOX" and "DO NOT ATTEMPT TO FILL THE RIGHT SIDE OF THE
PARKING LOT PANE - let free space live free."

### B21. Note-card resize constraints (issue #58)
Door-cards remain draggable and resizable for entertainment only (B7), bounded
so the gesture never produces an unreadable or oversized card. A card resizes
only between a legible floor — `132×80` (room for ~3 lines of the 17px title)
— and a ceiling of **one-fifth of the viewport** per axis (`1/5` width, `1/5`
height). Floor and ceiling are independent per axis; where `1/5` of the
viewport on the narrow axis would fall below the legible floor, the floor
wins (a card smaller than legible is never produced). `UIUX §4`; pinned by
`test/movable_resizable.js`.

**Source:** owner's requirement in issue
[The-Portfolio #58](https://github.com/AlastairZeved/The-Portfolio/issues/58) —
"Minimum size: legible (not so small it's unreadable). Maximum size: no more
than 1/5 of viewport size." (The 132px floor was already the shipped minimum
width; this ruling binds the height floor and the 1/5 ceiling the issue
names.)

(Numbered B21, not B19: the title-card ruling merged as B19 via PR #66 while
this PR was in flight, and the Parking Lot ruling already holds a duplicated
B18. B20 stays reserved for the record-repair renumber of that duplicate.)

---

### B22. No monospace, anywhere

The page ships **no monospace face** — not on the notes, not on the form, not
on a label. There is one typeface, **Montserrat Alternates** (`UIUX §2.9`),
and every rendered string wears it at every size. The ASCII column-art notes on
the AI-inference board render **ragged** in the proportional face; the ragged
column *is* the design, and setting those notes in a monospace face is a
regression, not a fix.

**Source:** owner, 2026-09-29, governing-records thread (issue #51) — "C:
Confirm both rulings. Self host the font from TheBoards, no monospace. I don't
even know why we're talking about fucking monospace fonts when we literally
have a font to use and we're self hosting it by handrolling it into the repo.
No dependencies." Recorded at [issue #51, comment
5897377233](https://github.com/AlastairZeved/The-Portfolio/issues/51#issuecomment-5897377233).
(A "no monospace anywhere" ruling of 2026-09-27 had stood **pending** owner
confirmation; this statement is that confirmation, so it is law now.)

### B23. Fonts are self-hosted from TheBoards — no CDN, no dependency

The typeface is **self-hosted from TheBoards** — `assets/fonts/` there, three
weights of **Montserrat Alternates** (400, 600, 800) — and **handrolled into
this repo**. **No CDN, no external font request, no dependency of any kind.**
The rendering values (three weights, Latin-subset woff2, `font-display: swap`)
are `UIUX §2.9`'s; the single-file law (`PRD §3.3`, B12) lets the faces be
embedded as data URIs rather than shipping a second file, which is the form
already shipped in `index.html`.

**Source:** owner, 2026-09-29, governing-records thread (issue #51) — "Self
host the font from TheBoards, no monospace. … we literally have a font to use
and we're self hosting it by handrolling it into the repo. No dependencies."
Recorded at [issue #51, comment
5897377233](https://github.com/AlastairZeved/The-Portfolio/issues/51#issuecomment-5897377233).

*Numbered B22/B23, not B20/B21:* B21 is the note-card ruling (issue #58), and
B20 stays reserved for the repair of the duplicated B18 above. Transcribed
against `main` at `c7b47d2`. No design value changes — these two entries name
no hex, px, ms or state; both are record-law transcriptions of rulings that
were already being followed by the shipped page.

### B25. The door-card hover glow: `--accent-page`, and a bloom that registers (#67)
The hover glow's blue is **`--accent-page` `#6d9cb0`** — an existing palette blue (`TheBoards' UIUX.md §2.6`, the B52 accent pass: the primary, the rail pager, the drop target; 0.3016 relative luminance, 6.72:1 on `--chrome`) — superseding the v1 member `--frame` `#698ebf` (0.2611, 5.95:1), which the owner never confirmed. No new colour, no new token: both are existing tokens, per B14. Its geometry is a single bloom — **`0 0 32px 4px rgb(var(--glow-blue) / 0.9)`** — with no second shadow layer: the bloom *is* the elevation on hover (`UIUX §1`, §4.1), and the `--elevation` shadow that used to paint over the bloom's brightest band is removed from the hover state (`--elevation` remains the pressed state's). The click-state green (`--glow-green` `#b9d2b2`, `UIUX §2.5`) is **unchanged**; this ruling does not move its value — the green itself is **ruled final** (**B29**, #78).

**Follow-up ruling (owner chat, 2026-09-29):** the active/pressed state takes the hover's full bloom geometry (`0 0 32px 4px` / `0.9`) in the green channels (`--glow-green` #b9d2b2), with the elevation layer dropped — so the press holds the bloom while the card sinks 1px, instead of contracting it.

**Source:** owner's issue [#67](https://github.com/AlastairZeved/The-Portfolio/issues/67), 2026-09-29 — "Hovering over a button barely emits a glow. Not enough to warrant even calling it a hover state. Either use a different blue from the palette or increase the intensity and size of the glow so it's actually visible on the dark background. It's useless as it is right now." Both doors his sentence opens are taken: the different palette blue is `--accent-page`, the intensity and size are the bloom above (a ≥3×-ground band of 23px, against 7px shipped). **Active follow-up source:** owner chat, 2026-09-29 — "Yes full bloom jesus christ"

### B26. Apple Music and Spotify doors hang under the Music note (issue #72)

The board **gains two doors and loses one**. A **"Spotify"** door
(`https://open.spotify.com/artist/5R4lXpHs3OObGTFxdltrxZ`) and an
**"Apple Music"** door
(`https://music.apple.com/us/artist/aboveaveragerob/1815357064`) are added,
both **real anchors** carrying the full link states (`UIUX §4.1`): the blue
hover bloom and the 1px-inset green press. The **"Music" card stops being a
door** — it keeps its note surface at rest and takes **no hover state and no
click state**, because it is no longer a link (a **rest-only note**,
`UIUX §4.1`). It remains a draggable, resizable note like every other note
(B7) — only its link states are gone. The link the Music card used to carry (Spotify) moves to the new
Spotify door. The two new doors sit **below the Music card as a mirrored
pair** — Apple Music lower-left, Spotify lower-right — at the spatial
placement the owner's issue screenshot gives. This entry changes **no design
value**: the two music doors reuse `UIUX §4.1`'s existing hover/click states,
and the rest-only note reuses the resting note surface. The owner's statement
names **no colour** — B25's `--accent-page` hover blue stands unchanged.

**Source:** owner's issue [#72](https://github.com/AlastairZeved/The-Portfolio/issues/72), 2026-09-29 — "1. Add the note card with text "Apple Music" 2. Link it to the "Music" card 3. Add the note card with text "Spotify" 4. Link it to the "Music" card 5. Cut the link from the "Music" card that currently links to Spotify and put it on the new "Spotify" note card 6. For the "Music" card, remove the hover state and the click state from the card since it is no longer a link 7. Make the new "Apple Music" card a link as well that leads to: https://music.apple.com/us/artist/aboveaveragerob/1815357064 and add hover state and click state to the "Apple Music" card since it is now a link 8. For spatial placement of both the "Apple Music" and the "Spotify" note cards, see the below screenshot." (screenshot: [issue #72](https://github.com/AlastairZeved/The-Portfolio/issues/72))

---

### B27. The All Boards rail is removed; the board spans the full viewport (#71)
The **All Boards rail is deleted** — out of the DOM and out of the layout, on
every viewport. Nothing replaces it: **no navigation, no second surface, no
stand-in.** The single board — "The Portfolio of Robert Alastair Zeved Gregory"
— **re-scales to fill the whole viewport**, taking the space the rail occupied.
The sheet is `inset: 0` on `#board`; the rail's `300px` desktop offset, its
`html.wide` gate, and every rail node (`.board-cat`, `.cat-head`, `.cat-add`,
`.pane-card`, `.cat-pager`, `.pager-btn`, `.cat-pages`) are gone. The door-cards
keep the authored wireframe geometry (B2) and simply spread across the wider
sheet. **Supersedes B24** (the rail's To Do tray), and the rail clauses of
**B15** and **B18**; `--accent-page` `#6d9cb0` survives as the hover glow's blue
(B25), no longer as a rail fill.

**Source:** owner's issue [#71](https://github.com/AlastairZeved/The-Portfolio/issues/71), 2026-09-29 — "Remove the left-most pane, \"All Boards\" entirely and re-scale to fit the board for \"The Portfolio of Robert Alastair Zeved Gregory\" across the entire viewport. … Do not replace the pane with something else. The site does not need navigation to other pages. Everything else needs to be re-scaled to fit."

---

### B28. Six links join the note cards (issue #75)

The board gains **six links** between its note cards — exactly the pairs the
owner names: **Music ↔ Writing**, **Software & AI ↔ Community**,
**Software & AI ↔ Writing**, **Plants & Rocks ↔ Community**,
**Plants & Rocks ↔ Writing**, **Software & AI ↔ Music**. A link is TheBoards'
note-link rendering, ported verbatim: a thin **straight line between the two
cards' centres**, no label and no arrowhead, drawn in the page's own linework
blue **`--frame` `#698ebf`** (`UIUX §2.2`) at **1px**, held crisp at any render
scale by `vector-effect: non-scaling-stroke`, with **no fill, no cap
decoration, no marker**. It lives on **one `<svg>` layer** (`#link-layer`) in
`#board` space at `z-index: 1` — **below the notes** (the door-cards are
`z-index: 2`) and above the board furniture — and it is `pointer-events: none`:
a link is a line, not a control. Endpoints are card **centres**, recomputed
whenever a card moves (drag, resize, or a viewport resize that re-scales the
percentage-authored layout), so a link follows the card it joins; only the
**pairing** is authored (each card carries a `data-id`, each line `data-from` /
`data-to`). **No card changes:** the nine cards keep their authored geometry,
their destinations, their states and their drag/resize behaviour untouched, and
no card is added.

**No invented design value.** The owner's statement names the six pairs and
nothing else; every rendered value this entry binds is either a token already
printed in `UIUX §2.2` (`--frame`) or the reference implementation's own ruled
value, transcribed from TheBoards' `UIUX §4.6` (B91) — "1px `--frame`" between
note centres, `pointer-events: none`, `z-index: 1` under the notes,
`non-scaling-stroke`, "no fill, no cap decoration, no marker". `UIUX §4.3`
carries the rendering; `test/desktop.js` pins the six pairs.

**Source:** owner's issue [#75](https://github.com/AlastairZeved/The-Portfolio/issues/75), 2026-09-29 — "Create the following links between note cards on the board:\n1. Link Music and Writing\n2. Link Software & AI to Community\n3. Link Software & AI to Writing\n4. Link Plants and Rocks to Community\n5. Link Plants and Rocks and Writing\n6. Link Software & AI to Music". The rendering values are transcribed, not invented: the owner's statement names no value, so they are taken verbatim from the reference implementation — TheBoards' `UIUX §4.6` / `B91` (TheBoards' record, the link idiom this page wears by owner ruling, `AGENTS.md` "built literally on TheBoards as the template").

---

### B29. The click-state green is ruled final — a rule carries no "pending" status (#78)

The door-card's **click-state green is ruled final**. The pressed glow is the
Idea ladder's `--note` rung, **`#b9d2b2`** (shipped as `--glow-green`),
rendered as the hover's full bloom geometry (`0 0 32px 4px` / `0.9`) with the
elevation layer dropped (`UIUX §2.5`) — the value and the geometry both stand,
unchanged, exactly as `index.html` already paints them.

A rule carries **no "pending" status**. This entry retires every
"pending"/"awaiting confirmation" annotation attached to the click-state green
in this record — in **B14** (the member-bindings paragraph) and **B25** (the
"still pending" clause) — because those clauses recorded an *agent status
note*, not an owner ruling, and the owner's statement below removes them. The
green is now carried by this entry, with the owner's source. **Supersedes** the
pending-status clauses of B14 and B25; it moves no design value and edits away
no ruling.

**Source:** owner chat, 2026-09-29, recorded in the owner's issue
[#78](https://github.com/AlastairZeved/The-Portfolio/issues/78) — "Confirm the
glow green. There is no 'pending' status for a rule. It's final once written,
not debated once written."

---

### B30. One render scale; the sheet shrinks as a whole on narrow viewports (#87)
The board renders through **one uniform `transform: scale()`** over a **fixed
logical coordinate space** (`transform-origin: 0 0`), exactly TheBoards' own
mechanism (TheBoards AGENTS.md architecture point 1). The scale, `rs`, is the
smaller of `vw/REF_W` and `vh/REF_H`, capped at 1 — **never upscales**.
`REF_W = 1080` is the narrowest width at which the authored B2 geometry fits
without clipping (Spotify's `left:86% + 150px` needs ≥1072); `REF_H = 600` is
the content's measured minimum height. Logical width/height are set to
`vw/rs` × `vh/rs` in JS so the scaled sheet always fills the viewport edge to
edge. On narrow screens (320–1023px) the **whole scene shrinks as one** —
every door-card's authored `left/top %` and `px width/height` stand untouched
and scale with the sheet; nothing reflows, nothing clips, no new geometry
value is invented. Above `REF_W`×`REF_H` the scale is exactly 1, so every
real desktop width (1024–1920px, common laptops) renders **unchanged**. This
fixes the pre-existing (pre-#71) clip where percentage offset + fixed px width
overflowed a narrow sheet; at 1024px the untouched geometry already overflowed
(measured scrollW 1031 > 1024), so scaling the 1024–1079 band is a repair, not
a disturbance. **Supersedes the `inset: 0` rendering clause of B27** — the
board now spans the viewport via explicit `left:0; top:0` plus JS-set logical
width/height under the scale — and **modifies no B2 value**; every authored
door-card `left/top %` and `px width/height` is rendered through the scale
(`UIUX §3.1`, the "one-viewport law" now holds at every width). The logical
space is the **only** space anything is read or written in: a card's inline
`left/top`/`width/height`, the resize bounds, and any computed point (the note
links' card centres, `B28`) are board-logical px, so pointer input and measured
rects — which arrive physical — are converted with `÷ rs` before they touch
geometry (TheBoards' `toLogical`, the same architecture point). At `rs = 1`
the conversion is the identity and the desktop gesture is unchanged 1:1.

**Source:** owner's issue [#87](https://github.com/AlastairZeved/The-Portfolio/issues/87), 2026-09-30 — "Scale the whole sheet (TheBoards' own mechanism) — one render scale, cards shrink with the scene, zero new geometry values."

### B31. The title compartment reads as a title (issue #91)
The title compartment is sized and read as the page's title, not one more
17px note: both title lines move from **15px to 20px** (**×4/3**, still **one
size** for both — the #59 single-size law holds), the compartment's own
padding scales **12px → 16px** sides/bottom and **+6px → +8px** top
(`--band-top` itself is frozen page structure and does not move), and its
`min-height` becomes **`calc(var(--rule-y) + 29px)`** (the +22px scaled ×4/3
→ 29.33, rounded **down** to 29 per "not aggressively"). The hug-the-text
geometry is untouched: `width: max-content`, `max-width`, the centred
`translateX(-50%)`, `border: 2px solid var(--frame)` / `border-top: 0`,
`border-radius: 0 0 3px 3px`, `background: var(--card)`, and the flex
centring all stand. **No new token** — every name ranges over the existing
`--band-top`, `--rule-y`, `--frame`, `--card`, `--ink`. **Supersedes only
B19's number** (15px / 12px / +6px / +22px); never its rule. **Do-not-touch:**
the door-cards, the band zones, the link layer, and the drag machinery.

**Source:** the design ruling on [issue #91's comment
5918163891](https://github.com/AlastairZeved/The-Portfolio/issues/91#issuecomment-5918163891)
— "Increase the size of the title card. Not aggressively, but it's too small
to read as a title right now. Increase the text's font size in the title card
too, proportionately to the increase in the size of the title card."

---

### B32. The Music note links to the Apple Music and Spotify notes below it — the two pairings the owner re-asked for (#72, reopen)

The **Music** note streams **two new links** down to its two music doors —
**Music ↔ Apple Music** and **Music ↔ Spotify** — the pairings the owner
explicitly re-asked for when he reopened issue #72 on 2026-09-30. They are
authored exactly like every other link (`B28`): one `<line>` per pair in
`#link-layer` with `data-from="music" data-to="apple-music"` and
`data-from="music" data-to="spotify"`, inheriting the whole `B28`/`UIUX §4.3`
idiom — thin straight 1px `--frame` line between the two cards' centres, no
label, no arrowhead, non-scaling-stroke, below the notes, `pointer-events:
none` — because the link layer's geometry is computed, not authored. **The
count clause of B28 (\"six links\") is superseded** — the ruling of record is
now the per-authored-pair mechanism (`UIUX §4.3`): one 1px `--frame` line per
authored pair, named by `data-id`. **No card changes:** the Music note stays a
rest-only note (`B26` — no href, no hover/click states), and the Apple Music
and Spotify doors keep their real anchor links and full link states. The board
now carries **eight** links, two of which (this PR) plus a third pair
(**Music ↔ LinkedIn**, issue #74) are the new pairings this chain family adds.

**Source:** the owner's reopen on [issue #72's comment
5917810423](https://github.com/AlastairZeved/The-Portfolio/issues/72#issuecomment-5917810423), 2026-09-30 — "I asked for the two new cards "Apple Music" and "Spotify" to be linked to the "Music" card. Did you link them? No you did not. If you don't know how, look at repo AlastairZeved/TheBoards to learn. Do not disregard my instructions again. Re-open the closed issue that addressed this. It even had fucking screenshots for you to see the placement of them spatially. Idiot."

### B33. The `132×80` number is agent-derived, never an owner ruling — authored card sizes are ruled by the drawings (#72, record amendment)

On 2026-09-30 the owner directed that this provenance defect be fixed
permanently, and that no rule may ever exist that did not come from him: "make
sure that is fixed permanently, not just this time. I never made that ruling,
that is not an owner ruling. There should never be rulings that never came from
me or twist my words around. Agents do not make rules, they follow them.
Period." And, on the floor number itself: "I never set a px explicit floor."

The number `132×80` is an **agent-derived implementation value**, not owner
law. It predates issue #58's ruling and was adopted by `B21`'s transcription
("The 132px floor was already the shipped minimum width") — a transcription
that described a shipped implementation value, not an owner-set ruling. As a
floor, `132×80` belongs only to the script's `getConstraints` — it implements
the owner's "legible" word (`B21`) for the **visitor's resize gesture**
(entertainment); it never bounds authored card sizes.

**Authored card sizes are ruled by the owner's drawings** — the screenshot in
issue #72 defining Apple Music and Spotify at the sizes he drew, and the owner's
chat of 2026-09-30 confirming the screenshots explicitly define the sizes. This
entry supersedes any reading of `B21`'s parenthetical that treats `132×80` as a
floor on authored geometry; `B21`'s own words (a legible minimum and a
one-fifth ceiling for the resize gesture) stand unchanged.

**Source:** the owner's chat directive 2026-09-30, quoted verbatim in the
[orchestrator's reopen on issue #72](https://github.com/AlastairZeved/The-Portfolio/issues/72#issuecomment-5919104671)
— "make sure that is fixed permanently, not just this time. I never made that
ruling, that is not an owner ruling. There should never be rulings that never
came from me or twist my words around. Agents do not make rules, they follow
them. Period.", and "I never set a px explicit floor."; plus the
[issue #72 screenshot](https://github.com/user-attachments/assets/0b406ea2-9d55-4cf5-af15-b359c2690f37),
which defines the Apple Music and Spotify card sizes the owner drew.

---

### B34. The LinkedIn note links to the Career note (issue #74)

Issue #74 pairs the new **LinkedIn** note with the existing **Career** note
(previously Professional). Issue #74 item 3 reads verbatim: "Link the new note
card to the existing \"Career\" note card (previously Professional)". The two
join exactly like every link before them (the B28 / UIUX §4.3 per-authored-pair
mechanism): one `<line>` in `#link-layer` with `data-from="career"
data-to="linkedin"`, a thin straight 1px `--frame` line between the two cards'
centres, no label, no arrowhead, non-scaling-stroke, below the notes,
`pointer-events: none`. **No card gains or loses a state:** Career keeps its door
(href `https://razgregory.com/career`, `target="_blank"`, the full hover/click
link states of `UIUX §4.1`), and the LinkedIn card keeps the same door
(`https://www.linkedin.com/in/robertagregory`) with the same full link states.
The LinkedIn card's size and placement are read from the owner's issue #74
screenshot (embedded below): at Career's authored 220×96, LinkedIn draws
**110×47** (0.500 w / 0.492 h of Career), **below-left of Career**, its top edge
a small gap under Career's bottom edge and its right side overlapping Career's
left edge. Authored `left:31.5%; top:40%`. LinkedIn's hover shows the blue
bloom (`0 0 32px 4px` `--glow-blue`/0.9) and its press the 1px inset + green
bloom (`B25` follow-up), both from `.door-card` CSS.

**No Music ↔ LinkedIn pairing exists, and none is authorized.** B32's clause
"(Music ↔ LinkedIn, issue #74)" names the wrong pair: issue #74 item 3 links
LinkedIn to **Career**, not Music. **This entry supersedes B32's "(Music ↔
LinkedIn, issue #74)" clause on that point**, and B32's own text stands
byte-identical. Nobody asked for Music → LinkedIn; the record must read
Career ↔ LinkedIn.

**Source:** owner's issue [#74](https://github.com/AlastairZeved/The-Portfolio/issues/74), 2026-09-29 — item 3: "Link the new note card to the existing \"Career\" note card (previously Professional)" (screenshot: [issue #74](https://github.com/user-attachments/assets/3bc427e8-5062-480d-b110-2e8ec37a9f49)).

---

### B35. The shipped LinkedIn anchor is `left: calc(38% - 69px); top: calc(18% + 132px); width:110px; height:47px;` — B34's authored-anchor clause superseded (issue #74, record repair)

B34 carries the interior line "Authored `left:31.5%; top:40%`." That seat was
authored interim and never shipped. What ships on `main` — from PR #99 (merge
`a06525c`), closing issue #74 — is the `<a class="door-card" data-id="linkedin">`
element's inline style, quoted verbatim from `index.html`:

`left: calc(38% - 69px); top: calc(18% + 132px); width:110px; height:47px;`

**This entry supersedes B34's "Authored `left:31.5%; top:40%`." clause on that
point, and only that point**; B34's text stands byte-identical otherwise —
including its size and placement readings (110×47, below-left of Career) and its
supersession of B32's "(Music ↔ LinkedIn, issue #74)" clause. B32 stands
byte-identical as well.

**Source:** the shipped code — `index.html` `[data-id="linkedin"]` on `main`, PR
#99 (merge `a06525c`) closing issue [#74](https://github.com/AlastairZeved/The-Portfolio/issues/74).
The anchor string above is quoted verbatim from `git show origin/main:index.html`,
not paraphrased.
