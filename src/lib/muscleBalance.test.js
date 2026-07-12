// Tests for muscleBalance.js — plain Node.js test script

const { buildMuscleBalance } = await import("./muscleBalance.js");
const { classifyExerciseMuscles } = await import("./coachNormalize.js");

let passed = 0;
let failed = 0;
function assert(cond, msg) {
  if (cond) { passed++; }
  else { failed++; console.error("FAIL:", msg); }
}
const done = (weight, reps) => ({ weight, reps, completed: true });
const get = (arr, group) => arr.find((x) => x.group === group);

const workouts = [{
  id: "w1",
  exercises: [
    { id: "bench", name: "Bench Press", unit: "reps" },
    { id: "row", name: "Barbell Row", unit: "reps" },
    { id: "run", name: "Treadmill", unit: "distance" },
    { id: "curl", name: "Bicep Curl", unit: "reps", catalogId: "cat_curl" },
  ],
}];

const logs = {
  "2026-01-01": {
    bench: { sets: [done(100, 5), done(100, 5), done(100, 5)] }, // 3 sets → CHEST
    row: { sets: [done(80, 8), done(80, 8)] },                    // 2 sets → BACK
    run: { sets: [done("", 30)] },                                // ignored (distance)
  },
};

// catalog: bicep curl → primary BICEPS (ARMS), secondary FOREARMS (ARMS same group)
const catalogMap = new Map([
  ["cat_curl", { muscles: { primary: ["BICEPS"], secondary: ["FOREARMS"] } }],
]);

const bal = buildMuscleBalance(logs, workouts, null, null, catalogMap, classifyExerciseMuscles);

assert(bal.length === 6, `all 6 UI groups returned (got ${bal.length})`);
assert(get(bal, "CHEST").sets === 3, `chest = 3 sets (got ${get(bal, "CHEST").sets})`);
assert(get(bal, "BACK").sets === 2, `back = 2 sets (got ${get(bal, "BACK").sets})`);
assert(get(bal, "LEGS").sets === 0, "legs = 0 (untrained group still present)");
assert(get(bal, "SHOULDERS").sets === 0, "shoulders = 0");

// keyword fallback classifies "Barbell Row" → BACK without a catalog entry
assert(get(bal, "BACK").sets > 0, "keyword fallback classified row as BACK");

// distance exercise ignored (no group inflation from cardio)
const totalSets = bal.reduce((s, x) => s + x.sets, 0);
assert(totalSets === 5, `only strength sets counted: 3+2 (got ${totalSets})`);

// --- secondary weighting + dedup within a UI group ---
const curlLogs = { "2026-02-01": { curl: { sets: [done(30, 10), done(30, 10)] } } };
const cbal = buildMuscleBalance(curlLogs, workouts, null, null, catalogMap, classifyExerciseMuscles);
// BICEPS (primary) + FOREARMS (secondary) both map to ARMS; dedup → primary wins,
// ARMS gets 2 (full), not 2 + 1.
assert(get(cbal, "ARMS").sets === 2, `arms deduped to primary weight (got ${get(cbal, "ARMS").sets})`);

// --- range filter ---
const ranged = buildMuscleBalance(logs, workouts, "2026-02-01", "2026-02-28", catalogMap, classifyExerciseMuscles);
assert(ranged.every((x) => x.sets === 0), "range filter excludes out-of-range logs");

// --- incomplete sets ignored ---
const incLogs = { "2026-03-01": { bench: { sets: [{ weight: 100, reps: 5, completed: false }] } } };
const incBal = buildMuscleBalance(incLogs, workouts, null, null, catalogMap, classifyExerciseMuscles);
assert(get(incBal, "CHEST").sets === 0, "incomplete sets not counted");

// --- edge cases ---
assert(buildMuscleBalance(null, workouts).every((x) => x.sets === 0), "null logs → all zero");
assert(buildMuscleBalance(logs, []).every((x) => x.sets === 0), "no workout info → all zero");

// --- Done ---
console.log(`${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
