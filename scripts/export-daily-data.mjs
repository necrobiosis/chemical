#!/usr/bin/env node
// 将仓库内网站数据导出为单个 JSON 快照，正式站无需重新部署即可读取每日内容。
import { readFile, writeFile } from "node:fs/promises";
import vm from "node:vm";
const root = new URL("../data/", import.meta.url);
const context = vm.createContext({ window: {} });
for (const name of ["news", "images", "perils", "sources", "feeds", "training", "fm-notes", "events", "events-auto"]) {
  vm.runInContext(await readFile(new URL(name + ".js", root), "utf8"), context, { timeout: 1000 });
}
await writeFile(new URL("daily.json", root), JSON.stringify({ version: 1, data: context.window }) + "\n");
console.log("已导出网站每日数据快照");
