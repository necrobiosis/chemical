/*
 * 重大动态的 FM 防损速报（不需要 API 密钥）
 * ------------------------------------------------------------
 * 由 Claude Code 会话或每日定时任务（Routine）根据报道撰写，键为原文链接（feeds.js 中条目的 link）。
 * 字段：
 *   summary  事故概况（中文 2–3 句，只写报道中的事实，未说明的写“报道未说明”）
 *   points   FM 防损视角要点（3 条）
 *   refs     相关 FM Data Sheet 编号（仅限培训基地速查表中的编号）
 *   event    同一事件的标识：多家媒体报道同一事故时首页只显示一张卡片
 *   caseId   若案例库已收录该事故，填精选新闻 id，弹窗中提供“查看案例详情”
 *   notLoss  true 表示不是财产损失事件（会议、网站通报、纯人身伤害等），不再显示为重大
 *   reason   notLoss 的简短说明
 *   by / at  撰写者与日期
 */
window.FM_NOTES = {
  "https://www.mem.gov.cn/xw/gdyj/202610/t20261023_736739.shtml": {
    notLoss: true,
    reason: "地方应急管理局召开的事故警示教育会议，不是事故报道",
    by: "Claude Code", at: "2026-10-24",
  },
  "https://www.mem.gov.cn/gk/zfxxgkpt/fdzdgknr/202610/t20261021_736480.shtml": {
    notLoss: true,
    reason: "政府网站季度检查情况通报，与事故无关",
    by: "Claude Code", at: "2026-10-24",
  },
  "https://www.safehoo.com/News/News/China/202610/5819365.shtml": {
    notLoss: true,
    reason: "台积电高雄厂区施工人员高处坠落（4人死亡），属人身安全事故，报道未涉及财产损失",
    by: "Claude Code", at: "2026-10-24",
  },

  // 美国托莱多 GMA 储罐泄漏（多家媒体报道同一事件）
  "https://info.vanpeople.com/1912862.html": { event: "toledo-gma-2026-10", ref: "toledo" },
  "https://www.wsws.org/en/articles/2026/10/23/rzsr-o23.html": { event: "toledo-gma-2026-10", ref: "toledo" },
  "https://economictimes.indiatimes.com/news/international/world-news/toledo-chemical-leak-evacuation-order-expanded-to-3-miles-heres-what-happened-and-latest-updates/articleshow/135093068.cms": { event: "toledo-gma-2026-10", ref: "toledo" },
  "https://sg.news.yahoo.com/chemical-tank-explodes-ohio-forcing-135614269.html": { event: "toledo-gma-2026-10", ref: "toledo" },
  "https://www.hindustantimes.com/world-news/us-news/toledo-chemical-leak-forces-evacuations-and-shelter-in-place-order-all-on-emergency-number-road-closures-and-temporary-refuge-facility-101792575961997.html": { event: "toledo-gma-2026-10", ref: "toledo" },

  "https://economictimes.indiatimes.com/news/india/bengaluru-building-blast-injures-two-battery-explosion-suspected/articleshow/135086171.cms": {
    event: "bengaluru-battery-2026-10",
    summary: "10月21日清晨，印度班加罗尔 Jarmia Road 一栋在建建筑发生爆炸，2人受伤（其中1人失去一根手指）。警方初步怀疑为电池爆炸，具体原因仍在调查，财产损失情况报道未说明。",
    points: [
      "锂电池与储能电池在工地、仓库和厂房中越来越常见，热失控可引发火灾和爆炸，且难以用水快速扑灭。",
      "检查电池储存和充电区域：独立防火分隔、远离可燃物、温度监控与充电管理。",
      "建设期是防火管理的薄弱阶段：临时用电、可燃物堆放多，而消防设施往往尚未投用。",
    ],
    refs: ["10-1"],
    by: "Claude Code", at: "2026-10-24",
  },
  "https://www.csb.gov/final-investigation-report---chevron-refinery-and-fire-/?theme=%2Fetc%2Fpasswd&F_All=y&print=y": {
    event: "csb-chevron-richmond",
    summary: "这是美国化学品安全委员会（CSB）关于 2012 年 8 月 6 日雪佛龙里士满炼厂火灾的调查报告页面，并非新发生的事故。原油装置一段侧线管道因硫化腐蚀减薄破裂，泄漏的可燃烃类形成蒸气云并起火。CSB 认为企业未识别该管道的损伤机理和破裂可能，也缺乏泄漏应对指引；其中一项相关建议于 2026 年 3 月结案。",
    points: [
      "高温含硫工况下碳钢管道的硫化腐蚀是炼厂的典型损伤机理：检查是否按管段逐一测厚，而不是只测代表性测点。",
      "泄漏发生后不应在未隔离的情况下带压处置：确认有远程切断阀和书面的泄漏应对程序。",
      "适合作为“机械完整性 → 管道破裂 → 蒸气云火灾”链条的培训案例。",
    ],
    report: {
      issuer: "美国化学品安全委员会（CSB）",
      type: "最终调查报告（报告页面，近期有更新）",
      date: "2015-01（2026-03 一项建议结案）",
      about: "2012年8月6日 雪佛龙里士满炼厂原油装置管道破裂火灾",
      findings: [
        "原油装置一段碳钢侧线管道因硫化腐蚀严重减薄后破裂，泄漏的烃类形成蒸气云并起火。",
        "企业未有效识别该管道可能的损伤机理和灾难性破裂风险，此前已有加强检验的内部建议未落实。",
        "缺乏泄漏应对指引：发现泄漏后人员在未隔离的情况下处置，泄漏扩大后起火。",
      ],
      recommendations: [
        "要求美国石油学会（API）加强防止硫化腐蚀的最低要求（如对易受影响的碳钢管段逐一测厚或升级材质）。",
        "建议加州建立更严格的炼厂安全监管体系；相关建议之一于 2026 年 3 月以“已采取可接受行动”结案。",
      ],
      url: "https://www.csb.gov/chevron-richmond-refinery-fire/",
    },
    refs: ["7-43", "7-42"],
    by: "Claude Code", at: "2026-10-24",
  },
  "https://scanx.trade/stock-market-news/companies/mangalore-refinery-reports-fire-coker-hydrotreater-unit-one-minor/52306769": {
    event: "mrpl-2026-09",
    caseId: "asia-india-mrpl-2026-09",
    summary: "芒格洛尔炼油石化公司（MRPL）宣布向 9 月 30 日炼厂火灾中遇难工人的家属提供 1.2 千万卢比补偿。事故发生在延迟焦化瓦斯油加氢处理装置：高压冷分离器（报道称约 70 bar）破裂后爆炸起火，约 2.5 小时后扑灭，破裂原因仍在调查。",
    points: [
      "加氢装置高压分离器内是高压氢气与烃类，破裂即为物理爆炸叠加火灾：检查高压容器检验计划，以及氢腐蚀、湿硫化氢开裂的监测。",
      "关注液位控制失效导致的高低压串压，以及紧急泄压系统的能力。",
      "本站案例库已收录这起事故的详细分析，可结合培训讨论题使用。",
    ],
    refs: ["7-43", "7-91", "7-49"],
    by: "Claude Code", at: "2026-10-24",
  },

  "https://timesofindia.indiatimes.com/city/hyderabad/2-workers-killed-in-gas-leak-at-chemical-plant-in-telangana/articleshow/135139247.cms": {
    event: "saraca-gaddapotharam-2026-10",
    summary: "10月23日（周五）凌晨，印度特伦甘纳邦桑加雷迪县 Jinnaram 区 Gaddapotharam 工业区 Saraca Laboratories（报道亦拼作 Saraka）的“Glaba”车间发生有害气体泄漏，2名夜班工人死亡。泄漏气体种类、涉及的工序与设备、其他人员受伤情况均报道未说明；报道未提及起火、爆炸或财产损失，警方正在调查原因。",
    points: [
      "有毒气体泄漏本身属于“失去包容”的过程安全事件，同样的泄漏源若遇点火源或不相容物料，可能演变为火灾、爆炸或反应失控。",
      "原料药/化工车间的反应釜投料、气体通入和尾气吸收是常见泄漏环节：检查气体探测报警与紧急切断联锁的覆盖范围和测试记录。",
      "夜班人员少、响应慢，泄漏发现晚会扩大后果：关注夜班的操作程序、人员配置与应急处置能力。",
    ],
    refs: ["7-43", "7-36", "7-45"],
    by: "Claude Code", at: "2026-10-24",
  },

  "https://www.siasat.com/2-dead-4-hospitalised-after-chloroform-leak-at-telangana-plant-3563236/": {
    event: "saraca-gaddapotharam-2026-10",
    summary: "据警方初步调查，10月22日（周四）约23时30分，特伦甘纳邦桑加雷迪县 Jinnaram 区一家制药企业（该报道未点名，其他报道称为 Saraca Laboratories）的一条输送氯仿的管道发生泄漏，员工疑因吸入氯仿昏迷，一名29岁化学师和一名44岁主管送医后不治，另有4人住院。报道未提及起火、爆炸或财产损失，进一步调查仍在进行。",
    points: [
      "管道输送溶剂发生泄漏说明法兰、阀门或管道本体存在完整性问题：检查溶剂管线的检验记录、垫片与密封管理和泄漏修复程序。",
      "氯仿本身不易燃，但同一车间往往还有大量易燃溶剂，同样的泄漏一旦遇上易燃介质就可能演变为火灾：关注溶剂区的通风、气体探测与远程切断。",
      "夜间多人相继昏迷，说明泄漏发现和报警滞后：检查有毒/可燃气体报警是否覆盖管廊与作业区，以及夜班的应急响应能力。",
    ],
    refs: ["7-43", "7-36", "7-32"],
    by: "Claude Code", at: "2026-10-24",
  },
  "https://www.wionews.com/world/several-injured-in-massive-explosion-and-fire-at-chemical-warehouse-in-mexico-s-le-n-san-nicol-s-1792809823352/amp": {
    event: "leon-solvent-warehouse-2026-10",
    summary: "10月23日（周五）下午，墨西哥瓜纳华托州莱昂市 San Nicolás 区一处溶剂与化学品仓库（当地报道称是为制鞋业供应溶剂和原料的工厂）起火，随后几个容器接连爆炸，每隔三到五分钟就有一声，周边企业和居民被疏散。各报道的伤亡数字不一（1至2人重伤，另有人轻伤），起火原因和涉及的具体物料报道未说明，建筑损失程度也未说明。",
    points: [
      "反复爆炸很可能是桶装或罐装易燃溶剂受热超压破裂，每次破裂都会让火势进一步扩大：检查仓库内溶剂存量、容器类型，以及储存区是否有泄压和防火分隔。",
      "位于城区、混合多种化学品的小型溶剂仓库常常缺少自动喷淋、泡沫灭火和防溢流围堰：检查是否按易燃液体仓储的要求设计，以及溢流液体会不会流到相邻区域。",
      "火灾殃及周边企业，还需要疏散：评估类似客户与邻近溶剂仓储之间的间距和外部暴露，以及停工造成的营业中断。",
    ],
    refs: ["7-32", "7-88", "10-1"],
    by: "Claude Code", at: "2026-10-24",
  },

  "https://www.safehoo.com/Case/Case/Machine/202610/5819745.shtml": {
    notLoss: true,
    reason: "2014年珠海粤裕丰钢铁皮带机机械伤害事故（1人死亡）的旧调查报告，属人身伤害事故，不涉及财产损失",
    by: "Claude Code", at: "2026-10-26",
  },

  "https://www.thehindu.com/news/national/telangana/two-workers-killed-in-chloroform-vapour-leak-at-pharma-unit-tgpcb-orders-closure/article71617455.ece": {
    event: "saraca-gaddapotharam-2026-10",
    summary: "10月22日夜间，特伦甘纳邦 Gaddapotharam 工业区 Saraca Laboratories 二号生产车间在分层操作中，把氯仿从一楼反应釜转移到底楼接收罐时发生蒸气泄漏，2名工人死亡，另有操作工、主管等数人送医。特伦甘纳邦污染控制委员会（TGPCB）随后下令工厂立即停产，并要求电力公司切断供电；起火、爆炸或设备损失情况报道未说明。",
    points: [
      "跨楼层的反应釜→接收罐重力转料是溶剂泄漏的高发环节：检查转料管线、软管与视镜的完好性，以及转料时的密闭和排气回收。",
      "监管部门勒令停产并断电，意味着即使设备本身损失不大，营业中断也可能持续较长时间：评估类似客户在事故后的复产审批周期。",
      "同一车间若使用易燃溶剂，同样的泄漏可能演变为火灾或爆炸：关注生产车间的通风换气、气体探测报警与转料作业程序。",
    ],
    refs: ["7-43", "7-36", "7-32"],
    by: "Claude Code", at: "2026-10-27",
  },

  // 同一事件共用的速报内容
  _shared: {
    toledo: {
      summary: "10月20日（周二）约21时30分，美国俄亥俄州托莱多北部 Progress Avenue 的 MC Tank Transport（Kenan Advantage 集团子公司）一台 5,500 加仑储罐在物料转运过程中出错，罐体破裂并持续向外排放甲基丙烯酸缩水甘油酯（GMA）。当局下令 1 英里内疏散、3 英里内就地避险，约 60 人因眼睛和喉咙灼痛就医；消防未派人进入堵漏，而是任其排放，市长曾警告可能再次爆炸。俄亥俄州环保局称原因是转运操作失误，详细调查尚未公布。",
      points: [
        "GMA 是可自聚合的活性单体，受热或混入杂质会放热聚合导致超压：转运和储存时确认阻聚剂含量、温度监控与冷却手段。",
        "罐车清洗、转运场站常被当作低风险物流设施，但同时存有多种化学品残液：检查不相容物料混合、转运程序与作业许可。",
        "失控后只能“任其排放”，说明缺少紧急泄压处置与远程隔离手段；同时评估对周边客户的外部暴露和营业中断（疏散区内停工停课）。",
      ],
      refs: ["7-49", "7-88", "7-43"],
    },
  },
};
