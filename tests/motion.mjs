import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:1200,height:850}}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&/WebGLProgram|shader|VALIDATE_STATUS/i.test(m.text()))errors.push(m.text());});await page.goto('http://127.0.0.1:8080');await page.waitForFunction(()=>!document.getElementById('start').disabled,{},{timeout:90000});
 const result=await page.evaluate(async()=>{
  const {drawPaintedAnimal,drawGlassCat,animationDiagnostics}=await import('/src/paint.js');const {drawClawAction,scratchPath}=await import('/src/cat-actions.js');const {Scene}=await import('/src/scenes.js');
  const cv=document.createElement('canvas');cv.width=1000;cv.height=600;const c=cv.getContext('2d');
  let contactError=0,paintError=0,maxFlex=0,minFlex=180;
  for(let second=0;second<60;second++)for(const fraction of [.35,.4,.5]){
   const state=drawClawAction(c,60-second-fraction,300,225),path=scratchPath(state.index,225),expected={x:path.start.x+(path.end.x-path.start.x)*state.progress,y:path.start.y+(path.end.y-path.start.y)*state.progress};
   contactError=Math.max(contactError,Math.hypot(state.paw.x-expected.x,state.paw.y-expected.y));const flex=state.paw.anatomy.elbowFlex*180/Math.PI;maxFlex=Math.max(maxFlex,flex);minFlex=Math.min(minFlex,flex);
  }
  for(let mark=0;mark<60;mark+=3)for(let amount=0;amount<=1;amount+=.1){const a=mark*Math.PI/30-Math.PI/2,target={x:Math.cos(a)*225*.78*amount,y:Math.sin(a)*225*.78*amount};paintError=Math.max(paintError,drawGlassCat(c,target,225,amount,{brush:true}).error);}
  const continuity={};
  for(const type of ['fox','turkey']){
   const small=document.createElement('canvas');small.width=240;small.height=180;const sc=small.getContext('2d');let last=null,diff=[];const frames=new Set();
   for(let i=0;i<=120;i++){sc.clearRect(0,0,240,180);drawPaintedAnimal(sc,type,120,160,130,i/120*1.875);const p=sc.getImageData(0,0,240,180).data;frames.add(small.toDataURL());if(last){let n=0;for(let k=0;k<p.length;k++)n+=Math.abs(p[k]-last[k]);diff.push(n/p.length);}last=p;}
   diff.sort((a,b)=>a-b);continuity[type]={distinct:frames.size,max:diff.at(-1),median:diff[60],p95:diff[114]};
  }
  cv.id='motion-review';cv.style='position:fixed;inset:0;width:1000px;height:600px;background:#f5f2e9;z-index:9999';document.body.append(cv);window.reviewScene=new Scene();window.reviewCanvas=cv;
  return {contactError,paintError,maxFlex,minFlex,continuity,technique:animationDiagnostics().technique};
 });
 assert.ok(result.contactError<.01,`Claw must touch every rim mark, error ${result.contactError}px`);assert.ok(result.paintError<.01,`Brush misses paint by ${result.paintError}px`);assert.ok(result.minFlex>=9.9&&result.maxFlex<=145.1);
 for(const [type,c]of Object.entries(result.continuity)){assert.ok(c.distinct>110,`${type} must continuously change at 120 samples`);assert.ok(c.max<3,`${type} must not pop between poses`);}
 for(const [label,remaining,time,prime]of [['paint-start',239.9,60.1,true],['paint-middle',237.3,62.7,true],['paint-end',236,64,true],['scratch-right',44.6,75.4,false],['scratch-bottom',29.6,90.4,false],['scratch-left',14.6,105.4,false]]){
  await page.evaluate(({remaining,time,prime})=>{const s=reviewScene;if(prime){s.reset();s.draw(reviewCanvas,{remaining:241,initial:300,time:59,mode:'analog'});}s.draw(reviewCanvas,{remaining,initial:300,time:prime?60:time,mode:'analog'});if(prime)s.draw(reviewCanvas,{remaining,initial:300,time,mode:'analog'});},{remaining,time,prime});await page.locator('#motion-review').screenshot({path:`test-results/${label}.png`});
 }
 assert.deepEqual(errors,[]);await writeFile('test-results/motion-results.json',JSON.stringify(result,null,2));console.log(result);
}finally{await browser.close();}
