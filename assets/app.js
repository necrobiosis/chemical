(function () {
  "use strict";

  const NEWS = (window.CURATED_NEWS || []).slice().sort((a, b) => b.date.localeCompare(a.date));
  const FEEDS = window.AUTO_FEEDS || { updated: null, items: {} };
  const T = window.TRAINING || {};
  const SRC = window.SOURCES || { sources: [] };
  const SRC_BY_ID = {};
  SRC.sources.forEach((s) => (SRC_BY_ID[s.id] = s));
  const TYPES = { wechat: "公众号", x: "X 博主", site: "网站", rss: "网站", query: "关键词检索" };
  const TIERS = { A: "官方/权威", B: "专业媒体", C: "博主/社区" };

  const REGIONS = {
    cn: { name: "国内", desc: "中国大陆化工与石化：事故、监管政策、产能结构调整。" },
    asia: { name: "亚洲", desc: "日本、韩国、印度、东南亚及港澳台：事故、市场与产能整合。" },
    intl: { name: "国际", desc: "欧美、中东及全球：重大事故、调查报告、产能再平衡与地缘冲击。" },
  };
  const CATS = {
    incident: "事故",
    investigation: "调查报告",
    policy: "政策法规",
    capacity: "产能",
    market: "市场",
  };

  const app = document.getElementById("app");
  const searchInput = document.getElementById("search");
  const filters = { cn: "all", asia: "all", intl: "all", cases: "all", sources: "all" };
  let majorOnly = false;

  /* ---------- helpers ---------- */
  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const safeUrl = (u) => (/^https?:\/\//i.test(u || "") ? esc(u) : "#");
  const fmtDate = (d) => {
    if (!d) return "";
    const p = d.slice(0, 10).split("-");
    return p.length === 3 ? `${p[0]}年${+p[1]}月${+p[2]}日` : `${p[0]}年${+p[1]}月`;
  };
  const fmtIso = (iso) => {
    const d = new Date(iso);
    if (isNaN(d)) return "";
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  };
  const regionBadge = (r) => `<span class="badge r-${r}">${REGIONS[r].name}</span>`;
  const catBadge = (c) => `<span class="badge c-${c}">${CATS[c] || c}</span>`;

  /* ---------- 起因分类（FM 风险划分） ---------- */
  const PERILS = window.PERILS || [];
  const PERIL = {};
  PERILS.forEach((p) => {
    PERIL[p.id] = p;
    p.causeMap = {};
    p.causes.forEach((c) => {
      p.causeMap[c.id] = c;
      c.re = new RegExp(c.keywords, "i");
    });
    p.genericRe = p.generic ? new RegExp(p.generic, "i") : null;
    p.impactRe = p.impact ? new RegExp(p.impact, "i") : null;
  });
  const causeName = (c) => (PERIL[c.peril] && PERIL[c.peril].causeMap[c.cause] ? PERIL[c.peril].causeMap[c.cause].name : "");
  const perilBadge = (c, primary) =>
    PERIL[c.peril]
      ? `<a class="peril p-${c.peril}${primary ? " primary" : ""}" href="#/peril/${c.peril}?c=${c.cause}" title="${primary ? "主因" : "次因"}：${esc(PERIL[c.peril].name)}">${esc(
          causeName(c) || PERIL[c.peril].name
        )}</a>`
      : "";
  const causeBadges = (n) => (n.causes || []).map((c, i) => perilBadge(c, i === 0)).join("");
  // 实时动态按标题关键词归类：火灾爆炸看通用词或细分词；设备与自然灾害还需同时出现“影响”类词，减少误判
  function classifyFeed(title) {
    const out = [];
    PERILS.forEach((p) => {
      const hits = p.causes.filter((c) => c.re.test(title));
      if (p.genericRe) {
        if (p.genericRe.test(title)) out.push(...(hits.length ? hits : [{ id: "" }]).map((c) => ({ peril: p.id, cause: c.id })));
      } else if (hits.length && p.impactRe.test(title)) {
        out.push(...hits.map((c) => ({ peril: p.id, cause: c.id })));
      }
    });
    return out;
  }
  const FEED_ALL = Object.keys(FEEDS.items || {}).flatMap((r) => (FEEDS.items[r] || []).map((i) => Object.assign({ region: r, causes: classifyFeed(i.title) }, i)));
  const dsList = (refs) =>
    (refs || []).map((n) => `<a class="ds" href="#/training?ds=${esc(n)}" title="在 Data Sheet 速查中查看">DS ${esc(n)}</a>`).join("");

  const IMAGES = window.NEWS_IMAGES || {};
  // 托管在其他域名（如 Lovable 外壳从 jsDelivr 加载本仓库）时，由外壳设置图片等静态文件的根地址
  const BASE = window.SITE_BASE || "";
  const imgOf = (n) => {
    const im = IMAGES[n.id];
    return im && im.file ? im : null;
  };
  const thumb = (n, cls) => {
    const im = imgOf(n);
    return im ? `<img class="${cls}" src="${esc(BASE + (im.thumb || im.file))}" alt="${esc(n.title)}（${esc(im.credit)}报道图片）" loading="lazy" onerror="this.remove()">` : "";
  };
  function figure(n) {
    const im = IMAGES[n.id];
    if (!im) return "";
    if (!im.file) return `<p class="no-photo">原报道未附现场图片。</p>`;
    return `<figure class="photo"><img src="${esc(BASE + im.file)}" alt="${esc(n.title)}" loading="lazy" onerror="this.parentNode.remove()"><figcaption>图片来源：<a href="${safeUrl(
      im.page
    )}" target="_blank" rel="noopener">${esc(im.credit)} 报道 ↗</a>，版权归原媒体所有</figcaption></figure>`;
  }

  function card(n, open) {
    const refs = n.refs && n.refs.length ? `<div class="row"><span class="k">参考 Data Sheet：</span>${dsList(n.refs)}</div>` : "";
    const tags = n.tags && n.tags.length ? `<div class="row"><span class="k">标签：</span>${n.tags.map((t) => `<span class="badge">${esc(t)}</span>`).join("")}</div>` : "";
    const discuss = n.discuss ? `<div class="discuss"><strong>培训讨论：</strong>${esc(n.discuss)}</div>` : "";
    const sources = (n.sources || []).map((s) => `<a href="${safeUrl(s.url)}" target="_blank" rel="noopener">${esc(s.name)} ↗</a>`).join("");
    return `
      <details class="card" id="n-${esc(n.id)}" ${open ? "open" : ""}>
        <summary class="${imgOf(n) ? "has-thumb" : ""}">
          <div class="sum-text">
            <div class="top">${regionBadge(n.region)}${catBadge(n.category)}<span>${esc(n.country)}</span><span>·</span><time>${fmtDate(n.date)}</time></div>
            ${n.causes ? `<div class="causes">${causeBadges(n)}</div>` : ""}
            <h3>${esc(n.title)}</h3>
            <p class="lead">${esc(n.summary)}</p>
          </div>
          ${thumb(n, "thumb")}
        </summary>
        <div class="body">
          ${figure(n)}
          <p>${esc(n.summary)}</p>
          <div class="fm-box"><h4>FM 风险视角</h4><p>${esc(n.fm)}</p></div>
          ${discuss}${refs}${tags}
          <div class="row sources"><span class="k">来源：</span>${sources}</div>
        </div>
      </details>`;
  }

  const updatedText = () =>
    FEEDS.updated ? `更新于 ${new Date(FEEDS.updated).toLocaleString("zh-CN", { hour12: false })}` : "尚未抓取";

  function feedItem(i, showRegion) {
    const src = SRC_BY_ID[i.sid];
    const type = i.type ? `<span class="badge">${TYPES[i.type] || ""}</span> ` : "";
    return `<li class="${i.major ? "is-major" : ""}">${i.major ? `<span class="badge major">重大</span> ` : ""}${
      showRegion && REGIONS[i.region] ? regionBadge(i.region) + " " : ""
    }<a href="${safeUrl(i.link || i.url)}" target="_blank" rel="noopener">${esc(i.title)}</a><div class="meta">${type}${esc(i.source || (src && src.name))}${
      i.date ? " · " + fmtIso(i.date) : ""
    }</div></li>`;
  }

  // 重大动态卡片：配原文报道的头图；没有头图时显示起因色块，不使用生成图片
  function majorCard(i) {
    const c = (i.causes || []).find((x) => PERIL[x.peril]);
    const p = c && PERIL[c.peril];
    const cause = p ? (p.causeMap[c.cause] ? p.causeMap[c.cause].name : p.name) : "";
    const img = i.img
      ? `<img src="${esc(BASE + i.img)}" alt="" loading="lazy" onerror="this.parentNode.classList.add('noimg');this.remove()">`
      : "";
    return `<a class="major-card${p ? " p-" + p.id : ""}" href="${safeUrl(i.link || i.url)}" target="_blank" rel="noopener">
        <div class="mc-media${i.img ? "" : " noimg"}">${img}<span class="ph-label">${esc(p ? p.name : "重大动态")}</span></div>
        <div class="mc-body">
          <div class="mc-top"><span class="badge major">重大</span>${REGIONS[i.region] ? regionBadge(i.region) : ""}${cause ? `<span class="mc-cause">${esc(cause)}</span>` : ""}</div>
          <h3>${esc(i.title)}</h3>
          <div class="meta">${esc(i.source)}${i.date ? " · " + fmtIso(i.date) : ""}</div>
        </div>
      </a>`;
  }

  function feedPanel(region) {
    const all = (FEEDS.items && FEEDS.items[region]) || [];
    const majors = all.filter((i) => i.major).length;
    const items = majorOnly ? all.filter((i) => i.major) : all;
    const toggle = all.length
      ? `<div class="toolbar"><button class="chip ${majorOnly ? "" : "active"}" data-major="0">全部<span class="n">${all.length}</span></button><button class="chip ${
          majorOnly ? "active" : ""
        }" data-major="1">只看重大<span class="n">${majors}</span></button></div>`
      : "";
    const list = items.length
      ? `<ul class="feed">${items.slice(0, 40).map((i) => feedItem(i)).join("")}</ul>`
      : all.length
      ? `<p class="hint">暂无重大动态。</p>`
      : `<p class="hint">暂无自动抓取的新闻。在 GitHub Actions 中运行“更新自动新闻源”工作流后将显示最新动态。</p>`;
    return `<aside class="panel"><h3>实时动态</h3><p class="hint">来自 <a href="#/sources">${SRC.sources.length} 个信息源</a>，未经人工审核 · ${esc(
      SRC.schedule || ""
    )} · ${updatedText()}</p>${toggle}${list}</aside>`;
  }

  // 一排筛选按钮：options 为 [值, 显示名, 数量]，首个固定为“全部”
  function chipRow(key, total, options) {
    const btn = (value, label, n) =>
      `<button class="chip ${filters[key] === value ? "active" : ""}" data-filter="${key}" data-value="${value}">${label}<span class="n">${n}</span></button>`;
    return btn("all", "全部", total) + options.filter((o) => o[2]).map((o) => btn(...o)).join("");
  }

  function chips(key, list) {
    const counts = {};
    list.forEach((n) => (counts[n.category] = (counts[n.category] || 0) + 1));
    return chipRow(key, list.length, Object.keys(CATS).map((c) => [c, CATS[c], counts[c]]));
  }

  /* ---------- views ---------- */
  function viewHome() {
    const stats = Object.keys(REGIONS)
      .map((r) => {
        const list = NEWS.filter((n) => n.region === r);
        const inc = list.filter((n) => n.category === "incident").length;
        const auto = ((FEEDS.items && FEEDS.items[r]) || []).length;
        return `<a class="stat" href="#/${r}" style="--c: var(--${r})"><div class="label">${REGIONS[r].name}板块</div><div class="num">${list.length}</div><div class="sub">精选 · 其中事故 ${inc} 起${auto ? ` · 实时动态 ${auto} 条` : ""}</div></a>`;
      })
      .join("");
    const incidents = NEWS.filter((n) => n.category === "incident").length;
    const withDiscuss = NEWS.filter((n) => n.discuss).length;

    const cols = Object.keys(REGIONS)
      .map((r) => {
        const list = NEWS.filter((n) => n.region === r).slice(0, 5);
        return `<div class="col"><h3>${REGIONS[r].name}<a href="#/${r}">查看全部 →</a></h3><ul class="mini">${list
          .map(
            (n) =>
              `<li class="${imgOf(n) ? "has-thumb" : ""}">${thumb(n, "mini-thumb")}<div><a href="#/news/${esc(n.id)}">${esc(n.title)}</a><div class="meta">${catBadge(n.category)} ${esc(n.country)} · ${fmtDate(n.date)}</div></div></li>`
          )
          .join("")}</ul></div>`;
      })
      .join("");

    const latestIncident = NEWS.find((n) => n.category === "incident" && n.discuss);

    const weekAgo = Date.now() - 7 * 86400000;
    const majors = FEED_ALL
      .filter((i) => i.major && (!i.date || Date.parse(i.date) >= weekAgo))
      .sort((a, b) => (b.score || 0) - (a.score || 0) || (b.date || "").localeCompare(a.date || ""))
      .slice(0, 9);
    const majorSection = `<div class="section"><h2>近 7 天重大动态 <small>自动识别 · ${esc(SRC.schedule || "")} · ${updatedText()}</small></h2>${
      majors.length
        ? `<div class="major-grid">${majors.map(majorCard).join("")}</div>`
        : `<div class="empty">暂无自动抓取数据。信息源每 4 小时由 GitHub Actions 自动抓取，首次运行后这里会显示来自官方、专业媒体、公众号与 X 博主的重大动态。</div>`
    }</div>`;

    // 各区块带 h-* 类名：桌面按书写顺序显示，手机上由 CSS 调整为“重大动态在前、分类在后”
    return `<div class="home">
      <div class="page-head h-head">
        <h1>行业实况总览</h1>
        <p>面向 FM 亚洲化工专家的资讯与培训中心。每条精选新闻都附有“FM 风险视角”解读与培训讨论题，把行业实况转化为损失预防能力。</p>
      </div>
      <div class="stats h-stats">
        ${stats}
        <a class="stat" href="#/cases"><div class="label">案例库</div><div class="num">${incidents}</div><div class="sub">事故案例 · ${withDiscuss} 个讨论题</div></a>
      </div>
      <div class="h-perils">${perilSection()}</div>
      <div class="h-major">${majorSection}</div>
      <div class="section h-boards"><h2>三大板块 <small>精选 · 按日期倒序</small></h2><div class="columns">${cols}</div></div>
      ${
        latestIncident
          ? `<div class="section h-case"><h2>本期案例研讨 <small>从最新事故中学习</small></h2>${card(latestIncident, true)}</div>`
          : ""
      }
    </div>`;
  }

  const INCIDENTS = NEWS.filter((n) => n.causes);
  const matches = (causes, peril, cause) => (causes || []).some((c) => c.peril === peril && (!cause || c.cause === cause));
  // 各起因的事故数只在加载时统计一次：键为 "fire" 或 "fire/runaway"，primary 为主因计数
  const COUNTS = { primary: {} };
  INCIDENTS.forEach((n) => {
    COUNTS.primary[n.causes[0].peril] = (COUNTS.primary[n.causes[0].peril] || 0) + 1;
    new Set(n.causes.flatMap((c) => [c.peril, `${c.peril}/${c.cause}`])).forEach((k) => (COUNTS[k] = (COUNTS[k] || 0) + 1));
  });
  const count = (peril, cause) => COUNTS[cause ? `${peril}/${cause}` : peril] || 0;

  function perilSection() {
    const tiles = PERILS.map((p) => {
      const auto = FEED_ALL.filter((i) => matches(i.causes, p.id)).length;
      const subs = p.causes
        .map((c) => {
          const k = count(p.id, c.id);
          return `<a class="sub${k ? "" : " zero"}" href="#/peril/${p.id}?c=${c.id}">${esc(c.name)}<span class="n">${k}</span></a>`;
        })
        .join("");
      return `<div class="peril-tile p-${p.id}">
          <a class="peril-head" href="#/peril/${p.id}">
            <span class="peril-en">${esc(p.en)}</span>
            <span class="peril-name">${esc(p.name)}</span>
            <span class="peril-count"><b>${count(p.id)}</b> 起精选事故（主因 ${COUNTS.primary[p.id] || 0}）${auto ? ` · 实时动态 ${auto} 条` : ""}</span>
          </a>
          <div class="subs">${subs}</div>
        </div>`;
    }).join("");
    return `<div class="section"><h2>按起因浏览 <small>参照 FM 风险分类 · 点击进入相关事故</small></h2><div class="peril-grid">${tiles}</div></div>`;
  }

  function viewPeril(id, cause) {
    const p = PERIL[id];
    if (!p) return null;
    if (cause && !p.causeMap[cause]) cause = null;
    const rel = INCIDENTS.filter((n) => matches(n.causes, id, cause)).sort(
      (a, b) => (b.causes[0].peril === id) - (a.causes[0].peril === id) || b.date.localeCompare(a.date)
    );
    const autos = FEED_ALL.filter((i) => matches(i.causes, id, cause));
    const chipsHtml =
      `<a class="chip ${!cause ? "active" : ""}" href="#/peril/${id}">全部<span class="n">${count(id)}</span></a>` +
      p.causes
        .map((c) => `<a class="chip ${cause === c.id ? "active" : ""}" href="#/peril/${id}?c=${c.id}">${esc(c.name)}<span class="n">${count(id, c.id)}</span></a>`)
        .join("");
    const other = PERILS.filter((x) => x.id !== id)
      .map((x) => `<a class="peril p-${x.id}" href="#/peril/${x.id}">${esc(x.name)} →</a>`)
      .join("");
    const ds = cause ? p.causeMap[cause].ds : p.ds;
    const cards = rel.length
      ? rel
          .map((n) => {
            const primary = n.causes[0].peril === id;
            return `<div class="peril-role">${primary ? "主因" : "次因（诱发或后果）"}</div>${card(n)}`;
          })
          .join("")
      : `<div class="empty">该起因下暂无精选事故。</div>`;
    const autoList = autos.length
      ? `<ul class="feed">${autos.slice(0, 40).map((i) => feedItem(i, true)).join("")}</ul>`
      : `<p class="hint">实时动态中暂无匹配的条目。</p>`;
    return `
      <div class="page-head peril-page p-${id}">
        <p class="peril-en">${esc(p.en)} · FM 风险分类</p>
        <h1>${esc(p.name)}${cause ? ` · ${esc(p.causeMap[cause].name)}` : ""}</h1>
        <p>${esc(p.desc)}</p>
        <div class="row"><span class="k">参考：</span>${esc(p.series)}${ds && ds.length ? " · " + dsList(ds) : ""}</div>
        <div class="row"><span class="k">其他起因：</span>${other}</div>
      </div>
      <div class="split">
        <div>
          <div class="toolbar">${chipsHtml}</div>
          <div class="cards">${cards}</div>
        </div>
        <aside class="panel"><h3>实时动态中的相关条目</h3><p class="hint">按标题关键词自动归类，未经人工审核 · ${autos.length} 条</p>${autoList}</aside>
      </div>`;
  }

  function viewRegion(r) {
    const all = NEWS.filter((n) => n.region === r);
    const list = filters[r] === "all" ? all : all.filter((n) => n.category === filters[r]);
    return `
      <div class="page-head"><h1>${REGIONS[r].name}板块</h1><p>${REGIONS[r].desc}</p></div>
      <div class="split">
        <div>
          <div class="toolbar">${chips(r, all)}</div>
          <div class="cards">${list.length ? list.map((n) => card(n)).join("") : `<div class="empty">该分类暂无内容</div>`}</div>
        </div>
        ${feedPanel(r)}
      </div>`;
  }

  function viewCases() {
    const all = NEWS.filter((n) => n.category === "incident" || n.category === "investigation");
    const byRegion = filters.cases === "all" ? all : all.filter((n) => n.region === filters.cases);
    const regionChips = chipRow(
      "cases",
      all.length,
      Object.keys(REGIONS).map((r) => [r, REGIONS[r].name, all.filter((n) => n.region === r).length])
    );
    const rows = byRegion
      .map(
        (n) =>
          `<tr><td>${fmtDate(n.date)}</td><td>${regionBadge(n.region)} ${esc(n.country)}</td><td><div class="case-title">${thumb(n, "mini-thumb")}<a href="#/news/${esc(n.id)}">${esc(n.title)}</a></div></td><td><div class="causes">${causeBadges(n) || "—"}</div></td><td>${dsList(n.refs)}</td></tr>`
      )
      .join("");
    return `
      <div class="page-head"><h1>案例库</h1><p>事故与调查报告汇总。建议用法：晨会“15 分钟案例”——直接原因 → 深层原因 → 对应的 Data Sheet 建议 → 我的客户有没有同样的问题？</p></div>
      <div class="toolbar">${regionChips}</div>
      <div class="table-wrap"><table>
        <thead><tr><th>日期</th><th>地区</th><th>事件</th><th>起因（首项为主因）</th><th>Data Sheet</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="5">暂无</td></tr>`}</tbody>
      </table></div>
      <div class="section"><h2>案例详情</h2><div class="cards">${byRegion.map((n) => card(n)).join("")}</div></div>`;
  }

  function viewTraining(highlightDs) {
    const levels = (T.levels || [])
      .map(
        (l) =>
          `<div class="level"><h3>${esc(l.level)}</h3><div class="goal">${esc(l.goal)}</div>${l.modules
            .map((m) => `<h4>${esc(m.title)}</h4><ul>${m.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>`)
            .join("")}</div>`
      )
      .join("");

    const dsRows = (T.datasheets || [])
      .map((d) => {
        const related = NEWS.filter((n) => (n.refs || []).includes(d.no));
        const rel = related.length
          ? related.map((n) => `<a href="#/news/${esc(n.id)}">${esc(n.country)} ${fmtDate(n.date)}</a>`).join("；")
          : `<span style="color:var(--muted)">—</span>`;
        const hl = highlightDs === d.no ? ` style="background:var(--fm-bg)" id="ds-hl"` : "";
        return `<tr${hl}><td class="mono">DS ${esc(d.no)}</td><td>${esc(d.title)}</td><td>${esc(d.use)}</td><td>${rel}</td></tr>`;
      })
      .join("");

    const regs = (T.regulations || [])
      .map((g) => `<div class="panel"><h3>${esc(g.region)}</h3><ul>${g.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></div>`)
      .join("");

    const glossary = (T.glossary || [])
      .map((g) => `<tr><td class="mono">${esc(g[0])}</td><td>${esc(g[1])}</td><td>${esc(g[2])}</td></tr>`)
      .join("");

    const quiz = (T.quiz || [])
      .map(
        (q, qi) =>
          `<div class="q" data-q="${qi}"><p>${qi + 1}. ${esc(q.q)}</p>${q.options
            .map((o, oi) => `<label><input type="radio" name="q${qi}" value="${oi}"> ${esc(o)}</label>`)
            .join("")}<div class="explain">${esc(q.explain)}</div></div>`
      )
      .join("");

    return `
      <div class="page-head"><h1>培训基地</h1><p>分三级的学习路径，配合新闻案例、Data Sheet 速查、区域法规、术语表与自测题，帮助亚洲化工专家系统提升。</p></div>
      <div class="section"><h2>学习路径</h2><div class="levels">${levels}</div></div>
      <div class="section"><h2>Data Sheet 速查 <small>编号仅供索引，以 FM 官方最新版为准</small></h2>
        <div class="table-wrap"><table><thead><tr><th>编号</th><th>标题</th><th>典型用途</th><th>相关新闻案例</th></tr></thead><tbody>${dsRows}</tbody></table></div>
      </div>
      <div class="section"><h2>亚洲区域法规速览</h2><div class="regs">${regs}</div></div>
      <div class="section"><h2>术语表</h2>
        <div class="table-wrap"><table><thead><tr><th>缩写</th><th>中文</th><th>说明</th></tr></thead><tbody>${glossary}</tbody></table></div>
      </div>
      <div class="section" id="quiz"><h2>自测题 <small>选择后即时显示解析</small></h2>
        <div class="quiz">${quiz}</div>
        <div class="score" id="score"></div>
      </div>`;
  }

  function viewSources() {
    const st = FEEDS.status || {};
    const typeOrder = ["wechat", "x", "site", "query"];
    const counts = {};
    SRC.sources.forEach((s) => (counts[s.type] = (counts[s.type] || 0) + 1));
    const f = filters.sources;
    const chipsHtml = chipRow("sources", SRC.sources.length, typeOrder.map((t) => [t, TYPES[t], counts[t]]));
    const stateOf = (s) => {
      const x = st[s.id];
      if (x && x.state === "ok") return `<span class="badge ok">已接入 · ${x.count} 条</span>`;
      if (x && x.state === "error") return `<span class="badge c-incident" title="${esc(x.error)}">抓取失败</span>`;
      if ((s.type === "wechat" && !s.rss) || (x && x.state === "unconfigured")) return `<span class="badge">待配置</span>`;
      return `<span class="badge">待首次抓取</span>`;
    };
    const linkOf = (s) => {
      if (s.type === "wechat") return `<a href="https://weixin.sogou.com/weixin?type=1&query=${encodeURIComponent(s.name)}" target="_blank" rel="noopener">搜狗微信搜索 ↗</a>`;
      if (s.type === "x") return `<a href="https://x.com/${esc(s.handle)}" target="_blank" rel="noopener">@${esc(s.handle)} ↗</a>`;
      if (s.home) return `<a href="${safeUrl(s.home)}" target="_blank" rel="noopener">${esc(s.site || "访问")} ↗</a>`;
      return "—";
    };
    const groups = typeOrder
      .filter((t) => (f === "all" || f === t) && counts[t])
      .map((t) => {
        const rows = SRC.sources
          .filter((s) => s.type === t)
          .sort((a, b) => a.tier.localeCompare(b.tier))
          .map(
            (s) =>
              `<tr><td><strong>${esc(s.name)}</strong></td><td>${s.type === "query" ? `<span class="badge">补充检索</span>` : `<span class="badge tier-${s.tier}">${s.tier} · ${TIERS[s.tier]}</span>`}</td><td>${
                REGIONS[s.region] ? regionBadge(s.region) : `<span class="badge">自动归类</span>`
              }</td><td>${esc(s.focus || s.query || "")}</td><td>${linkOf(s)}</td><td>${stateOf(s)}</td></tr>`
          )
          .join("");
        return `<div class="section"><h2>${TYPES[t]} <small>${counts[t]} 个</small></h2><div class="table-wrap"><table><thead><tr><th>名称</th><th>级别</th><th>板块</th><th>关注点</th><th>链接</th><th>状态</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
      })
      .join("");
    return `
      <div class="page-head"><h1>信息源</h1>
        <p>实时动态${esc(SRC.schedule || "")}自动抓取（${updatedText()}）。标题命中“死亡、爆炸、不可抗力、调查报告”等关键词，并结合来源级别（官方 &gt; 专业媒体 &gt; 博主）打分，达到阈值即标记为<span class="badge major">重大</span>。精选新闻与 FM 风险视角由人工整理。</p>
      </div>
      <div class="panel note">
        <h3>公众号与 X 博主如何接入</h3>
        <ul>
          <li><strong>公众号</strong>：微信没有公开 RSS。可自建 <a href="https://github.com/cooderl/wewe-rss" target="_blank" rel="noopener">WeWe RSS</a>（或 RSSHub 等），在 <code>data/sources.js</code> 中为对应公众号填写 <code>rss</code> 地址，服务地址可写成 <code>\${WECHAT_RSS_BASE}</code> 并在 GitHub Secrets 中配置。未配置前仅在此列出，可点击“搜狗微信搜索”手动查看。</li>
          <li><strong>X 博主</strong>：X 已关闭免费 API。部署带 X 账号认证的 <a href="https://docs.rsshub.app/" target="_blank" rel="noopener">RSSHub</a> 实例后，在 GitHub Secrets 中设置 <code>RSSHUB_BASE</code> 即自动接入。</li>
          <li><strong>网站</strong>：通过 Google News 按站点检索，无需额外配置。</li>
        </ul>
      </div>
      <div class="toolbar" style="margin-top:16px">${chipsHtml}</div>
      ${groups}`;
  }

  function viewSearch(q) {
    const k = q.toLowerCase();
    const hit = (s) => String(s || "").toLowerCase().includes(k);
    const curated = NEWS.filter((n) => [n.title, n.summary, n.fm, n.country, (n.tags || []).join(" ")].some(hit));
    const auto = FEED_ALL.filter((i) => hit(i.title) || hit(i.source));
    return `
      <div class="page-head"><h1>搜索：“${esc(q)}”</h1><p>精选 ${curated.length} 条 · 实时动态 ${auto.length} 条</p></div>
      <div class="cards">${curated.map((n) => card(n)).join("") || `<div class="empty">精选新闻中无匹配结果</div>`}</div>
      ${
        auto.length
          ? `<div class="section"><h2>实时动态</h2><div class="panel"><ul class="feed">${auto
              .map((i) => feedItem(i, true))
              .join("")}</ul></div></div>`
          : ""
      }`;
  }

  /* ---------- router ---------- */
  function route() {
    const hash = location.hash.replace(/^#\/?/, "");
    const [path, query] = hash.split("?");
    const params = new URLSearchParams(query || "");
    const parts = path.split("/");
    let view = parts[0] || "home";
    let html;
    let focus = null;

    if (view === "search") {
      html = viewSearch(params.get("q") || "");
    } else if (view === "news" && parts[1]) {
      const n = NEWS.find((x) => x.id === parts[1]);
      if (n) {
        view = n.region;
        html = viewRegion(n.region);
        focus = "n-" + n.id;
      }
    } else if (REGIONS[view]) {
      html = viewRegion(view);
    } else if (view === "sources") {
      html = viewSources();
    } else if (view === "peril" && parts[1]) {
      html = viewPeril(parts[1], params.get("c"));
      view = "cases";
    } else if (view === "cases") {
      html = viewCases();
    } else if (view === "training") {
      html = viewTraining(params.get("ds"));
      if (params.get("ds")) focus = "ds-hl";
    }
    if (!html) {
      view = "home";
      html = viewHome();
    }

    app.innerHTML = html;
    document.querySelectorAll("#tabs a").forEach((a) => a.classList.toggle("active", a.dataset.view === view));

    if (focus) {
      if (filters[view] && filters[view] !== "all" && !document.getElementById(focus)) {
        filters[view] = "all";
        return route();
      }
      const el = document.getElementById(focus);
      if (el) {
        if (el.tagName === "DETAILS") el.open = true;
        el.scrollIntoView({ block: "start" }); // 顶部留白由 CSS scroll-margin-top 控制，避开吸顶导航
      }
    } else {
      window.scrollTo(0, 0);
    }
  }

  /* ---------- events ---------- */
  app.addEventListener("click", (e) => {
    const mj = e.target.closest(".chip[data-major]");
    if (mj) {
      majorOnly = mj.dataset.major === "1";
      const y = window.scrollY;
      route();
      window.scrollTo(0, y);
      return;
    }
    const chip = e.target.closest(".chip[data-filter]");
    if (chip) {
      filters[chip.dataset.filter] = chip.dataset.value;
      route();
    }
  });

  app.addEventListener("change", (e) => {
    const input = e.target;
    if (input.type !== "radio") return;
    const box = input.closest(".q");
    const qi = +box.dataset.q;
    const q = T.quiz[qi];
    box.classList.add("done");
    box.querySelectorAll("label").forEach((l, i) => {
      l.classList.toggle("right", i === q.answer);
      l.classList.toggle("wrong", i === +input.value && i !== q.answer);
      l.querySelector("input").disabled = true;
    });
    box.dataset.correct = +input.value === q.answer ? "1" : "0";
    const done = app.querySelectorAll(".q.done");
    const right = app.querySelectorAll('.q[data-correct="1"]').length;
    document.getElementById("score").textContent = `已答 ${done.length}/${T.quiz.length}，答对 ${right} 题`;
  });

  let searchTimer;
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      const q = searchInput.value.trim();
      location.hash = q ? "#/search?q=" + encodeURIComponent(q) : "#/";
    }, 250);
  });

  const themeBtn = document.getElementById("theme");
  themeBtn.addEventListener("click", () => {
    const cur = document.documentElement.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
  });

  window.addEventListener("hashchange", route);
  route();
})();
