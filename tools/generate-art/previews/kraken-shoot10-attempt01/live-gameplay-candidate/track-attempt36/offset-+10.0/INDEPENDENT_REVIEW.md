# Kraken `shoot` registered normal-loader review — attempt36

**Reviewer:** `kraken_shoot_review`  
**Disposition:** PASS

This review checked the production manifest and ball track without atlas or track injection. The capture harness uses `NORMAL_LOADER=1`; `report.json` records `assetMode: "registered-normal-loader"` and `candidateAtlasInjected: false`.

- All four runs load `./public/assets/animation/kraken-shoot-right.webp` from the normal manifest. Right-facing uses `flip:false`; left-facing uses `flip:true`.
- The recorded track matches Kraken's registered `shoot` ball track: height `[1.1,0.95,1.25,1.6,2,2.25,2.15,1.9,1.15,1.05]`, forward `[4,5,4,3,1,4,5.5,4.5,5,5]`, `releaseVz:0.46`.
- Release occurs at tick13/frame5. In both 120% facings, tick23/frame9 keeps the ball traveling toward the corresponding hoop; hoop, player, feet and shadows remain in-frame. The HUD and rim do not cover the ball.
- All four score states are correct: right-facing `[3,0]` and left-facing `[0,3]` at both zooms. The ball is made and Kraken remains the last touch.
- 72/72 capture paths are unique and hashes match. No browser errors or failed requests occurred.
- The score-complete capture shows the celebration frame after scoring, which is expected; the shooter remains visible.

Evidence is in this directory: `report.json`, release and late-flight screenshots at 100% and 120%, and score-complete captures. All reviewed art remains separate from the basketball simulation sprite.
