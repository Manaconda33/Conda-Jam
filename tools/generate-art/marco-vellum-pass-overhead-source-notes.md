# Marco Vellum — `pass-overhead` source review

- Six complete right-facing poses, 3×2 row-major; ready stance, chest gather, lift, high two-hand release, follow-through.
- Identity matches portrait/gameplay reference: adult human man, medium-light olive skin, clean-shaven angular face, short waved black hair, black/crimson/white kit, black wristbands and high-top shoes.
- No ball, text, floor, court, hoop, or other character is present. The gameplay ball remains separately tracked by Marco's own runtime path.
- Initial raw source is retained. Cleanup script isolates the largest alpha≥32 component in each cell and retains a 2-pixel antialias fringe. No rejected generations were present in the handoff; none were invented or removed.
- Atlas cell size: 96×96, three columns by two rows. Source and atlas are reviewed on light and dark backgrounds in `sources/marco-vellum-pass-overhead-review.png`.
- Generation ID was not embedded in the supplied PNG. Exact prompt and SHA-256 hashes are retained in `marco-vellum-pass-overhead6-provenance.json`.
