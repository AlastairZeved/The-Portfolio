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

---

### B20. Parking Lot form spatial layout (issue #55)

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

*(Renumbered from B18 to B20 and placed in its ascending slot per the owner's ruling of 2026-10-06, given in pre-implementation alignment on issue #149 — carrying out the repair this record had reserved B20 for; the record-repair renumber was never carried out at the time. **Source:** the owner's ruling, quoted verbatim: "Carry out the record's own reserved repair: renumber the issue #55 entry from B18 to B20 (the number the record explicitly reserved for it) and place it in its ascending slot; records.js then passes strict, matching TheBoards' guard." The same ruling deleted the stale snapshot copy of the record that preceded this document (B1–B45, every entry verbatim-subsumed here) and relocated B24 after B23 to restore the ascending append order.)

---

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
B18. B20 stays reserved for the record-repair renumber of that duplicate —
carried out 2026-10-06; B20 is now that entry.)

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
B20 stays reserved for the repair of the duplicated B18 above — carried out
2026-10-06; B20 is now that entry. Transcribed
against `main` at `c7b47d2`. No design value changes — these two entries name
no hex, px, ms or state; both are record-law transcriptions of rulings that
were already being followed by the shipped page.

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
renumber of the Parking Lot duplicate — carried out 2026-10-06; B20 is now
that entry.)

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

---

### B36. The shipped LinkedIn anchor is agent-derived implementation, never an owner ruling — B35's `Source:` corrected to the owner (issue #101, record provenance repair)

On 2026-09-30 the owner directed that this provenance defect be fixed
permanently:

> make sure that is fixed permanently, not just this time. I never made that ruling, that is not an owner ruling. There should never be rulings that never came from me or twist my words around. Agents do not make rules, they follow them. Period.

B35 correctly records the shipped anchor value — `left: calc(38% - 69px); top: calc(18% + 132px); width:110px; height:47px;` — and that value stands unchanged. But B35's `Source:` cites the shipped code (`index.html`, PR #99), not the owner. A numbered record entry whose authority is the implementation is an **agent-authored ruling**, which the owner's directive above forbids. **This entry supersedes B35's `Source:` clause on that point — and only that point.**

The shipped anchor is the **agent-derived implementation** of the owner's issue-#74 screenshot placement (the same provenance pattern B33 establishes for card sizes): the value ships in `index.html` and implements where the owner drew the LinkedIn card in the issue-#74 drawing — it is **never an owner-set value**. B35's own text stands byte-identical apart from its now-superseded `Source:` authority.

B34's interior line "Authored `left:31.5%; top:40%`." records **no owner-set value**: that seat is an **agent draft** — never shipped, never in the owner's drawing, never ruled by the owner. B34's other text stands byte-identical.

**Source:** the owner's chat directive 2026-09-30, quoted verbatim — "make sure that is fixed permanently, not just this time. I never made that ruling, that is not an owner ruling. There should never be rulings that never came from me or twist my words around. Agents do not make rules, they follow them. Period." — and "I never set a px explicit floor."; transcribed in [issue #101](https://github.com/AlastairZeved/The-Portfolio/issues/101).

### B37. The Requirements region gains the line "Click around, explore!" (issue #92)

The **Requirements** region renders one text line — **"Click around,
explore!"** — ported from TheBoards' own section-text mechanism (TheBoards
`styles.css` `.anchor` / `.band-zone .anchor`), rendered **static** here: the
line hangs from the zone's top at `--band-top`, in `--ink` at **15px/600**
(`font-size`, `font-weight`), above the rule the `band-label` tab sits under.
No contenteditable, no `role="textbox"`, no editing affordance — this site
registers no state and refuses editing (B7/B13, PRD §5). The zone's
`pointer-events: none` stands (static text takes no hits; drag passes through).
No new token is invented: `--band-top`, `--ink`, 15px and 600 are existing
values, ported verbatim from TheBoards' own numbers.

**Source:** owner's issue [#92](https://github.com/AlastairZeved/The-Portfolio/issues/92),
2026-09-30 — "Add a new text line in the \"Requirements\" section that reads:
\"Click around, explore!\". If you do not know how the text should be formatted
and placed in the \"Requirements\" section, do not come to me. Look at repo
AlastairZeved/TheBoards for how the \"Requirements\" section works because it was
already built once."

---

### B38. The Components region gains the line "All cards open their pages in a new tab" (issue #93)

The **Components** region renders one text line — **"All cards open their
pages in a new tab"** — ported from TheBoards' own section-text mechanism
(TheBoards `styles.css` `.anchor` / `.band-zone .anchor`), rendered **static**
here: the line hangs from the zone's top at `--band-top`, in `--ink` at
**15px/600** (`font-size`, `font-weight`), above the rule the `band-label`
tab sits under. No contenteditable, no `role="textbox"`, no editing
affordance — this site registers no state and refuses editing (B7/B13, PRD
§5). The zone's `pointer-events: none` stands (static text takes no hits;
drag passes through). No new token is invented: `--band-top`, `--ink`, 15px
and 600 are existing values, ported verbatim from TheBoards' own numbers.
This is a sibling of the B37 line: identical construction and computed
values, in the Components zone.

**Source:** owner's issue [#93](https://github.com/AlastairZeved/The-Portfolio/issues/93),
2026-09-30 — "Add a new text line in the \"Components\" section that reads:
\"All cards open their pages in a new tab\". If you do not know how the text
should be formatted and placed in the \"Components\" section, do not come to
me. Review repo AlastairZeved/TheBoards for how to format and place text in
the \"Components\" section because I already built it there and I do not need
to repeat myself when it's already been done once and you can see it and
repeat it."


### B39. The Requirements line "Click around, explore!" anchors to the title card's right border, one gutter of padding (issue #107)

The **Requirements** line — **"Click around, explore!"** (B37) — is **left-anchored:
it starts just to the right of the title card's rendered right border, with one
`--gutter` (16px) of padding, at the top of the band right of the title card.**
It is not centred in the region. The anchor is measured at render time: the
one-render-scale block (`frame()`) reads the title card's real right edge in
logical px (the card hugs its text, B19 — `width: max-content` — so the static
`--card-l + --card-w + --card-gap` calc sits ~119px right of the border at
1440) and sets `--req-left`; the CSS keeps the door-column calc as the no-JS
fallback. The line's format stands as B37 ruled (15px/600, `--ink`,
`--band-top`). One gutter of padding is the existing `--gutter` token — no new
value is invented.

**Source:** owner's chat directive 2026-10-01, quoted verbatim — "The text in
the 'requirements' section should be anchored to the left, meaning the text
should start just to the right of the title card border line (with a little
padding)." — confirmed in issue
[#107](https://github.com/AlastairZeved/The-Portfolio/issues/107), "Fix this.
Center the text \"Click around, explore!\" to the left of the 'Requirements'
section." (the owner's wording in that issue, transcribed as filed).


### B40. Door-cards take TheBoards' note grammar: the 2px ink border and text that scales with card size (issue #111)

The door-card renders as a TheBoards note, exactly as TheBoards itself
teaches it: a **2px border in the note's own ink** (`--ink-dark`, dark on
this surface) with the 3px near-square radius — the border is what makes the
corners read not-rounded — and **text sized to the card**: 17px at the
authored 96px standard, scaling linearly with the card's height within
TheBoards' own 0.5–2.0 note-scale band ([8.5, 34]px; TheBoards
`state.js` MIN/MAX_SCALE × 17). Resting cards keep their authored geometry;
the visitor's resize gesture now scales the text with the card instead of
stretching the box around fixed 17px type.

The 96px anchor is the six door-cards' authored height (B33 provenance:
authored sizes are the owner's drawings, never agent-set); the 0.5–2.0 band
and the 17px base are TheBoards' shipped values, ported verbatim. The scale
law itself — `fs = 17 × clamp(h/96, 0.5, 2.0)` — is an agent-derived
implementation of the owner's "text scales with the size of the card" words,
the same way B33 labelled the 132×80 gesture floor agent-derived.

**Source:** owner's issue [#111](https://github.com/AlastairZeved/The-Portfolio/issues/111),
2026-10-01 — "The note cards have rounded corners by a substantial degree.
Repo AlastairZeved/TheBoards (the source of all design decisions) resolved
this in the original build, but was not used for some reason. The note cards
should be formatted the same as they are in AlastairZeved/TheBoards. The have
different corners and they feel different for some reason. The text sizes are
not formatted to be sized in line with the note card. Smaller cards should be
scaling the text size downwards - not the same font size across all cards.
And larger note cards should be sizing the text larger as card size grows.
Again, the source of truth was already built in repo AlastairZeved/TheBoards
and should be referenced." — plus owner chat ruling of 2026-10-01: "the rules
for TheBoards should be trusted over the rules for The-Portfolio."


### B41. A resize is never a click: releasing the corner handle must not navigate (issue #109)

Resizing a note card must never register as a click. The door-cards are real
`<a href>` anchors and the corner resize handle is a `<span>` **inside** the
anchor, so the browser's own click fires on pointer release and the page
navigates away mid-gesture. A gesture is not a click: if the pointer crossed
the movement threshold, the card moves or resizes and **nothing opens**. This
extends the existing drag suppression (issue #94/B29's rule) to the resize
branch, which carried no such guard at all.

The click survives where it should: a press that never moved is a click, not a
gesture, and still opens the door in a new tab (`B3`) — including a tap squarely
on the corner handle. The movement threshold is the same 4px the drag already
used, so both gestures share one rule and one guard.

**Implementation note (agent-derived):** the 4px threshold, its reuse across both
gestures, and the single `{once}` capture guard in `endDrag` are the agent's
implementation of the owner's words "should never register resizing as a click" —
the same labelling as `B33`'s 132×80 and `B40`'s scale law. The owner ruled the
behavior, not the threshold.

**Source:** owner's issue [#109](https://github.com/AlastairZeved/The-Portfolio/issues/109),
2026-10-01 — "When resizing a note card, the site is treating it as a click and
opening the linked page once the click is released. Even if the card was only
resized, it still clicks it once the pointer is released. This is inappropriate
behavior and should never register resizing as a click. Fix this by removing
the clicking mechanics from the resize function." (the owner's wording in that
issue, transcribed as filed).


### B42. The resize handle's clickable area is larger than its glyph (issue #108)

The corner resize handle's clickable area is too narrow to find and grab, so
it is expanded: the handle's box becomes a **28×28** grab target anchored **2px
outside** the card's outer corner — the whole bottom-right corner resizes, and a
**2px padding ring extends beyond the note itself**. The visible grip lines are
unchanged: they are pinned 9px inside the box's bottom-right corner, exactly
where they already sat, so the box grew around them and the mark did not move.
Nothing else about the gesture changes: a press that never moved is still a
click and still opens the door (`B41`, `B3`), and a gesture that moved still
resizes and opens nothing.

**Implementation note (agent-derived):** the `28×28` figure and the 2px ring
are the agent's implementation of the owner's "expand the resize button's
clickable area with correct padding" words — the same labelling as `B33`'s
132×80 and `B40`/`B41`'s derived values. The owner ruled the behavior, not the
numbers.

**Source:** owner's issue [#108](https://github.com/AlastairZeved/The-Portfolio/issues/108),
2026-10-01 — "The pointer is too sensitive around the \"resize\" function on the
note cards. It's too difficult to find the resize area you can click, there's
just no padding at all. Expand the resize button's clickable area with correct
padding too." (the owner's wording in that issue, transcribed as filed).
### B43. Every note card's placement and size follows the owner's issue #112 drawing (issue #112; rebuild after PR #115)

The nine door-cards are re-placed and re-sized to the owner's spatial
geometry: the screenshot in issue #112 is the authority for where every
card sits and how large it is — **including the linked notes** (LinkedIn,
Apple Music, Spotify). The values below are **agent-derived measurements
of that screenshot** (method: pixel measurement of the owner's 2560×1440
screenshot; render-scale calibration `z=1.3037` derived from the shipped
`calc()` offsets in the pre-#115 geometry; fit residuals ±0.4 screen px ≈
±0.3 logical px). This entry **supersedes the placement and size values
shipped by PR #115** (measured against a mis-scaled coordinate system:
that PR divided the drawing's screen measurements by viewport/REF_W ≈
2.37, but the render scale is clamped to 1 at desktop, so the sheet is
the viewport and the drawing's pixels are the logical values) and the
placement clauses of **B26** for the two music doors. **B2** (free board
space), **B28** (the nine link pairs), **B33** (drawings rule authored
sizes) and **B40** (text scales with card height) stand unchanged; the
link pairs are untouched and their lines recompute from card centres
(B28). `UIUX §3.4` is updated to name this drawing as the placement
authority.

Authored geometry (left%, top%, width×height in logical px):
- Community: 13.6% / 18.3% / 310×140
- Career: 42.3% / 18.5% / 329×110
- Writing: 66% / 24% / 176×80
- LinkedIn: 37.3% / 32.7% / 110×48
- Software & AI: 12.3% / 51.7% / 251×110
- Plants & Rocks: 42.6% / 64.4% / 219×96
- Music: 73% / 54% / 220×96
- Apple Music: 88.3% / 61.3% / 120×50
- Spotify: 81.7% / 68.6% / 110×48

**Source:** owner's issue [#112](https://github.com/AlastairZeved/The-Portfolio/issues/112),
2026-10-01 — "The placement of note cards and the sizing of each individual
note card has to be updated to reflect the new spatial geometry. Use the
below screenshots to resize and move every single note card on the board.
visually it will be much more inviting." — and the owner's comment on the
same issue, 2026-10-01 — "The original screenshot in the open issue #112
above indicates exactly where every single note card on the board should be
placed - including linked note cards. It also indicates exactly how to
resize every single note card - each individual has a placement change and
a size change that was not built as instructed. Fix."

### B44. The board scales to any viewport size — one uncapped scale over the #112 drawing's own space (issue #121)

The board must scale to **any** viewport size — larger than mobile — not be
designed for specific viewport sizes. The one render scale stays exactly
`B30`'s mechanism (one uniform `transform: scale()` over a fixed logical
coordinate space, `transform-origin: 0 0`, logical width/height `vw/rs ×
vh/rs` so the scaled sheet fills the viewport edge to edge), but the scale
is now **uncapped**: `rs = min(vw/REF_W, vh/REF_H)` — it shrinks below the
reference space AND grows above it, so the sheet renders the owner's issue
#112 drawing (`B43`) at **every** viewport size, not at one privileged size.

The reference space is **the #112 drawing's own coordinate space**:
`REF_W = 2560/z`, `REF_H = 1440/z` with `z = 1.3037` — `B43`'s calibration of
the owner's 2560×1440 screenshot — i.e. **1963.64 × 1104.55** logical px. The
`B43` authored geometry (every card's `left/top %` and `px width/height`) is
exact in this space, so rendering the scene here and scaling it uniformly
reproduces the drawing at every viewport: no overlapping note cards, no link
line obscured behind a card. The old `B30` constants (`REF_W = 1080`,
`REF_H = 600`) predate the #112 geometry rebuild — under them the drawing's
spacing collided (Career×Writing, Music×Apple Music, Community×LinkedIn and
others) at common laptop viewports, exactly the defect #121 reports. **This
entry supersedes `B30`'s cap clause ("capped at 1 — never upscales") and
`B30`'s `REF_W`/`REF_H` constants on those points**; `B30`'s mechanism, its
logical-space conversion rule (physical readings ÷ `rs`), and its
narrow-viewport shrink behaviour stand unchanged. Mobile viewports remain
out of scope.

The uncapped formula and the drawing-space constants are **agent-derived
implementations of the owner's words below** — the same labelling as `B33`,
`B40`, `B41`, `B42`. The owner ruled the behavior, not the numbers.

**Source:** owner's issue
[#121](https://github.com/AlastairZeved/The-Portfolio/issues/121),
2026-10-03 — "There are severe scaling issues when viewing the website on
various viewport sizes. Some viewports have overlapping note cards and link
lines obscured. The site should be scaling to different viewport sizes, not
designed to be viewed on specific viewport sizes. It needs to scale to any
viewport size and be viewable on devices larger than a mobile viewport.
Mobile viewports are out of scope and will be visited again in a future PR
release."

---

### B45. Every note card matches TheBoards' note font and sizing mechanics (record amendment, owner chat 2026-10-05)

Every note card on the board — **all nine**, not only the three issue #126
names — adopts **TheBoards' own note mechanics**, exactly as TheBoards builds
notes. The mechanism of record:

- **Font:** note text renders at **17px, `line-height: 1.4`** (TheBoards
  `styles.css` §4 `.note-text`), scaled only by the note's own scale factor
  (clamped **0.5–2.0**, TheBoards `state.js` `MIN_SCALE`/`MAX_SCALE`) — not
  by card height. This **supersedes B40's height-driven text-scale law**
  (`17 × clamp(h/96, 0.5, 2.0)`).
- **Sizing:** cards are **content-sized**, as TheBoards sizes notes —
  `width: max-content` capped at the sheet's edge, floored at **min-width
  132** (TheBoards' `NOTE_MIN_W`, TheBoards `UIUX §4.5`, B84), height
  following the wrapped text. This **supersedes B43's authored fixed
  boxes** (`left/top %` + `px width/height`) as a sizing mechanism; the
  placements remain the owner's drawing authority.
- **Resize:** the gesture acts as **TheBoards' scale-based resize** (the
  frame drag changes the note's scale 0.5–2.0), replacing independent
  width/height corner dragging. This **supersedes B21's corner w/h resize
  bounds** for the gesture.

This entry also answers issue #126 at the mechanism level: the three
visibly unmatched cards (Apple Music, Spotify, LinkedIn) become uniform
with every other note card rather than being patched individually. The
implementation ships in a follow-up PR with the matching `UIUX §4` edits;
this entry is the ruling of record. Any agent-derived implementation
specifics are labelled as such there, per the `B33`/`B43` provenance
pattern.

**Source:** the owner's chat directives of 2026-10-05, quoted verbatim,
given while reviewing the agent's issue-#126 work — "the resizing and note
card sizes in general should match how AlastairZeved/TheBoards built its
note cards" and "Every single note card should match TheBoards note font
and card sizing mechanics. All of them. The three mentioned were brought
up because they were visibly unmatched, but all note cards should be
uniform in font and card mechanics. The three mentioned should be sized
like note cards would be sized on TheBoards." Context: owner's issue
[#126](https://github.com/AlastairZeved/The-Portfolio/issues/126), 2026-10-05
— "The \"Apple Music\", \"Spotify\", and \"LinkedIn\" cards are too small -
they're actually smaller than the note cards minimum sizing even allows. Make
them larger to the minimum card size allowed."

---

### B46. The band sizes by TheBoards' convention under the height-anchored landscape scale; the Parking Lot sizes by TheBoards' measured-content law; the title-card box stands (issue #128)

The owner ruled in a structured interview of 2026-10-05 (three rulings plus a
second-round confirmation). The ruling:

- **The scale is height-anchored on landscape and the band literals are
  rescaled ×1.10455** (k = 1104.55/1000 — TheBoards' 1000-tall logical frame
  mapped into the issue #112 drawing's 1104.55-tall space). TheBoards' own
  desktop frame law (TheBoards `geometry.js` `computeFrame`,
  `renderScale = Math.min(vh/1000, (vw − panes)/900)`) is ported: on a
  landscape viewport `rs = vh/REF_H`, so the band renders at a fixed fraction
  of the viewport height at every landscape size, exactly as TheBoards renders
  61/1000 = 6.1% of vh; portrait keeps B30's `min()` down-scale. The height
  anchor is floored by the content's own **measured** minimum logical width
  (`rs = min(vh/REF_H, vw/lw_min)`, `lw_min = max(cardW/(1 − left%))` over the
  door-cards — B42's "measured, never a constant" law; agent-derived, and
  inert at every ordinary aspect: it binds only on square-ish windows, where
  the pure height anchor would compress the sheet below the cards' right
  edges and clip it). **This
  supersedes B44's scale-formula clause for landscape viewports only.** The
  band literals follow TheBoards' B37/B47 chain through k: `rule-y =
  15.46 + max(2, lines) × 21.54 + 8.84` (67.38 at the two-line floor), the
  band label 14.36px, the band anchors 16.57px. The numbers are agent-derived
  (per the `B33` precedent: the owner ruled the behaviour, not the digits).
- **The Parking Lot sizes by TheBoards' B73 measured-content law:** measure
  the rendered rows, floor at the rescaled two-row shelf (TheBoards' 122-shelf
  × k = 134.76px, header included), cap at half the logical sheet,
  bottom-anchored, content clipped past the ceiling. This supersedes B18's
  fixed `180px` `--lot-h` as a mechanism (B18's arrangement stands; the
  180px value survives only as the no-JS fallback).
- **The title card is untouched: B31 stands** — the 20px type, the
  `(band-top + 8px) 16px 16px` padding and the `rule-y + 29px` overhang are
  owner law; the rescaled band grows beneath the box, and the box grows
  around it. Nothing in B46 supersedes B31.

The convention being matched is TheBoards' `B37`/`B47`/`B54`/`B76`/`B73`
chain (band sized by the type it holds, fixed logical units, two-line floor;
label 13px; header tab below the rule — already shipped; lot measured from
content from the two-row shelf, half-sheet cap).

**Source:** the owner's three interview rulings of 2026-10-05 (issue #128),
quoted verbatim —

1. "Height-anchor the scale AND rescale the band literals ×1.1046 (rule-y
   61→67.4): every landscape screen then renders the band exactly at
   TheBoards' size (54.9px rule at 1440×900, 6.1% of viewport height) — full
   match, and the title card/labels also match exactly."
2. "Port TheBoards B73's law: measure the rendered form, floor at the
   rescaled two-row shelf, cap at half the logical sheet."
3. "Keep 20px (B31 stands); the rescaled box grows around it."

— with the second-round answer confirming ruling 1. Context: the owner's
issue [#128](https://github.com/AlastairZeved/The-Portfolio/issues/128) —
"Convention for how the header and the parking lot and the title card should
be sized was already declared in github repo AlastairZeved/TheBoards. The
\"Components\", \"requirements\" and title card should match it for
consistency and cohesion." (issue title: "The header and title card are still
too small vertically.")

### B47. razgregory.com/career is the employer-selector career page on a sand/brown binding of TheBoards' ladder (issue #133)

The owner logged the hand-drawn wireframe spec in issue #133: the career page
presents Robert Gregory's banking career as an **employer selector** — three
title cards in the landing page's top-band grammar (**PNC Bank**, **PNC
Private Bank**, **Brinker Capital**, left→right chronological), each hanging
over the header line exactly as the landing page's title card does; selecting
a card swaps the body to that employer (a selector, not a carousel), the
default state being **PNC Bank**. The selected card wears the B132 glow
verbatim — `border-color: <glow token>; box-shadow: 0 0 8px 0 <glow token>` —
one glow token, a soft bloom, no other states.

The body reuses the landing page's `.split` with `.split__rule`: the left half
holds the employer's role heading box, a "Blurb about role" block (one
paragraph per role held) and a "Notes about role & responsibilities" block;
the right half holds "Accomplishments" and "Learnings/Skills". The footer is
the landing page's `.parking-lot` grammar split into **three** sections —
professional blurb, contact info, and a `.cta` button "Learn More about Rob"
linking back to razgregory.com — separated by divider bars of **3/4 section
length**.

The palette is **TheBoards' token ladder re-hued to sand + deep brown**: the
ladder's structure, luminance relationships and role assignments are
preserved (`--deep` near-black canvas, `--card` one step above, `--frame` the
lifted rule hue, `--note` the brightest ink on the deep, the same
three-stop water mix), and the glow sits **one rung below its base** per the
B132 rung rule. The page stays a static single file with all CSS inline and
**no script** — the selector is a three-way radio group driven by CSS
`:has`, exactly the landing reference's own mechanism. Nine content slots
(dates, role titles, blurbs, notes, accomplishments, learnings, footer
blurb, contact info, final palette hexes) await the owner's targeted fill
passes; **per the owner's ruling of 2026-10-05, empty blocks are omitted
from the rendered page entirely until content exists** — no empty styled
container, no section heading, no invented placeholder copy.

This entry transcribes the owner's issue #133 spec; it does not supersede
B1 — the career page is a sub-page of the hub wearing its own ruled binding,
as the spec directs.

**Source:** the owner's spec, issue
[#133](https://github.com/AlastairZeved/The-Portfolio/issues/133) — quoted
verbatim: "The page presents Robert Gregory's banking career as an employer
selector with a per-employer detail body."; "selecting a title card switches
the body content below to that employer (wireframe shows PNC Bank selected).
There is no scrolling carousel — it's a selector."; "the selected card gets a
soft bloom exactly like TheBoards' card glow (B132 mechanism):
`border-color: <glow token>; box-shadow: 0 0 8px 0 <glow token>;` — one glow
token, soft bloom, no other states."; "Use TheBoards' default blue palette
(`styles.css` root tokens) **as the structural template** — same token
ladder, same luminance steps, same role assignments — re-hued to a **sand /
deep-brown** scheme"; "glow one rung below its base"; "Structural build
(layout, selection mechanics, glow, split, footer) can proceed against
placeholders; text slots ship empty-but-slotted rather than with invented
copy."; and the owner's ruling of 2026-10-05 on how those slots render,
quoted verbatim: "Omit empty blocks entirely until content exists" (owner
interview, 2026-10-05 — no filler text, no empty styled containers, no
"coming soon" markers; slot structure lives in the markup only).


### B48. razgregory.com/plantsandrocks is the dual-page-reader Plants & Rocks page on the literal idea-board green (issue #134)

The owner logged the spec in issue #134: the Plants & Rocks page is a
**dual-page reader** presenting two plant guides — **Plants on Poles**
(Monstera Division and Moss Pole Guide) and **Plants in Rocks** (Planting in
Semi-Hydroponics With Pon) — built on `career.html` (B47) as the structural
template. Two title cards in the `.topband` grammar **overhang the header
line** (per the owner's correction, same as the career page's cards);
selecting a card selects that page — the cards are SELECTABLE radio-driven
cards now, even though selection swaps nothing while the body is blank. The
cards' oneliner slots are NOT blank: they carry the owner's copy verbatim.

The body is **intentionally blank pending the PDF pass**: selection swaps
between two bare empty reader containers (one per radio) driven by CSS
`:has` — each an empty bare container, no styled content, no placeholder
images, no text, no chevrons, no split furniture. The reader region is just
reserved. SLOT comments mark the future PDF pass.

The footer is the `.parking-lot` grammar split into **TWO** sections with
**ONE** divider bar of 3/4 of the section's inner length. The left section
is reserved and renders nothing (comment only, measures zero) —
permanently empty per the spec. The right section holds the **Download**
button, rendered but **DISABLED**: `aria-disabled="true"`, no handler, it
visibly cannot yet work (dimmed at the 0.55 alpha — agent-derived,
career.html's shipped dim value reused — with no hover/active bloom). The
`.cta` is styled with career.html's `.cta` grammar re-tokened to the green
palette.

The palette is the **LITERAL TheBoards idea-board token block**
(`styles.css` `#board[data-cat="idea"]`), transcribed byte-exact — NOT a
re-hue: `--deep:#000a06; --card:#001a0e; --water-top:#486b49;
--water-mid:#345439; --water-bot:#1f3825; --water-bot-a:31 56 37;
--frame:#52997f; --note:#b9d2b2`. Ink and tokens the green block does not
redefine come from TheBoards' `:root` verbatim (`--ink-light:#f4f5f1;
--ink-dark:#031019; --ink:var(--ink-light)`). The selected-card glow token
is **`--frame` `#52997f` itself** (`border-color: var(--frame);
box-shadow: 0 0 8px 0 var(--frame)`) — **agent-derived** per the B33/B40
provenance pattern: inventing a new "one rung down" hex would be a
design-value invention (repo UIUX law), so an existing shipped value is
reused. Unselected cards dim + italic at career.html's shipped
`--ink-dim: rgb(244 245 241 / 0.55)`. The page stays a static single file
with all CSS inline and **no script** — the selector is a two-way radio
group (`role="radiogroup"`, `aria-label="Choose a page"`) driven by CSS
`:has`, exactly career.html's mechanism; one visually-hidden `h1`
("Plants & Rocks"); mobile and `prefers-reduced-motion` media blocks carry
in career.html's pattern.

This entry transcribes the owner's issue #134 spec and the owner's grill
answers; it does not supersede B1 — the page is a sub-page of the hub
wearing its own ruled binding, as the spec directs.

**Source:** the owner's spec, issue
[#134](https://github.com/AlastairZeved/The-Portfolio/issues/134) — the
page structure (two title cards overhanging the header line per owner
correction; dual-page reader body blank pending PDF, no placeholder
scaffolding; two-section footer, left section permanently empty, right the
disabled Download button; the literal idea-board green palette; blank slots
list) — and the owner's four grill answers of 2026-10-05 (owner chat,
2026-10-05), quoted verbatim:

1. "The two title cards are selectable radio-driven cards, even though
   selection swaps nothing while the body is blank. Two cards: Plants on
   Poles (default checked) and Plants in Rocks."
2. The oneliner copy, verbatim: "Plants on Poles | Monstera Division and
   Moss Pole Guide" and "Plants in Rocks | Planting in Semi-Hydroponics
   With Pon".
3. The footer Download button is "rendered but disabled: aria-disabled,
   no handler, visibly cannot yet work".
4. The regression suite: a new black-box Playwright test file in the exact
   style of `test/career.js`.

Agent-derived values (labelled per the B33/B40 provenance pattern): the
glow token = `--frame` itself; the disabled button's 0.55 alpha; the
mobile/reduced-motion media blocks' port details.

### B49. The career page's header band, title cards and footer render at the landing page's conventions (issue #139)

The owner ruled that razgregory.com/career's header pane, title cards and
footer pane were "wildly incorrect" against the site's own established
conventions, whose source of truth is the landing page (`index.html`,
razgregory.com) in this same repo, and that the design must be adhered to.
The career page's header band, title cards and footer therefore render at
the landing page's conventions, re-tokened to the B47 sand/brown binding:

- **The header band renders at B46's height-anchored scale.** The band is
  the landing's band-fill grammar — the water (radial foot at 118% 76% /
  50% 24%, the three-stop ladder, the 0.05 dither) over the deep, closed by
  the 1px `--frame` rule at `--rule-y` — and every band literal renders at
  the B46 render scale: `rs = vh/REF_H` (REF_H = 1104.55) on landscape, the
  owner-ruled `min(vw/1440, vh/1104.55)` on portrait — the owner's answer
  named the `vw/1440` divisor explicitly for this page (the landing's own
  B30 portrait term uses `vw/REF_W`, REF_W = 1963.64; the career divisor is
  the owner's, not a transcription of B30). Because the career page
  ships **no script**, the scale is ported as a pure CSS custom property
  (`--rs`) and every literal renders as `L × --rs` — `--rule-y` 67.38 (the
  rescaled two-line floor: wordmark + oneliner slot), `--band-top` 15.46.
  The digits are agent-derived per the B33 precedent (the owner ruled the
  behaviour — match the landing's render — not the CSS mechanics).
- **The three selector cards take the landing title card's B31 box grammar
  verbatim**: content-sized (hug their text), top-anchored in the band,
  `border-top: 0`, radius only on the corners that exist, `(band-top +
  8px) 16px 16px` padding, both lines at the 20px logical type (the
  employer name the pinned 600 line, the oneliner slot the eyebrow 400
  line), `min-height: rule-y + 29px` hanging each card over the header
  line — all rendered at `--rs`. B47's selection mechanics stand unchanged:
  the B132 glow verbatim, unselected cards dim + italic, default PNC Bank.
- **The footer takes the landing lot's floor statically**: the rescaled
  two-row shelf (TheBoards' 122-shelf × k = 134.76 logical, B46/TheBoards
  B73) rendered at `--rs` as a `min-height`; content grows past the floor.
  The section padding, the three-section arrangement and the 3/4-length
  divider bars stand as shipped.

The ≤743px mobile reflow renders as shipped — the readable adaptation, not
part of the desktop-render mismatch the owner flagged. The block gained
resets that neutralize the new desktop rules at mobile widths — `min-height:
0` and `height: auto`, `justify-items: stretch`, and the shipped card
literals restored (`0.25rem 1.1rem` padding, full 2px `--frame` border and
3px radius, `-2px` hit inset, the `1.1rem`/`0.8rem` wordmark/oneliner type) —
so the rendered output is unchanged. The `--rs` scale also carries a plain
`vh` fallback line ahead of the `dvh` declaration (agent-derived port
mechanic: browsers without `dvh` would otherwise drop the scale entirely).

**Source:** the owner's issue
[#139](https://github.com/AlastairZeved/The-Portfolio/issues/139) — "There
are already established conventions for what the header, the footer, and
the title cards should look like, how they should be styled, and how they
should be formatted and bordered, their vertical height, etc.. Source of
truth is razgregory.com in this same repo and that design must be adhered
to. Fix the header pane. Fix the title cards. Fix the footer pane." — and
the owner's three grill answers of 2026-10-06 (owner chat), quoted
verbatim:

1. "vh-anchored pure-CSS calc: each band literal renders as calc(L ×
   100dvh / 1104.55) on landscape (min() with the vw term on portrait) —
   matches the landing's render exactly at every viewport, keeps zero-JS."
2. "Yes — all three cards take the landing title-card's B31 box grammar
   verbatim (border-top 0, bottom-only radius, +29px overhang, 20px type),
   content-sized, spread across the band; selection glow unchanged."
3. "Keep the current fixed padding but match the landing's floor height
   statically (134.76px logical)."

This entry transcribes the owner's rulings; it supersedes §10.2's shipped
band/card/lot values as the rendering law and does not touch B47's
selection mechanics or the B47/B48 page structure.

### B50. The plantsandrocks page's header band, title cards and footer render at the same landing-page conventions (issue #140)

The owner ruled that razgregory.com/plantsandrocks had "wildly incorrect"
header pane, title cards and footer pane against the same established
conventions whose source of truth is the landing page in this same repo,
and directed the same resolution as the career page's (B49). The
plantsandrocks page's header band, title cards and footer therefore render
at B49's conventions verbatim, re-tokened to the B48 idea-green block:

- **The header band** is B49's band — the landing's water grammar (radial
  foot, three-stop ladder, 0.05 dither) over the deep, closed by the 1px
  `--frame` rule at `--rule-y` (67.38 × --rs, the rescaled two-line floor)
  — with B49's pure-CSS `--rs` scale and its plain-`vh` fallback line.
- **The two selector cards** take B31's box grammar verbatim (content-sized,
  top-anchored, border-top 0, bottom-only radius, (band-top + 8px) 16px 16px
  padding, the 20px logical type — page name the pinned 600 line, the B48
  oneliner copy the eyebrow 400 line — and the rule-y + 29px overhang), all
  at `--rs`. B48's selection mechanics stand unchanged: the `--frame` glow
  verbatim, unselected cards dim + italic, default Plants on Poles.
- **The footer lot** takes the rescaled two-row-shelf floor (134.76 × --rs)
  as a `min-height`; the padding, the two-section arrangement, the single
  3/4-length divider bar and the disabled Download button stand as shipped.

The ≤743px mobile reflow renders as shipped; the block gained the same
resets as B49's (min-height/height, justify-items, the shipped card
literals restored).

**Source:** the owner's issue
[#140](https://github.com/AlastairZeved/The-Portfolio/issues/140) — "There
are already established conventions for what the header, the footer, and
the title cards should look like, how they should be styled, and how they
should be formatted and bordered, their vertical height, etc.. Source of
truth is razgregory.com in this same repo and that design must be adhered
to. Fix the header pane. Fix the title cards. Fix the footer pane." — and
the owner's chat direction of 2026-10-06 to resolve it as "the exact same
header/footer/title card issue" as the career page's and roll the work into
the same PR (i.e. B49's three owner-ruled mechanics, unchanged). This entry
transcribes the owner's rulings; it does not touch B48's page structure or
the blank-reader discipline.

---

### B51. The note card's resize ceiling is one-fifth of the viewport — the 2.0 scale cap is superseded where it binds first (issue #142)

The note card's resize gesture keeps B45's mechanism — TheBoards' scale-based
frame-drag, a uniform scale on the card (the owner: cards resize 1:1, never
per-axis) — but the ceiling of record is **one-fifth of the viewport**: a card
grows until it reaches 1/5 of the viewport, at any viewport size, and stops
there. The ceiling is a single uniform-scale bound: the gesture stops at the
first axis that reaches its fifth. The minimum stands as-is ("the current
minimum card size is fine as-is"): `MIN_SCALE` 0.5 and the `NOTE_MIN_W` 132
unscaled floor are untouched.

**This supersedes B45's scale-max clause** — TheBoards `state.js`
`MAX_SCALE` 2.0 — wherever 2.0 would stop a card below the one-fifth ceiling:
the gesture's maximum is the scale at which the card first reaches 1/5 of the
viewport width or height, whichever binds first. Where a card's content size
already puts 2.0 above that ceiling, the ceiling binds instead. B45's other
clauses (the 17px/1.4 note font scaled only by the card's own scale,
content-sized sizing, the sheet-edge width cap, the footprint re-clamp) stand
unchanged, as does B21's one-fifth ceiling, which this entry implements for
the scale-based gesture.

The per-card ceiling scale is an agent-derived implementation value (the
`B33`/`B43` provenance pattern): the owner ruled the ceiling (1/5 of the
viewport, uniform), not the arithmetic that derives it.

**Source:** the owner's issue
[#142](https://github.com/AlastairZeved/The-Portfolio/issues/142) — "Note
cards should be resizable to be as large as 1/5 of the entire viewport -
scaled to any viewport size. The current minimum card size is fine as-is,
but the maximum is not. Fix the maximum size a note card can be resized to."
— and the owner's chat answers of 2026-10-06 confirming the reading:
"cards can only be resized 1:1, not by length or width individually so this
question makes no sense." (the ceiling is one uniform scale, not per-axis
bounds) and "1/5 viewport is the only ceiling; 2.0 is superseded when it
binds first."

---

### B52. The note cards size per the owner's issue #138 drawing — the six board cards at their drawing scales, the three sub cards at theirs (issue #138)

The issue #126/#B45 rebuild left every note card content-sized at the
minimum footprint (the `NOTE_MIN_W` 132 unscaled floor). That was only ever
meant for the three sub cards — "it was only supposed to be the sub cards
'LinkedIn', 'Apple Music', and 'Spotify'". The owner's attached visual is
the size authority of record: each card sizes to its own drawing footprint.

The mechanism of record does not change — **B45's TheBoards note mechanics
stand**: content-sized boxes, the 17px/1.4 note font, and a per-card uniform
`transform: scale()`. What the ruling adds is each card's **rest scale of
record**: the six board cards (Community, Career, Writing, Software & AI,
Plants & Rocks, Music) sit **above 1**; the three sub cards (LinkedIn,
Apple Music, Spotify) sit **below 1**. The cards render at their drawing
sizes; the drag and resize gestures still move the scale from there under
B45's 0.5 floor and B51's one-fifth-of-viewport ceiling, unchanged.

The scale values themselves are **agent-derived arithmetic transcribing the
owner's visual** (the `B33`/`B43` provenance pattern): each value is the
card's measured drawing footprint at 2560×1440 (render scale 1.3037, the
`B43` calibration) divided by the card's measured unscaled content width —
2.25 community, 2.21 career, 1.35 writing, 1.79 software-ai, 1.96
plants-rocks, 1.70 music, 0.78 apple-music, 0.79 spotify, 0.81 linkedin.
Under the uniform-scale mechanism a card's height follows from its width;
the drawing's heights pin nothing independently. The card placements
(`left/top %`, `B43`) are untouched — the visual's cards sit where the
board already draws them.

This ruling **supersedes issue #126's minimum-size footprint reading for
the six board cards** (the sub cards' drawing footprints sit below it);
issue #126's mechanism ruling (`B45`) stands everywhere else. It does not
touch `B51`'s resize ceiling.

**Source:** the owner's issue
[#138](https://github.com/AlastairZeved/The-Portfolio/issues/138) — "All
note cards were resized to the minimum size in the last update, but it was
only supposed to be the sub cards \"LinkedIn\",\"Apple Music\", and
\"Spotify\". Attached is a visual displaying how exactly each card should
be sized." — with the attached visual (2560×1440 board rendering) as the
size authority the quote names.

---

### B53. The three linked sub cards render plain text — no bold (issue #145)

The LinkedIn, Apple Music and Spotify sub cards' text renders at weight
**400** (the self-hosted Montserrat Alternates regular rung), not the
door-card's shipped 600. Every other card — the six board cards and the
Music note — keeps the 600. Nothing else about the sub cards changes: their
size, placement, links and link states (`UIUX §4.1`) stand.

**Source:** the owner's issue
[#145](https://github.com/AlastairZeved/The-Portfolio/issues/145) — "Remove
the bolding from the following cards:

1. Apple Music
2. LinkedIn
3. Spotify"

and the owner's chat answers of 2026-10-06: "400" (the plain weight) and
"Only the three — keep the Music note and the six door-cards at 600" (the
scope).

---

### B54. The band anchors render plain text and carry the owner's revised copy (issue #147)

The two band-zone anchor lines — the Components line and the Requirements
line — render at weight **400** (plain), not the 600 that B37/B38 shipped;
their font size, colour and placement stand (16.57px `--ink`, hanging from
the region top at `--band-top`, B39's left anchor for Requirements). The
owner also ruled the copy of record for both lines: Components reads
**"Each card links to a page housing my work in that domain."**
(superseding B38's "All cards open their pages in a new tab"); Requirements
reads **"Click around to explore my works!"** (superseding B37's "Click
around, explore!"). B37/B38 stand as the historical record of where the
lines came from; the strings above are the copy of record.

**Source:** the owner's issue
[#147](https://github.com/AlastairZeved/The-Portfolio/issues/147) — "Remove
the bold from this text: "All cards open their pages in a new tab."

Remove the bold from this text: "Click around, explore!"

We're also making copy edits:

Instead of:
"All cards open their pages in a new tab."

Replace it with:
"Each card links to a page housing my work in that domain."

Instead of:
"Click around, explore!"

Replace it with:
"Click around to explore my works!""

---

### B55. Four new linked sub cards — Zeved Boards and Agentic Plugins under Software & AI, Plants on Poles and Plants in Rocks under Plants & Rocks; note cards, not doors (issue #146)

Four sub cards join the board, each linked by a line to its parent:

1. **Zeved Boards** — child of **Software & AI**, on the left diagonal
   under it.
2. **Agentic Plugins** — child of **Software & AI**, on the right diagonal
   under it.
3. **Plants on Poles** — child of **Plants & Rocks**, on the left diagonal
   under it.
4. **Plants in Rocks** — child of **Plants & Rocks**, on the right diagonal
   under it.

Each new card renders **plain text, no bold** — the sub-card weight 400
(`B53`'s selector covers them) — and meets the board's note-card and font
standards (`UIUX §4.1`). They are **note cards, not doors**: the owner ruled
they carry no link and open no page, like the Music note. The issue's
"underneath Plants & Rocks" placement for the Software & AI pair is
superseded by the owner's clarification: those two hang under **Software &
AI**, their own parent. No drawing sizes these four; the owner set their
size at the existing sub-card scale band (~0.78–0.81, Apple Music's band),
and they ship at **0.78** each, the band's smallest scale of record. The
placements follow the board's own diagonal idiom — the left-diagonal child
at the LinkedIn offsets (−5.0, +14.2), the right-diagonal child at the
Spotify offsets (+8.7, +14.6), agent-derived transcriptions of the owner's
statement under the `B33`/`B43` provenance pattern.

**Source:** the owner's issue
[#146](https://github.com/AlastairZeved/The-Portfolio/issues/146) — "Add
the following linked cards to their parent as below:

1. Software & AI --- "Zeved Boards" (Positioned underneath Plants & Rocks,
   to the left diagonal)
2. Software & AI --- "Agentic Plugins" (Positioned underneath Plants &
   Rocks, to the right diagonal)
3. Plants & Rocks --- "Plants on Poles" (Positioned underneath Plants &
   Rocks, to the left diagonal)
4. Plants & Rocks --- "Plants in Rocks" (Positioned underneath Plants &
   Rocks, to the right diagonal)

Each new card should be plain text, no bold, and meet the standards for
note cards and fonts on this board."

and the owner's chat answers of 2026-10-06: "No links — plain note cards
like the Music note" (the cards are not doors); "No — the two Software & AI
children should hang under Software & AI instead" (the placement of the
Software & AI pair, superseding the issue's literal "underneath Plants &
Rocks" for those two); "The existing sub-card scale band — ~0.78–0.81,
matching Apple Music/Spotify/LinkedIn" (the size).


### B56. The career body's left half carries the plugin components — one per role, per employer tab (issue #154)

The owner directed that the component that displays the plugins on the
**Agentic Plugins page** of repo AlastairZeved/AlastairZeved
(`.gregorian-mode` class set: the water back card `.gm-back`, the uppercase
title card `.gm-title`, the italic lowered subscript (the `.gm-uc` grammar),
the description card `.gm-desc`) be brought over to the career body's left
half, **re-hued to the career page's own sand/brown binding** — the
component's purple token ladder does not ship. The component's structure,
gradients, borders, glimmer and type grammar port **verbatim**; every
re-hued value is an existing career token (`UIUX §10.1`), and the dark ink
on the sand cards reuses `--deep` (`#12100a`) — no new hex is invented.

**Per employer tab** the left half holds that employer's roles as stacked
component plates — **PNC Bank**: Branch Sales & Service Representative
(2017-2018), Branch Sales & Service Associate (2018-2019), Branch Banker
(2019-2020); **PNC Private Bank**: Client Service Associate (2020-2021),
Portfolio & Trust Administrator (2021-2022); **Brinker Capital**: Trader
(2022-2023), Portfolio Specialist (2023), Sr. Portfolio Specialist
(2023-2025). Each plate is the component verbatim: the uppercase title in
`.gm-title`, the year as the **italicized subscript** in the `.gm-uc`
grammar (the Docket's own subscript precedent, issue #92), the description
card `.gm-desc`. The description cards **render empty — the owner's
explicit override of the omit-empty ruling (B47, 2026-10-05) for these
components only** ("leave description card with no text for now, not even
stubbed"), sized so a later edit can write 2–3 sentences into each. The
omitted-until-content rule itself is not amended: it stands for every
other block on the page. The description slots (B47 blank slots #3/#4)
are carried by the desc cards from this entry on.

The plates are **visible and contained within the left half of the body**
(left side of the divider bar), **equally sized and evenly spaced with
comfortable padding between each to fit the space**. **No item selector
tool ships** — the plugins page's selector row has no career counterpart,
and the component's "Github" CTA (`.gm-cta`) is omitted (owner chat,
2026-10-06: "No CTA on career role cards"). The header selector, the split
and the right half (Accomplishments / Learnings slots) are **untouched**;
the components are **isolated to their individual tabs** — never visible in
the other tabs they don't belong to.

The stacked plate geometry (each plate's width as the half's own width, the
equal-height/equal-spacing arrangement, the desc card's 2–3-sentence
min-height, and the ≤743px readable reflow of the same) is the
**agent-derived implementation** of the owner's words — "equally sized and
evenly spaced with comfortable padding between each to fit the space" and
"enough vertical height to fit 2-3 sentences in each description card" —
under the B33/B40 provenance pattern: the owner ruled the arrangement, the
values implement it.

**Source:** the owner's issue
[#154](https://github.com/AlastairZeved/The-Portfolio/issues/154), 2026-10-06
— quoted verbatim: "The component that displays the plugins on the \"agentic
plugins\" page of repo AlastairZeved/AlastairZeved needs to be brought over
to this page, razgregory.com/career and the color palette needs to be
completely updated to match the sand and brown of this palette."; per-tab
role lists as transcribed above; "All three components should be visible and
contained within the left half of the body (left side of the divider bar).
They should be equally sized and evenly spaced with comfortable padding
between each to fit the space. Use enough vertical height to fit 2-3
sentences in each description card to be written in a later edit. No item
selector tool needed for this page."; "(leave description card with no text
for now, not even stubbed)"; "Keep these components isolated to their
individual tabs so they are not visible in the other tabs they don't belong
to." — and the owner's four grill answers of 2026-10-06 (owner chat):

1. "Keep split + right-half slots unchanged, only swap left-half content"
   (the split's right half and its slots are untouched).
2. "Yes, verbatim structure re-hued to the sand/brown tokens" (the back
   card, glimmer sweep, uppercase title card and description card all port).
3. "Empty desc cards render, sized per the issue" (the omit-empty override
   for these components).
4. "No CTA on career role cards".

### B57. The Plants on Poles reader renders the monstera-storybook.html document in an iframe (issue #156)

The owner logged the embed in issue #156: the built storybook guidebook is
embedded in the body of the `/plantsandrocks` page. It ships as a **second
file, `monstera-storybook.html`, committed verbatim** — a self-contained
HTML document (base64 WebP pages in a JS array, its own prev/next pager,
dual-page at ≥768px, single-page below, its own CSS carrying the exact
idea-green token block of B48) — and the Plants on Poles reader container
(`.reader--poles`) embeds it in the body via an `<iframe
src="monstera-storybook.html" title="Monstera Division and Moss Pole
Introduction">`. The storybook's internal pager handles paging; the page's
own script law is unchanged (no script is added to `plantsandrocks.html`
itself).

The iframe fills the **body region between the header and the footer** and
scales to fit the width of the viewport end-to-end so there are no gaps on
the sides, with clearance below the title-card overhang (B31's `29 × --rs`
hang plus the card's `8 × --rs` top offset) so the top of it does not
overlap with the title cards. The mobile media block keeps the iframe
working at ≤743px consistent with the existing mobile block's pattern. The
Download button stays **disabled and untouched**.

**This entry supersedes B48's blank-reader discipline for the
`.reader--poles` container only.** The Plants in Rocks reader
(`.reader--rocks`) stays an empty reserved container per B48; the
Download button's disabled state and the B50 header-band/title-card/footer
conventions stand unchanged.

**Source:** the owner's issue
[#156](https://github.com/AlastairZeved/The-Portfolio/issues/156),
2026-10-06 — quoted verbatim: "for the /plantsandrocks page when the plants
tab is selected and being viewed, the attached file needs to be embedded in
the body. It is a dual page guidebook that has already been built in HTML.
Embed it in the body area of the page (between the header and footer) and
make sure the top of it does not overlap with the title cards on the page.
It should scale to fit the width of the viewport end-to-end so there's no
gaps on the side. It already includes mobile formatting with a single page
viewer." — and the owner's four grill answers of 2026-10-06 (owner chat):

1. "Option A — two files, iframe".
2. "Yes, Plants in Rocks stays blank".
3. "Untouched, still disabled".
4. "Fill body region between header and footer".

And the owner's chat direction of 2026-10-06 on the rendered result, quoted
verbatim: "i need you to remove the green header bar from the storybook
reader. it's too much with a header right under the title header so just
remove it" — the storybook document ships **without its top header band**
(the empty 56px `#band` gradient strip is removed from
`monstera-storybook.html`); the storybook's bottom pager band and its pages
stand unchanged.

### B58. The Download button serves the shipped Flattened-Monstera-Division.pdf on the Plants on Poles tab (issue #157)

The owner logged the fill in issue #157: the attached
`Flattened-Monstera-Division.pdf` "needs to be downloadable and targeted by
the 'download' button" on the Plants tab of `/plantsandrocks`. The PDF is
therefore **shipped in the repo root** as `Flattened-Monstera-Division.pdf`
(next to `monstera-storybook.html`, per the owner's grill answer that the
file ships with the site) and the footer Download control becomes a real
`<a class="cta" href="Flattened-Monstera-Division.pdf" download>Download</a>`
— the `download` attribute forces the download; the page's no-script law
(B48) is unchanged.

The control is live **only while the Plants on Poles tab is selected** (the
PDF belongs to that guide); on the Plants in Rocks tab it renders inert and
dimmed, driven by the page's existing CSS `:has` selector — `opacity: 0.55`,
`cursor: not-allowed`, `pointer-events: none` (the 0.55 alpha is B48's
shipped dim value, reused; no new design value is introduced). The inert
state is CSS-only because the page has no script. The Plants in Rocks
reader stays an empty reserved container per B57; the B50
header-band/title-card/footer conventions stand unchanged.

**This entry supersedes B48's disabled-Download discipline** (the button's
"rendered but disabled, no handler" state) — the button is now live on the
Plants on Poles tab. It does not supersede B57.

**Source:** the owner's issue
[#157](https://github.com/AlastairZeved/The-Portfolio/issues/157),
2026-10-06 — quoted verbatim: "On the plants tab, the attached doc needs to
be downloadable and targeted by the 'download' button." (titled "the
download button needs a target in /plantsandrocks on the plants tab") —
and the owner's three grill answers of 2026-10-06 (owner chat):

1. "Disabled on the Rocks tab, enabled only while Plants on Poles is
   selected" (option chosen from the agent's measurement that Plants in
   Rocks has no PDF).
2. "Ship the PDF in the repo root next to monstera-storybook.html and link
   it relatively".
3. "Force download via the HTML download attribute".

### B59. JavaScript ships as external .js files; a strict Content-Security-Policy ships via a Netlify `_headers` file (issue #151)

The owner ruled, in pre-implementation alignment on issue #151 (2026-10-06),
that **B12's "all CSS and JS inline" clause is superseded for scripts**: the
page's JavaScript ships as **external .js files** — `app.js` beside
`index.html`, `monstera-storybook.js` beside `monstera-storybook.html`,
both in the repository root (the publish root), loaded by `<script src>`
with no handler attributes. The inline-CSS clause of B12 stands unchanged.

A **strict Content-Security-Policy** ships as a real HTTP header from a
**`_headers` file at the repository root** (hosting configuration, not a
page asset):

`default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; frame-src 'self'; form-action https://formspree.io; base-uri 'none'; frame-ancestors 'none'; upgrade-insecure-requests`

- `script-src 'self'` only — no `unsafe-inline`, no hashes: the scripts are
  external per this ruling.
- `style-src 'unsafe-inline'` is unavoidable: the CSS is inline by B12.
- `img-src data:` and `font-src data:` carry the embedded base64 WebP pages
  and the self-hosted data-URI faces (B23); `frame-src 'self'` carries the
  B57 storybook iframe; `form-action https://formspree.io` carries the B6
  form. **No Referrer-Policy directive is set** (SECURITY.md — a missing
  referrer files every Formspree submission as spam).
- The issue's "sanitize/encode any user-supplied content" clause was
  measured and is a no-op: the form posts to Formspree and nothing is ever
  rendered back; no dynamic `innerHTML` writes of user data exist anywhere.
  SECURITY.md is left untouched on that point, per the owner's ruling.

**Source:** the owner's four grill answers of 2026-10-06, given in
pre-implementation alignment on issue #151 (owner chat, multiple choice) —
"Add `_headers` at repo root, real HTTP headers"; "Strict policy with
hash-pinned scripts, 'unsafe-inline' only for styles"; "Amend B12 —
externalize JS into .js files"; "Leave SECURITY.md untouched on this
point". (With the scripts external, the strict-policy ruling's
hash-pinning mechanism is moot and `script-src 'self'` carries it; the
strictness ruling itself stands.)

---

### B60. Every note card renders plain — no bold, anywhere (issue #167)

Every note card on the board — **all thirteen**: the six board cards, the
Music note, and the seven linked sub cards — renders its text at weight
**400** (the self-hosted Montserrat Alternates regular rung). No note card
renders bold. **This supersedes B53's scope clause** ("Only the three —
keep the Music note and the six door-cards at 600"): the six board cards
and the Music note join the sub cards at 400. The title card and the two
band-zone anchor lines are untouched (the band anchors are already 400 per
B54; the title card's lines are title-card text, not note text).

**Source:** the owner's issue
[#167](https://github.com/AlastairZeved/The-Portfolio/issues/167),
2026-10-07 — "The bold weight is just too much on the screen when used for
every note card. Remove the bold and adjust the font weight to a normal,
standard size." — and the owner's pre-implementation answer of 2026-10-07
(owner chat, multiple choice): "Yes — all note cards to 400; title card and
band anchors untouched."

### B61. The title card renders on two rungs — the eyebrow on the reduced secondary rung (issue #170)

The title card's two lines render on **two rungs**, TheBoards' own
title-card convention: the **eyebrow "The Portfolio of"** on the reduced
secondary rung — **13.33px / 400**, `line-height: 1.2` — under the name
**"Robert Alastair Zeved Gregory"** on the title rung (**20px / 600**,
B31's rung, unchanged). The reduced rung is TheBoards' `#anchor-title
.title-date` convention (10px/400 under a 15px/600 title — a 2/3 ratio)
scaled to this page's 20px title rung: 20 × 2/3 = 13.33px. **No dates
ship** — on TheBoards' "Today's To Do" cards the secondary line's text
happens to be a date; what #170 takes is the **formatting** (reduced size
and weight), not the date. **This supersedes the one-size clause of B19**
for the eyebrow line only (B31's history: B19 made both lines one size at
15px; B31 raised both to 20px; B61 restores the two-rung render); B31's
title rung, the hug-the-text borders and the +29px overhang stand
unchanged.

**Scope note:** the "Zeved Boards" and "Agentic Plugins" cards of the
board are **note cards and are untouched** — the title cards #170 names
for that work belong to repo AlastairZeved/AlastairZeved's header, per the
owner's pre-implementation correction of 2026-10-07, and were logged as
[AlastairZeved/AlastairZeved
#112](https://github.com/AlastairZeved/AlastairZeved/issues/112).

**Source:** the owner's issue
[#170](https://github.com/AlastairZeved/The-Portfolio/issues/170),
2026-10-07 — "…the text size and formatting needs to be updated as well to
match the title card conventions in repo AlastairZeved/TheBoards. The
description text should match the formatting of the dates in the title
cards of 'Today's To Do' Boards, reduced size and weight. For the title
card on razgregory.com that reads 'The Portfolio of', use the date
formatting of 'Today's To Do' Boards too." — and the owner's
pre-implementation corrections of 2026-10-07 (owner chat), quoted verbatim:
"Don't touch those cards for the reasons given above. Those cards are
referencing a different repo, AlastairZeved/AlastairZeved for its 'Zeved
Boards' and 'Agentic Plugins' cards in the header. Can you log this as an
issue in that repo?"; and, on the Today's To Do card: "On a 'Today's To
Do' board, the title card on the board has the title 'Today's To Do' and
then underneath it is the date. Look for that card's styling. There is no
last updated on that card at all. There is no date formatting. The text
just happens to be the date on those cards and we're not shipping any
dates. The font is a reduced size, geez just look at it. Don't ship
dates."; and the order confirmation: "Order stays: 'The Portfolio of'
(reduced size/weight) first line, 'Robert Alastair Zeved Gregory' (title
rung, 600) second."

### B62. The Parking Lot splits 50/50 — the owner's copy left, the form right, one vertical divider (issue #169)

The footer (the Parking Lot) splits **50/50**, closed by a **vertical
divider bar**, and the contact form **moves to the right half**:

- The **divider bar** is the divider grammar career.html ships
  (`.parking-lot__divider` — 1px wide, 3/4 of the section's inner height,
  centred), **re-tokened to this page's To-Do blue tokens**
  (`color-mix(in srgb, var(--frame) 45%, transparent)` — the mix the
  `#lot-rule` already renders). No new colour, no new token.
- The **contact form** (B6, B20's arrangement) occupies the **right 50%**
  and **scales to fit across any viewport size** — its tracks are `1fr` /
  `2fr` (B20's 1:2 ratio restated in fr units), so it scales up and down;
  at **≤743px** (the repo's mobile breakpoint, career.html's block) the
  halves **stack**, copy above the form.
- The **left half** carries the owner's copy, **verbatim** (italic phrase
  per the issue's markup), rendered 13px/1.5/400 `--ink` (agent-derived per
  the `B33` pattern — between the lot's own 11px labels and 14px inputs).
- **This supersedes B20's "the right side of the pane is deliberately left
  empty" clause** — the right half is the form's. B20's field arrangement
  (Name/Email stacked at half width, Message anchored to their right, its
  size unchanged) stands, now within the right half.
- The lot's measured-content height law (B46) is unchanged; the split rides
  inside `#lot-items`.

**Source:** the owner's issue
[#169](https://github.com/AlastairZeved/The-Portfolio/issues/169),
2026-10-07 — "In the footer of the main page of the site, there needs to be
a divider bar splitting the footer 50/50. The formatting and design should
match the footer used in pages for alastairzeved.com (github repo
AlastairZeved/AlastairZeved), using the blue color palette from the 'Zeved
Boards' tab. Then, move the contact form for Formspree to the right side of
the divider (the right 50% of the footer), and make sure it scales to fit
across any viewport sizes (stacked for mobile). Not just specific viewport
sizes, scaled up and down to fit them all. In the left side of the footer,
add this copy: …" (the copy is transcribed verbatim into `index.html`) —
and the owner's pre-implementation answer of 2026-10-07 (owner chat,
multiple choice): "Vertical divider bar between the halves, reusing the
divider grammar re-tokened to To-Do blue."

### B63. Favicons: the owner's portrait at TheBoards' file convention (issue #168)

The site gains **favicons** — the **owner's portrait**: a blonde guy, hair
short with a **fauxhawk**, wearing **glasses**, eyes **brown**. The drawing
is flat, on the To-Do deep tile (`--deep` `#020812`) inside the `--frame`
`#698ebf` rounded-square ring — existing §2 tokens, no new palette entry
(the skin/blonde illustration values are agent-derived per the `B33`
pattern: the owner ruled the subject, the drawing implements it). Shipped
at **TheBoards' own file convention** — `favicon.ico` (16/32/48) plus an
`icons/` set (`favicon-16/32/48.png`, `apple-touch-icon-192.png`,
`icon-192.png`, `icon-512.png`) — and **linked on every page** in the repo
(`index.html`, `career.html`, `plantsandrocks.html`,
`monstera-storybook.html`). No PWA manifest (B13 stands); `img-src 'self'`
(B59) already carries the set.

**Source:** the owner's issue
[#168](https://github.com/AlastairZeved/The-Portfolio/issues/168),
2026-10-07 — "Design and implement favicons that render as a blonde guy
with glasses. Hair should be short, but in a fauxhawk. Eyes should be
brown." — and the owner's pre-implementation answer of 2026-10-07 (owner
chat, multiple choice): "TheBoards' convention: favicon.ico + icons/ PNG
set, linked on all repo pages."

---

### B64. The career desc cards carry the owner's copy for three roles (issue #176)

The owner's fill pass for the B56 description cards (issue #154): the desc
cards of **Sr. Portfolio Specialist** (Brinker Capital tab, 2023-2025),
**Portfolio & Trust Administrator** (PNC Private Bank tab, 2021-2022) and
**Branch Banker** (PNC Bank tab, 2019-2020) now render the owner's copy
**verbatim**, three paragraphs per card, transcribed from the issue body
without edit. Every other `.gm-desc` card on the page **stays empty** under
B56's explicit override; the omit-empty rule (B47) stands for every block
the owner has not yet filled. The cards keep the component's single
`<p class="gm-card gm-desc">` element — the sibling convention on the
Agentic Plugins page — with the owner's paragraph breaks carried by
`<br><br>`; no new card grammar, no new type value, the card grows past its
B56 min-height as content. The B56 plate geometry is amended for the filled
state under the same provenance pattern: the equal flex cells
(`flex: 1 1 0`) clamp every plate to the empty state's height, so the
filled card overflowed its cell onto the footer — the plates now size to
their content and share the half's leftover space equally
(`flex: 1 1 auto`), the 1.25rem gutter keeping the stack evenly spaced
(the owner's equal-sizing words were ruled for the empty placeholder
state).

**Source:** the owner's issue
[#176](https://github.com/AlastairZeved/The-Portfolio/issues/176),
2026-10-08 — "For the component titled \"Sr. Portfolio Specialist\" in
/career, add the below copy to the description card of the component" —
and the same sentence for "Portfolio & Trust Administrator" and "Branch
Banker", each followed by the exact three-paragraph copy now transcribed
into `career.html`.

### B65. The career footer splits two ways — the tools line left, one divider, the CTA right (issue #177)

The career page's footer drops from **three sections to two**: the **second
divider bar is removed**. The left side of the remaining divider carries a
**one-line tools list** — "Orion Technology", "Factset", "Morningstar",
"Docupace", "BPM", "Salesforce" — where the copy's straight slashes render
as **short divider bars**: 1px wide, the same `--frame`-mix color as the
footer's divider bar (no palette change), but **markedly shorter** than the
footer's 3/4-length bar so the two are visually distinct. The footer bar
renders: the tools line on the left, the full divider bar, then the "Learn
More about Rob" `.cta` on the right. The bar's height is the only new value
and is agent-derived under the B33/B40 provenance pattern (the owner ruled
the relationship — shorter and visually distinct, same palette — the value
implements it): `0.875em` at the facts type size, vertically centred. The
professional-blurb (blank #7) and contact-info (blank #8) slot comments
stand unchanged in their halves; per B47 the empty slots render nothing,
so the owner's two halves are exactly what the bar shows. The tools line
renders on **one line wherever the bar's width allows and wraps to a
second row rather than overflowing wherever it doesn't** (the
744px–~1000px band: a nowrap line pushed the CTA past the lot's edge,
which the no-overlap law forbids) — wrap-only-when-needed implements the
owner's one-line rule, agent-derived under the B33/B40 pattern.

**Source:** the owner's issue
[#177](https://github.com/AlastairZeved/The-Portfolio/issues/177),
2026-10-08 — "There should only be one divider bar, not two. Remove the
second divider bar, then on the left side of the bar add the below copy:
\"Orion Technology | Factset | Morningstar | Docupace | BPM | Salesforce\".
It should all fit in one line in the footer bar, then the divider bar, then
the \"Learn More About Rob\" button. Where I have straight slashes in the
copy, add divider bars. These divider bars need to be even shorter and the
footer's divider bar so that they are visually distinct from the divider
bar without changing the color palette."

### B66. The career role plates read left to right, not top to bottom (issue #173)

The owner logged in issue [#173](https://github.com/AlastairZeved/The-Portfolio/issues/173)
that the per-role plugin components of B56 **read left to right, not top to
bottom**: "These components will never fit in a top to bottom layout once
description text is added. They need to read left to right" — followed by
the per-employer role lists (PNC Bank: Branch Sales & Services
Representative | Branch Sales & Services Associate | Branch Banker; PNC
Private Bank: Client Services Associate | Portfolio & Trust Administrator;
Brinker Capital Investments: Trader | Portfolio Specialist | Sr. Portfolio
Specialist). The row keeps B56's other arrangement values: the plates stay
**equally sized and evenly spaced with comfortable padding between each to
fit the space**, still **visible and contained within the left half**.

**This entry supersedes B56's stacked-plate geometry** (the vertical stack
and the plate height = the half's row height) — that geometry was the
agent-derived implementation of B56's arrangement words, and the owner now
rules the direction. B56's structure, re-hue, empty-then-B64-filled desc
cards, no-CTA, no-selector and tab-isolation laws all stand unchanged. The
reading order is **chronological — oldest role leftmost, newest rightmost**
(owner grill answer, 2026-10-08), which preserves the previous top-to-bottom
reading order. The shipped **≤743px readable reflow stacks the plates again
below the breakpoint** (owner grill answer, 2026-10-08). When the row needs
more height than the left half provides, **the half scrolls vertically**;
the plates size to their content (owner grill answer, 2026-10-08). When
only two plates sit in the row (PNC Private Bank), **they split the row
equally — each half the row's width** (owner grill answer, 2026-10-08).

**Source:** the owner's issue
[#173](https://github.com/AlastairZeved/The-Portfolio/issues/173),
2026-10-08 — quoted verbatim: "These components will never fit in a top to
bottom layout once description text is added. They need to read left to
right:" — and the owner's four grill answers of 2026-10-08 (owner chat):

1. "Keep the existing ≤743px stacked reflow below the breakpoint".
2. "Two equal plates, each half the row width" (PNC Private Bank's
   two-plate row).
3. "Body half scrolls vertically when plates need more height".
4. "Oldest role leftmost, newest rightmost".

### B67. Every note card's default size and placement follows the owner's issue #175 drawing (issue #175)

The owner logged in issue [#175](https://github.com/AlastairZeved/The-Portfolio/issues/175)
a 2560×1440 screenshot of the board displaying "the cards arranged and
re-sized", directing: "These sizes should replace the default sizes of each
note card displayed when a user loads the page. The placement of each note
card must be arranged according to this spec as well." Per B33's provenance
law, the owner's drawing rules the authored card sizes and placements. This
entry **supersedes B52's rest-scale list and the B55 sub-card 0.78 band**,
and **B43's placement values for the cards the drawing moves**; the
Community, Career, Software & AI and Music cards keep their #112 seats and
scales (their measured percentages and scales reproduce the shipped
values to within measurement noise).

The values below are **agent-derived measurements of that screenshot**
(method: outer card footprint — pale fill plus the 2px `--ink-dark` border —
at the drawing's 2560×1223 page viewport, render scale `rs = 1223/1104.55`
under B46's height-anchored landscape law, calibrated against the unchanged
cards' shipped percentages; rest scale = drawing footprint ÷ the card's
measured unscaled content width). Authored `left`% / `top`% / `--card-scale`:

- Community: 13.6% / 18.3% / 2.25 (unchanged)
- Career: 42.3% / 18.5% / 2.21 (unchanged)
- Writing: 66% / 24% / **1.77** (scale re-sized)
- Software & AI: 12.3% / 51.7% / 1.79 (unchanged)
- Plants & Rocks: **40% / 61.5% / 2.25**
- Music: 73% / 54% / 1.70 (unchanged)
- Apple Music: **82.9% / 45.8% / 1.02**
- Spotify: 81.7% / **63.7% / 1.19**
- LinkedIn: **36.6% / 11.5% / 1.06**
- Zeved Boards: **3.2% / 55% / 1.14**
- Agentic Plugins: **14.2% / 61.8% / 1.20**
- Plants on Poles: **37.7% / 73.7% / 0.98**
- Plants in Rocks: **50.2% / 73.8% / 1.03**

**The B52 tier clause is superseded.** The drawing puts several sub cards
above scale 1 (Apple Music 1.02, Spotify 1.19, LinkedIn 1.06, Zeved Boards
1.14, Agentic Plugins 1.20, Plants in Rocks 1.03), so the "six board cards
above 1, sub cards below 1" split no longer holds: the drawing rules the
sizes, not the tier. The gesture bounds stand unchanged — B45's 0.5 floor
and B51's one-fifth-of-viewport ceiling still move the scale from these rest
values. Nothing else changes: the cards' destinations, states, links and the
per-authored-pair link mechanism (B28) are untouched, and the link lines
recompute from the moved cards' centres. One mechanism consequence, noted
for the record: the moved Zeved Boards seat (top:55%, beside Software &
AI's top:51.7% at a 9.1% horizontal gap) makes **B46's measured no-overlap
width floor bind at some landscape aspects** (measured: 1440×900), where
the sheet — band included — rescales as a whole to keep B44's no-overlap
law; where the floor is inert, the height-anchored render is unchanged.
`UIUX §3.4` and `§4` are amended to
name this drawing as the placement and size authority.

**Source:** owner's issue
[#175](https://github.com/AlastairZeved/The-Portfolio/issues/175),
2026-10-08 — "Attached is a 2560x1440 screenshot displaying the cards
arranged and re-sized. These sizes should replace the default sizes of each
note card displayed when a user loads the page. The placement of each note
card must be arranged according to this spec as well." (screenshot:
[issue #175](https://github.com/user-attachments/assets/7d0e99b7-e9b4-4d3b-8e7f-b9bb11b7da36)).

### B68. The Components line is removed entirely; the footer's copy is updated to the issue-#174 text and stays in the Parking Lot (issue #174)

The **Components** band zone renders **no anchor line**: the B38/B54 line
"Each card links to a page housing my work in that domain." is **removed
entirely**, per the owner's issue #174. The zone keeps its band label and
renders its furniture only. `UIUX §3.3` is amended accordingly.

The **Parking Lot footer keeps B62's layout** — the owner's copy in the
**left half**, the Formspree form in the **right half**, the 50/50 split and
the vertical divider bar unchanged. B68's only footer change is the **copy's
text**: the left half carries the issue-#174 edited version, verbatim (the
copy of record below), superseding issue #169's original text. The phrase
*curiouser and curiouser.* renders italic, and the copy keeps B62's
rendering — 13px / 1.5 / 400 in `--ink`. **The copy does not move to the
Components band**: the owner's mid-implementation ruling of 2026-10-08 —
"I guess keep the text in the parking lot then. I didn't realize it would be
so many lines. Make sure the copy gets updated with all edits though." —
supersedes issue #174's move instruction (measured in implementation: the
copy renders ~10–11 lines in the band, which grew the band's rule from the
67.38 two-line floor to ~218–240 logical px and broke B46's parity suite).
The owner's companion ruling of 2026-10-08 confirms the Components removal
stands on its own: "Remove it entirely (as the issue says verbatim) —
Components zone renders no anchor line." `UIUX §6.2` is amended
accordingly.

**Copy of record (verbatim, issue #174):** "Hey, I'm Rob. Welcome to my
digital garden. This is a sort of central hub for all of the things I work
on, across all of the sites and pseudonyms I've used. I'm weary of calling
these "hobbies" or "passions"; they're more like symptoms, the after effect
of the passion. I simply pursue my curiosity, without much of a thought of
whether I can or cannot learn the subject at hand. That also has the side
effect of my works sprawling across quite a few domains. The cards on this
page link to those works (the digital works at least) to keep everything in
one place. None are stale, but my curiosity is ever wandering and I may run
out of questions in a subject for a time. But the great work always
continues as my curiosity finds its flame again. All it takes to flex
curiousity is to ask a question, then keep asking questions and always be
curiouser and curiouser."

**Source:** owner's issue
[#174](https://github.com/AlastairZeved/The-Portfolio/issues/174),
2026-10-08 — "In the "Components" section, remove this line: "Each page
links to a page housing my work in that domain" entirely. Then, Move this
copy (and it's edits) to the "Components" section: [the copy of record
above] Once that is moved, the Formspree contact form info can move back
over to the left side of the footer." (Transcription note: the issue quotes
the removed line as "Each page links to a page housing my work in that
domain"; the line as actually shipped — B54's copy of record — reads "Each
card links to a page housing my work in that domain.", which is what this
ruling removes.) — with the owner's mid-implementation
rulings of 2026-10-08 (owner chat), quoted verbatim: "I guess keep the text
in the parking lot then. I didn't realize it would be so many lines. Make
sure the copy gets updated with all edits though."; and "Remove it entirely
(as the issue says verbatim) — Components zone renders no anchor line; the
B62 footer layout (copy left, form right) just gets the updated copy". The
owner's pre-implementation answer of 2026-10-08 keeping the italic phrase
("Yes, keep the italic phrase") stands; the earlier pre-implementation
formatting answers tied to the Components move (13px/1.5 at weight 300 in
the band; B20's empty right half restored) lapse with the move they
governed.



### B69. The Components zone renders the pseudonyms line (issue #185)

The **Components** band zone renders one text line — **"Pseudonyms and
DBAs: aboveaveragerob, Alastair Zeved, Philly Plant Dads"** — in the
identical anchor grammar the B38/B54 line used: hanging from the zone's
top at `--band-top`, in `--ink` at 15px/600 (`UIUX`'s 16.57px/400 under
B46's ×1.10455 rescale; weight plain per B54), static, no editing
affordance. The zone's `pointer-events: none` stands. B68's removal of the
prior Components line stands — this entry adds the zone's new line; it
does not restore B38's copy. No new token is invented.

**Source:** owner's issue
[#185](https://github.com/AlastairZeved/The-Portfolio/issues/185),
2026-10-08 — "Add this new copy to the \"Components\" section of the header
bar: \"Pseudonyms and DBAs: aboveaveragerob, Alastair Zeved, Philly Plant
Dads\"" — with the owner's pre-implementation answer of 2026-10-08 (owner
chat, multiple choice): the line sits in the identical anchor grammar
("Second line below the existing one, identical styling and mechanism"
— given with the B68 state where the prior line is already removed, so the
pseudonyms line is the zone's only line).

### B70. The Parking Lot's left-half copy is replaced with the issue-#184 text (issue #184)

The Parking Lot keeps **B62's layout** — the owner's copy in the **left
half**, the Formspree form in the **right half**, the 50/50 split and the
vertical divider bar unchanged — and the **left half's copy is replaced**
with the issue-#184 text, verbatim (the copy of record below),
**superseding B68's issue-#174 copy of record**. The issue's literal
newline break renders as **two paragraphs with no gap between them**
(the copy's rendering stands at 13px / 1.5 / 400 in `--ink` per B62, and
the paragraphs carry no margin). The closing phrase **renders italic**
(B68's italic-phrase ruling stands) and is spelled **"curiouser"** — the
owner's pre-implementation correction of the issue's "curioser" typo.
`UIUX §6.2` is amended accordingly.

**Copy of record (verbatim, issue #184):** "Hey, I'm Rob. Welcome to my
digital garden. This is a sort of central hub for all of the things I work
on, across all of the sites and pseudonyms I've used. I'm weary of calling
any of these "hobbies" or "passions"; they're actually more of an after
effect of the real passion: simply following my curiosity - through any and
all of the vagaries. All it takes to flex one's curiosity is to ask a
question, then keep asking questions and always strive to be curioser and
curiouser."

**Source:** owner's issue
[#184](https://github.com/AlastairZeved/The-Portfolio/issues/184),
2026-10-08 — "Update the copy in the parking lot section to this: [the copy
of record above]" — with the owner's pre-implementation answers of
2026-10-08 (owner chat, multiple choice): the issue's newline renders as
two paragraphs with no blank line between them ("Two paragraphs, no blank
lines between them. It just starts on a new line."); and the closing phrase
renders italic with the spelling corrected ("Keep it italic, correct
spelling to \"curiouser\"").

### B71. The Requirements line's copy is replaced with the issue-#183 text (issue #183)

The **Requirements** line's **copy is replaced**: the line reads **"Click
the note cards to launch my various pages and work across the web."**,
**superseding B37's/B54's copy of record** ("Click around to explore my
works!"). Everything else stands unchanged: B39's anchor (left-anchored at
the title card's rendered right border + one `--gutter`, at `--band-top`),
the 15px/600 rung (16.57px/400 under B46's rescale), weight plain per B54,
`--ink`, static, no editing affordance, the zone's `pointer-events: none`.
`UIUX §3.3` is amended accordingly.

**Source:** owner's issue
[#183](https://github.com/AlastairZeved/The-Portfolio/issues/183),
2026-10-08 — "Replace the existing copy with this new copy to the
\"Requirements\" section in the right side of the header bar: \"Click the
note cards to launch my various pages and work across the web.\""

### B72. The title card's eyebrow reads "The Digital Garden of" (issue #188)

The title card's **line 1 (the eyebrow)** reads **"The Digital Garden of"**
— **superseding B17's "The Portfolio of" on the eyebrow line only**. The
title card's text otherwise stands byte-identical: line 2 remains
**"Robert Alastair Zeved Gregory"**, all on the same two lines — the
eyebrow above the name — with the eyebrow's format unchanged (B61's reduced
secondary rung, 13.33px/400, `line-height: 1.2`; B31's 20px/600 title rung;
B19's hug-the-text box). No size, weight, spacing or mechanism changes.
`UIUX §3.2` is amended accordingly.

**Source:** owner's issue
[#188](https://github.com/AlastairZeved/The-Portfolio/issues/188),
2026-10-08 — "The title card currently reads: \"The Portfolio of\" which
needs to be removed and replaced with \"The Digital Garden of\". Same text
formatting, all on one line with \"Robert Alastair Zeved Gregory\" below
it."

### B73. The career page's palette is re-derived as a monochrome gray scale at the landing palette's luminance rungs (issue #190)

`career.html`'s binding is re-derived a second time: the B47 sand/brown
re-hue is **superseded by a pure neutral gray scale — zero hue** — at the
**landing page's exact relative luminance rungs**, role for role with
TheBoards' ladder:

`--deep` `#080808` (0.0023) · `--card` `#151515` (0.0077) ·
`--water-top` `#636363` (0.1237) · `--water-mid` `#4d4d4d` (0.0737) ·
`--water-bot` `#333333` (0.0325) · `--frame` `#8c8c8c` (0.2611) ·
`--note` `#cbcbcb` (0.5962) · `--glow-gray` `#676767` (0.1364 — one rung
below `--frame`, B132's rung rule) · `--water-bot-a` `51 51 51`.

The ladder's relationships stand unchanged (card above deep, note brightest
on the deep, glow one rung below frame), and because every rung sits at the
landing palette's luminance, the ink poles (`--ink-light` `#f4f5f1`,
`--ink-dim`) and `UIUX §2.3`'s contrast table carry over unchanged. The glow
token renames `--glow-sand` → `--glow-gray`; no value ships under the old
name. `UIUX §10.1` is amended accordingly, and `test/career.js`'s ladder
pins are rewritten deliberately (they pinned the B47 hexes).

**Source:** the owner's issue
[#190](https://github.com/AlastairZeved/The-Portfolio/issues/190),
2026-10-09 — "Rederive the color palette of the page /career into a
monochrome color scale using the same luminescence and hue wheel as the
landing page's color palette." — with the owner's pre-implementation
answers of 2026-10-09 (owner chat): on the derivation, "No, monochrome.
Choose the monochrome colors in the same families as the others with the
same luminescence and everything."; on the first candidate set (a blue-hued
monochrome scale), "these colors are not monochrome. monochrome. not blue.
monochrome."; and on the final neutral gray set, "confirmed and approved
for use." The final hexes are the owner's sign-off, per the issue-#133
blank-slot-9 precedent.

### B74. The career components cap at half the header→footer region; the description card carries the scroll (issue #186)

The career body's role components are **bounded above the mobile breakpoint**.
Each component is capped at **half the left half's own height** — "half of that
length", the header→footer region the split lays out — and is **never sized from
the header to the footer's entire length**. Where the cap leaves a description
card less room than its content needs, the card **scrolls its own text**: above
the breakpoint the description card is the page's only scroll container. The
page is **one viewport** — it does not scroll vertically and fits without a
scroll — and the row of components is **vertically centred** in the left half.

**This entry supersedes B66's half-scroll clause** ("Body half scrolls
vertically when plates need more height", owner grill answer 2026-10-08): the
left half is no longer a scroll container; the scroll lives inside the
description card. B66's left-to-right row, its chronological oldest-leftmost
order and its two-equal-plates rule stand unchanged, as do B56's ported
structure and B64's filled copy.

The shipped mechanism is agent-derived under the B33/B40 provenance pattern
(the owner ruled the relationships — "half of that length", the component as
the capped thing, the description card as the scroller — the values implement
them; no literal is invented): above 744px the page holds the viewport's height
(`html, body { height: 100dvh }`, with the page's `100vh` fallback line above
it as `--rs` does) and `main` may shrink (`min-height: 0` — without it the flex
chain is content-driven and the page scrolls, which is the #186 defect), so the
split, the shown employer and its `1fr` row are all definite and the gallery's
`height: 50%` resolves against the grid area; the plates cap at `100%` of that
box, and the description card takes the plate's remainder and scrolls
(`overflow-y: auto`). The fixed-height band and the lot hold their own content
height (`flex: 0 0 auto`): without it a shrunken lot's 50px CTA overflowed the
lot by 3–4px and scrolled the page in ≥744px-wide windows under ~470px tall
(measured 844×390, 744×400). The B56 description-card floor (`116 × --rs`) renders as a
**shrinkable flex basis** for the empty placeholder, and a filled card sizes to
its content (B64), so the cap is met by the card's own scroll rather than by
cutting it. The component's own `overflow: hidden` bounds it, so the page never
carries the overflow. At ≤743px nothing changes: the shipped stacked reflow
keeps scrolling the page (owner grill answer, 2026-10-09).

Measured residue of the same render: in a window **≤900px wide and ≤750px tall**
the three-plate row's role titles wrap until the title + year + the card's
minimum box exceed half the half; the cap then holds and the component's bottom
is bounded rather than scrolled (the page still does not scroll). **B75 (below)
scales the component's type with the render scale and removes that residue** —
re-measured: no clipped component at any size from 744×600 to 2560×1440.

**Source:** the owner's issue
[#186](https://github.com/AlastairZeved/The-Portfolio/issues/186),
2026-10-08 — quoted verbatim: "The components displaying the roles in /career
were supposed to carry a vertical scroll if the description card became too
long. They are NOT to be sized from header to footer's entire length. Half of
that length in height for the components is more than enough with a scroll bar
inside of the description of the component for overflow. Under no circumstances
was a vertical scroll to be introduced to the entire web page. That is standing
law. The page does not scroll and it fits on one viewport without a scroll." —
and the owner's four grill answers of 2026-10-09 (owner chat), selected from the
agent's proposed options and quoted as the selected text:

1. "Half the header→footer region (band bottom → footer top); the cap binds the
   whole role component, and the description card scrolls inside it".
2. "Yes — B74 supersedes B66's half-scroll clause; the only scroll is inside the
   description card".
3. "Desktop only — the cap + internal description scroll apply above 743px; the
   ≤743px stacked reflow keeps scrolling the page as today".
4. "Vertically centred in the left half".

### B75. The career component's type scales with the render scale, and its scroll bar is visible inside the description card (issue #186)

The career body's role components render their **type at the page's render
scale**. The component's own 1rem is `--rs`-scaled as `--c1`, and every
type-derived literal of the component is the shipped value × `--c1` — the title
card's and description card's type, the title card's padding, the year
subscript and its margin, the description card's margin and padding, the
plate's own padding, and the description card's placeholder size. The scale
carries **no floor**: it is the band's own convention (B46/B49), and any floor
holds the title + year + the card above the cap in a short viewport, where the
plate would then cut the title — measured at 744×500 and below. Legibility
rests where the page already puts it: the ≤743px block's shipped readable
values, the same guarantee the band's scaled literals depend on. Measured, the
component's type renders 16.08px at 1440×1110 (`--rs` = 1.005 — the design
canvas is unchanged), 13.04px at 1440×900, 11.12px at 1024×768, 8.69px at
744×600 and 5.65px at 844×390.

**This removes B74's residue**: measured, no component is clipped and the page
does not scroll at any tested size from 744×400 through 2560×1440.

The description card's scroll bar is a **real, visible, in-card scroll bar**.
The platform overlay scrollbar the page inherited paints nothing at rest, so
the card's overflow read as a clipped card. `::-webkit-scrollbar` forces the
classic (non-overlay) bar in Chromium and Safari — **6px** wide, so it takes no
room — its thumb the card's own ink (`--ink`, the token the card's border
already uses) over a **transparent** track that leaves the card's surface
showing; Firefox reads `scrollbar-width: thin` / `scrollbar-color`, scoped
behind `@supports (-moz-appearance: none)` because in Chromium the standard
property wins the cascade and widens the bar to 10px. The bar occupies layout
inside the card's border box (measured 6px of the card's 170.4px width at
1440×1110, thumb `#080808`), and a card that does not overflow shows none. The
card is keyboard-focusable now that it scrolls, so it wears the page's own
focus ring (`--ink-light`, offset 2px so the ring lands on the plate outside
the card's own ink border).

Values are agent-derived under the B33/B40 provenance pattern: the owner ruled
the relationships — the type scales with the component, it stays readable, the
bar sits inside the card and takes no room — and the values implement them. No
new hex or design size is invented; `--c1` carries the scale and `--ink` the
thumb.

**Source:** the owner's follow-up of 2026-10-09 (owner chat) — quoted verbatim,
with one expletive removed at the owner's direction: "why is the scroll bar
outside of the description box? Put it inside [expletive removed]. It takes up
no room. And in these smaller viewports, why are you not scaling the font down?
It still needs to be readable but come on man, you're scaling the component down
but not the font size?"

### B76. The career role components render the agentic-plugins source geometry, scaled uniformly by the plate's own width (issue #194)

The career body's role components had drifted from their source design — the
owner: the components' title cards "were edited at some point and it needs to
be fixed in /career". B76 re-renders the `.gregorian-mode` component at the
**agentic-plugins source geometry exactly** (repo AlastairZeved/AlastairZeved,
`agentic-plugins` page's components), **scaled uniformly by the plate's own
width** — the source's fixed 830px design re-rendered as one scale unit:
**1 source px = plate-width/830** (container queries; the component's own
proportions are identical to the source's at every size):

- the **back card** is inset `90 / 165 / 90` source px (the source's
  `.gm-back`), so the plate's canvas shows around it;
- the **title card** is `427` source px wide at top `55` — **straddling the
  back card's `90` top edge** (the owner: "It overhangs the background cards
  top edge straddling the top of the background card. Gap between it and the
  description card below it.");
- the **description card** is `600` source px wide — **wider than the `500`
  back card, which it overhangs on both sides** — and the **back card
  extends vertically past it**: the card's bottom margin is the source's
  full desc→plate distance (`202` source px — the `122` bottom padding plus
  the `30 + 50` CTA block the career page does not port), so the back
  card's own `90` bottom inset leaves **`112` source px of back card
  visibly showing below the description card** — long copy scrolls inside
  the card instead (the owner: "The background card is supposed to extend
  vertically past the description card");
- the component's **type renders at the source's ratios** — title `28`, year
  `14`, desc `20` per `830px` plate — with the **owner's readable floor: no
  component type renders below `11px`**. The floor may break the proportions
  on small plates; the owner accepted exactly that trade ("Exact ratios with
  a readable floor (e.g. desc never below ~11px) — floors slightly break
  proportionality on small plates").
- **long titles wrap** to two lines rather than shrinking ("Let long titles
  wrap to two lines instead of scaling type") — the year subscript stays in
  flow under the title card so a wrapped title pushes it down instead of
  colliding with it;
- **the row count scales the component**: "Yes — plate-relative: two-across
  rows render bigger components than three-across at the same viewport; type
  keeps the exact agentic-plugins ratios" — PNC Private Bank's two-across row
  renders proportionally larger components than the three-across rows.

**This entry supersedes B75's viewport type scaling** (the `--c1 = 16 × --rs`
law and its measured design-canvas values) and **amends B75's "a card that
does not overflow shows none" clause**: a **filled** description card always
shows the styled in-card bar (`overflow-y: scroll` — the bar's gutter is
present even where the copy fits; the thumb renders when the content
overflows), while the **empty** placeholder stays bare exactly as today
("Filled cards always show the bar; empty cards stay bare as today"). B75's
scroll-bar styling (6px classic in-card bar, thumb `--ink`, transparent
track, Firefox `@supports`) is carried into B76 unchanged.

**B74 stands untouched**: the page is one viewport, each component caps at
half the left half's own height, the row is vertically centred in the half,
and the description card remains the page's only scroll container; the
≤743px block's shipped page reflow (stacked plates, page may scroll) also
stands. The component's geometry — unlike the type — is one design at every
width; the 11px floor keeps the ≤743px render readable where the ratios
would shrink the type away.

Values are agent-derived under the B33/B40 provenance pattern: the owner
ruled the relationships (the source design, the plate-relative uniform
scale, the straddle, the wrap, the floor, the always-visible filled-card
bar); the literals implement them — every value is a source px of the
830px design, and the `11px` floor is the owner's own example value.

**Source:** the owner's issue
[#194](https://github.com/AlastairZeved/The-Portfolio/issues/194),
2026-10-09 — quoted verbatim: "In /career, the components displaying the
various roles should have a title card that overhangs the top of the
description card. The description card is supposed to be wider than the
background card but shorter than it. These are supposed to be designed
exactly like the components from GitHub repo AlastairZeved/AlastairZeved on
the /agentic-plugins page's component selector, but in this color family.
This component should be standardized. For long titles, scale the text size
down so it fits. For long descriptions, add a vertical scrollbar (always
visible and in this color palette) to the description card. The text size of
the description card should match the text size of the components in
agentic-plugins. The /career page's components should also look like this,
but scaled down as a component to fit three across, then scaled up in size
where there's only two across." — the issue body also embeds three
screenshots of the agentic-plugins components (github.com/user-attachments/
assets/46cc0bf7-9a89-4197-9012-735bc0f09a91, /5f3d0b31-7d5b-4d1b-bc19-
c78b35f9ddf0, /d65cafcd-1ad6-4018-94f0-af2fb11a299e), referenced here, not
re-rendered — and the owner's seven grill answers of 2026-10-09 (owner chat,
issue #194 grill), quoted verbatim as answered:

1. "It overhangs the background cards top edge straddling the top of the
   background card. Gap between it and the description card below it."
2. "Yes — plate-relative: two-across rows render bigger components than
   three-across at the same viewport; type keeps the exact agentic-plugins
   ratios"
3. "Let long titles wrap to two lines instead of scaling type"
4. "Filled cards always show the bar; empty cards stay bare as today"
5. "Yes — desc ends within the back card's vertical span; scroll takes over"
6. "Uniform by plate width — component keeps the source's exact proportions
   everywhere"
7. "Exact ratios with a readable floor (e.g. desc never below ~11px) — floors
   slightly break proportionality on small plates"

and the owner's correction of 2026-10-09 (owner chat, on the first PR
render) — quoted verbatim, with one expletive removed at the owner's
direction: "nope, wrong. The background card is supposed to extend
vertically past the description card. You have a source of truth, you have
the components existing already in /agentic-plugins. why is this so
[expletive removed] difficult?"

### B77. The career footer's left half carries a second line of copy beneath the tools line (issue #193)

The career footer's left half renders **a second line of copy directly
beneath B65's tools line**: "Maryville University of St. Louis | B.S.
Accounting | 2021 | Magna cum laude". Where the copy carries straight
bars, they render as **the same short divider bars as the top line** — the
same 1px width, the same `--frame`-mix color, the same `0.875em` height,
the same `0.6em` gap — so the two lines are one grammar stacked, separated
by the lot's existing `0.35em` paragraph gap. **No new design values are
introduced**: the line reuses the B65 rule set unchanged.

The line renders on one line wherever the bar's width allows and wraps
rather than overflows where it doesn't — B65's wrap-only-when-needed
carries over to the second line unchanged, as does the no-overlap law it
serves. The footer's structure is untouched: the two-way split, the one
full divider bar, the `.cta` right, the empty #7/#8 slots (B47), and the
lot's `134.76 × --rs` floor with content growing past it. B65 stands in
full; this entry adds the second line beneath it.

**Short viewports are deferred to their own work.** In the ~400px-tall
windows the suite checks (744×400, 844×390) the bar's floor is tiny
(~48px) and the copy wraps to two rows per line, so the bar's height is
set by the copy instead of the CTA: it grows 79px → 133px and the role
components sit 3–11px past their B74 cap (the page still fits one viewport
and does not scroll; at every other tested size the bar's height is
unchanged — 135px / 98px / 79px with and without the line). The owner
deferred that geometry.

**Source:** the owner's issue
[#193](https://github.com/AlastairZeved/The-Portfolio/issues/193),
2026-10-09 — quoted verbatim: "Underneath: "Orion Technology | Factset |
Morningstar | Docupace | BPM | Salesforce" add another line of copy that
reads: "Maryville University of St. Louis  | B.S. Accounting | 2021 |
Magna cum laude"

Use the same dividers in between sections as the top line"

**Source:** the owner in chat, 2026-10-09 — quoted verbatim: "Mobile
viewports are an entirely separate issue that will be resolved with their
own work at a future date."
