import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright');
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1200,height:850}});await page.goto('http://127.0.0.1:8080');
const result=await page.evaluate(async()=>{
 const {loadVisitorAssets,animationMeta,drawAnimation}=await import('/src/paint.js');await loadVisitorAssets();
 const {drawClawAction,scratchPath}=await import('/src/cat-actions.js');const {Scene}=await import('/src/scenes.js');
 const cv=document.createElement('canvas');cv.width=240;cv.height=200;const c=cv.getContext('2d');
 const metrics={};
 for(const species of ['fox','turkey']){
  const name=species+'-walk',m=animationMeta(name),scale=130/m.inkWidth;
  const series=old=>{let last=null,diffs=[];for(let i=0;i<=120;i++){
   c.fillStyle='#e6e8d9';c.fillRect(0,0,240,200);
   if(old){const f=Math.floor((i%120)/120*24);c.drawImage(m.img,f%6*m.frameWidth,Math.floor(f/6)*m.frameHeight,m.frameWidth,m.frameHeight,120-m.anchorX*scale,170-m.anchorY*scale,m.frameWidth*scale,m.frameHeight*scale);}
   else drawAnimation(c,name,120,170,130,i/120);
   const pixels=c.getImageData(0,0,240,200).data;
   if(last){let sum=0;for(let p=0;p<pixels.length;p+=4)sum+=Math.abs(pixels[p]-last[p])+Math.abs(pixels[p+1]-last[p+1])+Math.abs(pixels[p+2]-last[p+2]);diffs.push(sum/(240*200*3));}last=pixels;
  }return {max:Math.max(...diffs),p95:diffs.toSorted((a,b)=>a-b)[Math.floor(diffs.length*.95)]};};
  metrics[species]={before:series(true),after:series(false)};
 }
 let contactError=0;for(let second=0;second<60;second++)for(const fraction of [.35,.4,.5]){c.clearRect(0,0,240,200);const state=drawClawAction(c,60-second-fraction,300,225),path=scratchPath(second,225);const expected={x:path.start.x+(path.end.x-path.start.x)*state.progress,y:path.start.y+(path.end.y-path.start.y)*state.progress};contactError=Math.max(contactError,Math.hypot(state.paw.x-expected.x,state.paw.y-expected.y));}
 const stage=document.createElement('canvas');stage.id='motion-review';stage.width=1000;stage.height=600;stage.style='position:fixed;inset:0;width:1000px;height:600px;background:#f5f2e9;z-index:9999';document.body.append(stage);window.reviewScene=new Scene();window.reviewCanvas=stage;
 const clock=new Scene();clock.draw(stage,{remaining:59.9,initial:300,mode:'analog',time:1});const before=Array.from(stage.getContext('2d').getImageData(500,60,1,1).data);clock.draw(stage,{remaining:58.9,initial:300,mode:'analog',time:2});const after=Array.from(stage.getContext('2d').getImageData(500,60,1,1).data);return {metrics,contactError,tick:{before,after}};
});
for(const [name,m]of Object.entries(result.metrics)){assert.ok(m.after.max<m.before.max*.65,`${name} small-size jumps must fall by at least 35%`);assert.ok(m.after.p95<m.before.p95*.65);}
assert.ok(result.tick.after.slice(0,3).reduce((a,b)=>a+b)>result.tick.before.slice(0,3).reduce((a,b)=>a+b),'The first solid tick must be scratched away');
assert.ok(result.contactError<1e-8,'Claws must contact the active perimeter mark in every quadrant');
for(const [label,remaining,time,prime]of [['paint-start',239.9,60.1,true],['paint-middle',237.3,62.7,true],['paint-end',236,64,true],['scratch-right',44.6,75.4,false],['scratch-bottom',29.6,90.4,false],['scratch-left',14.6,105.4,false]]){
 await page.evaluate(({remaining,time,prime})=>{const s=window.reviewScene;if(prime){s.reset();s.draw(window.reviewCanvas,{remaining:241,initial:300,time:59,mode:'analog'});}s.draw(window.reviewCanvas,{remaining,initial:300,time:prime?60:time,mode:'analog'});if(prime)s.draw(window.reviewCanvas,{remaining,initial:300,time,mode:'analog'});},{remaining,time,prime});await page.locator('#motion-review').screenshot({path:`test-results/${label}.png`});
}
await writeFile('test-results/motion-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));await browser.close();
