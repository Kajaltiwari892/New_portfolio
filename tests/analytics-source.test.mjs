import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveVisitSource } from '../src/lib/analytics-source.ts';
test('known campaign tags win, while unknown tags cannot inject arbitrary data',()=>{
  assert.equal(resolveVisitSource('?utm_source=instagram','https://facebook.com/','portfolio.example').source,'Instagram');
  assert.equal(resolveVisitSource('?utm_source=someone@example.com','https://facebook.com/','portfolio.example').source,'Facebook');
});
test('genuine subdomains normalize without accepting lookalike hosts',()=>{
  for(const [host,expected] of [['l.instagram.com','Instagram'],['m.facebook.com','Facebook'],['github.com','GitHub'],['google.co.in','Google'],['facebook.com.attacker.example','Other website']]) {
    assert.equal(resolveVisitSource('',`https://${host}/private?x=secret`,'portfolio.example').source,expected);
  }
});
test('missing, internal, or malformed referrers stay unknown',()=>{
  for(const referrer of ['','invalid','https://portfolio.example/#about']) assert.deepEqual(resolveVisitSource('',referrer,'portfolio.example'),{source:'Direct / unknown',sourceKind:'unknown',referrer:''});
});
