import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { webcrypto } from 'node:crypto';
import ts from 'typescript';

function harness({ hostname='portfolio.example', path='/', dnt='0', gpc=false, exclude=false, enabled=true, legacyDecline=false, storageBlocked=false, identityGate }={}) {
  const storage=new Map(exclude ? [['portfolio-analytics-exclude','true']] : []);
  if(legacyDecline) storage.set('portfolio-analytics-consent','declined');
  const sent=[], timers=new Map(); let sdkLoads=0, identities=0, forgotten=0, nextTimer=0, now=Date.now();
  const model={exports:{}};
  const compile=source=>ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText;
  vm.runInNewContext(compile(readFileSync(new URL('../src/lib/analytics-model.ts',import.meta.url),'utf8')),{exports:model.exports,Date,Map,Set,Object});
  const module={exports:{}};
  const fakeStore={visitorIdentity:async()=>{identities++; await identityGate; return 'anonymous-test-visitor';},storeEvents:async rows=>sent.push(...rows),forgetVisitor:async()=>{forgotten++;}};
  const source=readFileSync(new URL('../src/lib/analytics.ts',import.meta.url),'utf8').replaceAll('import.meta.env','({})');
  const sandbox={exports:module.exports,require:name=> {
    if(name==='./analytics-model') return model.exports;
    if(name==='@/data/firebase-public-config.json') return {default:{analyticsEnabled:enabled,analyticsHosts:['portfolio.example']}};
    if(name==='./analytics-store') {sdkLoads++; return fakeStore;}
    throw new Error(name);
  },crypto:webcrypto,window:new EventTarget(),Event,location:{hostname,pathname:path},navigator:{doNotTrack:dnt,globalPrivacyControl:gpc},document:{referrer:'https://github.com/a/private-path?email=secret'},innerWidth:390,URL,
  localStorage:{getItem:key=>{if(storageBlocked) throw new Error('Storage blocked');return storage.get(key)??null;},setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)},
  Date:class extends Date {static now(){return now;}},setTimeout:fn=>{const id=++nextTimer;timers.set(id,fn);return id;},clearTimeout:id=>timers.delete(id)};
  vm.runInNewContext(compile(source),sandbox);
  return {api:module.exports,sent,storage,sandbox,advance:ms=>now+=ms,get loads(){return sdkLoads;},get identities(){return identities;},get forgotten(){return forgotten;},async flush(){module.exports.flushAnalytics();await new Promise(setImmediate);await new Promise(setImmediate);}};
}

test('a disabled rollout never loads Firebase or creates an identity',async()=>{
  const h=harness({enabled:false});h.api.trackPage('home');await h.flush();
  assert.equal(h.loads,0);assert.equal(h.identities,0);assert.equal(h.sent.length,0);
});

test('a privacy preference enabled during identity creation signs it out without sending',async()=>{
  let finish;const identityGate=new Promise(resolve=>{finish=resolve;});
  const h=harness({identityGate});h.api.trackPage('home');await h.flush();
  assert.equal(h.identities,1);h.sandbox.navigator.doNotTrack='1';await h.flush();assert.equal(h.forgotten,0);
  finish();await h.flush();assert.equal(h.sent.length,0);assert.equal(h.forgotten,1);
});
test('a new visit records automatically without a consent choice and only sends allowlisted fields',async()=>{
  const h=harness();h.api.trackPage('home');h.api.trackEvent('resume_open','resume');await h.flush();
  assert.equal(h.storage.has('portfolio-analytics-consent'),false);
  assert.equal(h.identities,1);assert.equal(h.sent.length,2);
  assert.equal(h.sent[0].referrer,'github.com');assert.equal(h.sent[0].device,'mobile');
  assert.deepEqual(Object.keys(h.sent[0]).sort(),['v','id','visitorId','sessionId','pageViewId','name','target','page','at','device','referrer'].sort());
});
test('browser privacy, earlier declines, blocked storage, owner, local hosts and admin never emit events',async()=>{
  for(const options of [{dnt:'1'},{gpc:true},{legacyDecline:true},{storageBlocked:true},{exclude:true},{hostname:'localhost'},{hostname:'127.0.0.1'},{hostname:'unknown.example'},{path:'/admin'},{path:'/admin/'}]) {
    const h=harness(options);h.api.trackPage('home');await h.flush();assert.equal(h.loads,0);assert.equal(h.sent.length,0);
  }
});
test('a privacy change before flush drops queued events without loading Firebase',async()=>{
  const h=harness();h.api.trackPage('home');h.sandbox.navigator.globalPrivacyControl=true;await h.flush();
  assert.equal(h.sent.length,0);assert.equal(h.loads,0);
  h.sandbox.navigator.globalPrivacyControl=false;h.api.trackPage('home');await h.flush();assert.equal(h.sent.length,1);
});
test('visible sections deduplicate per page view and visits expire after 30 minutes',async()=>{
  const h=harness();h.api.trackPage('home');h.api.trackEvent('section_view','work',true);h.api.trackEvent('section_view','work',true);h.api.trackEvent('project_view','unknown-project',true);await h.flush();
  assert.equal(h.sent.length,2);const session=h.sent[0].sessionId;
  h.advance(31*60_000);h.api.trackEvent('resume_open','resume');await h.flush();
  assert.equal(h.sent.length,4);assert.equal(h.sent[2].name,'page_view');assert.notEqual(h.sent[2].sessionId,session);
});
