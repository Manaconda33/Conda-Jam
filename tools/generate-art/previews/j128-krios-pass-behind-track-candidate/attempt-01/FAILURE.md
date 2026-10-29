# J128 Krios `pass-behind` track attempt01 — capture rejected

The first actual gameplay capture attempt used the initial candidate vectors in `tools/capture-j128-krios-pass-behind-track.py`, but attempted to capture step14 after the 13-tick action had completed. The production selector correctly fell back to `idle`, so the script rejected the batch. Partial screenshots are retained as failed capture output; none is production evidence. Attempt02 excludes post-clip idle frames and will be reviewed separately.
