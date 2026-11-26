(function () {
  "use strict";
  window.createLossUI = function (model, helpers) {
    const { esc, safeUrl } = helpers;
    const M = window.LossModel;
    const route = (n, dimension) => "#/loss-web/" + (n.id || "feed") + "?" + new URLSearchParams({ ...(n.id ? {} : { url: n.link || n.url || "" }), ...(dimension ? { dimension } : {}) });
    function sources(ids, data) {
      return (ids || []).map(id => data.sources.find(s => s.id === id)).filter(Boolean).map(s => `<a href="${safeUrl(s.url)}" target="_blank" rel="noopener">${esc(s.title || s.name)}${s.date ? " · " + esc(s.date) : ""} ↗</a>`).join("；");
    }
    function field(key, value, data) {
      return `<div class="loss-fact" data-loss-field="${key}"><dt>${M.fields[key]} <span class="loss-status ${esc(value.status)}">${M.states[value.status]}</span></dt><dd>${esc(value.value)}${value.sources.length ? `<small>${sources(value.sources, data)}</small>` : ""}</dd></div>`;
    }
    function amounts(data) {
      if (!data.lossAmounts?.length) return "";
      return `<div class="loss-amounts">${data.lossAmounts.map(a => `<div><span>${esc(a.label)}</span><strong>${esc(a.currency)} ${esc(Number(a.amount).toLocaleString("zh-CN"))}</strong><small>${esc(a.scope || "")}${a.asOf ? " · 口径截至 " + esc(a.asOf) : ""}</small><small>${sources([a.source], data)}</small></div>`).join("")}</div>`;
    }
    function relations(n, data) {
      const related = model.related(n, data);
      return `<div class="loss-related"><h4>最接近的 ${related.length || "待补充"} 个案件</h4><p class="hint">按已记录的装置、设备、失效过程和后果类比；共性不证明根因相同。</p>${related.length ? `<ol>${related.map(r => `<li><a href="${route(r.news)}">${esc(model.insight(r.news).shortTitle)} →</a> <span class="loss-status">${r.reviewed ? "已复核的关联" : "自动匹配·待复核"}</span><p>${esc(r.reason)}</p><small>关键差异：${esc(r.difference)}</small></li>`).join("")}</ol>` : `<p class="hint">当前案例库中没有足够相近的案件，不强行拼凑。</p>`}<a class="btn ghost" href="${route(n)}">打开损失蜘蛛网 →</a></div>`;
    }
    function panel(n, inline, options = {}) {
      const data = model.insight(n, inline);
      if (!model.isLoss(n) && !inline && !options.forceLoss) return `<section class="loss-insights"><h4>一句话总结</h4><p>${esc(data.brief)}</p><p class="hint">本条为行业动态；设备故障、事故损失和事故等级不适用。</p></section>`;
      const timeline = data.timeline?.length ? `<details class="loss-timeline"${options.expanded ? " open" : ""}><summary>后续进展时间线 · ${data.timeline.length} 条</summary><ol>${data.timeline.map(t => `<li><time>${esc(t.date)}</time> ${esc(t.text)}<small>${sources(t.sources, data)}</small></li>`).join("")}</ol></details>` : "";
      return `<section class="loss-insights"><div class="loss-heading"><h4>损失洞察</h4>${data.reviewedAt ? `<span>核验 ${esc(data.reviewedAt)}${data.asOf ? " · 资料截至 " + esc(data.asOf) : ""}</span>` : ""}</div><p class="loss-brief"><strong>一句话总结</strong>${esc(data.brief)}</p><p class="hint">${esc(data.basis)}</p>${amounts(data)}<dl class="loss-facts">${Object.keys(M.fields).map(key => field(key, data.fields[key], data)).join("")}</dl>${timeline}
      ${data.takeaways?.length ? `<div class="loss-analysis"><h4>工程洞察 <span class="loss-status analysis">分析，非事故定论</span></h4><ul>${data.takeaways.map(t => `<li>${esc(t)}</li>`).join("")}</ul></div>` : ""}
      ${data.questions?.length ? `<details><summary>还需要哪些证据？</summary><ul>${data.questions.map(t => `<li>${esc(t)}</li>`).join("")}</ul></details>` : ""}
      ${options.noRelated ? "" : relations(n, data)}</section>`;
    }
    function network(n, inline, dimension) {
      const data = model.insight(n, inline), related = model.related(n, data);
      const compact = matchMedia("(max-width: 600px)").matches;
      const cx = compact ? 210 : 480, cy = compact ? 350 : 310;
      const groups = [
        { id: "equipment", label: "设备", key: "equipment", x: 480, y: 95 },
        { id: "mechanism", label: "故障与起因", key: "failure", x: 685, y: 205 },
        { id: "consequence", label: "后果与停产", key: "interruption", x: 685, y: 415 },
        { id: "finance", label: "损失金额", key: "damage", x: 480, y: 525 },
        { id: "human", label: "人为与组织", key: "human", x: 275, y: 415 },
        { id: "recovery", label: "后续发展", key: "recovery", x: 275, y: 205 }
      ];
      if (compact) {
        const points = [[210,170],[330,275],[330,435],[210,545],[90,435],[90,275]];
        groups.forEach((g,i) => { g.x = points[i][0]; g.y = points[i][1]; });
      }
      const selected = groups.find(g => g.id === dimension);
      const positions = compact ? [[100,65],[320,65],[210,660]] : [[140, 70], [820, 70], [820, 550]];
      const nodeW = compact ? 132 : 166, caseW = compact ? 168 : 210, centerW = compact ? 180 : 240;
      const link = (x1,y1,x2,y2,cls) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}"/>`;
      const shorten = (text, length) => text.length > length ? text.slice(0, length) + "…" : text;
      const caseEdges = related.map((r, i) => r.facets.length ? groups.filter(g => r.facets.includes(g.id) || (g.id === "equipment" && r.facets.includes("process"))).map(g => link(positions[i][0],positions[i][1],g.x,g.y,`loss-edge case-${i}${selected && g.id !== selected.id ? " muted" : ""}`)).join("") : link(positions[i][0],positions[i][1],cx,cy,`loss-spoke unknown${selected ? " muted" : ""}`)).join("");
      const spokes = groups.map(g => link(cx,cy,g.x,g.y,`loss-spoke${data.fields[g.key].status === "unknown" ? " unknown" : ""}${selected && g.id !== selected.id ? " muted" : ""}`)).join("");
      const nodes = groups.map(g => `<a href="${route(n, g.id)}" aria-label="查看${g.label}"><g class="loss-node ${data.fields[g.key].status}${selected?.id === g.id ? " selected" : ""}"><rect x="${g.x-nodeW/2}" y="${g.y-34}" width="${nodeW}" height="68" rx="13"/><text x="${g.x}" y="${g.y-6}">${g.label}</text><text class="sub" x="${g.x}" y="${g.y+17}">${M.states[data.fields[g.key].status]}</text></g></a>`).join("");
      const cases = related.map((r,i) => `<a href="${route(r.news)}" aria-label="以${esc(model.insight(r.news).shortTitle)}为中心查看"><g class="loss-case case-${i}"><rect x="${positions[i][0]-caseW/2}" y="${positions[i][1]-34}" width="${caseW}" height="68" rx="12"/><text x="${positions[i][0]}" y="${positions[i][1]-8}">相似案件 ${i+1}</text><text class="sub" x="${positions[i][0]}" y="${positions[i][1]+16}">${esc(shorten(model.insight(r.news).shortTitle, compact ? 11 : 14))}</text></g></a>`).join("");
      return `<div class="page-head"><p><a href="#/cases">← 案例库</a></p><h1>损失蜘蛛网</h1><p>${esc(n.title)}</p></div>
        <div class="loss-web-layout"><section class="loss-web-chart"><div class="toolbar" aria-label="蜘蛛网信息筛选"><a class="chip ${selected ? "" : "active"}" href="${route(n)}">全部关联</a>${groups.map(g => `<a class="chip ${selected?.id === g.id ? "active" : ""}" href="${route(n,g.id)}">${g.label}</a>`).join("")}</div><p class="hint">点击风险维度查看证据；点击案件更换中心。连线表示共性，不代表事故间因果关系。</p>
        <div class="loss-web-canvas${compact ? " compact" : ""}"><svg viewBox="${compact ? "0 0 420 750" : "0 0 960 620"}" role="img" aria-label="${esc(data.shortTitle)}与${related.length}个相似案件的损失关联网络">${caseEdges}${spokes}${nodes}${cases}<g class="loss-center"><rect x="${cx-centerW/2}" y="${cy-44}" width="${centerW}" height="88" rx="18"/><text x="${cx}" y="${cy-11}">${esc(shorten(data.shortTitle,compact ? 11 : 14))}</text><text class="sub" x="${cx}" y="${cy+16}">中心案件 · ${esc(n.date || "日期待核实")}</text></g></svg></div>
        <p class="hint">实线：已披露或初步事实 · 虚线：信息待核实。金额保留原币种与口径，不作强行加总。</p>
        ${selected ? `<dl class="loss-facts">${field(selected.key, data.fields[selected.key], data)}</dl>` : ""}
        ${relations(n, data)}</section><div>${panel(n, inline, { noRelated: true, expanded: true })}</div></div>`;
    }
    return { panel, network, route };
  };
})();
