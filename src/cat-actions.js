import {drawGlassCat} from './paint.js';
const clamp=v=>Math.max(0,Math.min(1,v));
const ease=v=>{v=clamp(v);return v*v*v*(v*(v*6-15)+10);};
export function scratchTiming(remaining,initial){
 const elapsed=Math.max(0,Math.min(Math.min(60,initial),Math.min(60,initial)-remaining));
 const completed=Math.floor(elapsed+1e-7),fraction=elapsed-completed;
 const last=completed>=Math.ceil(Math.min(60,initial))-1,finish=last?1:.55;
 return {completed,index:Math.min(59,completed),fraction,progress:clamp((fraction-.34)/(finish-.34)),contact:fraction>=.34&&fraction<=finish};
}
export function scratchPath(index,r){const angle=-Math.PI/2+index*Math.PI/30;return {angle,start:{x:Math.cos(angle)*(r-9),y:Math.sin(angle)*(r-9)},end:{x:Math.cos(angle)*(r-36),y:Math.sin(angle)*(r-36)}};}
export function drawClawAction(c,remaining,initial,r,{reduced=false}={}){
 const state=scratchTiming(remaining,initial),path=scratchPath(state.index,r),f=state.fraction;
 let target={...path.start};
 if(state.contact)target={x:path.start.x+(path.end.x-path.start.x)*state.progress,y:path.start.y+(path.end.y-path.start.y)*state.progress};
 else if(f>.55){const next=scratchPath(Math.min(59,state.index+1),r),p=ease((f-.55)/.45);target={x:path.end.x+(next.start.x-path.end.x)*p,y:path.end.y+(next.start.y-path.end.y)*p};}
 else if(f<.34){const p=ease(f/.34);target={x:path.start.x*(.93+.07*p),y:path.start.y*(.93+.07*p)};}
 const paw=drawGlassCat(c,target,r,reduced?0:Math.min(60,initial)-remaining,{rest:reduced});
 return {...state,paw,last:path.end};
}
export function drawPainterAction(c,target,r,age,{erase=false,reduced=false}={}){
 return drawGlassCat(c,target,r,age,{brush:!erase,rest:reduced});
}
