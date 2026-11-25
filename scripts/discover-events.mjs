#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { DIRECTORY, directoryUrl, candidateEvents, verifyLiveEvent } from "./lib/discover-events.mjs";
const target = new URL("../data/events-discovered.js", import.meta.url);
const old = await readFile(target, "utf8").then(s => JSON.parse(s.slice(s.indexOf("=", s.indexOf("window.")) + 1, s.lastIndexOf(";")))).catch(() => ({ items: [] }));
const started = new Date().toISOString();
const items = new Map(old.items.filter(e => Date.parse(e.end) > Date.now()).map(e => [e.url, e]));
const checks = [];
let error = null, scanned = 0;
async function get(url) {
  const r = await fetch(url, { signal: AbortSignal.timeout(20000), headers: { "User-Agent": "ChemicalNews-FreeEvents/1.0" } });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r;
}
try {
  const pages = [];
  for (let page = 1; page <= 3; page++) {
    const payload = await (await get(directoryUrl(page))).json();
    pages.push(...candidateEvents(payload));
    if (page >= (payload.TotalPageCount || 1)) break;
  }
  const candidates = [...new Map(pages.map(e => [e.url, e])).values()].slice(0, 24);
  scanned = candidates.length;
  for (let i = 0; i < candidates.length; i += 3) {
    await Promise.all(candidates.slice(i, i + 3).map(async candidate => {
      try {
        const verified = verifyLiveEvent(await (await get(candidate.url)).text(), candidate);
        checks.push({ url: candidate.url, state: verified.event ? "verified" : "rejected", reason: verified.reason || null });
        if (verified.event) items.set(candidate.url, verified.event);
        else items.delete(candidate.url);
      } catch (e) { checks.push({ url: candidate.url, state: "error", reason: e.message }); }
    }));
  }
} catch (e) { error = e.message; }
const output = { updated: error ? old.updated || null : new Date().toISOString(), attemptedAt: started, source: DIRECTORY, scanned, error, checks, items: [...items.values()].sort((a,b) => a.start.localeCompare(b.start)) };
await writeFile(target, "// 自动发现并核验的免费线上直播，失败时保留上次已核实记录。\nwindow.DISCOVERED_EVENTS = " + JSON.stringify(output, null, 2) + ";\n");
console.log(`免费直播发现：检查 ${scanned} 场，保留 ${output.items.length} 场，连接失败 ${checks.filter(c=>c.state==='error').length} 场`);
if (error || checks.some(c => c.state === "error")) process.exitCode = 1;
