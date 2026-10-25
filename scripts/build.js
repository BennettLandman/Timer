import {mkdir,cp,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
for(const item of ['index.html','src'])await cp(item,`dist/${item}`,{recursive:true});
console.log('Static production build ready in dist/. No dependencies or network resources.');
