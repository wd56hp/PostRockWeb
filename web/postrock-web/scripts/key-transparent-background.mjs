/**
 * Remove solid plate touching image edges via flood-fill from corners
 * (avoids deleting black/shadow detail inside the mark).
 */
import sharp from "sharp";
import { readFile } from "node:fs/promises";

const FUZZ = 28;
const CORNER_COMPARE = FUZZ * 2;

function distL1(a, b) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
}

/** @param {Buffer} input */
async function keyEdgesBuffer(input, pngPath) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels } = info;
  if (channels !== 4) throw new Error(`expected RGBA, got ${channels} ch`);

  const px = new Uint8ClampedArray(data);
  const idx = (x, y) => (y * w + x) * 4;

  const corners = [
    [px[idx(0, 0)], px[idx(0, 0) + 1], px[idx(0, 0) + 2]],
    [px[idx(w - 1, 0)], px[idx(w - 1, 0) + 1], px[idx(w - 1, 0) + 2]],
    [px[idx(0, h - 1)], px[idx(0, h - 1) + 1], px[idx(0, h - 1) + 2]],
    [px[idx(w - 1, h - 1)], px[idx(w - 1, h - 1) + 1], px[idx(w - 1, h - 1) + 2]],
  ];

  let maxCornerDist = 0;
  for (const c of corners) {
    for (const d of corners) {
      maxCornerDist = Math.max(maxCornerDist, distL1(c, d));
    }
  }

  if (maxCornerDist > CORNER_COMPARE) {
    throw new Error(
      `corners differ too much (max dist ${maxCornerDist}) — need a flat plate or manual mask`,
    );
  }

  const bgKey = [
    Math.round(corners.reduce((s, c) => s + c[0], 0) / 4),
    Math.round(corners.reduce((s, c) => s + c[1], 0) / 4),
    Math.round(corners.reduce((s, c) => s + c[2], 0) / 4),
  ];

  const rgbNearBg = (i) => distL1([px[i], px[i + 1], px[i + 2]], bgKey) <= FUZZ * 3;

  const seen = new Uint8Array(w * h);
  const qx = [];
  const qy = [];

  const tryPush = (x, y) => {
    if (x < 0 || x >= w || y < 0 || y >= h) return;
    const p = y * w + x;
    if (seen[p]) return;
    const i = idx(x, y);
    if (!rgbNearBg(i)) return;
    seen[p] = 1;
    qx.push(x);
    qy.push(y);
  };

  for (let x = 0; x < w; x++) {
    tryPush(x, 0);
    tryPush(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    tryPush(0, y);
    tryPush(w - 1, y);
  }

  let qi = 0;
  while (qi < qx.length) {
    const x = qx[qi];
    const y = qy[qi];
    qi++;
    const i = idx(x, y);
    px[i + 3] = 0;
    tryPush(x + 1, y);
    tryPush(x - 1, y);
    tryPush(x, y + 1);
    tryPush(x, y - 1);
  }

  await sharp(Buffer.from(px), { raw: { width: w, height: h, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(pngPath);

  console.log("wrote", pngPath, { bgKey, edgePixelsKeyed: qx.length });
}

async function keyEdges(inputPath, pngPath, opts = {}) {
  let input = await readFile(inputPath);
  if (opts.trimThreshold != null) {
    input = await sharp(input).trim({ threshold: opts.trimThreshold }).toBuffer();
  }
  await keyEdgesBuffer(input, pngPath);
}

const args = process.argv.slice(2).filter(Boolean);
let trimThreshold;
const filtered = [];
for (const a of args) {
  if (a.startsWith("--trim=")) trimThreshold = Number(a.slice(7));
  else filtered.push(a);
}
const [inp, outp] = filtered;
if (!inp || !outp) {
  console.error("usage: key-transparent-background.mjs [--trim=30] <input.jpg|png> <output.png>");
  process.exit(1);
}
await keyEdges(inp, outp, { trimThreshold: Number.isFinite(trimThreshold) ? trimThreshold : undefined });
