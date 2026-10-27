import {MAX_SECONDS} from './clock.js';
// Shareable timer links use a total duration in seconds, independently of
// the minutes/seconds input fields. Ignore incomplete or invalid presets.
export function timerFromLink(search){
 const params=new URLSearchParams(search),mode=params.get('mode'),duration=params.get('duration');
 if(!['analog','digital','mindfulness'].includes(mode)||!duration||!/^\d+$/.test(duration))return null;
 const seconds=Number(duration);
 if(!Number.isSafeInteger(seconds)||seconds<1||seconds>MAX_SECONDS)return null;
 return {mode,seconds,autostart:params.get('start')==='1'};
}
