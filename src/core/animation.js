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
// Estimated white-sleeved hand centers in the actual112x96 power cells.
// At court y50: horizontal pixels scale .804 and world court units scale2.2;
// hand elevation is (70.22-handY*.804)/28. Preserve the spread-arm peak's
// left hand, rather than holding the ball centrally above both raised arms.
const powerHandCenters=[[57,58],[27,55],[77,40],[47,16],[80,16],[59,12],[53,21],[38,14],[23,54],[91,12],[83,34],[39,61],[36,70],[51,73],[40,63]];
animationClips['dunk-power'].frames.forEach((frame,index)=>{
  const [x,y]=powerHandCenters[index];
  frame.ballHeight=(70.22-y*.804)/28;frame.ballForward=(x-56)*.804/2.2;
});
// The windmill arm sweeps behind the torso, below the hip, then up to the rim.
// These offsets follow the authored15-pose sheet rather than an overhead gather.
animationClips['dunk-windmill'].frames.forEach((frame,index)=>{
  frame.ballHeight=[1.2,1.1,1.1,2.1,.8,.5,.9,1.2,2.8,3,3,3,3,3,3][index];
  frame.ballForward=[1.5,-4,-5,-7,-3,4,3,10,1.5,1.5,1.5,1.5,1.5,1.5,1.5][index];
});
// Estimated hand tracks for the reviewed15-pose sheets, in world units.
// Reverse holds behind the head; tomahawk cocks one arm; double pumps high/low/high.
// Native Canvas hand review sets reverse peak2.1 and tomahawk cocked frames1.7.
// These offsets preserve the shared takeoff, release and scoring anchors.
for(const [variant,track] of Object.entries({
  reverse:{
    height:[1.2,.9,2.6,2.5,1.8,2.4,2.5,2.1,2.4,2.6,2.4,1.2,1.1,1.1,1.1],
    forward:[3,3,-2,-4,-2,-8,-2,-1,-3,12,-7,-7,4,4,4]
  },
  tomahawk:{
    height:[1.1,.8,1.1,2.6,1.7,1.7,1.7,1.7,1.7,2.6,1.6,1,1,1,1],
    forward:[3,-6,-8,0,-3,-5,-6,-6,-5,11,8,5,4,4,4]
  },
  double:{
    height:[1.2,1,2.4,2.5,2.6,1.6,.6,.6,1.6,2.6,2.3,1.1,1.1,1.1,1.1],
    forward:[2,-7,8,2,3,4,3,3,4,5,10,7,3,3,3]
  }
}))animationClips[`dunk-${variant}`].frames.forEach((frame,index)=>{
  frame.ballHeight=track.height[index];frame.ballForward=track.forward[index];
});
// Hand centers estimated from the packed, reviewed sheets at court y50.
// Clutch protects the ball at the hip; scythe sweeps diagonally. Aerial
// receivers close both hands at grab before their different finishing paths.
for(const [key,{width,hands}] of Object.entries({
  'dunk-360':{width:96,hands:[[50,57],[25,55],[71,28],[66,10],[47,33],[35,11],[47,10],[58,13],[82,22],[78,10],[62,48],[46,64],[43,70],[50,73],[45,63]]},
  layup:{width:96,hands:[[62,56],[65,15],[44,22],[69,9],[64,16],[59,18],[68,39],[62,58]]},
  'layup-reverse':{width:96,hands:[[64,57],[66,31],[59,18],[55,20],[48,9],[52,20],[66,48],[64,58]]},
  'pass-overhead':{width:112,hands:[[73,43],[61,15],[57,9],[84,26],[86,28],[71,56]]},
  'pass-behind':{width:112,hands:[[47,60],[65,55],[49,45],[18,43],[17,48],[73,56]]},
  'dunk-clutch':{width:96,hands:[[56,57],[27,55],[62,41],[62,43],[58,48],[55,48],[45,60],[45,58],[73,22],[77,9],[64,46],[53,65],[50,71],[48,73],[44,63]]},
  'dunk-scythe':{width:112,hands:[[58,58],[25,55],[77,42],[62,48],[25,14],[75,51],[92,14],[98,13],[95,21],[96,15],[82,60],[44,66],[38,73],[51,73],[42,64]]},
  'alley-oop-power':{width:112,hands:[[82,40],[84,28],[77,10],[70,12],[79,19],[69,24],[56,28],[84,21],[84,22],[88,42],[70,63],[59,66],[44,73],[49,74],[48,65]]},
  'alley-oop-reverse':{width:96,hands:[[73,44],[76,30],[63,10],[76,22],[55,15],[51,20],[42,29],[58,24],[29,40],[73,22],[25,62],[25,70],[55,63],[50,70],[51,65]]}
}))animationClips[key].frames.forEach((frame,index)=>{
  const [x,y]=hands[index];
  frame.ballHeight=(70.22-y*.804)/28;frame.ballForward=(x-width/2)*.804/2.2;
});
// The numeric production targets above remain fixed across the roster.
// Audit minima are the explicit lower bounds in issue 3, not padded frame slots.
for(const [key,minimum] of Object.entries({dribble:8,run:8,'dribble-run':8,shoot:8,push:8,celebrate:8}))animationClips[key].minimumUniqueFrames=minimum;
function sequenceFor(clip) { return clip.sequence ?? clip.frames.map((_,i)=>i); }
export function animationDuration(key) { const c=animationClips[key]; if(!c)throw new RangeError(`Unknown animation: ${key}`);return sequenceFor(c).reduce((n,i)=>n+c.frames[i].duration,0); }
export function anchorTick(key, anchor) { const c=animationClips[key];const frame=c?.anchors[anchor];if(frame===undefined)return null;const sequence=sequenceFor(c);return sequence.slice(0,sequence.indexOf(frame)).reduce((n,i)=>n+c.frames[i].duration,0); }
export function sampleAnimation(key, elapsedTicks=0) { const c=animationClips[key];if(!c)throw new RangeError(`Unknown animation: ${key}`);const duration=animationDuration(key),elapsed=Math.max(0,Number.isFinite(elapsedTicks)?elapsedTicks:0);let tick=c.loop?elapsed%duration:Math.min(elapsed,duration-1);for(const frame of sequenceFor(c)){if(tick<c.frames[frame].duration)return {frame,done:!c.loop&&elapsed>=duration};tick-=c.frames[frame].duration;}return {frame:0,done:false}; }

// Interpolate within each authored frame duration, using the same loop as sampling.
const athleteBallTracks={'nova-stitch': {"idle-ball":{"height":[1.1,1.1,1.1,1.1],"forward":[8,9,9,8]},"dribble":{"height":[1.2,1.05,0.8,0.5,0.2,0,0.25,0.6,0.95,1.2],"forward":[7,8,9,10,11,11,10,9,8,7]},"dribble-run":{"height":[1.2,1.1,0.85,0.55,0.25,0,0.25,0.55,0.85,1.1,1.2],"forward":[9,10,11,12,13,13,12,11,10,9,9]},"shoot":{"height":[0.95,1.05,1.25,1.5,2.31,2.31,2.05,1.8,1.35,1.1],"forward":[6,7,8,9,10.7,10.7,10,8,6,5]},"pass":{"height":[1.1,1.2,1.5,1.77,1.5,1.1],"forward":[7,6,10,16.1,12,7]},"pass-overhead":{"height":[1.1,1.5,2.1,2.25,1.6,1.1],"forward":[6,7,10.7,10.7,9,6]},"pass-behind":{"height":[1.1,1,0.95,0.96,1.1,0.9],"forward":[5,2,-8,-11.3,-8,4]},"receive":{"height":[1.1,2.2,1.25,1.35],"forward":[5,4.8,9,9]},"pickup":{"height":[1.1,0.65,0.3,0,0.75],"forward":[5,7,10,13,8]},"layup":{"height":[1.1,1.25,1.5,1.8,2.19,2.19,1.35,0.8],"forward":[6,7,9,11,8.9,8.9,9,7]},"layup-reverse":{"height":[1.1,1.2,1.5,1.8,2,2.14,2.14,0.8],"forward":[6,8,6,-2,-3,10.1,10.1,6]},"rebound":{"height":[1,1.55,2.15,2.18,1.45],"forward":[3,5,8,2.4,0]},"steal":{"height":[1.15,0.95,0.65,1.9,0.7,1,1.2,1.1],"forward":[8,10,12,13.1,14,14,12,9]},"dunk-power":{"height":[1,1.15,1.25,1.4,1.65,1.9,2.1,2.25,2.35,2.3,2.08,1.65,1.1,0.75,0.65],"forward":[6,8,9,10,10,8,6,6,9,13,-2.1,13,10,8,7]},"dunk-windmill":{"height":[1,1.2,1.5,1.8,2,2.1,2.3,2.5,2.4,2.31,2.31,1.4,1,0.75,0.65],"forward":[6,8,9,10,8,5,4,8,10,12.2,12.2,12,9,6,5]},"dunk-reverse":{"height":[1,1.1,1.4,1.8,2.1,2.25,2.35,2.4,2.2,2.08,2.08,1.2,1,0.8,0.7],"forward":[7,9,11,13,11,8,5,4,4,13.1,13.1,8,8,7,6]},"dunk-360":{"height":[1,1.2,1.5,1.8,2.1,2.3,2.5,2.6,2.4,2.28,2.28,1.4,1,0.75,0.65],"forward":[6,8,10,12,13,12,10,7,6,13.1,13.1,14,12,9,7]},"dunk-tomahawk":{"height":[1,1.1,1.35,1.65,1.95,2.15,2.3,2.4,2.2,-1.65,1.67,1.3,1.05,0.8,0.65],"forward":[6,8,10,11,10,8,6,7,9,5.5,2.7,13,10,7,6]},"dunk-double":{"height":[1,1.15,1.4,1.8,2.1,2.3,2.5,2.6,2.35,3.15,0.76,1.3,1,0.75,0.65],"forward":[6,8,10,11,9,7,5,5,7,8.9,8.9,12,9,7,6]},"dunk-clutch":{"height":[1,1.15,1.3,1.55,1.8,2.05,2.3,2.5,2.45,2.19,2.19,1.3,1,0.75,0.65],"forward":[6,8,10,12,11,9,7,6,8,3,3,12,9,7,6]},"dunk-scythe":{"height":[1,1.2,1.5,1.8,2.05,2.25,2.4,2.5,2.35,1.99,1.99,1.3,1,0.75,0.65],"forward":[6,8,10,12,10,8,6,5,7,13.4,13.4,12,9,7,6]},"alley-oop-power":{"height":[1.7,2,2.1,2.25,2.4,2.5,2.55,2.45,2.3,2.31,2.31,1.45,1.1,0.8,0.65],"forward":[12,10,7,4,2,1,1,3,7,-3.3,-3.3,13,10,8,6]},"alley-oop-reverse":{"height":[1.7,2,2.2,2.3,2.4,2.45,2.5,2.45,2.3,2.22,2.22,1.45,1.1,0.8,0.65],"forward":[12,10,7,4,2,1,0,1,3,13.7,13.7,9,9,8,6]}},
'accu': {
  "alley-oop-power": {
    "height": [
      1.7,
      2.0,
      2.1,
      2.25,
      2.4,
      2.5,
      2.55,
      2.45,
      2.3,
      2.31,
      2.31,
      1.45,
      1.1,
      0.8,
      0.65
    ],
    "forward": [
      12,
      10,
      7,
      4,
      2,
      1,
      1,
      3,
      7,
      -3.3,
      -3.3,
      13,
      10,
      8,
      6
    ]
  },
  "alley-oop-reverse": {
    "height": [
      1.7,
      2.0,
      2.2,
      2.3,
      2.4,
      2.45,
      2.5,
      2.45,
      2.3,
      2.22,
      2.22,
      1.45,
      1.1,
      0.8,
      0.65
    ],
    "forward": [
      12,
      10,
      7,
      4,
      2,
      1,
      0,
      1,
      3,
      13.7,
      13.7,
      9,
      9,
      8,
      6
    ]
  },
  "dunk-360": {
    "height": [
      1.0,
      1.2,
      1.5,
      1.8,
      2.1,
      2.3,
      2.5,
      2.6,
      2.4,
      2.28,
      2.28,
      1.4,
      1.0,
      0.75,
      0.65
    ],
    "forward": [
      6,
      8,
      10,
      12,
      13,
      12,
      10,
      7,
      6,
      13.1,
      13.1,
      14,
      12,
      9,
      7
    ]
  },
  "dunk-clutch": {
    "height": [
      1.0,
      1.15,
      1.3,
      1.55,
      1.8,
      2.05,
      2.3,
      2.5,
      2.45,
      2.19,
      2.19,
      1.3,
      1.0,
      0.75,
      0.65
    ],
    "forward": [
      6,
      8,
      10,
      12,
      11,
      9,
      7,
      6,
      8,
      3,
      3,
      12,
      9,
      7,
      6
    ]
  },
  "dunk-double": {
    "height": [
      1.0,
      1.15,
      1.4,
      1.8,
      2.1,
      2.3,
      2.5,
      2.6,
      2.35,
      0.76,
      0.76,
      1.3,
      1.0,
      0.75,
      0.65
    ],
    "forward": [
      6,
      8,
      10,
      11,
      9,
      7,
      5,
      5,
      7,
      8.9,
      8.9,
      12,
      9,
      7,
      6
    ]
  },
  "dunk-power": {
    "height": [
      1.0,
      1.15,
      1.25,
      1.4,
      1.65,
      1.9,
      2.1,
      2.25,
      2.35,
      2.08,
      2.08,
      1.65,
      1.1,
      0.75,
      0.65
    ],
    "forward": [
      6,
      8,
      9,
      10,
      10,
      8,
      6,
      6,
      9,
      -2.1,
      -2.1,
      13,
      10,
      8,
      7
    ]
  },
  "dunk-reverse": {
    "height": [
      1.0,
      1.1,
      1.4,
      1.8,
      2.1,
      2.25,
      2.35,
      2.4,
      2.2,
      2.08,
      2.08,
      1.2,
      1.0,
      0.8,
      0.7
    ],
    "forward": [
      7,
      9,
      11,
      13,
      11,
      8,
      5,
      4,
      4,
      13.1,
      13.1,
      8,
      8,
      7,
      6
    ]
  },
  "dunk-scythe": {
    "height": [
      1.0,
      1.2,
      1.5,
      1.8,
      2.05,
      2.25,
      2.4,
      2.5,
      2.35,
      1.99,
      1.99,
      1.3,
      1.0,
      0.75,
      0.65
    ],
    "forward": [
      6,
      8,
      10,
      12,
      10,
      8,
      6,
      5,
      7,
      13.4,
      13.4,
      12,
      9,
      7,
      6
    ]
  },
  "dunk-tomahawk": {
    "height": [
      1.0,
      1.1,
      1.35,
      1.65,
      1.95,
      2.15,
      2.3,
      2.4,
      2.2,
      1.67,
      1.67,
      1.3,
      1.05,
      0.8,
      0.65
    ],
    "forward": [
      6,
      8,
      10,
      11,
      10,
      8,
      6,
      7,
      9,
      2.7,
      2.7,
      13,
      10,
      7,
      6
    ]
  },
  "dunk-windmill": {
    "height": [
      1.0,
      1.2,
      1.5,
      1.8,
      2.0,
      2.1,
      2.3,
      2.5,
      2.4,
      2.31,
      2.31,
      1.4,
      1.0,
      0.75,
      0.65
    ],
    "forward": [
      6,
      8,
      9,
      10,
      8,
      5,
      4,
      8,
      10,
      12.2,
      12.2,
      12,
      9,
      6,
      5
    ]
  },
  "rebound": {
    "height": [
      1.0,
      1.55,
      2.15,
      2.18,
      1.45
    ],
    "forward": [
      3,
      5,
      8,
      2.4,
      0
    ]
  },
  "idle-ball": {
    "height": [
      1.1,
      1.1,
      1.1,
      1.1
    ],
    "forward": [
      8,
      9,
      9,
      8
    ]
  },
  "dribble": {
    "height": [
      1.2,
      1.05,
      0.8,
      0.5,
      0.2,
      0,
      0.25,
      0.6,
      0.95,
      1.2
    ],
    "forward": [
      7,
      8,
      9,
      10,
      11,
      11,
      10,
      9,
      8,
      7
    ]
  },
  "dribble-run": {
    "height": [
      1.2,
      1.1,
      0.85,
      0.55,
      0.25,
      0,
      0.25,
      0.55,
      0.85,
      1.1,
      1.2
    ],
    "forward": [
      9,
      10,
      11,
      12,
      13,
      13,
      12,
      11,
      10,
      9,
      9
    ]
  },
  "shoot": {
    "height": [
      0.95,
      1.05,
      1.25,
      1.5,
      2.31,
      2.31,
      2.05,
      1.8,
      1.35,
      1.1
    ],
    "forward": [
      6,
      7,
      8,
      9,
      10.7,
      10.7,
      10,
      8,
      6,
      5
    ]
  },
  "layup": {
    "height": [
      1.1,
      1.25,
      1.5,
      1.8,
      2.19,
      2.19,
      1.35,
      0.8
    ],
    "forward": [
      6,
      7,
      9,
      11,
      8.9,
      8.9,
      9,
      7
    ]
  },
  "layup-reverse": {
    "height": [
      1.1,
      1.2,
      1.5,
      1.8,
      2,
      2.14,
      2.14,
      0.8
    ],
    "forward": [
      6,
      8,
      6,
      -2,
      -3,
      10.1,
      10.1,
      6
    ]
  },
  "pass": {
    "height": [
      1.1,
      1.2,
      1.5,
      1.77,
      1.5,
      1.1
    ],
    "forward": [
      7,
      6,
      10,
      16.1,
      12,
      7
    ]
  },
  "pass-overhead": {
    "height": [
      1.1,
      1.5,
      2.1,
      2.25,
      1.6,
      1.1
    ],
    "forward": [
      6,
      7,
      10.7,
      10.7,
      9,
      6
    ]
  },
  "pass-behind": {
    "height": [
      1.1,
      1,
      0.95,
      0.96,
      1.1,
      0.9
    ],
    "forward": [
      5,
      2,
      -8,
      -11.3,
      -8,
      4
    ]
  },
  "pickup": {
    "height": [
      1.1,
      0.65,
      0.3,
      0,
      0.75
    ],
    "forward": [
      5,
      7,
      10,
      13,
      8
    ]
  },
  "receive": {
    "height": [
      1.1,
      2.2,
      2.33,
      1.35
    ],
    "forward": [
      5,
      4.8,
      4.8,
      9
    ]
  },
  "steal": {
    "height": [
      1.15,
      0.95,
      0.65,
      1.9,
      0.7,
      1,
      1.2,
      1.1
    ],
    "forward": [
      8,
      10,
      12,
      13.1,
      14,
      14,
      12,
      9
    ]
  }
},
'briar-foxglove':{
  // Briar's direct jump shot follows the separate ball from her low gather
  // through the high right-hand release; the source artwork remains empty.
  shoot:{height:[1.043,1.417,.929,1.618,1.962,2.249,2.278,2.249,1.187,1.072],forward:[7.309,4.02,7.675,5.847,6.213,6.944,7.675,7.675,6.578,8.771]}
},'piper-quickstep':{
  // The ball stays in Piper's leading hand through the bent jump-shot release.
  // Centers were measured on the reviewed 128x96 source cells and checked in
  // the pre-pack overlay and native Canvas render at standard/120% zoom.
  shoot:{height:[1.13,1.043,1.503,1.503,2.048,2.278,2.278,2.278,1.962,1.187],forward:[8.04,9.502,3.655,4.751,7.675,5.847,6.944,7.309,9.867,8.405]},
  // Piper releases her two-hand chest pass on frame3/tick5; native 100%/120%
  // reviews in both facings place the separate ball at her extended fingertips.
  pass:{height:[1.1,1.2,1.5,1.5,1.45,1.1],forward:[8,7.5,12,18,17.5,9]},
  // Overhead pass peaks above Piper's hands at frame3/tick7; ball remains separate.
  'pass-overhead':{height:[1.1,2.4,2.45,2.35,2.2,1.75],forward:[7,6,4.5,16,18,20]},
  // Piper sends the ball behind her waist on frame3/tick7; keep it athlete-specific.
  'pass-behind':{height:[1.15,1.2,1.25,1.4,1.25,1.0],forward:[8,4,-5,-12,-17,-22]},
  // Piper meets the incoming ball on frame2/tick4, then settles it at her sternum.
  receive:{height:[1.35,1.55,2.0,1.2],forward:[9,14,8,8]},
  // The separate ball starts ahead of Piper, meets her open fingertips at frame3/tick7, then rises into her recovery hold.
  pickup:{height:[.9,.55,.2,0,.6],forward:[7,10,14,14,8]},
  // Reviewed Piper-specific layup path: gather at tick9, release at frame4/tick10, then game shot physics.
  layup:{height:[1.1,1.25,2.1,1.8,2.19,2.19,1.35,.8],forward:[6,7,9,9,8.9,8.9,9,7]},
  // The reverse source crosses behind Piper's head; estimated atlas hand
  // centers keep the ball on her far-side hand until frame5/tick12 releases.
  'layup-reverse':{height:[1.15,1.7,2.2,2.2,2.5,2.45,1.4,.8],forward:[3.7,6.6,-1.8,2.2,-7.5,-6.5,2,6]},
  // Piper's rebound catch is overhead at frame3/tick5, then settles to her
  // chest at frame4; the athlete art stays empty-handed in every pose.
  rebound:{height:[1.05,1.5,2.1,1.9,2.0],forward:[5,7,8,4,5]},
  // Contact estimate for Piper's open-hand steal at frame3/tick5. Once a
  // successful steal jars the ball loose, normal loose-ball physics takes over.
  steal:{height:[1.05,1.0,.75,1.5,1.3,1.1,1.0,.95],forward:[4,7,10,12.5,10,8,6,5]},
  // The separate ball meets Piper's bent fist at tick10 and overhead fist at
  // tick14, stays at her extended fingertips through tick20, and releases at21.
  'dunk-power':{height:[.95,1.1,1.25,1.4,1.8,2.25,1.65,2.4,2,2.2,2.2,1.5,1.1,.8,.6],forward:[4,6,8,9,10,-8,1,-6,4,12,12,7,5,4,3]},
  // Piper winds the ball behind her hip, sweeps it low and forward, then
  // holds it against the raised fist through tick20 before a tick21 release.
  'dunk-windmill':{height:[.55,.55,1.25,.72,.65,1.1,.8,.3,1.4,2.2,2.2,1.05,.55,.4,.3],forward:[19,8,18,18,-13,-5,-8,12,13,-8,-8,20,22,20,18]},
  // The reverse carry meets Piper's crown-side hand and stays there through
  // tick20 before the single ownerless release at tick21.
  'dunk-reverse':{height:[.35,.4,.65,.5,1.65,1.8,2.5,2.2,1.8,1.9,1.9,1.1,.8,.7,.6],forward:[10,0,4,5,6,7,0,-7,-6,-2,-2,16,8,5,4]},
  // Follow Piper's new shoulder-secured 360 spin hand, cocked palm, and sole
  // release; keep the separate ball held through tick20.
  'dunk-360':{height:[.95,1.1,.55,1.3,1.45,1.25,1.2,2.0,1.0,1.8,3.2,2.4,1.5,.7,.55],forward:[6,6,4,5,0,-4,12,-8,10,-4,3,8,8,5,5]},
  // The tomahawk cocks behind the crown, then holds the raised fist through
  // tick20 before its sole ownerless release at tick21.
  'dunk-tomahawk':{height:[.95,1.1,1.25,1.7,1.9,2.05,2.2,2.45,2.4,2.35,1.5,2,1.4,.7,.55],forward:[6,8,4,-2,-10,-7,-8,-5,12,2,8,6,8,5,6]},
  // Piper resets the double-dunk ball to her chest between pumps; the second
  // reach carries through tick20 and releases on the sole frame10 open palm.
  'dunk-double':{height:[.95,1.1,1.25,1.7,1.65,2.0,1.55,1.6,2.35,1.8,2.1,1.2,1.25,.75,.55],forward:[6,8,8,5,3,2,3.5,5,6.2,6.0,12,10,7,5,5]}
},'reed-ashcroft':{
  // Reed's new 112x96 chest-pass sheet extends both arms well beyond his
  // torso; frame 3 is the authored release hand, not the shared torso offset.
  pass:{height:[.9,1.2,1.45,1.5,1.45,.95],forward:[8,7.5,12.5,18,17.5,9]},
  'pass-overhead':{height:[1.1,1.65,2.25,2.15,1.95,1.1],forward:[6.5,10,11,12.5,12,6.5]},
  'pass-behind':{height:[1,1,.95,1.25,1.15,.95],forward:[3,1,-8,-14.5,-12,2]},
  // The separate ball follows Reed's open hands through the chest-height catch.
  receive:{height:[1.25,1.4,1.5,1.4],forward:[8,13,15,11]},
  // Follow the descending reach to court contact, then lift with Reed's hand.
  pickup:{height:[1.1,.7,.35,0,.75],forward:[5,10,15,18,10]},
  // Reed keeps both hands around the ball at his sternum through the rise,
  // then transfers forward for one release on the right hand.
  'dunk-clutch':{height:[.95,1.05,1.05,.95,.95,.9,.9,.95,1,1.7,1.8,1.5,1.1,.8,.75],forward:[7,6,5,3,3,3,3,3,4,10,13,10,5,4,4]},
  // Reed's scythe cuts low and behind before carrying across the chest to one high-right release.
  'dunk-scythe':{height:[.9,.8,.85,.75,.6,.45,.8,1.15,1.65,2.35,2.3,1.7,1.1,.8,.75],forward:[7,6,4,2,-4,-7,-5,0,-2,10,13,9,5,4,4]},
  // Reed's low steal lunge reaches farther forward than Juniper's compact stance.
  steal:{height:[.95,1.05,1.2,1.35,1.2,1.05,.95,.9],forward:[4,7,11,14,12,8,7,6]},
  // Reach over his topknot on the rebound grab, then bring the separate ball
  // down to Reed's upper-chest hands during the landing pose.
  rebound:{height:[1.05,1.65,2.25,2.55,1.45],forward:[5,7,11,0,0]},
  // The reviewed 80x96 Reed layup cells put the release hand overhead on
  // authored frame4; keep the loose runtime ball at that hand through landing.
  layup:{height:[1.101,1.015,.986,2.278,2.135,2.049,.842,.929],forward:[.731,2.924,1.827,10.233,7.676,5.482,8.407,9.869]},
  // The reverse release is frame5 after Reed crosses beneath the hoop; keep
  // the ball at his raised hand as his torso turns to the far side.
  'layup-reverse':{height:[1.101,1.35,1.0,1.8,2.135,2.135,.95,.85],forward:[.731,2.924,1.827,10.233,7.676,7.676,8.407,9.869]},
  // Reed reaches up to catch the lob, gathers at his shoulder, then carries
  // the separate ball through one forward power finish and releases at tick21.
  'alley-oop-power':{height:[1.359,1.704,2.221,2.163,1.962,2.3,1.0,1.2,1.25,2.3,2.3,.613,.412,.383,.641],forward:[9.502,10.233,7.675,5.116,8.405,9.5,0,10.233,10.233,11.695,11.695,1.096,-4.385,-2.558,-2.924]},
  // Reed catches high, gathers at the shoulder, turns away from the rim and
  // carries the separate ball behind his crown for one backward release.
  'alley-oop-reverse':{height:[1.25,1.4,1.8,2,2.2,2.3,1.45,1.45,1.8,2.33,2.45,2,1.3,.7,.5],forward:[7,8,9,10,11,-6,-4,-10,13.3,6,12.9,-8,-3,4,4]},
  // Reed's 128x96 power-dunk atlas holds the ball forward at the gathers,
  // above his near hand through the peak, and at the extended release wrist.
  'dunk-power':{height:[.9,.929,.986,1.216,2.048,2.336,2.336,2.163,2.278,2.336,2.221,1.618,.929,.786,.728],forward:[5.116,9.502,6.578,11.329,8.405,10.964,8.04,8.04,7.309,13.156,13.522,13.522,5.847,13.156,16.08]},
  // Reed's windmill sweeps the separate ball behind his shoulder/hip, low
  // beneath the torso, then up around the head and forward to the release.
  'dunk-windmill':{height:[.9,.728,1.216,1.302,.671,.929,.929,2.221,2.278,2.364,1.618,1.76,.9,.756,.871],forward:[2.193,4.02,-10.6,-13.89,-10.23,-14.25,13.16,-11.7,-16.08,16.08,14.62,16.81,14.99,6.58,5.12]},
  // Reed gathers at his waist, turns his back to the rim, carries the ball
  // behind his crown, then releases it backward at the reverse finish.
  'dunk-reverse':{height:[1,.9,1.45,1.75,2.2,2.25,2.34,2.4,2.35,2.4,2.35,2.15,1.1,.9,.8],forward:[4.4,6.6,2.9,-3.65,-4,-2.2,3.3,8.8,-10.2,-9.5,-13.5,-8,1,4,4]},
  // Follow the separate ball around Reed's complete torso spin: waist gather,
  // chest-height back/profile rotation, high right-facing peak, then release.
  'dunk-360':{height:[1,.9,1.2,1.35,1.45,1.35,1.25,2.8,2.5,2.9,2.7,1.8,1.1,.9,.8],forward:[5,1,2,0,0,-1,-3,4,-6,7,8,0,0,4,4]},
  // Reed cocks the ball behind his crown before the one-handed tomahawk;
  // the separate ball reaches his extended right hand before tick21 release.
  'dunk-tomahawk':{height:[.95,1.05,2.1,1.85,1.9,1.9,2,2,1.9,2.2,2,1.4,1.15,.8,.55],forward:[8,2,1,-6,-7,-8,-8,-7,-4,13,11,8,4,4,4]},
  // Reed lifts the separate ball for a first overhead pump, resets it to his
  // chest, then drives it up again before the right-hand release.
  'dunk-double':{height:[.95,1.1,1.65,3,3.7,1.55,1.25,1.75,2.35,2.9,2.35,2,1.15,.85,.65],forward:[7,5,3,-4,-8,-1,2,5,4.5,12.5,13,7.5,4,3,3]}
},'juniper-vale':{
  // Juniper's compact 96x96 poses have a shorter reach than Reed's release.
  pass:{height:[.9,1.2,1.4,1.5,1.45,.95],forward:[7,7.5,10.5,15,14.5,8.5]},
  'pass-overhead':{height:[1.1,1.65,2.25,2.15,1.95,1.1],forward:[6.5,9.5,10,10.5,10,6.5]},
  'pass-behind':{height:[1,1,.95,1.25,1.15,.95],forward:[3,1,-8,-14,-12,2]},
  // Juniper's compact stance pulls the separately rendered ball closer to her chest.
  receive:{height:[1.25,1.4,1.5,1.4],forward:[7,11,13,10]},
  // Her lead hand reaches lower and slightly shorter than Reed's on pickup.
  pickup:{height:[1.1,.7,.35,0,.75],forward:[5,8,13,16,9]},
  // Her lead hand crosses a shorter reach lane during contact and recovery.
  steal:{height:[.9,1,1.1,1.25,1.15,1,.9,.85],forward:[3,6,9,12,10,7,6,5]},
  // Juniper's compact reach secures the ball above her curls before she lands.
  rebound:{height:[1,1.55,2.15,2.45,1.45],forward:[3,5,8,0,0]},
  // Juniper's compact 80x96 layup poses keep the separate ball at her own
  // gather and overhead release hand, clear of the high ponytail silhouette.
  layup:{height:[.72,.72,.65,1.72,2.03,1.65,.92,.51],forward:[2,5.7,1.7,3.5,5.3,7,5.7,1.8]},
  // Her reverse-side release is frame5 at tick12; the compact track keeps the
  // separate ball on Juniper's raised hand without clipping her high curls.
  'layup-reverse':{height:[.72,.72,.65,1.72,1.85,2.03,.92,.51],forward:[2,5.7,1.7,3.5,5.3,5.3,5.7,1.8]},
  // The compact power-dunk gather rises from waist to her right hand above
  // the rim; gameplay releases the separate ball on the shared tick-21 mark.
  'dunk-power':{height:[.95,1.1,1.25,1.4,1.8,1.5,1.65,1.9,2,2,2,1.5,1.1,.8,.6],forward:[4,6,8,9,10,-1,1,0,4,9,9,7,5,4,3]},
  // Juniper circles the separate ball close to her compact body: behind the
  // hip at the low point, then upward beside her curls and into the release.
  'dunk-windmill':{height:[.9,1.1,.9,.8,1,1.3,.6,.8,.9,1.7,.7,1.5,1,.8,.6],forward:[4,6,4,5,-2,4,6,5,8,-2,5,8,5,4,3]},
  // Her reverse carry turns behind the crown at a tighter reach than Reed's
  // track, then releases from the right hand over her shoulder.
  'dunk-reverse':{height:[.9,.8,1.3,1.6,1.8,1.9,2,2.1,2,1.9,1.1,1.6,.9,.7,.6],forward:[4,6,3,-2,-3,-2,2,5,-5,-5,10,-4,2,4,4]},
  // Keep Juniper's ball near her compact body through the back/profile turns,
  // then bring it to her raised right hand as the full spin returns to rim.
  'dunk-360':{height:[.85,.8,1.15,1.25,1.45,1.35,1.65,1.15,2,.85,.85,1.8,1.1,.9,.8],forward:[4,1,2,0,-1,-1,-3,10,8,6,8,4,1,4,4]},
  // Juniper loads the separate ball behind her crown, holds it cocked at the
  // apex, then drives it into her one-handed straight-down tomahawk release.
  'dunk-tomahawk':{height:[.9,.8,1.1,1,.9,1,1,1.3,1,1.4,1.4,1.8,1.1,.9,.8],forward:[4,-2,6,0,-1,-1,0,0,-2,7,8,4,1,4,4]},
  // Juniper pumps the separate ball overhead, resets to her chest, then
  // drives both hands up for a single synchronized release.
  'dunk-double':{height:[.95,1.1,1.7,2.5,1.9,1.2,.95,.95,1.8,2.5,2.5,2,1.1,.9,.8],forward:[4,5,5,7,2,0,-1,0,3,7,8,4,1,4,4]},
  // Juniper protects a cross-body clutch below her knees, draws the separate
  // ball across her ribs, then reaches diagonally for one release.
  'dunk-clutch':{height:[.9,1,1.3,1,.75,.75,.45,.95,1.5,2.15,2.3,1.75,1.1,.9,.8],forward:[4,4,3,1,0,-1,-2,-1,2,6,8,4,1,4,4]},
  // Juniper swings the separate ball from a low far-hip sweep across her chest,
  // arcs it high, then releases diagonally rather than vertically.
  'dunk-scythe':{height:[.9,.95,1.2,1.3,1.8,1.6,.3,.8,.4,2.1,2.2,1.8,1.1,.85,.75],forward:[4,2,-6,-2,2,5,11,11,10,10,8,4,0,4,4]},
  'alley-oop-power':{height:[.8,.9,1.1,1.5,1.8,1.9,1.8,1.9,1.6,1.5,.35,.9,.7,.65,.6],forward:[4,2,1,2,2,1,2,3.5,.5,1,10,1,0,4,4]},
  // Juniper gathers the separate lob to her shoulder, carries it behind her
  // crown during the turn, then releases backward over her shoulder once.
  'alley-oop-reverse':{height:[.9,1.1,1.3,1.5,1.6,1.7,1,1,1.35,1.5,1.35,1.2,.9,.7,.6],forward:[6,8,8,5,2,0,1,2,-6,-9,-11,-7,-3,2,4]}
},'sera-bellini':{
  // The reviewed 80x96 sheet places the lead hand ahead of her torso; keep
  // the separate game ball at that hand through her court-level bounce.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'moxie-capwell':{
  // Moxie's long, forward-reaching low-run poses use the same court-space
  // hand lane as Sera while retaining their individual purple-kit sprites.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]},
  // Exact athlete-specific contact tracks from accepted J.03 source provenance.
  "shoot":{"height":[1.1,1.35,1.7,2.1,2.6,3,3.25,2.8,1.2,0.8],"forward":[5,5,3,4,6,7,5,1,1,4]},
  "pass":{"height":[1.05,1.15,1.25,0.95,0.8,0.8],"forward":[6,6,8,14,14,8]},
  "pass-overhead":{"height":[1.05,1.35,2.0,2.8,2.5,1.4],"forward":[6,5,4,8,10,7]},
  "pass-behind":{"height":[1.05,0.9,0.8,0.8,0.8,0.8],"forward":[5,-3,-12,-14,-8,4]},
  "receive":{"height":[1.2,1.45,1.5,1.35],"forward":[5,10,12,8]},
  "pickup":{"height":[0.55,0.35,0.15,0,0.75],"forward":[7,8,12,14,9]},
  "layup":{"height":[1.0,0.9,1.3,2,2.8,2.6,1.4,0.8],"forward":[6,8,8,10,13,10,5,6]},
  "layup-reverse":{"height":[1.05,1.25,1.6,2,2.2,2.4,1.2,0.8],"forward":[6,8,6,3,-3,8,5,5]},
  "steal":{"height":[1.05,1.05,1.15,1.25,1.1,0.9,0.8,0.8],"forward":[-8,-4,2,10,12,8,5,5]},
  "rebound":{"height":[0.9,1.25,1.9,2.2,1.2],"forward":[6,8,11,14,8]},
  "fall":{"height":[1,0.9,0.75,0.4,0.2,0.1,0.15,0.2,0.4,0.6],"forward":[6,7,9,10,12,13,13,13,11,9]},
  "celebrate":{"height":[0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2],"forward":[14,14,14,14,14,14,14,14,14,14]},
  "dunk-power":{"height":[1.05,1.2,1.4,1.7,2.2,2.6,3.0,3.3,2.38,2.29,2.29,1.9,1.45,1.05,0.8],"forward":[6,8,9,11,13,15,16,17,11.1,11.1,11.1,25,32,38,42]},
  "dunk-windmill":{"height":[1,1.2,1.4,1.5,1.8,2.1,1.4,0.7,1.6,2.18,2.18,3.2,2.5,1.5,0.8],"forward":[6,8,10,10,8,4,0,-2,-13.3,0.4,0.4,18,27,35,40]},
  "dunk-reverse":{"height":[1.05,1.2,1.4,2.0,2.5,2.8,2.2,1.8,2.1,2.3,2.3,3.4,2.6,1.4,0.8],"forward":[6,8,10,12,15,16,14,13,15,2,2,24,31,38,42]},
  "dunk-360":{"height":[1.0,1.1,1.8,2.5,3.0,2.8,2.5,2.2,2.4,2.47,2.47,3.2,2.1,1.2,0.8],"forward":[6,8,10,12,10,8,6,5,8,3.7,3.7,18,25,35,42]},
  "dunk-tomahawk":{"height":[1,1.2,1.4,2,2.5,3,3.3,3.1,0.96,0.15,0.15,0.9,0.6,0.35,0.35],"forward":[6,8,10,12,14,15,14,13,14.4,7,7,30,38,42,42]},
  "dunk-double":{"height":[1,1.2,1.4,1.8,2.3,2.8,3.2,3.3,1.71,1.07,1.07,1.7,1.2,0.7,0.6],"forward":[6,8,10,12,14,16,17,18,11.8,14,14,28,34,39,42]},
  "dunk-clutch":{"height":[1,1.2,1.5,1.8,2.2,2.6,2.9,3.1,1.48,2.44,2.44,1.8,1.2,0.8,0.6],"forward":[6,8,10,12,14,15,16,17,6.6,15.5,15.5,35,40,42,42]},
  "dunk-scythe":{"height":[1,1.2,1.4,1.2,1.5,2.0,2.5,3.0,1.48,2.47,2.47,1.6,1.2,0.8,0.6],"forward":[6,8,9,8,7,6,8,11,2.2,8.5,8.5,35,40,42,42]},
  "alley-oop-power":{"height":[1.5,2,2.5,3,3.4,3.1,2.8,3,0.84,0.52,0.52,1.8,1.2,0.8,0.6],"forward":[22,19,16,14,12,10,12,15,10.7,10,10,36,41,42,42]},
  "alley-oop-reverse":{"height":[1.8,2.2,2.8,3.2,3.4,3.3,3.1,3.3,2.47,2.12,2.12,1.8,1.2,0.8,0.6],"forward":[20,18,16,14,12,10,12,14,5.2,-10.7,-10.7,35,40,42,42]},
},'echo-catwalk':{"idle-ball":{"height":[1,1,1,1],"forward":[7,8,8,7]},"dribble":{"height":[1.15,1,0.8,0.5,0.2,0,0.25,0.6,0.95,1.15],"forward":[7,8,9,10,11,11,10,9,8,7]},"dribble-run":{"height":[1.15,1.05,0.85,0.55,0.25,0,0.25,0.55,0.85,1.05,1.15],"forward":[9,10,11,12,13,13,12,11,10,9,9]},"shoot":{"height":[1,1.1,1.3,1.8,1.6,2.2,2.1,1.5,1.1,0.9],"forward":[5,7,9,12,6,4.5,12,8,6,5]},"pass":{"height":[1,1.05,1.2,1.6,1.3,1],"forward":[5,4,13,19,16,8]},"pass-overhead":{"height":[1.1,1.25,1.8,2.1,1.85,1.1],"forward":[5,5,8,8,10,7]},"pass-behind":{"height":[1,1.1,0.8,1.1,1.15,1],"forward":[5,5,-4,14,15,7]},"receive":{"height":[1.2,1.35,1.4,1.2],"forward":[4,8,4,7]},"pickup":{"height":[1.2,0.65,0.25,0,0.75],"forward":[5,8,12,14,9]},"layup":{"height":[1,1.1,1.4,1.4,2,2.8,2.2,1],"forward":[5,8,9,5,8,12,9,7]},"layup-reverse":{"height":[1,1.1,1.2,1.6,2.2,2.4,1.5,0.8],"forward":[5,8,7,4,-5,-7,0,5]},"rebound":{"height":[0.95,1.5,2.4,1.9,1.5],"forward":[6,6,9,2,8]},"steal":{"height":[1,1.1,0.65,1.1,0.8,1.1,1.2,1],"forward":[5,8,12,15,7,8,8,5]},"dunk-power":{"height":[1,1.15,1.25,1.4,1.65,1.9,2.1,2.25,2.35,1.7,2.08,1.65,1.1,0.75,0.65],"forward":[6,8,9,10,10,8,6,6,9,3,-2.1,13,10,8,7]},"dunk-windmill":{"height":[1,1.1,1.2,1,0.8,0.9,1.2,1.6,2,2.2,2.1,1.7,1.2,0.8,0.65],"forward":[6,8,9,-3,-7,-10,-8,-4,0,6,11,12,8,5,4]},"dunk-reverse":{"height":[1,1.1,1.2,1.5,1.8,2,2.2,2.3,2.4,1.9,2.1,1.7,1.2,0.8,0.65],"forward":[6,8,10,9,7,4,2,-2,-6,15,-11,-8,-3,3,4]},"dunk-360":{"height":[1,1.1,1.3,1.6,1.9,2.1,2.3,2.4,2.4,1.7,2.1,1.7,1.2,0.8,0.65],"forward":[6,8,10,11,8,4,0,-5,-8,1,13,10,5,4,4]},"dunk-tomahawk":{"height":[1,1.1,1.3,1.6,1.9,2,2.1,2,1.9,1.8,2.1,1.6,1.1,0.8,0.65],"forward":[6,8,9,7,3,0,-3,-5,-7,4,12,8,5,4,4]},"dunk-double":{"height":[1,1.1,1.3,1.8,2.5,1.4,1.1,1.6,2.5,1.8,2.1,1.7,1.2,0.8,0.65],"forward":[6,8,8,3,1,-1,2,6,10,4,12,8,5,4,4]},"dunk-clutch":{"height":[1,1.05,1.2,1.4,1.6,1.8,2,2.2,2.3,1.7,2.15,1.7,1.2,0.8,0.65],"forward":[5,6,7,8,7,6,4,5,9,4,12,8,5,4,4]},"dunk-scythe":{"height":[1,1.1,1.2,1,0.8,0.6,0.7,1,1.6,1.7,2.3,1.8,1.2,0.8,0.65],"forward":[6,4,1,-5,-9,-12,-10,-6,0,2,13,9,5,4,4]},"alley-oop-power":{"height":[1.5,1.8,2.1,2.5,2.5,2,1.5,1.3,1.2,1.7,2.2,1.5,1,0.8,0.65],"forward":[13,10,8,6,4,2,1,2,7,4,12,8,5,4,4]},"alley-oop-reverse":{"height":[1.5,1.8,2.1,2.2,2.3,1.3,2.5,2.3,2,1.6,2.1,1.6,1,0.8,0.65],"forward":[12,10,8,6,2,6,-2,0,0,8,-13,-8,-3,4,4]}},'sol-meridian':{
  // The authored idle and low-run poses extend a lead hand past Sol's torso;
  // keep the separate physics ball at that hand and on the court at contact.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'mist-halo':{
  // Mist's braids trail behind her reach; place the independent ball just
  // ahead of her low dribble hand through both running directions.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'wren-bravado':{
  // His upright receiving hands and low dribble reach both sit ahead of the
  // torso; align the separate physics ball to those authored contact points.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'eden-north':{
  // Eden's tied curls trail behind her lead hand; the ball path follows the
  // receiving stance, low stationary reach and turbo stride through contact.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'raven-lux':{
  // Raven's open lead hand stays ahead of the scarlet/black silhouette;
  // track the separate physics ball through both low dribble cycles.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'thorn-sable':{
  // Keep the game ball beyond Thorn's forward hand through his ready stance,
  // stationary dribble and turbo stride, separate from the drawn sprite.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'kai-suncrest':{
  // Kai's upright receiving pose and reaching dribble hand stay ahead of the
  // sea-green/orange sprite while the ball remains a separate game object.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'talia-kestrel':{
  // Keep Talia's separate ball at her forward hand during upright receive,
  // low dribble and turbo stride without baking it into her sprite.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'detective-halftone':{
  // The separate ball stays ahead of Halftone's steel/black forehand through
  // receiving, stationary dribble and the low turbo transition.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'trace-noire':{
  // Trace's long ponytail remains clear of the separately rendered ball at
  // the lead hand and at the court-level dribble bounce.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'jett-byte':{
  // Jett's empty reaching hands leave room for the separate ball at every
  // cyan/magenta stride and during the low court bounce.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'cass-pixel':{
  // Keep Cass's independent ball path forward of her long high ponytail and
  // outside her lead hand through ball-ready, dribble and turbo poses.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'riff-voltage':{
  // The separate ball stays beyond Riff's forward hand through his
  // ball-ready stance, low dribble and turbo stride.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'fret-nova':{
  // Fret's high ponytail stays clear of the separately rendered ball at her
  // lead hand and at the court-level dribble bounce.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'thorn-script':{
  // Keep the rendered ball in front of Thorn's tattooed lead hand and preserve
  // the low court bounce during his dribble and running dribble.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'nyx-steel':{
  // Nyx's separate ball stays beyond her right-hand reach and outside her
  // long ponytail silhouette through ball-ready and both dribble clips.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'moss-quarry':{
  // Keep the ball ahead of Moss's strong lead hand and visibly low on each
  // stationary and turbo bounce.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'digger-finch':{
  // Keep Digger's long ponytail clear of the separately rendered ball and
  // align its low dribble bounce to her right hand.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'willow-root':{
  // Willow's large high ponytail stays clear of the separately drawn ball;
  // the track follows her right hand through idle-ball and both bounces.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'rowan-bark':{
  // Rowan's separate ball remains ahead of his arm tattoos and reaches court
  // level on both the stationary and turbo dribble cycle.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'nox-striker':{
  // Nox's separate ball stays ahead of his electric-blue uniform and hand.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'viper-veil':{
  // Viper's high ponytail stays behind; her right-hand ball track stays forward.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'moss-granite':{
  // Moss's broad frame and full beard stay clear of the separate ball at his
  // open hand; his low right-hand dribble reaches the court on both loops.
  'idle-ball':{height:[1.1,.82,.68,.94],forward:[9,10,11,10]},
  dribble:{forward:[7,8,9,10,11,11,10,9,8,7]},
  'dribble-run':{forward:[9,10,11,12,13,13,12,11,10,9,9]}
},'thump-alder':{
  // Thump's separate ball follows the forward hand below her rounded hair
  // puffs, with both dribble cycles meeting the court plane at contact.
  'idle-ball':{height:[1.05,.78,.66,.9],forward:[8,9,10,9]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'camden-union':{
  // Camden's separate ball follows the open right hand while staying outside
  // his broad torso; the low hand reaches the court on each dribble cycle.
  'idle-ball':{height:[1.05,.78,.66,.9],forward:[9,10,11,10]},
  dribble:{forward:[7,8,9,10,11,11,10,9,8,7]},
  'dribble-run':{forward:[9,10,11,12,13,13,12,11,10,9,9]}
},'poppy-stitch':{
  // Poppy's ball clears the forward hand and high ponytail; both dribble
  // cycles touch the court at her authored low reach.
  'idle-ball':{height:[1.05,.78,.66,.9],forward:[8,9,10,9]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'draya-staffwind':{
  // Draya's open right hand stays forward of her torso; her long loc ponytail
  // trails behind the ball through both low dribble cycles.
  'idle-ball':{height:[1.05,.78,.66,.9],forward:[8,9,10,9]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[9,9,10,11,12,12,11,10,9,8,8]}
},'kael-rune':{
  // Kael's broader shoulders need a slightly wider forward ball lane. Keep
  // the ball on his right hand and on the court at each authored bounce.
  'idle-ball':{height:[1.1,.82,.68,.94],forward:[9,10,11,10]},
  dribble:{forward:[7,8,9,10,11,11,10,9,8,7]},
  'dribble-run':{forward:[10,10,11,12,13,13,12,11,10,9,9]}
},'lilt-smile':{
  // Lilt's high magenta ponytail trails behind the separate ball. Her low
  // ball-ready stance starts lower, while the open hand stays ahead of her kit.
  'idle-ball':{height:[.92,1.05,.98,1.02],forward:[8,9,10,9]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[9,10,11,12,13,13,12,11,10,9,9]}
},'violet-wink':{
  // Violet's compact, broad-shouldered silhouette needs a forward lane clear
  // of the torso; track the open right hand and keep both bounce anchors low.
  'idle-ball':{height:[1.1,.96,.9,1.02],forward:[9,10,11,10]},
  dribble:{forward:[7,8,9,10,11,11,10,9,8,7]},
  'dribble-run':{forward:[10,11,12,13,14,14,13,12,11,10,10]}
},'fern-howl':{
  // Fern's high teal curls trail behind her right hand; the separate ball
  // stays outside her tall frame and reaches court at both dribble contacts.
  'idle-ball':{height:[1.05,.82,.7,.94],forward:[8,9,10,9]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[9,10,11,12,13,13,12,11,10,9,9]}
},'koa-vale':{
  // Koa's compact, broad shoulders use a slightly wider ball lane while the
  // authored low poses still meet the floor at each bounce anchor.
  'idle-ball':{height:[1.1,.82,.68,.94],forward:[9,10,11,10]},
  dribble:{forward:[7,8,9,10,11,11,10,9,8,7]},
  'dribble-run':{forward:[10,10,11,12,13,13,12,11,10,9,9]}
},'scribble-turner':{
  // Scribble's tall frame and open right palm need a forward reach; the
  // separate ball stays at his hand and touches court on the low poses.
  'idle-ball':{height:[1.05,.84,.72,.94],forward:[9,10,11,10]},
  dribble:{forward:[7,8,9,10,11,11,10,9,8,7]},
  'dribble-run':{forward:[10,10,11,12,13,13,12,11,10,9,9]}
},'palette-spry':{
  // Palette's compact frame keeps the ball clear of her torso at ball-ready
  // and follows her low hand through both stationary and moving bounces.
  'idle-ball':{height:[1.02,.88,.8,.96],forward:[9,10,10,9]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[10,10,11,12,13,13,12,11,10,9,9]}
},'sage-fletch':{
  // Sage's tall frame keeps the separate ball at his open right hand; each
  // low stationary and running bounce reaches the court cleanly.
  'idle-ball':{height:[1.05,.82,.7,.94],forward:[9,10,11,10]},
  dribble:{forward:[7,8,9,10,11,11,10,9,8,7]},
  'dribble-run':{forward:[10,11,12,13,14,14,13,12,11,10,10]}
},'hazel-bloom':{
  // Hazel's compact stance and long curls keep the independent ball clear of
  // her body while the low hand reaches court on both bounce cycles.
  'idle-ball':{height:[1.02,.88,.8,.96],forward:[9,10,10,9]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[10,11,12,13,14,14,13,12,11,10,10]}
},'auric-scale':{
  // Auric's ball stays in front of the reaching hand, clear of his gold trim.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'cinder-royal':{
  // Cinder's long ponytail falls behind; her separate ball follows her hand.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'moth-vale':{
  // Moth's high violet loc ponytail stays clear of the separate game ball;
  // follow her hand through ball-ready, stationary dribble and turbo stride.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'owl-argent':{
  // Owl's separate ball stays in front of his right hand at release and court
  // bounce without overlapping his silver curls or violet uniform.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'sable-regent':{
  // Keep the orange game ball outside Sable's black/crimson silhouette and
  // in front of her reaching hand on ball-ready, dribble and turbo frames.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'marco-vellum':{
  // Marco's low dribble reaches with the lead hand clear of his torso.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]},
  // Keep Marco's separate ball at his hands through the forehead set; it
  // leaves on shoot frame5/tick13, then follows the forward shot arc.
  shoot:{height:[.8,1,1.25,1.5,1.35,1.6,2.1,2.6,2.3,1.2],forward:[3,4,5,5,5,6,9,14,18,22]},
  // Marco gathers at his waist, raises to a chest load, releases in his
  // two-hand drive, then lets the ball separate through follow-through.
  pass:{height:[1,1.05,1.3,1.5,1.6,1.7],forward:[5,6,8,13,15,22]},
  // The overhead pass holds at the raised hands through frame 3/tick 7,
  // then travels away from the high follow-through on Marco's separate track.
  'pass-overhead':{height:[1.05,1.45,1.9,2.05,2.15,2.2],forward:[5,6,8,11,16,22]},
  // Marco releases the behind-the-back pass at frame3/tick7 toward image-left.
  'pass-behind':{height:[1.05,.95,.9,1.25,1.25,1.2],forward:[5,2,-5,-14,-18,-22]},
  // Marco receives on a separate ball track: incoming fingertip contact through tick3,
  // hand catch at frame2/tick4, then secured against the lower sternum.
  receive:{height:[1.3,1.35,1.2,.95],forward:[22,13,4,3]},
  pickup:{height:[0,0,0,.25,.9],forward:[8,8,9,.5,-9]}
},'flint-rooker':{
  // Flint's short-haired lead-hand poses need the separate ball ahead of his
  // charcoal/ember-red body through stationary and turbo dribble cycles.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'ash-harth':{
  // Keep the ball outside Ash's flowing ponytail/body silhouette at the
  // visible lead hand; dribble timing still reaches the court-plane bounce.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'marin-dusk':{
  // Keep the separate ball at Marin's reaching hand through low dribble poses.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'cove-knell':{
  // Cove's lead hand reaches outside the locs and beard through both bounces.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'pixel-o-keeffe':{
  // Keep Pixel's orange game ball at his forward hand between sprite poses.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'fern-tempo':{
  // Fern's high ponytail clears the separate ball at her lead hand in every
  // upright and low dribble pose; the bounce still meets the court plane.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'mira-wavelength':{
  // Keep the game ball in front of Mira's lead hand, clear of her long blue hair.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'azul-voss':{
  // Azul's low stationary and running reaches keep the separate ball forward.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'roxie-coil':{
  // Her forward hand clears the crimson hair and reaches the separate ball.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'vanta-slate':{
  // Vanta's open lead hand stays ahead of his broad shoulders during dribbles.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'sylvie-shutter':{
  // Keep the separate ball in Sylvie's forward hand as her long silver curls
  // trail behind her; her low bounce remains clear of the white/navy uniform.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'noelle-pinstripe':{
  // Noelle's lead hand stays outside the violet loc silhouette through both
  // stationary and running dribbles, with the ball landing at court level.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'cade-brixton':{
  // Keep the game ball ahead of Cade's lead hand through his purple-kit dribbles.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'fenn-static':{
  // Fenn's locs trail behind her lead hand; keep the ball forward and clear.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'ember-rivet':{
  // Keep Ember's ball at the extended hand without burying it in her curls.
  'idle-ball':{height:[1.2,1.5,1.35,1.5],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'bronze-calder':{
  // Bronze's broad stance calls for the same forward hand lane at both speeds.
  'idle-ball':{height:[1.2,1.5,1.35,1.5],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'violet-lorne':{
  // Violet's long ponytail trails behind her chest-level grip; keep the separate ball ahead of both hands.
  'idle-ball':{height:[1.5,1.8,1.65,1.8],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'cassian-quill':{
  // His broader stance uses the same clear forward-hand lane through ball-ready and court bounces.
  'idle-ball':{height:[1.5,1.8,1.65,1.8],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'dorian-mycel':{
  // Authored action ball paths stay separate from Dorian's empty-hand atlases.
  "alley-oop-power":{height:[1,1.1,1.2,1.4,1.7,0.9,1.6,1.9,2.2,1.7,2.5,1.8,1.2,0.7,0.55],forward:[6,8,9,8,7,-3,9,8,11,7,15,12,8,5,6]},
  "alley-oop-reverse":{height:[1.1,1.2,1.4,1.7,2,2.2,2.3,2.1,1.8,2.1,2,1.7,1.2,0.7,0.55],forward:[6.0,8.0,9.0,8.0,8.0,10.0,4.0,-2.0,-4.0,12.0,4.0,10.0,8.0,5.0,6.0]},
  "dunk-360":{height:[1.1,1.2,1.35,1.6,1.9,2.2,2.45,2.5,2.45,1.7,2.2,1.9,1.3,0.8,0.6],forward:[6.0,8.0,7.0,2.0,-3.0,-6.0,-7.0,-5.0,1.0,-2.0,10.0,12.0,8.0,5.0,6.0]},
  "dunk-clutch":{height:[1,0.9,1,1.2,1.6,1.5,1.4,1.35,1.5,1.3,2.2,1.7,1.2,0.7,0.55],forward:[6.0,8.0,9.0,8.0,6.0,1.0,-4.0,-5.0,-2.0,-2.0,11.0,12.0,8.0,5.0,6.0]},
  "dunk-double":{height:[0.95,1.1,1.25,1.5,1.8,2,1.25,0.8,1.4,1.7,2.45,1.8,1.25,0.75,0.55],forward:[6.0,8.0,9.0,8.0,6.0,4.0,2.0,1.0,4.0,1.0,14.0,12.0,9.0,6.0,6.0]},
  "dunk-power":{height:[0.95,1.1,1.2,0.95,1.25,1.55,1.85,2.15,2.3,1.7,2.45,2,1.45,0.7,0.55],forward:[6.0,8.0,10.0,9.0,7.0,6.0,3.0,4.0,8.0,1.0,15.0,12.0,8.0,5.0,6.0]},
  "dunk-reverse":{height:[1.1,1.25,1.4,1.6,2.05,2.3,2.5,2.7,2.6,1.6,2.1,1.9,1.2,0.7,0.55],forward:[6,8,9,3,-2,-5,-7,-8,-7,7,-2,2,8,5,6]},
  "dunk-scythe":{height:[0.95,1.05,1.2,0.85,0.55,0.7,1.0,1.5,2.0,1.6,2.45,1.8,1.1,0.7,0.55],forward:[6.0,8.0,9.0,7.0,3.0,-3.0,-5.0,-2.0,3.0,3.0,14.0,12.0,8.0,5.0,6.0]},
  "dunk-tomahawk":{height:[1.0, 1.15, 1.25, 1.55, 1.8, 2.0, 2.1, 2.35, 2.4, 2.3, 1.3, 1.8, 1.4, 0.7, 0.55],forward:[6.0, 8.0, 9.0, 10.0, 7.0, 4.0, 0.0, -4.0, -5.0, -3.0, 9.0, 6.0, 8.0, 5.0, 6.0]},
  "dunk-windmill":{height:[1.1,1,0.9,0.8,0.75,0.95,1.2,1.7,2.05,1.85,1.8,1.4,1.1,0.75,0.65],forward:[6.0,4.0,-2.0,-7.0,-10.0,-8.0,-3.0,2.0,5.0,3.0,9.0,12.0,8.0,5.0,5.0]},
  "layup":{height:[1.1, 1.25, 1.5, 1.8, 2.1, 2.05, 1.35, 0.8],forward:[6.0, 7.0, 9.0, 11.0, 12.0, 11.0, 9.0, 7.0]},
  "layup-reverse":{height:[1.1,1.2,1.5,1.8,2.0,2.2,1.5,0.8],forward:[6.0,8.0,6.0,-2.0,-3.0,-10.0,7.0,6.0]},
  "pass":{height:[1.15, 1.2, 1.35, 1.6, 1.5, 1.1],forward:[8, 7, 8, 12, 12, 8]},
  "pass-behind":{height:[1.1, 1.0, 0.95, 1.2, 1.1, 0.95],forward:[5.0, 2.0, -5.0, -10.0, -8.0, 4.0]},
  "pass-overhead":{height:[1.1, 1.5, 2.1, 1.95, 1.6, 1.1],forward:[6.0, 7.0, 9.0, 11.0, 9.0, 6.0]},
  "pickup":{height:[1.1, 0.65, 0.3, 0.0, 0.75],forward:[5.0, 7.0, 10.0, 13.0, 8.0]},
  "rebound":{height:[1.1,1.6,2.2,1.5,1.8],forward:[7.0,9.0,11.0,5.0,9.0]},
  "receive":{height:[1.1,1.25,1.1,1.35],forward:[5.0,8.0,3.0,9.0]},
  "shoot":{height:[0.95,1.05,1.25,1.5,1.8,2.05,2.05,1.8,1.35,1.1],forward:[6.0,7.0,8.0,9.0,10.0,-1.0,10.0,8.0,6.0,5.0]},
  "steal":{height:[1.15, 0.95, 0.65, 0.4, 0.7, 1.0, 1.2, 1.1],forward:[8.0, 10.0, 12.0, 13.0, 14.0, 14.0, 12.0, 9.0]},
  // Low locomotion paths align with the five authored extension poses.
  'idle-ball':{height:[1.15,1.1,1.15,1.1],forward:[8,9,9,8]},
  dribble:{height:[1.2,1.05,.8,.55,.25,0,.25,.55,.85,1.1],forward:[8,9,10,12,13,13,12,11,9,8]},
  'dribble-run':{height:[1.2,1.05,.8,.55,.25,0,.25,.55,.85,1.05,1.2],forward:[12,13,14,15,16,16,15,14,13,12,12]}},'luca-velori':{
  // Luca's longer stance needs the ball out in front of his beard and torso.
  'idle-ball':{height:[1.15,1.1,1.15,1.1],forward:[9,10,11,10]},
  dribble:{height:[1.2,1.05,.8,.55,.25,0,.25,.55,.85,1.1],forward:[8,9,10,12,13,13,12,11,9,8]},
  'dribble-run':{height:[1.2,1.05,.8,.55,.25,0,.25,.55,.85,1.05,1.2],forward:[12,13,14,15,16,16,15,14,13,12,12]}
},keeg:{
  // The separate ball follows Keeg's empty hands through his compact gather,
  // clear-hat release, and high follow-through; the hat is not a hand target.
  shoot:{height:[.95,1.05,1.25,1.5,1.8,2.05,2.05,1.8,1.35,1.1],forward:[6,7,8,9,10,11,10,8,6,5]},
  // Chest-pass delivery reaches both extended hands at its tick-5 release.
  pass:{height:[1,1.05,1.3,1.55,1.5,1.1],forward:[5,6,8,13,12,8]},
  // The overhead lob rises clear of Keeg's enormous hat to his raised hands.
  'pass-overhead':{height:[1.2,1.4,2,2.55,2.5,1.3],forward:[6,7,8,10,11,7]},
  // His behind-the-back release cuts low behind his hip before recovery.
  'pass-behind':{height:[1,1.1,.85,1.1,1.25,1.1],forward:[5,6,-5,-12,-8,5]},
  // The separate ball meets Keeg's open hands at chest height on catch frame2.
  receive:{height:[1.25,1.4,1.5,1.4],forward:[8,13,15,11]},
  // His long human reach brings the separate ball down to his fingers at floor contact.
  pickup:{height:[1,.6,.3,0,.7],forward:[6,9,14,16,10]},
  // Keeg reaches beside the tall hat for the descending rebound, then secures it at his chest.
  rebound:{height:[1.1,1.6,2.05,2.4,1.45],forward:[5,8,9,11,7]},
  // The separate ball meets Keeg's open hand on the low forward steal swipe,
  // then returns toward his chest as he closes and recovers.
  steal:{height:[1.05,1,.85,.72,.85,1,1.15,1.1],forward:[6,9,12,14,12,9,7,6]},
  // Keeg's separate layup ball rises beside the tall hat to his right hand,
  // meets the release pose, and leaves on the shared tick-10 marker.
  layup:{height:[1.05,1.2,1.45,2.15,2.4,2.25,1.55,1.05],forward:[6,7.5,9,12,14,12,8,6]},
  // The reverse layup rotates the far-side hand behind Keeg's shoulder. Keep
  // the separate ball at that raised hand through frame5/tick12, then release.
  'layup-reverse':{height:[1.05,1.25,1.3,1.85,2.15,2.15,1.4,.6],forward:[6,8,6,6,3,2,7,6]},
  // The 360 dunk keeps Keeg's separate ball beside his turning hand through
  // the airborne spin, then meets the extended palm at the tick21 release.
  'dunk-360':{height:[.95,1.1,1.25,1.4,1.7,2,2.2,2.4,2.6,2.5,1.7,1.8,1.45,.7,.55],forward:[6,8,4,0,-4,-8,-6,-3,2,5,8,10,8,5,6]},
  // Keeg's power dunk tracks the separate ball past his full hat and into the
  // extended shooting hand for the shared frame10/tick21 release.
  'dunk-power':{height:[.95,1.1,1.2,.95,1.25,1.55,1.85,2.15,2.3,2.4,2.45,2,1.45,.7,.55],forward:[6,8,10,9,7,6,3,4,8,13,15,12,8,5,6]},
  // Windmill circles low behind Keeg's hip before rising over his shoulder;
  // the separate ball returns to his hand for the shared tick21 release.
  'dunk-windmill':{height:[.95,1.15,1.05,.8,1.0,1.15,1.4,2.15,2.6,2.6,1.6,1.8,1.3,.7,.55],forward:[6,8,3,-2,-7,-8,-5,-2,-8,-5,8,12,8,5,6]},
  // Tomahawk cocks the separate ball behind Keeg's crown, then meets his
  // raised hand at the single frame10/tick21 release, clear of the hat.
  'dunk-tomahawk':{height:[.95,1.1,1.25,1.7,1.9,2.05,2.2,2.45,2.4,2.35,1.5,2,1.4,.7,.55],forward:[6,8,4,-2,-10,-7,-8,-5,12,2,8,6,8,5,6]},
  // Keeg's two-pump dunk returns the separate ball to his chest after pump
  // one, then tracks his higher second reach to the shared tick-21 release.
  'dunk-double':{height:[.95,1.1,1.25,1.55,2.15,2.9,1.55,1.75,2.35,2.9,2.35,2,1.15,.85,.65],forward:[7,5,3,-4,-8,-1,2,5,4.5,12.5,13,7.5,4,3,3]},
  // Keeg's two-hand clutch carries the separate ball overhead and releases
  // from his empty-palmed frame 10 at the shared tick21 dunk anchor.
  'dunk-clutch':{height:[.95,1.1,1.25,1.6,2,2.35,2.5,2.65,2.75,2.65,2.45,2,1.4,.7,.55],forward:[6,7,6,4,2,0,-1,0,1,6,12,10,8,5,6]},
  // Keeg's scythe gathers at the waist, sweeps low behind the hip, reverses
  // across his torso, then rises beside the hat to one open-palm tick21 release.
  // The ball remains a separate athlete-specific sprite; after release its
  // flight is simulated independently of Keeg's follow-through poses.
  'dunk-scythe':{height:[1.005,1.119,.975,.718,.804,.689,1.119,1.981,2.442,2.01,2.01,2,1.35,.7,.55],forward:[9.502,6.576,.365,-11.329,-12.429,-12.429,-6.943,8.405,17.888,9.136,9.136,10,8,5,6]},
  // Keeg's alley-oop lob reaches his open hand at pose05/tick10, gathers to
  // his chest, then follows the raised/cocked hand through tick20. Pose10 at
  // tick21 is the sole release; the dunk simulation places the ball at rim.
  'alley-oop-power':{height:[1.407,1.752,2.412,2.441,2.498,2.039,1.522,2.096,2.297,2.125,2.125,2.326,1.637,1.034,1.005],forward:[11.695,9.867,7.309,9.502,9.867,9.867,2.924,7.675,8.771,5.482,5.482,9.867,6.578,.365,0]},
  // The reverse lob catches between Keeg's empty hands, sweeps behind his hip,
  // then stays at his image-right cocked hand through tick20 and the sole tick21 release.
  'alley-oop-reverse':{height:[1.22,1.59,2.24,1.82,2.12,1.46,1.12,1.82,2.06,1.75,2.24,1.1,.86,.42,.7],forward:[5.85,8.77,5.12,8.77,12.43,7.31,-8.04,7.31,11.70,12.06,12.43,11.70,4.02,-5.12,-1.46]},
  // Reverse dunk carries the separate ball behind Keeg's shoulder and hat,
  // then releases from the far side at the shared frame10/tick21 anchor.
  'dunk-reverse':{height:[.95,1.1,1.25,1.5,1.8,1.4,2.4,2.55,2.1,2.1,1.2,2.1,1.45,.7,.55],forward:[6,8,4,-2,-5,-7,-9,-8,-6,-4,12,4,8,5,6]}
},paprika:{
  receive:{height:[.35,.5,.5,.35],forward:[12,13,14,12]},
  pickup:{height:[.2,.15,.05,0,.55],forward:[12,13,14,14,7]},
  // Follow the airborne near forepaw/muzzle on the tick-5 rebound grab.
  rebound:{height:[.65,.9,1.1,1.15,.55],forward:[6,8,10,12,8]},
  // A tiny quadruped reaches the power-dunk ball with her forward muzzle and
  // near forepaw; do not reuse the tall human hand track above.
  'dunk-power':{height:[.55,.35,.6,.9,1,1.1,1.4,1.65,1.7,1.8,1.6,1.2,.8,.4,.55],forward:[7,8,9,11,12,13,14,16,17,18,16,14,11,8,7]},
  // Her windmill circles behind the chest and under the belly before rising.
  // Keep the ball close to the short forepaw/muzzle and fox-sized body.
  'dunk-windmill':{height:[.55,.45,.3,.8,.25,.15,.45,.75,1.35,1.5,1.45,1.2,.85,.45,.45],forward:[7,2,-2,-6,-8,-3,2,8,12,10,12,9,7,6,6]},
  // The reverse turns Paprika's shoulders away from the rim and carries the
  // separate ball behind her crown. Keep the path fox-sized and near her
  // short forepaw/muzzle, with no human-hand reach.
  'dunk-reverse':{height:[.55,.45,.7,1.1,1.6,2.2,2.5,2.8,2.7,2.5,2.3,1.8,1.2,.6,.45],forward:[7,6,4,1,-1,-3,-4,-5,-5,-4,-4,-6,3,6,7]},
  // The 360 spin carries the ball around Paprika's compact turning body:
  // forward on approach, behind her during the back views, then forward again.
  'dunk-360':{height:[.55,.45,.7,1.1,1.6,2.2,2.6,2.8,2.6,2.5,2.3,1.8,1.2,.6,.45],forward:[7,6,4,1,-1,-3,-4,-2,1,5,7,8,5,6,7]},
  // Tomahawk cocks the ball behind Paprika's ear, then snaps it forward/down.
  'dunk-tomahawk':{height:[.55,.45,.7,.9,1.4,1.7,1.85,2.1,1.8,1.4,2.3,1.4,1.1,.6,.45],forward:[7,6,4,1,-2,-4,-5,-5,-3,2,8,6,4,6,7]},
  // Double pumps rise, return to the muzzle, then rise again for release.
  'dunk-double':{height:[.55,.45,.7,1.4,2.2,1,.8,1.7,2.6,2.3,2.3,1.2,.8,.5,.45],forward:[7,6,4,5,7,3,1,4,6,9,10,7,4,6,7]},
  // Clutch keeps both paws close to the chest before one compact release.
  'dunk-clutch':{height:[.55,.45,.7,1,1.3,1.5,1.4,1.5,1.7,2.1,2.3,1.2,.8,.5,.45],forward:[7,6,4,0,-3,-5,-5,-4,0,5,8,6,4,6,7]},
  // Scythe moves low/back, then on a diagonal up and forward to release.
  'dunk-scythe':{height:[.55,.45,.7,.9,1.2,.8,1.5,2,2.5,2.1,2.3,1.2,.8,.5,.45],forward:[7,6,4,0,-4,-6,-3,0,6,9,8,6,4,6,7]},
  // The lob catch reaches Paprika's short near forepaw beside the muzzle,
  // then gathers to her chest before the compact overhead power finish.
  'alley-oop-power':{height:[.55,.55,.65,.9,1.1,1.2,1.35,1.5,1.75,2,1.8,1.4,1,.6,.55],forward:[7,8,9,10,11,10.5,9,10,12,13,14,12,9,7,7]},
  // The reverse lob uses the same fox-sized catch, then carries behind the
  // crown as Paprika turns her shoulders away from the rim.
  'alley-oop-reverse':{height:[.55,.55,.65,.9,1.1,1.3,1.35,1.5,1.55,1.8,2.3,1.8,1.2,.6,.55],forward:[7,8,9,10,11,10,8,5,2,-2,-4,-3,3,6,7]},
  shoot:{height:[0,0,.48,.69,.69,.99,.96,.3,0,0],forward:[11.4,10.6,10.3,11.4,10.3,10.5,8.8,10.8,11.4,11]},
  pass:{height:[0,.3,.75,.52,.2,.1],forward:[14.8,13.3,14.8,14.8,15.2,14.8]},
 'pass-overhead':{height:[0,.2,.65,1.1,1.25,.35],forward:[10,11,13,15,17,11]},
 'pass-behind':{height:[0,.15,.35,.85,.65,.1],forward:[10,7,2,-12,-12,5]},
  // Layup tracks follow Paprika's muzzle/near forepaw through her short leap;
  // frame 4 is the high airborne release pose.
  layup:{height:[.3,.35,.35,.9,1.0,.95,.65,.3],forward:[4,7,5,7,10,8,9,5]},
  // Reverse release holds at frame 5 / tick 12 after the fox twists over her shoulder.
  'layup-reverse':{height:[.3,.35,.45,.9,1.0,1.0,.6,.3],forward:[4,6,5,8,9,10,6,5]},
  // The low steal reach follows Paprika's near forepaw; the separate ball
  // stays at paw height through the frame-3 contact marker at tick 5.
  steal:{height:[.55,.5,.4,.25,.3,.4,.5,.55],forward:[7,8,10,13,11,9,8,7]},
  'idle-ball':{height:[.55,.5,.45,.5],forward:[7,7.5,7,6.5]},
  dribble:{height:[.55,.5,.4,.25,.1,0,.1,.25,.4,.55],forward:[7,7.5,8,8.5,9,9,8.5,8,7.5,7]},
  'dribble-run':{height:[.5,.45,.35,.2,.1,0,.1,.2,.35,.45,.5],forward:[7.5,8,8.5,9,9,9,8.5,8,7.5,7,7.5]}
},'6foot10':{
  // His long reach keeps the ball in front of the forward hand without
  // changing the court-level bounce timing shared by the animation clip.
  'idle-ball':{height:[1.25,1.15,1.1,1.2],forward:[12,13,13,12]},
  dribble:{height:[1.2,1.05,.8,.55,.25,0,.25,.55,.85,1.1],forward:[10,11,12,13,13,12,11,10,9,10]},
  'dribble-run':{height:[1.2,1.05,.8,.55,.25,0,.25,.55,.85,1.05,1.2],forward:[12,13,14,15,15,14,13,12,11,12,13]}
},avek:{
  // Long armored arms reach forward; the low pose remains aligned with the
  // court bounce, while brighter follow-through frames bring the hand back up.
  shoot:{forward:[4,5,6,7,7,7,8,7,5,4]},
  'idle-ball':{height:[1.2,1.25,1.15,1.1],forward:[13,14,13,12]},
  dribble:{height:[1.2,1.05,.8,.55,.25,0,.25,.55,.85,1.1],forward:[10,11,12,13,14,14,13,12,11,10]},
  'dribble-run':{height:[1.2,1.05,.8,.55,.25,0,.25,.55,.85,1.05,1.2],forward:[14,15,16,17,17,16,15,14,13,14,15]}
},jragena:{
  // Her winged silhouette needs the game ball at her visible forward hands,
  // with the low dribble returned to the floor independently of wing height.
  shoot:{height:[1.5,1.6,1.7,1.8,1.8,1.8,1.7,1.5,1.2,1],forward:[4,5,6,7,7,6,6,5,4,3]},
  'idle-ball':{height:[1.1,1.15,1.25,1.2],forward:[7,10,12,11]},
  dribble:{height:[1.2,1.05,.8,.55,.25,0,.25,.55,.85,1.1],forward:[8,10,12,14,14,13,12,11,10,9]},
  'dribble-run':{height:[1.2,1.05,.8,.55,.25,0,.25,.55,.85,1.05,1.2],forward:[10,12,14,15,16,16,15,14,13,12,11]}
},'dragon-queen':{
  // The dragon's ball is controlled just ahead of her muzzle/forepaw, not at
  // a human hand near the torso. Low dribble frames touch the court plane.
  shoot:{height:[1.35,1.4,1.55,1.7,1.8,1.8,1.75,1.5,1.35,1.3],forward:[15,17,20,22,22,20,19,18,16,15]},
  'idle-ball':{height:[1.35,1.2,1.1,1.3],forward:[23,25,26,24]},
  dribble:{height:[.95,.8,.6,.35,.1,0,.25,.55,.8,.95],forward:[18,20,22,24,25,24,22,20,18,19]},
  'dribble-run':{height:[.9,.75,.5,.25,.1,0,.2,.45,.7,.85,.95],forward:[20,22,24,26,26,24,23,22,20,21,22]}
},dea:{
  // Keep the separate ball on her raised leading hand and clear of her face
  // throughout the human jump-shot release and follow-through.
  shoot:{forward:[5,6,8,10,12,12,11,9,7,6]}
},lula:{
  // Her leading elf hand carries the separate ball through the leafy-kit shot.
  shoot:{forward:[4,5,6,7,7,7,8,7,5,4]}
},suga:{
  // Suga controls the game ball with a forward coil and muzzle; his snake
  // rig has no hands. Keep the bounce on the lower coil frames.
  shoot:{height:[1,1.3,1.7,2.1,2.3,2.4,2.2,1.8,1.3,1],forward:[4,5,6,7,7,5,6,7,6,5]},
  'idle-ball':{height:[.7,.65,.6,.65],forward:[16,17,18,17]},
  dribble:{height:[.7,.6,.45,.3,.15,0,.15,.3,.5,.65],forward:[14,15,16,18,19,20,20,19,17,16]},
  'dribble-run':{height:[.8,.65,.5,.35,.15,0,.2,.4,.55,.7,.8],forward:[18,18,19,20,21,22,22,21,20,19,18]}
},'gb-design':{
  // Keep the ball visibly in front of the jaguar's hands in both directions.
  'idle-ball':{height:[1.1,1.05,1.1,1.05],forward:[9,10,10,9]},
  dribble:{height:[1.2,1.05,.8,.5,.2,0,.25,.6,.95,1.2],forward:[8,9,10,11,12,12,11,10,9,8]},
  'dribble-run':{height:[1.2,1.1,.85,.55,.25,0,.25,.55,.85,1.1,1.2],forward:[9,10,11,12,13,13,12,11,10,9,9]}
},'pack-mama':{
  // Follow her open forward hand in the green hooded kit; the crouched sixth
  // pose is the court contact for both stationary and running dribbles.
  shoot:{forward:[5,6,7,8,10,11,11,10,8,6]},
  'idle-ball':{height:[1.15,1.2,1.1,1.15],forward:[10,11,10,9]},
  dribble:{height:[1.1,.95,.7,.45,.18,0,.2,.5,.85,1.1],forward:[8,9,10,11,12,12,11,10,9,8]},
  'dribble-run':{height:[1.15,1.05,.8,.55,.25,0,.25,.55,.85,1.05,1.15],forward:[11,12,13,14,15,15,14,13,12,11,11]}
},quirky:{
  // His unusually long orangutan arms carry the ball farther forward than a
  // human hand. The low crouch still sends it to the court plane on contact.
  shoot:{forward:[5,7,8,10,12,14,13,10,8,6]},
  'idle-ball':{height:[1.2,1.15,1.1,1.2],forward:[11,12,11,10]},
  dribble:{height:[1.2,1,.75,.5,.2,0,.2,.5,.9,1.15],forward:[11,13,14,15,16,16,15,14,13,11]},
  'dribble-run':{height:[1.2,1.05,.8,.55,.25,0,.25,.55,.85,1.05,1.2],forward:[14,15,16,17,18,18,17,16,15,14,14]}
}};
function sampleFrameScalar(key, elapsedTicks, property, fallback,athleteId){
  const c=animationClips[key],duration=animationDuration(key),sequence=sequenceFor(c);
  const track=athleteBallTracks[athleteId]?.[key]?.[property==='ballHeight'?'height':'forward'];
  const elapsed=Math.max(0,Number.isFinite(elapsedTicks)?elapsedTicks:0);
  let tick=c.loop?elapsed%duration:Math.min(elapsed,duration-1);
  for(let index=0;index<sequence.length;index++){
    const frame=c.frames[sequence[index]];
    if(tick<frame.duration){
      const nextIndex=sequence[index+1]??(c.loop?sequence[0]:sequence[index]);
      const value=track?.[sequence[index]]??frame[property]??fallback,next=track?.[nextIndex]??c.frames[nextIndex][property]??value;
      return value+(next-value)*tick/frame.duration;
    }
    tick-=frame.duration;
  }
  return fallback;
}
export function sampleBallHeight(key, elapsedTicks=0,athleteId){return sampleFrameScalar(key,elapsedTicks,'ballHeight',1.1,athleteId);}
export function sampleBallForward(key, elapsedTicks=0,athleteId){return sampleFrameScalar(key,elapsedTicks,'ballForward',1.5,athleteId);}
// Convert the attached hand's rendered height to the free-flight elevation.
// Above the rim, flight is compressed; an attached ball follows the player's
// uncompressed jump. Match both mappings exactly at the release boundary.
export function flightHeightFromHand(handHeight,jumpHeight=0){
  const h=Math.max(0,handHeight),pixels=(h<=3?h*28:84+(h-3)*3)+jumpHeight*7;
  return pixels<=84?pixels/28:3+(pixels-84)/3;
}
