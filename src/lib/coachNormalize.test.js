/**
 * Self-contained test script for coachNormalize.js
 * Run with: node src/lib/coachNormalize.test.js
 */

import {
  classifyActivity,
  normalizeToMinutes,
  getUnitAbbr,
  buildNormalizedAnalysis,
  detectImbalancesNormalized,
  inferSportTraits,
} from "./coachNormalize.js";

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

function assertEqual(actual, expected, label) {
  if (actual === expected) {
    passed++;
    console.log(`  ✓ ${label}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${label} — expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

// --- classifyActivity ---
console.log("\nclassifyActivity:");
assertEqual(classifyActivity("Bench Press", "reps"), "strength", "bench press + reps → strength");
assertEqual(classifyActivity("Water Polo", "hrs"), "sport", "water polo + hrs → sport");
assertEqual(classifyActivity("Running", "miles"), "cardio", "running + miles → cardio");
assertEqual(classifyActivity("Plank", "sec"), "duration", "plank + sec → duration");
assertEqual(classifyActivity("Running", "reps"), "cardio", "running + reps → cardio (keyword)");
assertEqual(classifyActivity("Soccer Practice", "min"), "sport", "soccer + min → sport");
assertEqual(classifyActivity("Football Bar Bench Press", "reps"), "strength", "football in name but reps unit → strength");
assertEqual(classifyActivity("Yoga", "min"), "duration", "yoga + min → duration (no sport keyword)");
assertEqual(classifyActivity("Swimming", "yards"), "cardio", "swimming + yards → cardio (distance)");
assertEqual(classifyActivity("Some Custom Exercise", "custom"), "strength", "unknown unit → strength default");

// --- normalizeToMinutes ---
console.log("\nnormalizeToMinutes:");
assertEqual(normalizeToMinutes(1.5, "hrs"), 90, "1.5 hrs → 90 min");
assertEqual(normalizeToMinutes(30, "min"), 30, "30 min → 30 min");
assertEqual(normalizeToMinutes(120, "sec"), 2, "120 sec → 2 min");
assertEqual(normalizeToMinutes(10, "reps"), null, "reps → null");
assertEqual(normalizeToMinutes(5, "miles"), null, "miles → null");

// --- getUnitAbbr ---
console.log("\ngetUnitAbbr:");
assertEqual(getUnitAbbr("reps"), "reps", "reps → reps");
assertEqual(getUnitAbbr("miles"), "mi", "miles → mi");
assertEqual(getUnitAbbr("yards"), "yd", "yards → yd");
assertEqual(getUnitAbbr("hrs"), "hrs", "hrs → hrs");
assertEqual(getUnitAbbr("reps", "ea"), "ea", "custom abbr overrides");
assertEqual(getUnitAbbr(undefined), "reps", "undefined → reps (default)");

// --- inferSportTraits ---
console.log("\ninferSportTraits:");
const wpTraits = inferSportTraits("Water Polo");
assert(wpTraits !== null, "water polo returns traits");
assert(wpTraits.upperPush >= 0.5, "water polo has high upperPush");
assert(wpTraits.cardioLoad >= 0.7, "water polo has high cardioLoad");
assert(wpTraits.legLoad >= 0.5, "water polo has legLoad from locomotion");

const runTraits = inferSportTraits("Running");
assert(runTraits !== null, "running returns traits");
assert(runTraits.legLoad >= 0.7, "running has high legLoad");
assert(runTraits.cardioLoad >= 0.7, "running has high cardioLoad");
assert(runTraits.upperPush <= 0.1, "running has no upperPush");

const swimTraits = inferSportTraits("Swimming");
assert(swimTraits !== null, "swimming returns traits");
assert(swimTraits.upperPull >= 0.7, "swimming has high upperPull");
assert(swimTraits.upperPush >= 0.5, "swimming has upperPush");

const bbTraits = inferSportTraits("Basketball");
assert(bbTraits !== null, "basketball returns traits");
assert(bbTraits.explosiveness >= 0.7, "basketball has high explosiveness");
assert(bbTraits.legLoad >= 0.7, "basketball has high legLoad");

const climbTraits = inferSportTraits("Rock Climbing");
assert(climbTraits !== null, "climbing returns traits");
assert(climbTraits.gripLoad >= 0.8, "climbing has high gripLoad");
assert(climbTraits.upperPull >= 0.8, "climbing has high upperPull");

assert(inferSportTraits("Bench Press") === null, "non-sport returns null");
assert(inferSportTraits("") === null, "empty string returns null");
assert(inferSportTraits(null) === null, "null returns null");

// Multiple pattern matching — "sprint" matches both run and sprint rules
const sprintTraits = inferSportTraits("Sprint Training");
assert(sprintTraits !== null, "sprint returns traits");
assert(sprintTraits.explosiveness >= 0.7, "sprint has high explosiveness");
assert(sprintTraits.legLoad >= 0.7, "sprint has high legLoad");

// --- buildNormalizedAnalysis ---
console.log("\nbuildNormalizedAnalysis:");

const workouts = [
  {
    name: "Upper Body",
    exercises: [
      { id: "ex1", name: "Bench Press", unit: "reps" },
      { id: "ex2", name: "Pull Ups", unit: "reps" },
    ],
  },
  {
    name: "Sports",
    exercises: [
      { id: "ex3", name: "Water Polo", unit: "hrs" },
    ],
  },
  {
    name: "Cardio",
    exercises: [
      { id: "ex4", name: "Running", unit: "miles" },
    ],
  },
];

const logsByDate = {
  "2025-01-15": {
    ex1: { sets: [{ reps: 10, weight: 135 }, { reps: 8, weight: 155 }] },
    ex2: { sets: [{ reps: 10 }, { reps: 8 }] },
    ex3: { sets: [{ reps: 1.5 }] },
  },
  "2025-01-16": {
    ex4: { sets: [{ reps: 3.5 }] },
  },
};

const dateRange = { start: "2025-01-01", end: "2025-01-31" };
const analysis = buildNormalizedAnalysis(workouts, logsByDate, dateRange);

assert(!("UNCLASSIFIED" in analysis.muscleGroupVolume && analysis.muscleGroupVolume.UNCLASSIFIED > 18),
  "water polo NOT in muscleGroupVolume as reps");
assert(analysis.muscleGroupVolume.CHEST > 0, "bench press is in muscleGroupVolume");
assert(analysis.muscleGroupVolume.BACK > 0, "pull ups is in muscleGroupVolume");
assert(analysis.durationByActivity["Water Polo"] === 90, "water polo → 90 min in durationByActivity");
assert(analysis.sportFrequency["Water Polo"] === 1, "water polo has 1 session in sportFrequency");
assert(analysis.durationByActivity["Running"] === 3.5, "running → 3.5 in durationByActivity (original units)");
assertEqual(analysis.totalStrengthReps, 36, "totalStrengthReps = 10+8+10+8 = 36");

// muscleGroupSets: primary-only set counts
assert(analysis.muscleGroupSets.CHEST === 2, "bench press → 2 sets for CHEST (primary)");
assert(analysis.muscleGroupSets.BACK === 2, "pull ups → 2 sets for BACK (primary)");
assertEqual(analysis.totalStrengthSets, 4, "totalStrengthSets = 2 (bench) + 2 (pull ups) = 4");

// sportTraits from logged sport activities
assert(analysis.sportTraits !== null, "sport logs produce sportTraits");
assert(analysis.sportTraits.aggregated.cardioLoad >= 0.5, "sport traits include cardioLoad from water polo");
assert(analysis.sportTraits.aggregated.upperPush >= 0.5, "sport traits include upperPush from water polo");
assert(analysis.sportTraits.perSport["Water Polo"] != null, "perSport has Water Polo entry");
// Running (classified as cardio, not sport) should also get traits via durationByActivity
assert(analysis.sportTraits.perSport["Running"] != null, "perSport includes Running from cardio activities");
assert(analysis.sportTraits.perSport["Running"].legLoad >= 0.7, "Running trait has high legLoad");

// --- detectImbalancesNormalized ---
console.log("\ndetectImbalancesNormalized:");

// With small set count, should return empty
const smallAnalysis = buildNormalizedAnalysis(workouts, {
  "2025-01-15": { ex3: { sets: [{ reps: 2 }] } },
}, dateRange);
assertEqual(detectImbalancesNormalized(smallAnalysis).length, 0,
  "low sets → no insights (sport duration doesn't inflate threshold)");

// Sport duration shouldn't inflate thresholds
const sportHeavy = {
  muscleGroupSets: { CHEST: 12, BACK: 12, QUADS: 8, HAMSTRINGS: 8 },
  durationByActivity: { "Water Polo": 500 },
  sportFrequency: { "Water Polo": 5 },
  sportTraits: { perSport: { "Water Polo": { upperPush: 0.8, legLoad: 0.7, cardioLoad: 0.9 } }, aggregated: { upperPush: 0.8, upperPull: 0.5, legLoad: 0.7, cardioLoad: 0.9, coreRotation: 0.6, gripLoad: 0, impactStress: 0.5, explosiveness: 0.7 }, totalSportMinutes: 500, totalSportSessions: 5 },
  totalStrengthSets: 40,
};
const sportInsights = detectImbalancesNormalized(sportHeavy);
assert(!sportInsights.some((i) => i.type === "NEGLECTED" && i.message.includes("water polo")),
  "sport frequency doesn't trigger neglect warning");

// Sport trait-aware skip: swimming (high upperPull) should skip back neglect
const swimHeavy = {
  muscleGroupSets: { CHEST: 12, BACK: 0, QUADS: 8, HAMSTRINGS: 8, ANTERIOR_DELT: 4, POSTERIOR_DELT: 0 },
  durationByActivity: { "Swimming": 300 },
  sportFrequency: { "Swimming": 4 },
  sportTraits: { perSport: { "Swimming": { upperPull: 0.8 } }, aggregated: { upperPush: 0.6, upperPull: 0.8, legLoad: 0.5, coreRotation: 0.4, gripLoad: 0.2, impactStress: 0.1, explosiveness: 0.3, cardioLoad: 0.9 }, totalSportMinutes: 300, totalSportSessions: 4 },
  totalStrengthSets: 32,
};
const swimInsights = detectImbalancesNormalized(swimHeavy);
assert(!swimInsights.some((i) => i.type === "NEGLECTED" && i.title.toLowerCase().includes("back")),
  "sport with high upperPull trait skips back neglect warning");
assert(!swimInsights.some((i) => i.type === "NEGLECTED" && i.title.toLowerCase().includes("posterior delt")),
  "sport with high upperPull trait skips posterior delt neglect warning");

// Balanced strength → positive
const balanced = {
  muscleGroupSets: { CHEST: 10, BACK: 10, ANTERIOR_DELT: 4, POSTERIOR_DELT: 4, QUADS: 6, HAMSTRINGS: 6 },
  durationByActivity: {},
  sportFrequency: {},
  totalStrengthSets: 40,
};
const balancedInsights = detectImbalancesNormalized(balanced);
assert(balancedInsights.some((i) => i.type === "POSITIVE"), "balanced training → POSITIVE insight");

// Push/pull imbalance (sets-based)
const imbalanced = {
  muscleGroupSets: { CHEST: 15, ANTERIOR_DELT: 8, TRICEPS: 6, BACK: 3, POSTERIOR_DELT: 0, BICEPS: 2 },
  durationByActivity: {},
  sportFrequency: {},
  totalStrengthSets: 34,
};
const imbInsights = detectImbalancesNormalized(imbalanced);
assert(imbInsights.some((i) => i.type === "IMBALANCE"), "push-heavy → IMBALANCE insight");
assert(imbInsights[0].message.includes("push sets"), "imbalance message references sets");

// Neglected group with 0 sets shows correct message (balanced push/pull so imbalance doesn't fire first)
const neglected = {
  muscleGroupSets: { CHEST: 8, BACK: 0, ANTERIOR_DELT: 4, POSTERIOR_DELT: 4, BICEPS: 6, TRICEPS: 4, QUADS: 8, GLUTES: 4 },
  durationByActivity: {},
  sportFrequency: {},
  totalStrengthSets: 38,
};
const neglInsights = detectImbalancesNormalized(neglected);
assert(neglInsights.some((i) => i.type === "NEGLECTED"), "missing back → NEGLECTED insight");
assert(neglInsights.some((i) => i.message.includes("No direct back")), "0 sets → 'No direct' message");

// --- Summary ---
console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
