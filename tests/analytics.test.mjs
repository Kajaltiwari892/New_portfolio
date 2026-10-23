import test from 'node:test';
import assert from 'node:assert/strict';
import { dateBounds, indiaDay, presetRange, summarizeAnalytics } from '../src/lib/analytics-model.ts';

const start = Date.parse('2026-10-22T00:00:00+05:30');
const row = (id, at, changes = {}) => ({ v: 1, id, at, visitorId: 'visitor-a', sessionId: 'visit-a', pageViewId: id, name: 'page_view', target: 'home', page: 'home', device: 'mobile', referrer: '', ...changes });
test('India dates include midnight and exclude the following midnight', () => {
  assert.equal(indiaDay(start - 1), '2026-10-21');
  assert.equal(indiaDay(start), '2026-10-22');
  assert.deepEqual(dateBounds('2026-10-22','2026-10-22'), {start, end: start + 86400000});
  assert.throws(() => dateBounds('2026-02-30','2026-03-01'));
  assert.throws(() => dateBounds('2026-01-01','2026-12-31'));
  assert.deepEqual(presetRange(7, start), {from:'2026-10-16',to:'2026-10-22'});
});
test('totals deduplicate event IDs and visitors across days, but retain separate visits', () => {
  const a = row('a',start), b = row('b',start+86400000,{sessionId:'visit-b'});
  const result = summarizeAnalytics([a,a,b,row('outside',start-1)],'2026-10-22','2026-10-23');
  assert.equal(result.visitors,1); assert.equal(result.visits,2); assert.equal(result.views,2);
  assert.deepEqual(result.daily.map(d => d.visitors),[1,1]);
});
test('section/project visibility counts visits; clicks and contact outcomes stay distinct', () => {
  const rows = [row('page',start), ...['section_view','section_view','project_view','project_view','project_details_open','project_link_click','contact_start','contact_submit_accepted','contact_submit_failed','resume_open'].map((name,i)=>row(String(i),start+i+1,{name,target: name==='section_view'?'work':name.startsWith('project')?'resumeiq':name==='resume_open'?'resume':'contact'}))];
  const result = summarizeAnalytics(rows,'2026-10-22','2026-10-22');
  assert.equal(result.sections.find(s=>s.target==='work').count,1);
  assert.deepEqual(result.projects.find(p=>p.target==='resumeiq'),{target:'resumeiq',viewed:1,details:1,website:1,code:0});
  assert.deepEqual(result.contact,{started:1,accepted:1,failed:1});
  assert.equal(result.resume,1); assert.equal(result.views,1);
});
