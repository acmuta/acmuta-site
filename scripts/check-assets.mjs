// Fails the build when an image under public/assets is oversized or when a
// data file references an officer photo whose generated variants are missing.
import sharp from "sharp";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const DIRS = ["public/assets/officerpics"];
const MAX_KB = 200;
const MAX_PX = 1200;
const DATA_FILES = ["src/data/officers.ts", "src/data/alumni.ts"];
const WIDTHS = [300, 600];

const errors = [];

for (const dir of DIRS) {
  for (const file of await readdir(dir)) {
    if (!/\.(webp|jpe?g|png|avif|gif)$/i.test(file)) continue;
    const p = path.join(dir, file);
    const { size } = await stat(p);
    const { width = 0, height = 0 } = await sharp(p).metadata();
    if (size > MAX_KB * 1024) errors.push(`${p}: ${(size / 1024).toFixed(0)} KB exceeds ${MAX_KB} KB`);
    if (width > MAX_PX || height > MAX_PX) errors.push(`${p}: ${width}x${height} exceeds ${MAX_PX}px`);
  }
}

for (const file of DATA_FILES) {
  const text = await readFile(file, "utf8");
  for (const [, base] of text.matchAll(/photo:\s*"\/assets\/officerpics\/([^"]+)"/g)) {
    for (const w of WIDTHS) {
      const variant = `public/assets/officerpics/${base}-${w}.webp`;
      await stat(variant).catch(() => errors.push(`${file}: missing ${variant} (run npm run img:officers)`));
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("Assets OK");
