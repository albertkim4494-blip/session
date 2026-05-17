/**
 * Self-contained test script for stateUtils.js
 * Run with: node src/lib/stateUtils.test.js
 *
 * Provides an in-memory localStorage stub so the file's load/persist paths run in Node.
 */

// In-memory localStorage stub — must be installed before importing stateUtils.
const _store = new Map();
globalThis.localStorage = {
  getItem: (k) => (_store.has(k) ? _store.get(k) : null),
  setItem: (k, v) => { _store.set(k, String(v)); },
  removeItem: (k) => { _store.delete(k); },
  clear: () => { _store.clear(); },
  key: (i) => Array.from(_store.keys())[i] ?? null,
  get length() { return _store.size; },
};

const {
  normalizeState,
  makeDefaultState,
  findExerciseById,
  forEachExercise,
  safeParse,
  uid,
  loadState,
  persistState,
} = await import("./stateUtils.js");

const { LS_KEY } = await import("./constants.js");

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) { passed++; console.log(`  ✓ ${label}`); }
  else { failed++; console.error(`  ✗ FAIL: ${label}`); }
}

function assertEqual(actual, expected, label) {
  if (actual === expected) { passed++; console.log(`  ✓ ${label}`); }
  else {
    failed++;
    console.error(`  ✗ FAIL: ${label}`);
    console.error(`    expected: ${JSON.stringify(expected)}`);
    console.error(`    actual:   ${JSON.stringify(actual)}`);
  }
}

console.log("\n=== normalizeState: garbage input ===");
{
  const a = normalizeState(null);
  assert(a.program && Array.isArray(a.program.workouts), "null → returns default state");
  const b = normalizeState(undefined);
  assert(b.program && Array.isArray(b.program.workouts), "undefined → returns default state");
  const c = normalizeState("string");
  assert(c.program && Array.isArray(c.program.workouts), "non-object → returns default state");
  const d = normalizeState(42);
  assert(d.program && Array.isArray(d.program.workouts), "number → returns default state");
}

console.log("\n=== normalizeState: missing fields filled with defaults ===");
{
  const out = normalizeState({});
  assertEqual(typeof out.logsByDate, "object", "logsByDate present");
  assertEqual(typeof out.dailyWorkouts, "object", "dailyWorkouts present");
  assertEqual(typeof out.preferences, "object", "preferences present");
  assertEqual(out.preferences.theme, "dark", "default theme is dark");
  assertEqual(out.preferences.defaultRestSec, 90, "default rest is 90s");
  assert(Array.isArray(out.preferences.equipment), "equipment is array");
}

console.log("\n=== normalizeState: invalid theme is coerced to dark ===");
{
  const a = normalizeState({ preferences: { theme: "spring" } });
  assertEqual(a.preferences.theme, "dark", "retired theme 'spring' → dark");
  const b = normalizeState({ preferences: { theme: "neon-disco" } });
  assertEqual(b.preferences.theme, "dark", "unknown theme → dark");
  const c = normalizeState({ preferences: { theme: "light" } });
  assertEqual(c.preferences.theme, "light", "valid 'light' is preserved");
}

console.log("\n=== normalizeState: legacy equipment string is migrated to array ===");
{
  const a = normalizeState({ preferences: { equipment: "gym" } });
  assert(Array.isArray(a.preferences.equipment), "'gym' string becomes array");
  assert(a.preferences.equipment.includes("full_gym"), "'gym' maps to ['full_gym']");
  const b = normalizeState({ preferences: { equipment: "basic" } });
  assert(b.preferences.equipment.includes("dumbbell"), "'basic' includes dumbbell");
  const c = normalizeState({ preferences: { equipment: "unrecognized" } });
  assert(Array.isArray(c.preferences.equipment), "unrecognized string still becomes array");
  const d = normalizeState({ preferences: { equipment: 42 } });
  assert(Array.isArray(d.preferences.equipment), "non-string non-array becomes default array");
}

console.log("\n=== normalizeState: dailyWorkouts entries must be arrays ===");
{
  // Use today's date so the 30-day cleanup doesn't prune the valid entry.
  const today = new Date().toISOString().slice(0, 10);
  const out = normalizeState({
    dailyWorkouts: {
      [today]: [{ id: "w1", exercises: [] }],
      [`${today}_a`]: "not an array",
      [`${today}_b`]: { not: "an array" },
      [`${today}_c`]: null,
    },
  });
  assert(Array.isArray(out.dailyWorkouts[today]), "valid array entry preserved");
  assert(!(`${today}_a` in out.dailyWorkouts), "string entry filtered out");
  assert(!(`${today}_b` in out.dailyWorkouts), "object entry filtered out");
  assert(!(`${today}_c` in out.dailyWorkouts), "null entry filtered out");
}

console.log("\n=== normalizeState: workouts get default category and exercises array ===");
{
  const out = normalizeState({
    program: {
      workouts: [
        { id: "w1", name: "Test" }, // missing exercises + category
        { id: "w2", name: "OK", category: "  ", exercises: null }, // blank category, null ex
        { id: "w3", name: "Real", category: "Push", exercises: [{ id: "e1" }] },
      ],
    },
  });
  assertEqual(out.program.workouts.length, 3, "all three workouts kept");
  assert(Array.isArray(out.program.workouts[0].exercises), "missing exercises → []");
  assertEqual(out.program.workouts[0].category, "Workout", "missing category → 'Workout'");
  assertEqual(out.program.workouts[1].category, "Workout", "blank category → 'Workout'");
  assertEqual(out.program.workouts[2].category, "Push", "valid category preserved");
}

console.log("\n=== normalizeState: meta timestamps preserved when valid ===");
{
  const out = normalizeState({ meta: { createdAt: 1000, updatedAt: 2000 } });
  assertEqual(out.meta.createdAt, 1000, "createdAt preserved");
  assertEqual(out.meta.updatedAt, 2000, "updatedAt preserved");
  const fresh = normalizeState({});
  assert(typeof fresh.meta.createdAt === "number", "missing createdAt filled with number");
  assertEqual(fresh.meta.updatedAt, 0, "missing updatedAt defaults to 0");
}

console.log("\n=== normalizeState: cleans session* entries older than 30 days ===");
{
  // Pick an obviously-old date and a fresh date relative to today.
  const old = "2020-01-01";
  const today = new Date().toISOString().slice(0, 10);
  const out = normalizeState({
    sessionOverrides: { [old]: { x: 1 }, [today]: { y: 1 } },
    todaySessions: { [old]: { x: 1 }, [today]: { y: 1 } },
    todayDismissed: { [old]: true, [today]: true },
    sessionAdditions: { [old]: {}, [today]: {} },
    dailyWorkouts: { [old]: [], [today]: [] },
  });
  assert(!(old in out.sessionOverrides), "old sessionOverrides pruned");
  assert(today in out.sessionOverrides, "today sessionOverrides kept");
  assert(!(old in out.todaySessions), "old todaySessions pruned");
  assert(!(old in out.todayDismissed), "old todayDismissed pruned");
  assert(!(old in out.sessionAdditions), "old sessionAdditions pruned");
  assert(!(old in out.dailyWorkouts), "old dailyWorkouts pruned");
}

console.log("\n=== normalizeState: legacy preferences.exerciseCategories stripped ===");
{
  const out = normalizeState({
    preferences: { exerciseCategories: { foo: "bar" } },
  });
  assert(!("exerciseCategories" in out.preferences), "legacy field removed");
}

console.log("\n=== normalizeState: migrateCompletedFlag stamps past data, leaves today alone ===");
{
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const out = normalizeState({
    logsByDate: {
      [yesterday]: { ex1: { sets: [{ reps: 5 }, { reps: 0 }, { reps: 3, completed: false }] } },
      [today]: { ex1: { sets: [{ reps: 5 }, { reps: 0 }] } },
    },
  });
  assertEqual(out.logsByDate[yesterday].ex1.sets[0].completed, true, "past set with reps > 0 stamped completed");
  assertEqual(out.logsByDate[yesterday].ex1.sets[1].completed, false, "past set with reps 0 stamped not-completed");
  assertEqual(out.logsByDate[yesterday].ex1.sets[2].completed, false, "explicit completed:false preserved");
  assertEqual(out.logsByDate[today].ex1.sets[0].completed, false, "today's data never auto-stamped completed");
  assertEqual(out.logsByDate[today].ex1.sets[1].completed, false, "today's zero-rep stays not-completed");
}

console.log("\n=== findExerciseById: searches program, daily, additions, swap overrides ===");
{
  const state = {
    program: { workouts: [{ exercises: [{ id: "p1", name: "Program" }] }] },
    dailyWorkouts: { "2026-01-01": [{ exercises: [{ id: "d1", name: "Daily" }] }] },
    sessionAdditions: { "2026-01-02": { w1: [{ id: "a1", name: "Added" }] } },
    sessionOverrides: {
      "2026-01-03": {
        w1: {
          oldEx: { type: "swap", replacement: { id: "s1", name: "Swapped" } },
        },
      },
    },
  };
  assertEqual(findExerciseById(state, "p1")?.name, "Program", "found in program");
  assertEqual(findExerciseById(state, "d1")?.name, "Daily", "found in dailyWorkouts");
  assertEqual(findExerciseById(state, "a1")?.name, "Added", "found in sessionAdditions");
  assertEqual(findExerciseById(state, "s1")?.name, "Swapped", "found in swap replacement");
  assertEqual(findExerciseById(state, "nope"), null, "not-found returns null");
}

console.log("\n=== forEachExercise: visits every location ===");
{
  const state = {
    program: { workouts: [{ exercises: [{ id: "p1" }] }] },
    dailyWorkouts: { d: [{ exercises: [{ id: "d1" }] }] },
    sessionAdditions: { x: { w: [{ id: "a1" }] } },
    sessionOverrides: { z: { w: { e: { type: "swap", replacement: { id: "s1" } } } } },
  };
  const seen = new Set();
  forEachExercise(state, (ex) => seen.add(ex.id));
  assert(seen.has("p1") && seen.has("d1") && seen.has("a1") && seen.has("s1"), "visits all four exercises");
}

console.log("\n=== forEachExercise: tolerates missing collections ===");
{
  let crashed = false;
  try {
    forEachExercise({}, () => {});
    forEachExercise({ program: null, dailyWorkouts: null }, () => {});
  } catch { crashed = true; }
  assert(!crashed, "no crash on missing collections");
}

console.log("\n=== safeParse ===");
{
  assertEqual(safeParse('{"a":1}', null).a, 1, "parses valid JSON");
  assertEqual(safeParse("not json", "fallback"), "fallback", "returns fallback on invalid");
  assertEqual(safeParse("null", "fallback"), "fallback", "returns fallback when parsed value is null");
}

console.log("\n=== uid ===");
{
  const a = uid();
  const b = uid();
  assert(a !== b, "two calls return different ids");
  assert(a.startsWith("id_"), "default prefix is 'id'");
  assert(uid("ex").startsWith("ex_"), "custom prefix honored");
}

console.log("\n=== persistState / loadState round-trip ===");
{
  _store.clear();
  const a = makeDefaultState();
  a.logsByDate["2026-05-01"] = { ex1: { sets: [{ reps: 5, completed: true }] } };
  const result = persistState(a);
  assert(result.success, "persist returns success");
  const b = loadState();
  assertEqual(b.logsByDate["2026-05-01"].ex1.sets[0].reps, 5, "round-tripped reps");
  assertEqual(b.logsByDate["2026-05-01"].ex1.sets[0].completed, true, "round-tripped completed flag");
}

console.log("\n=== loadState: empty localStorage returns default state ===");
{
  _store.clear();
  const s = loadState();
  assert(s.program && Array.isArray(s.program.workouts), "default state when no key");
  assert(s.program.workouts.length > 0, "default state has seed workouts");
}

console.log("\n=== loadState: corrupted JSON returns default state ===");
{
  _store.clear();
  _store.set(LS_KEY, "{not json");
  const s = loadState();
  assert(s.program && Array.isArray(s.program.workouts), "corrupted store → defaults");
}

console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
