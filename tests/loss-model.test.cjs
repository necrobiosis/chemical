const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const M = require('../assets/loss-model.js');
const context = vm.createContext({window:{}});
for(const file of ['news','loss-insights']) vm.runInContext(fs.readFileSync(path.join(__dirname,'../data/'+file+'.js'),'utf8'),context);
const news = context.window.CURATED_NEWS, library = context.window.LOSS_INSIGHTS;
const model = M.create(news,library), id='intl-geelong-refinery-2026-04';
test('账面核销保留澳元与明确口径，不冒充总损失或赔款',()=>{
 const data=model.insight(model.get(id));
 assert.equal(data.lossAmounts[0].currency,'AUD');
 assert.equal(data.lossAmounts[0].amount,19400000);
 assert.equal(data.lossAmounts[0].type,'asset_writeoff');
 assert.match(data.fields.damage.value,/不是总损失/);
 assert.equal(data.fields.failure.status,'preliminary');
 assert.equal(data.fields.rootCause.status,'unknown');
 assert.equal(data.fields.human.status,'unknown');
});
test('每条事故都有结构；已披露字段、金额及时间线引用真实来源ID',()=>{
 for(const n of news.filter(n=>n.category==='incident')){
  const data=model.insight(n);
  assert.equal(Object.keys(data.fields).length,11,n.id);
  assert.ok(data.brief,n.id);
  const ids=new Set(data.sources.map(s=>s.id));
  for(const [key,fact]of Object.entries(data.fields)){
   assert.ok(M.states[fact.status],n.id+key);
   if(fact.status!=='unknown')assert.ok(fact.sources.length>0,n.id+key+' missing evidence');
   for(const source of fact.sources)assert.ok(ids.has(source),n.id+source);
  }
  for(const amount of data.lossAmounts||[]){assert.ok(amount.amount>0);assert.ok(ids.has(amount.source));assert.ok(amount.scope);}
  for(const item of data.timeline||[])for(const source of item.sources)assert.ok(ids.has(source));
 }
});
test('Geelong关联最多三个真实案件，排除自身；每条说明共性和差异',()=>{
 const rel=model.related(model.get(id));
 assert.equal(rel.length,3);
 assert.equal(rel[0].id,'intl-pes-alkylation-2019-06');
 for(const r of rel){assert.notEqual(r.id,id);assert.ok(model.get(r.id));assert.ok(r.reason);assert.ok(r.difference);}
 const geelong=model.insight(model.get(id));
 assert.ok(!geelong.facets.mechanism.includes('corrosion'));
 for(const n of news)assert.ok(model.related(n).length<=3);
});
test('未知数据保持未知，不填零金额；同一新闻不关联自身',()=>{
 const fake={id:'new-unverified',title:'一则待核实的事故',category:'incident'};
 const data=model.insight(fake);
 assert.equal(data.fields.damage.status,'unknown');
 assert.equal(data.lossAmounts,undefined);
 assert.equal(data.reviewedAt,undefined);
 assert.equal(model.related(fake).length,0);
});
