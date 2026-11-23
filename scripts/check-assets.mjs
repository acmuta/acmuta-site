// Fails the build when an image under public/assets is oversized, when a
// data file references an officer photo whose generated variants are missing,
// or when Create gallery media is missing, oversized, or in a format the
// gallery does not serve.
import sharp from "sharp";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const DIRS = ["public/assets/officerpics"];
const MAX_KB = 200;
const MAX_PX = 1200;
const DATA_FILES = ["src/data/officers.ts", "src/data/alumni.ts"];
const WIDTHS = [300, 600];

const GALLERY_DIR = "public/assets/create-gallery";
const GALLERY_DATA = "src/data/createGallery.ts";
const GALLERY_IMG_MAX_KB = 250;
const GALLERY_IMG_MAX_PX = 1600;
const GALLERY_VIDEO_MAX_KB = 4096;

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

const galleryFiles = await readdir(GALLERY_DIR, { recursive: true }).catch(() => []);
for (const rel of galleryFiles) {
  const p = path.join(GALLERY_DIR, rel);
  if (/\.gif$/i.test(rel)) {
    errors.push(`${p}: GIFs are not served; convert to MP4 + WebM with a poster (docs/create-gallery.md)`);
  } else if (/\.(webp|jpe?g|png|avif)$/i.test(rel)) {
    const { size } = await stat(p);
    const { width = 0, height = 0 } = await sharp(p).metadata();
    if (size > GALLERY_IMG_MAX_KB * 1024) errors.push(`${p}: ${(size / 1024).toFixed(0)} KB exceeds ${GALLERY_IMG_MAX_KB} KB`);
    if (width > GALLERY_IMG_MAX_PX || height > GALLERY_IMG_MAX_PX) {
      errors.push(`${p}: ${width}x${height} exceeds ${GALLERY_IMG_MAX_PX}px`);
    }
  } else if (/\.(mp4|webm)$/i.test(rel)) {
    const { size } = await stat(p);
    if (size > GALLERY_VIDEO_MAX_KB * 1024) errors.push(`${p}: ${(size / 1024).toFixed(0)} KB exceeds ${GALLERY_VIDEO_MAX_KB} KB`);
  }
}

const galleryData = await readFile(GALLERY_DATA, "utf8");
for (const [, ref] of galleryData.matchAll(/"(\/assets\/create-gallery\/[^"]+)"/g)) {
  await stat(path.join("public", ref)).catch(() => errors.push(`${GALLERY_DATA}: missing public${ref}`));
}
for (const [, ref] of galleryData.matchAll(/(?:src|poster|captions):\s*"(https?:\/\/[^"]+)"/g)) {
  errors.push(`${GALLERY_DATA}: ${ref} is remote; the CSP only allows self-hosted media`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("Assets OK");
