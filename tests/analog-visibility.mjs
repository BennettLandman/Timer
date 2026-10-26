import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:1200,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:8080/');await page.waitForFunction(()=>!document.getElementById('start').disabled,{},{timeout:90000});
 const result=await page.evaluate(async()=>{
  const {Scene}=await import('/src/scenes.js');const cv=document.createElement('canvas');cv.id='analog-visibility';cv.width=1000;cv.height=600;cv.style='width:1000px;height:600px;position:fixed;inset:0;z-index:99999;background:#e0e9d7';document.body.append(cv);
  // Compare only the cat/glass interior, excluding the changing text readout.
  const pixels=()=>cv.getContext('2d').getImageData(330,150,330,290).data.slice();
  const diff=(a,b)=>{let changed=0,sum=0;for(let i=0;i<a.length;i+=4){const d=Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2]);if(d>15)changed++;sum+=d;}return {changed,mean:sum/(a.length/4*3)};};
  const scene=new Scene();scene.draw(cv,{remaining:300,initial:300,time:0});scene.draw(cv,{remaining:299.2,initial:300,time:.8});const first=pixels();scene.draw(cv,{remaining:297.5,initial:300,time:2.5});const opening=diff(first,pixels());
  scene.draw(cv,{remaining:294.8,initial:300,time:5.2});const idleStart=pixels();scene.draw(cv,{remaining:291.6,initial:300,time:8.4});const idle=diff(idleStart,pixels());
  const preview=new Scene();preview.draw(cv,{remaining:300,initial:300,time:.8,preview:true});const previewStart=pixels();preview.draw(cv,{remaining:300,initial:300,time:2.5,preview:true});const previewDiff=diff(previewStart,pixels());preview.draw(cv,{remaining:300,initial:300,time:16.3999,preview:true});const beforeLoop=pixels();preview.draw(cv,{remaining:300,initial:300,time:16.4001,preview:true});const loop=diff(beforeLoop,pixels());
  const reduced=new Scene();reduced.draw(cv,{remaining:295,initial:300,time:.8,reduced:true});const still=pixels();reduced.draw(cv,{remaining:295,initial:300,time:8.4,reduced:true});const reducedDiff=diff(still,pixels());
  // Reusing a paused time must reproduce the same pose and pixels.
  scene.draw(cv,{remaining:298,initial:300,time:2,paused:true});const paused=pixels();scene.draw(cv,{remaining:298,initial:300,time:2,paused:true});const pause=diff(paused,pixels());
  window.visibilityScene=scene;window.visibilityCanvas=cv;
  return {opening,idle,preview:previewDiff,loop,reduced:reducedDiff,pause};
 });
 assert.ok(result.opening.changed>2000&&result.opening.mean>1,'The first seconds must visibly animate the cat and painted hand');assert.ok(result.idle.changed>2000&&result.idle.mean>1,'Between minute changes, cat movement must remain visible through the glass');assert.ok(result.preview.changed>500,'The setup preview must demonstrate the painting action');assert.ok(result.loop.mean<.5,'Preview must preserve the hand and return pose at its loop boundary');assert.equal(result.reduced.changed,0);assert.equal(result.pause.changed,0);
 for(const [name,time]of [['opening-reach',.8],['opening-stroke',2.5],['idle-inspect',8.4]]){await page.evaluate(time=>visibilityScene.draw(visibilityCanvas,{remaining:300-time,initial:300,time}),time);await page.locator('#analog-visibility').screenshot({path:`test-results/analog-${name}.png`});}
 await page.locator('#analog-visibility').evaluate(el=>el.remove());
 // Exercise Start and Pause in the actual interface, rather than just the renderer.
 await page.locator('#start').click();await page.waitForTimeout(800);const start=await page.locator('#scene').screenshot();await page.waitForTimeout(1000);const later=await page.locator('#scene').screenshot();assert.ok(!start.equals(later));await page.locator('#pause').click();const paused=await page.locator('#scene').screenshot();await page.waitForTimeout(500);assert.ok(paused.equals(await page.locator('#scene').screenshot()));assert.deepEqual(errors,[]);
 await writeFile('test-results/analog-visibility.json',JSON.stringify(result,null,2));console.log(result);
}finally{await browser.close();}
