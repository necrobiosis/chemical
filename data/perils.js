/*
 * 事故起因分类（参照 FM 损失预防的风险划分：火灾与爆炸、设备风险、自然灾害）
 * ------------------------------------------------------------
 * 精选新闻在 data/news.js 中用 causes 字段标注，例如：
 *   causes: [{ peril: "equipment", cause: "pressure" }, { peril: "fire", cause: "gas" }]
 * 第一项为主因，其余为次因（诱发或后果）。
 * 自动抓取的实时动态按标题关键词归类（keywords），仅供参考。
 * guide：该起因的 FM 防损检查要点，用于重大动态弹窗中尚无专门分析时的通用提示。
 */
window.PERILS = [
  {
    id: "fire",
    name: "火灾与爆炸",
    en: "Fire & Explosion",
    desc: "可燃物、易燃液体与气体的火灾，以及反应失控、分解、不相容化学品混合引起的爆炸与危险反应。化工行业财产损失的主要来源。",
    series: "FM Data Sheet 7 系列（危险工艺与化学品）、10 系列（应急与人为因素）",
    ds: ["7-43", "7-14", "7-46", "7-42", "7-32", "7-17"],
    generic: "爆炸|爆燃|闪爆|火灾|起火|大火|着火|explosion|explod|blast|\\bfire\\b|blaze",
    causes: [
      { id: "runaway", name: "反应失控与分解爆炸", guide: ["确认反应量热数据（ΔTad、TMRad）完整，冷却、搅拌失效时有联锁停止进料", "紧急泄放（爆破片/安全阀）按两相流工况设计，泄放物引至收集或骤冷设施", "间歇工艺的变更管理与操作程序，夜班与开停车阶段的人员配置"], ds: ["7-46", "7-49"], keywords: "反应釜|失控|硝化|分解|runaway|reactor" },
      { id: "gas", name: "可燃气体/蒸气泄漏爆炸", guide: ["可燃气体探测与紧急切断联锁的覆盖与测试记录", "装置拥挤度与受限空间：评估 VCE 超压对周边建筑和设备的影响", "泄漏源管理：法兰、密封、取样点的检查与泄漏修复程序"], ds: ["7-42", "7-91", "7-17"], keywords: "闪爆|燃气|氢气|天然气|液化气|gas explosion|vapor cloud|vapour cloud|hydrogen|LPG" },
      { id: "liquid", name: "易燃液体火灾", guide: ["储罐与工艺区的防火间距、防火堤及排液能力", "固定消防（泡沫、水喷雾）的设计依据与测试记录", "溶剂转移的密闭、接地跨接与静电控制，车间内溶剂存量"], ds: ["7-32", "7-88"], keywords: "油罐|储罐|溶剂|甲苯|柴油|tank fire|solvent|fuel|diesel" },
      { id: "reactive", name: "遇水/不相容化学品反应", guide: ["不相容化学品矩阵：储存、共用管线和废液收集是否会混合", "非常规作业（清罐、退役、维修）的隔离、清洗确认与作业许可", "遇水反应物质的隔离储存与非水灭火措施，并事先告知消防部门"], ds: ["7-43"], keywords: "中毒|有毒|遇水|不相容|硫化氢|toxic|hydrogen sulfide|chemical reaction" },
      { id: "dust", name: "粉尘爆炸", guide: ["粉尘爆炸特性数据（Kst、MIE）与危险区域划分", "除尘、干燥、料仓的泄爆、抑爆与隔爆设计", "积尘清扫制度与点火源控制"], ds: ["7-76"], keywords: "粉尘|dust" },
      { id: "general", name: "一般可燃物与建筑火灾", guide: ["建筑耐火等级、防火分隔与自动喷水保护", "可燃物与油污的清洁管理、仓储堆垛高度", "火灾探测、报警与消防水源是否满足最大需求"], ds: ["10-1"], keywords: "厂房|仓库|车间火灾|warehouse|factory fire|building" },
    ],
  },
  {
    id: "equipment",
    name: "设备风险",
    en: "Equipment",
    desc: "压力容器与储罐失效、腐蚀与机械完整性问题、转动设备与电气设备故障，以及仪表、控制和辅助系统失效。设备失效常是火灾爆炸的起点，也是营业中断的主要原因。",
    series: "FM Data Sheet 5 系列（电气）、12/13 系列（压力设备与机械）、7-45、7-110",
    ds: ["7-45", "7-110", "7-49", "5-4"],
    impact: "泄漏|爆炸|起火|火灾|事故|停产|停车|受损|故障|中断|leak|explosion|fire|blast|damage|outage|shut|halt|evacuat|rupture|disrupt|fail",
    causes: [
      { id: "pressure", name: "压力容器/储罐超压或破裂", guide: ["压力容器与储罐的检验计划、壁厚与腐蚀监测", "超压保护：安全阀/呼吸阀能力覆盖最不利工况，高低压串压保护", "泄压操作的书面程序与联锁，异常工况处置培训"], ds: ["7-49", "7-88"], keywords: "超压|破裂|爆管|容器爆炸|罐体|rupture|overpressur|vessel|separator" },
      { id: "controls", name: "仪表、控制与辅助系统失效", guide: ["安全仪表系统（SIS）与联锁的独立性、旁路管理和定期测试", "辅助系统（真空泵、冷却水、氮气、仪表风）失效时的安全停车逻辑", "控制系统的冗余、电源可靠性与网络安全"], ds: ["7-45", "7-110"], keywords: "跳停|停电|仪表|控制系统|联锁|真空泵|power outage|power failure|trip|control system" },
      { id: "integrity", name: "腐蚀与机械完整性（泄漏、管道破裂）", guide: ["关键管线与设备的腐蚀监测、检验周期，检验逾期情况", "维护推迟的审批与风险评估", "泄漏后的快速隔离能力（远程切断阀）与装置间防火间距"], ds: ["7-43"], keywords: "腐蚀|管道|管线|穿孔|corrosion|pipeline|pipe|equipment failure" },
      { id: "machinery", name: "转动设备故障（压缩机、泵、透平）", guide: ["压缩机、泵、透平的振动监测与保护停车", "润滑与密封系统的可靠性，关键备件与修复周期", "转动设备失效对营业中断的影响评估"], ds: [], keywords: "压缩机|机组|透平|compressor|turbine|pump failure" },
      { id: "electrical", name: "电气设备故障（变压器、配电）", guide: ["变压器与配电设备的油品分析、红外检测与维护", "变压器防火分隔、防油堤与固定消防", "供电中断对工艺安全停车和营业中断的影响"], ds: ["5-4"], keywords: "变压器|配电|电气|短路|transformer|electrical|short circuit" },
    ],
  },
  {
    id: "natural",
    name: "自然灾害",
    en: "Natural Hazards",
    desc: "洪水与暴雨、台风、地震、雷击等自然灾害对工厂的直接破坏，以及由此诱发的泄漏、火灾爆炸（Natech）和停产。亚洲是台风、洪水和地震高发区。",
    series: "FM Data Sheet 1 系列（建筑与自然灾害）",
    ds: ["1-40", "1-28", "1-2"],
    impact: "停产|停工|受损|受淹|受灾|影响|起火|爆炸|泄漏|damage|disrupt|halt|shut|outage|evacuat|inundat|fire|leak|factor|plant|refiner",
    causes: [
      { id: "flood", name: "洪水与暴雨", guide: ["厂址设计洪水位与关键设备、电气室、控制室的标高", "挡水板、排水泵等应急防洪措施与预案演练", "洪水退后的设备干燥、检查与安全复电程序"], ds: ["1-40"], keywords: "洪水|洪涝|暴雨|内涝|受淹|降雨|flood|inundat|heavy rain" },
      { id: "wind", name: "台风与强风", guide: ["建筑围护结构与屋面的抗风设计、屋面设备固定", "台风前的预防措施：固定物料、储罐液位、停车预案", "户外高耸设备与管廊的风荷载校核"], ds: ["1-28"], keywords: "台风|强风|飓风|龙卷|typhoon|hurricane|cyclone|tornado" },
      { id: "quake", name: "地震", guide: ["塔器、球罐支撑与管廊的抗震设计与评估", "地震自动切断阀、管道柔性连接，喷淋系统抗震支吊架", "震后恢复生产前的检查清单与优先顺序"], ds: ["1-2"], keywords: "地震|海啸|earthquake|quake|tsunami" },
      { id: "lightning", name: "雷击", guide: ["防雷与接地系统的定期检测，尤其是后加装的屋顶设施", "储罐与易燃液体区域的防直击雷与静电接地", "雷击引发火灾后的探测与消防响应"], ds: [], keywords: "雷击|雷电|lightning" },
    ],
  },
];
