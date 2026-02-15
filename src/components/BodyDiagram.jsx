import React from "react";
import Body from "react-muscle-highlighter";

/**
 * Maps our catalog MUSCLE_GROUPS keys to react-muscle-highlighter slugs.
 * Some catalog keys map to multiple slugs.
 */
const MUSCLE_TO_SLUGS = {
  CHEST: ["chest"],
  TRICEPS: ["triceps"],
  BICEPS: ["biceps"],
  ANTERIOR_DELT: ["deltoids"],
  LATERAL_DELT: ["deltoids"],
  POSTERIOR_DELT: ["deltoids"],
  BACK: ["upper-back", "trapezius"],
  QUADS: ["quadriceps"],
  HAMSTRINGS: ["hamstring"],
  GLUTES: ["gluteal"],
  CALVES: ["calves"],
  ABS: ["abs"],
  OBLIQUES: ["obliques"],
  FOREARMS: ["forearm"],
};

const HIDDEN = ["hair"];

/**
 * Boost a hex color's saturation and brightness for better diagram contrast.
 * Returns a more vivid version of the color.
 */
function boostColor(hex) {
  // Parse hex
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }

  // Boost: increase saturation, push lightness toward vivid midrange
  s = Math.min(1, s * 1.5 + 0.15);
  l = l < 0.5 ? Math.min(0.55, l + 0.15) : Math.min(0.6, l);

  // HSL to RGB
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const ro = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const go = Math.round(hue2rgb(p, q, h) * 255);
  const bo = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);
  return `#${ro.toString(16).padStart(2, "0")}${go.toString(16).padStart(2, "0")}${bo.toString(16).padStart(2, "0")}`;
}

export function BodyDiagram({ highlightedMuscles = [], colors }) {
  // Use a boosted accent for highlighted muscles — more vivid than UI accent
  const highlightColor = boostColor(colors.accent);

  // Build data array for highlighted muscles (deduplicate slugs)
  const activeSlugs = new Set();
  for (const muscle of highlightedMuscles) {
    const slugs = MUSCLE_TO_SLUGS[muscle];
    if (slugs) slugs.forEach((s) => activeSlugs.add(s));
  }

  // Very faint body fill so highlighted muscles pop across all themes
  const bodyFill = "rgba(128,128,128,0.08)";
  const headFill = bodyFill;

  const data = [
    ...Array.from(activeSlugs).map((slug) => ({ slug, color: highlightColor })),
    // Paint head to match default body fill so it looks bald
    { slug: "head", color: headFill },
  ];

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "4px 0" }}>
      {/* Front view */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.4, marginBottom: 2, letterSpacing: 1, textTransform: "uppercase" }}>
          Front
        </span>
        <Body
          data={data}
          side="front"
          scale={0.8}
          border={colors.border}
          defaultFill={bodyFill}
          hiddenParts={HIDDEN}
        />
      </div>

      {/* Back view */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.4, marginBottom: 2, letterSpacing: 1, textTransform: "uppercase" }}>
          Back
        </span>
        <Body
          data={data}
          side="back"
          scale={0.8}
          border={colors.border}
          defaultFill={bodyFill}
          hiddenParts={HIDDEN}
        />
      </div>
    </div>
  );
}
