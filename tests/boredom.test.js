import {test} from 'node:test';
import assert from 'node:assert/strict';
import {boredMoment,diversions} from '../src/boredom.js';
test('quiet-minute diversions rotate without adjacent repeats and cover all 24 actions',()=>{
 for(const seed of [0,42,12345,0x7fffffff]){const types=[];for(let minute=1;minute<=48;minute++){
  const states=Array.from({length:600},(_,i)=>boredMoment({seed,minute,age:i/10})).filter(Boolean);assert.ok(states.length>=80&&states.length<=100);assert.equal(new Set(states.map(s=>s.type)).size,1);types.push(states[0].type);
 }for(let i=1;i<types.length;i++)assert.notEqual(types[i],types[i-1]);assert.deepEqual(new Set(types.slice(0,24)),new Set(diversions));}
});
test('short intervals skip a diversion rather than interrupting the next painting deadline',()=>{
 for(let span=0;span<=60;span++)for(let minute=1;minute<=8;minute++)for(let age=0;age<60;age+=.25){const state=boredMoment({seed:9,minute,age,span});if(state){assert.ok(state.start>=17);assert.ok(state.start+state.duration+3<=span);assert.ok(age<state.start+state.duration);}}
});
test('diversions are deterministic under seeking, pausing, and out-of-order evaluation',()=>{
 const args={seed:121,minute:5,age:25};const expected=boredMoment(args);boredMoment({...args,age:32});boredMoment({...args,minute:8,age:20});assert.deepEqual(boredMoment(args),expected);
});

test('the diversion catalogue contains the four original and twenty additional distinct routines',()=>{assert.equal(diversions.length,24);assert.equal(new Set(diversions).size,24);for(const original of ['watch','stretch','yoga','snack'])assert.ok(diversions.includes(original));});
