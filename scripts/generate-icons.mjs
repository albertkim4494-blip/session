import sharp from "sharp";
import { mkdirSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, "..", "public", "icons");
mkdirSync(outDir, { recursive: true });

// Dark background matching app theme, teal dumbbell icon
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#0b0f14"/>

  <g transform="translate(256,256) rotate(-35)">
    <!-- Dumbbell bar -->
    <rect x="-120" y="-10" width="240" height="20" rx="6" fill="#2dd4bf"/>

    <!-- Left weight stack -->
    <rect x="-150" y="-50" width="40" height="100" rx="10" fill="#2dd4bf"/>
    <rect x="-170" y="-38" width="24" height="76" rx="8" fill="#2dd4bf"/>

    <!-- Right weight stack -->
    <rect x="110" y="-50" width="40" height="100" rx="10" fill="#2dd4bf"/>
    <rect x="146" y="-38" width="24" height="76" rx="8" fill="#2dd4bf"/>
  </g>

  <!-- Subtle check circle -->
  <circle cx="370" cy="370" r="52" fill="#0b0f14" stroke="#2dd4bf" stroke-width="6"/>
  <polyline points="348,370 364,386 394,354" fill="none" stroke="#2dd4bf" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const sizes = [192, 512];

for (const size of sizes) {
  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(resolve(outDir, `icon-${size}.png`));
  console.log(`Generated icon-${size}.png`);
}

console.log("Done!");
