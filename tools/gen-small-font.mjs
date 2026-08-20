// Generate windcharge:small — the default font at half height.
//
// This is the same trick CounterMine uses: there is no separate small typeface, it is the
// ordinary glyph sheet re-declared at half the height, and the client scales it down. Ascent
// is picked so the small glyphs keep the normal baseline (bottom stays 1px below it), which is
// what lets small and normal text sit on one line without jumping.
//
// The char tables are copied verbatim from the vanilla providers rather than retyped, so the
// codepoint order cannot drift. Point VANILLA at an extracted client's font include.
//
// Run: node tools/gen-small-font.mjs [path-to-extracted-vanilla]
import fs from "fs";

const VANILLA = process.argv[2] ?? "vanilla/assets/minecraft/font/include/default.json";
const OUT = "assets/windcharge/font/small.json";

if (!fs.existsSync(VANILLA)) {
  console.error(`no vanilla font at ${VANILLA}`);
  console.error("extract one with: unzip -j <version>.jar 'assets/minecraft/font/include/*'");
  process.exit(1);
}

const src = JSON.parse(fs.readFileSync(VANILLA, "utf8"));
const providers = src.providers
  .filter(p => p.type === "bitmap")
  .map(p => {
    const height = (p.height ?? 8) / 2;
    if (!Number.isInteger(height)) throw new Error(`${p.file} height ${p.height} is not halvable`);
    // bottom = ascent - height; keep it where the full-size glyph put it.
    return { type: "bitmap", file: p.file, ascent: (p.ascent ?? 7) - (p.height ?? 8) + height, height, chars: p.chars };
  });

// Escape everything past ASCII, so the file survives any editor or tool that is careless with
// encodings — the rank glyphs in default.json have already been lost that way once.
const json = JSON.stringify({ providers }, null, 2)
  .replace(/[-￿]/g, c => "\\u" + c.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0"));

fs.mkdirSync("assets/windcharge/font", { recursive: true });
fs.writeFileSync(OUT, json + "\n", "utf8");
console.log(`wrote ${OUT}: ${providers.map(p => `${p.file.split("/").pop()} h${p.height}/a${p.ascent}`).join(", ")}`);
