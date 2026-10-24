// 为“重大”实时动态配图：
// 1. 把 Google News 跳转链接解析为原始报道地址（同时让点击直达原文，国内无需访问 news.google.com）
// 2. 取原文页的 og:image（报道自带的头图，不生成图片），压缩为小尺寸 WebP 缩略图存到 assets/feed-img/
// 每条按规则版本只处理一次（imgV），失败不影响新闻本身。需要 sharp；未安装时只解析链接、不配图。
import { mkdir, readdir, rm } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const JUNK = /logo|icon|avatar|sprite|placeholder|default|blank|qrcode|二维码|favicon|apple-touch|1x1|pixel|google\.com|gstatic/i;
const get = (url, opts = {}) => fetch(url, { headers: { "User-Agent": UA, ...(opts.headers || {}) }, signal: AbortSignal.timeout(20000), ...opts });

/* ---------- Google News 链接解析 ---------- */
function gnId(url) {
  const m = url.match(/news\.google\.com\/(?:rss\/)?articles\/([^?/#]+)/);
  return m ? m[1] : null;
}
// 旧格式的 id 直接 base64 编码了原文地址
function decodeOld(id) {
  try {
    const raw = Buffer.from(id.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("latin1");
    const m = raw.match(/https?:\/\/[\x21-\x7e]+/);
    return m && !m[0].includes("AU_yqL") ? m[0].replace(/[\x00-\x20\x7f-\xff].*$/, "") : null;
  } catch {
    return null;
  }
}
// 新格式需要先取签名与时间戳，再调用 batchexecute 接口
async function decodeNew(ids) {
  const params = [];
  for (const id of ids) {
    try {
      const html = await (await get(`https://news.google.com/articles/${id}`)).text();
      const sg = html.match(/data-n-a-sg="([^"]+)"/);
      const ts = html.match(/data-n-a-ts="([^"]+)"/);
      if (sg && ts) params.push({ id, sg: sg[1], ts: ts[1] });
    } catch {}
  }
  if (!params.length) return {};
  const reqs = params.map((p) => [
    "Fbv4je",
    `["garturlreq",[["X","X",["X","X"],null,null,1,1,"US:en",null,1,null,null,null,null,null,0,1],"X","X",1,[1,1,1],1,1,null,0,0,null,0],"${p.id}",${p.ts},"${p.sg}"]`,
  ]);
  const res = await get("https://news.google.com/_/DotsSplashUi/data/batchexecute", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body: "f.req=" + encodeURIComponent(JSON.stringify([reqs])),
  });
  const text = await res.text();
  const out = {};
  try {
    const rows = JSON.parse(text.split("\n\n")[1]).filter((r) => r[0] === "wrb.fr");
    rows.forEach((r, k) => {
      const url = JSON.parse(r[2])[1];
      if (params[k] && /^https?:\/\//.test(url)) out[params[k].id] = url;
    });
  } catch {}
  return out;
}

export async function resolveLinks(items) {
  const pending = items.filter((i) => !i.link && gnId(i.url));
  const needNew = [];
  for (const i of pending) {
    const id = gnId(i.url);
    const old = decodeOld(id);
    if (old) i.link = old;
    else needNew.push(i);
  }
  for (let k = 0; k < needNew.length; k += 10) {
    const batch = needNew.slice(k, k + 10);
    const map = await decodeNew(batch.map((i) => gnId(i.url))).catch(() => ({}));
    batch.forEach((i) => map[gnId(i.url)] && (i.link = map[gnId(i.url)]));
  }
  return pending.filter((i) => i.link).length;
}

/* ---------- 原文头图 ---------- */
// 配图规则版本：规则改进后提高版本号，之前没取到图的条目会按新规则再试一次
const IMG_V = 2;

function ogImage(html, pageUrl) {
  for (const m of html.matchAll(/<meta\b[^>]*>/gi)) {
    const t = m[0];
    const key = (t.match(/\b(?:property|name)\s*=\s*["']([^"']+)/i) || [])[1] || "";
    if (!/^(og:image(:secure_url)?|twitter:image(:src)?)$/i.test(key)) continue;
    const c = (t.match(/\bcontent\s*=\s*["']([^"']+)/i) || [])[1];
    if (!c) continue;
    try {
      const u = new URL(c.replace(/&amp;/g, "&"), pageUrl).href;
      if (!JUNK.test(u) && !/\.(svg|gif)(\?|$)/i.test(u)) return u;
    } catch {}
  }
  return null;
}

// 没有 og:image 时（如政府网站），取正文中的前几张图片作为候选，后续再按尺寸、比例、体积筛选
function bodyImages(html, pageUrl) {
  const body = html.replace(/<(header|nav|footer|aside)\b[\s\S]*?<\/\1>/gi, "");
  const out = [];
  for (const m of body.matchAll(/<img\b[^>]*>/gi)) {
    const src = (m[0].match(/\b(?:data-original|data-src|src)\s*=\s*["']([^"']+)/i) || [])[1];
    if (!src || src.startsWith("data:")) continue;
    try {
      const u = new URL(src.replace(/&amp;/g, "&"), pageUrl).href;
      if (!JUNK.test(u + " " + m[0]) && !/\.(svg|gif)(\?|$)/i.test(u) && !out.includes(u)) out.push(u);
    } catch {}
    if (out.length >= 4) break;
  }
  return out;
}

export async function attachImages(items, root, { limit = 25 } = {}) {
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.warn("未安装 sharp，跳过实时动态配图");
    return 0;
  }
  const dir = path.join(root, "assets/feed-img");
  await mkdir(dir, { recursive: true });
  let done = 0;
  for (const i of items.filter((x) => x.link && !x.img && (x.imgV || 0) < IMG_V).slice(0, limit)) {
    i.imgV = IMG_V;
    delete i.imgTried;
    try {
      const page = await get(i.link, { headers: { "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8" }, redirect: "follow" });
      const html = await page.text();
      const pageUrl = page.url || i.link;
      const og = ogImage(html, pageUrl);
      // og:image 是报道指定的头图，条件放宽；正文图片要求更像照片（尺寸、比例、体积），排除图标和横幅
      const cands = og ? [{ src: og, strict: false }] : bodyImages(html, pageUrl).map((src) => ({ src, strict: true }));
      for (const c of cands) {
        const res = await get(c.src, { headers: { Referer: i.link, Accept: "image/*" } }).catch(() => null);
        if (!res || !res.ok) continue;
        const buf = Buffer.from(await res.arrayBuffer());
        const meta = await sharp(buf).metadata().catch(() => ({}));
        const ratio = meta.width / meta.height;
        const ok = c.strict
          ? meta.width >= 400 && ratio >= 0.6 && ratio <= 2.2 && buf.length >= 12000
          : meta.width >= 300 && ratio >= 0.5 && ratio <= 3.2;
        if (!ok) continue;
        const name = createHash("sha1").update(i.link).digest("hex").slice(0, 16) + ".webp";
        await sharp(buf).rotate().resize({ width: 360, height: 225, fit: "cover" }).webp({ quality: 66 }).toFile(path.join(dir, name));
        i.img = `assets/feed-img/${name}`;
        done++;
        break;
      }
    } catch {}
  }
  return done;
}

// 删除不再被任何条目引用的缩略图，避免仓库膨胀
export async function pruneImages(allItems, root) {
  const dir = path.join(root, "assets/feed-img");
  const keep = new Set(allItems.map((i) => i.img && path.basename(i.img)).filter(Boolean));
  let removed = 0;
  for (const f of await readdir(dir).catch(() => [])) {
    if (!keep.has(f)) {
      await rm(path.join(dir, f), { force: true });
      removed++;
    }
  }
  return removed;
}
