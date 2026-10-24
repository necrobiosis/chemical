# 化工行业新闻中心

面向 FM 亚洲化工专家的**培训基地**与**行业实况中心**。纯静态网站，无需构建，可直接部署到 GitHub Pages。

## 板块

| 板块 | 内容 |
| --- | --- |
| 总览 | 三大板块最新动态、统计、本期案例研讨 |
| 国内 / 亚洲 / 国际 | 精选新闻（事故、调查报告、政策法规、产能、市场），每条附 **FM 风险视角**、培训讨论题、参考 Data Sheet 与原文链接；右侧为每日自动聚合的实时动态 |
| 按起因浏览 | 参照 FM 风险分类：火灾与爆炸、设备风险、自然灾害，各分细项起因；总览页点击进入相关事故（精选 + 实时动态） |
| 案例库 | 事故与调查报告汇总表，适合晨会“15 分钟案例” |
| 信息源 | 公众号、X 博主、知名网站清单，含级别、关注点、接入状态 |
| 培训基地 | L1–L3 学习路径、Data Sheet 速查（与新闻案例互相关联）、亚洲区域法规、术语表、自测题 |

## 目录结构

```
index.html              页面入口
assets/style.css        样式（支持深浅色）
assets/app.js           路由与渲染
data/news.js            精选新闻（人工维护）
data/training.js        培训内容
data/sources.js         信息源配置（公众号 / X 博主 / 网站 / 重大判定规则）
data/feeds.js           自动抓取的实时动态（由脚本生成，保留近 30 天）
scripts/fetch-feeds.mjs 抓取脚本（Node 18+，无依赖）
.github/workflows/update-feeds.yml 每日自动更新
```

## 本地预览

```bash
python3 -m http.server 8000
# 打开 http://localhost:8000
```

也可以直接双击 `index.html` 打开。

## 更新频率

| 内容 | 频率 |
| --- | --- |
| 实时动态（网站 / 公众号 / X） | 每 4 小时自动抓取（北京时间 00/04/08/12/16/20 点），也可在 Actions 中手动触发 |
| 精选新闻 + FM 风险视角 | 人工整理，建议每周更新 |

**重大动态判定**：来源级别分（A 官方 2 分、B 专业媒体 1 分、C 博主 0 分）+ 标题关键词分（死亡/爆炸/不可抗力/调查报告等 2 分，火灾/泄漏/关停等 1 分），≥ 3 分标记为“重大”，在总览页置顶。规则可在 `data/sources.js` 的 `major` 中调整。

## 接入公众号与 X 博主

- **网站**：通过 Google News 按站点检索，开箱即用。
- **公众号**：微信没有公开 RSS。自建 [WeWe RSS](https://github.com/cooderl/wewe-rss)（或 RSSHub 等）后，在 `data/sources.js` 中给对应公众号填写 `rss`，例如 `"${WECHAT_RSS_BASE}/feeds/<公众号ID>.atom"`，并在仓库 Settings → Secrets → Actions 中添加 `WECHAT_RSS_BASE`。
- **X 博主**：X 已关闭免费 API。部署带 X 账号认证的 [RSSHub](https://docs.rsshub.app/) 实例，在 Secrets 中添加 `RSSHUB_BASE` 即自动接入全部已列出的博主。

未配置的公众号和博主仍会在“信息源”页列出，并提供搜狗微信搜索 / X 主页链接，方便手动查看。

## 重大动态配图

被标记为“重大”的实时动态会自动配图（`scripts/lib/feed-images.mjs`）：先把 Google News 跳转链接解析为原始报道地址（点击直达原文，国内不必访问 news.google.com），再取原文的 og:image 头图压缩成 360×225 的 WebP 缩略图，存到 `assets/feed-img/`。每条只处理一次；条目过期移除后，图片随之删除。拿不到头图时显示起因色块，不使用生成图片。自动配图未经人工审核。

## 重大动态弹窗（FM 防损速报）

点击首页重大动态卡片会弹出速报，而不是直接跳转：图片、事故概况、FM 防损视角、参考 Data Sheet，最后才是“阅读原文”和“查看同类事故”。

- **事故概况**：优先用 Claude 根据原文整理的中文概况；否则显示报道自带的摘要（og:description）。
- **FM 防损视角**：有 Claude 速报时为针对该事故的要点；否则按标题判断的起因，显示 `data/perils.js` 中该起因的通用检查要点（弹窗中会注明“非针对本事故的专门分析”）。
- **不用密钥的方式（当前使用）**：`data/fm-notes.js` 保存按原文链接撰写的 FM 速报，由 Claude Code 每日定时任务（Routine，使用 Claude 订阅额度）为新出现的重大动态补写并推送。同一事件的多篇报道用 `event` 合并为首页一张卡片；`notLoss` 标记的非财产损失条目不再显示为重大；`caseId` 指向案例库中已收录的同一事故。
- **启用 Claude 速报（API 方式，可选）**：在仓库 Settings → Secrets and variables → Actions 中添加 `ANTHROPIC_API_KEY`。之后每次抓取会为新出现的重大动态调用 Claude（`scripts/lib/fm-summary.mjs`，每条只调用一次，约 2–3 美分）。Claude 还会判断报道是否真的是事故/损失事件，非事故（如会议、网站检查通报）不再显示为重大。

## 事故起因分类

分类定义在 `data/perils.js`：火灾与爆炸（反应失控、可燃气体爆炸、易燃液体、不相容反应、粉尘、一般可燃物）、设备风险（压力容器/储罐、控制与辅助系统、腐蚀与完整性、转动设备、电气）、自然灾害（洪水暴雨、台风、地震、雷击）。

- 精选事故在 `data/news.js` 用 `causes` 标注，第一项为主因，其余为次因（诱发或后果），例如台南爆炸主因是遇水反应，次因是降雨。
- 实时动态按标题关键词自动归类；设备与自然灾害类需同时出现“停产、受损、泄漏”等影响词，以减少误判。

## 事故配图

每起事故标题旁配一张**原始新闻报道中的现场照片**（不使用 AI 生成图片），展开后显示大图及来源署名，图片版权归原媒体所有。

- 工作流“提取事故新闻配图”在 `data/news.js` 变更时自动运行：抓取每条事故的 `imagePages` 与 `sources` 报道页，收集 og:image 与正文图片，过滤 logo/图标/小图，按图注与标题中的“爆炸、现场、浓烟、fire、blast”等关键词打分，选出最能看出损失的照片，保存为 WebP 大图与缩略图（`assets/news-img/`、`assets/news-img/thumb/`，列表只加载几 KB 到二十几 KB 的缩略图，国内访问无需连外网）。
- 人工把关：在 Actions 中手动运行并填参数 `--candidates`，会把每起事故的前 6 张候选存到 `assets/news-img/candidates/` 供挑选；在 `data/news.js` 中用 `image`（指定报道图片地址）+ `imagePage`（所在报道页）固定选择，或用 `imageNone: true` 标记“报道无现场图”。挑选完删除 candidates 目录。

## 维护

- **新增精选新闻**：在 `data/news.js` 中复制一条记录并修改，`region` 取 `cn` / `asia` / `intl`。只写已公开报道的事实，并附来源链接。
- **增删信息源**：编辑 `data/sources.js`（type 可选 site / query / rss / wechat / x）。
- **手动更新实时动态**：`node scripts/fetch-feeds.mjs`，或在 GitHub Actions 中手动运行“更新自动新闻源”。

## 部署到 GitHub Pages

仓库 Settings → Pages → Source 选择 “Deploy from a branch”，分支选 `main`（或当前分支）根目录即可。

## 部署到 Lovable

`deploy/lovable-index.html` 是 Lovable 项目使用的外壳页面：打开时通过 GitHub API 取本分支最新提交，再经 jsDelivr CDN 加载该提交的页面、样式、脚本、数据和图片。因此仓库的任何更新（包括每 4 小时的自动新闻）都会直接出现在 Lovable 网站上，无需在 Lovable 重新发布。GitHub API 不可用时回退到文件中写死的 `FALLBACK_SHA`。

## 说明

“FM 风险视角”为培训用途的工程解读，不代表任何机构的正式立场；Data Sheet 编号仅供索引，请以 FM 官方最新版为准。
