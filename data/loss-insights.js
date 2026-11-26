// 有来源的事故损失分析；status区分事实、初步结论、未知与本站分析。
window.LOSS_INSIGHTS = {
  "version": 1,
  "cases": {
    "intl-geelong-refinery-2026-04": {
      "shortTitle": "Geelong 烷基化管线火灾",
      "reviewedAt": "2026-11-26",
      "asOf": "2026-11-26",
      "brief": "Geelong 烷基化管线初判失效起火，受损资产账面核销1,940万澳元，6月预计单元2027年全年停运。",
      "sources": [
        {
          "id": "jun",
          "title": "Viva / ASX：6月23日装置重启及初步原因",
          "url": "https://announcements.asx.com.au/asxpdf/20260623/pdf/070x821h436k83.pdf",
          "date": "2026-06-23"
        },
        {
          "id": "half",
          "title": "Viva 2026半年报：附注3、6（第24、26页，公告副本）",
          "url": "https://bulletin.webull.com/qbd/announcement/20260825/499501092/74dd8853014554336d24d70bf9f24595.pdf",
          "date": "2026-08-25"
        },
        {
          "id": "oct",
          "title": "Viva 3Q26经营更新：保险索赔进度（公告副本）",
          "url": "https://newsfile.futunn.com/public/NN-PersistNoticeAttachment/7781/20261022/732_ASX-FTP-3A704665_en-us_0.PDF",
          "date": "2026-10-22"
        },
        {
          "id": "apr",
          "title": "Viva：事故后产能及人员情况",
          "url": "https://www.vivaenergy.com.au/media/news/2026/geelong-refinery-incident-update",
          "date": "2026-04-20"
        },
        {
          "id": "epa",
          "title": "维州 EPA：事故调查及2026/27夏季汽油豁免",
          "url": "https://www.epa.vic.gov.au/viva-energy-oil-refinery-fire",
          "date": "2026-11"
        },
        {
          "id": "ws",
          "title": "WorkSafe：启动调查，初报未有员工受伤",
          "url": "https://www.worksafe.vic.gov.au/news/2026-04/worksafe-responds-geelong-oil-refinery-fire",
          "date": "2026-04-16"
        },
        {
          "id": "abc",
          "title": "ABC：火灾现场与持续时间",
          "url": "https://www.abc.net.au/news/2026-04-17/geelong-refinery-fire-visual-explainer/106571216",
          "date": "2026-04-17"
        }
      ],
      "fields": {
        "equipment": {
          "value": "汽油联合装置内的烷基化单元管线；尚未公开具体管段编号、材质和尺寸。",
          "status": "preliminary",
          "sources": [
            "jun"
          ]
        },
        "failure": {
          "value": "公司6月初步判断为一段管线失效，燃料逸出后着火；不是已确认的蒸馏塔本体首先失效。",
          "status": "preliminary",
          "sources": [
            "jun"
          ]
        },
        "severity": {
          "value": "装置级严重财产损失并伴随长期营业中断；这是基于停运与核销事实的本站分析，不是法定事故等级。",
          "status": "analysis",
          "sources": [
            "half",
            "jun"
          ]
        },
        "casualties": {
          "value": "公司称现场人员均安全；WorkSafe 4月16日初报未有员工受伤。",
          "status": "reported",
          "sources": [
            "apr",
            "ws"
          ]
        },
        "directCause": {
          "value": "燃料由失效管线逸出并着火；具体点火源未在所查公司公告中说明。",
          "status": "preliminary",
          "sources": [
            "jun"
          ]
        },
        "rootCause": {
          "value": "管线为何失效尚无在本次查阅资料中核实的最终结论；腐蚀、材料缺陷或超压均不能直接定案。",
          "status": "unknown",
          "sources": [
            "jun",
            "epa"
          ]
        },
        "human": {
          "value": "未查到将操作失误或维护推迟认定为本次根因的最终报告；不能把维护争议直接写成人为致因。",
          "status": "unknown",
          "sources": [
            "jun",
            "epa"
          ]
        },
        "damage": {
          "value": "2026半年报披露：受损炼油资产账面净值1,940万澳元已核销；这是账面核销金额，不是总损失或重置修复报价。",
          "status": "confirmed",
          "sources": [
            "half"
          ]
        },
        "interruption": {
          "value": "4月公告汽油产能约60%、柴油与航煤约80%；6月RCCU及关联单元重启后预计主要产出超过90%。烷基化单元仍隔离，6月预计2027年全年不投运。",
          "status": "reported",
          "sources": [
            "apr",
            "jun"
          ]
        },
        "recovery": {
          "value": "10月22日公告仍在推进财产损失及营业中断索赔；11月 EPA 页面披露火灾受损设备影响2026/27夏季汽油规格，获蒸气压限值豁免。恢复炼厂主要产出不等于修复烷基化单元。",
          "status": "reported",
          "sources": [
            "oct",
            "epa"
          ]
        },
        "insurance": {
          "value": "公司有财产损失及营业中断保险；6月30日未确认保险回收，10月仍在理赔。所查资料未披露最终赔付或总事故损失。",
          "status": "reported",
          "sources": [
            "half",
            "oct"
          ]
        }
      },
      "lossAmounts": [
        {
          "amount": 19400000,
          "currency": "AUD",
          "type": "asset_writeoff",
          "label": "受损资产账面净值核销",
          "asOf": "2026-06-30",
          "source": "half",
          "scope": "不含已量化的全期营业中断；不能当作总损失、重置成本或保险赔款。"
        }
      ],
      "timeline": [
        {
          "date": "2026-04-15",
          "text": "当晚发生火灾，次日中午扑灭，持续约13小时。",
          "sources": [
            "abc"
          ],
          "status": "reported"
        },
        {
          "date": "2026-04-20",
          "text": "公司披露汽油产能约60%，柴油与航煤约80%。",
          "sources": [
            "apr"
          ],
          "status": "reported"
        },
        {
          "date": "2026-06-23",
          "text": "RCCU及关联单元重启；初判为烷基化管线失效，预计2027年全年缺少烷基化单元。",
          "sources": [
            "jun"
          ],
          "status": "preliminary"
        },
        {
          "date": "2026-08-25",
          "text": "半年报确认6月末资产账面核销1,940万澳元，尚未确认保险回收。",
          "sources": [
            "half"
          ],
          "status": "confirmed"
        },
        {
          "date": "2026-10-22",
          "text": "公司仍在推进财损及营业中断保险索赔。",
          "sources": [
            "oct"
          ],
          "status": "reported"
        },
        {
          "date": "2026-11",
          "text": "EPA公布2026/27夏季汽油蒸气压限值豁免，关联火灾受损生产设备。",
          "sources": [
            "epa"
          ],
          "status": "reported"
        }
      ],
      "facets": {
        "process": [
          "refinery",
          "alkylation"
        ],
        "equipment": [
          "piping"
        ],
        "mechanism": [
          "loss_of_containment"
        ],
        "consequence": [
          "fire",
          "business_interruption"
        ],
        "human": []
      },
      "questions": [
        "失效管段具体材质、厚度、检验覆盖与断口结论是什么？",
        "从泄漏到隔离持续多久，存量燃料和邻近设备暴露如何放大损失？",
        "恢复主要产量之后，产品结构、辛烷值调和和替代原料成本损失持续多久？"
      ],
      "takeaways": [
        "应把资产重建周期与炼厂恢复主要产量的日期分开评估，否则会低估营业中断尾部。",
        "核查管段级机械完整性及紧急隔离能力，但在调查结束前不把其他案件的腐蚀原因套用到本案。",
        "以账面核销、修复成本、营业中断和保险赔款四种口径分别建账，避免把未定金额相加。"
      ],
      "related": [
        {
          "id": "intl-pes-alkylation-2019-06",
          "facets": [
            "process",
            "equipment",
            "mechanism",
            "consequence"
          ],
          "reason": "同为烷基化单元管件失效、失去密闭后发生火灾。",
          "difference": "PES已查明HF腐蚀；Geelong根因尚未核实，不能迁移同一腐蚀结论。"
        },
        {
          "id": "intl-chevron-richmond-2012-08",
          "facets": [
            "equipment",
            "mechanism",
            "consequence"
          ],
          "reason": "同为炼厂工艺管线失去密闭、可燃介质释放后起火。",
          "difference": "Richmond发生在原油装置且硫化腐蚀已获调查确认，本案是烷基化单元。"
        },
        {
          "id": "asia-india-mrpl-2026-09",
          "facets": [
            "process",
            "mechanism",
            "consequence"
          ],
          "reason": "炼油装置设备边界破裂引发火灾，可对比隔离、应急和损失扩展。",
          "difference": "MRPL是高压冷分离器，不是管线；其伤亡、停产与本案不同。"
        }
      ]
    },
    "intl-pes-alkylation-2019-06": {
      "shortTitle": "PES 烷基化弯头破裂",
      "reviewedAt": "2026-11-26",
      "asOf": "2022-10-11",
      "brief": "PES 烷基化单元腐蚀弯头破裂，引发HF释放、火灾和爆炸，CSB引述财产损失估计7.5亿美元。",
      "sources": [
        {
          "id": "csb",
          "title": "CSB：PES最终调查报告发布",
          "url": "https://www.csb.gov/csb-releases-final-report-into-2019-pes-fire-and-explosion-in-philadelphia/",
          "date": "2022-10-11"
        },
        {
          "id": "report",
          "title": "CSB：PES最终报告PDF",
          "url": "https://www.csb.gov/file.aspx?DocumentId=6202",
          "date": "2022-10-11"
        }
      ],
      "fields": {
        "equipment": {
          "value": "HF烷基化单元的一只碳钢管道弯头。",
          "status": "confirmed",
          "sources": [
            "csb"
          ]
        },
        "failure": {
          "value": "弯头局部腐蚀减薄后破裂，工艺介质失去密闭。",
          "status": "confirmed",
          "sources": [
            "csb"
          ]
        },
        "directCause": {
          "value": "HF及可燃工艺介质释放，引发火灾与后续爆炸。",
          "status": "confirmed",
          "sources": [
            "csb"
          ]
        },
        "rootCause": {
          "value": "调查确认弯头腐蚀速度高于其他管件，检验方案未有效识别这一薄弱环节。",
          "status": "confirmed",
          "sources": [
            "csb"
          ]
        },
        "human": {
          "value": "调查指向机械完整性管理、检验及安全防护的系统缺口；不简化为某个操作员失误。",
          "status": "confirmed",
          "sources": [
            "csb"
          ]
        },
        "severity": {
          "value": "大规模火灾爆炸并有重型碎片飞出厂界，严重财产损失。",
          "status": "reported",
          "sources": [
            "csb"
          ]
        },
        "damage": {
          "value": "CSB引述估计财产损失7.5亿美元；这是估计财损，不是账面核销或保险赔款。",
          "status": "reported",
          "sources": [
            "csb"
          ]
        },
        "recovery": {
          "value": "2022年10月11日CSB发布最终调查报告并提出机械完整性、隔离和防护等建议。",
          "status": "confirmed",
          "sources": [
            "csb"
          ]
        }
      },
      "lossAmounts": [
        {
          "amount": 750000000,
          "currency": "USD",
          "type": "estimated_property_damage",
          "label": "估计财产损失",
          "asOf": "2022-10-11",
          "source": "csb",
          "scope": "CSB引述损失估计，不含已确认的总营业中断；不是赔款。"
        }
      ],
      "facets": {
        "process": [
          "refinery",
          "alkylation"
        ],
        "equipment": [
          "piping"
        ],
        "mechanism": [
          "loss_of_containment",
          "corrosion"
        ],
        "consequence": [
          "fire",
          "explosion"
        ],
        "human": [
          "integrity_management"
        ]
      },
      "takeaways": [
        "对关键管件逐件检验，不能只以同一回路其他测点代表薄弱弯头。",
        "隔离阀、控制系统及电缆应考虑火灾与飞射物暴露。"
      ]
    },
    "intl-chevron-richmond-2012-08": {
      "shortTitle": "Richmond 原油管线火灾",
      "reviewedAt": "2026-11-26",
      "asOf": "2015-01-28",
      "brief": "Chevron Richmond 原油装置管线因硫化腐蚀减薄破裂，释放可燃蒸气并引发火灾。",
      "sources": [
        {
          "id": "csb",
          "title": "CSB：Chevron Richmond调查与最终报告",
          "url": "https://www.csb.gov/chevron-richmond-refinery-fire/",
          "date": "2015-01-28"
        },
        {
          "id": "mi",
          "title": "CSB：机械完整性调查结论汇总",
          "url": "https://www.csb.gov/recommendations/csb-investigations-mechanical-integrity/",
          "date": ""
        }
      ],
      "fields": {
        "equipment": {
          "value": "4号原油装置的4-sidecut工艺管线。",
          "status": "confirmed",
          "sources": [
            "csb"
          ]
        },
        "failure": {
          "value": "局部硫化腐蚀导致严重壁厚减薄及管线破裂。",
          "status": "confirmed",
          "sources": [
            "csb"
          ]
        },
        "directCause": {
          "value": "可燃介质释放形成蒸气云并起火。",
          "status": "confirmed",
          "sources": [
            "csb"
          ]
        },
        "rootCause": {
          "value": "低硅管段腐蚀更快，基于其他管件的测厚不能代表最薄弱部位；材料升级与全面检验措施未充分落实。",
          "status": "confirmed",
          "sources": [
            "mi"
          ]
        },
        "human": {
          "value": "已确认机械完整性及管理决策缺口，属于组织和检验体系问题，不能仅归为一线操作失误。",
          "status": "confirmed",
          "sources": [
            "mi"
          ]
        },
        "severity": {
          "value": "炼厂重大工艺火灾；此处不替代监管机构事故分级。",
          "status": "reported",
          "sources": [
            "csb"
          ]
        },
        "damage": {
          "value": "本次所查CSB来源未用于确认总财损金额，不填估计值。",
          "status": "unknown",
          "sources": [
            "csb"
          ]
        },
        "recovery": {
          "value": "CSB调查已完成，建议针对易硫化腐蚀的管件检验和材料替换。",
          "status": "confirmed",
          "sources": [
            "csb"
          ]
        }
      },
      "facets": {
        "process": [
          "refinery",
          "crude_distillation"
        ],
        "equipment": [
          "piping"
        ],
        "mechanism": [
          "loss_of_containment",
          "corrosion"
        ],
        "consequence": [
          "fire"
        ],
        "human": [
          "integrity_management"
        ]
      },
      "takeaways": [
        "以材料和损伤机理为基础确定检验范围，避免用非薄弱件的测厚替代判断。",
        "将带泄漏运行、停机隔离决策和检验建议落实纳入机械完整性管理。"
      ]
    },
    "asia-india-mrpl-2026-09": {
      "shortTitle": "MRPL 高压分离器破裂",
      "reviewedAt": "2026-11-26",
      "asOf": "2026-10-01",
      "sources": [
        {
          "id": "ogj",
          "title": "OGJ引述MRPL交易所披露",
          "url": "https://www.ogj.com/refining-processing/news/55408956/mrpl-refinery-fire-at-coker-adjacent-plant-kills-one-injures-another",
          "date": "2026-10-01"
        }
      ],
      "fields": {
        "equipment": {
          "value": "延迟焦化瓦斯油加氢处理装置的高压冷分离器。",
          "status": "reported",
          "sources": [
            "ogj"
          ]
        },
        "failure": {
          "value": "高压冷分离器破裂，随后起火；压力容器失效不同于工艺管线失效。",
          "status": "reported",
          "sources": [
            "ogj"
          ]
        },
        "casualties": {
          "value": "公司后续披露1人死亡、1人烧伤；早期“轻伤”消息不代表最终情况。",
          "status": "reported",
          "sources": [
            "ogj"
          ]
        },
        "directCause": {
          "value": "已知分离器破裂与随后火灾；破裂机理未披露。",
          "status": "reported",
          "sources": [
            "ogj"
          ]
        },
        "rootCause": {
          "value": "公司未披露分离器破裂原因，不将氢损伤、腐蚀或超压当作已确认结论。",
          "status": "unknown",
          "sources": [
            "ogj"
          ]
        },
        "human": {
          "value": "未披露可支持人为或组织致因认定的调查结论。",
          "status": "unknown",
          "sources": [
            "ogj"
          ]
        },
        "damage": {
          "value": "未披露装置损坏范围和总损失金额。",
          "status": "unknown",
          "sources": [
            "ogj"
          ]
        },
        "interruption": {
          "value": "公司已隔离受影响单元；是否影响全厂产量未披露。",
          "status": "reported",
          "sources": [
            "ogj"
          ]
        },
        "recovery": {
          "value": "当日12:20开始，14:47完全扑灭；最终调查与复产日期待核实。",
          "status": "reported",
          "sources": [
            "ogj"
          ]
        },
        "severity": {
          "value": "有死亡并发生高压设备破裂火灾；没有足够资料作统一财损等级评分。",
          "status": "reported",
          "sources": [
            "ogj"
          ]
        }
      },
      "facets": {
        "process": [
          "refinery",
          "hydrotreating"
        ],
        "equipment": [
          "pressure_vessel"
        ],
        "mechanism": [
          "loss_of_containment"
        ],
        "consequence": [
          "fire"
        ],
        "human": []
      }
    },
    "cn-shanghai-waste-gas-tank-2026-09": {
      "shortTitle": "上海化学工业区一企业废气罐泄压时罐体受损，少",
      "basis": "结构化自原条目公开报道，未在本轮复核最新进展",
      "sources": [
        {
          "id": "entry",
          "name": "光明网（2026-09-24）",
          "url": "https://m.gmw.cn/2026-09/24/content_1304567619.htm"
        }
      ],
      "fields": {
        "equipment": {
          "value": "废气罐",
          "status": "reported",
          "sources": [
            "entry"
          ]
        },
        "failure": {
          "value": "泄压过程中罐体破损，残余气体泄漏；无明火。",
          "status": "reported",
          "sources": [
            "entry"
          ]
        },
        "severity": {
          "value": "原报道未提供可比较的财产损失等级；人员、设备和停产后果分别列示。",
          "status": "unknown",
          "sources": []
        },
        "rootCause": {
          "value": "原条目未提供可据以确定根因的最终调查结论。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "human": {
          "value": "原条目未提供足以区分个人操作、管理、设计及检验责任的最终结论。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "recovery": {
          "value": "最新调查、修复和复产状态待后续来源补充。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "casualties": {
          "value": "未报告人员伤亡；原报道称未对周边环境造成影响。",
          "status": "reported",
          "sources": [
            "entry"
          ]
        }
      },
      "facets": {
        "process": [],
        "equipment": [
          "tank"
        ],
        "mechanism": [
          "loss_of_containment"
        ],
        "consequence": [
          "gas_release"
        ],
        "human": []
      }
    },
    "cn-gansu-jinte-hydrogenation-2026-04": {
      "shortTitle": "甘肃玉门金特化学加氢装置闪爆，3死2伤",
      "basis": "结构化自原条目公开报道，未在本轮复核最新进展",
      "sources": [
        {
          "id": "entry",
          "name": "澎湃新闻",
          "url": "https://m.thepaper.cn/newsDetail_forward_32921983"
        }
      ],
      "fields": {
        "equipment": {
          "value": "1,8-二氨基萘生产车间的加氢反应釜",
          "status": "reported",
          "sources": [
            "entry"
          ]
        },
        "failure": {
          "value": "应急管理部初步分析指向加氢反应釜超压，具体原因仍在调查。",
          "status": "reported",
          "sources": [
            "entry"
          ]
        },
        "severity": {
          "value": "原报道未提供可比较的财产损失等级；人员、设备和停产后果分别列示。",
          "status": "unknown",
          "sources": []
        },
        "rootCause": {
          "value": "原条目未提供可据以确定根因的最终调查结论。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "human": {
          "value": "原条目未提供足以区分个人操作、管理、设计及检验责任的最终结论。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "recovery": {
          "value": "最新调查、修复和复产状态待后续来源补充。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "casualties": {
          "value": "3人死亡、2人轻伤。",
          "status": "reported",
          "sources": [
            "entry"
          ]
        }
      },
      "facets": {
        "process": [],
        "equipment": [
          "reactor"
        ],
        "mechanism": [
          "overpressure"
        ],
        "consequence": [
          "fire",
          "explosion"
        ],
        "human": []
      }
    },
    "cn-inner-mongolia-nitration-2026-03": {
      "shortTitle": "内蒙古利元科技硝化车间爆炸，2人死亡3人受伤",
      "basis": "结构化自原条目公开报道，未在本轮复核最新进展",
      "sources": [
        {
          "id": "entry",
          "name": "中国新闻周刊网",
          "url": "http://www.inewsweek.cn/society/2026-03-20/29416.shtml"
        }
      ],
      "fields": {
        "equipment": {
          "value": "硝化车间；具体最先失效的设备未明确",
          "status": "reported",
          "sources": [
            "entry"
          ]
        },
        "failure": {
          "value": "发生爆炸；不能只凭黄色烟雾认定反应失控根因。",
          "status": "reported",
          "sources": [
            "entry"
          ]
        },
        "severity": {
          "value": "原报道未提供可比较的财产损失等级；人员、设备和停产后果分别列示。",
          "status": "unknown",
          "sources": []
        },
        "rootCause": {
          "value": "原条目未提供可据以确定根因的最终调查结论。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "human": {
          "value": "原条目未提供足以区分个人操作、管理、设计及检验责任的最终结论。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "recovery": {
          "value": "最新调查、修复和复产状态待后续来源补充。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "casualties": {
          "value": "原条目后续报道为2人死亡、3人受伤。",
          "status": "reported",
          "sources": [
            "entry"
          ]
        }
      },
      "facets": {
        "process": [],
        "equipment": [],
        "mechanism": [],
        "consequence": [
          "explosion"
        ],
        "human": []
      }
    },
    "cn-shanxi-jiapeng-2026-02": {
      "shortTitle": "山西朔州佳鹏生物非法生产窝点爆炸，8死3伤，",
      "basis": "结构化自原条目公开报道，未在本轮复核最新进展",
      "sources": [
        {
          "id": "entry",
          "name": "界面新闻",
          "url": "https://www.jiemian.com/article/13991622.html"
        }
      ],
      "fields": {
        "equipment": {
          "value": "非法生产2-硝基-3-甲基苯甲酸的车间；具体设备未明确",
          "status": "reported",
          "sources": [
            "entry"
          ]
        },
        "failure": {
          "value": "非法生产过程中发生爆炸；具体失效机理未明确。",
          "status": "reported",
          "sources": [
            "entry"
          ]
        },
        "severity": {
          "value": "原报道未提供可比较的财产损失等级；人员、设备和停产后果分别列示。",
          "status": "unknown",
          "sources": []
        },
        "rootCause": {
          "value": "原条目未提供可据以确定根因的最终调查结论。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "human": {
          "value": "原条目未提供足以区分个人操作、管理、设计及检验责任的最终结论。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "recovery": {
          "value": "最新调查、修复和复产状态待后续来源补充。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "casualties": {
          "value": "8人死亡、3人受伤，原通报有国务院安委办挂牌督办。",
          "status": "reported",
          "sources": [
            "entry"
          ]
        }
      },
      "facets": {
        "process": [],
        "equipment": [],
        "mechanism": [],
        "consequence": [
          "explosion"
        ],
        "human": []
      }
    },
    "cn-ningxia-huayu-2026-04": {
      "shortTitle": "宁夏中卫华御化工脱焦釜爆炸，1死9伤：真空泵",
      "basis": "结构化自原条目公开报道，未在本轮复核最新进展",
      "sources": [
        {
          "id": "entry",
          "name": "澎湃新闻：事故调查报告公布",
          "url": "https://m.thepaper.cn/newsDetail_forward_33805603"
        }
      ],
      "fields": {
        "equipment": {
          "value": "蒸馏脱焦釜及其真空泵",
          "status": "reported",
          "sources": [
            "entry"
          ]
        },
        "failure": {
          "value": "真空泵跳停后用蒸汽处置，釜体超压并伴焦油分解放热，发生爆炸。",
          "status": "reported",
          "sources": [
            "entry"
          ]
        },
        "severity": {
          "value": "原调查报道定性为“一般容器爆炸”生产安全责任事故。",
          "status": "reported",
          "sources": [
            "entry"
          ]
        },
        "rootCause": {
          "value": "原调查报道认定：真空泵跳停后处置不当，蒸汽误入使釜体超压并促进残液分解放热。",
          "status": "reported",
          "sources": [
            "entry"
          ]
        },
        "human": {
          "value": "调查报道包含异常工况处置不当；需要结合调查全文区分操作与管理责任，不从简短报道推断主观故意。",
          "status": "reported",
          "sources": [
            "entry"
          ]
        },
        "recovery": {
          "value": "最新调查、修复和复产状态待后续来源补充。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "damage": {
          "value": "直接经济损失584.78万元人民币，为事故调查口径，不等于单纯设备重置成本。",
          "status": "reported",
          "sources": [
            "entry"
          ]
        },
        "casualties": {
          "value": "1人死亡、9人受伤；原调查报道定为一般容器爆炸责任事故。",
          "status": "reported",
          "sources": [
            "entry"
          ]
        }
      },
      "facets": {
        "process": [],
        "equipment": [
          "reactor",
          "vacuum_pump"
        ],
        "mechanism": [
          "overpressure",
          "decomposition"
        ],
        "consequence": [
          "explosion"
        ],
        "human": []
      },
      "lossAmounts": [
        {
          "amount": 5847800,
          "currency": "CNY",
          "type": "direct_economic_loss",
          "label": "直接经济损失",
          "source": "entry",
          "scope": "原事故调查报道口径，不等于单纯设备修复成本。"
        }
      ]
    },
    "cn-chuzhou-lightning-2026-04": {
      "shortTitle": "安徽滁州一药企车间屋顶环保设施遭雷击起火，火",
      "basis": "结构化自原条目公开报道，未在本轮复核最新进展",
      "sources": [
        {
          "id": "entry",
          "name": "新浪财经：一场雨，烧了车间！汛期企业警惕这些风险",
          "url": "https://finance.sina.com.cn/wm/2026-06-02/doc-inhzyhiy3432317.shtml"
        }
      ],
      "fields": {
        "equipment": {
          "value": "药企三号车间屋顶环保设施和甲苯储存区",
          "status": "reported",
          "sources": [
            "entry"
          ]
        },
        "failure": {
          "value": "原盘点报道为雷击起火，蔓延至甲苯；未见本条所引正式最终报告。",
          "status": "reported",
          "sources": [
            "entry"
          ]
        },
        "severity": {
          "value": "原报道未提供可比较的财产损失等级；人员、设备和停产后果分别列示。",
          "status": "unknown",
          "sources": []
        },
        "rootCause": {
          "value": "原条目未提供可据以确定根因的最终调查结论。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "human": {
          "value": "原条目未提供足以区分个人操作、管理、设计及检验责任的最终结论。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "recovery": {
          "value": "最新调查、修复和复产状态待后续来源补充。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "casualties": {
          "value": "人员伤亡及损失金额未披露。",
          "status": "reported",
          "sources": [
            "entry"
          ]
        }
      },
      "facets": {
        "process": [],
        "equipment": [
          "environmental_equipment"
        ],
        "mechanism": [
          "lightning"
        ],
        "consequence": [
          "fire"
        ],
        "human": []
      }
    },
    "asia-taiwan-tainan-waste-2026-08": {
      "shortTitle": "台南安南区违法堆放铝镁废料起火连环爆炸，15",
      "basis": "结构化自原条目公开报道，未在本轮复核最新进展",
      "sources": [
        {
          "id": "entry",
          "name": "中央社",
          "url": "https://www.cna.com.tw/news/asoc/202608220214.aspx"
        }
      ],
      "fields": {
        "equipment": {
          "value": "含铝镁废料与废油堆放场所",
          "status": "reported",
          "sources": [
            "entry"
          ]
        },
        "failure": {
          "value": "原报道指向降雨及灌救水接触铝镁废料，引发连串爆炸。",
          "status": "reported",
          "sources": [
            "entry"
          ]
        },
        "severity": {
          "value": "原报道未提供可比较的财产损失等级；人员、设备和停产后果分别列示。",
          "status": "unknown",
          "sources": []
        },
        "rootCause": {
          "value": "原条目未提供可据以确定根因的最终调查结论。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "human": {
          "value": "原条目未提供足以区分个人操作、管理、设计及检验责任的最终结论。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "recovery": {
          "value": "最新调查、修复和复产状态待后续来源补充。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "casualties": {
          "value": "15人受伤（含3名消防员）；邻近住宅和救援车辆受损。",
          "status": "reported",
          "sources": [
            "entry"
          ]
        }
      },
      "facets": {
        "process": [],
        "equipment": [],
        "mechanism": [
          "water_reaction"
        ],
        "consequence": [
          "fire",
          "explosion"
        ],
        "human": []
      }
    },
    "asia-india-hazelo-labs-2026-08": {
      "shortTitle": "印度特伦甘纳 Hazelo Lab 制药厂反",
      "basis": "结构化自原条目公开报道，未在本轮复核最新进展",
      "sources": [
        {
          "id": "entry",
          "name": "Telangana Today",
          "url": "https://telanganatoday.com/two-killed-nine-injured-in-reactor-blast-at-pharma-unit-in-bhoodan-pochampally"
        }
      ],
      "fields": {
        "equipment": {
          "value": "制药厂反应釜",
          "status": "reported",
          "sources": [
            "entry"
          ]
        },
        "failure": {
          "value": "反应釜爆炸并起火；超压或过热为报道初步怀疑，未有核实的最终机理。",
          "status": "reported",
          "sources": [
            "entry"
          ]
        },
        "severity": {
          "value": "原报道未提供可比较的财产损失等级；人员、设备和停产后果分别列示。",
          "status": "unknown",
          "sources": []
        },
        "rootCause": {
          "value": "原条目未提供可据以确定根因的最终调查结论。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "human": {
          "value": "原条目未提供足以区分个人操作、管理、设计及检验责任的最终结论。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "recovery": {
          "value": "最新调查、修复和复产状态待后续来源补充。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "casualties": {
          "value": "2人死亡、约9人受伤，媒体统计口径不同。",
          "status": "reported",
          "sources": [
            "entry"
          ]
        }
      },
      "facets": {
        "process": [],
        "equipment": [
          "reactor"
        ],
        "mechanism": [],
        "consequence": [
          "fire",
          "explosion"
        ],
        "human": []
      }
    },
    "asia-daejeon-fire-2026-03": {
      "shortTitle": "韩国大田汽车零部件厂大火：14死60伤，现场",
      "basis": "结构化自原条目公开报道，未在本轮复核最新进展",
      "sources": [
        {
          "id": "entry",
          "name": "The Korea Herald",
          "url": "https://www.koreaherald.com/article/10699845"
        }
      ],
      "fields": {
        "equipment": {
          "value": "汽车发动机气门工厂，涉及生产油污和金属钠存量",
          "status": "reported",
          "sources": [
            "entry"
          ]
        },
        "failure": {
          "value": "厂房起火并向上层蔓延，局部坍塌；不能据金属钠在场就认定其为起火原因。",
          "status": "reported",
          "sources": [
            "entry"
          ]
        },
        "severity": {
          "value": "原报道未提供可比较的财产损失等级；人员、设备和停产后果分别列示。",
          "status": "unknown",
          "sources": []
        },
        "rootCause": {
          "value": "原条目未提供可据以确定根因的最终调查结论。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "human": {
          "value": "原条目未提供足以区分个人操作、管理、设计及检验责任的最终结论。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "recovery": {
          "value": "最新调查、修复和复产状态待后续来源补充。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "casualties": {
          "value": "原条目报道14人死亡、60人受伤。",
          "status": "reported",
          "sources": [
            "entry"
          ]
        }
      },
      "facets": {
        "process": [],
        "equipment": [],
        "mechanism": [],
        "consequence": [
          "fire",
          "collapse"
        ],
        "human": []
      }
    },
    "asia-india-vj-sai-2026-02": {
      "shortTitle": "印度 VJ Sai 化学实验室反应釜区爆炸起",
      "basis": "结构化自原条目公开报道，未在本轮复核最新进展",
      "sources": [
        {
          "id": "entry",
          "name": "Siasat",
          "url": "https://www.siasat.com/man-charred-to-death-in-telangana-chemical-company-lab-explosion-3372730/"
        }
      ],
      "fields": {
        "equipment": {
          "value": "化学实验室D区反应釜及桶装溶剂加料作业",
          "status": "reported",
          "sources": [
            "entry"
          ]
        },
        "failure": {
          "value": "原报道记录加注溶剂时爆炸起火；具体点火源与静电等原因未获确认。",
          "status": "reported",
          "sources": [
            "entry"
          ]
        },
        "severity": {
          "value": "原报道未提供可比较的财产损失等级；人员、设备和停产后果分别列示。",
          "status": "unknown",
          "sources": []
        },
        "rootCause": {
          "value": "原条目未提供可据以确定根因的最终调查结论。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "human": {
          "value": "原条目未提供足以区分个人操作、管理、设计及检验责任的最终结论。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "recovery": {
          "value": "最新调查、修复和复产状态待后续来源补充。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "casualties": {
          "value": "1名化学师死亡。",
          "status": "reported",
          "sources": [
            "entry"
          ]
        }
      },
      "facets": {
        "process": [],
        "equipment": [
          "reactor"
        ],
        "mechanism": [],
        "consequence": [
          "fire",
          "explosion"
        ],
        "human": []
      }
    },
    "asia-thailand-floods-2026-09": {
      "shortTitle": "泰国洪灾冲击工业区：安美德城春武里堤坝溃决，",
      "basis": "结构化自原条目公开报道，未在本轮复核最新进展",
      "sources": [
        {
          "id": "entry",
          "name": "The Nation：Floods hit 4,635 businesses",
          "url": "https://www.nationthailand.com/business/economy/40072248"
        }
      ],
      "fields": {
        "equipment": {
          "value": "工业园区堤坝、厂房和生产设施",
          "status": "reported",
          "sources": [
            "entry"
          ]
        },
        "failure": {
          "value": "洪水及土堤溃决导致工业设施受灾；不是单一化工设备事故。",
          "status": "reported",
          "sources": [
            "entry"
          ]
        },
        "severity": {
          "value": "原报道未提供可比较的财产损失等级；人员、设备和停产后果分别列示。",
          "status": "unknown",
          "sources": []
        },
        "rootCause": {
          "value": "原条目未提供可据以确定根因的最终调查结论。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "human": {
          "value": "原条目未提供足以区分个人操作、管理、设计及检验责任的最终结论。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "recovery": {
          "value": "最新调查、修复和复产状态待后续来源补充。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "damage": {
          "value": "工业部初步统计总损失182.1亿泰铢，覆盖59府4,635家企业；非单厂或单一设备财损。",
          "status": "reported",
          "sources": [
            "entry"
          ]
        },
        "casualties": {
          "value": "工业部初步统计4,635家企业受灾，损失口径覆盖多企业。",
          "status": "reported",
          "sources": [
            "entry"
          ]
        }
      },
      "facets": {
        "process": [],
        "equipment": [],
        "mechanism": [
          "flood"
        ],
        "consequence": [
          "flood_damage",
          "business_interruption"
        ],
        "human": []
      },
      "lossAmounts": [
        {
          "amount": 18210000000,
          "currency": "THB",
          "type": "multi_enterprise_estimate",
          "label": "多企业初步损失统计",
          "source": "entry",
          "scope": "覆盖59府4,635家企业，不可用于单个工厂损失比较。"
        }
      ]
    },
    "asia-kumamoto-quake-2026-07": {
      "shortTitle": "日本熊本7.1级地震：日本制纸八代工厂烟囱倒",
      "basis": "结构化自原条目公开报道，未在本轮复核最新进展",
      "sources": [
        {
          "id": "entry",
          "name": "Nikkei Asia",
          "url": "https://asia.nikkei.com/economy/natural-disasters/kumamoto-quake-disrupts-tsmc-toyota-operations-in-southern-japan"
        }
      ],
      "fields": {
        "equipment": {
          "value": "制纸厂烟囱及半导体、汽车等工业设施",
          "status": "reported",
          "sources": [
            "entry"
          ]
        },
        "failure": {
          "value": "地震导致烟囱倒塌及多家工厂停产；应区分个体设施损失与地区停产。",
          "status": "reported",
          "sources": [
            "entry"
          ]
        },
        "severity": {
          "value": "原报道未提供可比较的财产损失等级；人员、设备和停产后果分别列示。",
          "status": "unknown",
          "sources": []
        },
        "rootCause": {
          "value": "原条目未提供可据以确定根因的最终调查结论。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "human": {
          "value": "原条目未提供足以区分个人操作、管理、设计及检验责任的最终结论。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "recovery": {
          "value": "最新调查、修复和复产状态待后续来源补充。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "casualties": {
          "value": "原条目报道制纸厂烟囱倒塌致9人死亡。",
          "status": "reported",
          "sources": [
            "entry"
          ]
        }
      },
      "facets": {
        "process": [],
        "equipment": [
          "chimney"
        ],
        "mechanism": [
          "earthquake"
        ],
        "consequence": [
          "collapse",
          "business_interruption"
        ],
        "human": []
      }
    },
    "intl-mexico-jaltipan-2026-09": {
      "shortTitle": "墨西哥韦拉克鲁斯 Jáltipan 盐矿卤水",
      "basis": "结构化自原条目公开报道，未在本轮复核最新进展",
      "sources": [
        {
          "id": "entry",
          "name": "Proceso",
          "url": "https://www.proceso.com.mx/nacional/estados/2026/9/15/explosion-en-jaltipan-veracruz-suman-tres-muertos-tras-incendio-en-planta-de-pmv-minera-379967.html"
        }
      ],
      "fields": {
        "equipment": {
          "value": "盐矿卤水井",
          "status": "reported",
          "sources": [
            "entry"
          ]
        },
        "failure": {
          "value": "卤水井爆炸起火；不能把未经最终调查确认的气体来源或点火原因写定。",
          "status": "reported",
          "sources": [
            "entry"
          ]
        },
        "severity": {
          "value": "原报道未提供可比较的财产损失等级；人员、设备和停产后果分别列示。",
          "status": "unknown",
          "sources": []
        },
        "rootCause": {
          "value": "原条目未提供可据以确定根因的最终调查结论。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "human": {
          "value": "原条目未提供足以区分个人操作、管理、设计及检验责任的最终结论。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "recovery": {
          "value": "最新调查、修复和复产状态待后续来源补充。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "casualties": {
          "value": "原条目报道3人死亡。",
          "status": "reported",
          "sources": [
            "entry"
          ]
        }
      },
      "facets": {
        "process": [],
        "equipment": [
          "well"
        ],
        "mechanism": [],
        "consequence": [
          "fire",
          "explosion"
        ],
        "human": []
      }
    },
    "intl-institute-wv-2026-04": {
      "shortTitle": "美国西弗吉尼亚 Institute 催化剂工",
      "basis": "结构化自原条目公开报道，未在本轮复核最新进展",
      "sources": [
        {
          "id": "entry",
          "name": "CSB 调查进展（PDF）",
          "url": "https://www.csb.gov/assets/1/6/final_investigation_update_catalyst_refiners_.pdf"
        }
      ],
      "fields": {
        "equipment": {
          "value": "催化剂工厂退役作业涉及的化学品及设备",
          "status": "reported",
          "sources": [
            "entry"
          ]
        },
        "failure": {
          "value": "退役作业中发生化学反应并释放硫化氢；设备边界和加料细节待核实。",
          "status": "reported",
          "sources": [
            "entry"
          ]
        },
        "severity": {
          "value": "原报道未提供可比较的财产损失等级；人员、设备和停产后果分别列示。",
          "status": "unknown",
          "sources": []
        },
        "rootCause": {
          "value": "原条目未提供可据以确定根因的最终调查结论。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "human": {
          "value": "原条目未提供足以区分个人操作、管理、设计及检验责任的最终结论。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "recovery": {
          "value": "最新调查、修复和复产状态待后续来源补充。",
          "status": "unknown",
          "sources": [
            "entry"
          ]
        },
        "casualties": {
          "value": "原条目报道2人死亡。",
          "status": "reported",
          "sources": [
            "entry"
          ]
        }
      },
      "facets": {
        "process": [],
        "equipment": [],
        "mechanism": [
          "incompatible_reaction"
        ],
        "consequence": [
          "toxic_release"
        ],
        "human": []
      }
    }
  }
};
