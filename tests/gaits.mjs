import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright');
const b=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--no-sandbox']});
try{
 const p=await b.newPage();await p.goto('http://127.0.0.1:8080/');await p.waitForFunction(()=>!document.getElementById('start').disabled,{},{timeout:90000});
 const result=await p.evaluate(async()=>{
  const {createAnimal,animalPose}=await import('/src/characters/cast.js'),T=await import('/src/characters/vendor/three.module.js'),{species}=await import('/src/art.js');const result={};
  for(const type of species.filter(s=>s!=='cat'&&s!=='fox'&&s!=='fish')){
   const model=await createAnimal(type);let error=0,plantError=0;const factor=type==='turtle'?.45:type==='rabbit'?1.05:.8;
   for(let i=0;i<40;i++){const time=i*.1,state=animalPose(model,time),limbs=model.userData.limbs,feet=limbs.map(l=>l.foot.getWorldPosition(new T.Vector3()));
    for(let j=0;j<limbs.length;j++){const e=state.feet[j];error=Math.max(error,feet[j].distanceTo(new T.Vector3(e.x,e.y,limbs[j].z)));}
    const next=animalPose(model,time+.001);for(let j=0;j<limbs.length;j++)if(state.feet[j].stance&&next.feet[j].stance){const actual=limbs[j].foot.getWorldPosition(new T.Vector3()),speed=limbs[j].stride/(.68*1.5)*factor;plantError=Math.max(plantError,actual.add(new T.Vector3(speed*.001,0,0)).distanceTo(feet[j]));}
   }result[type]={error,plantError};
  }return result;
 });
 for(const [type,r]of Object.entries(result)){assert.ok(r.error<.005,`${type} unreachable foot: ${r.error}`);assert.ok(r.plantError<.0001,`${type} sliding stance: ${r.plantError}`);}await writeFile('test-results/gaits.json',JSON.stringify(result,null,2));console.log('All 22 additional walking species have reachable, planted feet.');
}finally{await b.close();}
