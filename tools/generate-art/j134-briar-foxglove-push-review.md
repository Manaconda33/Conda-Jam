# J.134 Briar Foxglove `push` — visual and native review

## Accepted athlete atlas

The production candidate combines eleven individually generated, ball-free pose sources. Frames are grounded ready, step/lower, shoulder load, drive plant, halfway reach, open-palm contact, forward follow-through, arm retraction, recovery step, balanced recovery, and settled ready. The contact anchor is frame 5 at tick 8 in the canonical 11-frame clip.

Independent visual review accepts Briar's identity, human anatomy, full limbs, kit, pose separation and packed-size readability. Frames 4–6 clearly separate halfway reach, contact and follow-through; frames 8–10 read as recovery, balanced stance and settled ready. The 448×288 atlas has eleven 112×96 cells, an empty 12th cell, a shared baseline y=89, and at least 7 px of alpha≥16 clearance on each frame. The transparent atlas was reviewed on light and dark backgrounds. No ball is present in athlete art.

Native Jam Stage review uses Briar explicitly at court y=75, at 100% and 120%, and both facings. All 22 frame/facing captures at each zoom select the corresponding production candidate frame. The review record reports the ball dead/unowned during this isolated empty-hand presentation; Briar does not own a ball track for `push`. In gameplay, an opponent's carried ball remains on that holder athlete's own carry track until the push contact resolves, when simulation may release it into separate loose-ball physics. No ball is baked into Briar's atlas.

## Rejected full-sheet attempts

- Attempt 1 is rejected because alpha reaches the raw canvas edges and red/orange fringe is prominent.
- Attempt 2 is rejected because alpha spills into cell edges, the contact/follow-through poses are too similar, and the contact hand is hard to read.
- Attempt 3 is rejected because the extended poses collide across cell gutters, frames 4–6 are too similar, frames 10–11 are near duplicates, and low-alpha residue reaches the otherwise empty 12th cell.
- Attempt 4 is an edit of attempt 3. It did not correct the cell spill or pose similarity and is rejected.

The rejected source sheets, exact prompts, generation IDs, hashes, light/dark previews and detailed review notes remain alongside the accepted single-pose source set under `tools/generate-art/`.
