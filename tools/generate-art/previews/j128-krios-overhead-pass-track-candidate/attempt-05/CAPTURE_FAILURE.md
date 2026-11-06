# Attempt05 capture failure

Track values: height `[0.8,1.1,2.2,2.4,2.85,1.4]`, forward `[9,2,5,10,13,9]`.

The capture harness started Jam Stage but Chromium failed while decoding the source atlas during temporary in-page setup: `EncodingError: The source image cannot be decoded`. No screenshots were captured, no report was written, and no runtime files were changed. The same source decoded on the next attempt using the same dedicated port; attempt06 preserves the successful retry.
