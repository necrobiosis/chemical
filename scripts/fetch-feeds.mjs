#!/usr/bin/env node
// 抓取 RSS 新闻源，按板块（cn/asia/intl）去重合并，写入 data/feeds.js。
// 无第三方依赖，需 Node 18+。用法：node scripts/fetch-feeds.mjs
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const config = JSON.parse(await readFile(path.join(root, "scripts/feeds.config.json"), "utf8"));
const outFile = path.join(root, "data/feeds.js");

const decode = (s) =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&amp;/g, "&")
    .trim();

const tag = (xml, name) => {
  const m = xml.match(new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return m ? decode(m[1]) : "";
};

function parseItems(xml, feed) {
  return [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map(([item]) => {
    let title = tag(item, "title");
    const source = tag(item, "source");
    // Google News 标题末尾带 " - 来源"，去掉以免重复
    if (source && title.endsWith(` - ${source}`)) title = title.slice(0, -(source.length + 3));
    const date = new Date(tag(item, "pubDate"));
    return {
      title,
      url: tag(item, "link"),
      source,
      date: isNaN(date) ? null : date.toISOString(),
      label: feed.label,
    };
  }).filter((i) => i.title && /^https?:\/\//.test(i.url));
}

async function fetchFeed(feed) {
  const res = await fetch(feed.url, { headers: { "User-Agent": "chem-news-hub/1.0" }, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return parseItems(await res.text(), feed);
}

const cutoff = Date.now() - config.maxAgeDays * 86400000;
const items = { cn: [], asia: [], intl: [] };
let ok = 0;

for (const feed of config.feeds) {
  try {
    const got = await fetchFeed(feed);
    items[feed.region].push(...got);
    ok++;
    console.log(`✓ ${feed.region}/${feed.label}: ${got.length}`);
  } catch (e) {
    console.warn(`✗ ${feed.region}/${feed.label}: ${e.message}`);
  }
}

if (ok === 0) {
  console.error("所有新闻源均抓取失败，保留原有 data/feeds.js");
  process.exit(1);
}

const norm = (t) => t.toLowerCase().replace(/[\s\p{P}]/gu, "");
for (const region of Object.keys(items)) {
  const seen = new Set();
  items[region] = items[region]
    .filter((i) => !i.date || Date.parse(i.date) >= cutoff)
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .filter((i) => {
      const k = norm(i.title);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .slice(0, config.maxPerRegion);
}

const payload = { updated: new Date().toISOString(), items };
await writeFile(outFile, `// 由 scripts/fetch-feeds.mjs 自动生成，请勿手工编辑\nwindow.AUTO_FEEDS = ${JSON.stringify(payload, null, 2)};\n`);
console.log(`已写入 ${path.relative(root, outFile)}`);
