export const defaultGamepadButtons = Object.freeze({shoot:2,pass:0,turbo:7,pause:9});
export const gamepadButtonLabels = Object.freeze([
 'South face (A / Cross)','East face (B / Circle)','West face (X / Square)','North face (Y / Triangle)',
 'Left bumper (LB / L1)','Right bumper (RB / R1)','Left trigger (LT / L2)','Right trigger (RT / R2)',
 'Back / Select','Start','Left stick click','Right stick click'
]);

export function normalizeGamepadButtons(value){
 return Object.fromEntries(Object.entries(defaultGamepadButtons).map(([action,fallback])=>{
  const button=value?.[action];
  return [action,Number.isInteger(button)&&button>=0&&button<gamepadButtonLabels.length?button:fallback];
 }));
}

function buttonPressed(gamepad,index){
 const button=gamepad?.buttons?.[index];
 return Boolean(button&&(button.pressed||Number(button.value)>.25));
}

export function readGamepadActions(gamepad,mapping=defaultGamepadButtons){
 const buttons=normalizeGamepadButtons(mapping);
 return Object.fromEntries(Object.entries(buttons).map(([action,index])=>[action,buttonPressed(gamepad,index)]));
}

export function readGamepadMovement(gamepad,deadzone=.18){
 const axisX=Number.isFinite(gamepad?.axes?.[0])?gamepad.axes[0]:0;
 const axisY=Number.isFinite(gamepad?.axes?.[1])?gamepad.axes[1]:0;
 const x=Math.abs(axisX)>deadzone?axisX:Number(buttonPressed(gamepad,15))-Number(buttonPressed(gamepad,14));
 const y=Math.abs(axisY)>deadzone?axisY:Number(buttonPressed(gamepad,13))-Number(buttonPressed(gamepad,12));
 return {x,y};
}
