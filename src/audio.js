// Original synthesized sound: no recordings, third-party media, or network calls.
export class Sound {
 constructor(){this.ctx=null;this.lastTick=null;this.lastChord=-100;this.nodes=new Set();}
 async unlock(){try{if(!this.ctx){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;this.ctx=new AC();this.master=this.ctx.createGain();this.master.connect(this.ctx.destination);}if(this.ctx.state==='suspended')await this.ctx.resume();}catch{/* Visual timer works when the browser disallows audio. */}}
 configure(settings){this.settings=settings;if(this.master)this.master.gain.setTargetAtTime(settings.mute?0:Number(settings.volume),this.ctx.currentTime,.08);}
 tone(freq,start,duration,volume,type='sine'){
  if(!this.ctx||this.ctx.state!=='running')return;const osc=this.ctx.createOscillator(),g=this.ctx.createGain();osc.type=type;osc.frequency.value=freq;osc.connect(g);g.connect(this.master);g.gain.setValueAtTime(0,start);g.gain.linearRampToValueAtTime(volume,start+Math.min(.15,duration*.15));g.gain.exponentialRampToValueAtTime(.0001,start+duration);osc.start(start);osc.stop(start+duration+.05);this.nodes.add(osc);osc.onended=()=>{this.nodes.delete(osc);osc.disconnect();g.disconnect();};
 }
 update(remaining,initial,phase,animationTime,running){
  if(!this.ctx)return;this.configure(this.settings);if(!running)return;const s=this.settings,t=this.ctx.currentTime;
  const second=Math.ceil(remaining);if(this.lastTick!==second){this.lastTick=second;if(s.ticking&&!s.mute)this.tone(680,t,.045,.025+.1*(1-Math.min(1,remaining/initial)));}
  if(s.music&&!s.mute&&animationTime-this.lastChord>=4){this.lastChord=animationTime;const root=phase==='green'?174.61:phase==='yellow'?196:220;for(const [i,factor] of [1,1.5,2.25].entries())this.tone(root*factor,t+i*.25,5,.055);}
 }
 ending(){if(!this.ctx||!this.settings.endSound||this.settings.mute)return;const t=this.ctx.currentTime;for(let i=0;i<7;i++)this.tone(590+i*163,t+i*.075,.65,.11/(1+i*.2),'triangle');}
 stop(){for(const node of this.nodes){try{node.stop();}catch{}}this.nodes.clear();this.lastTick=null;this.lastChord=-100;}
}
