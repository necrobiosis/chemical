# 化工行业新闻中心

面向 FM 亚洲化工专家的**培训基地**与**行业实况中心**。纯静态网站，无需构建，可直接部署到 GitHub Pages。

## 板块

| 板块 | 内容 |
| --- | --- |
| 总览 | 三大板块最新动态、统计、本期案例研讨 |
| 国内 / 亚洲 / 国际 | 精选新闻（事故、调查报告、政策法规、产能、市场），每条附 **FM 风险视角**、培训讨论题、参考 Data Sheet 与原文链接；右侧为每日自动聚合的实时动态 |
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

## 维护

- **新增精选新闻**：在 `data/news.js` 中复制一条记录并修改，`region` 取 `cn` / `asia` / `intl`。只写已公开报道的事实，并附来源链接。
- **增删信息源**：编辑 `data/sources.js`（type 可选 site / query / rss / wechat / x）。
- **手动更新实时动态**：`node scripts/fetch-feeds.mjs`，或在 GitHub Actions 中手动运行“更新自动新闻源”。

## 部署到 GitHub Pages

仓库 Settings → Pages → Source 选择 “Deploy from a branch”，分支选 `main`（或当前分支）根目录即可。

## 说明

“FM 风险视角”为培训用途的工程解读，不代表任何机构的正式立场；Data Sheet 编号仅供索引，请以 FM 官方最新版为准。
