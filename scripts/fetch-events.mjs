#!/usr/bin/env node
// 每天同步官方明确免费的在线讲座，不把免费直播的付费回放当作免费内容。
import { readFile, writeFile } from "node:fs/promises";
import { CATALOG, catalogEntries, publicRecording } from "./lib/free-events.mjs";

const root = new URL("../", import.meta.url);
async function readAssigned(file) {
  const text = await readFile(new URL(file, root), "utf8");
  const assignment = text.search(/window\.\w+\s*=/);
  return JSON.parse(text.slice(text.indexOf("=", assignment) + 1, text.lastIndexOf(";")));
}
async function fetchPage(url) {
  const r = await fetch(url, { signal: AbortSignal.timeout(20000), headers: { "User-Agent": "ChemicalNews-FreeWebinars/1.0" } });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.text();
}
const previous = await readAssigned("data/events-auto.js");
const curated = await readAssigned("data/events.js");
const today = new Date().toISOString().slice(0, 10);
const checks = { ...previous.checks };
const items = new Map((previous.items || []).map(e => [e.url, e]));
let candidates = [];
let syncError = null;
try {
  candidates = catalogEntries(await fetchPage(CATALOG)).slice(0, 8);
} catch (e) {
  syncError = e.message;
  console.error(`免费讲座目录：${e.message}`);
}
const curatedUrls = new Set(curated.map(e => e.url));
const urls = [...new Set([...curated.filter(e => e.kind === "replay").map(e => e.url), ...candidates.map(e => e.url), ...items.keys()])];
// 每批 4 页，避免给主办方服务器造成大量并发。
for (let i = 0; i < urls.length; i += 4) {
  await Promise.all(urls.slice(i, i + 4).map(async url => {
    try {
      const ok = publicRecording(await fetchPage(url));
      checks[url] = { state: ok ? "ok" : "unavailable", checkedAt: today };
      if (!ok) { items.delete(url); return; }
      const entry = candidates.find(e => e.url === url);
      if (!curatedUrls.has(url) && entry) items.set(url, {
        id: "icheme-" + new URL(url).pathname.split("/").filter(Boolean).pop(),
        title: entry.title,
        organizer: "IChemE Safety Centre",
        summary: "过程安全系列免费回放，可在主办方页面在线收听。",
        topics: ["过程安全"], kind: "replay", language: "英语",
        access: "免费公开回放；无需付费会员",
        url, sourceUrl: CATALOG, checkedAt: today
      });
      else if (items.has(url)) items.get(url).checkedAt = today;
    } catch (e) {
      checks[url] = { ...checks[url], state: "error", attemptedAt: today, error: e.message };
      console.error(`讲座核验失败（保留上次记录）：${url} ${e.message}`);
    }
  }));
}
const output = {
  updated: syncError ? previous.updated : today,
  attemptedAt: today, syncError,
  items: [...items.values()].filter(e => !curatedUrls.has(e.url)).slice(0, 12), checks
};
await writeFile(new URL("data/events-auto.js", root), "// 由 scripts/fetch-events.mjs 每日生成；核验失败时保留上次可用记录。\nwindow.AUTO_EVENTS = " + JSON.stringify(output, null, 2) + ";\n");
console.log(`免费回放：${output.items.length} 条自动收录，${urls.length} 个入口已尝试核验`);
if (syncError) process.exitCode = 1;
