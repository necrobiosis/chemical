// 只信任官方免费回放目录内的条目，并确认详情页有公开播放器。
export const CATALOG = "https://www.icheme.org/knowledge-networks/knowledge-resources/safety-centre/webinars/";
export const decode = (s) => String(s).replace(/<[^>]*>/g, " ")
  .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
  .replace(/&#(\d+);/g, (_, n) => +n <= 0x10ffff ? String.fromCodePoint(+n) : "")
  .replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

export function catalogEntries(html) {
  if (!/recordings[^<]{0,160}free of charge/i.test(html)) throw new Error("目录不再明确说明回放免费，停止自动收录");
  const entries = new Map();
  for (const m of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const title = decode((m[2].match(/<p\b[^>]*class=["'][^"']*thumbnail-list-panel__title[^"']*["'][^>]*>([\s\S]*?)<\/p>/i) || [])[1] || "");
    let url;
    try { url = new URL(m[1], CATALOG); } catch { continue; }
    if (!title || url.origin !== new URL(CATALOG).origin || !url.href.startsWith(CATALOG) || url.href === CATALOG) continue;
    if (!/safety|risk|hazard|battery|change|longford|danger/i.test(title)) continue;
    entries.set(url.href, { title, url: url.href });
  }
  if (!entries.size) throw new Error("未能识别官方回放目录，保留已有内容");
  return [...entries.values()];
}

export function publicRecording(html) {
  // 只检查正文，避免把导航中的会员广告误认为视频有会员限制。
  const body = html.slice(html.search(/<h1\b/i)).split(/Return to list/i)[0];
  if (/member.exclusive content|only available to[^<]{0,50}members|become[^<]{0,40}member to[^<]{0,80}access/i.test(decode(body))) return false;
  return /<(?:iframe|a)\b[^>]*(?:src|href)=["']https:\/\/(?:player\.vimeo\.com\/video\/|www\.youtube(?:-nocookie)?\.com\/(?:embed\/|watch\?))/i.test(body);
}
