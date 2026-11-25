(async function () {
  "use strict";
  const cacheKey = "chemical-daily-v2";
  const branch = "claude/chemical-industry-news-hub-wpb91d";
  let cached;
  const valid = (s) => s?.version === 1 && Array.isArray(s.data?.CURATED_NEWS) && Array.isArray(s.data?.FREE_EVENTS)
    && s.data?.AUTO_FEEDS?.items && Array.isArray(s.data?.AUTO_EVENTS?.items) && s.data?.FM_NOTES && s.data?.SOURCES
    && Array.isArray(s.data?.PERILS) && s.data?.TRAINING && s.data?.NEWS_IMAGES;
  const apply = (snapshot, sha) => {
    // 只复制网站已知的数据字段，不执行远端 JavaScript。
    for (const key of ["CURATED_NEWS", "NEWS_IMAGES", "PERILS", "SOURCES", "AUTO_FEEDS", "TRAINING", "FM_NOTES", "FREE_EVENTS", "AUTO_EVENTS", "DISCOVERED_EVENTS", "AUTOMATION_RUN", "AUTOMATION_HISTORY"]) if (snapshot.data[key] !== undefined) window[key] = snapshot.data[key];
    if (/^[0-9a-f]{40}$/.test(sha || "")) window.DAILY_ASSET_BASE = "https://raw.githubusercontent.com/necrobiosis/chemical/" + sha + "/";
  };
  async function json(url, timeout) {
    const r = await fetch(url, { signal: AbortSignal.timeout(timeout) });
    if (!r.ok) throw new Error("HTTP " + r.status);
    return r.json();
  }
  const trial = (async () => {
    let saved;
    try {
      saved = JSON.parse(sessionStorage.getItem("chemical-trial-b-v1"));
      if (saved?.run?.pipeline?.id === "B") { window.AUTOMATION_B = saved.run; window.AUTOMATION_B_HISTORY = saved.history || []; }
      if (saved && Date.now() - saved.at < 10 * 60 * 1000) return;
      const heads = await json("https://api.github.com/repos/necrobiosis/chemical-automations/commits?sha=main&per_page=1", 3500);
      const sha = heads[0]?.sha;
      if (!/^[0-9a-f]{40}$/.test(sha || "")) throw new Error("Invalid trial revision");
      const base = "https://raw.githubusercontent.com/necrobiosis/chemical-automations/" + sha + "/data/";
      const [run, history] = await Promise.all([json(base + "trial-results.json", 4000), json(base + "trial-history.json", 4000)]);
      if (run.version !== 1 || run.pipeline?.id !== "B" || !Array.isArray(history)) throw new Error("Invalid trial result");
      window.AUTOMATION_B = run; window.AUTOMATION_B_HISTORY = history;
      try { sessionStorage.setItem("chemical-trial-b-v1", JSON.stringify({ at: Date.now(), run, history })); } catch (_) {}
    } catch (_) { window.AUTOMATION_B_READ_ERROR = true; }
  })();
  const workflows = Promise.all([ ["A", "chemical", "update-feeds.yml"], ["B", "chemical-automations", "run-automations.yml"] ].map(async ([id, repo, file]) => {
    window.AUTOMATION_WORKFLOWS ||= {};
    try {
      const r = await json(`https://api.github.com/repos/necrobiosis/${repo}/actions/workflows/${file}/runs?per_page=1`, 3500);
      window.AUTOMATION_WORKFLOWS[id] = r.workflow_runs?.[0] || null;
    } catch (_) {}
  }));
  try {
    try { cached = JSON.parse(sessionStorage.getItem(cacheKey)); } catch (_) {}
    if (valid(cached?.snapshot)) apply(cached.snapshot, cached.sha);
    if (!cached || Date.now() - cached.at >= 10 * 60 * 1000 || !valid(cached.snapshot)) {
      const commits = await json("https://api.github.com/repos/necrobiosis/chemical/commits?sha=" + encodeURIComponent(branch) + "&per_page=1", 3500);
      const sha = commits[0]?.sha;
      if (!/^[0-9a-f]{40}$/.test(sha || "")) throw new Error("Invalid revision");
      const snapshot = await json("https://raw.githubusercontent.com/necrobiosis/chemical/" + sha + "/data/daily.json", 6000);
      if (!valid(snapshot)) throw new Error("Invalid daily data");
      apply(snapshot, sha);
      try { sessionStorage.setItem(cacheKey, JSON.stringify({ at: Date.now(), sha, snapshot })); } catch (_) {}
    }
  } catch (_) {
    window.DAILY_DATA_FALLBACK = true;
  } finally {
    await Promise.allSettled([trial, workflows]);
    const script = document.createElement("script");
    script.src = (window.SITE_BASE || "") + "assets/app.js";
    script.onerror = () => { document.getElementById("app").textContent = "页面加载未完成，请刷新重试。"; };
    document.body.appendChild(script);
  }
})();
