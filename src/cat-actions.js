import {drawGlassCat} from './paint.js';
const clamp=v=>Math.max(0,Math.min(1,v));
const ease=v=>{v=clamp(v);return v*v*v*(v*(v*6-15)+10);};
export function scratchTiming(remaining,initial){
 const available=Math.min(60,initial),total=Math.ceil(available);
 const elapsed=Math.max(0,Math.min(available,available-remaining));
 const completed=Math.floor(elapsed+1e-7),fraction=elapsed-completed,index=Math.max(0,total-1-completed);
 const last=completed===total-1,finish=last?available-(total-1):.55,start=last?.34*finish:.34;
 return {completed,index,total,fraction,progress:clamp((fraction-start)/(finish-start)),contact:completed<total&&fraction>=start&&fraction<=finish};
}
export function scratchPath(index,r){const angle=-Math.PI/2+index*Math.PI/30;return {angle,start:{x:Math.cos(angle)*(r-9),y:Math.sin(angle)*(r-9)},end:{x:Math.cos(angle)*(r-36),y:Math.sin(angle)*(r-36)}};}
export function drawClawAction(c,remaining,initial,r,{reduced=false}={}){
 const state=scratchTiming(remaining,initial),path=scratchPath(state.index,r),f=state.fraction;
 let target={...path.start};
 if(state.contact)target={x:path.start.x+(path.end.x-path.start.x)*state.progress,y:path.start.y+(path.end.y-path.start.y)*state.progress};
 else if(f>.55){const next=scratchPath(Math.max(0,state.index-1),r),p=ease((f-.55)/.45);target={x:path.end.x+(next.start.x*.93-path.end.x)*p,y:path.end.y+(next.start.y*.93-path.end.y)*p};}
 else if(f<.34){const p=ease(f/.34);target={x:path.start.x*(.93+.07*p),y:path.start.y*(.93+.07*p)};}
 const paw=drawGlassCat(c,target,r,reduced?0:Math.min(60,initial)-remaining,{rest:reduced});
 return {...state,paw,last:path.end};
}
export function drawPainterAction(c,target,r,age,{erase=false,reduced=false,engagement=1}={}){
 return drawGlassCat(c,target,r,age,{brush:!erase,rest:reduced,engagement});
}

// Mark numbers follow the face of the dial; elapsed-second ordinals run in
// the opposite direction, starting at 59 and ending at the top (zero).
export function scratchProgress(mark,state){
 if(mark<0||mark>=state.total)return 0;
 const ordinal=state.total-1-mark;
 return ordinal<state.completed?1:ordinal===state.completed?state.progress:0;
}
