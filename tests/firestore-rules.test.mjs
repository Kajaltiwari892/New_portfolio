import { before, after, beforeEach, test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { doc, collection, getDoc, getDocs, setDoc, deleteDoc, writeBatch, serverTimestamp, Timestamp } from 'firebase/firestore';

let env;
const uid = 'anonymous-visitor';
const event = (changes={}) => ({ v:1,id:randomUUID(),visitorId:uid,sessionId:randomUUID(),pageViewId:randomUUID(),name:'page_view',target:'home',page:'home',at:Date.now(),device:'mobile',referrer:'example.com',...changes });
const anonymous = () => env.authenticatedContext(uid,{firebase:{sign_in_provider:'anonymous'}}).firestore();
const account = (email='kanjal55567@gmail.com', verified=true, provider='google.com') => env.authenticatedContext('google-user',{email,email_verified:verified,firebase:{sign_in_provider:provider}}).firestore();
const send = (db, rows, budget={}) => { const batch=writeBatch(db); batch.set(doc(db,'analytics_writers',uid),{windowStart:serverTimestamp(),updatedAt:serverTimestamp(),count:rows.length,ids:rows.map(r=>r.id),...budget}); for(const row of rows) batch.set(doc(db,'analytics_events',row.id),row); return batch.commit(); };
before(async () => { env=await initializeTestEnvironment({projectId:'demo-portfolio',firestore:{host:'127.0.0.1',port:8089,rules:await readFile(new URL('../firestore.rules',import.meta.url),'utf8')}}); });
after(async () => { await env?.cleanup(); });
beforeEach(async () => { await env.clearFirestore(); });
test('only the verified owner Google identity can read events', async () => {
  await assertSucceeds(getDocs(collection(account(),'analytics_events')));
  for(const db of [account('other@example.com'),account(undefined,false),account(undefined,true,'password'),anonymous(),env.unauthenticatedContext().firestore()]) await assertFails(getDocs(collection(db,'analytics_events')));
});
test('a visitor can atomically write an event but cannot read it', async () => {
  const db=anonymous(), row=event(); await assertSucceeds(send(db,[row]));
  await assertFails(getDoc(doc(db,'analytics_events',row.id)));
  await assertSucceeds(getDoc(doc(account(),'analytics_events',row.id)));
});
test('reject missing quota updates, forged visitor IDs, extra personal fields, bad targets and old times', async () => {
  const db=anonymous(), row=event(); await assertFails(setDoc(doc(db,'analytics_events',row.id),row));
  for(const changes of [{visitorId:'someone-else'},{email:'do-not-store@example.com'},{target:'private-text'},{referrer:'https://example.com/?email=private'},{at:Date.now()-3600000},{at:Date.now()+300000},{name:'arbitrary-event'}]) await assertFails(send(db,[event(changes)]));
});
test('owner and unauthenticated clients cannot inject events', async () => {
  await assertFails(send(account(),[event()])); await assertFails(send(env.unauthenticatedContext().firestore(),[event()]));
});
test('events are immutable, while identical retries preserve one event', async () => {
  const db=anonymous(),row=event(); await assertSucceeds(send(db,[row]));
  const prior=(await getDoc(doc(db,'analytics_writers',uid))).data();
  await assertSucceeds(send(db,[row],{windowStart:prior.windowStart,count:2}));
  await assertFails(send(db,[{...row,device:'desktop'}],{windowStart:prior.windowStart,count:3}));
  await assertFails(deleteDoc(doc(account(),'analytics_events',row.id)));
});
test('limits batches to 20 and a writer to 60 events per minute', async () => {
  const db=anonymous(); await assertFails(send(db,Array.from({length:21},()=>event())));
  await assertSucceeds(send(db,Array.from({length:20},()=>event())));
  const prior=(await getDoc(doc(db,'analytics_writers',uid))).data();
  await assertSucceeds(send(db,Array.from({length:20},()=>event()),{windowStart:prior.windowStart,count:40}));
  await assertSucceeds(send(db,Array.from({length:20},()=>event()),{windowStart:prior.windowStart,count:60}));
  await assertFails(send(db,[event()],{windowStart:prior.windowStart,count:61}));
  await assertFails(send(db,[event()]));
});
test('expired write window may reset; other visitors cannot access its budget', async () => {
  await env.withSecurityRulesDisabled(async context => setDoc(doc(context.firestore(),'analytics_writers',uid),{windowStart:Timestamp.fromMillis(Date.now()-120000),updatedAt:Timestamp.now(),count:60,ids:[]}));
  await assertSucceeds(send(anonymous(),[event()]));
  const other=env.authenticatedContext('different-user',{firebase:{sign_in_provider:'anonymous'}}).firestore();
  await assertFails(getDoc(doc(other,'analytics_writers',uid)));
});
