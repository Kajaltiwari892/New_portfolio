import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { webcrypto } from 'node:crypto';
import ts from 'typescript';

function harness({ hostname='portfolio.example', path='/', dnt='0', gpc=false, exclude=false }={}) {
  const storage=new Map(exclude ? [['portfolio-analytics-exclude','true']] : []);
  const sent=[], timers=new Map(); let sdkLoads=0, identities=0, nextTimer=0, now=Date.now();
  const model={exports:{}};
  const compile=source=>ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText;
  vm.runInNewContext(compile(readFileSync(new URL('../src/lib/analytics-model.ts',import.meta.url),'utf8')),{exports:model.exports,Date,Map,Set,Object});
  const module={exports:{}};
  const fakeStore={visitorIdentity:async()=>{identities++; return 'anonymous-test-visitor';},storeEvents:async rows=>sent.push(...rows),forgetVisitor:async()=>{}};
  const source=readFileSync(new URL('../src/lib/analytics.ts',import.meta.url),'utf8').replaceAll('import.meta.env','({})');
  const sandbox={exports:module.exports,require:name=> {
    if(name==='./analytics-model') return model.exports;
    if(name==='@/data/firebase-public-config.json') return {default:{analyticsEnabled:true,analyticsHosts:['portfolio.example']}};
    if(name==='./analytics-store') {sdkLoads++; return fakeStore;}
    throw new Error(name);
  },crypto:webcrypto,window:new EventTarget(),Event,location:{hostname,pathname:path},navigator:{doNotTrack:dnt,globalPrivacyControl:gpc},document:{referrer:'https://github.com/a/private-path?email=secret'},innerWidth:390,URL,
  localStorage:{getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)},
  Date:class extends Date {static now(){return now;}},setTimeout:fn=>{const id=++nextTimer;timers.set(id,fn);return id;},clearTimeout:id=>timers.delete(id)};
  vm.runInNewContext(compile(source),sandbox);
  return {api:module.exports,sent,storage,sandbox,advance:ms=>now+=ms,get loads(){return sdkLoads;},get identities(){return identities;},async flush(){module.exports.flushAnalytics();await new Promise(setImmediate);await new Promise(setImmediate);}};
}
test('no Firebase identity or request before opt-in; only allowlisted fields after opt-in',async()=>{
  const h=harness();h.api.trackPage('home');h.api.trackEvent('resume_open','resume');await h.flush();
  assert.equal(h.loads,0);assert.equal(h.sent.length,0);
  h.api.setAnalyticsConsent(true);h.api.trackPage('home');h.api.trackEvent('resume_open','resume');await h.flush();
  assert.equal(h.identities,1);assert.equal(h.sent.length,2);
  assert.equal(h.sent[0].referrer,'github.com');assert.equal(h.sent[0].device,'mobile');
  assert.deepEqual(Object.keys(h.sent[0]).sort(),['v','id','visitorId','sessionId','pageViewId','name','target','page','at','device','referrer'].sort());
});
test('DNT, GPC, owner exclusion, localhost, unknown host and admin never emit events',async()=>{
  for(const options of [{dnt:'1'},{gpc:true},{exclude:true},{hostname:'localhost'},{hostname:'unknown.example'},{path:'/admin'}]) {
    const h=harness(options);h.api.setAnalyticsConsent(true);h.api.trackPage('home');await h.flush();assert.equal(h.loads,0);assert.equal(h.sent.length,0);
  }
});
test('withdrawal drops queued events and starts a new anonymous session after re-consent',async()=>{
  const h=harness();h.api.setAnalyticsConsent(true);h.api.trackPage('home');h.api.setAnalyticsConsent(false);await h.flush();assert.equal(h.sent.length,0);assert.equal(h.storage.has('portfolio-analytics-session'),false);
  h.api.setAnalyticsConsent(true);h.api.trackPage('home');await h.flush();assert.equal(h.sent.length,1);
});
test('visible sections deduplicate per page view and visits expire after 30 minutes',async()=>{
  const h=harness();h.api.setAnalyticsConsent(true);h.api.trackPage('home');h.api.trackEvent('section_view','work',true);h.api.trackEvent('section_view','work',true);h.api.trackEvent('project_view','unknown-project',true);await h.flush();
  assert.equal(h.sent.length,2);const session=h.sent[0].sessionId;
  h.advance(31*60_000);h.api.trackEvent('resume_open','resume');await h.flush();
  assert.equal(h.sent.length,4);assert.equal(h.sent[2].name,'page_view');assert.notEqual(h.sent[2].sessionId,session);
});
