import {test} from 'node:test';
import assert from 'node:assert/strict';
import {activities,activityDetails,activityDeck,mindfulnessMoment,activityWeight,breathCycle,sunriseProgress,sunrisePalette} from '../src/mindfulness.js';
test('forty activities cover breathing, standing, sitting, floor and training practice',()=>{
 assert.equal(new Set(activities).size,40);
 for(const [group,count] of [['breathing',4],['standing',12],['sitting',10],['floor',8],['practice',6]])assert.equal(Object.values(activityDetails).filter(d=>d.group===group).length,count);
 for(const type of ['waxOn','waxOff','paintFence','sandFloor','paintHouse','jacket'])assert.ok(activities.includes(type));
 assert.ok(!activities.includes('namaste'),'Closing must never be randomly selected');
});
test('each shuffled deck covers the collection once, with seek-safe schedules between painting',()=>{
 const orders=new Set();for(const seed of [0,42,12345,0x7fffffff]){
  const deck=activityDeck(seed);assert.deepEqual(new Set(deck),new Set(activities));orders.add(deck.join(','));
  for(let minute=0;minute<20;minute++)for(const [age,slot]of [[12,0],[37,1]]){
   const args={seed,time:minute*60+age,age};assert.equal(mindfulnessMoment(args).type,deck[minute*2+slot]);assert.deepEqual(mindfulnessMoment(args),mindfulnessMoment(args));
  }
 }assert.equal(orders.size,4);
});
test('short intervals skip activities and transition weights return exactly to idle',()=>{
 for(let span=0;span<=60;span++)for(let age=0;age<60;age+=.25){const moment=mindfulnessMoment({seed:9,time:age,age,span});if(moment){assert.ok(moment.start>=8);assert.ok(moment.start+moment.duration+2<=span);}}
 for(const type of activities)for(const local of [0,20])assert.equal(activityWeight({type,local,duration:20}),0);
});
test('breathing is continuous and unhurried, and sunrise reaches both endpoints',()=>{
 for(const type of activities.slice(0,4)){let last=breathCycle(type,0);for(let time=.01;time<40;time+=.01){const value=breathCycle(type,time);assert.ok(value>=0&&value<=1);assert.ok(Math.abs(value-last)<.01);last=value;}}
 assert.equal(sunriseProgress(300,300),0);assert.equal(sunriseProgress(0,300),1);assert.equal(sunriseProgress(500,300),0);
 for(let p=0;p<=1;p+=.001){const a=sunrisePalette(p),b=sunrisePalette(Math.min(1,p+.001));for(const key of ['top','middle','horizon'])for(const offset of [1,3,5])assert.ok(Math.abs(parseInt(a[key].slice(offset,offset+2),16)-parseInt(b[key].slice(offset,offset+2),16))<=2);}
 assert.notEqual(sunrisePalette(0).top,sunrisePalette(1).top);
});
