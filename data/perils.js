/*
 * 事故起因分类（参照 FM 损失预防的风险划分：火灾与爆炸、设备风险、自然灾害）
 * ------------------------------------------------------------
 * 精选新闻在 data/news.js 中用 causes 字段标注，例如：
 *   causes: [{ peril: "equipment", cause: "pressure" }, { peril: "fire", cause: "gas" }]
 * 第一项为主因，其余为次因（诱发或后果）。
 * 自动抓取的实时动态按标题关键词归类（keywords），仅供参考。
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
      { id: "runaway", name: "反应失控与分解爆炸", ds: ["7-46", "7-49"], keywords: "反应釜|失控|硝化|分解|runaway|reactor" },
      { id: "gas", name: "可燃气体/蒸气泄漏爆炸", ds: ["7-42", "7-91", "7-17"], keywords: "闪爆|燃气|氢气|天然气|液化气|gas explosion|vapor cloud|vapour cloud|hydrogen|LPG" },
      { id: "liquid", name: "易燃液体火灾", ds: ["7-32", "7-88"], keywords: "油罐|储罐|溶剂|甲苯|柴油|tank fire|solvent|fuel|diesel" },
      { id: "reactive", name: "遇水/不相容化学品反应", ds: ["7-43"], keywords: "中毒|有毒|遇水|不相容|硫化氢|toxic|hydrogen sulfide|chemical reaction" },
      { id: "dust", name: "粉尘爆炸", ds: ["7-76"], keywords: "粉尘|dust" },
      { id: "general", name: "一般可燃物与建筑火灾", ds: ["10-1"], keywords: "厂房|仓库|车间火灾|warehouse|factory fire|building" },
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
      { id: "pressure", name: "压力容器/储罐超压或破裂", ds: ["7-49", "7-88"], keywords: "超压|破裂|爆管|容器爆炸|罐体|rupture|overpressur|vessel|separator" },
      { id: "controls", name: "仪表、控制与辅助系统失效", ds: ["7-45", "7-110"], keywords: "跳停|停电|仪表|控制系统|联锁|真空泵|power outage|power failure|trip|control system" },
      { id: "integrity", name: "腐蚀与机械完整性（泄漏、管道破裂）", ds: ["7-43"], keywords: "腐蚀|管道|管线|穿孔|corrosion|pipeline|pipe|equipment failure" },
      { id: "machinery", name: "转动设备故障（压缩机、泵、透平）", ds: [], keywords: "压缩机|机组|透平|compressor|turbine|pump failure" },
      { id: "electrical", name: "电气设备故障（变压器、配电）", ds: ["5-4"], keywords: "变压器|配电|电气|短路|transformer|electrical|short circuit" },
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
      { id: "flood", name: "洪水与暴雨", ds: ["1-40"], keywords: "洪水|洪涝|暴雨|内涝|受淹|降雨|flood|inundat|heavy rain" },
      { id: "wind", name: "台风与强风", ds: ["1-28"], keywords: "台风|强风|飓风|龙卷|typhoon|hurricane|cyclone|tornado" },
      { id: "quake", name: "地震", ds: ["1-2"], keywords: "地震|海啸|earthquake|quake|tsunami" },
      { id: "lightning", name: "雷击", ds: [], keywords: "雷击|雷电|lightning" },
    ],
  },
];
