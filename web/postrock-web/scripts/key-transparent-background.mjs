/**
 * One-off: turn a flat JPEG "background" into alpha using corner samples.
 * Avoids eating black detail in the mark when corners match the plate.
 */
import sharp from "sharp";
import { readFile } from "node:fs/promises";

const FUZZ = 38;

function dist(a, b) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
}

async function keyBackground(jpegPath, pngPath) {
  const input = await readFile(jpegPath);
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

  let key = corners[0];
  let maxCornerDist = 0;
  for (const c of corners) {
    maxCornerDist = Math.max(maxCornerDist, dist(key, c));
  }

  // If corners disagree a lot, fall back to keying near-black only (legacy exports).
  const useCorners = maxCornerDist <= FUZZ * 2;
  const bgKey = useCorners
    ? [
        Math.round(corners.reduce((s, c) => s + c[0], 0) / 4),
        Math.round(corners.reduce((s, c) => s + c[1], 0) / 4),
        Math.round(corners.reduce((s, c) => s + c[2], 0) / 4),
      ]
    : [0, 0, 0];

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = idx(x, y);
      const r = px[i];
      const g = px[i + 1];
      const b = px[i + 2];
      const match =
        useCorners && maxCornerDist <= FUZZ * 2
          ? dist([r, g, b], bgKey) <= FUZZ * 3
          : r <= FUZZ && g <= FUZZ && b <= FUZZ;
      if (match) {
        px[i + 3] = 0;
      }
    }
  }

  await sharp(Buffer.from(px), { raw: { width: w, height: h, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(pngPath);

  console.log("wrote", pngPath, { useCorners, bgKey, maxCornerDist });
}

const [, , inp, outp] = process.argv;
if (!inp || !outp) {
  console.error("usage: key-flat-background.mjs <input.jpg> <output.png>");
  process.exit(1);
}
await keyBackground(inp, outp);
