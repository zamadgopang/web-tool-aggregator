import sharp from "sharp";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

// ZamDev "Z" icon SVG - dark background, white text
function createIconSvg(size) {
  const rx = Math.round(size * 37 / 180);
  const fontSize = Math.round(size * 110 / 180);
  const textY = Math.round(size * 125 / 180);
  const cx = Math.round(size / 2);
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${rx}" fill="#0a0a0a"/>
  <text x="${cx}" y="${textY}" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="${fontSize}" font-weight="800" text-anchor="middle" letter-spacing="-2">Z</text>
</svg>`;
}

const sizes = [48, 72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
  const iconsDir = join(publicDir, "icons");
  mkdirSync(iconsDir, { recursive: true });

  for (const size of sizes) {
    const svg = createIconSvg(size);
    const pngBuffer = await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toBuffer();

    writeFileSync(join(iconsDir, `icon-${size}x${size}.png`), pngBuffer);
    console.log(`Generated icon-${size}x${size}.png`);
  }

  // Generate apple-touch-icon (180x180)
  const appleSvg = createIconSvg(180);
  const appleBuffer = await sharp(Buffer.from(appleSvg))
    .resize(180, 180)
    .png()
    .toBuffer();
  writeFileSync(join(publicDir, "apple-icon.png"), appleBuffer);
  console.log("Generated apple-icon.png (180x180)");

  // Generate maskable icon (512x512 with padding for safe zone)
  const maskableSize = 512;
  const padding = Math.round(maskableSize * 0.1); // 10% padding
  const innerSize = maskableSize - padding * 2;
  const innerRx = Math.round(innerSize * 37 / 180);
  const innerFontSize = Math.round(innerSize * 110 / 180);
  const innerTextY = padding + Math.round(innerSize * 125 / 180);
  const innerCx = Math.round(maskableSize / 2);

  const maskableSvg = `<svg width="${maskableSize}" height="${maskableSize}" viewBox="0 0 ${maskableSize} ${maskableSize}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${maskableSize}" height="${maskableSize}" fill="#0a0a0a"/>
  <text x="${innerCx}" y="${innerTextY}" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="${innerFontSize}" font-weight="800" text-anchor="middle" letter-spacing="-2">Z</text>
</svg>`;

  const maskableBuffer = await sharp(Buffer.from(maskableSvg))
    .resize(maskableSize, maskableSize)
    .png()
    .toBuffer();
  writeFileSync(join(iconsDir, "maskable-icon-512x512.png"), maskableBuffer);
  console.log("Generated maskable-icon-512x512.png");

  console.log("\nAll icons generated successfully!");
}

generateIcons().catch(console.error);
