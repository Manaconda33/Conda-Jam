import { readFile } from 'node:fs/promises';
import { animationClips } from '../../../../../src/core/animation.js';
import { animationAssetManifest } from '../../../../../src/content/animation-assets.js';
const file=process.env.JAMVERSE_CANDIDATE_FILE;
if(!file)throw new Error('JAMVERSE_CANDIDATE_FILE required');
const candidate=JSON.parse(await readFile(file,'utf8'));
for(const [i,frame] of animationClips['dunk-double'].frames.entries()){
 frame.ballHeight=candidate.track.height[i];frame.ballForward=candidate.track.forward[i];
}
const character=animationAssetManifest.characters['piper-quickstep'];
character.mirrorSafe=true;character.mirrorReview={status:'reviewed',notes:'Process-local native calibration only.'};
character.directions.right['dunk-double']={src:'./tools/generate-art/previews/piper-quickstep-dunk-double/attempt1-atlas-candidate/candidate-atlas.webp',columns:4,rows:4,frames:candidate.layout?.frames??Array.from({length:15},(_,i)=>({x:(i%4)*128,y:Math.floor(i/4)*96,w:128,h:96})),reviewed:true};
