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

export function BodyDiagram({ highlightedMuscles = [], colors }) {
  const accentColor = colors.accent;

  // Build data array for highlighted muscles (deduplicate slugs)
  const activeSlugs = new Set();
  for (const muscle of highlightedMuscles) {
    const slugs = MUSCLE_TO_SLUGS[muscle];
    if (slugs) slugs.forEach((s) => activeSlugs.add(s));
  }

  const data = [
    ...Array.from(activeSlugs).map((slug) => ({ slug, color: accentColor })),
    // Paint head to match default body fill so it looks bald
    { slug: "head", color: colors.subtleBg },
  ];

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 16, padding: "4px 0" }}>
      {/* Front view */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.4, marginBottom: 2, letterSpacing: 1, textTransform: "uppercase" }}>
          Front
        </span>
        <Body
          data={data}
          side="front"
          scale={1.2}
          border={colors.border}
          defaultFill={colors.subtleBg}
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
          scale={1.2}
          border={colors.border}
          defaultFill={colors.subtleBg}
          hiddenParts={HIDDEN}
        />
      </div>
    </div>
  );
}
