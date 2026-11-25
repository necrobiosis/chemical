(async function () {
  "use strict";
  const cacheKey = "chemical-daily-v1";
  const branch = "claude/chemical-industry-news-hub-wpb91d";
  let cached;
  const valid = (s) => s?.version === 1 && Array.isArray(s.data?.CURATED_NEWS) && Array.isArray(s.data?.FREE_EVENTS)
    && s.data?.AUTO_FEEDS?.items && Array.isArray(s.data?.AUTO_EVENTS?.items) && s.data?.FM_NOTES && s.data?.SOURCES
    && Array.isArray(s.data?.PERILS) && s.data?.TRAINING && s.data?.NEWS_IMAGES;
  const apply = (snapshot, sha) => {
    // 只复制网站已知的数据字段，不执行远端 JavaScript。
    for (const key of ["CURATED_NEWS", "NEWS_IMAGES", "PERILS", "SOURCES", "AUTO_FEEDS", "TRAINING", "FM_NOTES", "FREE_EVENTS", "AUTO_EVENTS"]) window[key] = snapshot.data[key];
    if (/^[0-9a-f]{40}$/.test(sha || "")) window.DAILY_ASSET_BASE = "https://raw.githubusercontent.com/necrobiosis/chemical/" + sha + "/";
  };
  async function json(url, timeout) {
    const r = await fetch(url, { signal: AbortSignal.timeout(timeout) });
    if (!r.ok) throw new Error("HTTP " + r.status);
    return r.json();
  }
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
    const script = document.createElement("script");
    script.src = (window.SITE_BASE || "") + "assets/app.js";
    script.onerror = () => { document.getElementById("app").textContent = "页面加载未完成，请刷新重试。"; };
    document.body.appendChild(script);
  }
})();
