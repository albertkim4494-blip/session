/**
 * Tests for workoutGenerator.js
 * Run with: node src/lib/workoutGenerator.test.js
 */

import { EXERCISE_CATALOG } from "./exerciseCatalog.js";
import {
  generateProgram,
  generateTodayWorkout,
  analyzeMuscleRecency,
  getSetRepScheme,
  parseScheme,
  GOALS,
  SET_REP_SCHEMES,
} from "./workoutGenerator.js";

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

// --- Split layout selection ---
console.log("\ngenerateProgram — split layouts:");

for (const days of [2, 3, 4, 5, 6]) {
  const result = generateProgram({
    goal: "Build Muscle",
    daysPerWeek: days,
    equipment: "gym",
    duration: 60,
    catalog: EXERCISE_CATALOG,
  });
  assertEqual(result.workouts.length, days, `${days}-day split produces ${days} workouts`);
}

// --- Exercise count by duration ---
console.log("\ngenerateProgram — exercise counts by duration:");

for (const [dur, minExpect, maxExpect] of [[30, 3, 5], [45, 5, 7], [60, 7, 10], [90, 10, 13]]) {
  const result = generateProgram({
    goal: "Build Muscle",
    daysPerWeek: 3,
    equipment: "gym",
    duration: dur,
    catalog: EXERCISE_CATALOG,
  });
  const counts = result.workouts.map((w) => w.exercises.length);
  const max = Math.max(...counts);
  const min = Math.min(...counts);
  assert(min >= 3, `${dur}min: min exercises >= 3 (got ${min})`);
  assert(max <= maxExpect, `${dur}min: max exercises <= ${maxExpect} (got ${max})`);
}

// --- Equipment filtering ---
console.log("\ngenerateProgram — equipment filtering:");

const homeResult = generateProgram({
  goal: "General Fitness",
  daysPerWeek: 3,
  equipment: "home",
  duration: 45,
  catalog: EXERCISE_CATALOG,
});

const homeExercises = homeResult.workouts.flatMap((w) => w.exercises);
const catalogById = new Map(EXERCISE_CATALOG.map((e) => [e.id, e]));

for (const ex of homeExercises) {
  const entry = catalogById.get(ex.catalogId);
  assert(entry !== undefined, `Home exercise "${ex.name}" has valid catalogId`);
  if (entry) {
    const hasBodyweight = entry.equipment.length === 0 || entry.equipment.includes("bodyweight");
    assert(hasBodyweight, `Home exercise "${ex.name}" is bodyweight-compatible`);
  }
}

// --- All generated exercises have catalogId ---
console.log("\ngenerateProgram — catalogId linking:");

const fullResult = generateProgram({
  goal: "Build Muscle",
  daysPerWeek: 4,
  equipment: "gym",
  duration: 60,
  catalog: EXERCISE_CATALOG,
});

const allExercises = fullResult.workouts.flatMap((w) => w.exercises);
assert(allExercises.length > 0, "generated exercises exist");
for (const ex of allExercises) {
  assert(!!ex.catalogId, `exercise "${ex.name}" has catalogId`);
  assert(catalogById.has(ex.catalogId), `exercise "${ex.name}" catalogId exists in catalog`);
}

// --- Deduplication within a workout ---
console.log("\ngenerateProgram — deduplication:");

for (const w of fullResult.workouts) {
  const ids = w.exercises.map((e) => e.catalogId);
  const unique = new Set(ids);
  assertEqual(ids.length, unique.size, `workout "${w.name}" has no duplicate exercises`);
}

// --- Set/rep scheme lookup ---
console.log("\ngetSetRepScheme:");

assertEqual(getSetRepScheme("Build Muscle"), "4x8-12", "Build Muscle scheme");
assertEqual(getSetRepScheme("Get Stronger"), "4x3-5", "Get Stronger scheme");
assertEqual(getSetRepScheme("Lose Fat"), "3x15-20", "Lose Fat scheme");
assertEqual(getSetRepScheme("General Fitness"), "3x10-12", "General Fitness scheme");
assertEqual(getSetRepScheme("Unknown Goal"), "3x10", "unknown goal falls back to 3x10");

// --- analyzeMuscleRecency ---
console.log("\nanalyzeMuscleRecency:");

const testState = {
  program: {
    workouts: [
      {
        id: "w1",
        exercises: [
          { id: "ex1", name: "Barbell Bench Press", unit: "reps", catalogId: "edb-EIeI8Vf" },
          { id: "ex2", name: "Barbell Full Squat", unit: "reps", catalogId: "edb-qXTaZnJ" },
        ],
      },
    ],
  },
  logsByDate: {
    "2025-01-10": { ex1: { sets: [{ reps: 10, weight: 135 }] } },
    "2025-01-15": { ex2: { sets: [{ reps: 8, weight: 185 }] } },
    "2025-01-18": { ex1: { sets: [{ reps: 10, weight: 140 }] } },
  },
};

const recency = analyzeMuscleRecency(testState, EXERCISE_CATALOG);
assertEqual(recency.CHEST, "2025-01-18", "CHEST last trained on Jan 18");
assertEqual(recency.QUADS, "2025-01-15", "QUADS last trained on Jan 15");
assertEqual(recency.BICEPS, null, "BICEPS never trained");

// --- generateTodayWorkout ---
console.log("\ngenerateTodayWorkout:");

const todayWorkout = generateTodayWorkout({
  state: testState,
  equipment: "gym",
  profile: { goal: "Build Muscle" },
  catalog: EXERCISE_CATALOG,
  todayKey: "2025-01-20",
});

assert(todayWorkout.id, "today workout has id");
assert(todayWorkout.name, "today workout has name");
assert(todayWorkout.exercises.length >= 3, `today workout has >= 3 exercises (got ${todayWorkout.exercises.length})`);
assert(todayWorkout.targetMuscles.length > 0, "today workout has target muscles");

// With the squat covering QUADS/GLUTES/HAMSTRINGS/CALVES/ABS, stale muscles include
// BICEPS, FOREARMS, OBLIQUES, LATERAL_DELT, POSTERIOR_DELT, etc.
const staleMuscles = ["BICEPS", "FOREARMS", "OBLIQUES", "LATERAL_DELT", "POSTERIOR_DELT"];
assert(
  todayWorkout.targetMuscles.some((m) => staleMuscles.includes(m)),
  "today workout targets stale muscles"
);

for (const ex of todayWorkout.exercises) {
  assert(!!ex.catalogId, `today exercise "${ex.name}" has catalogId`);
}

// --- Regeneration produces variety ---
console.log("\ngenerateProgram — variety on regeneration:");

const run1 = generateProgram({
  goal: "Build Muscle", daysPerWeek: 3, equipment: "gym",
  duration: 60, catalog: EXERCISE_CATALOG,
});
const run2 = generateProgram({
  goal: "Build Muscle", daysPerWeek: 3, equipment: "gym",
  duration: 60, catalog: EXERCISE_CATALOG,
});
assert(run1.workouts.length === 3 && run2.workouts.length === 3, "both runs produce 3 workouts");

// --- parseScheme ---
console.log("\nparseScheme:");
assertEqual(parseScheme("3x8-12").sets, 3, "3x8-12 → 3 sets");
assertEqual(parseScheme("3x8-12").reps, 8, "3x8-12 → 8 reps");
assertEqual(parseScheme("4x5").sets, 4, "4x5 → 4 sets");
assertEqual(parseScheme("4x5").reps, 5, "4x5 → 5 reps");
assertEqual(parseScheme("5x3-5").sets, 5, "5x3-5 → 5 sets");
assertEqual(parseScheme(null), null, "null → null");
assertEqual(parseScheme(""), null, "empty → null");
assertEqual(parseScheme("invalid"), null, "invalid → null");

// --- Generated workouts have scheme ---
console.log("\ngenerated workouts have scheme:");
const schemeResult = generateProgram({
  goal: "Build Muscle", daysPerWeek: 3, equipment: "gym",
  duration: 60, catalog: EXERCISE_CATALOG,
});
for (const w of schemeResult.workouts) {
  assertEqual(w.scheme, "4x8-12", `workout "${w.name}" has scheme 4x8-12`);
}
const todayScheme = generateTodayWorkout({
  state: testState, equipment: "gym", profile: { goal: "Build Muscle" },
  catalog: EXERCISE_CATALOG, todayKey: "2025-01-20",
});
assert(!!todayScheme.scheme, "today workout has scheme");

// --- Constant exports ---
console.log("\nconstant exports:");
assertEqual(GOALS.length, 5, "5 goals exported");
assert(Object.keys(SET_REP_SCHEMES).length === 5, "5 scheme entries");

// --- Summary ---
console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
