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
  totalStrengthSets: 40,
};
const sportInsights = detectImbalancesNormalized(sportHeavy);
assert(!sportInsights.some((i) => i.type === "NEGLECTED" && i.message.includes("water polo")),
  "sport frequency doesn't trigger neglect warning");

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
