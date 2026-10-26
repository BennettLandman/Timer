import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--no-sandbox']});
try{
 const page=await browser.newPage();await page.goto('http://127.0.0.1:8080/docs/rig-proof/');
 const specs=await page.evaluate(async()=>{
  const {createAnimal}=await import('/src/characters/cast.js'),{skinSpec}=await import('/src/characters/skin-spec.js'),{species}=await import('/src/art.js');
  const specs=[];for(const type of species.filter(s=>s!=='cat'&&s!=='fox'))specs.push(skinSpec(await createAnimal(type,{source:true}),type));return specs;
 });
 for(const spec of specs){await writeFile(new URL(`../src/characters/assets/${spec.type}-skin.spec.json`,import.meta.url),JSON.stringify(spec));console.log(spec.type,spec.shapes.length);}
}finally{await browser.close();}
