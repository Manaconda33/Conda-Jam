# Independent atlas review — J.128 Krios `pickup` attempt01 cleanup01

## Verdict: accept for athlete-specific track calibration

This review supersedes the initial rejection note. The apparent white streak was a false positive caused by reading the light composite background as painted artwork. Pixel inspection confirms frame0's gap between the lowered arm/flank and the shorts is transparent negative space. It contains no white RGB pixels. The intended white socks and gold piping are separate: bright pixels are confined to the sock regions (packed frame0 around x30–40,y70–78 and x72–81,y73–79); the gold trim remains along the uniform edges.

I inspected the raw and cleanup01 light/dark composites, cleanup report, and lossless packed atlas at native 128×96 cell size and enlarged nearest-neighbor scale.

The five poses remain distinct and correctly ordered: spot/reach, deep lower, near-horizontal reach, ankle-height grab, then grounded recovery. Krios's red skin, curled horns, beard, Scoria uniform, boots, and heavy build remain recognizable. The separate ball is not baked in. The cleanup preserves RGB and removes only alpha below96; component inspection finds exactly five main silhouettes. Packed frame6 remains empty.

Packed alpha bounds and cell margins are:

| Frame | Alpha bounds inside 128×96 | Left / top / right / bottom margin |
|---|---|---|
| 0 | `(16, 9)–(112, 94)` | 16 / 9 / 16 / 2 px |
| 1 | `(9, 19)–(119, 94)` | 9 / 19 / 9 / 2 px |
| 2 | `(12, 25)–(116, 94)` | 12 / 25 / 12 / 2 px |
| 3 | `(21, 24)–(107, 94)` | 21 / 24 / 21 / 2 px |
| 4 | `(23, 4)–(104, 94)` | 23 / 4 / 24 / 2 px |

All figures are fully inside their cells; the reaching hand retains 9px side clearance, and the highest horn retains 4px top clearance. Feet share the packer's y=94 baseline, leaving its standard two-pixel lower inset. Light and dark cleanup previews show no detached specks or visible alpha halo. The smooth modeled shading reads clearly at native scale and falls within the look of Krios's existing shaded action art.

This accepts the packed candidate as suitable for continuing separate-ball track calibration. It does not approve a runtime track or gameplay integration. Keep the clip unregistered until the athlete-specific pickup ball track, grab timing, both facing directions, and actual gameplay views have their own review. The raw source, cleanup output, report, previews, and generation provenance remain intact.
