// Build windcharge-pack.zip with forward-slash paths.
// Windows' Compress-Archive / .NET Framework write backslash separators,
// which Minecraft's pack loader can't resolve — so we write the zip directly.
// Run: node build.mjs
import fs from "fs";
import path from "path";

const T = (() => { let t = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = b => { let c = 0xFFFFFFFF; for (let i = 0; i < b.length; i++) c = T[(c ^ b[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };

function walk(dir, base, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name), rel = (base ? base + "/" : "") + e.name;
    e.isDirectory() ? walk(full, rel, out) : out.push({ rel, full });
  }
}

const files = [{ rel: "pack.mcmeta", full: "pack.mcmeta" }, { rel: "pack.png", full: "pack.png" }];
walk("assets", "assets", files);

const locals = [], central = [];
let offset = 0;
for (const f of files) {
  const data = fs.readFileSync(f.full), crc = crc32(data), name = Buffer.from(f.rel, "utf8");
  const lh = Buffer.alloc(30);
  lh.writeUInt32LE(0x04034b50, 0); lh.writeUInt16LE(20, 4);
  lh.writeUInt32LE(crc, 14); lh.writeUInt32LE(data.length, 18); lh.writeUInt32LE(data.length, 22); lh.writeUInt16LE(name.length, 26);
  locals.push(lh, name, data);
  const ch = Buffer.alloc(46);
  ch.writeUInt32LE(0x02014b50, 0); ch.writeUInt16LE(20, 4); ch.writeUInt16LE(20, 6);
  ch.writeUInt32LE(crc, 16); ch.writeUInt32LE(data.length, 20); ch.writeUInt32LE(data.length, 24); ch.writeUInt16LE(name.length, 28); ch.writeUInt32LE(offset, 42);
  central.push(ch, name);
  offset += 30 + name.length + data.length;
}
const clen = central.reduce((n, c) => n + c.length, 0);
const eocd = Buffer.alloc(22);
eocd.writeUInt32LE(0x06054b50, 0); eocd.writeUInt16LE(files.length, 8); eocd.writeUInt16LE(files.length, 10); eocd.writeUInt32LE(clen, 12); eocd.writeUInt32LE(offset, 16);
fs.writeFileSync("windcharge-pack.zip", Buffer.concat([...locals, ...central, eocd]));
console.log(`wrote windcharge-pack.zip (${files.length} entries)`);
