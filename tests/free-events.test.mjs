import test from 'node:test';
import assert from 'node:assert/strict';
import { CATALOG, catalogEntries, publicRecording } from '../scripts/lib/free-events.mjs';

test('只从明确免费的官方目录发现回放，拒绝外站链接', () => {
  const entry = url => `<a href="${url}"><p class="thumbnail-list-panel__title">Battery &amp; Process Safety</p></a>`;
  const free = 'The recordings are available below to view free of charge.';
  assert.deepEqual(catalogEntries(free + entry(CATALOG + 'battery/') + entry('https://example.com/safety-centre/webinars/trap/')), [{ title: 'Battery & Process Safety', url: CATALOG + 'battery/' }]);
  assert.throws(() => catalogEntries(entry(CATALOG + 'battery/')));
});

test('正文必须有公开播放器；免费直播的会员回放不收录', () => {
  const player = '<iframe src="https://player.vimeo.com/video/123"></iframe>';
  assert.equal(publicRecording('<nav>Member-exclusive content</nav><h1>Battery hazards</h1>' + player), true);
  assert.equal(publicRecording('<h1>Battery hazards</h1><p>Member-exclusive content</p>' + player), false);
  assert.equal(publicRecording('<h1>Battery hazards</h1><p>Free live webinar; recording unavailable</p>'), false);
});
