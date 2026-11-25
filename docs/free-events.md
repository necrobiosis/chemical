# 免费论坛与讲座维护

入口：`#/events`，首页有提示，站内搜索也可找到活动。

只收录化工、过程安全、工业防损相关，且普通用户无需付费会员就能在线收听的活动。允许免费注册。只在线下举行、收费、仅会员免费、仅有幻灯片没有可听内容，或费用与线上参加资格不明确的活动不收录。用“重点推荐”，不要编造热度或报名人数。

## 每日同步

`.github/workflows/update-feeds.yml` 每天 UTC 00:17（北京时间 08:17）触发一次新闻抓取，并运行 `node scripts/fetch-events.mjs`。GitHub 可能延迟启动。两项都保留手动触发。

同一工作流最后运行 `node scripts/export-daily-data.mjs`，将新闻、速报和免费活动导出到 `data/daily.json`。网站读取目标分支最新提交的这份 JSON 后再渲染，因此数据更新不依赖 Vercel 正式分支的部署设置。JSON 按确切提交读取，避免混用不同版本；10 分钟内复用会话缓存。读取失败时回退到缓存或随站点发布的数据，显示提示并保留真实更新日期。无需额外 ChatGPT 定时任务。

`data/events-auto.js` 来自 IChemE Safety Centre 明确声明免费的公开回放目录：只取该官方路径内的条目，再检查详情页正文存在公开视频播放器且没有会员专享提示。目录变化、网络失败不会伪造成功核验日期；保留上次记录并显示连接未成功。详情页明确失去公开播放器或出现会员限制时，条目不再显示。脚本只核验入口，不代表已从所有地区测试完整视频播放。

自动收录保留官方英文标题，不猜测中文翻译、直播时间或字幕。可在 `data/events.js` 加入中文导读；同一 URL 的人工条目优先，避免重复。

## 自动发现近期直播

`node scripts/discover-events.mjs` 读取 IChemE 官方活动目录的公开接口，明确筛选 Open to all 与 Virtual；逐页读取目录，再逐项核实费用、在线方式、日期时区、时长和报名入口。仅对时间明确、仍未结束、无会员专享提示的免费活动生成 `data/events-discovered.js`。不推断会后免费回放；有费用或资格疑问的条目不自动收录。失败保留上次实际核验的记录，不伪造新日期。

## 两套试运行

A 在原仓库每天北京时间 08:17；B 在 `necrobiosis/chemical-automations` 每天 20:17。两套相隔 12 小时，均保留手动触发。B 新闻不取新配图、不调用付费 AI，新闻信息源与免费活动筛选规则保持一致。B 只写自己的仓库，不覆盖 A。源文件更新到 A 时需同时维护 B 的脚本副本。

`scripts/record-run.mjs` 保存 `data/trial-results.json`、`trial-history.json`（最多14轮）及 `trial-summary.md`。记录实际步骤结果、新闻真实更新时间、失败来源数、活动数量和本次 Actions 链接；即使部分抓取失败，也提交诊断记录并让工作流显示失败。网站 `#/automation` 读取两套独立结果，并以 GitHub Actions 的最新状态补充判断。未取得结果时显示未知，不冒充成功；不在客户端保存任何仓库凭据。定时成功率只统计 `schedule`，手动试跑单列。

## 人工补充论坛 / 直播

在 `data/events.js` 添加严格 JSON 对象，并访问主办方公告与报名页核实：

- `id`、`title`、`originalTitle`、`organizer`、`summary`、`topics`：简短中文导读和原始名称。
- `kind`：`live` 或 `replay`。直播必须有 `start`、`end`（带时区的 ISO 8601），页面统一转换为北京时间。时间不明先不收录。
- `language`、`access`：写清语言、是否需要免费注册、非会员可参加的证据；不猜测中文同传。
- `url`：官方报名 / 播放入口。`sourceUrl`：官方详情页。必要时加 `feeSourceUrl`。
- `checkedAt`：实际访问官方信息的日期。刷新日期必须重新核实。
- `replayUrl`、`replayFrom`、`replayUntil`、`replayNote`、`replaySourceUrl`：只在官方明确确认免费回放时填写。`replayUntil` 是不含该时刻的截止时间。直播过期且没有确认回放的条目自动退出列表，不继续给“报名”按钮。
- `timeNote`：多个场次 / 轮播的说明，以主办方日程为准。

IPSD 2026 的第一场为 12 月 2 日 09:00–17:00 GMT，即北京时间 12 月 2 日 17:00 至 12 月 3 日 01:00。官方说明 24 小时内轮播，会后点播至 2027 年 12 月 1 日。用官方公告、报名平台 FAQ 与官方 flyer 作来源。

## 验证

运行 `node scripts/fetch-events.mjs`，检查生成的 `checks`。打开 `#/events`，确认直播与回放筛选、站内搜索、手机布局和外链正常；测试活动结束后不再出现过期报名按钮。内容中不嵌入或代理第三方视频，只链接主办方页面。
