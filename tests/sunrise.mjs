import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:1100,height:800}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.TIMER_SUNRISE_BASE||'http://127.0.0.1:8080/dist/');await page.waitForFunction(()=>!document.getElementById('start').disabled,{},{timeout:90000});
 const result=await page.evaluate(async()=>{
  const entry=document.querySelector('script[src]').src,{drawSunrise,sunrisePalette}=await import(new URL('mindfulness.js',entry).href);
  const samples=[];
  for(const [w,h]of [[1000,600],[360,550]])for(const progress of [.55,.60,.65]){
   const render=hideSun=>{const cv=document.createElement('canvas');cv.width=w;cv.height=h;const c=cv.getContext('2d');
    if(hideSun){const fill=c.fill.bind(c),rect=c.fillRect.bind(c),radial=c.createRadialGradient.bind(c),sun=sunrisePalette(progress).sun;let halo;
     c.createRadialGradient=(...args)=>(halo=radial(...args));c.fill=(...args)=>{if(c.fillStyle!==sun)fill(...args);};c.fillRect=(...args)=>{if(c.fillStyle!==halo)rect(...args);};
    }
    drawSunrise(c,w,h,progress);return {cv,pixels:c.getImageData(0,0,w,h).data};
   };
   const normal=render(false),reference=render(true);let hiddenChanges=0,visibleChanges=0;
   // Compare the same sky with and without the solar disc and halo. Every
   // pixel safely below the far ridge must be identical; light must remain
   // visible above it. Skip antialiased pixels immediately on the ridge.
   for(let x=0;x<w;x+=2){const point=x/w*20,index=Math.min(19,Math.floor(point)),a=.88+Math.sin(index*.4)*.035,b=.88+Math.sin((index+1)*.4)*.035,ridge=h*(a+(b-a)*(point-index));
    for(let y=0;y<h;y+=2){const i=(y*w+x)*4,diff=Math.abs(normal.pixels[i]-reference.pixels[i])+Math.abs(normal.pixels[i+1]-reference.pixels[i+1])+Math.abs(normal.pixels[i+2]-reference.pixels[i+2]);if(diff>0){if(y>ridge+3)hiddenChanges++;else if(y<ridge-3)visibleChanges++;}}
   }
   samples.push({width:w,height:h,progress,hiddenChanges,visibleChanges});
   if(w===1000&&progress===.60){normal.cv.id='sunrise-proof';normal.cv.style='position:fixed;inset:0;width:1000px;height:600px;z-index:99999';document.body.append(normal.cv);}
  }
  return {samples};
 });
 await mkdir('test-results',{recursive:true});await page.locator('#sunrise-proof').screenshot({path:'test-results/sunrise-behind-hills.png'});
 for(const sample of result.samples){assert.equal(sample.hiddenChanges,0,`Sunlight must be occluded below the distant ridge: ${JSON.stringify(sample)}`);assert.ok(sample.visibleChanges>100,'Sunlight must remain visible above the hills');}
 await page.evaluate(async()=>{
  const entry=document.querySelector('script[src]').src,{Scene}=await import(new URL('scenes.js',entry).href);
  new Scene().draw(document.getElementById('sunrise-proof'),{mode:'mindfulness',remaining:120,initial:300,time:180});
 });
 await page.locator('#sunrise-proof').screenshot({path:'test-results/sunrise-behind-hills-clock.png'});
 assert.deepEqual(errors,[]);await writeFile('test-results/sunrise.json',JSON.stringify({...result,errors},null,2));console.log(result);
}finally{await browser.close();}
