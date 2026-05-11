import sharp from "sharp";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const markSvg = readFileSync(join(root, "public/icons/house.svg"), "utf8");
const encoded = encodeURIComponent(markSvg);
const W = 1200;
const H = 630;
const markSize = 260;
const mx = (W - markSize) / 2;
const my = 64;

const compositeSvg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="bpGrid" width="36" height="36" patternUnits="userSpaceOnUse">
      <path d="M0 0H36V36" fill="none" stroke="#1B3359" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="#0B1F3A"/>
  <rect width="${W}" height="${H}" fill="url(#bpGrid)"/>
  <image href="data:image/svg+xml;charset=utf-8,${encoded}" x="${mx}" y="${my}" width="${markSize}" height="${markSize}" preserveAspectRatio="xMidYMid meet"/>
  <text x="${W / 2}" y="400" text-anchor="middle" font-family="Georgia,serif" font-size="76" fill="#FDF9F4" font-weight="700">BuyerPocket</text>
  <text x="${W / 2}" y="488" text-anchor="middle" font-family="system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="44" fill="#E8614A">Your buyers, always in your pocket.</text>
</svg>`;

await sharp(Buffer.from(compositeSvg)).png().toFile(join(root, "public/og-image.png"));
console.log("✓ og-image.png");
