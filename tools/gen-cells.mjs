// Generate the tab-list cell textures.
//
// A tab row's background is not a background: it is a bitmap font glyph drawn at the start of
// the line, which the plugin then jumps back over with negative space so the row's text lands
// on top of it. So each "cell" here is just a PNG the font renders — 300px wide to match the
// table, 10px tall to sit behind one 8px line of text.
//
// Colours are multiplied by the component's colour when rendered, so the plugin draws these
// with pure white and lets the texture carry the palette.
//
// Run: node tools/gen-cells.mjs
import fs from "fs";
import zlib from "zlib";

// The tab's line pitch is 9px. A cell taller than that overlaps the row above it, so the
// strip is 9 tall with its last row left transparent: 8px of visible cell, 1px of gap.
const W = 300, H = 9;
const OUT = "assets/windcharge/textures/font";

// --- minimal RGBA PNG writer ------------------------------------------------------------
function crc32(buf) {
  let c, table = [];
  for (let n = 0; n < 256; n++) { c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; table[n] = c >>> 0; }
  let crc = 0xFFFFFFFF;
  for (const b of buf) crc = table[(crc ^ b) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function writePng(path, px) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4);
  ihdr[8] = 8; ihdr[9] = 6;   // 8-bit RGBA
  const raw = Buffer.alloc((W * 4 + 1) * H);
  for (let y = 0; y < H; y++) {
    raw[y * (W * 4 + 1)] = 0;   // filter: none
    px.slice(y * W * 4, (y + 1) * W * 4).copy(raw, y * (W * 4 + 1) + 1);
  }
  fs.writeFileSync(path, Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
    chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0)),
  ]));
}

// --- cells ------------------------------------------------------------------------------
/**
 * @param fill  [r,g,b,a] row body
 * @param accent [r,g,b,a] 3px bar down the left edge, the team's colour
 */
function cell(fill, accent) {
  const px = Buffer.alloc(W * H * 4);
  const put = (x, y, [r, g, b, a]) => {
    const i = (y * W + x) * 4;
    px[i] = r; px[i + 1] = g; px[i + 2] = b; px[i + 3] = a;
  };
  for (let y = 0; y < H - 1; y++) {   // last row stays clear: that is the gap between cells
    for (let x = 0; x < W; x++) {
      // Corner pixels cut, so the strip reads as a rounded cell rather than a hard bar.
      const corner = (x === 0 || x === W - 1) && (y === 0 || y === H - 2);
      if (corner) continue;
      put(x, y, x < 3 && accent ? accent : fill);
    }
  }
  // The far column must stay opaque enough that Minecraft doesn't trim it when it measures
  // the glyph — a trimmed edge would shorten the advance and shift every column by a pixel.
  for (let y = 1; y < H - 2; y++) put(W - 1, y, fill[3] < 8 ? [fill[0], fill[1], fill[2], 8] : fill);
  return px;
}

const BODY  = [88, 96, 130, 165];   // row body, translucent slate
const BAND  = [58, 64, 92, 205];    // summary band, darker and heavier
const ALLY  = [168, 85, 247, 235];  // brand purple
const ENEMY = [230, 69, 83, 235];   // red

fs.mkdirSync(OUT, { recursive: true });
writePng(`${OUT}/cell_ally.png`,  cell(BODY, ALLY));
writePng(`${OUT}/cell_enemy.png`, cell(BODY, ENEMY));
writePng(`${OUT}/band_ally.png`,  cell(BAND, ALLY));
writePng(`${OUT}/band_enemy.png`, cell(BAND, ENEMY));
console.log(`wrote 4 cells (${W}x${H}) to ${OUT}`);
