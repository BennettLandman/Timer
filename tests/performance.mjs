import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
const require=createRequire(import.meta.url);const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||(process.platform==='darwin'?'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome':undefined),args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:1000}});await page.goto('http://127.0.0.1:8080');await page.locator('#start').click();
const frames=await page.evaluate(()=>new Promise(resolve=>{const deltas=[];let last;function tick(now){if(last!==undefined)deltas.push(now-last);last=now;if(deltas.length<120)requestAnimationFrame(tick);else resolve(deltas);}requestAnimationFrame(tick);}));
frames.sort((a,b)=>a-b);const result={viewport:'1440 x 1000',mode:'analog, active painting',samples:frames.length,medianFrameMs:frames[Math.floor(frames.length*.5)],p95FrameMs:frames[Math.floor(frames.length*.95)],note:'Local headless Chrome measurement; actual refresh rate and performance depend on hardware and browser.'};await writeFile('test-results/performance.json',JSON.stringify(result,null,2));console.log(result);await browser.close();
