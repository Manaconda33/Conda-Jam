import { readFile } from 'node:fs/promises';
import { animationClips } from '../../../../../src/core/animation.js';
import { animationAssetManifest } from '../../../../../src/content/animation-assets.js';
const file=process.env.JAMVERSE_CANDIDATE_FILE;
if(!file)throw new Error('JAMVERSE_CANDIDATE_FILE required');
const candidate=JSON.parse(await readFile(file,'utf8'));
const track=candidate.track;
for(const [i,frame] of animationClips['dunk-tomahawk'].frames.entries()){
 frame.ballHeight=track.height[i];frame.ballForward=track.forward[i];
}
const character=animationAssetManifest.characters['piper-quickstep'];
character.mirrorSafe=true;character.mirrorReview={status:'reviewed',notes:'Process-local native candidate review only.'};
character.directions.right['dunk-tomahawk']={src:'./tools/generate-art/previews/piper-quickstep-dunk-tomahawk/attempt2-atlas-candidate/candidate-atlas.webp',columns:4,rows:4,frames:candidate.layout.frames,reviewed:true};
