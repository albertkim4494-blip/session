/**
 * Generate PNG icons with a procedural pencil-textured circle.
 * The circle is built from ~50 thin overlapping partial-ellipse strokes
 * to simulate colored pencil / crayon texture on paper.
 *
 * Usage: node scripts/generate-icons.js
 */
import sharp from "sharp";
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ICONS_DIR = resolve(__dirname, "../public/icons");
const SIZES = [16, 32, 48, 180, 192, 512];

// --- Seeded PRNG for reproducible pencil texture ---
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generate SVG elements for a pencil-textured circle.
 * Creates many thin partial-ellipse strokes with slight random offsets,
 * simulating the buildup of colored pencil on textured paper.
 */
function generatePencilCircle(cx, cy, rx, ry, color, seed = 42) {
  const rng = mulberry32(seed);
  const elements = [];

  // Foundation: solid base circle for consistent shape visibility
  elements.push(
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" ` +
      `fill="none" stroke="${color}" stroke-width="4" opacity="0.45" stroke-linecap="round"/>`
  );

  // Layer 1: ~55 thin partial strokes for pencil grain texture
  for (let i = 0; i < 55; i++) {
    const ocx = cx + (rng() - 0.5) * 4;
    const ocy = cy + (rng() - 0.5) * 4;
    const orx = rx + (rng() - 0.5) * 3;
    const ory = ry + (rng() - 0.5) * 3;
    const opacity = (0.15 + rng() * 0.45).toFixed(2);
    const sw = (1.2 + rng() * 3.0).toFixed(1);

    // Each stroke draws a random arc of the ellipse
    const dashLen = (15 + rng() * 100).toFixed(0);
    const gapLen = 280;
    const dashOffset = (rng() * 200).toFixed(0);

    elements.push(
      `<ellipse cx="${ocx.toFixed(1)}" cy="${ocy.toFixed(1)}" ` +
        `rx="${orx.toFixed(1)}" ry="${ory.toFixed(1)}" ` +
        `fill="none" stroke="${color}" stroke-width="${sw}" ` +
        `opacity="${opacity}" stroke-linecap="round" ` +
        `stroke-dasharray="${dashLen} ${gapLen}" stroke-dashoffset="${dashOffset}"/>`
    );
  }

  // Layer 2: thicker body strokes for overall presence
  for (let i = 0; i < 8; i++) {
    const ocx = cx + (rng() - 0.5) * 2;
    const ocy = cy + (rng() - 0.5) * 2;
    const orx = rx + (rng() - 0.5) * 2;
    const ory = ry + (rng() - 0.5) * 2;
    const opacity = (0.1 + rng() * 0.18).toFixed(2);
    const sw = (4.0 + rng() * 4.0).toFixed(1);

    elements.push(
      `<ellipse cx="${ocx.toFixed(1)}" cy="${ocy.toFixed(1)}" ` +
        `rx="${orx.toFixed(1)}" ry="${ory.toFixed(1)}" ` +
        `fill="none" stroke="${color}" stroke-width="${sw}" ` +
        `opacity="${opacity}" stroke-linecap="round"/>`
    );
  }

  return elements.join("\n    ");
}

function buildIconSvg() {
  // Layout constants (measured from Segoe UI rendering)
  const BG_COLOR = "#E8E0D4"; // Anthropic-style warm beige
  const TEXT_COLOR = "#3D3530"; // Warm dark brown
  const CIRCLE_COLOR = "#B8806E"; // Muted dusty coral (pencil tone)

  // Text positions: "sessi" + [circle] + "n"
  // "sessi" at x=113 → ends ~297
  // Circle center at ~320
  // "n" at x=346 (tighter natural spacing)
  const sessiX = 128;
  const nX = 339;
  const baseline = 277;
  const fontSize = 80;

  // Circle: centered in the "o" slot, slightly larger for logo presence
  const circleCx = 315;
  const circleCy = 256; // x-height center
  const circleRx = 24;
  const circleRy = 23;

  const pencilStrokes = generatePencilCircle(
    circleCx, circleCy, circleRx, circleRy, CIRCLE_COLOR, 42
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <!-- Background -->
  <rect width="512" height="512" fill="${BG_COLOR}"/>

  <!-- "sessi" text -->
  <text x="${sessiX}" y="${baseline}"
    font-family="'Segoe UI', system-ui, -apple-system, Arial, Helvetica, sans-serif"
    font-size="${fontSize}" font-weight="600" fill="${TEXT_COLOR}"
    letter-spacing="-1">sessi</text>

  <!-- "n" text -->
  <text x="${nX}" y="${baseline}"
    font-family="'Segoe UI', system-ui, -apple-system, Arial, Helvetica, sans-serif"
    font-size="${fontSize}" font-weight="600" fill="${TEXT_COLOR}"
    letter-spacing="-1">n</text>

  <!-- Pencil-textured circle (the "o") — procedurally generated -->
  <g>
    ${pencilStrokes}
  </g>
</svg>`;
}

async function main() {
  const svg = buildIconSvg();

  // Save master SVG
  writeFileSync(resolve(ICONS_DIR, "icon-master.svg"), svg);
  console.log("  ✓ icon-master.svg");

  // Generate PNGs at all sizes
  const svgBuf = Buffer.from(svg);
  for (const size of SIZES) {
    const outPath = resolve(ICONS_DIR, `icon-${size}.png`);
    await sharp(svgBuf, { density: 300 }).resize(size, size).png().toFile(outPath);
    console.log(`  ✓ icon-${size}.png`);
  }

  console.log("\nDone! Icons written to public/icons/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
