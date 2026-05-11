import sharp from "sharp";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const svgPath = join(root, "public/icons/icon.svg");
const svgBuffer = readFileSync(svgPath);

const configs = [
  { file: "icon-192.png", size: 192 },
  { file: "icon-512.png", size: 512 },
  { file: "icon-maskable-192.png", size: 192, padding: 0.15 },
  { file: "icon-maskable-512.png", size: 512, padding: 0.15 },
];

const iconsDir = join(root, "public/icons");

for (const { file, size, padding } of configs) {
  const outPath = join(iconsDir, file);

  if (padding) {
    // Maskable: shrink icon to safe zone (80%), pad with navy background
    const innerSize = Math.round(size * (1 - padding * 2));
    const inner = await sharp(svgBuffer).resize(innerSize, innerSize).toBuffer();
    await sharp({
      create: { width: size, height: size, channels: 4, background: "#0B1F3A" },
    })
      .composite([{ input: inner, gravity: "center" }])
      .png()
      .toFile(outPath);
  } else {
    await sharp(svgBuffer).resize(size, size).png().toFile(outPath);
  }

  console.log(`✓ ${file}`);
}

await sharp(svgBuffer).resize(180, 180).png().toFile(join(root, "public/apple-touch-icon.png"));
console.log("✓ apple-touch-icon.png");

console.log("Icons generated.");
