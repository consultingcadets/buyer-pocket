import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// 1200x630 OG image — navy bg, white wordmark, teal tagline
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0F1C2C"/>
  <!-- subtle grid pattern -->
  <rect width="1200" height="630" fill="url(#grid)" opacity="0.04"/>
  <defs>
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" stroke-width="1"/>
    </pattern>
  </defs>
  <!-- Icon: house -->
  <g transform="translate(480, 140)">
    <rect width="240" height="240" rx="40" fill="#0F1C2C" stroke="#2EC4B6" stroke-width="3"/>
    <polygon points="120,38 196,98 44,98" fill="#2EC4B6"/>
    <rect x="14" y="13" width="16" height="36" rx="3" fill="#2EC4B6" transform="translate(168,62)"/>
    <rect x="52" y="94" width="116" height="88" rx="2" fill="#FFFFFF"/>
    <path d="M98,182 L98,140 Q98,128 120,128 Q142,128 142,140 L142,182 Z" fill="#0F1C2C"/>
    <rect x="60" y="108" width="28" height="26" rx="4" fill="#2EC4B6" opacity="0.85"/>
    <rect x="152" y="108" width="28" height="26" rx="4" fill="#2EC4B6" opacity="0.85"/>
  </g>
  <!-- Wordmark -->
  <text x="600" y="430" font-family="system-ui, -apple-system, sans-serif" font-size="72" font-weight="700" fill="white" text-anchor="middle" letter-spacing="-2">BuyerPocket</text>
  <!-- Tagline -->
  <text x="600" y="490" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="400" fill="#2EC4B6" text-anchor="middle">Your buyers, always in your pocket.</text>
</svg>`;

await sharp(Buffer.from(svg))
  .resize(1200, 630)
  .png()
  .toFile(join(root, "public/og-image.png"));

console.log("✓ og-image.png");
