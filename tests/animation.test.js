import {test} from 'node:test';
import assert from 'node:assert/strict';
import {scratchTiming,scratchPath,scratchProgress} from '../src/cat-actions.js';
test('one claw contact removes each second mark around the entire rim',()=>{for(let i=0;i<60;i++){const s=scratchTiming(60-i-.4,300);assert.equal(s.completed,i);assert.equal(s.index,59-i);assert.equal(s.contact,true);assert.ok(s.progress>0&&s.progress<1);assert.equal(scratchTiming(60-i-.8,300).contact,i===59);const path=scratchPath(i,225);assert.ok(Math.abs(Math.hypot(path.start.x,path.start.y)-216)<1e-8);assert.ok(Math.abs(Math.hypot(path.end.x,path.end.y)-189)<1e-8);}assert.equal(scratchTiming(0,300).completed,60);});
test('short timers scratch only available seconds and added time clears scratch history',()=>{assert.equal(scratchTiming(1.6,2).completed,0);assert.equal(scratchTiming(.6,2).completed,1);assert.equal(scratchTiming(0,2).completed,2);assert.equal(scratchTiming(120,300).completed,0);});
test('the last claw stroke stays in contact until the glass-break deadline',()=>{const s=scratchTiming(.01,300);assert.equal(s.contact,true);assert.ok(s.progress>.98);});

test('seconds run counter-clockwise from 59 through zero and remove only passed marks',()=>{
 let angle;
 for(let elapsed=0;elapsed<60;elapsed++){
  const state=scratchTiming(59.6-elapsed,300),path=scratchPath(state.index,225);
  if(angle!==undefined)assert.ok(Math.abs(path.angle-angle+Math.PI/30)<1e-8);
  angle=path.angle;assert.equal(scratchProgress(state.index,state),state.progress);
  for(let mark=0;mark<60;mark++)if(mark!==state.index)assert.equal(scratchProgress(mark,state),mark>state.index?1:0);
 }
 const short=scratchTiming(1.6,2);assert.equal(short.index,1);assert.equal(scratchTiming(.6,2).index,0);assert.equal(scratchProgress(59,short),0);
});
