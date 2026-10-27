import {createRequire} from 'node:module';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--no-sandbox']});
try{
 const base=process.env.TIMER_PREVIEW_URL||'http://127.0.0.1:8080/dist/';
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[],requests=[],samples=[];let staleRendererHits=0;
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
 // Simulate the pre-mindfulness renderer surviving at its old, unversioned
 // URL. Its preview dispatcher treats every non-analog mode as digital.
 const legacy=(await readFile('src/scenes.js','utf8')).replace("if(mode!=='digital'){this.analog","if(mode==='analog'){this.analog");
 await page.route('**/src/scenes.js',route=>{staleRendererHits++;return route.fulfill({contentType:'text/javascript',body:legacy});});
 await page.addInitScript(()=>{
  const arc=CanvasRenderingContext2D.prototype.arc,clear=CanvasRenderingContext2D.prototype.clearRect;
  CanvasRenderingContext2D.prototype.clearRect=function(...args){if(this.canvas.id==='preview')this.canvas.dataset.roundClock='false';return clear.apply(this,args);};
  CanvasRenderingContext2D.prototype.arc=function(...args){if(this.canvas.id==='preview'&&args[2]>=100)this.canvas.dataset.roundClock='true';return arc.apply(this,args);};
 });
 await page.goto(base);await page.waitForFunction(()=>!document.getElementById('start').disabled,{},{timeout:90000});
 await mkdir('test-results',{recursive:true});
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:width===390?844:1000});
  for(const mode of ['digital','mindfulness','analog','mindfulness']){
   await page.locator(`[data-mode="${mode}"]`).click();await page.waitForTimeout(150);
   const round=await page.locator('#preview').getAttribute('data-round-clock');
   samples.push({width,mode,round});assert.equal(round,mode==='digital'?'false':'true',`${mode} must render the selected clock at ${width}px`);
   if(mode==='mindfulness'){
    const [r,g,b,a]=await page.locator('#preview').evaluate(cv=>[...cv.getContext('2d').getImageData(2,2,1,1).data]);
    assert.ok(a===255&&b>r+20,'Mindfulness preview must begin with its night sky');
    await page.screenshot({path:`test-results/homepage-mindfulness-${width}.png`});
   }
  }
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 }
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(150);assert.equal(await page.locator('#preview').getAttribute('data-round-clock'),'true');
 await page.reload();await page.waitForFunction(()=>!document.getElementById('start').disabled,{},{timeout:90000});await page.locator('[data-mode="mindfulness"]').click();await page.waitForTimeout(150);assert.equal(await page.locator('#preview').getAttribute('data-round-clock'),'true');
 assert.equal(staleRendererHits,0,'The new deployment must never request the legacy renderer URL');assert.deepEqual(errors,[]);
 const sourceRoot=new URL('src/',base).href,assets=requests.filter(url=>url.startsWith(sourceRoot));
 assert.ok(assets.length>20);assert.ok(assets.every(url=>/^src\/[a-f0-9]{12}\//.test(url.slice(base.length))),'All modules, styles and artwork must share a content-versioned directory');
 const result={url:base,samples,staleRendererHits,versionedRequests:assets.length,reload:true,reducedMotion:true,errors};await writeFile('test-results/homepage-preview.json',JSON.stringify(result,null,2));console.log(result);
}finally{await browser.close();}
