# Normal-loader capture attempt01: image readiness

The registered Kraken push manifest entry was loaded, but the capture harness checked the production image map before the asynchronous image decode completed. It raised `Registered Kraken push atlas is not loaded in normal loader` before any action captures. This is a harness readiness failure, not evidence about the runtime asset. Attempt02 waits for the loader-owned image to decode before the checks.
