/**
 * Self-contained test script for exerciseSubstitution.js
 * Run with: node src/lib/exerciseSubstitution.test.js
 */

import { EXERCISE_CATALOG, buildAllowedEquipment } from "./exerciseCatalog.js";
import { buildCatalogMap } from "./exerciseCatalogUtils.js";
import { needsSubstitution, findSubstitutes } from "./exerciseSubstitution.js";

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${label}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${label}`);
  }
}

const catalogMap = buildCatalogMap(EXERCISE_CATALOG);
const dumbbellOnly = buildAllowedEquipment(["dumbbell"]); // Set { bodyweight, dumbbell }
const fullGym = buildAllowedEquipment(["full_gym"]);      // null

// Barbell Bench Press — CHEST, push, reps, equipment: ["barbell"]
const BARBELL_BENCH = "edb-EIeI8Vf";
const barbellBench = { catalogId: BARBELL_BENCH, name: "Barbell Bench Press", unit: "reps" };

// --- needsSubstitution ---
console.log("\nneedsSubstitution:");
assert(needsSubstitution(barbellBench, dumbbellOnly, catalogMap) === true,
  "barbell exercise needs substitution when only dumbbells available");
assert(needsSubstitution(barbellBench, fullGym, catalogMap) === false,
  "full gym (null) never needs substitution");
assert(needsSubstitution(barbellBench, buildAllowedEquipment(["barbell"]), catalogMap) === false,
  "no substitution when the required equipment is available");
assert(needsSubstitution({ name: "Some Custom Lift" }, dumbbellOnly, catalogMap) === false,
  "custom exercise with no known equipment does not force substitution");

// --- findSubstitutes: full gym short-circuit ---
console.log("\nfindSubstitutes — full gym:");
assert(findSubstitutes(barbellBench, { catalog: EXERCISE_CATALOG, catalogMap, allowedEquipment: fullGym }).length === 0,
  "returns nothing for full gym (no substitution needed)");

// --- findSubstitutes: barbell bench, dumbbell only ---
console.log("\nfindSubstitutes — barbell bench, dumbbell only:");
const subs = findSubstitutes(barbellBench, {
  catalog: EXERCISE_CATALOG,
  catalogMap,
  allowedEquipment: dumbbellOnly,
  limit: 5,
});
assert(subs.length > 0, "returns at least one substitute");
assert(subs.every((s) => (s.entry.equipment || []).some((e) => dumbbellOnly.has(e))),
  "every substitute is doable with the available equipment");
assert(subs.every((s) => !(s.entry.equipment || []).includes("barbell")),
  "no substitute requires a barbell");
assert(subs.every((s) => s.entry.muscles?.primary?.includes("CHEST")),
  "every substitute shares the CHEST primary muscle (hard gate)");
assert(subs[0].entry.id === "edb-SpYC0Kp",
  "top substitute is Dumbbell Bench Press (same muscle + movement + unit + family)");
assert(subs.every((s) => s.loose === false),
  "catalog-linked source produces confident (non-loose) matches");
assert(Array.isArray(subs[0].reasons) && subs[0].reasons.length > 0,
  "substitute carries human-readable reasons");
// Scores are sorted descending
assert(subs.every((s, i) => i === 0 || subs[i - 1].score >= s.score),
  "results sorted by score descending");

// --- exclude ---
console.log("\nfindSubstitutes — exclude:");
const subsExcluded = findSubstitutes(barbellBench, {
  catalog: EXERCISE_CATALOG,
  catalogMap,
  allowedEquipment: dumbbellOnly,
  exclude: new Set(["edb-SpYC0Kp"]),
  limit: 5,
});
assert(subsExcluded.every((s) => s.entry.id !== "edb-SpYC0Kp"),
  "excluded ids never appear in results");
assert(subsExcluded[0].entry.id !== "edb-SpYC0Kp",
  "top result changes once the best match is excluded");

// --- custom free-text fallback ---
console.log("\nfindSubstitutes — custom free-text fallback:");
const customSubs = findSubstitutes(
  { name: "Heavy Bench Press Thing" }, // no catalogId
  { catalog: EXERCISE_CATALOG, catalogMap, allowedEquipment: dumbbellOnly, limit: 5 }
);
assert(customSubs.length > 0, "resolves muscles from the name and returns substitutes");
assert(customSubs.every((s) => s.loose === true),
  "custom-source matches are flagged loose");
assert(customSubs.every((s) => (s.entry.equipment || []).some((e) => dumbbellOnly.has(e))),
  "custom-source substitutes still respect available equipment");

// --- unclassifiable custom exercise ---
console.log("\nfindSubstitutes — unclassifiable:");
const none = findSubstitutes(
  { name: "Zxqyt Wibble" },
  { catalog: EXERCISE_CATALOG, catalogMap, allowedEquipment: dumbbellOnly }
);
assert(none.length === 0, "unclassifiable exercise returns no substitutes (never throws)");

// --- summary ---
console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
