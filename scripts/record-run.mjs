#!/usr/bin/env node
import { readFile, writeFile, appendFile } from "node:fs/promises";
import vm from "node:vm";
const root = new URL("../", import.meta.url);
async function data(name, key, fallback) {
  try {
    const ctx = vm.createContext({ window: {} });
    vm.runInContext(await readFile(new URL(`data/${name}.js`, root), "utf8"), ctx, { timeout: 1000 });
    return ctx.window[key] || fallback;
  } catch { return fallback; }
}
const feeds = await data("feeds", "AUTO_FEEDS", { items: {}, status: {} });
const replays = await data("events-auto", "AUTO_EVENTS", { items: [] });
const discovered = await data("events-discovered", "DISCOVERED_EVENTS", { items: [] });
const curated = await data("events", "FREE_EVENTS", []);
const repo = process.env.GITHUB_REPOSITORY || "necrobiosis/chemical";
const pipelineId = process.env.PIPELINE_ID || "A";
const outcomes = {
  news: process.env.NEWS_OUTCOME || "not_run",
  replays: process.env.REPLAYS_OUTCOME || "not_run",
  discovery: process.env.DISCOVERY_OUTCOME || "not_run"
};
const states = Object.values(outcomes);
const status = states.every(x => x === "success") ? "success" : states.some(x => x === "success") ? "partial" : states.some(x => x === "failure") ? "failure" : "not_run";
const news = Object.values(feeds.items || {}).flat();
const sources = Object.values(feeds.status || {});
const eventKey = e => e.kind === "live" ? (e.originalTitle || e.title).toLowerCase().replace(/\b20\d{2}\b/g, "").replace(/[^\p{L}\p{N}]/gu, "") + e.start.slice(0,10) : e.url;
const eventMap = new Map();
for (const event of [...curated, ...replays.items, ...discovered.items]) if (!eventMap.has(eventKey(event))) eventMap.set(eventKey(event), event);
const events = [...eventMap.values()].filter(e => e.kind === "replay" || Date.parse(e.replayUntil || e.end) > Date.now());
const run = {
  version: 1, pipeline: { id: pipelineId, repository: repo, schedule: pipelineId === "A" ? "每天北京时间 08:17" : "每天北京时间 20:17", mode: process.env.AUTOMATION_TEXT_ONLY === "1" ? "新闻文字与活动核验" : "新闻、配图与活动核验" },
  status, stages: outcomes,
  startedAt: process.env.STARTED_AT || null, finishedAt: new Date().toISOString(),
  trigger: process.env.GITHUB_EVENT_NAME || "local",
  runId: process.env.GITHUB_RUN_ID || null,
  runUrl: process.env.GITHUB_RUN_ID ? `https://github.com/${repo}/actions/runs/${process.env.GITHUB_RUN_ID}` : null,
  codeSha: process.env.GITHUB_SHA || null,
  news: { updated: feeds.updated, count: news.length, major: news.filter(n=>n.major).length, sourcesOk: sources.filter(s=>s.state==='ok').length, sourcesError: sources.filter(s=>s.state==='error').length, sourcesUnconfigured: sources.filter(s=>s.state==='unconfigured').length },
  events: { count: events.length, live: events.filter(e=>e.kind==='live' && Date.parse(e.end)>Date.now()).length, replays: events.filter(e=>e.kind==='replay').length, discovered: discovered.items.length, checked: discovered.checks?.length || 0, checkErrors: (discovered.checks || []).filter(c=>c.state==='error').length + Object.values(replays.checks || {}).filter(c=>c.state==='error').length },
  eventItems: events,
  latestNews: news.sort((a,b)=>(b.date||'').localeCompare(a.date||'')).slice(0, 12)
};
const previous = await readFile(new URL("data/trial-history.json", root), "utf8").then(JSON.parse).catch(()=>[]);
const history = [run, ...previous.filter(r => !(run.runId && r.runId === run.runId))].slice(0, 14);
await writeFile(new URL("data/trial-results.json", root), JSON.stringify(run, null, 2) + "\n");
await writeFile(new URL("data/trial-history.json", root), JSON.stringify(history, null, 2) + "\n");
const summary = `# ${pipelineId} 方案运行结果\n\n- 状态：${status}\n- 新闻：${run.news.count} 条；信息源成功 ${run.news.sourcesOk}，失败 ${run.news.sourcesError}，未配置 ${run.news.sourcesUnconfigured}\n- 活动：${run.events.live} 场直播、${run.events.replays} 场回放；自动发现 ${run.events.discovered} 场\n- 任务：新闻 ${outcomes.news}；回放 ${outcomes.replays}；新活动 ${outcomes.discovery}\n- 本轮完成：${run.finishedAt}\n- 新闻实际更新时间：${run.news.updated || '未成功更新'}\n\n两套每天各运行一次，错开12小时；按各自计划时间判断新鲜度，条数多不代表内容更准确。\n`;
await writeFile(new URL("data/trial-summary.md", root), summary);
if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, summary);
console.log(summary);
