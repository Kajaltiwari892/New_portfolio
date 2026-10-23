// Local visual test fixture only. Vite's production build has no entry for this page.
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AdminDashboard } from '../src/admin/AdminPage';
import { presetRange, type AnalyticsEvent, type ReportSettings } from '../src/lib/analytics-model';
import '../src/tailwind.css';
import '../src/style.css';
import '../src/studio-theme.css';

function Fixture() {
  const [range,setRange]=useState(presetRange(30));
  const [mode,setMode]=useState('populated');
  const [fixtureNow]=useState(Date.now);
  const [settings,setSettings]=useState<ReportSettings>({cleanFrom:null,excludedVisitorIds:[]});
  const rows: AnalyticsEvent[] = Array.from({length:36},(_,i)=>({v:1,id:`fixture-${i}`,visitorId:`${(i%12)%8}-browser-fixture`,sessionId:`${i%12}-visit-fixture`,pageViewId:`page-${i}`,name:i<24?'page_view':i<28?'project_view':'resume_open',target:i<24?'home':i<28?'resumeiq':'resume',page:'home',at:fixtureNow-(i%14)*86400000,device:i%2?'mobile':'desktop',referrer:i%3?'':'github.com'}));
  return <><div style={{padding:12,background:'#ffe3ac',color:'#382e21',textAlign:'center'}}>LOCAL TEST FIXTURE — synthetic data, no database writes. <select aria-label="Fixture state" value={mode} onChange={e=>setMode(e.target.value)}>{['populated','empty','loading','error'].map(v=><option key={v}>{v}</option>)}</select></div><AdminDashboard settings={settings} onStartClean={()=>setSettings(s=>({...s,cleanFrom:Date.now()}))} onExclude={(id,excluded)=>setSettings(s=>({...s,excludedVisitorIds:excluded?[...s.excludedVisitorIds,id]:s.excludedVisitorIds.filter(v=>v!==id)}))} events={mode==='populated'?rows:[]} range={range} onRange={setRange} loading={mode==='loading'} error={mode==='error'?'Analytics could not load. Please try again.':''} updatedAt={Date.now()} onRefresh={()=>{}} onSignOut={()=>{}}/></>;
}
createRoot(document.getElementById('root')!).render(<Fixture/>);
