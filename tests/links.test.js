import {test} from 'node:test';
import assert from 'node:assert/strict';
import {timerFromLink} from '../src/links.js';
import {MAX_SECONDS} from '../src/clock.js';
test('the QR link selects a one-minute mindfulness timer and requests autostart',()=>{
 assert.deepEqual(timerFromLink('?mode=mindfulness&duration=60&start=1'),{mode:'mindfulness',seconds:60,autostart:true});
});
test('links support every mode, duration bounds, and an optional manual start',()=>{
 for(const mode of ['analog','digital','mindfulness'])for(const seconds of [1,60,MAX_SECONDS])assert.deepEqual(timerFromLink(`?mode=${mode}&duration=${seconds}`),{mode,seconds,autostart:false});
 for(const flag of ['0','true','yes'])assert.equal(timerFromLink(`?mode=mindfulness&duration=60&start=${flag}`).autostart,false);
});
test('malformed and unrelated link parameters leave the normal setup unchanged',()=>{
 for(const search of ['', '?v=2.3.2','?mode=mindfulness','?duration=60','?mode=unknown&duration=60',...['0','-1','1.5','Infinity','NaN','1e2','60000','9007199254740993'].map(d=>`?mode=mindfulness&duration=${d}&start=1`)])assert.equal(timerFromLink(search),null,search);
});
