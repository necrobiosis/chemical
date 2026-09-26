// 信息源配置：网页“信息源”页面与抓取脚本 scripts/fetch-feeds.mjs 共用。
// 本行以下必须是严格 JSON（脚本会直接解析 window.SOURCES 赋值内容）。
//
// type: site    知名网站（通过 Google News RSS 的 site: 检索抓取，无需对方提供 RSS）
//       query   关键词检索（Google News RSS）
//       rss     直接 RSS/Atom 地址
//       wechat  微信公众号：需填写 rss 地址（自建 WeWe RSS / RSSHub 等），留空则仅在页面展示、不抓取
//       x       X(推特) 博主：需在 GitHub Secrets 配置 RSSHUB_BASE（带 X 认证的 RSSHub 实例），否则仅展示
// tier:  A 官方/权威  B 专业媒体/数据商  C 博主/社区
// region: cn | asia | intl | auto（按标题中的国家/地区关键词自动归类）
// rss 字段支持 ${ENV_NAME} 占位符，从环境变量（GitHub Secrets）读取，避免公开私有服务地址。
window.SOURCES = {
  "schedule": "每 4 小时（北京时间 00/04/08/12/16/20 点）",
  "maxPerRegion": 80,
  "maxAgeDays": 30,
  "major": {
    "threshold": 3,
    "tierWeight": { "A": 2, "B": 1, "C": 0 },
    "strong": ["死亡", "遇难", "身亡", "死亡人数", "爆炸", "爆燃", "闪爆", "中毒", "重大事故", "较大事故", "不可抗力", "调查报告", "killed", "dead", "deaths", "fatal", "fatality", "explosion", "blast", "exploded", "force majeure", "toxic release"],
    "medium": ["火灾", "起火", "泄漏", "疏散", "停产", "关停", "退出", "事故", "通报", "fire", "leak", "evacuat", "shutdown", "shut down", "closure", "close", "investigation", "CSB", "outage", "restructur"]
  },
  "sources": [
    { "id": "mem", "type": "site", "tier": "A", "region": "cn", "lang": "zh", "name": "应急管理部", "site": "mem.gov.cn", "query": "危险化学品 OR 化工 OR 事故", "home": "https://www.mem.gov.cn/", "focus": "事故通报、监管政策、调查报告" },
    { "id": "miit", "type": "site", "tier": "A", "region": "cn", "lang": "zh", "name": "工业和信息化部", "site": "miit.gov.cn", "query": "石化 OR 化工", "home": "https://www.miit.gov.cn/", "focus": "产业政策、老旧装置、产能调控" },
    { "id": "chemsafety-cn", "type": "site", "tier": "A", "region": "cn", "lang": "zh", "name": "中国化学品安全协会", "site": "chemicalsafety.org.cn", "home": "https://www.chemicalsafety.org.cn/", "focus": "过程安全、事故案例、标准" },
    { "id": "cpcif", "type": "site", "tier": "A", "region": "cn", "lang": "zh", "name": "中国石油和化学工业联合会", "site": "cpcif.org.cn", "home": "http://www.cpcif.org.cn/", "focus": "行业运行、经济数据、行业政策" },
    { "id": "ccin", "type": "site", "tier": "B", "region": "cn", "lang": "zh", "name": "中国化工报", "site": "ccin.com.cn", "home": "http://www.ccin.com.cn/", "focus": "行业新闻、项目、安全" },
    { "id": "chemnet", "type": "site", "tier": "B", "region": "cn", "lang": "zh", "name": "ChemNet 化工头条", "site": "chemnet.com", "home": "https://news.chemnet.com/", "focus": "事故盘点、企业动态" },
    { "id": "oilchem", "type": "site", "tier": "B", "region": "cn", "lang": "zh", "name": "隆众资讯", "site": "oilchem.net", "query": "装置 OR 停车 OR 投产", "home": "https://www.oilchem.net/", "focus": "装置开停车、价格、产能" },
    { "id": "sci99", "type": "site", "tier": "B", "region": "cn", "lang": "zh", "name": "卓创资讯", "site": "sci99.com", "query": "装置 OR 停车 OR 投产", "home": "https://www.sci99.com/", "focus": "装置动态、价格" },
    { "id": "safehoo", "type": "site", "tier": "B", "region": "cn", "lang": "zh", "name": "安全管理网", "site": "safehoo.com", "query": "化工", "home": "http://www.safehoo.com/", "focus": "事故案例、安全技术" },

    { "id": "csb", "type": "site", "tier": "A", "region": "intl", "lang": "en", "name": "U.S. Chemical Safety Board", "site": "csb.gov", "home": "https://www.csb.gov/", "focus": "事故调查、最终报告、安全视频" },
    { "id": "osha", "type": "site", "tier": "A", "region": "intl", "lang": "en", "name": "OSHA", "site": "osha.gov", "query": "chemical OR explosion", "home": "https://www.osha.gov/", "focus": "处罚与 PSM 执法" },
    { "id": "icis", "type": "site", "tier": "B", "region": "auto", "lang": "en", "name": "ICIS", "site": "icis.com", "home": "https://www.icis.com/", "focus": "石化市场、装置动态、不可抗力" },
    { "id": "cen", "type": "site", "tier": "B", "region": "auto", "lang": "en", "name": "C&EN", "site": "cen.acs.org", "home": "https://cen.acs.org/", "focus": "行业深度、安全、产能" },
    { "id": "chemweek", "type": "site", "tier": "B", "region": "auto", "lang": "en", "name": "Chemical Week", "site": "chemweek.com", "home": "https://www.chemweek.com/", "focus": "化工商业新闻" },
    { "id": "hp", "type": "site", "tier": "B", "region": "auto", "lang": "en", "name": "Hydrocarbon Processing", "site": "hydrocarbonprocessing.com", "home": "https://www.hydrocarbonprocessing.com/", "focus": "炼化项目、装置事故" },
    { "id": "chemworld", "type": "site", "tier": "B", "region": "auto", "lang": "en", "name": "Chemistry World", "site": "chemistryworld.com", "query": "plant OR explosion OR industry", "home": "https://www.chemistryworld.com/", "focus": "全球事故与产业" },
    { "id": "spglobal", "type": "site", "tier": "B", "region": "auto", "lang": "en", "name": "S&P Global Commodity Insights", "site": "spglobal.com", "query": "petrochemical OR cracker OR chemicals", "home": "https://www.spglobal.com/commodity-insights/", "focus": "原料、裂解装置、价格" },
    { "id": "argus", "type": "site", "tier": "B", "region": "auto", "lang": "en", "name": "Argus Media", "site": "argusmedia.com", "query": "petrochemical OR chemical", "home": "https://www.argusmedia.com/", "focus": "原料与化工品市场" },
    { "id": "reuters", "type": "site", "tier": "B", "region": "auto", "lang": "en", "name": "Reuters", "site": "reuters.com", "query": "petrochemical OR \"chemical plant\" OR refinery", "home": "https://www.reuters.com/business/energy/", "focus": "重大突发、企业与产能" },
    { "id": "nikkei", "type": "site", "tier": "B", "region": "asia", "lang": "en", "name": "Nikkei Asia", "site": "asia.nikkei.com", "query": "chemical OR petrochemical", "home": "https://asia.nikkei.com/", "focus": "日本及亚洲产业整合" },
    { "id": "koreaherald", "type": "site", "tier": "B", "region": "asia", "lang": "en", "name": "The Korea Herald", "site": "koreaherald.com", "query": "petrochemical OR chemical OR fire", "home": "https://www.koreaherald.com/", "focus": "韩国石化重组与事故" },
    { "id": "et", "type": "site", "tier": "B", "region": "asia", "lang": "en", "name": "The Economic Times (India)", "site": "economictimes.indiatimes.com", "query": "chemical OR pharma blast OR reactor", "home": "https://economictimes.indiatimes.com/", "focus": "印度化工与制药" },
    { "id": "hazardex", "type": "site", "tier": "B", "region": "auto", "lang": "en", "name": "HazardEx", "site": "hazardexonthenet.net", "home": "https://www.hazardexonthenet.net/", "focus": "危险场所事故与技术" },
    { "id": "pbs-incidents", "type": "site", "tier": "B", "region": "auto", "lang": "en", "name": "Powder & Bulk Solids", "site": "powderbulksolids.com", "query": "explosion OR fire", "home": "https://www.powderbulksolids.com/", "focus": "粉尘爆炸与工业火灾" },

    { "id": "q-cn-incident", "type": "query", "tier": "C", "region": "cn", "lang": "zh", "name": "关键词：国内化工事故", "query": "化工 (爆炸 OR 爆燃 OR 火灾 OR 泄漏)" },
    { "id": "q-asia-incident", "type": "query", "tier": "C", "region": "asia", "lang": "en", "name": "关键词：亚洲化工事故", "query": "(chemical OR petrochemical OR refinery OR pharma) (explosion OR fire OR blast OR leak) (India OR Korea OR Japan OR Taiwan OR Singapore OR Thailand OR Indonesia OR Malaysia OR Vietnam)" },
    { "id": "q-intl-incident", "type": "query", "tier": "C", "region": "intl", "lang": "en", "name": "关键词：国际化工事故", "query": "(\"chemical plant\" OR refinery OR petrochemical) (explosion OR fire OR release) -India -China" },

    { "id": "wx-mem", "type": "wechat", "tier": "A", "region": "cn", "name": "应急管理部", "rss": "", "focus": "官方事故通报与政策" },
    { "id": "wx-yjglb", "type": "wechat", "tier": "A", "region": "cn", "name": "中国应急管理报", "rss": "", "focus": "安全生产新闻、事故解读" },
    { "id": "wx-chemsafety", "type": "wechat", "tier": "A", "region": "cn", "name": "中国化学品安全协会", "rss": "", "focus": "事故案例、过程安全" },
    { "id": "wx-nrcc", "type": "wechat", "tier": "A", "region": "cn", "name": "应急管理部化学品登记中心", "rss": "", "focus": "化学品登记、危险性信息" },
    { "id": "wx-cpcif", "type": "wechat", "tier": "A", "region": "cn", "name": "中国石油和化学工业联合会", "rss": "", "focus": "行业运行与政策" },
    { "id": "wx-ccin", "type": "wechat", "tier": "B", "region": "cn", "name": "中国化工报", "rss": "", "focus": "行业要闻" },
    { "id": "wx-sinopec", "type": "wechat", "tier": "B", "region": "cn", "name": "中国石化", "rss": "", "focus": "中石化项目与动态" },
    { "id": "wx-cnpc", "type": "wechat", "tier": "B", "region": "cn", "name": "中国石油报", "rss": "", "focus": "中石油项目与动态" },
    { "id": "wx-oilchem", "type": "wechat", "tier": "B", "region": "cn", "name": "隆众资讯", "rss": "", "focus": "装置开停车、价格" },
    { "id": "wx-sci99", "type": "wechat", "tier": "B", "region": "cn", "name": "卓创资讯", "rss": "", "focus": "装置与市场" },
    { "id": "wx-jlc", "type": "wechat", "tier": "B", "region": "cn", "name": "金联创", "rss": "", "focus": "能源化工市场" },
    { "id": "wx-icis", "type": "wechat", "tier": "B", "region": "cn", "name": "ICIS安迅思", "rss": "", "focus": "全球石化市场中文资讯" },
    { "id": "wx-hg707", "type": "wechat", "tier": "C", "region": "cn", "name": "化工707", "rss": "", "focus": "化工技术社区、事故讨论" },
    { "id": "wx-hxj", "type": "wechat", "tier": "C", "region": "cn", "name": "化学加", "rss": "", "focus": "精细化工、医药中间体产业" },
    { "id": "wx-safehoo", "type": "wechat", "tier": "C", "region": "cn", "name": "安全管理网", "rss": "", "focus": "安全案例与技术" },

    { "id": "x-csb", "type": "x", "tier": "A", "region": "intl", "name": "U.S. CSB", "handle": "chemsafetyboard", "rss": "${RSSHUB_BASE}/twitter/user/chemsafetyboard", "focus": "调查进展、安全视频" },
    { "id": "x-osha", "type": "x", "tier": "A", "region": "intl", "name": "OSHA", "handle": "OSHA_DOL", "rss": "${RSSHUB_BASE}/twitter/user/OSHA_DOL", "focus": "执法与警示" },
    { "id": "x-iea", "type": "x", "tier": "A", "region": "intl", "name": "IEA", "handle": "IEA", "rss": "${RSSHUB_BASE}/twitter/user/IEA", "focus": "能源与原料供应" },
    { "id": "x-cen", "type": "x", "tier": "B", "region": "auto", "name": "C&EN", "handle": "cenmag", "rss": "${RSSHUB_BASE}/twitter/user/cenmag", "focus": "化工行业新闻" },
    { "id": "x-chemworld", "type": "x", "tier": "B", "region": "auto", "name": "Chemistry World", "handle": "ChemistryWorld", "rss": "${RSSHUB_BASE}/twitter/user/ChemistryWorld", "focus": "化学与产业新闻" },
    { "id": "x-icis", "type": "x", "tier": "B", "region": "auto", "name": "ICIS", "handle": "ICIS", "rss": "${RSSHUB_BASE}/twitter/user/ICIS", "focus": "石化市场快讯" },
    { "id": "x-argus", "type": "x", "tier": "B", "region": "auto", "name": "Argus Media", "handle": "ArgusMedia", "rss": "${RSSHUB_BASE}/twitter/user/ArgusMedia", "focus": "原料与市场" },
    { "id": "x-nikkei", "type": "x", "tier": "B", "region": "asia", "name": "Nikkei Asia", "handle": "NikkeiAsia", "rss": "${RSSHUB_BASE}/twitter/user/NikkeiAsia", "focus": "亚洲产业" },
    { "id": "x-kpler", "type": "x", "tier": "B", "region": "auto", "name": "Kpler", "handle": "Kpler", "rss": "${RSSHUB_BASE}/twitter/user/Kpler", "focus": "航运与原料流向" },
    { "id": "x-aiche", "type": "x", "tier": "B", "region": "intl", "name": "AIChE / CCPS", "handle": "AIChE", "rss": "${RSSHUB_BASE}/twitter/user/AIChE", "focus": "过程安全与工程" },
    { "id": "x-icheme", "type": "x", "tier": "B", "region": "intl", "name": "IChemE", "handle": "IChemE", "rss": "${RSSHUB_BASE}/twitter/user/IChemE", "focus": "过程安全与工程" },
    { "id": "x-blas", "type": "x", "tier": "C", "region": "intl", "name": "Javier Blas（彭博能源专栏）", "handle": "JavierBlas", "rss": "${RSSHUB_BASE}/twitter/user/JavierBlas", "focus": "能源与大宗商品评论" },
    { "id": "x-kemp", "type": "x", "tier": "C", "region": "intl", "name": "John Kemp（能源市场分析）", "handle": "JKempEnergy", "rss": "${RSSHUB_BASE}/twitter/user/JKempEnergy", "focus": "油气与原料市场分析" }
  ]
};
