# Accu — push

## Exact accepted generation prompt

Transparent background image asset, real RGBA transparency. DO NOT draw or render any checkerboard pattern. No background pixels at all. Make a clean professional transparent pixel-art sprite sheet, 4 columns by 3 rows, eleven full-body right-facing frames of the same Accu basketball game character, final bottom-right cell empty. Match the attached image precisely: athletic young human woman, warm tan skin, green eyes, blunt black bangs, cropped sides, two long black ponytails secured with teal ties, fitted black basketball uniform with teal/violet piping and black knee-length leggings, teal violet sneakers, black arm sleeves. Keep human anatomy accurate: exactly two arms, two hands, two legs. Blank clothes without numbers or logos. PUSH body-check sequence, poses progress from guard stance, crouch, forceful step, leaning push, extended arm, peak contact tick 8, follow-through, recover, straighten, step back, return to guard. She is alone; hands empty; absolutely no basketball or other object, no person, no court, no floor, no shadows, no text. Strict aligned 4x3 grid, last cell empty, broad transparent gutters, consistent scale and baseline. Sharp outlined 1990s arcade pixel art. Return only the transparent PNG.

## Rejected generations

- `exec-607d2fe3-b18b-48c2-be42-f5ee9ab64d4b`: rejected because it painted a checkerboard, included basketballs, and omitted one frame.
- `exec-d3b72a62-a09a-4986-b2dc-b369cd1383f6`: rejected because it depicted Dorian rather than Accu and used an opaque background.

## Cleanup

The accepted sheet `exec-99bb69d7-9945-41ce-83ae-33c458eaeea5` had a painted checkerboard. `clean-accu-push-checker.py` removes only border-connected neutral background pixels; pose pixels are retained. Reviewed 11 complete Accu poses, empty hands, no ball, proper twin ponytails and kit.
