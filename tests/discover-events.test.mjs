import test from 'node:test';
import assert from 'node:assert/strict';
import { candidateEvents, verifyLiveEvent } from '../scripts/lib/discover-events.mjs';
const c={Title:'International Process Safety Day',GroupName:'Safety',url:'https://www.icheme.org/training-events/whats-on-events-directory/international-process-safety-day/'};
const field=(k,v)=>`<span class="event-overview__label">${k}</span><span class="event-overview__val">${v}</span>`;
const page=(price='Free of charge, open to all.',location='Online: 09:00–17:00 GMT. Duration: 8 hours.',extra='')=>'<h1>Event</h1><ul class="event-overview">'+field('Date From','2nd December 2026')+field('Price',price)+field('Location',location)+'</ul>'+extra+'<a href="https://ipsd26.vfairs.com/">Register to attend</a>';
const now=Date.parse('2026-11-25T14:00:00Z');
test('时间范围解析使用开场时间，正确转换北京时间跨日',()=>{
 const {event}=verifyLiveEvent(page(),c,now);
 assert.equal(event.start,'2026-12-02T09:00:00.000Z');
 assert.equal(event.end,'2026-12-02T17:00:00.000Z');
 assert.equal(event.replayUrl,undefined);
});
test('排除付费、会员、线下、时区不明和已结束的活动',()=>{
 for(const html of [page('£20'),page('Free','London: 09:00 GMT. Duration: 1 hour.'),page('Free','Online: 09:00. Duration: 1 hour.'),page('Free',undefined,'<p>Member-exclusive content</p>')]) assert.equal(verifyLiveEvent(html,c,now).event,undefined);
 assert.equal(verifyLiveEvent(page(),c,Date.parse('2026-12-03T00:00:00Z')).event,undefined);
});
test('目录必须明确选中 Open to all，拒绝外站候选',()=>{
 assert.throws(()=>candidateEvents({Events:[]}));
 const e={Title:'Process safety',DateFrom:'2026-12-02T00:00:00',Url:'https://example.com/events/spoof'};
 assert.equal(candidateEvents({Events:[e],AccessFacets:[{Value:'Open to all',IsSelected:true}]},now).length,0);
});
