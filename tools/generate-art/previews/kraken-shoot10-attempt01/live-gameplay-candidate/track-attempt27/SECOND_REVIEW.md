# Kraken J.129 shoot attempt27 — independent camera-offset review

**Verdict: no tested direction-relative horizontal offset solves the left-facing 120% rim/HUD obstruction while preserving athlete framing. Candidate camera-only investigation.**

I inspected representative 120% shots at offsets `0`, `+6`, `+12`, `+18`, `+24`, and `+30`, including the left-facing tick23 flight view for every value and the right-facing `+24` view. I also checked the `+30` left-facing score-complete capture for athlete framing.

At offset0, the left-facing target rim is cut at the screen edge. Offsets +6 through +24 move it inward, but the left-facing rim remains crowded against and partly covered by the fixed top event banner/HUD boundary; the +24 view is the closest, but the banner still touches/occludes the leading rim edge. Offset+30 produces essentially the same composition as +24 and does not clear the banner. The right-facing +24 view has a readable rim, but that does not solve the mirrored left-facing case. No horizontal focus shift supplies vertical clearance from the fixed UI. At +30 the left-facing score-complete camera has shifted far enough that Kraken is partly clipped at the right edge, so that value also fails athlete framing.

The reports confirm successful scoring at every offset: right-facing runs finish at score `[3,0]`, left-facing runs at `[0,3]`, with the shot recorded as made and the celebration state reached. Each report records 72 captures, 72 unique verified screenshot paths, no uncaught browser errors, and no failed requests. Thus the camera trials preserve gameplay scoring but do not meet the rim composition requirement.

This is a camera-only candidate investigation: the atlas, shoot track, release setup and hoop remain fixed while the capture harness injects a direction-relative camera-focus offset. The result supports a vertical camera/viewport or UI-layout correction, not registration of any tested horizontal offset. No runtime or manifest files were changed.
