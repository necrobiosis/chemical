// 可选：用 Claude 从 FM 防损角度总结重大动态（需在 GitHub Secrets 配置 ANTHROPIC_API_KEY）。
// 输入原文正文，输出中文事故概况、防损要点和相关 Data Sheet；同时判断是否真的是事故/损失事件，
// 用于剔除被关键词误判为“重大”的条目（如网站检查通报）。

const DS = ["7-43", "7-14", "7-45", "7-46", "7-49", "7-59", "7-32", "7-88", "7-55", "7-42", "7-17", "7-76", "7-36", "7-91", "7-99", "7-110", "5-4", "1-40", "1-2", "1-28", "10-1"];

const SYSTEM = `你是 FM（财产损失预防）亚洲化工领域的资深工程师，为同事撰写事故速报。
只根据提供的报道原文写作，不补充原文没有的事实；原文没写清楚的（原因、伤亡、损失）就说“报道未说明”。
读者是做化工厂财产风险评估的工程师，关注：发生了什么、在哪套装置/设备、损失规模、可能的起因，以及对类似客户检查有什么启示。`;

const SCHEMA = {
  type: "object",
  properties: {
    is_loss_event: {
      type: "boolean",
      description: "报道是否描述一起具体的事故、火灾、爆炸、泄漏、自然灾害损失，或事故调查报告的发布/更新；政策会议、网站检查、股价、赔偿公告等为 false",
    },
    summary: { type: "string", description: "事故概况，中文 2–3 句：时间、地点、企业/装置、经过、伤亡与损失" },
    points: {
      type: "array",
      items: { type: "string" },
      description: "FM 防损视角要点，中文 3 条，每条一句：可能的起因与损失扩大因素，以及检查类似客户时应关注什么",
    },
    refs: { type: "array", items: { type: "string", enum: DS }, description: "相关的 FM Data Sheet 编号，0–3 个" },
    report: {
      description: "仅当报道是关于调查报告、事故报告、调查进展或统计通报的发布或更新时填写，总结报告本身的内容；否则为 null",
      anyOf: [
        {
          type: "object",
          properties: {
            issuer: { type: "string", description: "发布机构" },
            type: { type: "string", description: "报告类型，如 最终调查报告、调查进展、事件报告汇编、统计通报" },
            date: { type: "string", description: "发布日期" },
            about: { type: "string", description: "针对的事故（日期、企业、装置）" },
            impact: { type: "string", description: "伤亡与财产损失，原文未说明则为空字符串" },
            findings: { type: "array", items: { type: "string" }, description: "主要发现与原因，3–5 条中文" },
            recommendations: { type: "array", items: { type: "string" }, description: "报告提出的建议；尚未提出时说明" },
          },
          required: ["issuer", "type", "date", "about", "impact", "findings", "recommendations"],
          additionalProperties: false,
        },
        { type: "null" },
      ],
    },
  },
  required: ["is_loss_event", "summary", "points", "refs", "report"],
  additionalProperties: false,
};

let client;
export const enabled = () => Boolean(process.env.ANTHROPIC_API_KEY);

export async function summarize(item, articleText) {
  if (!client) {
    const { default: Anthropic } = await import("@anthropic-ai/sdk"); // 仅在配置了密钥时加载
    client = new Anthropic();
  }
  const response = await client.beta.messages.create({
    model: "claude-opus-5-5",
    max_tokens: 16000,
    output_config: { format: { type: "json_schema", schema: SCHEMA } },
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: SYSTEM,
    messages: [
      {
        role: "user",
        content: `标题：${item.title}\n来源：${item.source || ""}\n日期：${item.date || ""}\n链接：${item.link}\n\n报道原文（节选）：\n${articleText}`,
      },
    ],
  });
  if (response.stop_reason === "refusal") throw new Error("模型拒绝处理该报道");
  const text = response.content.filter((b) => b.type === "text").map((b) => b.text).join("");
  return JSON.parse(text);
}
