# Echo Catwalk — `pass-overhead`

## Exact generation prompt

```text
Use the referenced Echo Catwalk sprite sheet only to preserve Echo's exact identity, body, face, colors, hair, beard and scale. Do not copy its poses. Create six NEW full-body overhead-pass poses for JAMVERSE '96, on a 1536×1024 transparent RGBA pixel-art sheet, strict three columns by two rows in reading order. Keep each entire body inside its own cell with broad transparent gutters. No backgrounds, scenery, panels, gridlines, court, floor, shadows, text, objects, hoop, ball or basketball.

The reference is ECHO CATWALK. Preserve this exact compact athletic ADULT HUMAN MAN from the reference: medium-brown skin, short spiky dark-teal hair, teal headband, close dark-teal beard, teal sleeveless jersey, black/deep-purple side panels, teal shorts, black knee pads, teal-black shoes and wristbands. Keep his male face, beard, hair silhouette and uniform unchanged. Absolutely no woman, girl, lavender hair, ponytail, bow, headband in any other color, altered body or extra accessories. Exactly two arms, two hands, two legs and two shoes in every drawing.

Right-facing, body moving toward image-right. Both natural hands stay empty because game code renders the basketball separately; do not draw any ball or prop. Pose sequence:
0 balanced stance, empty hands at chest;
1 gather at chest and bend knees;
2 raise both hands above forehead, tracking invisible ball;
3 single RELEASE at simulation tick5: arms extend upward and slightly right, wrists snap, fingers open and empty;
4 full overhead follow-through, torso leans toward target;
5 balanced recovery with arms lowering naturally.

All six poses must be connected, unique, complete full-body drawings, consistent in scale and anatomy. True transparent alpha-zero background and gutters, no haze, matte or checkerboard. Crisp 1990s arcade pixel clusters. Return only the sheet.
```

## Generation history

- Rejected generation `exec-5c67223e-5072-4d01-960c-567968357ef1`, SHA-256 `ff554523855fd5abeee6c165ccafd94426d07461b2c10edaa56f51bc3758db92`: model substituted Juniper Vale (feminine face, long lavender ponytail) despite Echo-specific prompt. Rejected for wrong athlete identity; not used in production.
