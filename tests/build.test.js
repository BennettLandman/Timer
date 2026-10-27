import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,readdir,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
test('a nested runtime change moves the entire build to a new cache namespace',async()=>{
 const root=await mkdtemp(join(tmpdir(),'timer-build-'));
 try{
  await mkdir(join(root,'src/modules'),{recursive:true});
  await writeFile(join(root,'index.html'),'<link href="src/style.css"><script type="module" src="src/app.js"></script>');
  await writeFile(join(root,'src/app.js'),"import './modules/scene.js';");
  await writeFile(join(root,'src/style.css'),'body{margin:0}');
  await writeFile(join(root,'src/modules/scene.js'),'export const version=1;');
  const build=()=>{const result=spawnSync(process.execPath,[fileURLToPath(new URL('../scripts/build.js',import.meta.url))],{cwd:root,encoding:'utf8'});assert.equal(result.status,0,result.stderr);};
  const fingerprint=async()=>{const html=await readFile(join(root,'dist/index.html'),'utf8'),match=html.match(/src\/([a-f0-9]{12})\/app\.js/);assert.ok(match);assert.ok(html.includes(`href="src/${match[1]}/style.css"`));return match[1];};
  build();const before=await fingerprint();build();assert.equal(await fingerprint(),before,'Identical inputs should reuse cached assets');
  await writeFile(join(root,'src/modules/scene.js'),'export const version=2;');
  build();const after=await fingerprint();assert.notEqual(after,before,'Even a nested module change must invalidate the complete graph');
  assert.deepEqual(await readdir(join(root,'dist/src')),[after]);
  for(const file of ['app.js','style.css','modules/scene.js'])assert.deepEqual(await readFile(join(root,'dist/src',after,file)),await readFile(join(root,'src',file)));
 }finally{await rm(root,{recursive:true,force:true});}
});
