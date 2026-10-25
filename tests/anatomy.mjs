import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||(process.platform==='darwin'?'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome':undefined),args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:8080');await page.locator('#start').waitFor({state:'visible'});await page.waitForFunction(()=>!document.getElementById('start').disabled);
const result=await page.evaluate(async()=>{
 const {Scene}=await import('/src/scenes.js');const {project}=await import('/src/depth.js');const {loadPaintAssets}=await import('/src/paint.js');await loadPaintAssets();
 const cv=document.createElement('canvas');cv.id='anatomy';cv.width=1000;cv.height=600;cv.style='position:fixed;inset:100px auto auto 150px;width:1000px;height:600px;background:#e0e9d7;z-index:9000';document.body.append(cv);
 const s=new Scene();s.draw(cv,{remaining:1,mode:'digital',time:100});const ctx=cv.getContext('2d');const layout=JSON.stringify(s.digitalLayout);
 const l=s.digitalLayout;const regions=[[-12,-14],[l.width+12,-14],[-12,190],[l.width+12,190]].map(([x,y])=>{const p=project(x,y,-3,l.width/2);return [Math.round(l.cx-l.width*l.scale/2+p.x*l.scale),Math.round(l.cy-90*l.scale+p.y*l.scale),2,2];});const before=regions.map(r=>Array.from(ctx.getImageData(...r).data));
 s.draw(cv,{remaining:0,mode:'digital',time:101,completed:true});const first=ctx.getImageData(570,0,210,120).data.slice();
 s.draw(cv,{remaining:0,mode:'digital',time:105,completed:true});const after=regions.map(r=>Array.from(ctx.getImageData(...r).data));const last=ctx.getImageData(570,0,210,120).data;
 const wide=new Scene();wide.draw(cv,{remaining:59999,mode:'digital',time:100});const wl=wide.digitalLayout,wideLayout=JSON.stringify(wl);
 const wideRegions=[[-12,-14],[wl.width+12,-14],[-12,190],[wl.width+12,190]].map(([x,y])=>{const p=project(x,y,-3,wl.width/2);return [Math.round(wl.cx-wl.width*wl.scale/2+p.x*wl.scale),Math.round(wl.cy-90*wl.scale+p.y*wl.scale),2,2];});const wideBefore=wideRegions.map(r=>Array.from(ctx.getImageData(...r).data));
 wide.draw(cv,{remaining:0,mode:'digital',time:101,completed:true});wide.draw(cv,{remaining:0,mode:'digital',time:105,completed:true});
 const wideAfter=wideRegions.map(r=>Array.from(ctx.getImageData(...r).data));const longDiff=Math.max(...wideBefore.flatMap((pixels,i)=>pixels.map((v,k)=>Math.abs(v-wideAfter[i][k]))));const longStationary=wideLayout===JSON.stringify(wide.digitalLayout)&&longDiff<=1;
 s.draw(cv,{remaining:0,mode:'digital',time:105,completed:true});
 return {stationary:before.every((pixels,i)=>pixels.every((v,k)=>v===after[i][k])),sameLayout:layout===JSON.stringify(s.digitalLayout),peekChanged:first.some((v,i)=>v!==last[i]),longStationary,longDiff};
});console.log(result);assert.equal(result.stationary,true,'Clock housing must stay pixel-for-pixel fixed at zero');assert.equal(result.sameLayout,true);assert.equal(result.longStationary,true);assert.equal(result.peekChanged,true,'Head must emerge above the fixed clock');await page.locator('#anatomy').screenshot({path:'test-results/new-peek.png'});
for(const [name,remaining,time]of [['claw-contact',59.6,10],['claw-retract',59.15,10.45],['many-claws',20.6,49]]){
 await page.evaluate(async({remaining,time})=>{const {Scene}=await import('/src/scenes.js');window.actionScene??=new Scene();window.actionScene.draw(document.getElementById('anatomy'),{remaining,initial:300,mode:'analog',time,phase:'red'});},{remaining,time});await page.locator('#anatomy').screenshot({path:`test-results/${name}.png`});
}
assert.deepEqual(errors,[]);await mkdir('test-results',{recursive:true});await writeFile('test-results/anatomy-results.json',JSON.stringify(result,null,2));await browser.close();console.log('Claw poses and stationary-clock peek checks passed.');
