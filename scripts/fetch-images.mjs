#!/usr/bin/env node
// 为精选新闻中的事故从原始新闻报道中提取配图（只用报道里的真实照片，不生成图片）。
// 依次抓取每条事故的 imagePages / sources 网页，收集 og:image 与正文图片，
// 按“是否像现场照片”打分，下载最佳一张并压缩到 assets/news-img/<id>.jpg，
// 记录来源与候选列表到 data/images.js。
//
// 用法：node scripts/fetch-images.mjs [--force] [--candidates] [--only <id>]
//   --force       重新选图（忽略已有结果）
//   --candidates  额外保存前几名候选缩略图到 assets/news-img/candidates/，供人工挑选
// news.js 中可用的人工控制字段：
//   image: "https://..."   直接指定图片地址（须来自新闻报道），可配 imagePage 指明所在报道页
//   imagePick: 2           选用候选列表中的第 N 张（从 0 开始）
//   imageNone: true        原报道无现场图，不配图
// 依赖：sharp（npm i --no-save sharp）
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import vm from "node:vm";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const CANDIDATES = args.includes("--candidates");
const ONLY = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;
const IMG_DIR = path.join(root, "assets/news-img");
const CAND_DIR = path.join(IMG_DIR, "candidates");
const OUT = path.join(root, "data/images.js");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

const loadWindowVar = async (file, name) => {
  const ctx = { window: {} };
  vm.runInNewContext(await readFile(path.join(root, file), "utf8"), ctx);
  return ctx.window[name];
};
const NEWS = await loadWindowVar("data/news.js", "CURATED_NEWS");
const previous = existsSync(OUT) ? (await loadWindowVar("data/images.js", "NEWS_IMAGES")) || {} : {};

/* ---------- 网页中的图片候选 ---------- */
const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return m ? (m[2] ?? m[3] ?? m[4] ?? "").trim() : "";
};
const unescape = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const strip = (s) => unescape(s.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

const DAMAGE = /fire|blaze|blast|explo|smoke|flame|burn|damage|aftermath|scene|wreck|debris|rubble|collapse|firefight|rescue|tank|plant|factory|site|爆炸|爆燃|闪爆|起火|火灾|大火|现场|浓烟|黄烟|烟雾|损毁|受损|坍塌|废墟|救援|消防|厂区|车间|蕈狀雲|爆炸現場|화재|폭발|현장|소방|감식|explosión|incendio|humo|pozo|planta/i;
const JUNK = /logo|icon|avatar|sprite|banner|placeholder|default|blank|qrcode|qr_code|二维码|share|weixin|wechat|subscribe|advert|\/ads?\/|badge|emoji|loading|spacer|pixel|1x1|author|profile|headshot|thumb_?nail_?default|apple-touch|favicon/i;

function extractCandidates(html, pageUrl) {
  const out = [];
  const add = (src, alt, base) => {
    if (!src || src.startsWith("data:")) return;
    let url;
    try {
      url = new URL(unescape(src), pageUrl).href;
    } catch {
      return;
    }
    if (!/^https?:/.test(url) || /\.(svg|gif)(\?|$)/i.test(url)) return;
    const text = `${alt} ${url}`;
    if (JUNK.test(text)) return;
    let score = base;
    if (DAMAGE.test(alt)) score += 4;
    if (DAMAGE.test(url)) score += 1;
    if (/upload\.wikimedia\.org/.test(url)) score += 1;
    out.push({ src: url, alt: alt.slice(0, 200), page: pageUrl, score });
  };
  for (const m of html.matchAll(/<meta\b[^>]*>/gi)) {
    const t = m[0];
    const key = (attr(t, "property") || attr(t, "name")).toLowerCase();
    if (/^(og:image(:secure_url)?|twitter:image(:src)?)$/.test(key)) add(attr(t, "content"), attr(t, "content") ? strip(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "") : "", 3);
  }
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    const t = m[0];
    const src = attr(t, "data-original") || attr(t, "data-src") || attr(t, "data-lazy-src") || attr(t, "src");
    const w = parseInt(attr(t, "width"), 10);
    if (w && w < 300) continue;
    // 紧随其后的图注
    const after = html.slice(m.index, m.index + 1500);
    const cap = after.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i) || after.match(/<p[^>]*class="[^"]*(caption|img-desc|pic-?info)[^"]*"[^>]*>([\s\S]*?)<\/p>/i);
    add(src, `${attr(t, "alt")} ${attr(t, "title")} ${cap ? strip(cap[cap.length - 1]) : ""}`.trim(), 2);
  }
  return out;
}

async function fetchPage(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8" }, redirect: "follow", signal: AbortSignal.timeout(25000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function download(c) {
  const res = await fetch(c.src, { headers: { "User-Agent": UA, Referer: c.page, Accept: "image/*" }, signal: AbortSignal.timeout(25000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const meta = await sharp(buf).metadata();
  if (!meta.width || meta.width < 400 || meta.height < 200) throw new Error(`尺寸过小 ${meta.width}x${meta.height}`);
  const ratio = meta.width / meta.height;
  if (ratio > 3.2 || ratio < 0.5) throw new Error(`比例异常 ${meta.width}x${meta.height}`);
  return { buf, meta };
}
const save = (buf, file, width) =>
  sharp(buf).rotate().resize({ width, withoutEnlargement: true }).jpeg({ quality: 78, mozjpeg: true }).toFile(file);

const OUTLETS = { "khan.co.kr": "京乡新闻", "newsis.com": "纽西斯通讯社", "excelsior.com.mx": "Excélsior", "unotv.com": "UnoTV", "proceso.com.mx": "Proceso", "ifeng.com": "凤凰网", "jiemian.com": "界面新闻", "deccanchronicle.com": "Deccan Chronicle", "siasat.com": "Siasat", "udn.com": "联合新闻网", "qq.com": "腾讯新闻", "inews.qq.com": "腾讯新闻", "thepaper.cn": "澎湃新闻", "wchsnetwork.com": "WCHS" };
const creditOf = (n, page) => {
  const host = new URL(page).hostname.replace(/^(www|m|amp|news|view)\./, "");
  if (OUTLETS[host]) return OUTLETS[host];
  const s = (n.sources || []).find((x) => {
    try {
      return new URL(x.url).hostname.replace(/^(www|m|amp|news|view)\./, "") === host;
    } catch {
      return false;
    }
  });
  return s ? s.name.replace(/[（(].*$/, "").trim() : host;
};

/* ---------- 主流程 ---------- */
await mkdir(IMG_DIR, { recursive: true });
if (CANDIDATES) await mkdir(CAND_DIR, { recursive: true });
const result = { ...previous };
const targets = NEWS.filter((n) => n.category === "incident" && (!ONLY || n.id === ONLY));

for (const n of targets) {
  const prev = previous[n.id];
  const file = `assets/news-img/${n.id}.jpg`;
  if (n.imageNone) {
    result[n.id] = { none: true };
    await rm(path.join(root, file), { force: true });
    console.log(`- ${n.id}: 标记为无现场图`);
    continue;
  }
  const settled = prev && prev.file && existsSync(path.join(root, prev.file)) && prev.pick === (n.imagePick ?? null) && prev.override === (n.image || null);
  if (settled && !FORCE && !CANDIDATES) {
    console.log(`= ${n.id}: 已有配图`);
    continue;
  }

  let cands = [];
  if (n.image) {
    // 指定图片时，从上次的候选中找回它所在的报道页，以便正确署名
    const known = prev && (prev.candidates || []).find((c) => c.src === n.image);
    const page = n.imagePage || (known && known.page) || (n.imagePages || [])[0] || n.sources[0].url;
    cands = [{ src: n.image, alt: (known && known.alt) || "", page, score: 99 }];
  } else {
    const pages = [...new Set([...(n.imagePages || []), ...n.sources.map((s) => s.url)])];
    for (const [i, page] of pages.entries()) {
      try {
        const found = extractCandidates(await fetchPage(page), page);
        found.forEach((c) => (c.score -= i * 0.5)); // 越靠前的报道越优先
        cands.push(...found);
        console.log(`  ${n.id} ← ${page}: ${found.length} 张`);
      } catch (e) {
        console.warn(`  ${n.id} ✗ ${page}: ${e.message}`);
      }
    }
    const seen = new Set();
    cands = cands
      .sort((a, b) => b.score - a.score)
      .filter((c) => {
        const k = c.src.replace(/[?#].*$/, "");
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
  }

  // 下载可用的候选（尺寸合格），最多保留 6 张
  const usable = [];
  for (const c of cands) {
    if (usable.length >= 6) break;
    try {
      const { buf, meta } = await download(c);
      usable.push({ ...c, buf, w: meta.width, h: meta.height });
    } catch (e) {
      console.warn(`  ${n.id} ✗ 图片 ${c.src.slice(0, 100)}: ${e.message}`);
    }
  }
  if (!usable.length) {
    console.warn(`! ${n.id}: 没有找到可用的报道图片`);
    if (!prev || !prev.file) result[n.id] = { none: true, reason: "未找到可用的报道图片" };
    continue;
  }

  const pick = Math.min(n.imagePick ?? 0, usable.length - 1);
  const chosen = usable[pick];
  await save(chosen.buf, path.join(root, file), 960);
  if (CANDIDATES) {
    for (const [k, c] of usable.entries()) await save(c.buf, path.join(CAND_DIR, `${n.id}-${k}.jpg`), 360);
  }
  result[n.id] = {
    file,
    src: chosen.src,
    page: chosen.page,
    credit: creditOf(n, chosen.page),
    alt: chosen.alt,
    pick: n.imagePick ?? null,
    override: n.image || null,
    candidates: usable.map(({ src, page, alt, w, h }) => ({ src, page, alt, size: `${w}x${h}` })),
  };
  console.log(`✓ ${n.id}: 选用第 ${pick} 张（${chosen.w}x${chosen.h}）${chosen.src.slice(0, 100)}`);
}

// 清理已不存在的条目
for (const id of Object.keys(result)) if (!NEWS.some((n) => n.id === id)) delete result[id];

await writeFile(OUT, `// 由 scripts/fetch-images.mjs 自动生成：事故配图均取自原始新闻报道，版权归原媒体所有\nwindow.NEWS_IMAGES = ${JSON.stringify(result, null, 1)};\n`);
console.log("已写入 data/images.js");
