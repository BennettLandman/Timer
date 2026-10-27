// Silent activities. Labels are for the development gallery, never the timer UI.
const groups={
 breathing:['bellyBreath','equalBreath','longExhale','oceanBreath'],
 standing:['mountain','tree','eagle','warriorOne','warriorTwo','reverseWarrior','triangle','sideAngle','chair','forwardFold','crescent','star'],
 sitting:['easySeat','lotus','butterfly','seatedTwist','seatedSideReach','seatedFold','staff','hero','kneelingPrayer','shoulderRoll'],
 floor:['child','catCow','downwardDog','cobra','sphinx','bridge','happyBaby','rest'],
 practice:['waxOn','waxOff','paintFence','sandFloor','paintHouse','jacket']
};
const labels=['Belly breathing','Even breathing','A longer exhale','Ocean breathing','Mountain','Tree','Eagle','Warrior I','Warrior II','Reverse warrior','Triangle','Side angle','Chair','Standing forward fold','Crescent','Star','Easy seat','Lotus','Butterfly','Seated twist','Seated side reach','Seated forward fold','Staff','Hero','Kneeling prayer','Shoulder circles','Child’s pose','Cat / cow','Downward dog','Cobra','Sphinx','Bridge','Happy baby','Resting on the mat','Wax on','Wax off','Paint the fence','Sand the floor','Paint the house','Jacket on / jacket off'];
export const activities=Object.values(groups).flat();
export const activityDetails=Object.fromEntries(activities.map((type,i)=>[type,{label:labels[i],group:Object.keys(groups).find(g=>groups[g].includes(type)),duration:20}]));
export const clamp=v=>Math.max(0,Math.min(1,v));
export const soften=v=>{const t=clamp(v);return clamp(t*t*t*(t*(t*6-15)+10));};
function hash(v){v=Math.imul(v^(v>>>16),0x45d9f3b);v=Math.imul(v^(v>>>16),0x45d9f3b);return (v^(v>>>16))>>>0;}
export function activityDeck(seed){
 const deck=[...activities];for(let i=deck.length-1;i>0;i--){const j=hash(seed+i)%(i+1);[deck[i],deck[j]]=[deck[j],deck[i]];}return deck;
}
// Two generous twenty-second windows between minute painting, including the
// final minute. Index by elapsed animation slots, so adding time never rewinds
// the deck. No action is rushed to fit a short interval.
export function mindfulnessMoment({seed,time,age,span=60}){
 const start=age<32?8:33,duration=20;
 if(age<start||age>=start+duration||start+duration+2>span)return null;
 const minute=Math.max(0,Math.round((time-age)/60)),slot=minute*2+(start===33?1:0);
 return {type:activityDeck(seed)[slot%activities.length],local:age-start,duration,start,mindful:true};
}
export function activityWeight(moment){return moment?soften(moment.local/2.8)*(1-soften((moment.local-moment.duration+2.8)/2.8)):0;}
// Exhalation is never shorter than inhalation. No breath holds, visual words,
// flashing markers, or countdown cues: the cat's body and paws carry the cycle.
export function breathCycle(type,time){
 const inhale=type==='longExhale'?3:4,exhale=type==='equalBreath'?4:6;
 const local=((time%(inhale+exhale))+(inhale+exhale))%(inhale+exhale);
 return local<inhale?soften(local/inhale):1-soften((local-inhale)/exhale);
}
const palettes=[
 [0,'#101b38','#344366','#777094','#eed8bb'],
 [.25,'#242b52','#695b83','#b98caa','#f3decc'],
 [.5,'#655779','#c189a3','#edbda6','#fff0dc'],
 [.75,'#b590b0','#edb7af','#f8d49e','#fff1d9'],
 [1,'#a6c9df','#ead7d0','#ffe0a7','#fff3d5']
];
function blend(a,b,t){const parts=[1,3,5].map(i=>Math.round(parseInt(a.slice(i,i+2),16)*(1-t)+parseInt(b.slice(i,i+2),16)*t).toString(16).padStart(2,'0'));return '#'+parts.join('');}
export function sunrisePalette(progress){
 const p=clamp(progress),index=Math.min(3,Math.floor(p*4)),a=palettes[index],b=palettes[index+1],t=soften((p-a[0])/(b[0]-a[0]));
 const [top,middle,horizon,sun]=a.slice(1).map((v,i)=>blend(v,b[i+1],t));
 return {top,middle,horizon,sun,ink:p<.62?'#fff1df':'#3d384c',glass:blend(middle,horizon,.45),wash:top,label:p<.2?'STILLNESS':p<.5?'FIRST LIGHT':p<.8?'DAYBREAK':'A NEW DAY'};
}
export function sunriseProgress(remaining,initial){return clamp(1-remaining/Math.max(1,initial));}
// Everything is a function of countdown progress. Pause freezes the sky;
// reduced motion keeps the sunrise, without twinkling or moving scenery.
export function drawSunrise(c,w,h,progress){
 const p=clamp(progress),sky=sunrisePalette(p);
 const gradient=c.createLinearGradient(0,0,0,h);gradient.addColorStop(0,sky.top);gradient.addColorStop(.58,sky.middle);gradient.addColorStop(1,sky.horizon);c.fillStyle=gradient;c.fillRect(0,0,w,h);
 c.save();
 const stars=1-soften(p/.55);c.fillStyle='#fff3df';
 for(let i=0;i<95;i++){
  const x=((i*73.713+19)%997)/997*w,y=((i*41.917+7)%541)/541*h*.78,r=.55+(i%4)*.3;
  c.globalAlpha=stars*(.32+(i%7)/11);c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();
  if(i%17===0){c.fillRect(x-r*2.5,y-.35,r*5,.7);c.fillRect(x-.35,y-r*2.5,.7,r*5);}
 }
 c.globalAlpha=(1-soften(p/.43))*.7;c.fillStyle='#fff0cf';c.beginPath();c.arc(w*.79,h*.17,Math.min(w,h)*.036,0,Math.PI*2);c.fill();
 // A small sky-colored overlap shapes the crescent.
 c.fillStyle=sky.top;c.beginPath();c.arc(w*.80,h*.16,Math.min(w,h)*.035,0,Math.PI*2);c.fill();
 const sx=w*.54,sy=h*(1.12-.51*soften((p-.16)/.84)),radius=Math.min(w,h)*.10;
 c.globalAlpha=soften(p/.4);const halo=c.createRadialGradient(sx,sy,0,sx,sy,radius*4);halo.addColorStop(0,sky.sun+'a0');halo.addColorStop(1,sky.sun+'00');c.fillStyle=halo;c.fillRect(0,0,w,h);c.fillStyle=sky.sun;c.beginPath();c.arc(sx,sy,radius,0,Math.PI*2);c.fill();
 // Translucent, low hills anchor the quiet horizon without hiding the dial.
 for(let layer=0;layer<3;layer++){c.globalAlpha=.16+layer*.055;c.fillStyle=sky.top;c.beginPath();c.moveTo(0,h);c.lineTo(0,h*(.88+layer*.04));for(let i=0;i<=20;i++){const x=i*w/20,y=h*(.88+layer*.035)+Math.sin(i*.4+layer*2)*h*.035;c.lineTo(x,y);}c.lineTo(w,h);c.closePath();c.fill();}
 c.restore();return sky;
}
