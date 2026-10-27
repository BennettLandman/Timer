import {spawnSync} from 'node:child_process';
import {readFile,writeFile} from 'node:fs/promises';
const checks=[['--test',...['animation','build','clock','depth','smooth-skins','boredom','mindfulness','links'].map(n=>`tests/${n}.test.js`)],['scripts/build.js'],...['browser','sequences','anatomy','motion','analog-visibility','bored-cat','gesture-preview','gaits','rig-motion','performance','mindfulness','homepage-preview','timer-links','sunrise','production'].map(n=>[`tests/${n}.mjs`])];
for(const args of checks){const result=spawnSync(process.execPath,args,{stdio:'inherit',env:process.env});if(result.status!==0)process.exit(result.status||1);}
const report={version:JSON.parse(await readFile('package.json')).version,date:new Date().toISOString().slice(0,10),unitTests:52,checks:checks.map(args=>args.join(' ')),browsers:'Installed desktop Chrome; mobile viewport emulation',results:{}};
for(const name of ['browser-results','sequence-results','anatomy-results','motion-results','analog-visibility','bored-cat','gesture-preview','gaits','rig-motion-results','performance','mindfulness','homepage-preview','timer-links','sunrise'])report.results[name]=JSON.parse(await readFile(`test-results/${name}.json`));
await writeFile(`docs/verification-${report.version}.json`,JSON.stringify(report,null,2)+'\n');
console.log(`All release checks passed. Evidence: docs/verification-${report.version}.json`);
