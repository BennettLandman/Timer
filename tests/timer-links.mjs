import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--no-sandbox']});
try{
 const base=process.env.TIMER_LINK_BASE||'http://127.0.0.1:8080/dist/';
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const preset=new URL('?mode=mindfulness&duration=60',base).href;
 await page.goto(preset);await page.waitForFunction(()=>!document.getElementById('start').disabled,{},{timeout:90000});
 assert.equal(await page.locator('#setup').isVisible(),true);assert.equal(await page.locator('#minutes').inputValue(),'1');assert.equal(await page.locator('#seconds').inputValue(),'0');assert.equal(await page.locator('[data-mode="mindfulness"]').getAttribute('aria-pressed'),'true');
 // Keep the cat artwork unavailable briefly: the QR countdown must not start
 // consuming its minute before the character and glass are ready.
 let release;const gate=new Promise(resolve=>{release=resolve;});
 await page.route('**/assets/cat-smooth.skin',async route=>{await gate;await route.continue();});
 const qrURL=new URL('?mode=mindfulness&duration=60&start=1',base).href;
 await page.goto(qrURL);await page.waitForTimeout(300);assert.equal(await page.locator('#start').isDisabled(),true);assert.equal(await page.locator('#timer').isVisible(),false);release();
 await page.waitForFunction(()=>!document.getElementById('start').disabled&&!document.getElementById('timer').hidden,{},{timeout:90000});
 assert.equal(await page.locator('#setup').isVisible(),false);assert.equal(await page.evaluate(()=>document.body.classList.contains('mindfulness')),true);
 assert.match(await page.locator('#readout').textContent(),/^(1:00|0:59) remaining$/);
 await mkdir('test-results',{recursive:true});await page.screenshot({path:'test-results/qr-mindfulness-running.png'});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.locator('#pause').click();const held=await page.locator('#readout').textContent();await page.waitForTimeout(250);assert.equal(await page.locator('#readout').textContent(),held);
 await page.clock.install();await page.locator('#restart').click();await page.clock.runFor(100);assert.equal(await page.locator('#readout').textContent(),'1:00 remaining');
 await page.clock.fastForward(61000);await page.clock.runFor(3200);assert.equal(await page.locator('#completion').isVisible(),true);await page.screenshot({path:'test-results/qr-mindfulness-complete.png'});
 await page.locator('#cancel').click();await page.clock.runFor(100);assert.equal(await page.locator('#setup').isVisible(),true);assert.equal(await page.locator('#minutes').inputValue(),'1');
 assert.deepEqual(errors,[]);const result={url:qrURL,checks:['manual preset link','automatic start without a button press','wait for artwork before starting','one-minute duration','mindfulness selection','mobile layout','pause','restart at one minute','completion and namaste','cancel returns to setup'],errors};await writeFile('test-results/timer-links.json',JSON.stringify(result,null,2));console.log(result);
}finally{await browser.close();}
