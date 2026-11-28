# Exact Myth track policy proposal (review only)

This standalone review adds a read-only check for the pinned, independently reviewed asset draft #35 at `aecbbde2bed8d8a9679608044be7deb5ad8a0ddc`. It does not install an exception in the v6 gate, change required checks, build a Pages preview, or authorize merge. The existing v6 scope check is expected to reject this new proposal as not yet installed. Existing blockers on #35 are unchanged.

The check first authenticates the immutable candidate tree and exact 122 changed Git blobs (including 20 reviewed atlases) against accepted main `36ce9c7f`. Only then does it load runtime sources. It runs the original parity test unchanged against the original accepted tree and exact historical fixture. It compares all 3,045 runtime rows against that tree, requiring byte-equivalent canonical rows for the 3,030 outside scope, and exact independently reviewed before/after fingerprints for the 15 Myth rows. In those 15, it permits only changes to sources and height/forward samples, never release velocity, timing, cel durations, or anchors. Raw provenance and tracks outside Myth must remain exactly the same.

Negative tests reject a substituted/missing/extra/duplicate blob, non-Myth drift, a non-approved Myth clip, wrong timing/anchor/release velocity, unpinned samples, and incomplete or changed identities. Any rebased or revised asset tree requires a new evidence pin and review. The candidate does not supply the verifier or attest to its own audit.

Run from a clone containing both pinned commits:

    node --test tests/myth-track-policy-review.test.js
    node tools/captain-studio/myth-track-policy-review.mjs . aecbbde2bed8d8a9679608044be7deb5ad8a0ddc

Before activation: separately review and install an explicit versioned v6 successor, whose trusted-base check pins the whole reviewed asset diff, retains historical findings, verifies the exact 20 live audit removals, and requires both parity checks and the full existing gameplay/browser suite on the assembled revision. Do not mark the asset draft eligible until the policy review and post-policy preview are complete. No change to runtime, asset, policy installation, or deployment is in this draft.
