// One short diversion per full minute, away from the painting deadlines.
// A shuffled deck varies between timers while poses remain seek/pause safe.
export const diversionDetails=Object.fromEntries([
 ['watch','The wristwatch',8.5],['stretch','A long stretch',9],['yoga','Very serious yoga',10],['snack','A tiny snack',9],
 ['yawn','A discreet yawn',9],['nap','Forty tiny winks',10],['sneeze','The almost-sneeze',9],['earScratch','That itchy ear',9],
 ['noseItch','An itchy nose',8.5],['beret','Straightening the beret',9],['whiskers','Whisker maintenance',9],['manicure','Checking the claws',9],
 ['fingerCount','Counting on its claws',9],['shrug','Who knows?',8.5],['conductor','An imaginary orchestra',9],['mime','An invisible wall',9],
 ['lookout','Looking for the bell',9],['salute','Reporting for duty',8.5],['detective','A tiny investigation',10],['tea','A little tea break',9.5],
 ['book','One more page',10],['feather','A suspicious feather',9],['bow','A tiny curtain call',9],['ukulele','A silent ukulele solo',10]
].map(([type,label,duration])=>[type,{label,duration}]));
export const diversions=Object.keys(diversionDetails);
function hash(value){value=Math.imul(value^(value>>>16),0x45d9f3b);value=Math.imul(value^(value>>>16),0x45d9f3b);return (value^(value>>>16))>>>0;}
function deck(seed){const result=[...diversions];for(let i=result.length-1;i>0;i--){const j=hash(seed+i)%(i+1);[result[i],result[j]]=[result[j],result[i]];}return result;}
export function diversionPlan({seed,minute}){
 const type=deck(seed)[((minute%diversions.length)+diversions.length)%diversions.length];
 return {type,start:17+hash(seed^minute)%10,duration:diversionDetails[type].duration};
}
export function boredMoment({seed,minute,age,span=60}){
 const {type,start,duration:length}=diversionPlan({seed,minute});
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
