#!/usr/bin/env node
// 移除不合适的实时动态配图，并把它加入感知哈希黑名单，今后相同或相似的图片不会再被选用。
// 用法：node scripts/block-image.mjs <assets/feed-img/xxx.webp> ["原因"]
// 效果：删除图片文件；data/feeds.js 中使用该图的条目去掉 img 并标记 imgBlocked（不再重新取图）；
//      data/img-blocklist.json 追加该图的指纹。需要 sharp。
import { readFile, writeFile, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";
import { dhash, loadBlocklist, saveBlocklist } from "./lib/img-guard.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [arg, reason = "不适合展示的图片"] = process.argv.slice(2);
if (!arg) {
  console.error("用法：node scripts/block-image.mjs <assets/feed-img/xxx.webp> [原因]");
  process.exit(1);
}
const rel = arg.includes("/") ? arg : `assets/feed-img/${arg}`;
const abs = path.join(root, rel);

const hash = await dhash(sharp, await readFile(abs));
const feedsFile = path.join(root, "data/feeds.js");
const text = await readFile(feedsFile, "utf8");
const start = text.search(/window\.AUTO_FEEDS\s*=/);
const feeds = JSON.parse(text.slice(text.indexOf("=", start) + 1, text.lastIndexOf(";")));
const titles = [];
for (const list of Object.values(feeds.items)) {
  for (const i of list) {
    if (i.img === rel) {
      delete i.img;
      i.imgBlocked = true;
      titles.push(i.title);
    }
  }
}
await writeFile(feedsFile, text.slice(0, start) + `window.AUTO_FEEDS = ${JSON.stringify(feeds)};\n`);

const list = await loadBlocklist(root);
if (!list.some((e) => e.hash === hash)) list.push({ hash, reason, from: titles[0] || rel, at: new Date().toISOString().slice(0, 10) });
await saveBlocklist(root, list);
await rm(abs, { force: true });
console.log(`已移除 ${rel}（指纹 ${hash}），影响 ${titles.length} 条：${titles.join("；")}`);
