import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--no-sandbox']});
try{
 const p=await browser.newPage({viewport:{width:1100,height:800}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:8080/');await p.waitForFunction(()=>!document.getElementById('start').disabled,{},{timeout:90000});
 const result=await p.evaluate(async()=>{
  const T=await import('/src/characters/vendor/three.module.js'),{createCat}=await import('/src/characters/cat.js'),{catBoredPose,catIdlePose}=await import('/src/characters/rig.js'),{Scene}=await import('/src/scenes.js'),{boredMoment,diversions}=await import('/src/boredom.js');
  const cat=await createCat();let footError=0,handError=0,freeError=0,minElbow=180,maxElbow=0,boundaryError=0;
  const snapshot=()=>Object.values(cat.userData.joints).flatMap(b=>[...b.position.toArray(),...b.quaternion.toArray()]);
  for(const type of diversions){const duration=type==='watch'?8.5:type==='yoga'?10:9;
   for(let t=0;t<=duration;t+=.1){const state=catBoredPose(cat,18+t,{type,local:t,duration}),left=cat.userData.joints['hind-left-3'].getWorldPosition(new T.Vector3()),right=cat.userData.joints['hind-right-3'].getWorldPosition(new T.Vector3()),expected=new T.Vector3(.39,.105,.30).lerp(new T.Vector3(.055,.53,.23),state.lift);
    footError=Math.max(footError,left.distanceTo(new T.Vector3(-.32,.105,.28)),right.distanceTo(expected));handError=Math.max(handError,cat.userData.contact.getWorldPosition(new T.Vector3()).distanceTo(state.handTarget));freeError=Math.max(freeError,cat.userData.joints['rest-3'].getWorldPosition(new T.Vector3()).distanceTo(state.freeTarget));const flex=state.anatomy.elbowFlex*180/Math.PI;minElbow=Math.min(minElbow,flex);maxElbow=Math.max(maxElbow,flex);
   }
   for(const local of [0,duration]){catIdlePose(cat,22);const base=snapshot();catBoredPose(cat,22,{type,local,duration});boundaryError=Math.max(boundaryError,...snapshot().map((v,i)=>Math.abs(v-base[i])));}
  }
  catBoredPose(cat,22,{type:'watch',local:3,duration:8.5});const expected=snapshot();catBoredPose(cat,35,{type:'yoga',local:6,duration:10});catBoredPose(cat,22,{type:'watch',local:3,duration:8.5});const seekError=Math.max(...snapshot().map((v,i)=>Math.abs(v-expected[i])));
  const cv=document.createElement('canvas');cv.width=1000;cv.height=600;cv.id='bored-cat';cv.style='width:1000px;height:600px;position:fixed;inset:0;background:#e0e9d7;z-index:99999';document.body.append(cv);window.boredCanvas=cv;
  const samples=[];
  for(const type of diversions){let seed=0;for(;seed<1000;seed++){let state=boredMoment({seed,minute:5,age:28});if(state?.type===type)break;}const scene=new Scene();scene.boredSeed=seed;scene.draw(cv,{remaining:300,initial:300,time:0});scene.draw(cv,{remaining:272,initial:300,time:28});const action=scene.analogAction.moment;samples.push({type,seed,time:action.start+4});}
  const priority=new Scene();priority.boredSeed=samples[0].seed;priority.draw(cv,{remaining:300,time:0});priority.draw(cv,{remaining:272,time:28,reduced:true});const reduced=priority.analogAction.moment===null;priority.draw(cv,{remaining:60,time:240});const final=priority.analogAction.moment===null;
  return {footError,handError,freeError,minElbow,maxElbow,boundaryError,seekError,samples,reduced,final};
 });
 assert.ok(result.footError<.005,`Planted and lifted paw targets must be reachable: ${result.footError}`);assert.ok(result.handError<.005,`Right hand target is unreachable: ${result.handError}`);assert.ok(result.freeError<.005,`Left wrist target is unreachable: ${result.freeError}`);assert.ok(result.minElbow>=9.9&&result.maxElbow<=145.1);assert.ok(result.boundaryError<1e-6);assert.equal(result.seekError,0);assert.equal(result.reduced,true);assert.equal(result.final,true);
 for(const {type,seed,time}of result.samples){await p.evaluate(async({seed,time})=>{const {Scene}=await import('/src/scenes.js');const scene=new Scene();scene.boredSeed=seed;scene.draw(boredCanvas,{remaining:300,time:0});scene.draw(boredCanvas,{remaining:300-time,initial:300,time});},{seed,time});await p.locator('#bored-cat').screenshot({path:`test-results/bored-${type}.png`});}
 assert.deepEqual(errors,[]);await writeFile('test-results/bored-cat.json',JSON.stringify(result,null,2));console.log(result);
}finally{await browser.close();}
