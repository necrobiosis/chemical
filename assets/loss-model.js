(function (root, factory) {
  const model = factory();
  if (typeof module === "object" && module.exports) module.exports = model;
  else root.LossModel = model;
})(typeof window === "undefined" ? this : window, function () {
  "use strict";
  const fields = {
    equipment: "什么设备", failure: "发生什么故障", severity: "严重程度", casualties: "人员与外部影响",
    directCause: "直接起因", rootCause: "根本原因", human: "人为与组织因素", damage: "财产损失",
    interruption: "停产与营业中断", recovery: "后续发展", insurance: "保险与赔付"
  };
  const states = { confirmed: "已确认", reported: "来源披露", preliminary: "初步结论", unknown: "待核实", analysis: "工程分析" };
  const facets = { process: "相同工艺", equipment: "相同设备", mechanism: "相近失效过程", consequence: "相似后果", human: "已知组织因素" };
  const unknown = key => ({ value: key === "human" ? "尚无足够证据区分个人操作、管理、设计或检验等因素。" : key === "damage" ? "尚未核实可比口径的损失金额；未披露不等于零损失。" : "现有已整理资料未明确，待来源补充。", status: "unknown", sources: [] });
  function create(news, library) {
    const records = library?.cases || {};
    const byId = new Map(news.map(n => [n.id, n]));
    const get = id => byId.get(id);
    function insight(n, inline) {
      const raw = records[n.id] || inline || n.insights || {};
      const sources = raw.sources?.length ? raw.sources : (n.sources || []).map((s, i) => ({ id: i ? "entry" + i : "entry", title: s.name, url: s.url }));
      const sourceIds = new Set(sources.map(s => s.id));
      const normalized = {};
      for (const key of Object.keys(fields)) {
        const value = raw.fields?.[key];
        normalized[key] = value?.value && states[value.status] ? { ...value, sources: (value.sources || []).filter(id => sourceIds.has(id)) } : unknown(key);
      }
      return { ...raw, fields: normalized, sources,
        brief: raw.brief || n.brief || (n.summary || n.title || "").split(/(?<=[。！？])/)[0],
        shortTitle: raw.shortTitle || n.title,
        basis: raw.basis || (raw.reviewedAt ? "本次查阅的来源见各项链接；披露日期与核验日期分别记录。" : "依据已有报道整理；未补充的字段保持待核实。")
      };
    }
    function related(n, inline) {
      const current = insight(n, inline);
      const manual = (current.related || []).filter(r => r.id !== n.id && byId.has(r.id)).slice(0, 3);
      if (manual.length) return manual.map(r => ({ ...r, news: get(r.id), reviewed: true }));
      const weights = { process: 2, equipment: 5, mechanism: 4, consequence: 2, human: 2 };
      return news.filter(other => other.id !== n.id && (other.category === "incident" || other.causes?.length)).map(other => {
        const otherInsight = insight(other);
        const shared = Object.keys(facets).filter(k => (current.facets?.[k] || []).some(t => otherInsight.facets?.[k]?.includes(t)));
        let score = shared.reduce((s, k) => s + weights[k], 0);
        const labels = shared.map(k => facets[k]);
        if (!shared.length) {
          const categories = (n.causes || []).filter(a => other.causes?.some(b => a.peril === b.peril && a.cause === b.cause));
          if (categories.length) { score = 2; labels.push("既有风险分类相近"); }
        }
        return { id: other.id, news: other, facets: shared, score, reviewed: false, reason: labels.join("、"), difference: "自动按已记录的条件或分类匹配，具体失效和根因仍须逐案比较。" };
      }).filter(r => r.score >= 2).sort((a, b) => b.score - a.score || a.id.localeCompare(b.id)).slice(0, 3);
    }
    return { insight, related, get, news, isLoss: n => n.category === "incident" || n.category === "investigation" || !!n.causes?.length || !!records[n.id] };
  }
  return { create, fields, states, facets };
});
