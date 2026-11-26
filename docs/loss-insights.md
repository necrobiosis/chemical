# 损失洞察与蜘蛛网

每条新闻有一句话总结。事故类新闻和速报使用统一洞察结构；非事故行业动态明确说明设备故障与事故损失不适用。数据位于 `data/loss-insights.js`（`window.LOSS_INSIGHTS.cases`），键为稳定新闻ID。速报也可在 `FM_NOTES` 或 `fm` 对象内提供 `insights`。来源复核的案例库优先于自动速报。

## 必须回答的字段

`fields` 包含 equipment、failure、severity、casualties、directCause、rootCause、human、damage、interruption、recovery、insurance。每项是 `{value, status, sources:[来源ID]}`。来源清单为 `sources:[{id,title,url,date}]`；`reviewedAt`为实际复核日，`asOf`为所查资料截止日，两者不同。

状态：confirmed 已确认；reported 来源披露；preliminary 初步结论；unknown 未核实；analysis 工程分析。把异常现象、直接起因、根因和组织因素分开；不得从设备老化、维护争议或相似案例直接认定根因。失效设备与受火损设备也不能混淆。

## 金额与进展

`lossAmounts`每笔必须有 amount、currency、type、label、source、scope，可有 asOf。类型分别为资产账面核销、修复成本、直接经济损失、估计财损、营业中断、保险实赔或多企业统计。原币种展示，不自动折算或相加；限额、市场价值和利润均不能冒充事故总损失。没有可靠数值保留unknown，不填0。

`timeline:[{date,text,sources,status}]`按披露日记录真实进展；预期复产必须说明是当时预计，不能改写为已实现。`questions`说明尚需什么证据；`takeaways`是工程分析，不能混入已知事实。

## 案例网络

`facets`按已知事实列 process、equipment、mechanism、consequence、human 标签。未查明腐蚀机理的案例不得标记corrosion。`related`可人工指定最多3例：`{id,facets,reason,difference}`。未人工指定时按已有标签匹配，界面明确标记自动匹配待复核；无相近案件时不强行推荐。数字权重只用于内部排序，不向用户虚构相似度百分比或严重度雷达评分。

蜘蛛网的中心为当前案件，六个维度连接具体事实；外圈最多3例通过共有条件连接。点击维度显示证据，点击案件切换中心。连线表示类比，不表示案件互相导致，也不证明同一根因。

Geelong示例核实到烷基化管线初步失效、1,940万澳元资产账面核销、主要产出恢复与单元长期隔离的差别；最终总损失、人为归因和最终赔款仍未核实。

## 更新与检查

修改数据后运行 `node tests/loss-model.test.cjs`、`node scripts/export-daily-data.mjs`。两个仓库的数据与自动速报schema需同步维护；A保留原08:17，B保留20:17，不新增付费调用或更改调度。未配置模型API时照常显示可核实的已有报道和unknown字段，不伪装成已完成深度分析。
