# Kraken dunk-double attempt02 — output unavailable

The exact prompt is preserved at `tools/generate-art/kraken-dunk-double-attempt02-imagegen-prompt.txt`. ImageGen returned a PNG data URL through a wrapper, but the calling code emitted only a truncated prefix and did not preserve the full PNG or exact generation ID. Several concurrent outputs existed in the shared generated-images directory; none can be tied to this call with confidence, so none is copied or reviewed as attempt02.

**Status:** invalid/incomplete provenance. No cleanup, independent art review, track trial, registration, or production use. The next attempt must be made as a serialized call that records the returned artifact ID and raw bytes directly.
