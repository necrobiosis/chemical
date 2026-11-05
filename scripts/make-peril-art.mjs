#!/usr/bin/env node
// 生成重大动态的起因示意图（assets/art/*.svg）：报道没有可用的现场照片时显示，页面上标注“示意图”。
// 纯 SVG，无依赖。修改画面后运行：node scripts/make-peril-art.mjs
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const out = path.join(path.dirname(fileURLToPath(import.meta.url)), "../assets/art");
const W = 640, H = 400, G = 318; // 画布与地面高度

/* ---------- 公共部件 ---------- */
const sky = (a, b) =>
  `<defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#s)"/>`;
const ground = (c = "#2f3a40") => `<rect y="${G}" width="${W}" height="${H - G}" fill="${c}"/><rect y="${G}" width="${W}" height="3" fill="#000" opacity=".15"/>`;
// 塔器、烟囱、管廊组成的装置剪影
const plant = (x, c = "#4b5861") => `<g fill="${c}">
  <rect x="${x}" y="150" width="30" height="${G - 150}" rx="4"/><rect x="${x + 6}" y="132" width="18" height="22" rx="3"/>
  <rect x="${x + 44}" y="196" width="24" height="${G - 196}" rx="4"/>
  <rect x="${x + 84}" y="110" width="12" height="${G - 110}"/>
  <rect x="${x - 20}" y="262" width="150" height="8"/><rect x="${x - 20}" y="284" width="150" height="6"/>
  <rect x="${x + 110}" y="230" width="58" height="${G - 230}" rx="3"/>
</g>`;
const tank = (cx, w, h, c = "#6b7780") =>
  `<g><rect x="${cx - w / 2}" y="${G - h}" width="${w}" height="${h}" fill="${c}"/><ellipse cx="${cx}" cy="${G - h}" rx="${w / 2}" ry="${w / 9}" fill="#87939b"/><rect x="${cx - w / 2}" y="${G - h + h * 0.35}" width="${w}" height="4" fill="#000" opacity=".12"/></g>`;
const smoke = (pts, c = "#3d3f44", o = 0.85) => `<g fill="${c}" opacity="${o}">${pts.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join("")}</g>`;
// 火焰：三层（红、橙、黄）
const flame = (x, y, s = 1) => {
  const f = (c, k) =>
    `<path transform="translate(${x} ${y}) scale(${s * k})" fill="${c}" d="M0 0 C-38 -18 -40 -60 -14 -92 C-12 -66 4 -62 6 -80 C14 -60 30 -50 22 -96 C52 -66 50 -20 0 0Z"/>`;
  return f("#d9381e", 1) + f("#f47b20", 0.74) + f("#ffd23f", 0.46);
};
// 爆炸冲击：星形火球 + 光环
const burst = (x, y, r) => {
  const star = (rr, c) => {
    const p = [];
    for (let k = 0; k < 24; k++) {
      const a = (Math.PI * 2 * k) / 24, q = k % 2 ? rr * 0.62 : rr;
      p.push(`${(x + Math.cos(a) * q).toFixed(1)},${(y + Math.sin(a) * q).toFixed(1)}`);
    }
    return `<polygon points="${p.join(" ")}" fill="${c}"/>`;
  };
  return `<circle cx="${x}" cy="${y}" r="${r * 1.45}" fill="#ffb347" opacity=".25"/>` + star(r, "#e4572e") + star(r * 0.72, "#f9a03f") + star(r * 0.42, "#fff1a8");
};
const svg = (body, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${title}（示意图）">${body}</svg>\n`;

/* ---------- 各起因画面 ---------- */
const ART = {
  // 一般火灾：厂房起火、黑烟
  "fire-general": svg(
    sky("#f6c28b", "#fbe7cf") + ground() +
      smoke([[300, 120, 46], [350, 90, 54], [410, 70, 48], [460, 60, 40], [250, 140, 36]], "#4a4a50", 0.8) +
      `<g fill="#56636b"><rect x="170" y="200" width="300" height="118"/><polygon points="160,204 320,150 480,204"/></g>` +
      `<g fill="#2b3338">${[200, 250, 390, 440].map((x) => `<rect x="${x}" y="236" width="28" height="34"/>`).join("")}</g>` +
      flame(320, 206, 1.25) + flame(250, 214, 0.8) + flame(400, 212, 0.9),
    "厂房火灾"
  ),
  // 可燃气体/蒸气云爆炸
  "fire-gas": svg(
    sky("#f3b07c", "#fde6cc") + ground() + plant(110) + plant(420, "#56636b") +
      smoke([[330, 110, 60], [395, 92, 50], [270, 104, 46]], "#55565c", 0.55) + burst(330, 196, 92),
    "气体爆炸"
  ),
  // 反应失控 / 分解爆炸：反应釜破裂
  "fire-runaway": svg(
    sky("#efb688", "#fbe9d6") + ground() + plant(440, "#56636b") +
      `<g fill="#6b7780"><rect x="200" y="196" width="120" height="110" rx="16"/><rect x="236" y="172" width="48" height="26"/><rect x="214" y="306" width="10" height="12"/><rect x="296" y="306" width="10" height="12"/></g>` +
      burst(262, 190, 78) +
      `<g fill="#3c464d">${[[150, 150, 18, -30], [380, 140, 14, 40], [330, 96, 12, 15], [176, 104, 10, -55]].map(([x, y, s, r]) => `<rect x="${x}" y="${y}" width="${s * 2}" height="${s}" transform="rotate(${r} ${x} ${y})"/>`).join("")}</g>`,
    "反应釜爆炸"
  ),
  // 易燃液体：储罐火灾
  "fire-liquid": svg(
    sky("#f0a877", "#fde4c8") + ground() +
      smoke([[300, 104, 50], [350, 70, 58], [420, 52, 52], [480, 46, 42], [250, 120, 36]], "#2f3034", 0.9) +
      tank(150, 110, 92) + tank(320, 150, 118) + tank(500, 110, 92) +
      flame(320, 204, 1.45) + flame(280, 206, 0.9) + flame(360, 206, 0.95),
    "储罐火灾"
  ),
  // 不相容反应 / 有毒气体：黄绿色烟团
  "fire-reactive": svg(
    sky("#dfe7d2", "#f4f6ec") + ground("#3a4540") + plant(120) + tank(470, 120, 96) +
      smoke([[300, 170, 50], [350, 140, 62], [420, 120, 58], [480, 112, 46], [250, 190, 38], [540, 110, 36]], "#c9b13a", 0.72) +
      smoke([[340, 150, 30], [410, 128, 32]], "#e3cf5a", 0.6),
    "有毒气体泄漏"
  ),
  // 粉尘爆炸：料仓
  "fire-dust": svg(
    sky("#f1c79a", "#fcebd8") + ground() +
      `<g fill="#6b7780"><rect x="230" y="140" width="80" height="140"/><polygon points="230,280 310,280 280,318 260,318"/><rect x="350" y="170" width="70" height="110"/><polygon points="350,280 420,280 395,318 375,318"/></g>` +
      smoke([[210, 120, 40], [170, 150, 34], [260, 96, 36]], "#c8b89a", 0.8) + burst(270, 150, 64),
    "粉尘爆炸"
  ),
  // 设备：压力容器 / 管道破裂喷出
  equipment: svg(
    sky("#c7d2ec", "#eef1fa") + ground("#323a4a") + plant(470, "#5a6378") +
      // 卧式压力容器与鞍座
      `<g fill="#6c7590"><rect x="90" y="214" width="300" height="78" rx="39"/><rect x="140" y="292" width="24" height="26"/><rect x="316" y="292" width="24" height="26"/></g>` +
      `<rect x="90" y="240" width="300" height="5" fill="#000" opacity=".1"/>` +
      // 撕裂口与向外喷射的气流
      `<polygon points="300,216 312,200 322,214 336,198 344,220 332,232 316,226 306,236" fill="#232838"/>` +
      `<polygon points="314,214 340,206 520,84 470,60" fill="#e4eaf6" opacity=".9"/>` +
      `<g fill="#e4eaf6" opacity=".9"><ellipse cx="500" cy="72" rx="64" ry="34"/><ellipse cx="560" cy="96" rx="44" ry="26"/><ellipse cx="450" cy="58" rx="40" ry="22"/></g>` +
      `<g fill="#3c4458">${[[256, 166, 20], [372, 150, 30], [230, 196, -40]].map(([x, y, r]) => `<rect x="${x}" y="${y}" width="22" height="9" transform="rotate(${r} ${x} ${y})"/>`).join("")}</g>`,
    "设备破裂泄漏"
  ),
  // 电气：变压器起火
  "equipment-electrical": svg(
    sky("#c3cde8", "#edf0f9") + ground("#323a4a") +
      `<g fill="#6c7590"><rect x="210" y="200" width="180" height="118" rx="6"/>${[226, 262, 298, 334].map((x) => `<rect x="${x}" y="212" width="20" height="96"/>`).join("")}<rect x="236" y="160" width="14" height="42"/><rect x="300" y="150" width="14" height="52"/><rect x="350" y="160" width="14" height="42"/></g>` +
      `<path d="M300 92 L282 140 L302 138 L288 182 L330 124 L308 126 L322 92Z" fill="#ffd23f"/>` +
      flame(300, 206, 1.0) + smoke([[300, 96, 30], [340, 80, 36], [380, 74, 28]], "#3d3f44", 0.6),
    "电气设备起火"
  ),
  // 洪水：厂区受淹
  "natural-flood": svg(
    sky("#9fb3c4", "#d5dfe7") +
      `<g fill="#7d8b94">${[[80, 40], [190, 70], [330, 50], [470, 60]].map(([x, w]) => `<ellipse cx="${x + 40}" cy="${60 + w / 3}" rx="${70 + w / 2}" ry="${26 + w / 5}"/>`).join("")}</g>` +
      `<g stroke="#6f8291" stroke-width="2" opacity=".6">${Array.from({ length: 22 }, (_, k) => `<line x1="${20 + k * 30}" y1="120" x2="${8 + k * 30}" y2="170"/>`).join("")}</g>` +
      plant(140, "#56636b") + tank(470, 120, 110) +
      `<rect y="262" width="${W}" height="${H - 262}" fill="#4f7fa3" opacity=".88"/>` +
      `<g fill="none" stroke="#b9d4ea" stroke-width="3" opacity=".7">${[290, 320, 352].map((y) => `<path d="M0 ${y} q40 -10 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0"/>`).join("")}</g>`,
    "洪水"
  ),
  // 台风与强风
  "natural-wind": svg(
    sky("#8e9fae", "#cdd6de") + ground("#3b4650") + plant(130, "#56636b") +
      `<g transform="rotate(-8 470 260)">${tank(470, 120, 80)}</g>` +
      `<rect x="400" y="200" width="70" height="10" fill="#6b7780" transform="rotate(-28 400 200)"/>` +
      `<g fill="none" stroke="#eef3f7" stroke-width="5" stroke-linecap="round" opacity=".8">${[[40, 90], [120, 140], [20, 190], [300, 70]].map(([x, y]) => `<path d="M${x} ${y} h180 q30 0 30 -24 q0 -20 -22 -20"/>`).join("")}</g>`,
    "台风与强风"
  ),
  // 地震：地面开裂
  "natural-quake": svg(
    sky("#d9c7b0", "#f2e8dc") + ground("#5a4a3e") +
      `<g transform="rotate(-6 200 318)">${plant(120, "#56636b")}</g>` + tank(470, 120, 96) +
      `<path d="M300 318 L286 340 L304 352 L290 372 L312 400 L330 400 L314 374 L330 356 L314 342 L326 318Z" fill="#2a211b"/>` +
      `<g stroke="#5a4a3e" stroke-width="4" fill="none" opacity=".6"><path d="M90 300 l-14 -8"/><path d="M560 300 l14 -8"/><path d="M110 270 l-16 -6"/><path d="M540 270 l16 -6"/></g>`,
    "地震"
  ),
  // 雷击
  "natural-lightning": svg(
    sky("#4d5a6b", "#8a97a6") + ground("#2c343c") + plant(110, "#3f4a52") + tank(430, 130, 96, "#56636b") +
      `<g fill="#3a4350">${[[160, 60], [330, 40], [500, 64]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="120" ry="44"/>`).join("")}</g>` +
      `<path d="M440 60 L410 140 L436 138 L404 220 L470 120 L442 122 L470 60Z" fill="#ffe36e"/>` +
      flame(430, 226, 0.7),
    "雷击"
  ),
  // 未能判断起因时
  default: svg(
    sky("#cfd8d4", "#eef2f0") + ground("#34403c") + plant(100, "#55625e") + tank(460, 130, 100, "#66736f") +
      `<g transform="translate(320 150)"><polygon points="0,-60 56,40 -56,40" fill="#e0a526"/><rect x="-5" y="-26" width="10" height="38" fill="#3a2f12"/><rect x="-5" y="20" width="10" height="10" fill="#3a2f12"/></g>`,
    "工业事故"
  ),
};

await mkdir(out, { recursive: true });
for (const [name, body] of Object.entries(ART)) await writeFile(path.join(out, name + ".svg"), body);
console.log(`已生成 ${Object.keys(ART).length} 张示意图到 assets/art/`);
