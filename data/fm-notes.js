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

  "https://www.hazardexonthenet.net/article/223529/CLOSING-SOON-Awards-Nominations-Deadline-30th-October-Hazardex-Live-2027.aspx": {
    notLoss: true,
    reason: "HazardEx 行业奖项提名截止通知，不是事故报道",
    by: "Claude Code", at: "2026-10-27",
  },
  "https://www.icis.com/explore/resources/news/2026/10/26/11238870/podcast-firefighting-restructuring-and-tug-of-war-icis-editors-sum-up-fakuma-fair": {
    notLoss: true,
    reason: "ICIS 编辑点评 Fakuma 塑料展会的播客，标题中的“Firefighting”是比喻，与事故无关",
    by: "Claude Code", at: "2026-10-27",
  },

  "https://www.mem.gov.cn/xw/gdyj/202610/t20261027_737194.shtml": {
    notLoss: true,
    reason: "山东省出台重大事故隐患调查处理办法的政策新闻，不是事故报道",
    by: "Claude Code", at: "2026-10-28",
  },
  "https://www.mem.gov.cn/xw/gdyj/202610/t20261027_737192.shtml": {
    notLoss: true,
    reason: "江西公布事故隐患内部报告奖励案例的通报，不是事故报道",
    by: "Claude Code", at: "2026-10-28",
  },
  "https://www.mem.gov.cn/xw/gdyj/202610/t20261027_737193.shtml": {
    notLoss: true,
    reason: "天津市危化领域典型事故警示教育会议，不是事故报道",
    by: "Claude Code", at: "2026-10-28",
  },
  "https://news.chemnet.com/toutiao/detail-92256.html": {
    notLoss: true,
    reason: "韩国南海化学丽水硫酸钾厂区叉车侧翻致1人死亡，报道称未引发物料泄漏、火灾或爆炸，属人身伤害事故",
    by: "Claude Code", at: "2026-10-28",
  },
  "https://economictimes.indiatimes.com/topic/Paramjeet-Singh-Pamma": {
    notLoss: true,
    reason: "德里红堡爆炸后市场停业的商业报道，并非工业事故，且链接指向人物话题页",
    by: "Claude Code", at: "2026-10-28",
  },
  "https://www.hazardexonthenet.net/article/224676/Dutch-Safety-Board-investigates-fatal-pipeline-accident.aspx": {
    event: "gunvor-rotterdam-2026-08",
    summary: "2026年8月13日约11时30分，荷兰鹿特丹 Europoort 区 Gunvor Energy 储罐库区（属 Seveso 管控设施）在一套装置退役拆除过程中断开管线时发生爆炸，1人死亡、5人受伤，现场作业的6人为 Gunvor 员工和承包商。涉及物料、财产损失和原因报道未说明；荷兰安全委员会已立案调查，重点是如何判断管线可以安全打开，以及这一状态如何在人员之间传达。",
    points: [
      "退役拆除时打开管线是典型的非常规作业：管线内残留的可燃物料或蒸气未彻底清除，遇点火源即可爆炸。",
      "检查隔离、排空、吹扫/惰化与气体检测的确认程序，以及“可安全打开”的签字放行和交接记录。",
      "承包商参与的拆除作业要纳入作业许可和变更管理，并评估邻近在役储罐和管线受波及的风险。",
    ],
    refs: ["7-59", "7-43", "7-88"],
    by: "Claude Code", at: "2026-10-28",
  },
  "https://www.hazardexonthenet.net/article/224681/Turkey-methane-explosion-at-coal-mine-kills-three-workers.aspx": {
    event: "zonguldak-mine-2026-10",
    summary: "10月23日，土耳其宗古尔达克省 Kilimli 区 Gelik 一处由 Demir Madencilik 公司运营的煤矿发生瓦斯（甲烷）爆炸，当时井下有8名工人，3人死亡、5人受伤（其中2人重伤）。设备和井巷损失报道未说明；甲烷积聚原因和点火源仍在调查，检方已对矿方经营者和职业安全专员发出拘留令。",
    points: [
      "甲烷积聚通常源于通风不足或局部通风中断，再遇到电气火花、摩擦或爆破等点火源就会爆炸。",
      "检查可燃气体连续监测与超限自动断电的联锁，以及通风系统的可靠性和备用能力。",
      "煤矿不是化工客户，但同样的“可燃气体积聚 + 点火源”机理适用于有沼气或可燃气体的地下及半封闭空间（如污水池、地下管廊）。",
    ],
    refs: [],
    by: "Claude Code", at: "2026-10-28",
  },

  "https://news.chemnet.com/toutiao/detail-92552.html": {
    notLoss: true,
    reason: "10月27日沙特拉斯塔努拉炼厂附近起火，胡塞武装宣称发动导弹袭击；属战争/袭击事件，不是工业事故，起火原因与损失官方均未确认",
    by: "Claude Code", at: "2026-10-29",
  },
  "https://inkorr.com/en/masovana-ataka-bezpilotnikiv-na-himzavod-azot-u-novomoskovsku-pozeza-ta-vibuhi-v-lipecku-352467": {
    notLoss: true,
    reason: "10月28日俄罗斯新莫斯科夫斯克 Azot 化工厂遭无人机袭击起火，属战争袭击，不是工业事故",
    by: "Claude Code", at: "2026-10-29",
  },
  "https://ua.news/cn/war-vs-rf/video-u-rosiyi-vnochi-lunali-vibukhi-ta-gorili-zavodi-aeroporti-moskvi-obmezhili-robotu": {
    notLoss: true,
    reason: "10月28日俄罗斯多地遭无人机袭击（含图拉州 Azot 化工厂起火）的战事报道，不是工业事故",
    by: "Claude Code", at: "2026-10-29",
  },
  "https://news.chemnet.com/toutiao/detail-92518.html": {
    event: "ineos-bayport-eo-2026-10",
    summary: "英力士氧化物公司（INEOS Oxide）在2026年10月16日的客户通知中宣布，美国得克萨斯州 Bayport 基地的环氧乙烷及其衍生物供应进入不可抗力，原因是“意外的设备故障和机械失灵”影响生产。具体故障设备、产能影响、恢复时间，以及是否有起火、爆炸或人员伤亡，报道均未说明。",
    points: [
      "环氧乙烷装置的关键设备（循环气压缩机、反应器、换热器）一旦意外故障，往往需要长时间检修，营业中断损失可能远超设备本身的修复费用。",
      "环氧乙烷易燃易爆，还可能自聚或分解，停车、检修和再开车阶段风险较高：检查惰化置换和开停车程序。",
      "检查类似客户关键转动设备的状态监测、备件储备和修复周期，以及下游衍生物装置对单一环氧乙烷来源的依赖。",
    ],
    refs: ["7-43", "7-59", "7-45"],
    by: "Claude Code", at: "2026-10-29",
  },

  "https://www.koreaherald.com/article/10914240": {
    notLoss: true,
    reason: "朝鲜就非军事区地雷爆炸致函联合国安理会的外交新闻，不是工业事故",
    by: "Claude Code", at: "2026-10-29",
  },
  "https://timesofindia.indiatimes.com/city/madurai/blast-at-firecracker-unit-near-sivakasi-none-injured/articleshow/135276979.cms": {
    event: "sivakasi-mamsapuram-2026-10",
    summary: "10月28日中午前后，印度泰米尔纳德邦维鲁杜纳加尔县西瓦卡西附近 Mamsapuram 一家持证烟花厂（当地泰米尔语报道称为 Vari 烟花厂，雇员200余人）发生爆炸。工人当时正在休息、不在室内，因此无人受伤；各报道说法不一，《印度时报》称3间生产间受损，泰米尔语报道称1间存放烟花的房间被夷平。起火原因报道未说明，警方正在调查。",
    points: [
      "排灯节前赶工，生产间和暂存间的药剂、成品存量往往超出限额：一间爆炸很容易殉爆到相邻房间。",
      "检查各工房的存药限量、工房之间的安全间距和防爆土堤，以及成品及时转运出厂的制度。",
      "摩擦、撞击和静电是烟花药剂的主要点火源：关注工具材质、防静电措施、地面材料，以及高温天气下的温湿度控制。",
    ],
    refs: ["7-43", "10-1"],
    by: "Claude Code", at: "2026-10-29",
  },

  "https://www.asiae.co.kr/en/article/social-general/2026102922065321652": {
    notLoss: true,
    reason: "韩国乌山市模拟火灾、爆炸和氨泄漏的综合灾害应急演练，不是真实事故",
    by: "Claude Code", at: "2026-10-30",
  },
  "https://www.koreaherald.com/article/10919421": {
    notLoss: true,
    reason: "仁川一家餐馆燃气爆炸后演员关闭气瓶阀门的社会新闻，属商业餐饮场所事故，非化工/工业设施",
    by: "Claude Code", at: "2026-10-30",
  },

  "https://www.mem.gov.cn/xw/gdyj/202610/t20261030_737470.shtml": {
    notLoss: true,
    reason: "应急管理部“历史上十一月发生的危险化学品事故”回顾汇编，不是新发生的事故",
    by: "Claude Code", at: "2026-10-30",
  },
  "https://www.mem.gov.cn/fw/jsxx/202610/t20261030_737484.shtml": {
    notLoss: true,
    reason: "山东省事故隐患内部报告奖励机制宣传活动，不是事故报道",
    by: "Claude Code", at: "2026-10-30",
  },
  "https://www.reuters.com/world/asia-pacific/who-is-blame-hong-kongs-deadly-2025-fire-2026-10-29/": {
    notLoss: true,
    reason: "路透社回顾2025年香港致命火灾追责问题的报道，属住宅建筑火灾的旧事件，非化工/工业事故",
    by: "Claude Code", at: "2026-10-30",
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
