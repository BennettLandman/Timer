// One short diversion per full minute, away from the painting deadlines.
// A shuffled deck varies between timers while poses remain seek/pause safe.
export const diversions=['watch','stretch','yoga','snack'];
const duration={watch:8.5,stretch:9,yoga:10,snack:9};
function hash(value){value=Math.imul(value^(value>>>16),0x45d9f3b);value=Math.imul(value^(value>>>16),0x45d9f3b);return (value^(value>>>16))>>>0;}
function deck(seed){const result=[...diversions];for(let i=result.length-1;i>0;i--){const j=hash(seed+i)%(i+1);[result[i],result[j]]=[result[j],result[i]];}return result;}
export function boredMoment({seed,minute,age,span=60}){
 const type=deck(seed)[((minute%4)+4)%4],start=17+hash(seed^minute)%10,length=duration[type];
 // A short first interval and the last minute are reserved for clock work.
 if(start+length+3>span||age<start||age>=start+length)return null;
 const local=age-start;
 return {type,local,duration:length,start};
}

export function boredWeight(moment){
 if(!moment)return 0;
 const smooth=value=>{const t=Math.max(0,Math.min(1,value));return t*t*t*(t*(t*6-15)+10);};
 return smooth(moment.local/1.6)*(1-smooth((moment.local-moment.duration+1.8)/1.8));
}
