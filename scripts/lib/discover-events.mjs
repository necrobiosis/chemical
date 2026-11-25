import { decode } from "./free-events.mjs";
export const DIRECTORY = "https://www.icheme.org/training-events/whats-on-events-directory/";
export function directoryUrl(page = 1) {
  const url = new URL("https://www.icheme.org/umbraco/api/eventsapi/SearchGlobalEventsDirectory");
  url.search = new URLSearchParams({ onlyPastEvents: "false", searchText: "", access: "Open to all", types: "", locations: "Virtual", dateFrom: "", dateTo: "", take: "100", page: String(page) });
  return url.href;
}
export function candidateEvents(payload, now = Date.now()) {
  if (!Array.isArray(payload.Events)) throw new Error("官方目录结构发生变化");
  if (!payload.AccessFacets?.some(f => f.Value === "Open to all" && f.IsSelected)) throw new Error("目录未确认面向所有人，停止自动收录");
  return payload.Events.filter(e => {
    const date = Date.parse(e.DateFrom + "Z");
    return date + 86400000 > now && date < now + 120 * 86400000 && /process|chemical|safety|hazard|risk|hydrogen|battery|integrity|fire|explosion|control|corrosion|equipment|anomaly/i.test(e.Title || "");
  }).flatMap(e => {
    const url = new URL(e.Url, DIRECTORY);
    return url.origin === "https://www.icheme.org" && /\/events\/|\/whats-on-events-directory\//.test(url.pathname) ? [{ ...e, url: url.href }] : [];
  });
}
export function verifyLiveEvent(html, candidate, now = Date.now()) {
  const fields = {};
  for (const m of html.matchAll(/<span[^>]*class=["']event-overview__label["'][^>]*>([^<]+)<\/span>\s*<span[^>]*class=["']event-overview__val["'][^>]*>([\s\S]*?)<\/span>/gi)) fields[decode(m[1])] = decode(m[2]);
  if (!/^free(?:\b|\s)/i.test(fields.Price || "")) return { reason: "费用并非明确免费" };
  const content = html.slice(html.indexOf('class="event-overview"')).split(/Back to events/i)[0];
  if (/member.exclusive content|only (?:open|available) to.*members/i.test(decode(content))) return { reason: "存在会员限制，需人工复核" };
  if (!/^Online:/i.test(fields.Location || "")) return { reason: "不是明确的线上活动" };
  const date = (fields["Date From"] || "").replace(/(\d+)(?:st|nd|rd|th)/g, "$1");
  const time = fields.Location.match(/^Online:\s*(\d{1,2}):(\d{2})/i);
  const zone = fields.Location.match(/\b(GMT|UTC|BST)\b/i);
  const hours = fields.Location.match(/Duration:\s*([\d.]+)\s*hours?/i);
  const minutes = fields.Location.match(/Duration:\s*([\d.]+)\s*minutes?/i);
  const duration = hours ? +hours[1] * 3600000 : minutes ? +minutes[1] * 60000 : 0;
  if (!time || !zone || !duration || duration > 86400000) return { reason: "明确时间或时区不足" };
  const start = Date.parse(date + " " + time[1] + ":" + time[2] + " UTC") - (zone[1].toUpperCase() === "BST" ? 3600000 : 0);
  if (!Number.isFinite(start) || start + duration <= now) return { reason: "活动已结束或日期无效" };
  const register = [...content.matchAll(/<a\b[^>]*href=["'](https:[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)].find(m => /register|book (?:now|a place)|registration/i.test(decode(m[2])));
  if (!register) return { reason: "未找到官方报名入口" };
  return { event: {
    id: "live-" + new URL(candidate.url).pathname.split("/").filter(Boolean).pop(),
    title: decode(candidate.Title).replace(/^Webinar:\s*/i, ""),
    organizer: "IChemE · " + (candidate.GroupName || "线上活动"),
    summary: "官方面向所有人的免费线上讲座。可从活动详情页进入报名；不承诺提供免费回放。",
    topics: ["行业讲座"], kind: "live", start: new Date(start).toISOString(), end: new Date(start + duration).toISOString(),
    language: "页面为英文；授课语言以主办方说明为准",
    access: "官方目录标注 Open to all，活动页明确免费；需免费报名",
    url: candidate.url, sourceUrl: candidate.url, feeSourceUrl: DIRECTORY,
    registrationUrl: register[1].replace(/&amp;/g, "&"), checkedAt: new Date(now).toISOString().slice(0, 10)
  } };
}
