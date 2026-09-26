# 化工行业新闻中心

面向 FM 亚洲化工专家的**培训基地**与**行业实况中心**。纯静态网站，无需构建，可直接部署到 GitHub Pages。

## 板块

| 板块 | 内容 |
| --- | --- |
| 总览 | 三大板块最新动态、统计、本期案例研讨 |
| 国内 / 亚洲 / 国际 | 精选新闻（事故、调查报告、政策法规、产能、市场），每条附 **FM 风险视角**、培训讨论题、参考 Data Sheet 与原文链接；右侧为每日自动聚合的实时动态 |
| 案例库 | 事故与调查报告汇总表，适合晨会“15 分钟案例” |
| 培训基地 | L1–L3 学习路径、Data Sheet 速查（与新闻案例互相关联）、亚洲区域法规、术语表、自测题 |

## 目录结构

```
index.html              页面入口
assets/style.css        样式（支持深浅色）
assets/app.js           路由与渲染
data/news.js            精选新闻（人工维护）
data/training.js        培训内容
data/feeds.js           自动抓取的实时动态（由脚本生成）
scripts/fetch-feeds.mjs 新闻源抓取脚本（Node 18+，无依赖）
scripts/feeds.config.json 新闻源配置（按板块）
.github/workflows/update-feeds.yml 每日自动更新
```

## 本地预览

```bash
python3 -m http.server 8000
# 打开 http://localhost:8000
```

也可以直接双击 `index.html` 打开。

## 维护

- **新增精选新闻**：在 `data/news.js` 中复制一条记录并修改，`region` 取 `cn` / `asia` / `intl`。只写已公开报道的事实，并附来源链接。
- **调整实时新闻源**：编辑 `scripts/feeds.config.json`（默认使用 Google News RSS 关键词检索）。
- **手动更新实时动态**：`node scripts/fetch-feeds.mjs`，或在 GitHub Actions 中手动运行“更新自动新闻源”。

## 部署到 GitHub Pages

仓库 Settings → Pages → Source 选择 “Deploy from a branch”，分支选 `main`（或当前分支）根目录即可。

## 说明

“FM 风险视角”为培训用途的工程解读，不代表任何机构的正式立场；Data Sheet 编号仅供索引，请以 FM 官方最新版为准。
