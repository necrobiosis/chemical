# 定时任务说明：补写重大动态 FM 速报

由 Claude Code 定时任务（Routine“化工新闻 FM 速报补写”，每天北京时间 08:47、20:47）按本文件执行。
修改任务行为时，直接编辑本文件即可，无需修改定时任务本身。

只做下面的事，不要做其他改动。

## 0. 同步仓库

```bash
git fetch origin claude/chemical-industry-news-hub-wpb91d
git checkout -B claude/chemical-industry-news-hub-wpb91d origin/claude/chemical-industry-news-hub-wpb91d
```

以远端最新版本为准。只能推送到 `claude/chemical-industry-news-hub-wpb91d`。

## 1. 找出待补写的条目

读取 `data/feeds.js`（`window.AUTO_FEEDS`，`items.cn/asia/intl` 下的条目）和 `data/fm-notes.js`（`window.FM_NOTES`，键为原文链接）。

待补写条目：`major` 为 true、有 `link` 字段、日期在最近 7 天内、且 `link` 不在 `FM_NOTES` 中。

没有待补写条目时，回复“无需补写”后结束，不提交。

## 2. 撰写速报

对每个条目，用 WebSearch（以及能访问时的 WebFetch）查证报道事实。只写能从报道或报告中确认的内容，不确定的写“报道未说明”。在 `FM_NOTES` 中新增一条，键为该条目 `link` 的原样字符串：

**不是财产损失事件、也不是调查报告**（会议、通知通报、网站检查、与已收录事故无关的赔偿或股价公告、纯人身伤害如高处坠落、交通事故等）：

```js
{ notLoss: true, reason: "一句话说明", by: "Claude Code", at: "YYYY-MM-DD" }
```

**其他情况**：

```js
{ event, summary, points, refs, by: "Claude Code", at: "YYYY-MM-DD" }
```

- `event`：事件标识（英文小写短横线，如 `toledo-gma-2026-10`）。与已有条目是同一事件时复用相同的 `event`；多篇报道同一事件时，可把共用内容放进 `_shared` 并用 `ref` 引用（参照文件中托莱多的写法）。
- `summary`：中文 2–3 句概况（时间、地点、企业/装置、经过、伤亡与损失）。
- `points`：3 条中文 FM（财产损失预防）视角要点，每条一句：可能的起因与损失扩大因素，以及检查类似客户时应关注什么。参考 `data/perils.js` 中各起因的 `guide` 写法，但要针对该事故。
- `refs`：0–3 个 FM Data Sheet 编号，只能从 `data/training.js` 的 `datasheets` 列表中选。
- 若 `data/news.js` 的精选新闻已收录同一事故，加 `caseId: "<该新闻的 id>"`。

**报告类新闻**：如果新闻是关于调查报告、事故报告、调查进展或统计通报的发布或更新（如 CSB、应急管理部、地方政府发布的调查报告），务必查阅报告本身或权威报道，再加一个 `report` 字段总结报告内容。参照 `data/fm-notes.js` 中雪佛龙条目和 `data/news.js` 中壳牌 Monaca 条目的写法：

```js
report: {
  issuer: "发布机构",
  type: "最终调查报告 / 调查进展 / 事件报告汇编 / 统计通报 等",
  date: "发布日期",
  about: "针对的事故（日期、企业、装置）",
  impact: "伤亡与财产损失（报告未说明则省略此字段）",
  findings: ["主要发现与原因，3–5 条"],
  recommendations: ["报告提出的建议；尚未提出时说明"],
  url: "报告原文或发布页链接",
}
```

此时 `summary` 写报告发布这件事和事故概况，`points` 写对 FM 检查的启示。

保持文件格式与已有条目一致，不要删除或改写已有条目。

## 3. 检查

```bash
node -e 'global.window={};require("./data/fm-notes.js");console.log(Object.keys(window.FM_NOTES).length)'
```

确认文件可以正常加载。

## 4. 提交推送

```bash
git add data/fm-notes.js
git commit -m "chore: 补写重大动态 FM 速报（N 条）"   # 末尾加上会话要求的署名行
git pull --rebase origin claude/chemical-industry-news-hub-wpb91d
git push origin claude/chemical-industry-news-hub-wpb91d
```

如遇 `data/feeds.js` 冲突，以远端版本为准。最后用一句话回复补写了几条。
