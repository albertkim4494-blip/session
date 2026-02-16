import assert from "node:assert";
import {
  UI_MUSCLE_GROUPS,
  UI_GROUP_CONFIG,
  muscleToUiGroup,
  getUiGroupForMuscle,
  getMusclesForUiGroup,
  getUiGroupsForExercise,
} from "./muscleGroups.js";

let passed = 0;
function test(name, fn) {
  fn();
  passed++;
  console.log(`  \u2713 ${name}`);
}

// --- muscleToUiGroup completeness ---
console.log("muscleToUiGroup:");

const ALL_MUSCLES = [
  "ABS", "ANTERIOR_DELT", "BACK", "BICEPS", "CALVES", "CHEST",
  "FOREARMS", "GLUTES", "HAMSTRINGS", "LATERAL_DELT", "OBLIQUES",
  "POSTERIOR_DELT", "QUADS", "TRICEPS",
];

test("all 14 muscles are mapped", () => {
  for (const m of ALL_MUSCLES) {
    assert(muscleToUiGroup[m], `${m} should be mapped`);
  }
  assert.strictEqual(Object.keys(muscleToUiGroup).length, 14);
});

// --- getUiGroupForMuscle ---
console.log("\ngetUiGroupForMuscle:");

test("ABS → CORE", () => assert.strictEqual(getUiGroupForMuscle("ABS"), "CORE"));
test("OBLIQUES → CORE", () => assert.strictEqual(getUiGroupForMuscle("OBLIQUES"), "CORE"));
test("ANTERIOR_DELT → SHOULDERS", () => assert.strictEqual(getUiGroupForMuscle("ANTERIOR_DELT"), "SHOULDERS"));
test("LATERAL_DELT → SHOULDERS", () => assert.strictEqual(getUiGroupForMuscle("LATERAL_DELT"), "SHOULDERS"));
test("POSTERIOR_DELT → SHOULDERS", () => assert.strictEqual(getUiGroupForMuscle("POSTERIOR_DELT"), "SHOULDERS"));
test("BICEPS → ARMS", () => assert.strictEqual(getUiGroupForMuscle("BICEPS"), "ARMS"));
test("TRICEPS → ARMS", () => assert.strictEqual(getUiGroupForMuscle("TRICEPS"), "ARMS"));
test("FOREARMS → ARMS", () => assert.strictEqual(getUiGroupForMuscle("FOREARMS"), "ARMS"));
test("QUADS → LEGS", () => assert.strictEqual(getUiGroupForMuscle("QUADS"), "LEGS"));
test("HAMSTRINGS → LEGS", () => assert.strictEqual(getUiGroupForMuscle("HAMSTRINGS"), "LEGS"));
test("GLUTES → LEGS", () => assert.strictEqual(getUiGroupForMuscle("GLUTES"), "LEGS"));
test("CALVES → LEGS", () => assert.strictEqual(getUiGroupForMuscle("CALVES"), "LEGS"));
test("CHEST → CHEST", () => assert.strictEqual(getUiGroupForMuscle("CHEST"), "CHEST"));
test("BACK → BACK", () => assert.strictEqual(getUiGroupForMuscle("BACK"), "BACK"));
test("unknown → null", () => assert.strictEqual(getUiGroupForMuscle("UNKNOWN"), null));

// --- getMusclesForUiGroup (inverse) ---
console.log("\ngetMusclesForUiGroup:");

test("CORE includes ABS and OBLIQUES", () => {
  const muscles = getMusclesForUiGroup("CORE");
  assert(muscles.includes("ABS"));
  assert(muscles.includes("OBLIQUES"));
  assert.strictEqual(muscles.length, 2);
});

test("SHOULDERS includes all 3 delts", () => {
  const muscles = getMusclesForUiGroup("SHOULDERS");
  assert(muscles.includes("ANTERIOR_DELT"));
  assert(muscles.includes("LATERAL_DELT"));
  assert(muscles.includes("POSTERIOR_DELT"));
  assert.strictEqual(muscles.length, 3);
});

test("LEGS includes QUADS, HAMSTRINGS, GLUTES, CALVES", () => {
  const muscles = getMusclesForUiGroup("LEGS");
  assert.strictEqual(muscles.length, 4);
  assert(muscles.includes("QUADS"));
  assert(muscles.includes("GLUTES"));
});

test("unknown group → empty array", () => {
  assert.deepStrictEqual(getMusclesForUiGroup("UNKNOWN"), []);
});

// --- getUiGroupsForExercise ---
console.log("\ngetUiGroupsForExercise:");

test("bench press → CHEST, SHOULDERS, ARMS", () => {
  const groups = getUiGroupsForExercise(["CHEST"], ["ANTERIOR_DELT", "TRICEPS"]);
  assert.deepStrictEqual(groups, ["SHOULDERS", "ARMS", "CHEST"]);
});

test("squat → CORE, LEGS", () => {
  const groups = getUiGroupsForExercise(["QUADS", "GLUTES"], ["ABS", "HAMSTRINGS"]);
  assert.deepStrictEqual(groups, ["CORE", "LEGS"]);
});

test("deadlift → LEGS, BACK", () => {
  const groups = getUiGroupsForExercise(["BACK", "GLUTES", "HAMSTRINGS"], ["FOREARMS"]);
  assert.deepStrictEqual(groups, ["ARMS", "LEGS", "BACK"]);
});

test("empty muscles → empty groups", () => {
  assert.deepStrictEqual(getUiGroupsForExercise([], []), []);
});

test("null muscles → empty groups", () => {
  assert.deepStrictEqual(getUiGroupsForExercise(null, null), []);
});

test("no duplicates when same group in primary and secondary", () => {
  const groups = getUiGroupsForExercise(["CHEST"], ["CHEST"]);
  assert.deepStrictEqual(groups, ["CHEST"]);
});

test("stable ordering matches UI_MUSCLE_GROUPS", () => {
  const groups = getUiGroupsForExercise(
    ["BACK", "BICEPS", "ABS"],
    ["QUADS"]
  );
  // Expected order: CORE, ARMS, LEGS, BACK
  assert.deepStrictEqual(groups, ["CORE", "ARMS", "LEGS", "BACK"]);
});

// --- UI_MUSCLE_GROUPS ---
console.log("\nUI_MUSCLE_GROUPS:");

test("6 groups defined", () => assert.strictEqual(UI_MUSCLE_GROUPS.length, 6));

test("all groups have config with label and muscles", () => {
  for (const g of UI_MUSCLE_GROUPS) {
    assert(UI_GROUP_CONFIG[g], `${g} has config`);
    assert(UI_GROUP_CONFIG[g].label, `${g} has label`);
    assert(UI_GROUP_CONFIG[g].muscles.length > 0, `${g} has muscles`);
  }
});

console.log(`\n${passed} tests: ${passed} passed, 0 failed`);
