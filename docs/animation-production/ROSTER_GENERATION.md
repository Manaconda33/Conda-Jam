# Captain roster animation generation

The shared production recipe is `tools/generate-art/pose-catalog.json`. It contains **29 clips, 293 independently described target frames per athlete**, with the current durations, loop sequence and zero-based event anchors copied from `src/core/animation.js`. One source sheet per captain frame yields 293 sheets containing 10,255 authored captain poses; 11 completed run sheets would leave 282 frame-sheets to generate. A recipe or generated staging file does not establish reviewed production completion.

The catalog includes all35 canonical descriptions from the supplied master document and their exact roster indices. Eight named dunk variants and two alley-oop variants have individually written arm paths over15 frames each. They share gameplay anchor timing but differ in gathering, swing direction, torso orientation, pump, release and recovery. Ordinary dunk grab5 secures an already-carried ball; alley-oop grab5 catches the incoming ball. Shoot release5, pass release3, receive grab2, pickup grab3, steal grab3, rebound grab3, push contact5, jump and landing anchors remain fixed. Newly present dribble bounce5 metadata is also copied.

## Sheet construction

Use a fixed camera, target toward screen RIGHT, and exact7columns×5rows with roster row order from the catalog. Refer to the original captain art for individual identity, costume and shading. Canonical corrections override errors in that source. Attach the canonical source plus a previously reviewed frame of the same clip when useful for scale and action continuity.

For each job, build the prompt from: grid/identity rules; current clip frame description; frame event anchors; relevant species adaptations; compact canonical correction reminders; original source reference. Name all35 roster cells in row-major order. Draw full bodies and substantial transparent margins in every cell. Do not draw ball, rim, floor, cell borders, labels or shadows. The independent game simulation draws ball and elevation. Preserve body proportions, source scale and cell baseline; do not move/scale a copied drawing to fabricate animation.

The 360 dunk explicitly changes facing during its rotation, and reverse finishes rotate torso relative to the right-side target. Other frames use right-facing three-quarter view. Paprika keeps four-footed fox anatomy; Dragon Queen remains a whole nonhumanoid dragon; Suga uses coils/tail instead of invented human limbs. Quirky retains extremely long animal arms. No action may silently turn these into ordinary human athletes.

## Canonical gaps in the reference

- Keeg requires a short trimmed BLACK beard and extremely tall ornate PURPLE witch hat with SILVER trim, rather than the reference's white beard/red mushroom cap.
- Manaconda's two temple driftwood crests sweep compactly backward along the skull, rather than forming upright crown/antlers.
- Lavi has SHORT ginger curls. Alexithymia has an ABSOLUTELY BLANK BLACK screen without eyes, mouth or glowing marks.
- Avek's mask/visor obscures unspecified natural colors; his guitar remains safely slung on court and prominently shown in celebration. Steeb's lantern is attached safely on court and presented during celebration.
- Preserve all remaining detailed anatomy, glasses, hair, horns, wings, tails, heart/orbit, flag and botanical identifiers in the catalog. Current source errors are not permission to change species or invent permanent traits.

## Job and review records

`tools/generate-art/roster-jobs.json` remains owned by the main production orchestrator. `tools/generate-art/captain-jobs.json` records this task's actual calls separately. Both use group/clip/frame/path/prompt/generatedAt fields; this task adds review evidence and `eligibleForPacking`. **Filter out rejected or ineligible jobs before sending records to the packer.** A completed imagegen call is not an approval.

Inspect every source visually and numerically. Confirm actual35 characters, correct identities/order, no cell crossing, transparent alpha, and requested new action pose. A valid hash proves distinct pixels but does not prove different articulation or canonical correctness. Compare every frame with adjacent frames and inspect anchor poses deliberately. Exact-grid packers cannot fix a figure crossing its cell boundary.

After a complete clip is genuinely authored, the root-owned packer can crop, uniformly downsample and encode gameplay64×96 cells. It must inspect actual encoded crops for nonblank and distinct frame hashes. Keep original generated PNGs and exact source rectangles/provenance. Register generated clips as review pending until visual and gameplay review succeeds. Do not fill gaps with duplicates or copies transformed into artificial frames.

## Representative idle frame 0

Actual imagegen source: `/workspace/generated_images/exec-53131c58-75ab-4b4e-ba69-93799a7fcde4.png`.

**Rejected staging; not eligible for packing or production registration.** The image is RGBA1484×1060 with genuine alpha range0–255 and450,174 fully transparent pixels of1,573,040. All35 nominal212×212 cells are nonblank, but every cell has alpha border contact including strong-alpha pixels. Visual inspection shows the source's crouching action largely copied rather than the requested new alert idle. Keeg's beard became black, while Alexithymia acquired green face marks, Manaconda retained an upright crest, and Lavi retained long curls. The request for all35 identities plus geometry plus action plus multiple canonical corrections exceeded this call's reliable result.

This is evidence that the35-captain format needs further refinement before the full remaining batch. Options include correcting canonical identity masters in smaller batches first, generating fewer characters per source sheet, or using reviewed per-character pose strips. Those choices trade generation-call count for reliable cell isolation and identity control. The main orchestrator decides the next production step after reading the catalog and this evidence.

The full prompt used for this probe follows:

> Production pixel-art basketball sprite roster sheet, exact SEVEN columns by FIVE rows =35 full-body figures, exactly one character centered per equal cell, same row-major character identity/order as attached original roster. This is ONE NEW idle-breathing animation frame0 for every character, not a collage of old source crops. Fullbody balanced alert idle stance, relaxed down arms or natural quadruped forepaws, feet/paws/coils planted on common within-cell baseline. All look toward screen RIGHT in three-quarter view. Preserve original jersey palettes, face/species identity and proportions. Crisp authentic 1990s game pixel illustration, no photorealism. Canvas grid must remain exact7x5 with wide transparent padding and no crossing silhouettes. TRUE transparent RGBA background, no gradients, ground shadows, labels, numbering, captions, grid, basketballs or backdrop. No duplicated character or omitted cell. Canonical correction overrides mistakes in original reference: Manaconda driftwood branches grow from BOTH TEMPLES and sweep compactly BACKWARD hugging skull, never upright crown/antlers, retains gray streak beard and blue rectangular glasses. Paprika is tiny true FOUR-LEGGED kitfox, never humanoid. Keeg is male witch with BLACK HAIR and SHORT TRIMMED BLACK BEARD (not old white beard) and extremely tall ornate PURPLE witchhat with SILVER trim and mushroom details (not red toadstool cap). Lavi has SHORT ginger curls, silver glasses, freckles. Kraken natural-skinned short-haired male elf, no tentacles. Alexithymia face is ABSOLUTELY BLANK BLACK screen, no eyes, mouth, light dots or features, noirfedora andcoat. Avek mask/visor fully obscures unspecified skin/hair/eyes, guitar safely slung acrossback with neck visible. Steeb is small stocky wombat with amber lantern secured to belt, nohumanbody. Dragon Queen is a whole FOUR-LIMBED dragon with wings and longtail, nohumanform. Suga is a COBRA with hood and coils, NO HUMAN ARMS/LEGS. Quirky has true orangutan-zebra animal body and very longarms. 6foot10 greenorc NO TUSKS. Jragena darkpurple skin copperhair horns wings glasses. E.Indigo blue skin smallantlers tiltedblackfacialorbit and goldenheart remain. Roster order exact rows: ROW1 Manaconda,Paprika,Keeg,Accu,Leo,Krios,Kraken. ROW2 Lavi,Ria,Gummiefish,Colossus,McFleurdel,Toph,Heph. ROW3 Liv,E.Indigo,Myth,Wicked,Anna,Alexithymia,Alex. ROW4 Avek,Cilia,Steeb,Jennifer,EOW,DragonQueen,Suga. ROW5 6foot10,GBDesign,Jragena,Dea,PackMama,Quirky,Lula. Keep all35 identities, complete bodies, anchored idle stance and correct species.

## Validation performed

Catalog construction checked all29 keys, every exact target frame count, every duration and event anchor against live animation metadata, and distinct description text within each clip. It checked35 canonical master sections and roster-order IDs. Source inspection decoded RGBA and checked all35 exact source cells plus their borders. No full captain batch was launched by this task.

