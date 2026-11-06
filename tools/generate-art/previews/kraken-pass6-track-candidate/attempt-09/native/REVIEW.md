# Kraken pass normal-loader attempt09 — rejected mirror metadata shape

**Disposition:** reject the capture as invalid integration evidence; source art and candidate ball tracks are not rejected by this run.

The no-injection capture correctly loaded the registered atlas and track on right-facing runs, but left-facing selection returned null because this attempt incorrectly copied the whole nested Kraken mirror-policy object into the manifest's flat `mirrorReview` field. That made `mirrorReview.status` unavailable to the runtime selector. The production mirror policy itself remains reviewed and allows safe horizontal mirroring.

All capture PNGs remain preserved. The manifest's mirror-review object is now restored to the expected flat shape, and a direct selector check returns `flip:false` facing right and `flip:true` facing left. Repeat both facings and zooms in attempt10.
