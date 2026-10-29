# Krios J.128 fall attempt01 — registered normal-loader runtime review

**Verdict: PASS for registered-runtime gameplay validation; independent production acceptance of the candidate remains with the parent pipeline.** The clip is currently a newly packed captain atlas. It is not a shared or reused asset.

I reviewed the 40 normal-loader Jam Stage captures: ten frames at ticks `[1,3,5,8,11,14,18,23,29,35]`, both facings and 100%/120% zoom. The report confirms `runtimeIntegration=true`, `candidateAtlasInjected=false`, and the selected source is `./public/assets/animation/krios-fall-right.webp` with SHA-256 `b0409782269249d871b46e5336cd8fce2278a0c28a7ff5c2ab1b6607e985de81`. Each run starts with the real tick8 event “Leo knocks Krios down!”; every capture selects its expected frame, right-facing uses no flip and left-facing uses the mirror flip. All reported ball states are dead and ownerless. There are no uncaught browser errors.

The runtime framing preserves the successful live shove/fall event, then removes Leo from the visual roster after contact so he cannot cover Krios during the ground poses. The low poses are fully visible; the sequence remains readable and Krios’s full anatomy and identity are clear at both zoom levels. I found no clipping, fallback, HUD overlap, or visible despill defect.

The normal loader required the candidate review gate to be set temporarily for capture; this is a verification setup detail and is not evidence that production approval preceded the review. Keep the final manifest review/mirror metadata aligned with the completed independent acceptance decision.
