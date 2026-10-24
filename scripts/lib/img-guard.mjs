// 配图过滤：避免遗体、停尸间、伤者、救护车担架等令人不适的特写，只保留现场远景类照片。
// 1. 图片地址关键词过滤（只看图片自身的地址，不看新闻标题，否则所有伤亡新闻都会被排除）
// 2. 感知哈希黑名单（data/img-blocklist.json）：媒体常反复使用同一张“示意图”，换了地址也能识别
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export const BAD_URL = /dead|death|body|bodies|corpse|cadaver|morgue|mortuary|deceased|funeral|coffin|toe-?tag|ambulance|stretcher|hospital|injur|blood|victim|representational|representative-image|file-?photo|stock-?image|getty|istock|shutterstock/i;

// 统一尺寸后计算 dHash：先裁成与缩略图相同的 360×225，再缩到 9×8 灰度比较相邻像素
export async function dhash(sharp, buf) {
  const { data } = await sharp(buf)
    .rotate()
    .resize({ width: 360, height: 225, fit: "cover" })
    .grayscale()
    .resize(9, 8, { fit: "fill" })
    .raw()
    .toBuffer({ resolveWithObject: true });
  let bits = "";
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) bits += data[y * 9 + x] > data[y * 9 + x + 1] ? "1" : "0";
  return BigInt("0b" + bits).toString(16).padStart(16, "0");
}

export function hamming(a, b) {
  let x = BigInt("0x" + a) ^ BigInt("0x" + b);
  let n = 0;
  while (x) (n += Number(x & 1n)), (x >>= 1n);
  return n;
}

const file = (root) => path.join(root, "data/img-blocklist.json");
export async function loadBlocklist(root) {
  try {
    return JSON.parse(await readFile(file(root), "utf8"));
  } catch {
    return [];
  }
}
export async function saveBlocklist(root, list) {
  await writeFile(file(root), JSON.stringify(list, null, 1) + "\n");
}
export const isBlocked = (list, hash, max = 10) => list.some((e) => hamming(e.hash, hash) <= max);
