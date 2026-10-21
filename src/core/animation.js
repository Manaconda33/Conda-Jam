// Durations use simulation ticks (60 Hz); anchors name the first tick of a frame.
const clip = (count, duration, loop = false, anchors = {}, sequence) => ({ frames: Array.from({length:count},(_,i)=>({duration:Array.isArray(duration)?duration[i]:duration})), loop, anchors, ...(sequence?{sequence}:{}) });
export const dunkVariants = ['power','windmill','reverse','360','tomahawk','double','clutch','scythe'];
export const animationClips = {
  idle:clip(6,8,true,{},[0,1,2,3,4,5,4,3,2,1]),
  'idle-ball':clip(4,8,true), dribble:clip(10,3,true), run:clip(11,2,true), 'dribble-run':clip(11,2,true),
  shoot:clip(10,[3,3,2,2,3,1,2,3,4,4],false,{takeoff:2,release:5,peak:5,finish:9}),
  pass:clip(6,[2,2,1,1,2,3],false,{release:3}), 'pass-overhead':clip(6,[2,3,2,1,2,3],false,{release:3}), 'pass-behind':clip(6,[2,2,3,1,2,3],false,{release:3}),
  receive:clip(4,[2,2,1,3],false,{grab:2}), pickup:clip(5,[2,3,2,1,4],false,{grab:3}),
  layup:clip(8,[2,3,3,2,1,3,4,4],false,{takeoff:1,release:4,peak:4,finish:7}), 'layup-reverse':clip(8,[2,3,2,3,2,1,4,4],false,{takeoff:1,release:5,peak:4,finish:7}),
  block:clip(4,[2,3,3,4],false,{takeoff:1,apex:2,finish:3}), steal:clip(8,[2,2,1,1,2,2,3,3],false,{grab:3}), push:clip(11,[2,2,2,1,1,2,2,3,3,3,3],false,{contact:5}), rebound:clip(5,[2,2,1,2,4],false,{grab:3}), fall:clip(10,[2,2,2,3,3,4,5,6,6,7],false,{finish:9}), celebrate:clip(10,[5,5,6,8,10,10,8,7,6,5],false,{finish:9}),
  ...Object.fromEntries([...dunkVariants.map(v=>`dunk-${v}`),'alley-oop-power','alley-oop-reverse'].map(key=>[key,clip(15,[2,2,3,2,1,2,2,3,2,2,2,3,2,2,3],false,{takeoff:2,grab:5,peak:7,release:10,finish:11,land:14})]))
};
// Heights are hand offsets above the player, in simulation elevation units.
// The bounce anchor identifies the low hand frame where the ball touches court.
for(const [key,heights] of Object.entries({
  'idle-ball':[1.1,1.1,1.1,1.1],
  dribble:[1.2,1.05,.8,.5,.2,0,.25,.6,.95,1.2],
  'dribble-run':[1.2,1.1,.85,.55,.25,0,.25,.55,.85,1.1,1.2]
})){
  animationClips[key].frames.forEach((frame,index)=>{frame.ballHeight=heights[index];});
  if(key!=='idle-ball')animationClips[key].anchors.bounce=5;
}
for(const [key,releaseHeight] of Object.entries({shoot:3,layup:3,'layup-reverse':3,pass:1.6,'pass-overhead':1.6,'pass-behind':1.6})){
  const c=animationClips[key],release=anchorTick(key,'release');let tick=0;
  for(const frame of c.frames){frame.ballHeight=1.1+(releaseHeight-1.1)*Math.min(1,tick/release);tick+=frame.duration;}
}
// Dunk gathers start at the waist and reach overhead by the flight peak.
for(const [key,c] of Object.entries(animationClips)){
  if(!key.startsWith('dunk-')&&!key.startsWith('alley-oop-'))continue;
  const peak=anchorTick(key,'peak');let tick=0;
  for(const frame of c.frames){frame.ballHeight=1.2+1.8*Math.min(1,tick/peak);tick+=frame.duration;}
}
// The numeric production targets above remain fixed across the roster.
// Audit minima are the explicit lower bounds in issue 3, not padded frame slots.
for(const [key,minimum] of Object.entries({dribble:8,run:8,'dribble-run':8,shoot:8,push:8,celebrate:8}))animationClips[key].minimumUniqueFrames=minimum;
function sequenceFor(clip) { return clip.sequence ?? clip.frames.map((_,i)=>i); }
export function animationDuration(key) { const c=animationClips[key]; if(!c)throw new RangeError(`Unknown animation: ${key}`);return sequenceFor(c).reduce((n,i)=>n+c.frames[i].duration,0); }
export function anchorTick(key, anchor) { const c=animationClips[key];const frame=c?.anchors[anchor];if(frame===undefined)return null;const sequence=sequenceFor(c);return sequence.slice(0,sequence.indexOf(frame)).reduce((n,i)=>n+c.frames[i].duration,0); }
export function sampleAnimation(key, elapsedTicks=0) { const c=animationClips[key];if(!c)throw new RangeError(`Unknown animation: ${key}`);const duration=animationDuration(key),elapsed=Math.max(0,Number.isFinite(elapsedTicks)?elapsedTicks:0);let tick=c.loop?elapsed%duration:Math.min(elapsed,duration-1);for(const frame of sequenceFor(c)){if(tick<c.frames[frame].duration)return {frame,done:!c.loop&&elapsed>=duration};tick-=c.frames[frame].duration;}return {frame:0,done:false}; }

// Interpolate within each authored frame duration, using the same loop as sampling.
export function sampleBallHeight(key, elapsedTicks=0){
  const c=animationClips[key],duration=animationDuration(key),sequence=sequenceFor(c);
  const elapsed=Math.max(0,Number.isFinite(elapsedTicks)?elapsedTicks:0);
  let tick=c.loop?elapsed%duration:Math.min(elapsed,duration-1);
  for(let index=0;index<sequence.length;index++){
    const frame=c.frames[sequence[index]];
    if(tick<frame.duration){
      const height=frame.ballHeight??1.1,next=c.frames[sequence[index+1]??(c.loop?sequence[0]:sequence[index])];
      return height+((next.ballHeight??height)-height)*tick/frame.duration;
    }
    tick-=frame.duration;
  }
  return 1.1;
}
