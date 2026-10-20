const BASS_MIDI=[36,36,43,36,41,41,43,41,34,34,38,34,36,36,38,36];
const LEAD_MIDI=[72,null,76,79,null,76,74,null,67,null,71,74,null,71,69,null];
const KICKS=new Set([0,6,8,14]),SNARES=new Set([4,12]);
const midiHz=note=>440*Math.pow(2,(note-69)/12);

export const musicPatternLength=16;
export function musicStep(position){
  const step=((Math.trunc(position)%musicPatternLength)+musicPatternLength)%musicPatternLength;
  return {bassHz:midiHz(BASS_MIDI[step]),leadHz:LEAD_MIDI[step]===null?null:midiHz(LEAD_MIDI[step]),kick:KICKS.has(step),snare:SNARES.has(step)};
}
