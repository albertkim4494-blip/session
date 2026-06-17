/**
 * Exercise substitution engine.
 *
 * Given an exercise the user can't perform (equipment not in their active gym
 * profile), find ranked alternatives that hit the same training stimulus using
 * only available equipment.
 *
 * Pure functions, no React dependency. The engine takes an `allowedEquipment`
 * Set directly, so it is decoupled from the coarse equipment-category selection
 * and forward-compatible with finer-grained gym profiles.
 */

import { filterCatalog } from "./exerciseCatalogUtils.js";
import { classifyExerciseMuscles } from "./coachNormalize.js";

// Equipment "families" — substitutes within the same family feel closer.
const EQUIPMENT_FAMILY = {
  dumbbell: "freeweight",
  barbell: "freeweight",
  kettlebell: "freeweight",
  band: "freeweight",
  cable: "cable",
  machine: "machine",
  "ab wheel": "freeweight",
  bodyweight: "bodyweight",
};

function familyOf(equipmentList) {
  for (const e of equipmentList || []) {
    if (EQUIPMENT_FAMILY[e]) return EQUIPMENT_FAMILY[e];
  }
  return null;
}

// Words that carry no movement meaning — equipment names and filler. Stripped
// before comparing exercise names so the name-similarity signal reflects the
// movement pattern ("bench press"), not the equipment.
const NAME_STOPWORDS = new Set([
  "dumbbell", "barbell", "kettlebell", "cable", "machine", "band", "smith",
  "the", "and", "with", "one", "two", "arm", "leg",
]);

function nameTokens(name) {
  return (name || "")
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter((w) => w.length >= 3 && !NAME_STOPWORDS.has(w));
}

/**
 * Resolve an exercise (catalog-linked or custom free-text) into the fields the
 * scorer needs. Returns { primary[], secondary[], movement, defaultUnit,
 * equipment[], loose }. `loose` is true when we fell back to keyword muscle
 * classification (lower confidence).
 */
function resolveExercise(exercise, catalogMap) {
  const entry = exercise?.catalogId && catalogMap ? catalogMap.get(exercise.catalogId) : null;
  if (entry) {
    return {
      sourceId: entry.id,
      primary: entry.muscles?.primary || [],
      secondary: entry.muscles?.secondary || [],
      movement: entry.movement || null,
      defaultUnit: entry.defaultUnit || exercise.unit || "reps",
      equipment: entry.equipment || [],
      tags: entry.tags || [],
      loose: false,
    };
  }
  // Custom / free-text fallback: keyword muscle classification, no reliable
  // primary/secondary split or movement.
  const muscles = classifyExerciseMuscles(exercise?.name || "");
  const usable = muscles.filter((m) => m !== "UNCLASSIFIED");
  return {
    sourceId: exercise?.catalogId || null,
    primary: usable,
    secondary: [],
    movement: null,
    defaultUnit: exercise?.unit || "reps",
    equipment: [],
    tags: [],
    loose: true,
  };
}

/**
 * True when the exercise cannot be performed with the available equipment and a
 * substitute should be sought. `allowedEquipment === null` means full gym — no
 * substitution is ever needed.
 */
export function needsSubstitution(exercise, allowedEquipment, catalogMap) {
  if (!allowedEquipment) return false; // full gym
  const src = resolveExercise(exercise, catalogMap);
  // No known equipment (custom exercise) — assume the user knows if they can do
  // it; don't force a substitution.
  if (!src.equipment.length) return false;
  // Doable when at least one of its equipment options is available.
  return !src.equipment.some((e) => allowedEquipment.has(e));
}

function overlapCount(a, b) {
  const setB = new Set(b);
  let n = 0;
  for (const x of a) if (setB.has(x)) n++;
  return n;
}

/**
 * Find ranked substitute exercises for `exercise` that are doable with
 * `allowedEquipment` and target the same stimulus.
 *
 * @param {object} exercise - the original exercise (may have catalogId, name, unit)
 * @param {object} opts
 * @param {Array}  opts.catalog          - EXERCISE_CATALOG
 * @param {Map}    opts.catalogMap        - buildCatalogMap(catalog)
 * @param {Set|null} opts.allowedEquipment - from buildAllowedEquipment(profile.equipment); null = full gym
 * @param {Set}    [opts.exclude]         - catalogIds already in the workout (avoid dupes)
 * @param {number} [opts.limit=5]
 * @returns {Array<{entry, score, reasons:string[], loose:boolean}>}
 */
export function findSubstitutes(exercise, {
  catalog,
  catalogMap,
  allowedEquipment,
  exclude = new Set(),
  limit = 5,
} = {}) {
  if (!allowedEquipment) return []; // full gym — nothing to substitute
  if (!Array.isArray(catalog)) return [];

  const src = resolveExercise(exercise, catalogMap);
  if (!src.primary.length && !src.secondary.length) return []; // can't classify

  const srcFamily = familyOf(src.equipment);
  const isMobility = src.movement === "sport" || src.movement === "stretch";
  // Resolve the source's display name (catalog name preferred over the stored name).
  const srcName = (src.sourceId && catalogMap?.get(src.sourceId)?.name) || exercise?.name || "";
  const srcTokens = new Set(nameTokens(srcName));

  // Candidate pool: only exercises doable with available equipment.
  let pool = filterCatalog(catalog, { equipment: allowedEquipment });

  const scored = [];
  for (const cand of pool) {
    if (cand.id === src.sourceId) continue;
    if (exclude.has(cand.id)) continue;
    // Don't cross the exercise/mobility boundary either direction.
    const candMobility = cand.movement === "sport" || cand.movement === "stretch";
    if (candMobility !== isMobility) continue;

    const candPrimary = cand.muscles?.primary || [];
    const candSecondary = cand.muscles?.secondary || [];

    const sharedPrimary = overlapCount(src.primary, candPrimary);
    // Hard gate: must share a primary muscle. Relaxed below if nothing passes.
    if (sharedPrimary === 0) continue;

    const reasons = [];
    let score = 0;

    // Primary-muscle overlap — dominant term.
    score += 100 * (sharedPrimary / Math.max(1, src.primary.length));
    reasons.push(`Same primary muscle: ${src.primary.filter((m) => candPrimary.includes(m)).join(", ")}`);

    // Movement match — the reliable mechanic proxy.
    if (src.movement && cand.movement && src.movement === cand.movement) {
      score += 40;
      reasons.push(`Same ${src.movement} movement`);
    }

    // Secondary-muscle overlap (capped).
    const sharedSecondary = overlapCount(src.secondary, candSecondary);
    if (sharedSecondary > 0) {
      score += Math.min(24, 8 * sharedSecondary);
    }

    // Unit compatibility — so existing sets/reps carry over.
    const candUnit = cand.defaultUnit || "reps";
    if (candUnit === src.defaultUnit) score += 20;
    else score -= 30;

    // Equipment family — freeweight↔freeweight feels closer than →machine.
    if (srcFamily && familyOf(cand.equipment) === srcFamily) score += 10;

    // compound tag present on both — weak positive (tag is sparse).
    if ((src.tags || []).includes("compound") && (cand.tags || []).includes("compound")) {
      score += 10;
    }

    // Name-similarity tiebreak — prefer the same movement pattern by name
    // ("bench press" → "bench press") among otherwise-equal candidates.
    if (srcTokens.size > 0) {
      const sharedTokens = overlapCount(srcTokens, nameTokens(cand.name));
      if (sharedTokens > 0) score += Math.min(18, 6 * sharedTokens);
    }

    scored.push({ entry: cand, score, reasons, loose: src.loose });
  }

  // Relaxed pass: if the primary gate found nothing, fall back to secondary
  // overlap and flag as loose matches.
  if (scored.length === 0) {
    for (const cand of pool) {
      if (cand.id === src.sourceId || exclude.has(cand.id)) continue;
      const candMobility = cand.movement === "sport" || cand.movement === "stretch";
      if (candMobility !== isMobility) continue;
      const sharedSecondary = overlapCount(
        [...src.primary, ...src.secondary],
        [...(cand.muscles?.primary || []), ...(cand.muscles?.secondary || [])]
      );
      if (sharedSecondary === 0) continue;
      let score = 20 * sharedSecondary;
      if (src.movement && cand.movement === src.movement) score += 40;
      if ((cand.defaultUnit || "reps") === src.defaultUnit) score += 20;
      scored.push({
        entry: cand,
        score,
        reasons: ["Similar muscle group (loose match)"],
        loose: true,
      });
    }
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.entry.name.localeCompare(b.entry.name);
  });

  return scored.slice(0, limit);
}
