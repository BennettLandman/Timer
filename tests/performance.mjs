import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
const require=createRequire(import.meta.url);const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||(process.platform==='darwin'?'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome':undefined),args:['--no-sandbox']});
const errors=[];
const page=await browser.newPage({viewport:{width:1440,height:1000}});page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:8080');await page.locator('#minutes').fill('0');await page.locator('#seconds').fill('59');await page.locator('#start').click();
const frames=await page.evaluate(()=>new Promise(resolve=>{const deltas=[];let last;function tick(now){if(last!==undefined)deltas.push(now-last);last=now;if(deltas.length<120)requestAnimationFrame(tick);else resolve(deltas);}requestAnimationFrame(tick);}));
if(errors.length)throw new Error(errors.join('; '));if(!(await page.locator('#readout').textContent()).includes('remaining'))throw new Error('Timer not rendering');
frames.sort((a,b)=>a-b);const result={viewport:'1440 x 1000',mode:'painted analog, active 3D cat, final-minute claw contacts',samples:frames.length,medianFrameMs:frames[Math.floor(frames.length*.5)],p95FrameMs:frames[Math.floor(frames.length*.95)],note:'Local headless Chrome measurement; actual refresh rate and performance depend on hardware and browser.'};await page.goto('http://127.0.0.1:8080/src/assets/');
const digital=await page.evaluate(async()=>{
 const {loadVisitorAssets}=await import('/src/paint.js');await loadVisitorAssets();const {Scene}=await import('/src/scenes.js');
 document.body.innerHTML='';document.body.style.margin='0';const cv=document.createElement('canvas');cv.style='width:1440px;height:1000px;background:#e0e9d7';document.body.append(cv);
 const scene=new Scene();scene.nextVisit=Infinity;scene.visitor={start:25,type:'cat',direction:1};for(let i=0;i<100;i++)scene.debris.push({x:100+i*3,y:304+i%6,a:i*.1,col:'#3e5d48',size:10});
 return await new Promise(resolve=>{const frames=[];let start,last;function tick(now){start??=now;if(last!==undefined)frames.push(now-last);last=now;const time=45+(now-start)/1000;scene.draw(cv,{remaining:300-(now-start)/1000,initial:300,mode:'digital',time});if(frames.length<120)requestAnimationFrame(tick);else{frames.sort((a,b)=>a-b);resolve({samples:frames.length,medianFrameMs:frames[60],p95FrameMs:frames[114],mode:'painted digital with visitor and 100 debris fragments'});}}requestAnimationFrame(tick);});
});
if(errors.length)throw new Error(errors.join('; '));
const diversion=await page.evaluate(async()=>{
 const {Scene}=await import('/src/scenes.js'),{diversionPlan}=await import('/src/boredom.js');let seed=0,plan;for(;seed<1000;seed++){plan=diversionPlan({seed,minute:5});if(plan.type==='ukulele')break;}
 const cv=document.querySelector('canvas'),scene=new Scene();scene.boredSeed=seed;scene.draw(cv,{remaining:300,initial:300,time:0});
 return await new Promise(resolve=>{const frames=[];let start,last;function tick(now){start??=now;if(last!==undefined)frames.push(now-last);last=now;const time=plan.start+2+(now-start)/1000;scene.draw(cv,{remaining:300-time,initial:300,mode:'analog',time});if(frames.length<120)requestAnimationFrame(tick);else{frames.sort((a,b)=>a-b);resolve({samples:frames.length,medianFrameMs:frames[60],p95FrameMs:frames[114],mode:'painted analog with ukulele and continuous strumming'});}}requestAnimationFrame(tick);});
});
if(errors.length)throw new Error(errors.join('; '));
await writeFile('test-results/performance.json',JSON.stringify({analog:result,digital,diversion},null,2));console.log({analog:result,digital,diversion});await browser.close();
