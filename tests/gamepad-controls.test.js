import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultGamepadButtons,normalizeGamepadButtons,readGamepadActions,readGamepadMovement} from '../src/input/gamepad-controls.js';

function gamepad(buttonCount=16){return {axes:[0,0],buttons:Array.from({length:buttonCount},()=>({pressed:false,value:0}))};}

test('default and restored button maps retain standard south/west/trigger/start controls',()=>{
 assert.deepEqual(normalizeGamepadButtons(null),defaultGamepadButtons);
 assert.deepEqual(normalizeGamepadButtons({shoot:3,pass:1,turbo:6,pause:8}),{shoot:3,pass:1,turbo:6,pause:8});
});

test('custom digital and analog gamepad buttons produce the selected actions',()=>{
 const pad=gamepad();pad.buttons[4].pressed=true;pad.buttons[6].value=.4;
 assert.deepEqual(readGamepadActions(pad,{shoot:4,pass:1,turbo:6,pause:9}),{shoot:true,pass:false,turbo:true,pause:false});
});

test('invalid saved button indexes use defaults and short gamepads never throw',()=>{
 assert.deepEqual(normalizeGamepadButtons({shoot:22,pass:-1,turbo:1.5,pause:'9'}),defaultGamepadButtons);
 assert.deepEqual(readGamepadActions(gamepad(2),{shoot:10,pass:11,turbo:12,pause:13}),{shoot:false,pass:false,turbo:false,pause:false});
});

test('gamepad movement reads D-pad buttons when the stick is centered',()=>{
 const pad=gamepad();pad.buttons[14].pressed=true;pad.buttons[13].value=1;
 assert.deepEqual(readGamepadMovement(pad),{x:-1,y:1});
});

test('analog stick movement takes priority while D-pad movement remains available',()=>{
 const pad=gamepad();pad.axes=[.7,-.55];pad.buttons[14].pressed=true;
 assert.deepEqual(readGamepadMovement(pad),{x:.7,y:-.55});
});
