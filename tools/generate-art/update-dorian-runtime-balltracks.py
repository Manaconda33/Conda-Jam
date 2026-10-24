"""Copy reviewed Dorian runtime ball paths into atlas provenance records."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ANIMATION = ROOT / "src/core/animation.js"
GEN = ROOT / "tools/generate-art"


def runtime_tracks() -> dict[str, dict[str, list[float]]]:
    source = ANIMATION.read_text()
    start = source.index("},'dorian-mycel':{")
    end = source.index("},'luca-velori':{", start)
    block = source[start:end]
    tracks = {}
    pattern = re.compile(r"(?:'([^']+)'|\"([^\"]+)\"|([a-z0-9-]+)):\{height:\[([^\]]+)\],forward:\[([^\]]+)\]\}")
    for match in pattern.finditer(block):
        key = match.group(1) or match.group(2) or match.group(3)
        tracks[key] = {
            "height": [float(value.strip()) for value in match.group(4).split(",")],
            "forward": [float(value.strip()) for value in match.group(5).split(",")],
        }
    return tracks


def main() -> None:
    tracks = runtime_tracks()
    if len(tracks) != 23:
        raise SystemExit(f"Expected 23 Dorian ball-bearing runtime tracks, found {len(tracks)}")
    updated = 0
    for path in sorted(GEN.glob("dorian-mycel-*-layouts.json")):
        try:
            layouts = json.loads(path.read_text())
        except (json.JSONDecodeError, UnicodeDecodeError):
            continue
        changed = False
        for entry in layouts:
            if entry.get("athlete") != "dorian-mycel" or entry.get("clip") not in tracks:
                continue
            provenance = entry.setdefault("provenance", {})
            provenance["runtimeBallTrack"] = tracks[entry["clip"]]
            provenance["runtimeBallTrackReview"] = {
                "status": "reviewed-native-100-and-120",
                "date": "2026-10-24",
                "sourceBallTrackPreserved": True,
                "notes": "Source ballTrack remains verbatim. Runtime points were checked in actual Canvas renders against the authored Dorian pose in both facings; action event and aerial last-carry contacts were calibrated where needed.",
            }
            changed = True
            updated += 1
        if changed:
            path.write_text(json.dumps(layouts, indent=2) + "\n")

    ext_path = GEN / "dorian-mycel-locomotion-extension-provenance.json"
    ext = json.loads(ext_path.read_text())
    ext["runtimeBallTracks"] = {key: tracks[key] for key in ("idle-ball", "dribble", "dribble-run")}
    ext["runtimeBallTrackReview"] = {
        "status": "reviewed-native-100-and-120",
        "date": "2026-10-24",
        "notes": "All frames of idle-ball, the 10-pose dribble loop, and the 11-pose dribble-run loop were captured with the separate ball in both facings. New authored frames 08–09 and 08–10 use their own aligned runtime samples.",
    }
    ext_path.write_text(json.dumps(ext, indent=2) + "\n")
    print(json.dumps({"runtimeTracks": len(tracks), "layoutProvenanceEntriesUpdated": updated}))


if __name__ == "__main__":
    main()
