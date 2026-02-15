/**
 * Self-contained test script for exerciseCatalogUtils.js
 * Run with: node src/lib/exerciseCatalogUtils.test.js
 */

import { EXERCISE_CATALOG } from "./exerciseCatalog.js";
import {
  normalizeQuery,
  buildCatalogMap,
  catalogSearch,
  getRecentExercises,
  getFrequentExercises,
  resolveExerciseDisplay,
  getMuscleGroups,
} from "./exerciseCatalogUtils.js";

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    passed++;
    console.log(`  \u2713 ${label}`);
  } else {
    failed++;
    console.error(`  \u2717 FAIL: ${label}`);
  }
}

function assertEqual(actual, expected, label) {
  if (actual === expected) {
    passed++;
    console.log(`  \u2713 ${label}`);
  } else {
    failed++;
    console.error(`  \u2717 FAIL: ${label} \u2014 expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

// --- normalizeQuery ---
console.log("\nnormalizeQuery:");
assertEqual(normalizeQuery("  Bench Press  "), "bench press", "trims and lowercases");
assertEqual(normalizeQuery("  a   b  "), "a b", "collapses whitespace");
assertEqual(normalizeQuery(""), "", "empty string");
assertEqual(normalizeQuery(null), "", "null returns empty");

// --- buildCatalogMap ---
console.log("\nbuildCatalogMap:");
const catalogMap = buildCatalogMap(EXERCISE_CATALOG);
assert(catalogMap instanceof Map, "returns a Map");
assert(catalogMap.size === EXERCISE_CATALOG.length, "map size matches catalog length");
assert(catalogMap.get("edb-EIeI8Vf").name === "Barbell Bench Press", "lookup by id works");
assert(catalogMap.get("nonexistent") === undefined, "missing id returns undefined");

// --- catalogSearch ---
console.log("\ncatalogSearch — ranking:");

// Name prefix match (tier 1) should rank higher than name-contains (tier 2)
const benchResults = catalogSearch(EXERCISE_CATALOG, "bench");
assert(benchResults.length > 0, "bench returns results");
// The first results should have 'Bench' at the start or be very relevant
assert(benchResults.some((r) => r.name.toLowerCase().includes("bench")), "bench results contain bench exercises");

// Name prefix should rank before alias match
const pullResults = catalogSearch(EXERCISE_CATALOG, "pull");
assert(pullResults[0].name.toLowerCase().startsWith("pull"), "pull — name prefix ranked first");

// Name match for "bent over row"
const bbRowResults = catalogSearch(EXERCISE_CATALOG, "bent over row");
assert(bbRowResults.length > 0, "'bent over row' finds results");
assert(bbRowResults[0].name.toLowerCase().includes("bent over row"), "first result contains 'bent over row'");

// Muscle group match
const chestResults = catalogSearch(EXERCISE_CATALOG, "chest");
assert(chestResults.length > 0, "muscle search 'chest' finds results");
assert(chestResults.some((r) => r.muscles.primary.includes("CHEST")), "chest results include CHEST muscle exercises");

// Equipment / tag match
const cableResults = catalogSearch(EXERCISE_CATALOG, "cable");
assert(cableResults.length > 0, "equipment search 'cable' finds results");
assert(cableResults.every((r) => r.equipment.includes("cable") || r.name.toLowerCase().includes("cable") || r.aliases.some((a) => a.toLowerCase().includes("cable"))), "cable results are relevant");

// Empty query returns all (up to limit)
const allResults = catalogSearch(EXERCISE_CATALOG, "");
assertEqual(allResults.length, 20, "empty query returns limit (20)");

// Limit option
const limitResults = catalogSearch(EXERCISE_CATALOG, "", { limit: 5 });
assertEqual(limitResults.length, 5, "limit=5 respected");

// Movement filter
const pushOnly = catalogSearch(EXERCISE_CATALOG, "", { movement: "push", limit: 100 });
assert(pushOnly.length > 0, "movement=push returns results");
assert(pushOnly.every((r) => r.movement === "push"), "all push results have movement=push");

// Equipment filter
const dbOnly = catalogSearch(EXERCISE_CATALOG, "", { equipment: "dumbbell", limit: 100 });
assert(dbOnly.length > 0, "equipment=dumbbell returns results");
assert(dbOnly.every((r) => r.equipment.includes("dumbbell")), "all dumbbell results have dumbbell equipment");

// --- getRecentExercises ---
console.log("\ngetRecentExercises:");

const testWorkouts = [
  { exercises: [
    { id: "ex1", name: "Bench Press", unit: "reps" },
    { id: "ex2", name: "Pull Ups", unit: "reps" },
    { id: "ex3", name: "Running", unit: "min" },
  ] },
];

const testLogs = {
  "2025-01-10": { ex1: { sets: [{ reps: 10 }] } },
  "2025-01-15": { ex2: { sets: [{ reps: 8 }] }, ex3: { sets: [{ reps: 30 }] } },
  "2025-01-20": { ex1: { sets: [{ reps: 12 }] } },
};

const recent = getRecentExercises({ logsByDate: testLogs, workouts: testWorkouts, limit: 10 });
assertEqual(recent[0].name, "Bench Press", "most recent exercise is Bench Press (Jan 20)");
assert(recent.length === 3, "3 unique exercises returned");
// ex1 should appear only once despite being in two dates
assert(recent.filter((r) => r.exerciseId === "ex1").length === 1, "ex1 appears only once");

// --- getFrequentExercises ---
console.log("\ngetFrequentExercises:");

const freqLogs = {
  "2025-01-05": { ex1: { sets: [] }, ex2: { sets: [] } },
  "2025-01-10": { ex1: { sets: [] } },
  "2025-01-15": { ex1: { sets: [] }, ex3: { sets: [] } },
  "2025-01-20": { ex1: { sets: [] }, ex2: { sets: [] } },
  "2025-01-25": { ex2: { sets: [] } },
};

const freq = getFrequentExercises({ logsByDate: freqLogs, workouts: testWorkouts, windowDays: 9999, limit: 10 });
assertEqual(freq[0].exerciseId, "ex1", "most frequent is ex1");
assertEqual(freq[0].count, 4, "ex1 has count=4");
assertEqual(freq[1].exerciseId, "ex2", "second most frequent is ex2");
assertEqual(freq[1].count, 3, "ex2 has count=3");

// --- resolveExerciseDisplay ---
console.log("\nresolveExerciseDisplay:");

const exWithCatalog = { id: "ex1", name: "Bench Press", unit: "reps", catalogId: "edb-EIeI8Vf" };
const exWithout = { id: "ex2", name: "Custom Exercise", unit: "reps" };

const resolved = resolveExerciseDisplay(exWithCatalog, catalogMap);
assert(resolved !== null, "exercise with catalogId resolves");
assertEqual(resolved.name, "Barbell Bench Press", "resolved name matches catalog");

const unresolved = resolveExerciseDisplay(exWithout, catalogMap);
assert(unresolved === null, "exercise without catalogId returns null");

const noMap = resolveExerciseDisplay(exWithCatalog, null);
assert(noMap === null, "null catalogMap returns null");

// --- getMuscleGroups ---
console.log("\ngetMuscleGroups:");

// With catalogId
const musclesFromCatalog = getMuscleGroups(exWithCatalog, catalogMap, null);
assert(musclesFromCatalog.includes("CHEST"), "catalog-linked exercise includes CHEST");
assert(musclesFromCatalog.includes("TRICEPS"), "catalog-linked exercise includes TRICEPS");

// Without catalogId, with keyword fallback
const keywordFallback = (name) => {
  if (name.toLowerCase().includes("squat")) return ["QUADS", "GLUTES"];
  return ["UNCLASSIFIED"];
};
const squatEx = { id: "exS", name: "Barbell Squat" };
const musclesFromFallback = getMuscleGroups(squatEx, catalogMap, keywordFallback);
assert(musclesFromFallback.includes("QUADS"), "fallback identifies QUADS for squat");

// Without catalogId and no fallback
const musclesNoFallback = getMuscleGroups(squatEx, catalogMap, null);
assert(musclesNoFallback.includes("UNCLASSIFIED"), "no fallback returns UNCLASSIFIED");

// --- Summary ---
console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
