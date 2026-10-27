import {mkdir,cp,rm,readdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
async function sourceFiles(directory){
 const entries=await readdir(directory,{withFileTypes:true}),files=[];
 for(const entry of entries){const path=`${directory}/${entry.name}`;if(entry.isDirectory())files.push(...await sourceFiles(path));else if(entry.isFile())files.push(path);}
 return files.sort();
}
// A new HTML page must never reuse an older cached module graph. Give the
// entire source tree one content-addressed directory; relative imports and
// artwork URLs then stay together without rewriting any JavaScript.
const files=['index.html',...await sourceFiles('src')],hash=createHash('sha256');
for(const file of files){hash.update(file+'\0');hash.update(await readFile(file));hash.update('\0');}
const fingerprint=hash.digest('hex').slice(0,12),assetRoot=`src/${fingerprint}/`;
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
await cp('src',`dist/${assetRoot}`,{recursive:true});
const html=(await readFile('index.html','utf8')).replaceAll('href="src/',`href="${assetRoot}`).replaceAll('src="src/',`src="${assetRoot}`);
await writeFile('dist/index.html',html);
console.log(`Static production build ready in dist/. Assets: ${assetRoot}. No dependencies or network resources.`);
