import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--no-sandbox']});
try{
 const p=await browser.newPage({viewport:{width:1100,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:8080/docs/rig-proof/little-breaks.html');await p.waitForFunction(()=>window.breakReview?.ready);
 const options=await p.locator('#action option').evaluateAll(options=>options.map(o=>o.value));assert.equal(options.length,25);
 const signatures=new Set();
 for(const type of options.filter(type=>type!=='countdown')){await p.locator('#action').selectOption(type);await p.evaluate(()=>breakReview.seek(4));assert.equal(await p.evaluate(()=>breakReview.action.moment.type),type);signatures.add(await p.locator('#clock').evaluate(cv=>{const c=document.createElement('canvas');c.width=160;c.height=150;c.getContext('2d').drawImage(cv,cv.width*.28,cv.height*.19,cv.width*.4,cv.height*.57,0,0,160,150);return c.toDataURL();}));}
 assert.equal(signatures.size,24,'Each routine must produce a distinct rendered pose');
 await p.locator('#action').selectOption('countdown');const order=[];for(const elapsed of [.4,1.4,2.4,58.4,59.4]){await p.evaluate(t=>breakReview.seek(t),elapsed);order.push(await p.evaluate(()=>breakReview.second));}assert.deepEqual(order,[59,58,57,1,0]);
 await p.locator('#clock').screenshot({path:'test-results/counter-clockwise-preview.png'});
 const ticks=await p.evaluate(async()=>{const {Scene}=await import('/src/scenes.js');const cv=document.createElement('canvas');cv.style='position:fixed;left:-2000px;width:1000px;height:600px';document.body.append(cv);const scene=new Scene(),c=cv.getContext('2d');const pixel=(x,y)=>[...c.getImageData(x,y,1,1).data];const a=59*Math.PI/30-Math.PI/2,x=Math.round(500+Math.cos(a)*212),y=Math.round(270+Math.sin(a)*212);scene.draw(cv,{remaining:60,initial:600,time:0,phase:'red'});const first=pixel(x,y),top=pixel(500,60);scene.draw(cv,{remaining:58.9,initial:600,time:1.1,phase:'red'});return {first,removed:pixel(x,y),top,topAfter:pixel(500,60)};});
 assert.deepEqual(ticks.top,ticks.topAfter,'The zero/top tick must remain until the last stroke');assert.ok(ticks.removed.slice(0,3).reduce((a,b)=>a+b)>ticks.first.slice(0,3).reduce((a,b)=>a+b)+15,'The 59 tick must be scratched away first');
 await p.setViewportSize({width:390,height:844});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.deepEqual(errors,[]);await writeFile('test-results/gesture-preview.json',JSON.stringify({routines:24,distinctPoses:signatures.size,order,ticks,errors},null,2));console.log('24 gesture controls, distinct poses, counter-clockwise tick removal, and mobile layout pass.');
}finally{await browser.close();}
