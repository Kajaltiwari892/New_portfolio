import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

function harness(url, blocked=false) {
  const storage=new Map(), result={exports:{}}, replaced=[];
  const source=readFileSync(new URL('../src/lib/analytics-preferences.ts',import.meta.url),'utf8');
  vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports:result.exports,URL,location:{href:url},history:{state:null,replaceState:(_s,_t,path)=>replaced.push(path)},localStorage:{getItem:key=>{if(blocked)throw Error();return storage.get(key);},setItem:(key,value)=>{if(blocked)throw Error();storage.set(key,value);}}});
  return {...result.exports,storage,replaced};
}
test('the phone setup link excludes immediately and removes only the setup parameter',()=>{
  const h=harness('https://portfolio.example/?analytics=off&utm_source=instagram#work');
  assert.match(h.initializeAnalyticsPreferences(),/excluded/);assert.equal(h.browserIsExcluded(),true);
  assert.equal(h.storage.get('portfolio-analytics-exclude'),'true');assert.deepEqual(h.replaced,['/?utm_source=instagram#work']);
});
test('ordinary visits do not change preferences, and URLs cannot re-enable tracking',()=>{
  for(const url of ['https://portfolio.example/','https://portfolio.example/?analytics=on']) {const h=harness(url);assert.equal(h.initializeAnalyticsPreferences(),null);assert.equal(h.storage.size,0);}
  const h=harness('https://portfolio.example/?analytics=on');h.excludeThisBrowser();h.initializeAnalyticsPreferences();assert.equal(h.browserIsExcluded(),true);
});
test('blocked storage fails closed and explains that exclusion cannot be saved',()=>{
  const h=harness('https://portfolio.example/?analytics=off',true);assert.match(h.initializeAnalyticsPreferences(),/blocked saving/);assert.equal(h.browserIsExcluded(),true);
});
