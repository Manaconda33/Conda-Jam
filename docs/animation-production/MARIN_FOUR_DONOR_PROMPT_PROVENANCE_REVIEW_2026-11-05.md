# Four original donor prompt records: source identity verified, original transcript unavailable

**2026-11-05 (America/Chicago). REVIEW ONLY.** This is a preservation and root-cause finding, not a source-art replacement, a provenance waiver, or merge approval.

## Boundaries and original sources

This review concerns exactly **four accepted original-source clips** responsible for the full 40-entry `prompt-not-verbatim` audit classification in the PR #6 + PR #7 combined candidate:

- Reed Ashcroft `layup` and `fall`
- Juniper Vale `layup` and `fall`

The source authority is the immutable original PR #6 commit `55a2ab104d6b108cc08132fddc01b32afb958e75`. The companion archives `tools/generate-art/j38-layup-prompts.md` and `tools/generate-art/j43-fall-prompts.md` explicitly say the exact accepted generation prompts were **not retained in the checkpoint**. The associated `*-provenance.json` and `*-layouts.json` files mark `promptVerbatim: false`, `sourcePromptStatus: "reconstructed"` and accepted **art** review. Those descriptions do **not** assert exact prompt provenance.

GitHub code searches for all four full `exec-...` generation identifiers found their original J.38/J.43 archive, accepted provenance/layout records and, for fall clips, the existing sprite test; no separately archived verbatim prompt for the accepted source was found in the inspected repository files. This is not a claim that no transcript could ever exist in another system.

## Binary source and production atlas integrity, independently executed

The new [read-only fixed-source workflow](https://github.com/Manaconda33/Conda-Jam/blob/maintenance/pr6-pr7-reconciliation-probe/.github/workflows/marin-four-source-provenance-integrity.yml) checked out only the **actual four original PNG source files**, four accepted production WebP atlases, original generation/provenance records, two checkpoint archives and the production manifest from **pinned PR #6**. It verified each original PNG's full SHA-256 against its individual accepted provenance record, each accepted WebP's full SHA-256 against the production manifest, the generation execution ID and SHA against the relevant J.38 or J.43 archive, `reviewed: true` in the production manifest, and the retained `promptVerbatim: false` disclosure on both provenance and production clips.

[**GitHub Actions run 42140674600: SUCCESS**](https://github.com/Manaconda33/Conda-Jam/actions/runs/42140674600), 4/4 accepted original PNGs verified and 4/4 production atlas WebPs verified, zero integrity mismatches. [Verification manifest artifact 13467572677](https://github.com/Manaconda33/Conda-Jam/actions/runs/42140674600/artifacts/13467572677) (retention limited).

| Original accepted clip | Generation execution ID | Source PNG SHA-256 | Production WebP SHA-256 | Exact prompt |
| --- | --- | --- | --- | --- |
| Reed `layup` | `exec-6209cbd2-2268-4528-95de-c979eb4087d5` | `38a9bf398e438392d041fb404124454e85ca712b397d646feb11d9860add733e` | `9624ba5e1ee8620281ef3d86194102c61fe705ad7e97ffc5c4e90f3f97cef0fc` | Not retained |
| Reed `fall` | `exec-c3fd5206-c958-4ecc-b96f-41aa4f26483d` | `7a991d566a46210402fb457187c8a693757e2751394c6fd21ed9910cb37a332c` | `101b5868486aece37cbc1419c88eba052cef7355869edd372c33459622512c69` | Not retained |
| Juniper `layup` | `exec-638c54c1-9dac-4b5b-96fb-a3484a58dc99` | `3774ed5ada2b3cc0e480ab3804086fcfae63c271bc9c68b32102edbcc8498cbb` | `a0e19e36d7ea5517575cf6bd6491e46109b8332d2fc627302e8f283ca9b8e2e2` | Not retained |
| Juniper `fall` | `exec-5510f7ae-4594-4f3d-bec4-cc2b2477270e` | `e38fad03165e8e0b4598b1f85e58c4d5dc7fc4e0f6272b941e69c94cd05a9fe7` | `dde0a395934a5666786a9efc694424dd0f7442ed7cf705c26719ef7e09778939` | Not retained |

This verifies **image integrity and accepted-clip identity**, not prompt wording, anatomical quality or independent visual contact. It does not establish that the original source prompt text equals the documented reconstructed text.

## Source-specific provenance distinctions

### Reed Ashcroft layup

- Accepted `reed-ashcroft-layup8-candidate1.png` was generated at `2026-10-23T03:44:56.817237636Z`, with generation ID and C2PA/XMP identifiers retained. Its actual original prompt transcript was **not retained** in J.38.
- `reed-ashcroft-layup8-rejected-provenance.json` contains some **verbatim prompt text**, but this belongs to *later rejected background attempts* (`exec-8e53f...`, `exec-5ee7e...`, `exec-719fb...`) with **different source image hashes**. Those records must **not** be relabeled as the prompt for accepted candidate1.
- Accepted source and production atlas both hash-verified; reconstructed accepted prompt and `promptVerbatim: false` preserved.

### Juniper Vale layup

- The accepted `juniper-vale-layup8-attempt4-rejected-background.png` was initially unacceptable as a **transparent raw sheet**, but its eight separate original figure components were extracted and packed into an accepted clean atlas after light/dark art review. Its accepted source identity is `exec-638c54c1-9dac-4b5b-96fb-a3484a58dc99`.
- The J.38 checkpoint explicitly says the original prompt was not retained. `juniper-vale-layup8-rejected-provenance.json` documents multiple rejected source/edit attempts and records `sourcePromptStatus: "not-preserved-in-checkpoint"`; it does not supply an authenticated exact prompt for this accepted source.
- Source PNG and accepted WebP atlas both hash-verified. Keep the important distinction between **raw sheet background rejection** and **accepted component-isolated source artwork**.

### Reed and Juniper fall

- Both accepted ten-pose `fall` sheets were generated 2026-10-23, with generation execution IDs, source hashes, and accepted art reviews retained.
- The J.43 archive says the image generation tool returned IDs and saved files, but no prompt transcript was retained in the workspace. Its two displayed prompts are **reconstructions of the submitted briefs**. Each accepted fall provenance record accurately marks that limitation.
- Original source PNGs and production WebP atlases hash-verified; no C2PA claim value is stored for these two records.

## Precise audit interpretation and safe disposition

From the independently audited original branches in [`MARIN_PR6_PR7_AUDIT_FINDING_ATTRIBUTION_2026-11-05.md`](./MARIN_PR6_PR7_AUDIT_FINDING_ATTRIBUTION_2026-11-05.md):

- **Four original** `prompt-not-verbatim` entries are inherited from pinned main and original PR #6, one for each of the above source clips.
- Shared/palette derivation in PR #7 transparently carries those four source prompt flags to **18 recipient athletes × 2 flagged clips = 36 derived-warning entries**. Total strict audit **40** remains intentionally **unwaived**.
- Marin Dusk is a Juniper-derived recipient, and its two warning entries are for `layup` and `fall`, **not** `dribble-run`. Both Marin and Juniper have **zero missing clips**. The original 9/8/9 Marin calibration remains separate.
- The **706 missing-clip** audit entries, inherited captain art backlog, remain outstanding and were not altered by this source-integrity check.

### What genuinely advances the issue

**Completed:** Exact accepted source PNG and production atlas byte integrity is independently verified. Four generation executions are traceable and matched to their archived source provenance. The apparent 40 prompt warnings are attributed to four original source records, with no detected PNG/WebP mismatch. This rules out missing or changed image bytes as the explanation for these four prompt warnings.

**Not completed:** Recovering any of the four *verbatim original prompt transcripts*. The original archives explicitly state they were not kept, so `promptVerbatim` must remain **false**. Legitimate further inquiry would have to obtain an original generation-call transcript independently tied to the matching `exec-...` ID and accepted source hash, then submit it for independent provenance review. Rejected-attempt prompts and reconstructed briefs are not substitutes.

**Not authorized:** Editing accepted source prompts or provenance fields to manufacture an audit pass, regenerating accepted art, rewriting old history, suppressing the 36 derived warnings, merging PR #6/#7/#13/#16 or deploying.

## Remaining hold

The scoped **587/587 `npm test`** suite remains green in [run 42131202002](https://github.com/Manaconda33/Conda-Jam/actions/runs/42131202002). Separate acceptance gates remain: true non-sparse historical Git-object materialization; strict 706-clip backlog and 40 prompt warnings (or a separately authorized and documented policy decision); independent rendered pixel-contact art review; combined integration signoff and explicit owner merge authorization.

**Outcome of this bounded pass:** Verified intact source imagery with accurate non-verbatim disclosures, recorded exact accepted-generation identities and distinguished rejected prompts; no risky art or provenance edits.
