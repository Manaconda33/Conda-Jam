# Kraken celebration identity audit

**Verdict: the registered `kraken-celebrate-right.png` art depicts Kraken, not Krios. The user-provided gameplay screenshot depicts Krios on court while Kraken is credited with the score.**

The authoritative roster/spec separates these identities clearly: Krios is a huge red-skinned, heavily muscled male with large black ram horns, a dark beard, and ember-red/charcoal kit; Kraken is a natural-skinned elf-like adult man with short hair, pointed ears, a copper amulet, and burgundy/copper kit. The registered Kraken idle sheet has the latter's natural skin, short auburn hair, copper pendant, and burgundy outfit. The celebration atlas keeps those same visual features and kit. Its human silhouette and natural skin are not Krios's red giant body, horns, beard, or charcoal/ember costume. The dedicated Krios idle and celebration atlases visibly contain the red skin, massive build, ram horns, and dark kit seen in the user's screenshot.

The normal-loader report confirms the tested current branch selected the registered Kraken celebration atlas on a production `commitScore` transition with no Krios fallback. Thus the user screenshot is strong evidence of the earlier/missing-clip runtime state or another stale preview, rather than evidence that the newly registered celebration atlas is Krios. Its screenshot alone cannot establish which build produced it. Recheck the exact scoring transition in the current standalone/hosted build before treating the runtime issue as closed; the prior normal-loader test demonstrates the local current path, not that the shown screenshot came from that build.

This is an identity-only review. No asset, runtime, manifest, or registration was changed.
