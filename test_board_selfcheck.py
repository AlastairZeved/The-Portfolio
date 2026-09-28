#!/usr/bin/env python3
"""test_board_selfcheck.py — issue 0001 §9 acceptance gate, run with plain python3.

Parses EVERY board in assets/content-of-boards.json (no sampling) and asserts:
    total notes = 74 · total links = 44 · total lot entries = 4 · orphan links = 0
It also asserts the ladder hexes are byte-identical to issue §2 (§2.2.2), that
no monospace face exists anywhere in the engine, and that the §7 strip-list
chrome is absent from the built sources — asserted, not eyeballed.

No framework, no fixtures. Exit 0 on green, raise AssertionError loudly on red.
"""
import hashlib
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent
DATA = ROOT / "assets" / "content-of-boards.json"
SOURCES = ["index.html", "engine.css", "board-engine.js"]

EXPECTED_SHA256 = "506cbc1431e2fbce7a6fde339b851b4dfb1f8243448cb846e2a3bf26d313e6d4"

# §2.2.2 ladder, byte-identical (issue §2 was verified against source by the orchestrator)
LADDERS = {
    "todo":     {"deep": "#020812", "card": "#08152c", "frame": "#698ebf", "note": "#a0d4da",
                 "water-top": "#34697f", "water-mid": "#255265", "water-bot": "#163646"},
    "idea":     {"deep": "#000a06", "card": "#001a0e", "frame": "#52997f", "note": "#b9d2b2",
                 "water-top": "#486b49", "water-mid": "#345439", "water-bot": "#1f3825"},
    "note":     {"deep": "#0c0512", "card": "#1e0f28", "frame": "#9d80b9", "note": "#cec6ed",
                 "water-top": "#6d5b83", "water-mid": "#534769", "water-bot": "#382e47"},
    "learning": {"deep": "#11040b", "card": "#260e12", "frame": "#b57a9b", "note": "#e6c2c9",
                 "water-top": "#855562", "water-mid": "#6a414c", "water-bot": "#472a35"},
}
FIXED_TOKENS = {
    "chrome": "#020812", "ink-dark": "#031019", "ink-light": "#f4f5f1",
    "accent-page": "#6d9cb0", "accent-restore": "#b6dee2", "accent-copy": "#698ebf",
    "danger": "#e2a08c", "highlight": "#f2d64b",
}

# Owner ruling 1 (§7): chrome that must NOT be built. Searched in the built
# sources only (the data file legitimately contains words like "Delete").
STRIP_TOKENS = [
    "note-tb", "note-tb-btn", "reminder", "New board", "Export", "Import",
    "Collapse", "draggable", "resizer", "resize-frame", "resize handle",
    "taskbar", "system tray", "title bar",
    "CALENDAR BOARD", "5A 2026", "board-actions", "action-tab", "trash",
]
# Owner ruling 2026-09-27: no monospace face anywhere.
MONO_TOKENS = ["monospace", "mono,", "Courier", "Consolas", "Menlo", "JetBrains"]


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    # --- source integrity ---
    actual = sha256(DATA)
    assert actual == EXPECTED_SHA256, f"data file changed: {actual}"
    css = (ROOT / "engine.css").read_text()
    js = (ROOT / "board-engine.js").read_text()
    html = (ROOT / "index.html").read_text()

    # --- ladder hexes byte-identical ---
    for cat, rungs in LADDERS.items():
        block = re.search(r'#board\[data-cat="%s"\]\s*\{(.*?)\}' % cat, css, re.S)
        assert block, f"ladder scope missing for {cat}"
        for rung, hexv in rungs.items():
            assert f"--{rung}: {hexv}" in block.group(1), \
                f"{cat}.{rung} not byte-identical ({hexv})"
    for name, hexv in FIXED_TOKENS.items():
        assert re.search(rf"--{name}:\s*{hexv}\b", css), f"fixed token --{name} wrong"

    # --- no monospace anywhere (owner ruling 2026-09-27) ---
    for tok in MONO_TOKENS:
        for src_name, src in (("engine.css", css), ("board-engine.js", js), ("index.html", html)):
            assert tok.lower() not in src.lower(), f"monospace token '{tok}' in {src_name}"

    # --- §7 strip-list absent from built sources ---
    # Word-boundary, case-sensitive: `!important` in CSS must not read as "Import".
    for tok in STRIP_TOKENS:
        pat = re.compile(r"\b%s\b" % re.escape(tok))
        for src_name, src in (("engine.css", css), ("board-engine.js", js), ("index.html", html)):
            assert not pat.search(src), f"strip-list chrome '{tok}' in {src_name}"

    # --- the data contract: parse EVERY board ---
    data = json.loads(DATA.read_text())
    boards = data["boards"]
    total_notes = total_links = total_lot = orphans = 0
    per_board = []
    for b in boards:
        notes = b.get("notes", [])
        links = b.get("links", [])
        lot = b.get("parkingLot", [])
        ids = {n["id"] for n in notes} | {e["id"] for e in lot}
        board_orphans = sum(1 for l in links if l["a"] not in ids or l["b"] not in ids)
        total_notes += len(notes)
        total_links += len(links)
        total_lot += len(lot)
        orphans += board_orphans
        per_board.append((b["title"][:32], len(notes), len(links), len(lot), board_orphans))

    print("board".ljust(34), "notes links lot orphan")
    for t, n, lk, lo, o in per_board:
        print(t.ljust(34), f"{n:5} {lk:5} {lo:3} {o:6}")
    print("-" * 60)
    print(f"TOTALS                             {total_notes:5} {total_links:5} {total_lot:3} {orphans:6}")

    assert total_notes == 74, f"total notes {total_notes} != 74"
    assert total_links == 44, f"total links {total_links} != 44"
    assert total_lot == 4, f"total lot entries {total_lot} != 4"
    assert orphans == 0, f"orphan links {orphans} != 0"

    # --- §3 scale law, exercised at the wireframes' 2560x1440 ---
    rw, rh = 1576.6634522661525, 1000.0  # the export's board canvas, every note carries it
    vw, vh = 2560, 1440
    render_scale = min(vh / 1000, (vw - 300) / 900)
    logical_w = (vw - 300) / render_scale
    logical_h = vh / render_scale
    k = min(logical_w / rw, logical_h / rh)
    print(f"scale law @2560x1440: renderScale={render_scale:.4f} "
          f"LOGICAL_W={logical_w:.1f} LOGICAL_H={logical_h:.1f} k={k:.4f}")
    assert abs(render_scale - 1.44) < 1e-9, "renderScale != 1.44 at 2560x1440"
    assert abs(logical_h - 1000) < 1e-9, "LOGICAL_H != 1000 at 2560x1440"
    assert 0.9954 < k < 0.9956, f"k {k} not ≈0.9955 at 2560x1440"

    # --- hover glow ring: measured, not asserted (§12). The 1px ring is drawn in
    # --frame on the --deep ground; non-text contrast must clear 3:1 per ladder.
    def lum(hexs):
        r, g, b = (int(hexs[i:i+2], 16) / 255 for i in (1, 3, 5))
        f = lambda c: c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
        r, g, b = f(r), f(g), f(b)
        return 0.2126 * r + 0.7152 * g + 0.0722 * b
    for cat, rungs in LADDERS.items():
        ratio = (max(lum(rungs["frame"]), lum(rungs["deep"])) + 0.05) / \
                (min(lum(rungs["frame"]), lum(rungs["deep"])) + 0.05)
        assert ratio >= 3.0, f"glow ring {cat}: {ratio:.2f}:1 below 3:1"
        print(f"glow ring {cat.ljust(9)} --frame on --deep: {ratio:.2f}:1 (≥3:1)")

    print("SELF-CHECK GREEN: 74 notes / 44 links / 4 lot entries / 0 orphans; "
          "ladders byte-identical; strip-list and monospace absent; scale law holds.")


if __name__ == "__main__":
    try:
        main()
    except AssertionError as e:
        print(f"SELF-CHECK FAIL: {e}", file=sys.stderr)
        sys.exit(1)
