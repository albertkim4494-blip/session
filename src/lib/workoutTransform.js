/**
 * Transform AI-returned exercises into the app's workout structure.
 *
 * Pure logic (no network / supabase import) so it can be unit-tested directly.
 * Resolves AI exercises against the catalog by id then name, and — when an
 * exercise is unavailable for the user's equipment or missing from the catalog
 * entirely — substitutes a same-stimulus alternative instead of dropping it.
 */

import { findSubstitutes } from "./exerciseSubstitution.js";

let _idCounter = 0;
function uid(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${(++_idCounter).toString(36)}`;
}

/** Build a Set of every equipment value present in the catalog (the "no constraint" pool). */
function allEquipmentSet(catalog) {
  const s = new Set();
  for (const e of catalog || []) for (const q of e.equipment || []) s.add(q);
  return s;
}

/**
 * @param {Array} aiExercises - exercises from the AI response ({ catalogId, name, scheme })
 * @param {Map}   catalogMap   - buildCatalogMap(catalog)
 * @param {object} [opts]
 * @param {Array}  [opts.catalog]          - full EXERCISE_CATALOG (enables substitution)
 * @param {Set|null} [opts.allowedEquipment] - buildAllowedEquipment(equipment); null = full gym
 * @returns {{ exercises, diagnostics }} diagnostics: { dropped, substituted, reasons[] }
 */
export function transformExercises(aiExercises, catalogMap, { catalog, allowedEquipment } = {}) {
  const diagnostics = { dropped: 0, substituted: 0, reasons: [] };
  if (!Array.isArray(aiExercises)) return { exercises: [], diagnostics };

  // Name → entry lookup for fallback matching.
  const nameMap = new Map();
  for (const [, entry] of catalogMap) nameMap.set(entry.name.toLowerCase(), entry);

  // An exercise fits when there is no equipment constraint, it has no equipment
  // data, or at least one of its equipment options is available.
  const fitsEquip = (entry) =>
    !allowedEquipment || !(entry.equipment || []).length || entry.equipment.some((e) => allowedEquipment.has(e));

  // The substitution engine always needs a non-null pool; at full gym, rank
  // across all equipment so we can still salvage not-in-catalog drops.
  const canSubstitute = Array.isArray(catalog) && catalog.length > 0;
  const subPool = canSubstitute ? (allowedEquipment || allEquipmentSet(catalog)) : null;

  const findSub = (exercise, usedIds) =>
    canSubstitute
      ? findSubstitutes(exercise, { catalog, catalogMap, allowedEquipment: subPool, exclude: usedIds, limit: 1 })[0]?.entry || null
      : null;

  const exercises = [];
  const usedIds = new Set();
  for (const e of aiExercises) {
    let entry = null;

    // Resolve by catalogId, then by name.
    if (e.catalogId && catalogMap.has(e.catalogId)) {
      entry = catalogMap.get(e.catalogId);
    }
    if (!entry && e.name) {
      const byName = nameMap.get(e.name.toLowerCase());
      if (byName) {
        diagnostics.reasons.push(`Recovered ${e.name}: bad catalogId "${e.catalogId}", matched by name`);
        entry = byName;
      }
    }

    // Not in catalog — try to salvage via a name-based substitute before dropping.
    if (!entry) {
      const sub = findSub({ name: e.name || "", unit: "reps" }, usedIds);
      if (sub) {
        diagnostics.substituted++;
        diagnostics.reasons.push(`Salvaged ${e.name || "unknown"} → ${sub.name} (not in catalog)`);
        entry = sub;
      } else {
        diagnostics.dropped++;
        diagnostics.reasons.push(`Dropped ${e.name || e.catalogId || "unknown"}: not found in catalog`);
        continue;
      }
    } else if (!fitsEquip(entry)) {
      // Valid exercise, but not doable with the user's equipment — substitute.
      const sub = findSub({ catalogId: entry.id, name: entry.name, unit: entry.defaultUnit }, usedIds);
      if (sub) {
        diagnostics.substituted++;
        diagnostics.reasons.push(`Substituted ${entry.name} → ${sub.name} (equipment unavailable)`);
        entry = sub;
      } else {
        diagnostics.dropped++;
        diagnostics.reasons.push(`Dropped ${entry.name}: no equipment-available substitute`);
        continue;
      }
    }

    // Skip duplicates.
    if (usedIds.has(entry.id)) continue;
    usedIds.add(entry.id);

    exercises.push({
      id: uid("ex"),
      name: entry.name,
      unit: entry.defaultUnit,
      catalogId: entry.id,
      scheme: e.scheme || null,
    });
  }

  return { exercises, diagnostics };
}
