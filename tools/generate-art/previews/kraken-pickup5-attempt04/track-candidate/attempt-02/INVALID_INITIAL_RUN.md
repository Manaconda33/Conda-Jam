# Attempt02 initial run — invalid track override

The initial invocation of `capture.py` wrote captures under `initial-invalid-reuse/`. The intended height vector was `[0.65,0.45,0.2,0.2,0.75]`, but a failed string replacement left the script's default at attempt01's `[0.65,0.45,0.2,0,0.75]`. The report and captures in this folder correctly record the vector that actually ran. They are preserved as an invalid duplicate-vector trial and must not be cited as attempt02 evidence.

The script default is corrected for the valid attempt02 rerun, whose report and captures will be written to `native/`.
