import {Timer,formatTime,validDuration} from './clock.js';
import {Scene} from './scenes.js';
import {themes} from './art.js';
import {sunrisePalette,sunriseProgress} from './mindfulness.js';
const modeCaptions={analog:'A little painter, behind the glass.',digital:'A little help with the passing seconds.',mindfulness:'A quiet cat. A slowly waking sky.'};
import {Sound} from './audio.js';
import {loadPaintAssets,loadVisitorAssets} from './paint.js';
const $=id=>document.getElementById(id);
$('start').disabled=true;$('preview-caption').textContent='Opening the studio…';
const clock=new Timer(),scene=new Scene(),preview=new Scene(),sound=new Sound();
const reducedQuery=matchMedia('(prefers-reduced-motion: reduce)');
let mode='analog',animationTime=0,lastFrame=performance.now(),lastPhase='',lastText='',previewTime=0;
const defaults={endSound:false,ticking:false,music:false,mute:false,volume:.2,gentle:false,lessMotion:false};
let settings={...defaults};try{const stored=JSON.parse(localStorage.getItem('timer.settings')||'{}');for(const k of Object.keys(defaults)){if(typeof stored[k]===typeof defaults[k])settings[k]=stored[k];}settings.volume=Math.max(0,Math.min(.5,settings.volume));}catch{}
const settingIds={endSound:'end-sound',ticking:'ticking',music:'music',mute:'mute',volume:'volume',gentle:'gentle',lessMotion:'less-motion'};
for(const [key,id] of Object.entries(settingIds)){
 const input=$(id);if(key==='volume')input.value=settings[key];else input.checked=settings[key];
 input.addEventListener('input',async()=>{settings[key]=key==='volume'?Number(input.value):input.checked;try{localStorage.setItem('timer.settings',JSON.stringify(settings));}catch{}await sound.unlock();sound.configure(settings);if(['ticking','music','mute'].includes(key))sound.stop();});
}
sound.configure(settings);
function announce(message){$('announcement').textContent=message;}
function updatePresets(){const total=validDuration($('minutes').value,$('seconds').value);document.querySelectorAll('[data-min]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.min)*60===total)));$('input-error').textContent='';}
for(const b of document.querySelectorAll('[data-min]'))b.addEventListener('click',()=>{$('minutes').value=b.dataset.min;$('seconds').value=0;updatePresets();});
for(const id of ['minutes','seconds'])$(id).addEventListener('input',updatePresets);
for(const b of document.querySelectorAll('[data-mode]'))b.addEventListener('click',()=>{mode=b.dataset.mode;document.querySelectorAll('[data-mode]').forEach(el=>el.setAttribute('aria-pressed',String(el===b)));preview.reset();previewTime=0;document.body.classList.toggle('mindfulness',mode==='mindfulness');$('preview-caption').textContent=modeCaptions[mode];});
$('settings-open').addEventListener('click',()=>{$('settings').showModal();});
function begin(seconds){clock.start(seconds);scene.reset();animationTime=0;lastPhase='';lastText='';sound.stop();$('setup').hidden=true;$('setup-footer').hidden=true;$('timer').hidden=false;document.body.classList.add('active');$('pause').textContent='Pause';$('pause').disabled=false;$('completion').hidden=true;$('timer').classList.remove('digital-complete');$('pause').focus();announce(`${mode==='mindfulness'?'Mindfulness. ':''}${formatTime(seconds)} timer started.`);}
$('start').addEventListener('click',async()=>{const seconds=validDuration($('minutes').value,$('seconds').value);if(seconds===null){$('input-error').textContent='Choose a time from 1 second to 999 minutes, 59 seconds.';return;}begin(seconds);await sound.unlock();sound.configure(settings);});
function togglePause(){if(clock.state==='running'){clock.pause();sound.stop();$('pause').textContent='Resume';announce('Timer paused.');}else if(clock.state==='paused'){clock.resume();sound.unlock();$('pause').textContent='Pause';announce('Timer resumed.');}}
$('pause').addEventListener('click',togglePause);
$('restart').addEventListener('click',async()=>{begin(clock.initial);await sound.unlock();sound.configure(settings);});
$('cancel').addEventListener('click',()=>{clock.state='idle';sound.stop();scene.reset();document.body.classList.remove('active');document.documentElement.style.removeProperty('--wash');document.documentElement.style.removeProperty('--sky-ink');$('timer').hidden=true;$('setup').hidden=false;$('setup-footer').hidden=false;if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});$('start').focus();announce('Timer finished. Choose a new time.');});
function add(seconds){const previous=clock.remaining();const wasCompleted=clock.state==='completed';clock.add(seconds);if(wasCompleted){scene.reset();$('completion').hidden=true;$('timer').classList.remove('digital-complete');$('pause').disabled=false;$('pause').textContent='Pause';}announce(`${formatTime(Math.max(0,clock.remaining()-previous))} added. ${formatTime(clock.remaining())} remaining.`);}
$('add3').addEventListener('click',()=>add(180));$('add5').addEventListener('click',()=>add(300));
$('add-custom').addEventListener('click',()=>{$('add-error').textContent='';$('add-dialog').showModal();});$('add-close').addEventListener('click',()=>$('add-dialog').close());
$('add-form').addEventListener('submit',event=>{event.preventDefault();const value=validDuration($('extra-minutes').value,$('extra-seconds').value);if(value===null){$('add-error').textContent='Enter a positive time, with seconds from 0 to 59.';return;}add(value);$('add-dialog').close();});
async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{announce('Full screen is unavailable. You can use your browser’s full screen control.');}}
$('fullscreen').addEventListener('click',fullscreen);document.addEventListener('fullscreenchange',()=>{$('fullscreen').textContent=document.fullscreenElement?'Exit full screen ⛶':'Full screen ⛶';});
document.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]')||['INPUT','BUTTON','SELECT','TEXTAREA'].includes(document.activeElement.tagName)||clock.state==='idle')return;if(e.code==='Space'){e.preventDefault();togglePause();}if(e.key.toLowerCase()==='f')fullscreen();});
document.addEventListener('visibilitychange',()=>{lastFrame=performance.now();if(document.hidden)sound.stop();});
function frame(now){const dt=Math.min(.1,Math.max(0,(now-lastFrame)/1000));lastFrame=now;const reduced=settings.lessMotion||reducedQuery.matches;
 if(clock.state==='idle'){if(!document.hidden){previewTime+=dt;preview.draw($('preview'),{mode,remaining:mode==='mindfulness'?300*(1-(previewTime%120)/120):300,initial:300,time:previewTime,reduced,preview:true});}}
 else{
  if(clock.state==='running'&&!document.hidden)animationTime+=dt;
  if(clock.update()){sound.stop();sound.ending();$('completion').hidden=false;$('timer').classList.toggle('digital-complete',mode==='digital');$('pause').disabled=true;$('end-caption').textContent=mode==='mindfulness'?'A quiet moment, carried with you.':mode==='analog'?'Even artists need a break.':'All in a little day’s work.';announce('Time is up.');}
  if(clock.state==='completed'&&!document.hidden)animationTime+=dt;
  const remaining=clock.remaining(),phase=clock.phase(),str=formatTime(remaining),mindful=mode==='mindfulness';
  const theme=mindful?sunrisePalette(sunriseProgress(remaining,clock.initial)):themes[phase],phaseKey=mindful?theme.label:phase;
  if(mindful){document.documentElement.style.setProperty('--wash',theme.wash);document.documentElement.style.setProperty('--sky-ink',theme.ink);}
  if(str!==lastText){$('readout').textContent=`${str} remaining`;lastText=str;}
  if(phaseKey!==lastPhase){document.documentElement.style.setProperty('--wash',theme.wash);lastPhase=phaseKey;if(clock.state==='running')announce(mindful?theme.label.toLowerCase()+'.':phase==='green'?'Plenty of time.':phase==='yellow'?'Time to wrap up.':'Final moments.');}
  $('phase-text').textContent=clock.state==='completed'?'TIME, WELL SPENT':clock.state==='paused'?'ON A LITTLE PAUSE':theme.label;
  if(!document.hidden){scene.draw($('scene'),{remaining,initial:clock.initial,phase,mode,time:animationTime,reduced,completed:clock.state==='completed',gentle:settings.gentle,paused:clock.state==='paused'});sound.update(remaining,clock.initial,mindful?'mindfulness':phase,animationTime,clock.state==='running');}
 }
 requestAnimationFrame(frame);
}
loadPaintAssets().then(()=>{lastFrame=performance.now();requestAnimationFrame(frame);return loadVisitorAssets();}).then(()=>{$('start').disabled=false;$('preview-caption').textContent=modeCaptions[mode];}).catch(error=>{console.error(error);$('input-error').textContent='The studio could not load. Please reload in a browser with WebGL enabled.';});
