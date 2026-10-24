# J.105 — Keeg scythe dunk — retry 05

## Verbatim generation prompt

```text
EDIT the attached Keeg dunk sprite sheet for production. Keep the same 15 unique Keeg full-body poses and order, but redraw/recompose each entire pose smaller, well centered and safely separated inside its own 5-column by 3-row cell on a transparent RGBA canvas. 1536x1024; cells about 307x341. Each complete silhouette (including full hat, ornaments, hands and shoes) must have at least 50 transparent pixels on all four sides inside its cell. Target silhouette height 235 pixels maximum. Never let any figure part touch or cross a cell boundary or enter the gutters. Preserve true empty alpha around and between all figures; remove all haze or painted backdrop. Keep the body complete, not cropped.

CRITICAL: Remove the visible orange basketball from poses 1 and 2 and any other pose. No ball, sphere, circle, prop or object anywhere. The basketball is separate runtime art. Gather hands may mime an invisible ball; release hands are open and empty.

Preserve Keeg as the same athletic adult human man, black hair, neat black beard, expressive face, full tall ornate purple witch hat with silver trim and mushroom ornaments, layered purple/lavender/silver Moonmorel Hex kit, matching belt and shoes. Preserve natural anatomy, two arms, two hands and two legs. Do not alter his identity or outfit.

Preserve the scythe dunk sequence: 0 image-right approach; 1 waist gather; 2 plant; 3 takeoff with hand behind hip; 4 low rear sweep; 5 deepest low sweep; 6 reverse rising diagonal across body; 7 hand beside head but clearly forward/right of hat; 8 ascent; 9 high cocked hand forward/right of hat; 10 only release with extended open palm; 11 empty follow-through; 12 descent; 13 flexed two-foot landing; 14 balanced recovery. One low-to-high scythe motion only, no windmill/reverse/tomahawk/360. Poses 0-9 carry invisible ball; 10 releases at tick21; 11-14 are empty-handed.

Use crisp arcade sprite edges and consistent scale. No background, checkerboard, gradient, shadow, glow, halo, haze, border, panel, text, numbers, hoop, court, floor, teammates, opponents, weapons or extra props.
```

Generation `exec-062ce935-4ecd-4670-82bd-d0bf771cf16d`; source `sources/j105-keeg-dunk-scythe-attempt-05-review.png`; SHA-256 `a50088ae6d1a1b905131ae0560c4599ac01c37850d5bdd1438bb1b03fbfccf60`. This is **rejected**. Alpha is transparent at all four outer corners and no nontransparent outer-edge pixels were found. Measured alpha-thresholded silhouette margins miss the 50-pixel requirement in every row; several figures touch a cell edge (including poses 5, 6, 11, and 12). Orange basketballs remain visible in gather poses 1 and 2. No cleanup or packing is allowed.
