#!/usr/bin/env node
// 按 data/sources.js 抓取各信息源，归类到 cn/asia/intl 三大板块，标记“重大”动态，
// 与上一次结果合并去重后写入 data/feeds.js。无第三方依赖，需 Node 18+。
// 用法：node scripts/fetch-feeds.mjs
// 可选环境变量：RSSHUB_BASE（X 博主）、以及 sources.js 中 ${...} 引用的任意变量（如公众号 RSS 服务地址）
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outFile = path.join(root, "data/feeds.js");

const readAssigned = async (file) => {
  const text = await readFile(path.join(root, file), "utf8");
  const start = text.search(/window\.\w+\s*=/);
  return JSON.parse(text.slice(text.indexOf("=", start) + 1, text.lastIndexOf(";")));
};
const config = await readAssigned("data/sources.js");
const previous = await readAssigned("data/feeds.js").catch(() => ({ items: {} }));

/* ---------- 地址构造 ---------- */
const gnews = (q, lang) => {
  const loc = lang === "zh" ? "hl=zh-CN&gl=CN&ceid=CN:zh-Hans" : "hl=en-US&gl=US&ceid=US:en";
  return `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&${loc}`;
};
const fillEnv = (s) => {
  let missing = false;
  const out = s.replace(/\$\{(\w+)\}/g, (_, k) => {
    if (!process.env[k]) missing = true;
    return (process.env[k] || "").replace(/\/$/, "");
  });
  return missing ? "" : out;
};
function feedUrl(src) {
  if (src.type === "site") return gnews(`site:${src.site}${src.query ? ` (${src.query})` : ""} when:7d`, src.lang);
  if (src.type === "query") return gnews(`${src.query} when:7d`, src.lang);
  return src.rss ? fillEnv(src.rss) : "";
}

/* ---------- RSS / Atom 解析 ---------- */
const decode = (s) =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
const tag = (xml, name) => {
  const m = xml.match(new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return m ? decode(m[1]) : "";
};
const atomLink = (xml) => {
  const m = xml.match(/<link\b[^>]*rel=["']alternate["'][^>]*>/i) || xml.match(/<link\b[^>]*href=[^>]*>/i);
  const h = m && m[0].match(/href=["']([^"']+)["']/i);
  return h ? decode(h[1]) : "";
};

function parse(xml, src) {
  const blocks = [...xml.matchAll(/<item\b[\s\S]*?<\/item>|<entry\b[\s\S]*?<\/entry>/gi)].map((m) => m[0]);
  return blocks
    .map((b) => {
      const isAtom = /^<entry/i.test(b);
      let title = tag(b, "title");
      let source = tag(b, "source");
      // Google News 标题末尾带 " - 来源"
      if (source && title.endsWith(` - ${source}`)) title = title.slice(0, -(source.length + 3));
      if (src.type === "x" && title.length > 140) title = title.slice(0, 138) + "…";
      const date = new Date(tag(b, "pubDate") || tag(b, "published") || tag(b, "updated") || tag(b, "dc:date"));
      return {
        title,
        url: isAtom ? atomLink(b) : tag(b, "link") || atomLink(b),
        source: src.type === "site" || src.type === "query" ? source || src.name : src.name,
        date: isNaN(date) ? null : date.toISOString(),
      };
    })
    .filter((i) => i.title && /^https?:\/\//.test(i.url));
}

/* ---------- 板块归类与重大标记 ---------- */
const ASIA = /印度|日本|韩国|新加坡|泰国|印尼|印度尼西亚|马来西亚|越南|菲律宾|台湾|香港|巴基斯坦|孟加拉|India|Indian|Japan|Japanese|Korea|Korean|Singapore|Thailand|Thai|Indonesia|Malaysia|Vietnam|Philippine|Taiwan|Hong Kong|Pakistan|Bangladesh|Gujarat|Telangana|Andhra|Maharashtra|Ulsan|Yeosu|Daesan|Jurong|Map Ta Phut/i;
const CN = /China|Chinese|Sinopec|PetroChina|CNOOC|Rongsheng|Hengli|Wanhua|Shandong|Jiangsu|Zhejiang|Guangdong|Fujian|Shanghai|Beijing|Tianjin|Inner Mongolia|Ningxia|Xinjiang|Shaanxi|Hubei|Sichuan|Liaoning|Yulin/i;
const INTL_ZH = /美国|欧洲|德国|英国|法国|荷兰|比利时|意大利|中东|沙特|伊朗|墨西哥|巴西|俄罗斯|加拿大|澳大利亚/;
function classify(src, title) {
  if (src.region !== "auto") return src.region;
  if (/[一-龥]/.test(title)) return ASIA.test(title) ? "asia" : INTL_ZH.test(title) ? "intl" : "cn";
  if (CN.test(title)) return "cn";
  if (ASIA.test(title)) return "asia";
  return "intl";
}
const M = config.major;
function score(src, title) {
  const t = title.toLowerCase();
  let s = M.tierWeight[src.tier] || 0;
  const hit = (list, w) => list.forEach((k) => t.includes(k.toLowerCase()) && (s += w));
  hit(M.strong, 2);
  hit(M.medium, 1);
  return s;
}

/* ---------- 抓取 ---------- */
async function fetchText(url) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 chem-news-hub/1.0" }, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

const status = {};
const fresh = [];
const queue = config.sources.slice();
const workers = Array.from({ length: 4 }, async () => {
  for (let src; (src = queue.shift()); ) {
    const url = feedUrl(src);
    if (!url) {
      status[src.id] = { state: "unconfigured" };
      continue;
    }
    try {
      const items = parse(await fetchText(url), src);
      items.forEach((i) => {
        const region = classify(src, i.title);
        const sc = score(src, i.title);
        fresh.push({ ...i, region, sid: src.id, type: src.type, tier: src.tier, score: sc, major: sc >= M.threshold });
      });
      status[src.id] = { state: "ok", count: items.length, at: new Date().toISOString() };
      console.log(`✓ ${src.name}: ${items.length}`);
    } catch (e) {
      status[src.id] = { state: "error", error: e.message, at: new Date().toISOString() };
      console.warn(`✗ ${src.name}: ${e.message}`);
    }
  }
});
await Promise.all(workers);

const okCount = Object.values(status).filter((s) => s.state === "ok").length;
if (okCount === 0) {
  console.error("没有任何信息源抓取成功，保留原有 data/feeds.js");
  process.exit(1);
}

/* ---------- 合并去重 ---------- */
const cutoff = Date.now() - config.maxAgeDays * 86400000;
const norm = (t) => t.toLowerCase().replace(/[\s\p{P}\p{S}]/gu, "").slice(0, 60);
const items = { cn: [], asia: [], intl: [] };
const seen = new Set();
const prevItems = Object.values(previous.items || {}).flat();
[...fresh, ...prevItems]
  .filter((i) => items[i.region] && (!i.date || Date.parse(i.date) >= cutoff))
  .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
  .forEach((i) => {
    const k = norm(i.title);
    if (seen.has(k)) return;
    seen.add(k);
    items[i.region].push(i);
  });
for (const r of Object.keys(items)) items[r] = items[r].slice(0, config.maxPerRegion);

const payload = { updated: new Date().toISOString(), status, items };
await writeFile(outFile, `// 由 scripts/fetch-feeds.mjs 自动生成，请勿手工编辑\nwindow.AUTO_FEEDS = ${JSON.stringify(payload, null, 1)};\n`);
const majors = Object.values(items).flat().filter((i) => i.major).length;
console.log(`成功 ${okCount}/${config.sources.length} 个信息源；重大 ${majors} 条；已写入 data/feeds.js`);
