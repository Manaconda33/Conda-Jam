import { readFile } from 'node:fs/promises';
import { animationClips } from '../../../../../src/core/animation.js';
import { animationAssetManifest } from '../../../../../src/content/animation-assets.js';

const candidatePath = process.env.JAMVERSE_CANDIDATE_FILE;
if (!candidatePath) throw new Error('JAMVERSE_CANDIDATE_FILE is required');
const candidate = JSON.parse(await readFile(candidatePath, 'utf8'));
const clip = animationClips['dunk-reverse'];
for (const [i, frame] of clip.frames.entries()) {
  frame.ballHeight = candidate.track.height[i];
  frame.ballForward = candidate.track.forward[i];
}
const character = animationAssetManifest.characters['piper-quickstep'];
character.mirrorSafe = true;
character.mirrorReview ??= { status: 'reviewed', notes: 'Process-local calibration only.' };
character.mirrorReview.status = 'reviewed';
character.directions.right['dunk-reverse'] = {
  src: './tools/generate-art/previews/piper-quickstep-dunk-reverse/attempt4-atlas-candidate/candidate-atlas.webp',
  columns: 4,
  rows: 4,
  frames: Array.from({ length: 15 }, (_, frame) => ({
    x: (frame % 4) * 128,
    y: Math.floor(frame / 4) * 96,
    w: 128,
    h: 96,
  })),
  reviewed: true,
};
