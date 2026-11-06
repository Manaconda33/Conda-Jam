# Kraken block candidate native Jam Stage review

Status: candidate source passes native static-render review; runtime registration and full simulation review are still pending.

The dedicated capture script selected `tools/generate-art/sources/kraken-block-candidate3-cleanup02-atlas.png` through a temporary in-page manifest entry. The 16 Chromium captures cover canonical frame starts at ticks 0, 2, 5 and 8, both facings, and 100%/120% camera zoom on the Vesper Harbor Undertow court (`courtY=90`). Every capture reports the requested source, frame index, production artwork path, and expected flip flag. There were zero uncaught browser errors.

Visual review of the native captures confirms four legible beats: defensive crouch, upward takeoff, apex block, and balanced landing recoil. Kraken retains the elf ears, cropped dark hair, natural skin, copper amulet and burgundy/black kit. All anatomy remains in frame, the apex hand clears the scoreboard, the grounded poses share their baseline, and both facings render consistently. The separate ball appears away from the athlete in the screenshots; the sprite artwork itself contains no ball.

The capture method stages individual frame starts and a representative separate ball. It does not exercise the block button, live jump progression, or defender/collision behavior. Keep the asset unregistered until a separate gameplay integration check and source/mirror approval are recorded.
