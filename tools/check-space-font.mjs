// Verify the negative-space table the tab list positions text with.
//
// The plugin (gg.windcharge.shared.utils.Font) assumes U+F800+i advances -2^i and U+F80A+i
// advances +2^i, for i in 0..9, and builds every pixel offset as a sum of those glyphs. If
// this table is edited and that assumption stops holding, nothing errors — tab columns just
// quietly drift. So assert the ladder here.
//
// Run: node tools/check-space-font.mjs
import fs from "fs";

const NEG = 0xF800, POS = 0xF80A, BITS = 10;
const font = JSON.parse(fs.readFileSync("assets/minecraft/font/default.json", "utf8"));
const provider = font.providers.find(p => p.type === "space");

const fail = [];
if (!provider) fail.push("no space provider in minecraft:default");

const advances = provider ? provider.advances : {};
const byCodepoint = {};
for (const [ch, px] of Object.entries(advances)) byCodepoint[ch.codePointAt(0)] = px;

for (let i = 0; i < BITS; i++) {
  const want = 1 << i;
  for (const [base, sign] of [[NEG, -1], [POS, 1]]) {
    const cp = base + i;
    const got = byCodepoint[cp];
    const expect = sign * want;
    if (got === undefined) fail.push(`U+${cp.toString(16).toUpperCase()} missing (expected ${expect})`);
    else if (got !== expect) fail.push(`U+${cp.toString(16).toUpperCase()} advances ${got}, expected ${expect}`);
  }
}

// Every offset the ladder claims to cover must decompose exactly, the same way Font.offset does.
let checked = 0;
for (let px = -1023; px <= 1023; px++) {
  const base = px < 0 ? NEG : POS;
  let rest = Math.abs(px), sum = 0;
  for (let bit = BITS - 1; bit >= 0; bit--) {
    if (rest & (1 << bit)) { sum += byCodepoint[base + bit] ?? NaN; rest -= 1 << bit; }
  }
  if (sum !== px) { fail.push(`offset ${px} sums to ${sum}`); break; }
  checked++;
}

// The rank glyphs share this file; a bad edit here would take them out too.
const glyphs = font.providers.filter(p => p.type === "bitmap").length;
if (glyphs !== 6) fail.push(`expected 6 rank glyph providers, found ${glyphs}`);

if (fail.length) {
  console.error("FAIL");
  for (const f of fail) console.error("  " + f);
  process.exit(1);
}
console.log(`ok — ladder complete, ${checked} offsets exact, ${glyphs} rank glyphs intact`);
