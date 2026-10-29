# J.108 — Leo receive source notes

The accepted four-pose sheet shows Leo’s poised turn, open-hand reach toward image-right, catch point, and chest gather. His pale skin, long wavy black hair, refined mustache, adult human anatomy, and controlled black/crimson uniform remain recognizable. The accepted art contains no ball; the external basketball reaches the hands on frame2/tick4.

## Generation history

- Accepted edit/re-generation: `exec-69fdeb9a-c4fe-4d0b-a424-412012469435`; accepted exact prompt: `tools/generate-art/j108-leo-receive4-prompt.md`.
- Rejected generation 1: `exec-26854928-a326-43e6-9ed8-2de1addf5229`; `tools/generate-art/sources/j108-leo-receive-rejected-01.png` painted a basketball into frame2. Prompt preserved at `tools/generate-art/j108-leo-receive-attempt1-rejected-prompt.md`.
- Rejected edit 2: `exec-ea6692b1-5dc8-4c34-903b-db3680786345`; `tools/generate-art/sources/j108-leo-receive-rejected-02.png` retained that ball. Edit prompt preserved at `tools/generate-art/j108-leo-receive-attempt2-rejected-prompt.md`.
- Accepted raw sheet: `tools/generate-art/sources/j108-leo-receive-generated-raw.png`; all source hashes are in `tools/generate-art/j108-leo-receive4-provenance.json`.
- Packed atlas: `public/assets/animation/leo-receive-right.webp`; layout: `tools/generate-art/leo-receive4-layouts.json`.
- Component-isolation packer: `tools/generate-art/package-leo-action4.py`.

## Separate ball track

Initial Leo-specific track: height `[1.15,1.35,1.5,1.45]`; forward `[8,13,16,11]`. The ball is separate runtime art and arrives at the open hands on frame2/tick4. Runtime hand-contact review and manifest registration await central integration.

## Ball-track calibration and independent review

- Attempt01 is preserved in `tools/generate-art/previews/leo-receive-track-candidate/attempt-01/native/` with 24 captures and report. It used H `[1.15,1.35,1.5,1.45]`, F `[8,13,16,11]`; review rejected it because the catch/recovery ball overshot the hands.
- Attempt02 is preserved in `tools/generate-art/previews/leo-receive-track-candidate/attempt-02/native/` with 24 captures and report. Accepted track H `[1.15,2.0,1.9,1.45]`, F `[8,13,8,3]` brings the ball to the open hands on tick4 and keeps it gathered through recovery in both facing directions at 100%/120% zoom.
- The independent read-only review found the source poses clean and distinct and specifically rejected attempt01 before accepting the corrected attempt02 alignment. `tests/leo-receive.test.js` separately exercises the real simulation: possession changes at tick4, once, and carries through recovery in both facings.
- The native capture harness manually sets pose/ball state to inspect placement, so the simulation test is the evidence for catch ownership/timing. The preview report records 24 generated-roster Jam Stage renders and zero browser errors.
- Light/dark atlas previews: `tools/generate-art/previews/leo-receive-atlas-light.png` and `tools/generate-art/previews/leo-receive-atlas-dark.png`.
