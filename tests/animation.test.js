import {test} from 'node:test';
import assert from 'node:assert/strict';
import {scratchTiming} from '../src/cat-actions.js';
import {frameIndex} from '../src/paint.js';
test('one visible claw contact per second throughout the final minute',()=>{for(let i=0;i<60;i++){const s=scratchTiming(60-i-.4,300);assert.equal(s.completed,i);assert.equal(s.contact,true);assert.ok(s.progress>0&&s.progress<1);assert.equal(s.frame,i===59?8:9);assert.equal(scratchTiming(60-i-.8,300).contact,i===59);}assert.equal(scratchTiming(0,300).completed,60);});
test('short timers scratch only available seconds and added time clears scratch history',()=>{assert.equal(scratchTiming(1.6,2).completed,0);assert.equal(scratchTiming(.6,2).completed,1);assert.equal(scratchTiming(0,2).completed,2);assert.equal(scratchTiming(120,300).completed,0);});
test('pose sequences use bounded discrete painted frames and hold the final peek pose',()=>{const frames=new Set();for(let i=0;i<240;i++)frames.add(frameIndex(i/240));assert.equal(frames.size,24);assert.equal(frameIndex(1,{loop:false}),23);assert.equal(frameIndex(9,{loop:false}),23);assert.equal(frameIndex(-2,{loop:false}),0);});

test('the last claw stroke stays in contact until the glass-break deadline',()=>{const s=scratchTiming(.01,300);assert.equal(s.contact,true);assert.ok(s.progress>.98);assert.ok(s.frame>=12);});
