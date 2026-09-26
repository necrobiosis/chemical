/*
 * 精选新闻（人工整理）
 * ------------------------------------------------------------
 * 每条新闻字段说明：
 *   id        唯一标识（英文、短横线）
 *   region    板块：cn = 国内 | asia = 亚洲 | intl = 国际
 *   country   国家/地区（中文）
 *   date      日期 YYYY-MM-DD 或 YYYY-MM（仅知道月份时）
 *   category  incident 事故 | market 市场 | capacity 产能 | policy 政策法规 | investigation 调查报告
 *   title     标题
 *   summary   事实摘要（只写已公开报道的事实）
 *   fm        FM 风险视角：从财产损失预防角度的解读与学习要点
 *   refs      可参考的 FM Data Sheet 编号（以 FM 官方最新版为准）
 *   discuss   培训讨论题（可选）
 *   tags      标签
 *   sources   [{ name, url }] 原始报道链接
 *
 * 新增新闻：复制一条记录，修改字段即可；页面按日期自动排序。
 */
window.CURATED_NEWS = [
  /* ============================ 国内 ============================ */
  {
    id: "cn-shanghai-waste-gas-tank-2026-09",
    region: "cn",
    country: "中国·上海",
    date: "2026-09-23",
    category: "incident",
    title: "上海化学工业区一企业废气罐泄压时罐体受损，少量残余气体泄漏",
    summary:
      "9月23日7时许，上海化学工业区楚华路一企业废气罐在泄压过程中发生罐体受损，部分残余气体泄漏。现场无明火、无人员伤亡，经相关部门处置和检测，未对周边环境造成影响。另有网民编造“化工区大爆炸”不实信息，被警方依法行政处罚。",
    fm:
      "低压储罐/废气罐是化工园区常被低估的薄弱环节：设计压力低（常为几 kPa 级），泄压或抽吸操作失误极易导致超压或抽瘪。巡检时关注：呼吸阀/紧急泄放能力是否与最大进出流量及火灾工况匹配、氮封系统失效模式、泄压操作是否有书面程序与联锁。另一启示：事故后的舆情与信息核实同样是业务连续性管理的一部分。",
    refs: ["7-49", "7-59", "7-88"],
    discuss: "若该罐为共用废气收集系统的一部分，上下游哪些装置可能被迫停车？如何估算营业中断影响？",
    tags: ["储罐", "泄压", "化工园区", "舆情"],
    sources: [
      { name: "光明网（2026-09-24）", url: "https://m.gmw.cn/2026-09/24/content_1304567619.htm" },
    ],
  },
  {
    id: "cn-gansu-jinte-hydrogenation-2026-04",
    region: "cn",
    country: "中国·甘肃",
    date: "2026-04-06",
    category: "incident",
    title: "甘肃玉门金特化工加氢车间闪爆，3死2伤",
    summary:
      "4月6日，甘肃玉门金特化工有限公司加氢车间发生闪爆事故，造成3人死亡、2人轻伤。据通报，直接原因为加氢反应釜超压导致氢气泄漏，与有机溶剂蒸气混合后遇点火源发生闪爆。",
    fm:
      "加氢属于国家重点监管的18种危险化工工艺之一。氢气点火能极低、爆炸极限宽（约4%–75%），釜式加氢车间通常为封闭厂房，泄漏后易形成受限空间爆炸。评估要点：反应釜超压保护（安全阀/爆破片）排放是否引至安全位置；压力、温度、氢气流量与紧急切断的SIS联锁；厂房泄爆面积与可燃气体探测布置；电气防爆等级。",
    refs: ["7-43", "7-45", "7-46", "7-91", "7-17"],
    discuss: "该车间若为单层钢结构厂房，泄爆设计缺失时建筑与相邻设备的损失会如何放大？",
    tags: ["加氢", "氢气", "闪爆", "重点监管工艺"],
    sources: [
      { name: "ChemNet化工头条：2026年前五月化工事故盘点", url: "https://news.chemnet.com/toutiao/detail-67853.html" },
    ],
  },
  {
    id: "cn-inner-mongolia-nitration-2026-03",
    region: "cn",
    country: "中国·内蒙古",
    date: "2026-03-19",
    category: "incident",
    title: "内蒙古立远科技硝化车间爆炸，2死3伤，现场冒黄色浓烟",
    summary:
      "3月19日，内蒙古立远科技有限公司硝化车间发生爆炸，造成2人死亡、3人受伤。据披露，原因与物料长期在釜壁、釜盖及尾气管道中积聚、发生自燃进而引发爆炸有关。现场黄色浓烟被分析为氮氧化物。",
    fm:
      "硝化反应强放热、产物多为热敏性含能物质，是精细化工中损失最严重的工艺类别之一。本案关键在“积料”——尾气管线和釜盖沉积的硝化物在清理不到位时成为隐蔽的点火/爆炸源。巡检关注：清洗与积料检查制度、尾气系统材质与冲洗设计、反应量热数据（ΔTad、TMRad）是否完整、冷却失效与搅拌失效的联锁与紧急泄放/骤冷设施。",
    refs: ["7-43", "7-46", "7-45", "7-49"],
    discuss: "如何用“最坏可信情景”估算一个硝化车间的最大可预见损失？需要哪些数据？",
    tags: ["硝化", "反应失控", "积料自燃", "重点监管工艺"],
    sources: [
      { name: "中国新闻周刊网", url: "http://www.inewsweek.cn/society/2026-03-20/29416.shtml" },
      { name: "ChemNet化工头条", url: "https://news.chemnet.com/toutiao/detail-67853.html" },
    ],
  },
  {
    id: "cn-shanxi-eo-2026-02",
    region: "cn",
    country: "中国·山西",
    date: "2026-02-07",
    category: "incident",
    title: "山西朔州嘉鹏生物环氧乙烷进料过快致累积，爆破片破裂后静电引爆",
    summary:
      "2月7日，山西朔州嘉鹏生物科技有限公司发生爆炸。通报的直接原因：操作人员不清楚原料理化性质，反应釜未设流量计控制进料速度，环氧乙烷进料过快、在釜内大量累积未反应，压力骤升致爆破片破裂，泄放物因静电引发爆炸。",
    fm:
      "典型的“进料累积型”反应失控：半间歇反应应以反应速率而非进料速率为控制目标。损失预防关注点：环氧乙烷等活泼单体的进料流量计与温度/压力联锁切断；爆破片泄放的去向（是否直排厂房或大气、是否有收集/骤冷罐）；泄放管线接地与静电控制；操作人员对物料危险性的培训记录。",
    refs: ["7-46", "7-49", "7-45", "7-43"],
    discuss: "“泄压装置动作”本身为什么可能成为二次事故的起点？泄放系统设计要考虑哪些下游后果？",
    tags: ["环氧乙烷", "反应累积", "爆破片", "静电"],
    sources: [
      { name: "ChemNet化工头条", url: "https://news.chemnet.com/toutiao/detail-67853.html" },
    ],
  },
  {
    id: "cn-mem-hazchem-conference-2026-02",
    region: "cn",
    country: "中国",
    date: "2026-02-27",
    category: "policy",
    title: "应急管理部召开2026年全国危险化学品安全监管工作会议：治本攻坚三年行动收官年",
    summary:
      "2月27日，应急管理部在京召开2026年全国危险化学品安全监管工作视频会议。会议指出，2026年是“十五五”开局之年，也是安全生产治本攻坚三年行动（2024–2026）收官之年，要求深化重大事故隐患排查整治。",
    fm:
      "监管重心直接影响客户的资本开支与整改节奏。2026年重点：重大危险源企业、18类重点监管工艺的自动化与SIS改造、特殊作业（动火、受限空间）管理、老旧装置评估。与客户沟通时，可将 FM 建议与国内合规整改项结合，提高建议落地率。",
    refs: ["7-43", "7-45"],
    tags: ["应急管理部", "治本攻坚", "十五五", "监管"],
    sources: [
      { name: "应急管理部", url: "https://www.mem.gov.cn/xw/bndt/202602/t20260227_595528.shtml" },
      { name: "化工和危险化学品安全生产治本攻坚三年行动方案（2024–2026）", url: "https://www.mem.gov.cn/hd/gzly/lyhf/202407/t20240710_494245.shtml" },
    ],
  },
  {
    id: "cn-old-units-phaseout-2026-04",
    region: "cn",
    country: "中国",
    date: "2026-04",
    category: "capacity",
    title: "“反内卷”延伸至石化：七部门发文，老旧石化装置2029年前分类改造或淘汰",
    summary:
      "工信部等七部门发布文件，依据地方政府此前编制的老旧装置清单，对老旧石化装置按装置年限、规模等分类，2029年前完成改造升级或淘汰。中国石油宣布永久关停19套老旧低效炼化装置；市场分析认为约6000万吨/年炼油能力可能退出。",
    fm:
      "对承保组合的影响是双向的：①淘汰装置在停用、封存、拆除阶段存在特有风险（残留物料、动火拆除、无人值守火灾）；②改造升级项目带来大量变更管理（MOC）与开车前安全审查（PSSR）需求，开车阶段历来是事故高发期。建议对组合中老旧装置建立清单，跟踪其“改造/淘汰/保留”状态。",
    refs: ["7-43"],
    discuss: "一套计划两年后淘汰的装置，业主减少维护投入。作为工程师，如何评估并与客户沟通该风险？",
    tags: ["反内卷", "老旧装置", "产能退出", "MOC"],
    sources: [
      { name: "Hydrocarbon Processing", url: "https://www.hydrocarbonprocessing.com/news/2026/04/china-plans-to-upgrade-some-petrochemical-plants-phase-out-others-by-2029/" },
      { name: "OilPrice：PetroChina to Retire 19 Units", url: "https://oilprice.com/Latest-Energy-News/World-News/PetroChina-to-Retire-19-Inefficient-Refining-and-Chemical-Units.html" },
      { name: "Mysteel", url: "https://www.mysteel.net/analysis/5094144-china-renews-anti-involution-push-60-mtpa-refining-capacity-may-exit" },
    ],
  },
  {
    id: "cn-cspc-huizhou-cracker-2026-03",
    region: "cn",
    country: "中国·广东",
    date: "2026-03",
    category: "capacity",
    title: "中海壳牌惠州计划关停一套120万吨/年乙烯裂解装置",
    summary:
      "受中东冲突导致的原料供应中断影响，中海壳牌石油化工有限公司（CSPC）计划关停其惠州两套裂解装置（合计220万吨/年）中的一套120万吨/年装置。亚洲多家炼厂和石化企业同期下调开工率。",
    fm:
      "非计划降负荷、频繁开停车会增加热循环、法兰泄漏和操作失误风险；长期停车需关注保运、防腐、防冻及封存管理。营业中断评估中，原料可得性（而非设备损坏）正成为亚洲石化的主导性风险因素。",
    refs: ["7-43"],
    tags: ["乙烯", "裂解装置", "原料中断", "营业中断"],
    sources: [
      { name: "Hydrocarbon Processing", url: "https://www.hydrocarbonprocessing.com/news/2026/03/asia-refineries-petchem-firms-cut-runs-as-middle-east-conflict-disrupts-feedstock-supplies/" },
    ],
  },

  /* ============================ 亚洲 ============================ */
  {
    id: "asia-mideast-new-disruption-2026-09",
    region: "asia",
    country: "亚洲区域",
    date: "2026-09",
    category: "market",
    title: "中东新一轮扰动：红海替代航线受阻，亚洲化工原料压力再起",
    summary:
      "伊朗战争爆发后，沙特将部分油品和化学品出口由霍尔木兹海峡转至西海岸港口经红海外运。但胡塞武装在也门东部推进、沙特东西管道遇袭，替代航线同样受阻，亚洲化工企业面临新的原料不确定性。",
    fm:
      "对亚洲客户而言，供应链中断属于营业中断（BI）/或有营业中断（CBI）风险的核心议题。建议在风险对话中确认：原料来源集中度、替代原料切换能力（石脑油→LPG/乙烷）、原料罐区库存天数及其本身的火灾风险。",
    refs: [],
    tags: ["中东", "红海", "石脑油", "供应链"],
    sources: [
      { name: "C&EN（2026-09）", url: "https://cen.acs.org/business/economy/new-middle-east-disruption-threatens-chemical-makers/104/web/2026/09" },
    ],
  },
  {
    id: "asia-taiwan-tainan-waste-2026-08",
    region: "asia",
    country: "中国台湾",
    date: "2026-08-22",
    category: "incident",
    title: "台南安南区废弃物堆置场爆炸，15人受伤（含3名消防员）",
    summary:
      "8月22日凌晨1时12分许，台南安南区海佃路一处废弃物堆置场发生爆炸，15人受伤（含3名消防员），均为轻伤已出院。消防局出动144人、53车。初步评估现场存有铝、镁合金及废油。",
    fm:
      "铝镁等活泼金属粉屑遇水放氢，常规水灭火可能加剧事态——消防员受伤即为警示。评估废料/回收类场所时关注：活泼金属与可燃废油的分区隔离、D类火灾应急预案、与消防部门的事前联动（危险物质清单共享）。",
    refs: ["7-76", "10-1"],
    tags: ["铝镁合金", "遇水反应", "废弃物", "消防员伤亡"],
    sources: [
      { name: "GAT Report", url: "https://www.gat.report/89825/89825/" },
    ],
  },
  {
    id: "asia-india-hazel-labs-2026-08",
    region: "asia",
    country: "印度·特伦甘纳",
    date: "2026-08",
    category: "incident",
    title: "印度特伦甘纳 Hazel Labs 制药厂反应釜爆炸，2死约10伤",
    summary:
      "8月一个周五晚约23时，印度特伦甘纳邦 Bhoodan Pochampally 区 Dothigudem 一带的制药企业 Hazel Labs 在工艺进行中发生反应釜爆炸，造成2名工人死亡、约10人受伤。",
    fm:
      "同一地区（Dothigudem）2026年已发生第二起制药反应釜爆炸。印度 API/中间体集群（海得拉巴、维沙卡帕特南）以多品种、间歇式、改造频繁为特点，工艺安全信息（PSI）与反应危害评估常不足。巡检重点：夜班人员配置与操作程序、反应量热数据、釜体泄放与骤冷、溶剂回收区防火分隔。",
    refs: ["7-36", "7-46", "7-49", "7-32"],
    discuss: "对一个同一园区连续发生事故的集群，如何调整对区域内其他客户的检查频次与关注点？",
    tags: ["制药", "反应釜", "API集群", "印度"],
    sources: [
      { name: "The Hans India", url: "https://www.thehansindia.com/news/cities/khammam/two-killed-in-reactor-blast-at-pharma-unit-1112817" },
    ],
  },
  {
    id: "asia-japan-cracker-closures-2026",
    region: "asia",
    country: "日本",
    date: "2026-04",
    category: "capacity",
    title: "日本乙烯装置将由12套减至8套，产能削减近三成",
    summary:
      "日本四套乙烯裂解装置将于未来几年关闭，其中三套计划于2027–2028年关停：丸善石化（49万吨/年）、出光兴产千叶（37.4万吨/年）、ENEOS川崎（46万吨/年）。关闭后日本乙烯产能削减近30%。",
    fm:
      "联合装置中上游裂解装置关停后，下游衍生物装置转为外购原料，公用工程（蒸汽、火炬、冷却水）与园区管廊共享格局随之改变——需重新评估火炬系统能力、公用工程单点故障与互供协议。",
    refs: ["7-43"],
    tags: ["日本", "乙烯", "产能整合"],
    sources: [
      { name: "S&P Global：Asia cracker rationalization", url: "https://www.spglobal.com/energy/en/news-research/latest-news/chemicals/040826-infographic-asia-cracker-rationalization-continues-as-margins-weaken" },
    ],
  },
  {
    id: "asia-hormuz-naphtha-2026-03",
    region: "asia",
    country: "亚洲区域",
    date: "2026-03-31",
    category: "market",
    title: "霍尔木兹海峡实质关闭：亚洲石脑油价格创纪录，多家企业宣布不可抗力",
    summary:
      "2月28日美以对伊朗发动袭击后，霍尔木兹海峡通行几近停止。此前该海峡每日运输约120万桶石脑油，满足亚洲60%–70%的进口需求。3月中东石脑油出口降至69.2万吨，不足2月的五分之一。3月31日 Platts 日本石脑油 CFR 升至1207.5美元/吨的纪录高位，一个多月涨近90%。多家亚洲企业宣布不可抗力、降负荷或停车。",
    fm:
      "原料切换（如石脑油改掺LPG/乙烷/凝析油）属于重大工艺变更，需完整的 MOC：裂解炉负荷、急冷与压缩系统、火炬排放能力都可能受影响。同时关注替代原料的储运设施（LPG球罐、临时装卸设施）是否满足防火间距与 BLEVE 防护要求。",
    refs: ["7-43", "7-55", "7-88"],
    discuss: "客户临时增设LPG卸车设施以替代石脑油进料，巡检时你会优先检查哪五项？",
    tags: ["霍尔木兹", "石脑油", "不可抗力", "原料切换"],
    sources: [
      { name: "S&P Global：Asia petrochemicals face Middle East war challenges", url: "https://www.spglobal.com/energy/en/news-research/special-reports/chemicals/emerging-stronger-apic-2026/asia-petrochemicals-face-middle-east-war-challenges" },
      { name: "C&EN：Strait of Hormuz closure hits Asia's chemical industry", url: "https://cen.acs.org/business/petrochemicals/Strait-Hormuz-closure-hits-Asias/104/web/2026/03" },
    ],
  },
  {
    id: "asia-korea-conservation-2026-03",
    region: "asia",
    country: "韩国",
    date: "2026-03-24",
    category: "capacity",
    title: "韩国石化业进入“节约模式”，政府推动削减20%–28%裂解产能",
    summary:
      "石脑油短缺下，韩国石化企业普遍降负荷。韩国产业通商资源部推进重组计划，目标削减石脑油裂解产能270万–370万吨/年，约占全国产能的20%–28%。",
    fm:
      "韩国丽水、大山、蔚山三大园区高度一体化，重组涉及装置合并、封存与所有权变更。所有权变更期间的维护预算、人员流失与管理体系衔接是需要重点关注的“软性”风险。",
    refs: ["7-43"],
    tags: ["韩国", "重组", "丽水", "大山", "蔚山"],
    sources: [
      { name: "ICIS", url: "https://www.icis.com/explore/resources/news/2026/03/24/11191196/insight-s-korea-petrochemical-industry-enters-conservation-mode-amid-naphtha-shortage/" },
    ],
  },
  {
    id: "asia-daejeon-fire-2026-03",
    region: "asia",
    country: "韩国·大田",
    date: "2026-03-20",
    category: "incident",
    title: "韩国大田汽车零部件厂大火：14死60伤，现场储存约200公斤金属钠",
    summary:
      "3月20日13时17分（韩国时间），大田大德区安全工业（Anjun Industrial）发动机气门工厂起火，造成14人死亡、60人受伤。三层厂房内储存约200公斤金属钠，内部覆盖生产油污，火势迅速蔓延至上层。消防出动逾千人、约200台装备，次日下午才完全扑灭。",
    fm:
      "虽非化工厂，却是化学品管理的典型教材：①遇水反应物质（钠）存放于未做专门分区、未设非水灭火设施的普通厂房；②油污积聚使建筑本身成为燃料；③多层厂房竖向蔓延。检查非化工客户时同样应识别“少量但高危”的化学品，并确认其储存区与消防策略相容。",
    refs: ["10-1"],
    discuss: "对储存遇水反应物质的区域，自动喷水保护应如何处理？请列出可选的替代保护与隔离措施。",
    tags: ["金属钠", "遇水反应", "油污", "多层厂房"],
    sources: [
      { name: "The Korea Herald", url: "https://www.koreaherald.com/article/10699845" },
      { name: "Wikipedia", url: "https://en.wikipedia.org/wiki/2026_Daejeon_factory_fire" },
    ],
  },
  {
    id: "asia-india-vj-sai-2026-02",
    region: "asia",
    country: "印度·特伦甘纳",
    date: "2026-02-25",
    category: "incident",
    title: "印度 VJ Sai Pharma 反应釜爆炸起火，1名化学师死亡",
    summary:
      "2月25日，特伦甘纳邦 Yadadri Bhuvanagiri 区 Dothigudem 村 VJ Sai Pharma 制药厂反应釜因突发化学反应爆炸并起火，一名35岁化学师烧伤致死，当地已展开调查。",
    fm:
      "与8月 Hazel Labs 事故同在 Dothigudem。印度制药集群自2024年 Atchutapuram（17死）、2025年 Sigachi（46死）后事故仍然频发，说明行业层面的反应危害管理未见实质改善。可作为“区域风险画像”课程案例。",
    refs: ["7-36", "7-46"],
    tags: ["制药", "反应釜", "印度"],
    sources: [
      { name: "Medical Dialogues", url: "https://medicaldialogues.in/news/industry/pharma/chemist-killed-in-reactor-explosion-at-telangana-pharma-unit-probe-underway-165397" },
    ],
  },
  {
    id: "asia-china-exports-flood-2026-01",
    region: "asia",
    country: "亚洲区域",
    date: "2026-01",
    category: "market",
    title: "中国石化产品大量出口，冲击亚洲其他国家生产商",
    summary:
      "中国已成为全球最大的石化产品生产和供应国，大量出口挤压东南亚、日韩生产商利润，推动区域内裂解装置延迟开车、延长停车或关闭。",
    fm:
      "利润长期承压的企业往往首先压缩维护与检修投入，这是损失趋势的先行指标。建议在工程报告中记录“检修周期延长”“关键设备带病运行”等信号。",
    refs: [],
    tags: ["产能过剩", "出口", "利润"],
    sources: [
      { name: "C&EN", url: "https://cen.acs.org/business/petrochemicals/Deluge-petrochemicals-China-swamps-Asian/104/web/2026/01" },
    ],
  },
  {
    id: "asia-formosa-extended-shutdown-2026-01",
    region: "asia",
    country: "中国台湾",
    date: "2026-01",
    category: "capacity",
    title: "台塑石化因衍生物利润疲弱延长台湾裂解装置停车",
    summary: "台塑石化延长其台湾一套乙烯裂解装置的停车时间，原因是下游衍生物利润疲弱。",
    fm:
      "长期停车装置的风险画像不同于运行装置：关注停车期间的氮气保护、防腐、仪表与消防系统的持续测试，以及再次开车前的 PSSR。",
    refs: ["7-43", "7-59"],
    tags: ["台塑", "麦寮", "长期停车"],
    sources: [
      { name: "Hydrocarbon Processing", url: "http://admin.hydrocarbonprocessing.com/news/2026/01/formosa-petrochemical-extends-taiwan-cracker-shutdown-due-to-weak-derivative-margins/" },
    ],
  },
  {
    id: "asia-exxon-singapore-2026",
    region: "asia",
    country: "新加坡",
    date: "2026-06",
    category: "capacity",
    title: "埃克森美孚新加坡老裂解装置（90万吨/年）计划于2026年6月前永久关停",
    summary:
      "埃克森美孚预计其新加坡化工厂（SCP）建于2002年的较老蒸汽裂解装置（乙烯产能90万吨/年）于2026年6月前永久关停。东南亚乙烯装置正经历延迟开车、延长停车和关闭的结构性调整。",
    fm:
      "裕廊岛高度一体化，一套装置的永久退役涉及管廊、火炬、公用工程接口的隔离与盲断。拆除/退役项目的动火作业和残余烃类是主要损失来源。",
    refs: ["7-43", "7-59"],
    tags: ["新加坡", "裕廊岛", "退役"],
    sources: [
      { name: "Industrial Info Resources", url: "https://www.industrialinfo.com/iirenergy/industry-news/article/exxonmobil-to-close-steam-cracker-in-singapore-by-june--350351" },
    ],
  },

  /* ============================ 国际 ============================ */
  {
    id: "intl-csb-shell-monaca-2026-09",
    region: "intl",
    country: "美国",
    date: "2026-09-16",
    category: "investigation",
    title: "美国CSB发布壳牌 Monaca 聚合物工厂爆炸事故最终报告",
    summary:
      "美国化学品安全委员会（CSB）于9月16日发布壳牌宾夕法尼亚 Monaca 聚合物工厂事故最终报告，事故发生于2025年6月4日。",
    fm:
      "CSB 报告是培训的一手素材：建议学员阅读报告中的“技术分析”与“组织因素”两章，并对照 FM Data Sheet 找出可对应的建议条款。Monaca 为北美较新的乙烷裂解一体化基地，可对比亚洲新建一体化项目的开车期风险。",
    refs: ["7-43", "7-45"],
    tags: ["CSB", "壳牌", "聚烯烃", "最终报告"],
    sources: [
      { name: "CSB News Releases", url: "https://www.csb.gov/news/" },
    ],
  },
  {
    id: "intl-mexico-jaltipan-2026-09",
    region: "intl",
    country: "墨西哥",
    date: "2026-09-14",
    category: "incident",
    title: "墨西哥韦拉克鲁斯 Jáltipan 盐矿卤水井爆炸起火，2人死亡",
    summary:
      "9月14日，墨西哥韦拉克鲁斯州 Jáltipan 的 Petroquímica Mexicana de Vinilo（PMV）盐矿发生爆炸，造成2名工人死亡，并引发卤水井火灾。该盐矿为氯碱/氯乙烯产业链提供原料。",
    fm:
      "上游原料设施（盐井、卤水）往往不在主装置的风险评估范围内，却可能成为氯碱—VCM—PVC 链条的单点故障。开展 BI 评估时应把关键原料供应设施纳入依赖关系图。",
    refs: ["7-43"],
    tags: ["墨西哥", "卤水", "氯碱链", "CBI"],
    sources: [
      { name: "Powder & Bulk Solids", url: "https://www.powderbulksolids.com/industrial-fires-explosions/explosion-at-salt-plant-kills-2" },
    ],
  },
  {
    id: "intl-ineos-hull-acetyls-2026-09",
    region: "intl",
    country: "英国",
    date: "2026-09",
    category: "capacity",
    title: "英力士将闲置赫尔三套醋酸系列装置，欧洲工业规模醋酸生产终结",
    summary:
      "因能源价格高企，英力士（INEOS）将闲置其英国赫尔的三套醋酸系列装置，涉及约300名员工，这意味着欧洲工业规模醋酸生产的终结。与此同时，英力士在安特卫普的 Project One 乙烷裂解装置是欧洲唯一在建的新裂解装置。",
    fm:
      "欧洲产能退出将使部分醋酸及衍生物需求转向亚洲（尤其中国）供应，亚洲相关装置负荷与扩产可能上升。关注“高负荷运行+延长检修周期”带来的设备完整性风险。",
    refs: [],
    tags: ["INEOS", "醋酸", "欧洲", "能源价格"],
    sources: [
      { name: "C&EN（2026-09）", url: "https://cen.acs.org/business/economy/ineos-shutter-uk-acetyls-plants/104/web/2026/09" },
    ],
  },
  {
    id: "intl-us-fatalities-2026-07",
    region: "intl",
    country: "美国",
    date: "2026-07",
    category: "investigation",
    title: "美国化工设施过去一年死亡人数创历史高位",
    summary: "C&EN 报道，基于 CSB 及 RMP 数据，美国化工设施在过去一年中出现前所未有的事故死亡人数。",
    fm:
      "人员伤亡与财产损失高度相关——大多数重大伤亡事故同时伴随显著的设备与建筑损失。可在培训中讨论：成熟监管体系（PSM/RMP）下为何事故仍上升？老化资产、人员流失与承包商管理是常见答案。",
    refs: ["7-43"],
    tags: ["美国", "CSB", "RMP", "趋势"],
    sources: [
      { name: "C&EN（2026-07）", url: "https://cen.acs.org/safety/csb-rmp-chemical-facility-accident-deaths/104/web/2026/07" },
    ],
  },
  {
    id: "intl-dow-europe-closures-2026",
    region: "intl",
    country: "欧洲",
    date: "2026-06",
    category: "capacity",
    title: "欧洲关停潮持续：陶氏 Barry 硅氧烷装置2026年中关停，Böhlen 裂解装置2027年四季度关停",
    summary:
      "陶氏宣布关闭三项欧洲上游资产：英国 Barry 硅氧烷装置（预计2026年中）、德国 Böhlen 乙烯裂解装置及 Schkopau 氯碱/乙烯基装置（预计2027年四季度）。巴斯夫亦关闭路德维希港己二酸、环十二酮和环戊酮装置。英、德、比、荷、意等国均有永久关停计划。",
    fm:
      "全球产能再平衡：欧洲退出 → 亚洲与中东承接。对亚洲工程师而言，这意味着区域内新建/扩建项目的风险评审需求增加，也意味着部分全球客户会将“关键单一来源”装置转移到亚洲。",
    refs: [],
    tags: ["陶氏", "巴斯夫", "欧洲", "产能退出"],
    sources: [
      { name: "CHEManager", url: "https://chemanager-online.com/en/news/dow-to-shut-down-three-upstream-european-assets" },
      { name: "Chemistry World", url: "https://www.chemistryworld.com/news/two-more-european-crackers-to-close/4021824.article" },
    ],
  },
  {
    id: "intl-institute-wv-2026-04",
    region: "intl",
    country: "美国·西弗吉尼亚",
    date: "2026-04-22",
    category: "incident",
    title: "美国西弗吉尼亚 Institute 化学品泄漏爆炸：2死30伤，CSB介入调查",
    summary:
      "4月22日，Ames Goldsmith 公司位于西弗吉尼亚 Institute 的银催化剂工厂在储罐退役作业中，化学品 M200A 与硝酸在泵区混合，发生剧烈反应、爆炸并释放硫化氢，造成2人死亡、30人受伤。西弗吉尼亚环保部门与美国CSB已介入调查。该厂此前曾有硝酸泄漏记录及OSHA违规。",
    fm:
      "“退役/清罐”属于非常规作业，是化学品不相容混合的高发场景。检查重点：退役作业的MOC与作业许可、系统隔离与清洗确认、不相容化学品矩阵、共用泵/管线的切换管理。",
    refs: ["7-43", "7-59"],
    discuss: "为一次储罐退役作业编写检查清单：哪些环节必须有书面确认和签字？",
    tags: ["不相容化学品", "硝酸", "硫化氢", "退役作业"],
    sources: [
      { name: "PBS News", url: "https://www.pbs.org/newshour/nation/chemical-leak-at-a-west-virginia-plant-kills-2-people-and-sends-19-to-hospital-officials-say" },
      { name: "West Virginia Watch", url: "https://westvirginiawatch.com/2026/04/23/wv-federal-agencies-will-investigate-deadly-institute-chemical-leak-officials-say/" },
      { name: "Wikipedia", url: "https://en.wikipedia.org/wiki/2026_Institute,_West_Virginia_chemical_disaster" },
    ],
  },
  {
    id: "intl-iran-war-petchem-2026-04",
    region: "intl",
    country: "全球",
    date: "2026-04",
    category: "market",
    title: "伊朗战争将使石化行业在2026年余下时间持续承压",
    summary:
      "国际能源署将霍尔木兹海峡中断称为“全球石油市场史上最大的供应中断”。原本预计为产能过剩的2026年，转变为石化行业最严重的供应危机之一。",
    fm:
      "宏观冲击会迅速传导为现场风险：降负荷运行、频繁开停车、原料切换、库存上升、维修延期。建议在年度风险评审中加入“地缘冲击应对”章节。",
    refs: [],
    tags: ["伊朗", "IEA", "供应危机"],
    sources: [
      { name: "C&EN（2026-04）", url: "https://cen.acs.org/business/Iran-war-debilitate-petrochemicals-rest/104/web/2026/04" },
      { name: "Wikipedia：2026 Iran war fuel crisis", url: "https://en.wikipedia.org/wiki/2026_Iran_war_fuel_crisis" },
    ],
  },
  {
    id: "intl-csb-vol4-2026-02",
    region: "intl",
    country: "美国",
    date: "2026-02-18",
    category: "investigation",
    title: "CSB发布第4卷事件报告，涵盖7个州的13起化学事故",
    summary:
      "美国CSB于2月18日发布第4卷事件报告（Incident Reports），涵盖7个州的13起重大化学品事故，包括事故摘要、可能原因及技术细节，作为其扩大透明度举措的一部分。",
    fm: "短篇事件报告非常适合做“15分钟案例”晨会培训：每次一个案例，讨论直接原因—深层原因—FM 对应建议。",
    refs: [],
    tags: ["CSB", "案例库", "培训素材"],
    sources: [
      { name: "Inspectioneering", url: "https://inspectioneering.com/news/2026-02-18/11940/us-chemical-safety-board-releases-volume-4-of-chemical-incident-reports" },
      { name: "CSB 已完成调查", url: "https://www.csb.gov/investigations/completed-investigations/" },
    ],
  },
];
