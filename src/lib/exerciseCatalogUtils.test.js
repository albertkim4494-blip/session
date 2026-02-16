/**
 * Self-contained test script for exerciseCatalogUtils.js
 * Run with: node src/lib/exerciseCatalogUtils.test.js
 */

import { EXERCISE_CATALOG } from "./exerciseCatalog.js";
import {
  normalizeQuery,
  buildCatalogMap,
  catalogSearch,
  filterCatalog,
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

// --- catalogSearch — multi-word queries ---
console.log("\ncatalogSearch — multi-word queries:");

const tricepExtResults = catalogSearch(EXERCISE_CATALOG, "tricep extension");
assert(tricepExtResults.length > 0, "'tricep extension' returns results");
assert(
  tricepExtResults.some((r) => r.name.toLowerCase().includes("triceps extension")),
  "'tricep extension' finds an exercise with 'triceps extension' in name"
);

const flyResults = catalogSearch(EXERCISE_CATALOG, "fly");
assert(flyResults.length > 0, "'fly' returns results");
assert(flyResults.some((r) => r.name.toLowerCase().includes("fly")), "'fly' finds Dumbbell Fly or similar");

const cableFaceResults = catalogSearch(EXERCISE_CATALOG, "cable face");
assert(cableFaceResults.length > 0, "'cable face' returns results");
assert(
  cableFaceResults.some((r) => r.name.toLowerCase().includes("cable face pull")),
  "'cable face' finds Cable Face Pull"
);

const seatedTricepResults = catalogSearch(EXERCISE_CATALOG, "seated tricep");
assert(seatedTricepResults.length > 0, "'seated tricep' returns results");
assert(
  seatedTricepResults.some((r) => r.name.toLowerCase().includes("seated") && r.name.toLowerCase().includes("tricep")),
  "'seated tricep' finds exercise with both words"
);

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

// --- filterCatalog ---
console.log("\nfilterCatalog:");

// No filters returns full catalog
const noFilter = filterCatalog(EXERCISE_CATALOG);
assertEqual(noFilter.length, EXERCISE_CATALOG.length, "no filters returns full catalog");

// Muscle group filter — CHEST
const chestFiltered = filterCatalog(EXERCISE_CATALOG, { uiMuscleGroup: "CHEST" });
assert(chestFiltered.length > 0, "CHEST filter returns results");
assert(
  chestFiltered.every((e) => {
    const all = [...(e.muscles?.primary || []), ...(e.muscles?.secondary || [])];
    return all.includes("CHEST");
  }),
  "all CHEST results have CHEST muscle"
);

// Muscle group filter — LEGS (should include QUADS, HAMSTRINGS, GLUTES, CALVES)
const legsFiltered = filterCatalog(EXERCISE_CATALOG, { uiMuscleGroup: "LEGS" });
assert(legsFiltered.length > 0, "LEGS filter returns results");
assert(
  legsFiltered.every((e) => {
    const all = [...(e.muscles?.primary || []), ...(e.muscles?.secondary || [])];
    return all.some(m => ["QUADS", "HAMSTRINGS", "GLUTES", "CALVES"].includes(m));
  }),
  "all LEGS results have a leg muscle"
);

// Equipment filter — single
const dbFiltered = filterCatalog(EXERCISE_CATALOG, { equipment: new Set(["dumbbell"]) });
assert(dbFiltered.length > 0, "dumbbell equipment filter returns results");
assert(
  dbFiltered.every((e) => (e.equipment || []).includes("dumbbell")),
  "all dumbbell-filtered results have dumbbell"
);

// Equipment filter — multi
const multiEquip = filterCatalog(EXERCISE_CATALOG, { equipment: new Set(["dumbbell", "barbell"]) });
assert(multiEquip.length > 0, "multi-equipment filter returns results");
assert(
  multiEquip.every((e) => (e.equipment || []).some(eq => eq === "dumbbell" || eq === "barbell")),
  "multi-equipment results have dumbbell or barbell"
);

// Sport ID filter (uses typeFilter to find a sport first)
const sportList = filterCatalog(EXERCISE_CATALOG, { typeFilter: "sport" });
const firstSport = sportList[0];
const sportIdFiltered = filterCatalog(EXERCISE_CATALOG, { sportId: firstSport.id });
assertEqual(sportIdFiltered.length, 1, "sportId filter returns exactly 1 result");
assertEqual(sportIdFiltered[0].id, firstSport.id, "sportId filter returns correct sport");

// Combined: muscle group + equipment
const chestDb = filterCatalog(EXERCISE_CATALOG, { uiMuscleGroup: "CHEST", equipment: new Set(["dumbbell"]) });
assert(chestDb.length > 0, "CHEST + dumbbell combined returns results");
assert(
  chestDb.every((e) => {
    const all = [...(e.muscles?.primary || []), ...(e.muscles?.secondary || [])];
    return all.includes("CHEST") && (e.equipment || []).includes("dumbbell");
  }),
  "combined CHEST+dumbbell results satisfy both filters"
);

// Empty equipment set returns all (same as no filter)
const emptyEquip = filterCatalog(EXERCISE_CATALOG, { equipment: new Set() });
assertEqual(emptyEquip.length, EXERCISE_CATALOG.length, "empty equipment set returns full catalog");

// Multi muscle group filter (uiMuscleGroups array)
const chestAndArms = filterCatalog(EXERCISE_CATALOG, { uiMuscleGroups: ["CHEST", "ARMS"] });
assert(chestAndArms.length > 0, "CHEST+ARMS multi-group returns results");
assert(chestAndArms.length > chestFiltered.length, "CHEST+ARMS returns more than CHEST alone");
assert(
  chestAndArms.every((e) => {
    const all = [...(e.muscles?.primary || []), ...(e.muscles?.secondary || [])];
    return all.some(m => ["CHEST", "BICEPS", "TRICEPS", "FOREARMS"].includes(m));
  }),
  "all CHEST+ARMS results have a chest or arm muscle"
);

// Empty uiMuscleGroups array returns full catalog
const emptyGroups = filterCatalog(EXERCISE_CATALOG, { uiMuscleGroups: [] });
assertEqual(emptyGroups.length, EXERCISE_CATALOG.length, "empty uiMuscleGroups returns full catalog");

// typeFilter — exercise (excludes sport + stretch)
const exerciseOnly = filterCatalog(EXERCISE_CATALOG, { typeFilter: "exercise" });
assert(exerciseOnly.length > 0, "typeFilter=exercise returns results");
assert(
  exerciseOnly.every((e) => e.movement !== "sport" && e.movement !== "stretch"),
  "typeFilter=exercise excludes sport and stretch"
);

// typeFilter — stretch
const stretchType = filterCatalog(EXERCISE_CATALOG, { typeFilter: "stretch" });
assert(stretchType.length > 0, "typeFilter=stretch returns results");
assert(
  stretchType.every((e) => e.movement === "stretch"),
  "typeFilter=stretch only returns stretches"
);

// typeFilter — sport
const sportType = filterCatalog(EXERCISE_CATALOG, { typeFilter: "sport" });
assert(sportType.length > 0, "typeFilter=sport returns results");
assert(
  sportType.every((e) => e.movement === "sport"),
  "typeFilter=sport only returns sports"
);

// typeFilter + muscle group: exercise + CHEST
const chestExercises = filterCatalog(EXERCISE_CATALOG, { typeFilter: "exercise", uiMuscleGroup: "CHEST" });
assert(chestExercises.length > 0, "CHEST + typeFilter=exercise returns results");
assert(
  chestExercises.every((e) => e.movement !== "sport" && e.movement !== "stretch"),
  "CHEST exercises exclude sport and stretch"
);

// typeFilter=sport + muscle group: sports have no muscles, should pass through
const sportWithMuscle = filterCatalog(EXERCISE_CATALOG, { typeFilter: "sport", uiMuscleGroup: "CHEST" });
assert(sportWithMuscle.length > 0, "sport + CHEST muscle filter still returns sports");
assert(
  sportWithMuscle.every((e) => e.movement === "sport"),
  "sport + muscle filter only returns sports"
);

// --- Summary ---
console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
